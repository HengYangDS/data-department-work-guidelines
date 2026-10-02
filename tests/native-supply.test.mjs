import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import {
  assertAssetDigest,
  downloadAsset,
  gitlabPackageRequest,
  install,
  manifest,
  safeArchiveEntries,
  selectedAsset,
} from "../tools/ci/install-native.mjs";
import {
  managedFileExists,
  nativeToolBinary,
  root,
} from "../tools/docs/runtime.mjs";

test("official supply declares exactly the qualified host assets", () => {
  assert.deepEqual(Object.keys(manifest.tools.lychee.assets).sort(), [
    "darwin-arm64",
    "darwin-x64",
    "linux-arm64",
    "linux-x64",
    "win32-x64",
  ]);
  for (const [key, asset] of Object.entries(manifest.tools.lychee.assets)) {
    assert.match(asset.sha256, /^[0-9a-f]{64}$/u);
    assert.ok(
      selectedAsset("lychee", ...key.split("-")).url.endsWith(asset.name),
    );
  }
  assert.deepEqual(Object.keys(manifest.tools.lychee.licenses).sort(), [
    "LICENSE-APACHE",
    "LICENSE-MIT",
  ]);
  for (const license of Object.values(manifest.tools.lychee.licenses)) {
    assert.match(license.sha256, /^[0-9a-f]{64}$/u);
    assert.match(license.source, /lychee-v0\.24\.2/u);
  }
  assert.throws(
    () => selectedAsset("lychee", "win32", "arm64"),
    /unsupported/u,
  );
});

test("asset digest is checked before extraction", () => {
  const bytes = Buffer.from("bounded fixture");
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  assert.doesNotThrow(() =>
    assertAssetDigest(bytes, { name: "fixture", sha256 }),
  );
  assert.throws(
    () => assertAssetDigest(bytes, { name: "fixture", sha256: "0".repeat(64) }),
    /digest mismatch/u,
  );
});

test("archive listing rejects traversal and absolute paths", () => {
  assert.deepEqual(
    safeArchiveEntries(
      "lychee-linux/lychee\n",
      "-rwxr-xr-x 0/0 10 lychee-linux/lychee\n",
    ),
    ["lychee-linux/lychee"],
  );
  for (const member of [
    "../lychee",
    "/tmp/lychee",
    "C:/outside/lychee",
    "bin\\..\\outside",
  ]) {
    assert.throws(
      () => safeArchiveEntries(`${member}\n`, `-rwxr-xr-x 0/0 10 ${member}\n`),
      /unsafe/u,
    );
  }
});

test("print-spec is read-only and selects this host", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-native.mjs", "lychee", "--print-spec"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const spec = JSON.parse(result.stdout);
  assert.equal(spec.key, `${process.platform}-${process.arch}`);
  assert.equal(spec.sha256, manifest.tools.lychee.assets[spec.key].sha256);
});

test("GitLab package request stays on its own CI API with header-only identity", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  const request = gitlabPackageRequest("lychee", asset, {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  });
  assert.equal(
    request.url,
    "https://gitlab.example.test/api/v4/projects/42/packages/generic/lychee/0.24.2/lychee-aarch64-unknown-linux-gnu.tar.gz",
  );
  assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
  assert.equal(request.redirect, "error");
  assert.doesNotMatch(request.url, /fixture-only|github\.com/u);
});

test("GitLab package request refuses missing or untrusted CI inputs", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  const valid = {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  };
  for (const changed of [
    { CI_API_V4_URL: "" },
    { CI_API_V4_URL: "https://user:pass@gitlab.example.test/api/v4" },
    { CI_API_V4_URL: "https://gitlab.example.test/other" },
    { CI_API_V4_URL: "ftp://gitlab.example.test/api/v4" },
    { CI_PROJECT_ID: "42/other" },
    { CI_JOB_TOKEN: "" },
  ]) {
    assert.throws(() =>
      gitlabPackageRequest("lychee", asset, { ...valid, ...changed }),
    );
  }
});

