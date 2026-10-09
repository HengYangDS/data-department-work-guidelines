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
  install,
  manifest,
  safeArchiveEntries,
  selectedAsset,
} from "../../tools/ci/install-native.mjs";
import { reportError, root } from "../../tools/docs/runtime.mjs";

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
      (error) => {
        assert.ok(error instanceof SuppressedError);
        assert.equal(error.error, failure);
        assert.match(error.suppressed.message, /HTTP 503/u);
        return true;
      },
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

test("native suppressed failures retain primary and cleanup diagnostics", (context) => {
  const lines = [];
  context.mock.method(console, "error", (line) => lines.push(line));
  const primary = new Error("native tool download failed: HTTP 503");
  const cleanup = Object.assign(new Error("stage removal failed"), {
    code: "EPERM",
  });
  reportError(
    new SuppressedError(cleanup, primary, "installation and cleanup failed"),
  );
  assert.deepEqual(lines, [
    "installation and cleanup failed",
    primary.message,
    "EPERM: stage removal failed",
  ]);
});

test("raw native installation publishes verified bytes atomically without archive coercion", async (context) => {
  const descriptor = manifest.tools["osv-scanner"];
  assert.ok(descriptor, "raw supply must be declared before installation");
  const selected = selectedAsset("osv-scanner");
  const target = path.join(
    root,
    "build/runtime/tool-cache/osv-scanner",
    selected.version,
    selected.key,
    selected.binaryName,
  );
  const temporaryAsset = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-raw-native-"),
  );
  const asset = path.join(temporaryAsset, selected.name);
  const bytes = Buffer.from("bounded raw native fixture");
  fs.writeFileSync(asset, bytes);
  const pin = descriptor.assets[selected.key];
  const original = { ...pin };
  const actualSpawn = childProcess.spawnSync;
  const actualStat = fs.lstatSync;
  const actualRead = fs.readFileSync;
  const actualChmod = fs.chmodSync;
  const actualTemporary = fs.mkdtempSync;
  const modes = [];
  const stages = [];
  const executions = [];
  let published = false;
  let corruptCopy = false;
  const mocks = [
    context.mock.method(fs, "mkdtempSync", (...args) => {
      const stage = actualTemporary(...args);
      stages.push(stage);
      return stage;
    }),
    context.mock.method(fs, "lstatSync", (file, options) =>
      file === target
        ? published
          ? { isFile: () => true, isSymbolicLink: () => false, mode: 0o755 }
          : undefined
        : actualStat(file, options),
    ),
    context.mock.method(fs, "readFileSync", (file, options) =>
      file === target && published
        ? corruptCopy
          ? Buffer.from("changed copied bytes")
          : bytes
        : actualRead(file, options),
    ),
    context.mock.method(fs, "chmodSync", (file, mode) => {
      modes.push(file);
      actualChmod(file, mode);
    }),
    context.mock.method(fs, "copyFileSync", () => {
      throw new Error("native tool publication must not expose a partial copy");
    }),
    context.mock.method(fs, "linkSync", (source, destination) => {
      assert.deepEqual(fs.readFileSync(source), bytes);
      assert.equal(path.dirname(path.dirname(source)), path.dirname(target));
      assert.equal(destination, target);
      published = true;
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      assert.notEqual(command, "tar", "a raw binary is not an archive");
      if (command === target || path.basename(command) === selected.name) {
        executions.push(command);
        assert.equal(options.timeout, 10_000);
        if (command !== target)
          assert.deepEqual(fs.readFileSync(command), bytes);
        return { status: 0, stdout: selected.versionOutput, stderr: "" };
      }
      return actualSpawn(command, args, options);
    }),
  ];
  pin.sha256 = createHash("sha256").update(bytes).digest("hex");
  pin.size = bytes.length;
  syncBuiltinESMExports();
  try {
    fs.writeFileSync(asset, "corrupt");
    await assert.rejects(
      install({ tool: "osv-scanner", assetFile: asset }),
      /digest|size/u,
    );
    assert.equal(published, false);
    fs.writeFileSync(asset, bytes);
    assert.equal(
      await install({ tool: "osv-scanner", assetFile: asset }),
      target,
    );
    assert.equal(published, true);
    assert.equal(
      executions.length,
      1,
      "one verified copy must not restart the binary",
    );
    assert.equal(executions.includes(target), false);
    assert.equal(modes.includes(target), false);
    published = false;
    corruptCopy = true;
    await assert.rejects(
      install({ tool: "osv-scanner", assetFile: asset }),
      /copied.*bytes|verification/u,
    );
    assert.equal(executions.length, 2);
    assert.equal(stages.length, 3);
    assert.equal(
      stages.every((stage) => !fs.existsSync(stage)),
      true,
    );
  } finally {
    Object.assign(pin, original);
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
    await fsPromises.rm(temporaryAsset, { recursive: true, force: true });
  }
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
