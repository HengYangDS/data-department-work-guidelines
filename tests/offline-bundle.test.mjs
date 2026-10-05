import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import {
  appendFileSync,
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { gunzipSync } from "node:zlib";
import { strictVersion } from "../tools/docs/changelog.mjs";
import * as offline from "../tools/ci/offline-bundle.mjs";
import {
  acquireGitHubBundle,
  assembleBundle,
  assertSafeBundleListing,
  inspectBundle,
  installBundle,
  isolatedNpmEnvironment,
  npmCliPath,
  readBundleRecord,
  validateBundleRecord,
  validateExtractedBundle,
  validateLockSupply,
} from "../tools/ci/offline-bundle.mjs";
import {
  declaredToolRuntime,
  readNativeSupply,
  root,
  run as runCommand,
} from "../tools/docs/runtime.mjs";
import * as runtime from "../tools/docs/runtime.mjs";

const digest = (text) => createHash("sha256").update(text).digest("hex");

const listingSupply = {
  tools: {
    lychee: {
      assets: { fixture: { name: "lychee-aarch64-apple-darwin.tar.gz" } },
      licenses: { "LICENSE-MIT": {} },
    },
    vale: {
      assets: { fixture: { name: "vale-fixture.tar.gz" } },
      licenses: { LICENSE: {} },
    },
  },
};

function record(overrides = {}) {
  return {
    schemaVersion: 4,
    version: "4.2.0",
    fileName: "data-department-work-guidelines-v4.2.0-offline-tools.tar.gz",
    sha256: digest("archive"),
    lockSha256: digest("lock"),
    packageJsonSha256: digest("package"),
    nativeToolsSha256: digest("native tools"),
    nodeMajor: 26,
    ...overrides,
  };
}

const source = {
  version: "4.2.0",
  lockSha256: digest("lock"),
  packageJsonSha256: digest("package"),
  nativeToolsSha256: digest("native tools"),
  nodeMajor: 26,
};

test("Node owns the package-manager bootstrap without a duplicate npm major", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-runtime-"));
  try {
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify({ engines: { node: "26.x" } }),
    );
    assert.deepEqual(declaredToolRuntime(directory), { nodeMajor: 26 });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("bundle identity is bound to the exact source inputs", () => {
  assert.doesNotThrow(() => validateBundleRecord(record(), source));
  for (const changed of [
    { version: "4.1.1" },
    { lockSha256: digest("other lock") },
    { nativeToolsSha256: digest("other native tools") },
    { sha256: "0".repeat(64) },
    { fileName: "../offline-tools.tar.gz" },
    { nodeMajor: 22 },
    { npmMajor: 11 },
    { unexpected: "second authority" },
  ]) {
    assert.throws(() => validateBundleRecord(record(changed), source));
  }
  assert.throws(() =>
    validateBundleRecord(record(), { ...source, version: "4.3.0" }),
  );
  assert.throws(() =>
    validateBundleRecord(record(), { ...source, nodeMajor: 22 }),
  );
});

test("bundle archive admits only regular files in its declared roots", () => {
  const names = [
    "./",
    "./manifest.json",
    "./npm-cache/",
    "./npm-cache/_cacache/",
    "./npm-cache/_cacache/index-v5/one",
    "./native/",
    "./native/lychee/",
    "./native/vale/",
    "./native/vale/vale-fixture.tar.gz",
    "./native/lychee/lychee-aarch64-apple-darwin.tar.gz",
    "./licenses/",
    "./licenses/lychee/",
    "./licenses/lychee/LICENSE-MIT",
    "./licenses/vale/",
    "./licenses/vale/LICENSE",
  ].join("\n");
  const verbose = [
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/_cacache/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./npm-cache/_cacache/index-v5/one",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/lychee/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/vale/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./native/vale/vale-fixture.tar.gz",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./native/lychee/lychee-aarch64-apple-darwin.tar.gz",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/lychee/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./licenses/lychee/LICENSE-MIT",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/vale/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./licenses/vale/LICENSE",
  ].join("\n");
  assert.doesNotThrow(() =>
    assertSafeBundleListing(names, verbose, listingSupply),
  );
  for (const unsafe of [
    "../outside",
    "/tmp/outside",
    "C:/outside",
    "./npm-cache/../outside",
    "./npm-cache\\outside",
    "./unexpected/file",
  ]) {
    assert.throws(() =>
      assertSafeBundleListing(
        `${names}\n${unsafe}`,
        `${verbose}\n-rw-r--r-- 0/0 10 Jan 1 00:00 ${unsafe}`,
        listingSupply,
      ),
    );
  }
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./manifest.json`,
      `${verbose}\n-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json`,
      listingSupply,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./native/lychee/link`,
      `${verbose}\nlrwxr-xr-x 0/0 0 Jan 1 00:00 ./native/lychee/link -> /tmp/outside`,
      listingSupply,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(
      names,
      verbose.split("\n").slice(0, -1).join("\n"),
      listingSupply,
    ),
  );
});

test("bundle inventory derives raw and archived assets from the same supply manifest", () => {
  const tools = {
    "osv-scanner": {
      format: "binary",
      assets: { "linux-arm64": { name: "osv-scanner_linux_arm64" } },
      licenses: { LICENSE: {} },
    },
  };
  const members = [
    ["./", "d"],
    ["./manifest.json", "-"],
    ["./npm-cache/", "d"],
    ["./npm-cache/_cacache/", "d"],
    ["./npm-cache/_cacache/entry", "-"],
    ["./native/", "d"],
    ["./native/osv-scanner/", "d"],
    ["./native/osv-scanner/osv-scanner_linux_arm64", "-"],
    ["./licenses/", "d"],
    ["./licenses/osv-scanner/", "d"],
    ["./licenses/osv-scanner/LICENSE", "-"],
  ];
  const listing = (items) => [
    items.map(([name]) => name).join("\n"),
    items.map(([name, type]) => `${type}rwxr-xr-x 0/0 10 ${name}`).join("\n"),
  ];
  assert.doesNotThrow(() =>
    assertSafeBundleListing(...listing(members), { tools }),
  );
  for (const extra of [
    "./native/osv-scanner/undeclared",
    "./native/retired/",
    "./licenses/osv-scanner/old-notice",
  ]) {
    assert.throws(
      () =>
        assertSafeBundleListing(
          ...listing([...members, [extra, extra.endsWith("/") ? "d" : "-"]]),
          { tools },
        ),
      /unexpected|missing/u,
    );
  }
  assert.throws(
    () =>
      assertSafeBundleListing(
        ...listing(
          members.filter(([name]) => !name.endsWith("osv-scanner_linux_arm64")),
        ),
        { tools },
      ),
    /missing/u,
  );
});

test("archive commands preserve native errors and reject warnings", () => {
  assert.equal(
    runCommand(process.execPath, ["-e", 'process.stdout.write("clean")'], {
      capture: true,
      rejectStderr: true,
    }),
    "clean",
  );
  assert.throws(
    () =>
      runCommand(process.execPath, ["-e", 'process.stderr.write("warning")'], {
        capture: true,
        rejectStderr: true,
      }),
    /warning output/u,
  );
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-missing-command-"),
  );
  const missing = path.join(directory, "missing-native-command");
  try {
    assert.throws(
      () => runCommand(missing, [], { capture: true, rejectStderr: true }),
      (error) => {
        assert.ok(error.message.startsWith(`${missing}: `), error.message);
        assert.match(error.message, /ENOENT/u);
        assert.equal(error.cause?.code, "ENOENT");
        assert.equal(error.cause.path, missing);
        return true;
      },
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("CLI diagnostics retain native causes without repeating command output", (context) => {
  const lines = [];
  context.mock.method(console, "error", (message) => lines.push(message));
  const cause = Object.assign(new Error("connection refused"), {
    code: "ECONNREFUSED",
  });
  runtime.reportError(new Error("fetch failed", { cause }));
  assert.deepEqual(lines, ["fetch failed", "ECONNREFUSED: connection refused"]);
  lines.length = 0;
  runtime.reportError(
    new Error("native command: ECONNREFUSED: connection refused", { cause }),
  );
  assert.deepEqual(lines, ["native command: ECONNREFUSED: connection refused"]);
  lines.length = 0;
  runtime.reportError(
    new Error("native command: connection refused", { cause }),
  );
  assert.deepEqual(lines, [
    "native command: connection refused",
    "ECONNREFUSED: connection refused",
  ]);
  lines.length = 0;
  runtime.reportError(
    new Error("native execution failed", {
      cause: Object.assign(new Error(""), { code: "EPIPE" }),
    }),
  );
  assert.deepEqual(lines, ["native execution failed", "EPIPE"]);
  lines.length = 0;
  const circular = new Error("response disposal failed");
  circular.cause = circular;
  runtime.reportError(
    new Error("native download refused: HTTP 500", { cause: circular }),
  );
  assert.deepEqual(lines, [
    "native download refused: HTTP 500",
    "response disposal failed",
  ]);
  lines.length = 0;
  runtime.reportError(new Error("GitLab release bundle download failed"));
  assert.deepEqual(lines, ["GitLab release bundle download failed"]);
});

test("release priming preserves native npm failures through the shared executor", (context) => {
  const actual = childProcess.spawnSync;
  let result;
  let output;
  let started = 0;
  let temporary;
  const mocks = [
    context.mock.method(process.stdout, "write", (bytes) => {
      output.stdout += bytes;
      return true;
    }),
    context.mock.method(process.stderr, "write", (bytes) => {
      output.stderr += bytes;
      return true;
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      if (command !== process.execPath || args[1] !== "--version")
        return actual(command, args, options);
      started++;
      temporary = path.dirname(options.cwd);
      assert.equal(options.input, "");
      assert.equal(options.timeout, 10_000);
      return result;
    }),
  ];
  syncBuiltinESMExports();
  try {
    for (const response of [
      { status: 1, stdout: "npm partial result", stderr: "EBADDEVENGINES" },
      {
        status: null,
        signal: "SIGTERM",
        error: Object.assign(new Error("native npm timeout"), {
          code: "ETIMEDOUT",
        }),
        stdout: "npm partial result",
        stderr: "npm partial error",
      },
      { status: 0, stdout: "12.2.0", stderr: "native npm warning" },
    ]) {
      result = response;
      output = { stdout: "", stderr: "" };
      const before = started;
      buildFixture((inputs) => {
        copyFileSync(
          path.join(root, "package-lock.json"),
          path.join(inputs.repository, "package-lock.json"),
        );
        assert.throws(
          () => offline.buildReleaseBundle(inputs),
          (error) => {
            assert.match(
              error.message,
              /exited 1|native npm timeout|warning output/u,
            );
            assert.equal(error.cause, response.error);
            return true;
          },
        );
      });
      assert.equal(started, before + 1, "failed startup must not begin npm ci");
      assert.equal(output.stdout, response.stdout);
      assert.equal(output.stderr, response.status === 0 ? "" : response.stderr);
      assert.equal(existsSync(temporary), false);
    }
  } finally {
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});

test("piped native failures preserve diagnostics without duplicate output", () => {
  const module = new URL("../tools/docs/runtime.mjs", import.meta.url).href;
  const cases = [
    {
      child:
        'process.stdout.write("partial result\\n"); process.stderr.write("native cause\\n"); process.exitCode = 2;',
      timeout: 5_000,
      failure: /exited 2/u,
    },
    {
      child:
        'process.stdout.write("partial result\\n"); process.stderr.write("native cause\\n"); setInterval(() => {}, 1_000);',
      timeout: 2_000,
      failure: /ETIMEDOUT/u,
      nativeCode: "ETIMEDOUT",
    },
    {
      child:
        'process.stdout.write("partial result\\n"); process.stderr.write("native cause\\n");',
      timeout: 5_000,
      failure: /warning output/u,
    },
  ];
  for (const options of [
    { capture: true },
    { capture: true, rejectStderr: true },
    { rejectStderr: true },
  ]) {
    for (const { child, timeout, failure, nativeCode } of cases) {
      if (!options.rejectStderr && failure.source === "warning output")
        continue;
      const script = [
        'import childProcess from "node:child_process";',
        'import { syncBuiltinESMExports } from "node:module";',
        `import { run } from ${JSON.stringify(module)};`,
        "const spawn = childProcess.spawnSync;",
        "let native;",
        "childProcess.spawnSync = (...args) => { native = spawn(...args); return native; };",
        "syncBuiltinESMExports();",
        `try { run(process.execPath, ["-e", ${JSON.stringify(child)}],`,
        `${JSON.stringify({ ...options, timeout })}); }`,
        "catch (error) {",
        "console.error(error.message);",
        'console.error(`native execution code: ${error.cause?.code ?? "none"}`);',
        "console.error(`native execution path matches: ${error.cause?.path === process.execPath}`);",
        'console.error(`has cause property: ${Object.hasOwn(error, "cause")}`);',
        'console.error(`native streams: ${Buffer.from(JSON.stringify({ stdout: native.stdout ?? "", stderr: native.stderr ?? "" })).toString("base64")}`);',
        "process.exitCode = 1; }",
        "finally { childProcess.spawnSync = spawn; syncBuiltinESMExports(); }",
      ].join("\n");
      const result = spawnSync(
        process.execPath,
        ["--input-type=module", "--eval", script],
        { encoding: "utf8", timeout: 10_000 },
      );
      assert.equal(result.status, 1, result.stderr);
      const streams = JSON.parse(
        Buffer.from(
          /native streams: ([A-Za-z0-9+/=]+)/u.exec(result.stderr)[1],
          "base64",
        ).toString("utf8"),
      );
      assert.equal(result.stdout, streams.stdout);
      if (!nativeCode) assert.equal(streams.stdout, "partial result\n");
      assert.match(result.stderr, failure);
      assert.equal(
        result.stderr.split("native cause").length - 1,
        streams.stderr.split("native cause").length - 1,
      );
      assert.ok(
        result.stderr.includes(
          `native execution code: ${nativeCode ?? "none"}`,
        ),
        result.stderr,
      );
      assert.ok(
        result.stderr.includes(
          `native execution path matches: ${!!nativeCode}`,
        ),
        result.stderr,
      );
      assert.ok(
        result.stderr.includes(`has cause property: ${!!nativeCode}`),
        result.stderr,
      );
    }
  }
});

async function bundleFixture(
  run,
  { cache = true, lychee = true, vale = true } = {},
) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-test-"));
  try {
    const stage = path.join(directory, "stage");
    mkdirSync(path.join(stage, "npm-cache", "_cacache"), {
      recursive: true,
    });
    mkdirSync(path.join(stage, "native", "lychee"), { recursive: true });
    mkdirSync(path.join(stage, "native", "vale"));
    mkdirSync(path.join(stage, "licenses", "vale"), { recursive: true });
    writeFileSync(
      path.join(stage, "licenses", "vale", "LICENSE"),
      "Vale fixture license",
    );
    if (vale)
      writeFileSync(
        path.join(stage, "native", "vale", "vale-fixture.tar.gz"),
        "pinned Vale archive",
      );
    mkdirSync(path.join(stage, "licenses", "lychee"), { recursive: true });
    writeFileSync(
      path.join(stage, "licenses", "lychee", "LICENSE-MIT"),
      "license fixture",
    );
    writeFileSync(path.join(stage, "manifest.json"), "{}\n");
    if (cache) {
      writeFileSync(
        path.join(stage, "npm-cache", "_cacache", "entry"),
        "cached package",
      );
    }
    if (lychee) {
      writeFileSync(
        path.join(
          stage,
          "native",
          "lychee",
          "lychee-aarch64-apple-darwin.tar.gz",
        ),
        "pinned archive",
      );
    }
    const bundle = path.join(directory, record().fileName);
    const result = spawnSync("tar", ["-czf", bundle, "-C", stage, "."], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(result.status, 0, result.stderr);
    const bytes = readFileSync(bundle);
    return await run(bundle, record({ sha256: digest(bytes) }));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("bundle digest is verified before archive inspection", async () => {
  await bundleFixture(async (bundle, expected) => {
    assert.equal(
      (await inspectBundle(bundle, expected, source, listingSupply)).sha256,
      expected.sha256,
    );
    appendFileSync(bundle, "altered");
    assert.throws(
      () => inspectBundle(bundle, expected, source, listingSupply),
      /digest/u,
    );
  });
});

test("bundle inspection rejects incomplete supply", async () => {
  for (const missing of [
    { cache: false },
    { lychee: false },
    { vale: false },
  ]) {
    await bundleFixture(async (bundle, expected) => {
      assert.throws(
        () => inspectBundle(bundle, expected, source, listingSupply),
        /missing/u,
      );
    }, missing);
  }
});

function buildFixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-build-test-"));
  const cleanup = () => rmSync(directory, { recursive: true, force: true });
  try {
    const repository = path.join(directory, "repository");
    const cacheDirectory = path.join(directory, "cache");
    const assetDirectory = path.join(directory, "assets");
    const licenseDirectory = path.join(directory, "licenses");
    mkdirSync(path.join(repository, ".config", "supply"), { recursive: true });
    mkdirSync(path.join(repository, ".config", "release"));
    mkdirSync(path.join(cacheDirectory, "_cacache", "index-v5"), {
      recursive: true,
    });
    mkdirSync(path.join(assetDirectory, "lychee"), { recursive: true });
    mkdirSync(path.join(assetDirectory, "vale"));
    mkdirSync(path.join(licenseDirectory, "lychee"), { recursive: true });
    mkdirSync(path.join(licenseDirectory, "vale"));
    writeFileSync(path.join(repository, "VERSION"), "4.2.0\n");
    writeFileSync(
      path.join(repository, "package.json"),
      JSON.stringify({ engines: { node: "26.x" } }),
    );
    writeFileSync(path.join(repository, "package-lock.json"), "fixture lock\n");
    writeFileSync(
      path.join(cacheDirectory, "_cacache", "index-v5", "entry"),
      "cached package",
    );
    const platform = `${process.platform}-${process.arch}`;
    const assetName = `lychee-${platform}.tar.gz`;
    const asset = Buffer.from("pinned lychee asset");
    writeFileSync(path.join(assetDirectory, "lychee", assetName), asset);
    const licenses = {};
    for (const name of ["LICENSE-APACHE", "LICENSE-MIT"]) {
      const bytes = Buffer.from(`${name} fixture`);
      writeFileSync(path.join(licenseDirectory, "lychee", name), bytes);
      licenses[name] = {
        sha256: digest(bytes),
        source: `https://example.test/${name}`,
      };
    }
    const valeAssetName = `vale-${platform}.tar.gz`;
    const valeAsset = Buffer.from("pinned Vale asset");
    const valeLicense = Buffer.from("Vale license fixture");
    writeFileSync(path.join(assetDirectory, "vale", valeAssetName), valeAsset);
    writeFileSync(path.join(licenseDirectory, "vale", "LICENSE"), valeLicense);
    const lychee = {
      version: "0.24.2",
      assets: { [platform]: { name: assetName, sha256: digest(asset) } },
      licenses,
    };
    writeFileSync(
      path.join(repository, ".config", "supply", "native.json"),
      JSON.stringify({
        schemaVersion: 1,
        tools: {
          lychee,
          vale: {
            version: "3.23.0",
            assets: {
              [platform]: { name: valeAssetName, sha256: digest(valeAsset) },
            },
            licenses: {
              LICENSE: {
                sha256: digest(valeLicense),
                source: "https://example.test/vale/LICENSE",
              },
            },
          },
        },
      }),
    );
    const outputPath = path.join(directory, record().fileName);
    const result = run({
      repository,
      cacheDirectory,
      assetDirectory,
      licenseDirectory,
      outputPath,
      assetName,
    });
    if (result && typeof result.then === "function") {
      return result.finally(cleanup);
    }
    cleanup();
    return result;
  } catch (error) {
    cleanup();
    throw error;
  }
}

test("builder admits only pinned, licensed, regular supply", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    assert.equal(built.version, "4.2.0");
    assert.match(built.sha256, /^[0-9a-f]{64}$/u);
    const checked = inspectBundle(
      inputs.outputPath,
      built,
      {
        version: built.version,
        lockSha256: built.lockSha256,
        packageJsonSha256: built.packageJsonSha256,
        nativeToolsSha256: built.nativeToolsSha256,
        nodeMajor: built.nodeMajor,
      },
      readNativeSupply(inputs.repository),
    );
    assert.equal(checked.sha256, built.sha256);
  });
  buildFixture((inputs) => {
    writeFileSync(
      path.join(inputs.assetDirectory, "lychee", inputs.assetName),
      "altered",
    );
    assert.throws(() => assembleBundle(inputs), /digest/u);
  });
  buildFixture((inputs) => {
    rmSync(path.join(inputs.licenseDirectory, "lychee", "LICENSE-MIT"));
    assert.throws(
      () => assembleBundle(inputs),
      (error) => {
        assert.match(error.message, /missing offline bundle license/u);
        assert.equal(error.cause?.code, "ENOENT");
        assert.equal(path.basename(error.cause.path), "LICENSE-MIT");
        return true;
      },
    );
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "supply",
      "native.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.tools.lychee.assets[`${process.platform}-${process.arch}`].name =
      "../outside.tar.gz";
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*asset/u);
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "supply",
      "native.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.tools.lychee.licenses["../outside"] =
      manifest.tools.lychee.licenses["LICENSE-MIT"];
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*license/u);
  });

  if (process.platform !== "win32") {
    buildFixture((inputs) => {
      symlinkSync(
        path.join(inputs.assetDirectory, "lychee", inputs.assetName),
        path.join(inputs.cacheDirectory, "_cacache", "index-v5", "link"),
      );
      assert.throws(() => assembleBundle(inputs), /symlink|regular/u);
    });
  }
});

test("package licensing accepts explicit native README declarations, not casual mentions", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-package-license-"),
  );
  try {
    const location = "node_modules/fixture";
    const packageDirectory = path.join(directory, location);
    mkdirSync(packageDirectory, { recursive: true });
    const lock = { packages: { [location]: {} } };
    const check = (manifest, readme) => {
      writeFileSync(
        path.join(packageDirectory, "package.json"),
        JSON.stringify(manifest),
      );
      writeFileSync(path.join(packageDirectory, "Readme.md"), readme);
      return offline.checkPackageLicenses(directory, lock);
    };
    assert.equal(
      check({ license: "MIT" }, "# Fixture\n\n## License\n\nMIT\n"),
      1,
    );
    assert.equal(
      check(
        { licenses: [{ type: "MIT", url: "https://example.test/mit" }] },
        "Fixture\n=======\n\nLicense\n=======\n\n[MIT license](https://example.test/mit)\n",
      ),
      1,
    );
    assert.equal(
      check(
        { license: "BSD-3-Clause" },
        "# Fixture\n\n## License\n\nBSD-3-Clause\n",
      ),
      1,
    );
    const readerNotice =
      "# Fixture\n\n## **Lic&#101;nse**\n\n[MIT License](https://example.test/mit)\n";
    assert.equal(check({ license: "MIT" }, readerNotice), 1);
    assert.equal(
      readFileSync(path.join(packageDirectory, "Readme.md"), "utf8"),
      readerNotice,
    );
    for (const readme of [
      "# Fixture\n\nMIT is mentioned in usage.\n",
      "# Fixture\n\n```text\n## License\nMIT\n```\n",
      "# Fixture\n\n## License\n\n## Usage\n\nMIT\n",
      "# Fixture\n\n## License\n\nNo permission is granted.\n",
      "# Fixture\n\n## License\n\nBSD-3-Clause\n",
      "# Fixture\n\n> ## License\n> MIT\n",
      "# Fixture\n\n## License\n\n`MIT` is only an example.\n",
      "# Fixture\n\n## License\n\n[Read the notice](https://example.test/MIT)\n",
      "# Fixture\n\n## License\n\n<!-- MIT -->\n",
      "# Fixture\n\n## License\n\n```text\nMIT\n```\n",
    ]) {
      assert.throws(
        () => check({ license: "MIT" }, readme),
        /lacks its license/u,
      );
    }
    assert.throws(
      () => check({}, "# Fixture\n\n## License\n\nMIT\n"),
      /lacks its license/u,
    );
    assert.throws(
      () =>
        check({ licenses: [{ type: "" }] }, "# Fixture\n\n## License\n\nMIT\n"),
      /lacks its license/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the locked TOML plugin carries its full native MIT notice without sidecars", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-license-"));
  try {
    const location = "node_modules/@dprint/toml";
    const formatter = "node_modules/@dprint/formatter";
    const lock = JSON.parse(
      readFileSync(path.join(root, "package-lock.json"), "utf8"),
    );
    const selected = {
      packages: {
        [location]: lock.packages[location],
        [formatter]: lock.packages[formatter],
      },
    };
    for (const relative of [location, formatter]) {
      cpSync(path.join(root, relative), path.join(directory, relative), {
        recursive: true,
      });
    }
    writeFileSync(
      path.join(directory, "package.json"),
      '{ "private": true }\n',
    );
    const plugin = path.join(directory, location, "plugin.wasm");
    const original = readFileSync(plugin);
    const inventory = readdirSync(path.dirname(plugin));
    assert.equal(offline.checkPackageLicenses(directory, selected), 2);
    assert.deepEqual(readFileSync(plugin), original);
    assert.deepEqual(readdirSync(path.dirname(plugin)), inventory);

    for (const invalid of [
      Buffer.from("invalid Wasm"),
      Buffer.from([0, 97, 115, 109, 1, 0, 0, 0]),
    ]) {
      writeFileSync(plugin, invalid);
      assert.throws(
        () => offline.checkPackageLicenses(directory, selected),
        (error) => {
          assert.match(error.message, /native formatter license/u);
          if (invalid.equals(Buffer.from("invalid Wasm"))) {
            assert.ok(error.cause instanceof WebAssembly.CompileError);
          } else {
            assert.ok(error.cause instanceof Error);
          }
          return true;
        },
      );
      assert.deepEqual(readFileSync(plugin), invalid);
    }
    writeFileSync(plugin, original);
    const manifestPath = path.join(directory, location, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const field of [
      { name: "fixture" },
      { license: "BSD-3-Clause" },
      { version: "0.0.0" },
    ]) {
      writeFileSync(manifestPath, JSON.stringify({ ...manifest, ...field }));
      assert.throws(
        () => offline.checkPackageLicenses(directory, selected),
        /native formatter license|lacks its license/u,
      );
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test(
  "macOS builder omits extended attributes from the archive",
  { skip: process.platform !== "darwin" },
  () => {
    buildFixture((inputs) => {
      assembleBundle(inputs);
      const archive = gunzipSync(readFileSync(inputs.outputPath));
      assert.equal(archive.includes(Buffer.from("LIBARCHIVE.xattr.")), false);
      assert.equal(archive.includes(Buffer.from("SCHILY.xattr.")), false);
    });
  },
);

test("extracted bundle contents agree with source and pinned supply", () => {
  buildFixture((inputs) => {
    assembleBundle(inputs);
    const extracted = path.join(path.dirname(inputs.outputPath), "extracted");
    mkdirSync(extracted);
    const result = spawnSync(
      "tar",
      ["-xf", inputs.outputPath, "-C", extracted],
      {
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotThrow(() =>
      validateExtractedBundle(extracted, inputs.repository),
    );
    const asset = path.join(extracted, "native", "lychee", inputs.assetName);
    const originalAsset = readFileSync(asset);
    writeFileSync(asset, "altered");
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /asset.*digest/u,
    );
    writeFileSync(asset, originalAsset);
    const license = path.join(extracted, "licenses", "lychee", "LICENSE-MIT");
    const originalLicense = readFileSync(license);
    writeFileSync(license, "altered");
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /license.*digest/u,
    );
    writeFileSync(license, originalLicense);
    rmSync(path.join(extracted, "npm-cache", "_cacache", "index-v5", "entry"));
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /cache.*count/u,
    );
  });
});

test("bundle extraction retains the current executor's ownership", (context) => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const nativeSpawn = childProcess.spawnSync;
    const extraction = context.mock.method(
      childProcess,
      "spawnSync",
      (command, args, options) => {
        if (command === "tar" && args.includes("-xf")) {
          assert.ok(args.includes("--no-same-owner"));
        }
        return nativeSpawn(command, args, options);
      },
    );
    syncBuiltinESMExports();
    try {
      offline.verifyBundle({
        bundlePath: inputs.outputPath,
        record: built,
        repository: inputs.repository,
      });
      installBundle({
        bundlePath: inputs.outputPath,
        record: built,
        repository: inputs.repository,
        commandRunner: (_command, args) => {
          if (args[1] === "--version") return "12.2.0\n";
          if (args[1] === "ci") {
            mkdirSync(path.join(inputs.repository, "node_modules"));
          }
          return "";
        },
      });
      assert.equal(
        extraction.mock.calls.filter(
          ({ arguments: [command, args] }) =>
            command === "tar" && args.includes("-xf"),
        ).length,
        2,
      );
    } finally {
      extraction.mock.restore();
      syncBuiltinESMExports();
    }
  });
});