test("authenticated package download refuses redirects before forwarding identity", async (context) => {
  const calls = [];
  let response = new Response("bounded asset");
  context.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return response;
  });
  const request = {
    url: "https://fixture.invalid/asset",
    headers: { "JOB-TOKEN": "fixture-only" },
    redirect: "error",
  };
  assert.equal((await downloadAsset(request)).toString(), "bounded asset");
  assert.equal(calls[0].url, request.url);
  assert.deepEqual(calls[0].options.headers, request.headers);
  assert.equal(calls[0].options.redirect, "error");
  assert.doesNotMatch(calls[0].url, /fixture-only/u);
  response = new Response(null, {
    status: 302,
    headers: { Location: "https://fixture.invalid/other" },
  });
  await assert.rejects(downloadAsset(request), /HTTP 302/u);
  assert.equal(calls.length, 2);
});

test("GitLab CLI mode fails closed without CI identity", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-native.mjs", "lychee", "--gitlab-package"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
      env: {
        ...process.env,
        CI_API_V4_URL: "",
        CI_PROJECT_ID: "",
        CI_JOB_TOKEN: "",
      },
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GitLab CI API URL/u);
  assert.doesNotMatch(result.stderr, /github\.com/u);
});

test("installer cleanup uses bounded native retries on its own temporary stage", async (context) => {
  const remove = fsPromises.rm;
  const calls = [];
  let removed = false;
  const mock = context.mock.method(
    fsPromises,
    "rm",
    async (target, options) => {
      calls.push({ target, options });
      await remove(target, options);
      removed = true;
    },
  );
  syncBuiltinESMExports();
  context.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  try {
    await assert.rejects(
      install({ tool: "lychee", downloadSource: "github" }),
      /HTTP 503/u,
    );
    assert.equal(calls.length, 1);
    assert.equal(
      path.dirname(calls[0].target),
      path.join(
        root,
        "build",
        "runtime",
        "tool-cache",
        "lychee",
        manifest.tools.lychee.version,
        selectedAsset("lychee").key,
      ),
    );
    assert.match(path.basename(calls[0].target), /^\.install-/u);
    assert.deepEqual(calls[0].options, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200,
    });
    assert.equal(removed, true);
    assert.equal(fs.existsSync(calls[0].target), false);
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
  }
});

test("persistent native installer cleanup errors remain failures", async (context) => {
  let temporary;
  const failure = Object.assign(
    new Error("fixture cleanup permission denied"),
    {
      code: "EPERM",
    },
  );
  const mock = context.mock.method(fsPromises, "rm", async (target) => {
    temporary = target;
    throw failure;
  });
  syncBuiltinESMExports();
  context.mock.method(
    globalThis,
    "fetch",
    async () => new Response(null, { status: 503 }),
  );
  try {
    await assert.rejects(
      install({ tool: "lychee", downloadSource: "github" }),
      (error) => error === failure,
    );
    assert.match(path.basename(temporary), /^\.install-/u);
    assert.equal(fs.existsSync(temporary), true);
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    if (temporary)
      await fsPromises.rm(temporary, { recursive: true, force: true });
  }
});

test("one supply manifest declares Vale and lychee without a retired entry", () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(Object.keys(manifest.tools), ["lychee", "vale"]);
  const vale = manifest.tools.vale;
  assert.deepEqual(Object.keys(vale.assets).sort(), [
    "darwin-arm64",
    "darwin-x64",
    "linux-arm64",
    "linux-x64",
    "win32-arm64",
    "win32-x64",
  ]);
  for (const [key, asset] of Object.entries(vale.assets)) {
    const selected = selectedAsset("vale", ...key.split("-"));
    assert.equal(selected.sha256, asset.sha256);
    assert.match(selected.url, /vale-cli\/vale/u);
  }
  assert.deepEqual(Object.keys(vale.licenses), ["LICENSE"]);
  assert.match(vale.licenses.LICENSE.sha256, /^[0-9a-f]{64}$/u);
  assert.throws(() => selectedAsset("unknown"), /unknown/u);
  assert.throws(
    () => selectedAsset("vale", "linux", "riscv64"),
    /unsupported/u,
  );
  assert.equal(
    fs.existsSync(path.join(root, ".config/tools/lychee.json")),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(root, "tools/ci/install-lychee.mjs")),
    false,
  );
});