test("the public offline installer reports its actual package-manager version", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config/release/offline-bundle.json"),
      JSON.stringify(built),
    );
    for (const relative of [
      "tools/ci/offline-bundle.mjs",
      "tools/ci/gitlab-package.mjs",
      "tools/docs/runtime.mjs",
    ]) {
      const target = path.join(inputs.repository, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(path.join(root, relative), target);
    }
    const bootstrap = path.join(
      inputs.repository,
      "native install #fixture.mjs",
    );
    writeFileSync(
      bootstrap,
      `import childProcess from "node:child_process";
import { mkdirSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
const actual = childProcess.spawnSync;
childProcess.spawnSync = (command, args, options) => {
  if (command === process.execPath) {
    if (path.basename(args[0]) === "npm-cli.js") {
      if (args[1] === "--version")
        return { status: 0, stdout: "12.1.0\\n", stderr: "" };
      if (args[1] === "ci") {
        mkdirSync(path.join(options.cwd, "node_modules"));
        return { status: 0, stdout: "", stderr: "" };
      }
    }
    if (path.basename(args[0]) === "install-native.mjs")
      return { status: 0, stdout: "", stderr: "" };
  }
  return actual(command, args, options);
};
syncBuiltinESMExports();
`,
    );
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        pathToFileURL(bootstrap).href,
        "tools/ci/offline-bundle.mjs",
        "install",
        "--bundle",
        inputs.outputPath,
      ],
      { cwd: inputs.repository, encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(result.error, undefined, result.stderr);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");
    assert.equal(
      result.stdout,
      `PASS offline install: 4.2.0 ${built.sha256} npm 12.1.0\n`,
    );
    assert.ok(existsSync(path.join(inputs.repository, "node_modules")));
  });
});

test("installer invokes only the locked offline supply path", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args, options) => {
      calls.push({ command, args, options });
      if (
        command === process.execPath &&
        path.basename(args[0]) === "npm-cli.js" &&
        args[1] === "--version"
      )
        return "12.1.0\n";
      if (
        command === process.execPath &&
        path.basename(args[0]) === "npm-cli.js" &&
        args[1] === "ci"
      ) {
        assert.ok(args.includes("--offline"));
        assert.ok(args.includes("--ignore-scripts"));
        assert.ok(args.includes("--cache"));
        assert.ok(!args.includes("--dry-run"));
        mkdirSync(path.join(inputs.repository, "node_modules"));
        assert.equal(options.env.npm_config_offline, "true");
        assert.equal(options.env.npm_config_force, "false");
        assert.notEqual(
          options.env.npm_config_userconfig,
          options.env.npm_config_globalconfig,
        );
      }
      return "";
    };
    const result = installBundle({
      bundlePath: inputs.outputPath,
      record: built,
      repository: inputs.repository,
      commandRunner,
    });
    assert.equal(result.version, "4.2.0");
    assert.equal(result.npmVersion, "12.1.0");
    assert.equal(calls.length, 4);
    assert.equal(calls[0].command, process.execPath);
    assert.equal(path.basename(calls[0].args[0]), "npm-cli.js");
    assert.equal(calls[0].args[1], "--version");
    assert.equal(calls[1].command, process.execPath);
    assert.equal(path.basename(calls[1].args[0]), "npm-cli.js");
    assert.equal(calls[1].args[1], "ci");
    assert.equal(calls[2].command, process.execPath);
    assert.equal(
      calls[2].args[0],
      path.join(inputs.repository, "tools", "ci", "install-native.mjs"),
    );
    assert.deepEqual(calls[2].args.slice(1, 3), ["lychee", "--asset"]);
    assert.deepEqual(calls[3].args.slice(1, 3), ["vale", "--asset"]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args) => {
      calls.push([command, path.basename(args[0]), args[1]]);
      if (args[1] === "--version") return "12.1.0\n";
      throw new Error("simulated offline cache miss");
    };
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner,
        }),
      /offline cache miss/u,
    );
    assert.deepEqual(calls, [
      [process.execPath, "npm-cli.js", "--version"],
      [process.execPath, "npm-cli.js", "ci"],
    ]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    mkdirSync(path.join(inputs.repository, "node_modules"));
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            throw new Error("must not run");
          },
        }),
      /node_modules/u,
    );
  });
});