test("native extraction rejects links, duplicates, empty and unpaired listings", () => {
  assert.deepEqual(
    safeArchiveEntries("bin/vale\n", "-rwxr-xr-x 0/0 10 bin/vale\n"),
    ["bin/vale"],
  );
  for (const [names, verbose] of [
    ["", ""],
    ["vale\nvale\n", "-rwxr-xr-x 0/0 10 vale\n-rwxr-xr-x 0/0 10 vale\n"],
    ["vale\n", "lrwxr-xr-x 0/0 0 vale -> outside\n"],
    ["vale\n", "hrwxr-xr-x 0/0 0 vale link to outside\n"],
    ["vale\n", ""],
  ]) {
    assert.throws(
      () => safeArchiveEntries(names, verbose),
      /unsafe|incomplete|regular/u,
    );
  }
});

test("native tools do not download when supply is absent", async () => {
  await assert.rejects(
    install({ tool: "vale", assetFile: "fixture", downloadSource: "github" }),
    /one.*supply/u,
  );
});

test("an invalid supply source cannot reuse a cached native tool", async () => {
  await assert.rejects(
    install({ tool: "vale", downloadSource: "unrecognized" }),
    /invalid.*supply/u,
  );
});

test("managed files stay inside their selected repository boundary", () => {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-managed-file-"),
  );
  try {
    const repository = path.join(temporary, "repository");
    fs.mkdirSync(repository);
    const target = path.join(repository, "build/cache/tool.bin");
    assert.equal(managedFileExists(target, repository), false);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "existing pinned bytes");
    assert.equal(managedFileExists(target, repository), true);
    if (process.platform === "win32")
      assert.equal(
        managedFileExists(target.toUpperCase(), repository.toLowerCase()),
        true,
      );
    for (const outside of [
      repository,
      path.join(temporary, "repository-other/tool.bin"),
      path.join(repository, "../foreign.bin"),
    ])
      assert.throws(
        () => managedFileExists(outside, repository),
        /inside the repository/u,
      );
    assert.throws(
      () => managedFileExists(path.dirname(target), repository),
      /regular/u,
    );
    assert.throws(
      () => managedFileExists(path.join(target, "child.bin"), repository),
      /directory/u,
    );
    assert.equal(fs.readFileSync(target, "utf8"), "existing pinned bytes");
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("managed native caches reject links and non-regular entries before execution", async (context) => {
  const selected = selectedAsset("vale");
  const target = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
    selected.binaryName,
  );
  const actualExists = fs.existsSync;
  const actualStat = fs.lstatSync;
  const actualSpawn = childProcess.spawnSync;
  let executions = 0;
  for (const [exists, symbolicLink] of [
    [true, true],
    [false, true],
    [true, false],
  ]) {
    const mocks = [
      context.mock.method(fs, "existsSync", (file) =>
        file === target ? exists : actualExists(file),
      ),
      context.mock.method(fs, "lstatSync", (file, options) =>
        file === target
          ? { isFile: () => false, isSymbolicLink: () => symbolicLink }
          : actualStat(file, options),
      ),
      context.mock.method(
        childProcess,
        "spawnSync",
        (command, args, options) => {
          if (command !== target) return actualSpawn(command, args, options);
          executions += 1;
          return { status: 0, stdout: selected.versionOutput, stderr: "" };
        },
      ),
    ];
    syncBuiltinESMExports();
    try {
      await assert.rejects(install({ tool: "vale" }), /regular|symbolic/u);
      assert.throws(() => nativeToolBinary("vale"), /regular|symbolic/u);
      assert.equal(executions, 0);
    } finally {
      for (const mock of mocks) mock.mock.restore();
      syncBuiltinESMExports();
    }
  }
});