test("universal npm cache excludes platform and private supply", () => {
  const packageEntry = {
    resolved: "https://registry.npmjs.org/example/-/example-1.0.0.tgz",
    integrity: `sha512-${Buffer.alloc(64).toString("base64")}`,
  };
  const lock = {
    lockfileVersion: 3,
    packages: { "": {}, "node_modules/example": packageEntry },
  };
  assert.equal(validateLockSupply(lock), 1);
  for (const changed of [
    { resolved: "http://registry.npmjs.org/example.tgz" },
    { resolved: "https://user:pass@registry.npmjs.org/example.tgz" },
    { resolved: "https://registry.npmjs.org/example.tgz?token=fixture" },
    { resolved: "https://other.example.test/example.tgz" },
    { optional: true },
    { os: ["darwin"] },
    { cpu: ["arm64"] },
    { hasInstallScript: true },
    { integrity: "" },
  ]) {
    assert.throws(() =>
      validateLockSupply({
        ...lock,
        packages: {
          ...lock.packages,
          "node_modules/example": { ...packageEntry, ...changed },
        },
      }),
    );
  }
});

test("tracked bundle identity rejects source drift", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const recordPath = path.join(
      inputs.repository,
      ".config",
      "release",
      "offline-bundle.json",
    );
    writeFileSync(recordPath, JSON.stringify(built));
    assert.deepEqual(readBundleRecord(inputs.repository), built);
    writeFileSync(path.join(inputs.repository, "package-lock.json"), "altered");
    assert.throws(() => readBundleRecord(inputs.repository), /source/u);
  });
});

test("an empty npm cache cannot satisfy the actual offline install", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-empty-cache-"));
  try {
    for (const name of ["package.json", "package-lock.json"]) {
      copyFileSync(path.join(root, name), path.join(directory, name));
    }
    const cache = path.join(directory, "cache");
    mkdirSync(cache);
    const userConfig = path.join(directory, "empty-user.npmrc");
    const globalConfig = path.join(directory, "empty-global.npmrc");
    writeFileSync(userConfig, "");
    writeFileSync(globalConfig, "");
    // Windows environment keys are case-insensitive; an inherited
    // NPM_CONFIG_CACHE can otherwise override this test's empty cache.
    const inheritedEnvironment = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          !/^npm_config_/iu.test(key) &&
          !["NPM_TOKEN", "NODE_AUTH_TOKEN"].includes(key),
      ),
    );
    const result = spawnSync(
      process.execPath,
      [
        npmCliPath(),
        "ci",
        "--offline",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
      ],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
        env: {
          ...inheritedEnvironment,
          npm_config_cache: cache,
          npm_config_userconfig: userConfig,
          npm_config_globalconfig: globalConfig,
          npm_config_offline: "true",
          npm_config_audit: "false",
          npm_config_fund: "false",
          npm_config_update_notifier: "false",
        },
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOTCACHED/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("public download errors retain their cause while credential-bearing errors do not", async () => {
  for (const [acquire, environment, provider, retainedCause] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
      "GitHub",
      true,
    ],
    [
      offline.acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
      "GitLab",
      false,
    ],
  ]) {
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(inputs.repository, ".config/release/offline-bundle.json"),
        JSON.stringify(built),
      );
      const native = Object.assign(new Error("native transport failed"), {
        code: "ECONNRESET",
      });
      let requests = 0;
      await assert.rejects(
        acquire({
          repository: inputs.repository,
          environment,
          fetcher: async () => {
            requests++;
            throw native;
          },
        }),
        (error) => {
          assert.equal(
            error.message,
            `${provider} release bundle download failed`,
          );
          assert.equal(error.cause, retainedCause ? native : undefined);
          assert.equal(Object.hasOwn(error, "cause"), retainedCause);
          return true;
        },
      );
      assert.equal(requests, 1, "transport errors do not cause a retry");
      assert.deepEqual(
        readdirSync(
          path.join(inputs.repository, "build/artifacts/offline-bundle"),
        ),
        [],
      );
    });
  }
});

test("GitHub acquisition uses the exact public asset without a CLI or credential", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    const recordPath = path.join(
      inputs.repository,
      ".config",
      "release",
      "offline-bundle.json",
    );
    writeFileSync(recordPath, JSON.stringify(built));
    const environment = {
      GITHUB_REPOSITORY: "Example/Repository",
      DDWG_RELEASE_TAG: "v4.2.0",
      GH_TOKEN: "must-not-forward",
    };
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(
        url,
        `https://github.com/Example/Repository/releases/download/v4.2.0/${built.fileName}`,
      );
      assert.equal(options.redirect, "follow");
      assert.deepEqual(options.headers, {});
      assert.ok(options.signal instanceof AbortSignal);
      return new Response(readFileSync(inputs.outputPath), { status: 200 });
    };
    const result = await acquireGitHubBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    assert.equal(
      (
        await acquireGitHubBundle({
          repository: inputs.repository,
          environment,
          fetcher: () => {
            throw new Error("must not download twice");
          },
        })
      ).sha256,
      built.sha256,
    );
    for (const changed of [
      { DDWG_RELEASE_TAG: "v4.1.1" },
      { GITHUB_REPOSITORY: "invalid" },
      { GITHUB_SERVER_URL: "http://github.example.test" },
    ]) {
      await assert.rejects(() =>
        acquireGitHubBundle({
          repository: inputs.repository,
          environment: { ...environment, ...changed },
          fetcher,
        }),
      );
    }
  });
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const target = path.join(
      inputs.repository,
      "build",
      "artifacts",
      "offline-bundle",
      built.fileName,
    );
    await assert.rejects(() =>
      acquireGitHubBundle({
        repository: inputs.repository,
        environment: {
          GITHUB_REPOSITORY: "Example/Repository",
          DDWG_RELEASE_TAG: "v4.2.0",
        },
        fetcher: async () => new Response("altered", { status: 200 }),
      }),
    );
    assert.equal(pathExistsForTest(target), false);
  });
});