test("managed cache parent aliases fail before staging or execution", async (context) => {
  const selected = selectedAsset("vale");
  const directory = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
  );
  const actualStat = fs.lstatSync;
  let executions = 0;
  const mocks = [
    context.mock.method(fs, "lstatSync", (file, options) =>
      file === directory
        ? {
            isDirectory: () => true,
            isFile: () => false,
            isSymbolicLink: () => true,
          }
        : actualStat(file, options),
    ),
    context.mock.method(childProcess, "spawnSync", () => {
      executions += 1;
      return { status: 0, stdout: selected.versionOutput, stderr: "" };
    }),
  ];
  syncBuiltinESMExports();
  try {
    await assert.rejects(
      install({ tool: "vale" }),
      /regular|symbolic|directory/u,
    );
    await assert.rejects(
      install({ tool: "vale", assetFile: "absent-asset" }),
      /regular|symbolic|directory/u,
    );
    assert.throws(
      () => nativeToolBinary("vale"),
      /regular|symbolic|directory/u,
    );
    assert.equal(executions, 0);
  } finally {
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});

test("a supplied install never changes the mode of an existing cache entry", async (context) => {
  const selected = selectedAsset("vale");
  const target = path.join(
    root,
    "build/runtime/tool-cache/vale",
    selected.version,
    selected.key,
    selected.binaryName,
  );
  const asset = path.resolve("fixture-native-asset");
  const bytes = Buffer.from("fixture-pinned-asset");
  const descriptor = manifest.tools.vale.assets[selected.key];
  const originalDigest = descriptor.sha256;
  const actualRead = fs.readFileSync;
  const actualEntries = fs.readdirSync;
  const actualStat = fs.lstatSync;
  const actualSpawn = childProcess.spawnSync;
  const modes = [];
  let concurrentTarget = false;
  const mocks = [
    context.mock.method(fs, "readFileSync", (file, options) =>
      file === asset ? bytes : actualRead(file, options),
    ),
    context.mock.method(fs, "readdirSync", (directory, options) =>
      path.basename(directory) === "extracted"
        ? [
            {
              name: selected.binaryName,
              isDirectory: () => false,
              isFile: () => true,
            },
          ]
        : actualEntries(directory, options),
    ),
    context.mock.method(fs, "lstatSync", (file, options) => {
      if (file === target) {
        return concurrentTarget
          ? { isFile: () => true, isSymbolicLink: () => false }
          : undefined;
      }
      return path.basename(path.dirname(file)) === "extracted"
        ? { isFile: () => true, isSymbolicLink: () => false }
        : actualStat(file, options);
    }),
    context.mock.method(fs, "chmodSync", (file) => modes.push(file)),
    context.mock.method(fs, "copyFileSync", (_source, destination, flags) => {
      assert.equal(destination, target);
      assert.equal(flags, fs.constants.COPYFILE_EXCL);
      assert.equal(concurrentTarget, false);
      concurrentTarget = true;
      throw Object.assign(new Error("another install completed"), {
        code: "EEXIST",
      });
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      if (command === "tar") {
        const stdout =
          args[0] === "-tf"
            ? `${selected.binaryName}\n`
            : args[0] === "-tvf"
              ? `-rwxr-xr-x 0/0 10 ${selected.binaryName}\n`
              : "";
        return { status: 0, stdout, stderr: "" };
      }
      if (
        command === target ||
        path.basename(path.dirname(command)) === "extracted"
      )
        return { status: 0, stdout: selected.versionOutput, stderr: "" };
      return actualSpawn(command, args, options);
    }),
  ];
  descriptor.sha256 = createHash("sha256").update(bytes).digest("hex");
  syncBuiltinESMExports();
  try {
    assert.equal(await install({ tool: "vale", assetFile: asset }), target);
    assert.equal(concurrentTarget, true);
    assert.equal(modes.includes(target), false);
  } finally {
    descriptor.sha256 = originalDigest;
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});