test("public GitHub acquisition fails closed and removes only its failed output", async () => {
  for (const [fetcher, expected] of [
    [async () => new Response("missing", { status: 404 }), /HTTP 404/u],
    [async () => new Response(null, { status: 200 }), /download failed/u],
    [
      async () => {
        throw new Error("network failed");
      },
      /download failed/u,
    ],
    [
      async () => {
        const chunk = new Uint8Array(1024 * 1024);
        let count = 0;
        return new Response(
          new ReadableStream({
            pull(controller) {
              if (count++ < 513) controller.enqueue(chunk);
              else controller.close();
            },
          }),
        );
      },
      /exceeds the size limit/u,
    ],
  ]) {
    await buildFixture(async (inputs) => {
      const built = assembleBundle(inputs);
      writeFileSync(
        path.join(
          inputs.repository,
          ".config",
          "release",
          "offline-bundle.json",
        ),
        JSON.stringify(built),
      );
      await assert.rejects(
        () =>
          acquireGitHubBundle({
            repository: inputs.repository,
            environment: {
              GITHUB_REPOSITORY: "Example/Repository",
              DDWG_RELEASE_TAG: "v4.2.0",
            },
            fetcher,
          }),
        expected,
      );
      assert.equal(
        existsSync(
          path.join(
            inputs.repository,
            "build",
            "artifacts",
            "offline-bundle",
            built.fileName,
          ),
        ),
        false,
      );
      assert.equal(existsSync(inputs.outputPath), true);
    });
  }
});

test("rejected Forge downloads await response disposal without publishing output", async () => {
  for (const [acquire, environment, provider] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
      "GitHub",
    ],
    [
      offline.acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
      "GitLab",
    ],
  ]) {
    const cause = new Error("native response disposal failed");
    for (const cleanupFailure of [undefined, cause]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        let requests = 0;
        let disposed = false;
        const fetcher = async () => {
          requests += 1;
          return new Response(
            new ReadableStream({
              async cancel() {
                await new Promise((resolve) => setImmediate(resolve));
                disposed = true;
                if (cleanupFailure) throw cleanupFailure;
              },
            }),
            { status: 500 },
          );
        };
        await assert.rejects(
          acquire({ repository: inputs.repository, environment, fetcher }),
          (error) =>
            error.message ===
              `${provider} release bundle download failed: HTTP 500` &&
            error.cause === cleanupFailure &&
            Object.hasOwn(error, "cause") === (cleanupFailure !== undefined),
        );
        assert.equal(requests, 1);
        assert.equal(disposed, true);
        assert.deepEqual(
          readdirSync(
            path.join(inputs.repository, "build/artifacts/offline-bundle"),
          ),
          [],
        );
        assert.equal(existsSync(inputs.outputPath), true);
      });
    }
  }
});

test("a failed concurrent acquisition preserves either Forge's verified output", async () => {
  for (const [acquire, environment] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
    ],
    [
      offline.acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
    ],
  ]) {
    for (const failedResponse of [
      () => new Response(null, { status: 503 }),
      () => new Response("changed archive", { status: 200 }),
    ]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        const target = path.join(
          inputs.repository,
          "build/artifacts/offline-bundle",
          built.fileName,
        );
        const pending = Promise.withResolvers();
        const successful = acquire({
          repository: inputs.repository,
          environment,
          fetcher: async () => new Response(readFileSync(inputs.outputPath)),
        });
        const failed = assert.rejects(
          acquire({
            repository: inputs.repository,
            environment,
            fetcher: () => pending.promise,
          }),
          /HTTP 503|digest mismatch/u,
        );
        assert.equal((await successful).sha256, built.sha256);
        assert.equal(digest(readFileSync(target)), built.sha256);
        pending.resolve(failedResponse());
        await failed;
        assert.equal(digest(readFileSync(target)), built.sha256);
        assert.deepEqual(readdirSync(path.dirname(target)), [built.fileName]);
      });
    }
  }
});

test("bundle acquisition rejects linked managed parents before remote access", async () => {
  for (const [acquire, environment] of [
    [
      acquireGitHubBundle,
      { GITHUB_REPOSITORY: "Example/Repository", DDWG_RELEASE_TAG: "v4.2.0" },
    ],
    [
      offline.acquireGitLabBundle,
      {
        CI_API_V4_URL: "http://gitlab.example.test/api/v4",
        CI_PROJECT_ID: "42",
        CI_JOB_TOKEN: "fixture-only",
        CI_COMMIT_TAG: "v4.2.0",
        CI_PIPELINE_SOURCE: "api",
      },
    ],
  ]) {
    for (const relative of [
      "build",
      "build/artifacts",
      "build/artifacts/offline-bundle",
    ]) {
      await buildFixture(async (inputs) => {
        const built = assembleBundle(inputs);
        writeFileSync(
          path.join(inputs.repository, ".config/release/offline-bundle.json"),
          JSON.stringify(built),
        );
        const foreign = mkdtempSync(
          path.join(os.tmpdir(), "ddwg-acquisition-foreign-"),
        );
        const marker = path.join(foreign, "preserved.txt");
        writeFileSync(marker, "existing external content");
        const alias = path.join(inputs.repository, relative);
        mkdirSync(path.dirname(alias), { recursive: true });
        symlinkSync(foreign, alias, "junction");
        let requests = 0;
        try {
          await assert.rejects(
            acquire({
              repository: inputs.repository,
              environment,
              fetcher: async () => {
                requests += 1;
                return new Response(readFileSync(inputs.outputPath));
              },
            }),
            /regular|symbolic|directory/u,
          );
          assert.equal(requests, 0);
          assert.deepEqual(readdirSync(foreign), ["preserved.txt"]);
          assert.equal(
            readFileSync(marker, "utf8"),
            "existing external content",
          );
        } finally {
          unlinkSync(alias);
          rmSync(foreign, { recursive: true, force: true });
        }
      });
    }
  }
});

test("concurrent successful acquisitions converge without replacing a prior target", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config/release/offline-bundle.json"),
      JSON.stringify(built),
    );
    const options = {
      repository: inputs.repository,
      environment: {
        GITHUB_REPOSITORY: "Example/Repository",
        DDWG_RELEASE_TAG: "v4.2.0",
      },
      fetcher: async () => new Response(readFileSync(inputs.outputPath)),
    };
    const results = await Promise.all([
      acquireGitHubBundle(options),
      acquireGitHubBundle(options),
    ]);
    assert.deepEqual(
      results.map((result) => result.sha256),
      [built.sha256, built.sha256],
    );
    const target = path.join(
      inputs.repository,
      "build/artifacts/offline-bundle",
      built.fileName,
    );
    writeFileSync(target, "unqualified existing output");
    await assert.rejects(
      acquireGitHubBundle({
        ...options,
        fetcher: () => {
          throw new Error("an existing target must not be replaced");
        },
      }),
      /digest mismatch/u,
    );
    assert.equal(readFileSync(target, "utf8"), "unqualified existing output");
  });
});

test("GitLab candidate acquisition binds accepted job source to the frozen digest", () => {
  const bundle = record();
  const environment = {
    CI_API_V4_URL: "http://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "12345",
    CI_JOB_TOKEN: "fixture-only",
    CI_COMMIT_BRANCH: "dev",
    CI_COMMIT_REF_PROTECTED: "true",
    CI_PIPELINE_SOURCE: "api",
    DDWG_OFFLINE_CANDIDATE: bundle.sha256,
  };
  for (const branch of ["dev", "main"]) {
    for (const event of ["api", "web"]) {
      const request = offline.gitlabBundleRequest(bundle, {
        ...environment,
        CI_COMMIT_BRANCH: branch,
        CI_PIPELINE_SOURCE: event,
      });
      assert.equal(
        request.url,
        `http://gitlab.example.test/api/v4/projects/12345/packages/generic/offline-qualification/sha256-${bundle.sha256}/${bundle.fileName}`,
      );
      assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
      assert.equal(request.redirect, "error");
    }
  }
  for (const changed of [
    { CI_COMMIT_BRANCH: "proposal/review" },
    { CI_COMMIT_BRANCH: "work/local" },
    { CI_COMMIT_BRANCH: "candidate/dev" },
    { CI_COMMIT_REF_PROTECTED: "false" },
    { CI_COMMIT_REF_PROTECTED: undefined },
    { CI_COMMIT_TAG: "v4.2.0" },
    { CI_PIPELINE_SOURCE: "push" },
    { CI_PIPELINE_SOURCE: "merge_request_event" },
    { DDWG_OFFLINE_CANDIDATE: digest("other bundle") },
    { DDWG_OFFLINE_CANDIDATE: "../unbound" },
  ]) {
    assert.throws(
      () => offline.gitlabBundleRequest(bundle, { ...environment, ...changed }),
      /candidate qualification/u,
    );
  }
});

test("GitLab candidate acquisition verifies exact bytes and retires its download stage", async () => {
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_BRANCH: "dev",
      CI_COMMIT_REF_PROTECTED: "true",
      CI_PIPELINE_SOURCE: "api",
      DDWG_OFFLINE_CANDIDATE: built.sha256,
    };
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(
        url,
        `http://gitlab.example.test/api/v4/projects/12345/packages/generic/offline-qualification/sha256-${built.sha256}/${built.fileName}`,
      );
      assert.deepEqual(options.headers, { "JOB-TOKEN": "fixture-only" });
      assert.equal(options.redirect, "error");
      return new Response(readFileSync(inputs.outputPath));
    };
    const result = await offline.acquireGitLabBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    const directory = path.join(
      inputs.repository,
      "build/artifacts/offline-bundle",
    );
    assert.deepEqual(readdirSync(directory), [built.fileName]);
    assert.equal(
      digest(readFileSync(path.join(directory, built.fileName))),
      built.sha256,
    );
  });
});

test("GitLab acquisition uses only the same project's pinned release package", async () => {
  assert.equal(typeof offline.gitlabBundleRequest, "function");
  assert.equal(typeof offline.acquireGitLabBundle, "function");
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_TAG: "v4.2.0",
      CI_PIPELINE_SOURCE: "api",
    };
    const request = offline.gitlabBundleRequest(built, environment);
    assert.equal(
      request.url,
      `http://gitlab.example.test/api/v4/projects/12345/packages/generic/release-assets/v4.2.0/${built.fileName}`,
    );
    assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
    assert.equal(request.redirect, "error");
    for (const changed of [
      { CI_API_V4_URL: "http://gitlab.example.test/other" },
      { CI_PROJECT_ID: "other" },
      { CI_JOB_TOKEN: "" },
      { CI_JOB_TOKEN: "line\nbreak" },
      { CI_COMMIT_TAG: "v4.1.1" },
      { CI_PIPELINE_SOURCE: "push" },
    ]) {
      assert.throws(() =>
        offline.gitlabBundleRequest(built, { ...environment, ...changed }),
      );
    }
    assert.throws(
      () =>
        offline.gitlabBundleRequest(
          { ...built, fileName: "../outside.tar.gz" },
          environment,
        ),
      /asset name/u,
    );
    const bytes = readFileSync(inputs.outputPath);
    let calls = 0;
    const fetcher = async (url, options) => {
      calls += 1;
      assert.equal(url, request.url);
      assert.equal(options.redirect, "error");
      assert.equal(options.headers["JOB-TOKEN"], "fixture-only");
      return new Response(bytes, { status: 200 });
    };
    const result = await offline.acquireGitLabBundle({
      repository: inputs.repository,
      environment,
      fetcher,
    });
    assert.equal(result.sha256, built.sha256);
    assert.equal(calls, 1);
    assert.equal(
      (
        await offline.acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher: () => {
            throw new Error("must not download twice");
          },
        })
      ).sha256,
      built.sha256,
    );
  });
  await buildFixture(async (inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, ".config", "release", "offline-bundle.json"),
      JSON.stringify(built),
    );
    const target = path.join(
      inputs.repository,
      "build",
      "artifacts",
      "offline-bundle",
      built.fileName,
    );
    const environment = {
      CI_API_V4_URL: "http://gitlab.example.test/api/v4",
      CI_PROJECT_ID: "12345",
      CI_JOB_TOKEN: "fixture-only",
      CI_COMMIT_TAG: "v4.2.0",
      CI_PIPELINE_SOURCE: "api",
    };
    for (const fetcher of [
      async () => new Response("altered", { status: 200 }),
      async () =>
        new Response("redirect", {
          status: 302,
          headers: { Location: "https://other.example.test/asset" },
        }),
      async () => new Response("missing", { status: 404 }),
    ]) {
      await assert.rejects(() =>
        offline.acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher,
        }),
      );
      assert.equal(pathExistsForTest(target), false);
    }
    await assert.rejects(
      () =>
        offline.acquireGitLabBundle({
          repository: inputs.repository,
          environment,
          fetcher: async () => {
            throw new Error("fixture-only must not leak");
          },
        }),
      (error) =>
        error.message === "GitLab release bundle download failed" &&
        !error.message.includes("fixture-only"),
    );
  });
});

function pathExistsForTest(file) {
  try {
    readFileSync(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

test("npm CLI is a JavaScript entrypoint on POSIX and Windows layouts", () => {
  const actual = npmCliPath();
  assert.equal(path.basename(actual), "npm-cli.js");
  const version = spawnSync(process.execPath, [actual, "--version"], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.equal(version.status, 0, version.stderr);
  assert.match(version.stdout, /^[1-9]\d*\.\d+\.\d+\s*$/u);
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-layout-"));
  try {
    const cli = path.join(
      directory,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    mkdirSync(path.dirname(cli), { recursive: true });
    writeFileSync(path.join(directory, "npm.cmd"), "fixture");
    writeFileSync(cli, "fixture");
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: directory,
        npmExecPath: null,
      }),
      cli,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("npm entrypoint follows its native execution and Windows prefix authority", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-authority-"));
  try {
    const adjacent = path.join(
      directory,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    const prefix = path.join(directory, "global-prefix");
    const selected = path.join(
      prefix,
      "node_modules",
      "npm",
      "bin",
      "npm-cli.js",
    );
    for (const file of [adjacent, selected]) {
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "fixture");
    }
    writeFileSync(path.join(directory, "npm.cmd"), "fixture");
    writeFileSync(
      path.join(path.dirname(adjacent), "npm-prefix.js"),
      `process.stdout.write(${JSON.stringify(prefix)})`,
    );
    assert.equal(
      npmCliPath({
        platform: "win32",
        pathValue: directory,
        npmExecPath: null,
      }),
      realpathSync(selected),
    );
    assert.equal(
      npmCliPath({ pathValue: directory, npmExecPath: selected }),
      realpathSync(selected),
    );
    assert.throws(
      () =>
        npmCliPath({
          pathValue: directory,
          npmExecPath: path.join(directory, "missing.js"),
        }),
      /native npm execution entrypoint/u,
    );
    writeFileSync(
      path.join(path.dirname(adjacent), "npm-prefix.js"),
      "process.exit(1)",
    );
    assert.throws(
      () =>
        npmCliPath({
          platform: "win32",
          pathValue: directory,
          npmExecPath: null,
        }),
      /native Windows npm prefix/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("release route records the bundle before inspecting it", () => {
  const guide = readFileSync(path.join(root, "CONTRIBUTING.md"), "utf8");
  const build = guide.indexOf("node tools/ci/offline-bundle.mjs build");
  const record = guide.indexOf("Put that exact reviewed JSON");
  const inspect = guide.indexOf(
    "node tools/ci/offline-bundle.mjs inspect --bundle BUNDLE_PATH",
  );
  assert.ok(build >= 0 && record > build && inspect > record);
});

test("release route runs the full source check after bundle identity is updated", () => {
  const guide = readFileSync(path.join(root, "CONTRIBUTING.md"), "utf8");
  const release = guide.split("## Publish a release")[1];
  assert.ok(release);
  const record = release.indexOf("Put that exact reviewed JSON");
  const verify = release.indexOf("`npm run verify`");
  assert.ok(record >= 0 && verify > record);
});

test("release route commits source before a clean-checkout install", () => {
  const guide = readFileSync(
    path.join(root, "CONTRIBUTING.md"),
    "utf8",
  ).replace(/\s+/gu, " ");
  const commit = guide.indexOf("Commit with the configured trusted SSH signer");
  const cold = guide.indexOf("From a fresh checkout of the committed source");
  assert.ok(commit >= 0 && cold > commit);
});

test("release route requires both Forge source matrices before tagging", () => {
  const guide = readFileSync(
    path.join(root, "CONTRIBUTING.md"),
    "utf8",
  ).replace(/\s+/gu, " ");
  const source = guide.indexOf("require every declared source job to pass");
  const tag = guide.indexOf("Only then sign an annotated");
  assert.ok(source >= 0 && tag > source);
});

test("npm owns exact package-manager admission without duplicate fields", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );
  assert.deepEqual(manifest.devEngines?.packageManager, {
    name: "npm",
    version: "12.2.0",
    onFail: "error",
  });
  assert.equal(manifest.packageManager, undefined);
  assert.equal(manifest.engines?.npm, undefined);
});

function assertNpmResult(result, expectedStatus, args) {
  const diagnostic = JSON.stringify(
    {
      args,
      expectedStatus,
      status: result.status,
      signal: result.signal,
      error: result.error && {
        name: result.error.name,
        message: result.error.message,
        code: result.error.code,
        path: result.error.path,
        syscall: result.error.syscall,
      },
      stdout: result.stdout,
      stderr: result.stderr,
    },
    null,
    2,
  );
  assert.equal(result.error, undefined, diagnostic);
  assert.equal(result.status, expectedStatus, diagnostic);
  return diagnostic;
}

test("native npm result assertions preserve process failure diagnostics", () => {
  const result = {
    status: null,
    signal: "SIGTERM",
    error: Object.assign(new Error("native npm timed out"), {
      code: "ETIMEDOUT",
      path: process.execPath,
      syscall: "spawnSync",
    }),
    stdout: "partial native npm stdout",
    stderr: "partial native npm stderr",
  };
  assert.throws(
    () => assertNpmResult(result, 1, ["install", "--ignore-scripts"]),
    (error) => {
      for (const value of [
        "install",
        "SIGTERM",
        "ETIMEDOUT",
        "spawnSync",
        "partial native npm stdout",
        "partial native npm stderr",
        JSON.stringify(process.execPath).slice(1, -1),
      ]) {
        assert.ok(
          error.message.includes(value),
          `missing diagnostic: ${value}`,
        );
      }
      return true;
    },
  );
  assert.doesNotThrow(() =>
    assertNpmResult({ status: 1, stderr: "native npm refusal" }, 1, ["ci"]),
  );
});

test("native npm rejects mismatched install, ci, and run before effects", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-admission-"));
  try {
    const marker = path.join(directory, "effect");
    const manifest = {
      name: "native-admission-fixture",
      version: "1.0.0",
      private: true,
      scripts: {
        effect:
          "node -e \"require('node:fs').writeFileSync('effect', 'unexpected')\"",
      },
      devEngines: {
        packageManager: { name: "npm", version: "0.0.0", onFail: "error" },
      },
    };
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify(manifest),
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify({
        name: manifest.name,
        version: manifest.version,
        lockfileVersion: 3,
        packages: { "": { name: manifest.name, version: manifest.version } },
      }),
    );
    const cli = npmCliPath();
    const env = isolatedNpmEnvironment(
      directory,
      path.join(directory, "cache"),
    );
    for (const args of [
      ["install", "--ignore-scripts"],
      ["ci", "--ignore-scripts"],
      ["run", "effect"],
    ]) {
      const result = spawnSync(process.execPath, [cli, ...args], {
        cwd: directory,
        env,
        encoding: "utf8",
        timeout: 15_000,
        input: "",
      });
      const diagnostic = assertNpmResult(result, 1, args);
      assert.match(result.stderr, /EBADDEVENGINES/u, diagnostic);
      assert.equal(existsSync(marker), false, diagnostic);
      assert.equal(
        existsSync(path.join(directory, "node_modules")),
        false,
        diagnostic,
      );
    }
    const version = spawnSync(process.execPath, [cli, "--version"], {
      cwd: directory,
      env,
      encoding: "utf8",
      timeout: 10_000,
      input: "",
    });
    const versionDiagnostic = assertNpmResult(version, 0, ["--version"]);
    const versionText = version.stdout.trim();
    assert.doesNotThrow(() => strictVersion(versionText), versionDiagnostic);
    manifest.devEngines.packageManager.version = versionText;
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify(manifest),
    );
    for (const args of [
      ["install", "--ignore-scripts"],
      ["ci", "--ignore-scripts"],
    ]) {
      const result = spawnSync(process.execPath, [cli, ...args], {
        cwd: directory,
        env,
        encoding: "utf8",
        timeout: 15_000,
        input: "",
      });
      assertNpmResult(result, 0, args);
    }
    const allowed = spawnSync(process.execPath, [cli, "run", "effect"], {
      cwd: directory,
      env,
      encoding: "utf8",
      timeout: 15_000,
      input: "",
    });
    const allowedDiagnostic = assertNpmResult(allowed, 0, ["run", "effect"]);
    assert.equal(existsSync(marker), true, allowedDiagnostic);
    assert.equal(readFileSync(marker, "utf8"), "unexpected", allowedDiagnostic);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("offline supply binds the native package-manager policy bytes", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    writeFileSync(
      path.join(inputs.repository, "package.json"),
      JSON.stringify({
        engines: { node: "26.x" },
        devEngines: {
          packageManager: { name: "npm", version: "0.0.0", onFail: "error" },
        },
      }),
    );
    assert.throws(
      () =>
        validateBundleRecord(built, offline.sourceIdentity(inputs.repository)),
      /source/u,
    );
  });
});

test("a bundle covers both native owners and their notices", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const stage = path.join(path.dirname(inputs.outputPath), "qualified");
    mkdirSync(stage);
    runCommand("tar", ["-xf", inputs.outputPath, "-C", stage]);
    assert.doesNotThrow(() =>
      validateExtractedBundle(stage, inputs.repository),
    );
    const supply = JSON.parse(
      readFileSync(path.join(inputs.repository, ".config/supply/native.json")),
    );
    const valeAsset = path.join(
      stage,
      "native",
      "vale",
      Object.values(supply.tools.vale.assets)[0].name,
    );
    const original = readFileSync(valeAsset);
    writeFileSync(valeAsset, "changed");
    assert.throws(
      () => validateExtractedBundle(stage, inputs.repository),
      /asset.*digest/u,
    );
    writeFileSync(valeAsset, original);
    rmSync(path.join(stage, "licenses", "vale", "LICENSE"));
    assert.throws(
      () => validateExtractedBundle(stage, inputs.repository),
      /license/u,
    );
    assert.equal(built.schemaVersion, 4);
    assert.equal("lycheeSha256" in built, false);
  });
});
