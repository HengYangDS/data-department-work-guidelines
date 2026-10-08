import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
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
  managedToolPath,
  nativeToolBinary,
  reportError,
  root,
} from "../tools/docs/runtime.mjs";

test("official supply declares exactly the supported platform assets", () => {
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

test("all native consumers share the declared managed path", () => {
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    for (const platform of Object.keys(descriptor.assets)) {
      assert.equal(
        managedToolPath(tool, platform),
        path.join(
          root,
          "build/runtime/tool-cache",
          tool,
          descriptor.version,
          platform,
          descriptor.binary + (platform.startsWith("win32-") ? ".exe" : ""),
        ),
      );
    }
  }
  assert.throws(() => managedToolPath("constructor"), /unknown native tool/u);
  assert.throws(() => managedToolPath("lychee", "win32-arm64"), /unsupported/u);
});

test("native tool identities must name declared manifest entries", () => {
  for (const tool of ["constructor", "toString", "missing-tool"]) {
    const expected = `unknown native tool: ${tool}`;
    for (const select of [selectedAsset, nativeToolBinary]) {
      assert.throws(
        () => select(tool),
        (error) => error.message === expected,
      );
    }
  }
});

test("explicit native tool selectors use portable names and retain version admission", (context) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-native-selector-"),
  );
  const actual = childProcess.spawnSync;
  const saved = new Map();
  let expected;
  let version;
  let executions = 0;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (command !== expected) return actual(command, args, options);
      assert.deepEqual(args, ["--version"]);
      assert.equal(options.timeout, 10_000);
      executions++;
      return { status: 0, stdout: version, stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    for (const [tool, descriptor] of Object.entries(manifest.tools)) {
      const key = `DDWG_${tool.toUpperCase().replaceAll("-", "_")}_BIN`;
      saved.set(key, process.env[key]);
      expected = path.join(
        directory,
        descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
      );
      fs.writeFileSync(expected, "independently owned tool fixture");
      if (process.platform !== "win32") fs.chmodSync(expected, 0o755);
      process.env[key] = expected;
      version = descriptor.versionOutput;
      assert.equal(nativeToolBinary(tool), expected, tool);
      version = "unexpected version\n";
      assert.throws(() => nativeToolBinary(tool), /version mismatch/u);
    }
    assert.equal(executions, Object.keys(manifest.tools).length * 2);
  } finally {
    for (const [key, value] of saved) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    mock.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("explicit native selectors preserve filesystem path semantics", (context) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ddwg-native-filesystem-selector-"),
  );
  const descriptor = manifest.tools.vale;
  const filename =
    descriptor.binary + (process.platform === "win32" ? ".exe" : "");
  const binary = path.join(directory, filename);
  const originalSelection = process.env.DDWG_VALE_BIN;
  let expected = binary;
  let executions = 0;
  const spawn = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args) => {
      assert.equal(command, expected);
      assert.deepEqual(args, ["--version"]);
      executions += 1;
      return { status: 0, stdout: descriptor.versionOutput, stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    fs.writeFileSync(binary, "independently owned executable fixture");
    if (process.platform !== "win32") fs.chmodSync(binary, 0o755);
    process.env.DDWG_VALE_BIN = binary + path.sep;
    assert.throws(() => nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      0,
      "a directory-qualified file cannot be executed",
    );
    process.env.DDWG_VALE_BIN = binary;
    assert.equal(nativeToolBinary("vale"), binary);
    if (process.platform !== "win32") {
      const target = path.join(directory, "target");
      fs.mkdirSync(path.join(target, "nested"), { recursive: true });
      fs.writeFileSync(
        path.join(target, filename),
        "filesystem-resolved fixture",
      );
      fs.chmodSync(path.join(target, filename), 0o755);
      fs.symlinkSync(
        path.join(target, "nested"),
        path.join(directory, "alias"),
      );
      expected = directory + "/alias/../" + filename;
      assert.equal(
        fs.readFileSync(expected, "utf8"),
        "filesystem-resolved fixture",
      );
      process.env.DDWG_VALE_BIN = expected;
      assert.equal(nativeToolBinary("vale"), expected);
      assert.equal(
        executions,
        2,
        "the native path must not select the lexical sibling",
      );
    }
  } finally {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
    spawn.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("native assets validate every declared size before supply effects", () => {
  for (const tool of ["lychee", "osv-scanner"]) {
    const selected = selectedAsset(tool);
    const pin = manifest.tools[tool].assets[selected.key];
    const original = { ...pin };
    try {
      for (const size of ["unbounded", -1, 64 * 1024 * 1024 + 1]) {
        pin.size = size;
        assert.throws(() => selectedAsset(tool), /format|size/u);
      }
      pin.size = 32;
      assert.equal(selectedAsset(tool).size, 32);
    } finally {
      if (Object.hasOwn(original, "size")) pin.size = original.size;
      else delete pin.size;
    }
  }
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

test("GitLab package URLs preserve the exact origin and supported API prefix", () => {
  const asset = selectedAsset("lychee", "linux", "arm64");
  for (const api of [
    "http://gitlab.example.test/api/v4",
    "https://gitlab.example.test/team/api/v4/",
  ]) {
    const request = gitlabPackageRequest("lychee", asset, {
      CI_API_V4_URL: api,
      CI_PROJECT_ID: "42",
      CI_JOB_TOKEN: "fixture-only",
    });
    const expected = new URL(api);
    const actual = new URL(request.url);
    assert.equal(actual.origin, expected.origin);
    assert.equal(
      actual.pathname,
      `${expected.pathname.replace(/\/+$/u, "")}/projects/42/packages/generic/lychee/0.24.2/${asset.name}`,
    );
  }
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
    { CI_API_V4_URL: "http://gitlab.example.test//api/v4" },
    { CI_API_V4_URL: "ftp://gitlab.example.test/api/v4" },
    { CI_PROJECT_ID: "42/other" },
    { CI_JOB_TOKEN: "" },
    { CI_JOB_TOKEN: "fixture\u0000only" },
    { CI_JOB_TOKEN: "fixture\u0100only" },
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

test("native asset streaming admits the exact size and refuses one extra byte", async (context) => {
  const admitted = Buffer.from("bounded");
  let bytes = admitted;
  const asset = { size: admitted.length };
  const original = Object.assign(
    new Error("fixture-only cancellation failed"),
    {
      code: "ECONNRESET",
    },
  );
  let cancellationFails = false;
  let cancellations = 0;
  context.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(bytes);
            if (bytes.length === asset.size) controller.close();
          },
          cancel() {
            cancellations++;
            if (cancellationFails) throw original;
          },
        }),
      ),
  );
  for (const authenticated of [false, true]) {
    const request = {
      url: "https://fixture.invalid/asset",
      ...(authenticated
        ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
        : {}),
    };
    bytes = Buffer.concat([admitted, Buffer.from("!")]);
    cancellationFails = false;
    await assert.rejects(downloadAsset(request, asset), /size limit/u);
    cancellationFails = true;
    await assert.rejects(downloadAsset(request, asset), (error) => {
      assert.equal(
        error.message,
        "native tool download exceeds the size limit",
      );
      if (authenticated) {
        assert.notEqual(error.cause, original);
        assert.equal(error.cause.code, "ECONNRESET");
        assert.doesNotMatch(error.cause.message, /fixture-only/u);
        assert.equal(Object.hasOwn(error.cause, "cause"), false);
      } else assert.equal(error.cause, original);
      return true;
    });
    bytes = admitted;
    assert.deepEqual(await downloadAsset(request, asset), admitted);
  }
  assert.equal(cancellations, 4, "each rejected stream is disposed once");
});

test("native transport errors follow the public and authenticated cause boundary", async (context) => {
  const cause = Object.assign(new Error("native transport failed"), {
    code: "ECONNRESET",
  });
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw cause;
  });
  for (const authenticated of [false, true]) {
    await assert.rejects(
      downloadAsset({
        url: "https://fixture.invalid/asset",
        ...(authenticated
          ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
          : {}),
      }),
      (error) => {
        assert.equal(error.message, "native tool download failed");
        if (authenticated) {
          assert.notEqual(error.cause, cause);
          assert.equal(error.cause.code, "ECONNRESET");
          assert.doesNotMatch(error.cause.message, /native transport failed/u);
        } else {
          assert.equal(error.cause, cause);
        }
        return true;
      },
    );
  }
  assert.equal(requests, 2, "transport failures do not trigger retries");
});

test("native body-stream and response-disposal errors preserve safe context without exposing authenticated causes", async (context) => {
  const original = Object.assign(
    new Error("fixture-only authenticated body failed"),
    { code: "UND_ERR_BODY_TIMEOUT" },
  );
  let response;
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests++;
    return response;
  });
  for (const authenticated of [false, true]) {
    const request = {
      url: "https://fixture.invalid/asset",
      ...(authenticated
        ? { headers: { "JOB-TOKEN": "fixture-only" }, redirect: "error" }
        : {}),
    };
    for (const phase of ["body", "dispose"]) {
      response =
        phase === "body"
          ? new Response(
              new ReadableStream({
                start(controller) {
                  controller.enqueue(Buffer.from("partial bytes"));
                },
                pull(controller) {
                  controller.error(original);
                },
              }),
            )
          : new Response(
              new ReadableStream({
                cancel() {
                  throw original;
                },
              }),
              { status: 500 },
            );
      await assert.rejects(downloadAsset(request), (error) => {
        assert.equal(
          error.message,
          phase === "body"
            ? "native tool download body failed"
            : "native tool download failed: HTTP 500",
        );
        if (authenticated) {
          assert.notEqual(error.cause, original);
          assert.equal(error.cause.code, "UND_ERR_BODY_TIMEOUT");
          assert.doesNotMatch(error.cause.message, /fixture-only/u);
          assert.equal(Object.hasOwn(error.cause, "cause"), false);
        } else assert.equal(error.cause, original);
        return true;
      });
    }
  }
  assert.equal(
    requests,
    4,
    "body and disposal failures do not trigger retries",
  );
});

test("real authenticated redirects are refused without forwarding identity", async () => {
  const requests = [];
  const server = createServer((request, response) => {
    requests.push({ path: request.url, token: request.headers["job-token"] });
    response.writeHead(302, { Location: "/outside" });
    response.end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const request = gitlabPackageRequest("lychee", selectedAsset("lychee"), {
      CI_API_V4_URL: `http://127.0.0.1:${server.address().port}/api/v4`,
      CI_PROJECT_ID: "42",
      CI_JOB_TOKEN: "fixture-only",
    });
    await assert.rejects(downloadAsset(request), (error) => {
      assert.match(error.cause?.message ?? "", /redirect refused/u);
      assert.doesNotMatch(
        `${error.message} ${error.cause?.message}`,
        /fixture-only/u,
      );
      return true;
    });
    assert.equal(requests.length, 1);
    assert.notEqual(requests[0].path, "/outside");
    assert.equal(requests[0].token, "fixture-only");
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("rejected native downloads await response disposal and retain its failure", async (context) => {
  let response;
  let requests = 0;
  context.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return response;
  });
  for (const status of [500, 302]) {
    const cause = new Error("native response disposal failed");
    for (const cleanupFailure of [undefined, cause]) {
      requests = 0;
      let disposed = false;
      response = new Response(
        new ReadableStream({
          async cancel() {
            await new Promise((resolve) => setImmediate(resolve));
            disposed = true;
            if (cleanupFailure) throw cleanupFailure;
          },
        }),
        { status },
      );
      await assert.rejects(
        downloadAsset({ url: "https://fixture.invalid/asset" }),
        (error) =>
          error.message === `native tool download failed: HTTP ${status}` &&
          error.cause === cleanupFailure &&
          Object.hasOwn(error, "cause") === (cleanupFailure !== undefined),
      );
      assert.equal(requests, 1);
      assert.equal(disposed, true);
    }
  }
});

test("a rejected live HTTP stream closes before test teardown", async () => {
  let requests = 0;
  const closed = Promise.withResolvers();
  const deadline = new AbortController();
  const server = createServer((request, response) => {
    requests += 1;
    response.on("close", () => closed.resolve(true));
    response.writeHead(500);
    response.write("failed native asset");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    await assert.rejects(
      downloadAsset({
        url: `http://127.0.0.1:${server.address().port}/asset`,
      }),
      /native tool download failed: HTTP 500/u,
    );
    assert.equal(
      await Promise.race([
        closed.promise,
        delay(2000, false, { signal: deadline.signal }),
      ]),
      true,
      "rejected response must close before fallback teardown",
    );
    assert.equal(requests, 1);
  } finally {
    deadline.abort();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
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

test("one supply manifest declares the selected native tools without a retired entry", () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(Object.keys(manifest.tools), [
    "lychee",
    "vale",
    "osv-scanner",
  ]);
  const vale = manifest.tools.vale;
  const platforms = Object.keys(manifest.tools.lychee.assets).sort();
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    assert.deepEqual(
      Object.keys(descriptor.assets).sort(),
      platforms,
      `${tool} supply must match the complete supported tool graph`,
    );
  }
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

test("official OSV supply pins raw binaries and notices for every native host", () => {
  const descriptor = manifest.tools["osv-scanner"];
  assert.ok(descriptor, "the existing supply owner must declare OSV Scanner");
  assert.equal(descriptor.format, "binary");
  assert.deepEqual(
    Object.keys(descriptor.assets).sort(),
    Object.keys(manifest.tools.lychee.assets).sort(),
  );
  for (const [key, asset] of Object.entries(descriptor.assets)) {
    const selected = selectedAsset("osv-scanner", ...key.split("-"));
    assert.equal(selected.format, "binary");
    assert.equal(selected.size, asset.size);
    assert.ok(selected.size > 32 * 1024 * 1024);
    assert.ok(selected.size < 64 * 1024 * 1024);
    assert.match(selected.sha256, /^[0-9a-f]{64}$/u);
    assert.match(selected.url, /google\/osv-scanner\/releases\/download/u);
  }
  assert.deepEqual(Object.keys(descriptor.licenses), ["LICENSE"]);
  assert.match(descriptor.licenses.LICENSE.sha256, /^[0-9a-f]{64}$/u);
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

test("managed cached binaries verify bytes before version execution", async () => {
  const directory = fs.realpathSync.native(
    fs.mkdtempSync(path.join(os.tmpdir(), "ddwg-native-integrity-")),
  );
  try {
    const runtime = path.join(directory, "tools/docs/runtime.mjs");
    const installer = path.join(directory, "tools/ci/install-native.mjs");
    for (const relative of [
      "tools/docs/runtime.mjs",
      "tools/ci/install-native.mjs",
      "tools/ci/gitlab-package.mjs",
    ]) {
      const destination = path.join(directory, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(root, relative), destination);
    }
    const descriptor = manifest.tools.vale;
    const key = `${process.platform}-${process.arch}`;
    const target = path.join(
      directory,
      "build/runtime/tool-cache/vale",
      descriptor.version,
      key,
      descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
    );
    const fixture = JSON.parse(JSON.stringify(manifest));
    const trusted = Buffer.from("trusted native fixture bytes");
    fixture.tools.vale.assets[key].binarySha256 = createHash("sha256")
      .update(trusted)
      .digest("hex");
    const supply = path.join(directory, ".config/supply/native.json");
    fs.mkdirSync(path.dirname(supply), { recursive: true });
    fs.writeFileSync(supply, JSON.stringify(fixture));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "changed binary with the same reported version");
    if (process.platform !== "win32") fs.chmodSync(target, 0o755);
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import assert from "node:assert/strict";
        import fs from "node:fs";
        import childProcess from "node:child_process";
        import { pathToFileURL } from "node:url";
        import { syncBuiltinESMExports } from "node:module";
        const target = process.env.DDWG_FIXTURE_TARGET;
        const commandName = process.env.DDWG_FIXTURE_COMMAND;
        const expectedVersion = process.env.DDWG_FIXTURE_VERSION;
        let executions = 0;
        childProcess.spawnSync = (command, args) => {
          assert.ok(command === target || command === commandName || command === target + ".unbound");
          assert.deepEqual(args, ["--version"]);
          executions += 1;
          return { status: 0, stdout: expectedVersion, stderr: "" };
        };
        syncBuiltinESMExports();
        const runtime = await import(pathToFileURL(process.env.DDWG_FIXTURE_RUNTIME));
        const installer = await import(pathToFileURL(process.env.DDWG_FIXTURE_INSTALLER));
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        await assert.rejects(installer.install({ tool: "vale" }), /binary digest mismatch/);
        process.env.DDWG_VALE_BIN = target;
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        process.env.DDWG_VALE_BIN = commandName;
        process.env.PATH = process.env.DDWG_FIXTURE_PATH;
        assert.throws(() => runtime.nativeToolBinary("vale"), /binary digest mismatch/);
        const misplaced = target + ".unbound";
        fs.writeFileSync(misplaced, "unbound managed bytes");
        if (process.platform !== "win32") fs.chmodSync(misplaced, 0o755);
        process.env.DDWG_VALE_BIN = misplaced;
        assert.throws(() => runtime.nativeToolBinary("vale"), /managed.*identity/);
        delete process.env.DDWG_VALE_BIN;
        assert.equal(executions, 0, "changed cache must not execute");
        fs.writeFileSync(target, "trusted native fixture bytes");
        assert.equal(runtime.nativeToolBinary("vale"), target);
        assert.equal(await installer.install({ tool: "vale" }), target);
        assert.equal(executions, 2, "valid cache still checks its native version");
        process.env.DDWG_VALE_BIN = commandName;
        assert.equal(runtime.nativeToolBinary("vale"), target);
        delete process.env.DDWG_VALE_BIN;
        assert.equal(executions, 3, "PATH selection binds the same valid executable");
        const supply = process.env.DDWG_FIXTURE_SUPPLY;
        const manifest = JSON.parse(fs.readFileSync(supply, "utf8"));
        delete manifest.tools.vale.assets[process.env.DDWG_FIXTURE_KEY].binarySha256;
        fs.writeFileSync(supply, JSON.stringify(manifest));
        assert.throws(() => runtime.nativeToolBinary("vale"), /unpinned.*binary/);
        delete installer.manifest.tools.vale.assets[process.env.DDWG_FIXTURE_KEY].binarySha256;
        await assert.rejects(installer.install({ tool: "vale" }), /unpinned.*binary/);
        assert.equal(executions, 3, "missing byte identity must not execute");`,
      ],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 10_000,
        env: {
          ...process.env,
          DDWG_VALE_BIN: "",
          DDWG_FIXTURE_TARGET: target,
          DDWG_FIXTURE_COMMAND: path.basename(target),
          DDWG_FIXTURE_PATH: path.dirname(target),
          DDWG_FIXTURE_VERSION: descriptor.versionOutput,
          DDWG_FIXTURE_RUNTIME: runtime,
          DDWG_FIXTURE_INSTALLER: installer,
          DDWG_FIXTURE_SUPPLY: supply,
          DDWG_FIXTURE_KEY: key,
        },
      },
    );
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stderr);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
});

test("Windows native selection binds quoted paths and direct suffixes before execution", async (context) => {
  const directory = fs.realpathSync.native(
    fs.mkdtempSync(path.join(os.tmpdir(), "ddwg-native-windows-lookup-")),
  );
  const runtimePath = path.join(directory, "tools/docs/runtime.mjs");
  const target = path.join(
    directory,
    "build/runtime/tool-cache/vale",
    manifest.tools.vale.version,
    "win32-x64/vale.exe",
  );
  const fixture = JSON.parse(JSON.stringify(manifest));
  const trusted = Buffer.from("trusted Windows native fixture bytes");
  fixture.tools.vale.assets["win32-x64"].binarySha256 = createHash("sha256")
    .update(trusted)
    .digest("hex");
  const originalPlatform = Object.getOwnPropertyDescriptor(process, "platform");
  const originalArch = Object.getOwnPropertyDescriptor(process, "arch");
  const originalPath = process.env.PATH;
  const originalSelection = process.env.DDWG_VALE_BIN;
  let executions = 0;
  let expected = target;
  const spawn = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args) => {
      assert.equal(command, expected);
      assert.deepEqual(args, ["--version"]);
      executions += 1;
      return {
        status: 0,
        stdout: fixture.tools.vale.versionOutput,
        stderr: "",
      };
    },
  );
  syncBuiltinESMExports();
  try {
    fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
    fs.copyFileSync(path.join(root, "tools/docs/runtime.mjs"), runtimePath);
    const supply = path.join(directory, ".config/supply/native.json");
    fs.mkdirSync(path.dirname(supply), { recursive: true });
    fs.writeFileSync(supply, JSON.stringify(fixture));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(
      target,
      "altered native bytes with unchanged version output",
    );
    Object.defineProperty(process, "platform", {
      ...originalPlatform,
      value: "win32",
    });
    Object.defineProperty(process, "arch", { ...originalArch, value: "x64" });
    process.env.PATH = '"' + path.dirname(target) + '"';
    process.env.DDWG_VALE_BIN = "vale.exe";
    const runtime = await import(pathToFileURL(runtimePath));
    assert.throws(
      () => runtime.nativeToolBinary("vale"),
      /binary digest mismatch/u,
    );
    assert.equal(
      executions,
      0,
      "quoted managed PATH must not bypass byte admission",
    );
    fs.writeFileSync(target, trusted);
    assert.equal(runtime.nativeToolBinary("vale"), target);
    process.env.DDWG_VALE_BIN = target.slice(0, -4);
    assert.equal(runtime.nativeToolBinary("vale"), target);
    assert.equal(
      executions,
      2,
      "both valid selectors start the same verified file",
    );
    process.env.DDWG_VALE_BIN = "absent-native-file.exe";
    assert.throws(() => runtime.nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      2,
      "unresolved selectors must not start an unbound command",
    );
    expected = path.join(directory, "..com");
    fs.writeFileSync(expected, "independently owned single-dot lookup fixture");
    process.env.DDWG_VALE_BIN = ".";
    assert.throws(() => runtime.nativeToolBinary("vale"), /not found/u);
    assert.equal(
      executions,
      2,
      "the native single-dot refusal must precede startup",
    );
  } finally {
    Object.defineProperty(process, "platform", originalPlatform);
    Object.defineProperty(process, "arch", originalArch);
    if (originalPath === undefined) delete process.env.PATH;
    else process.env.PATH = originalPath;
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
    spawn.mock.restore();
    syncBuiltinESMExports();
    fs.rmSync(directory, { recursive: true, force: true });
    assert.equal(fs.existsSync(directory), false);
  }
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
  const originalSelection = process.env.DDWG_VALE_BIN;
  delete process.env.DDWG_VALE_BIN;
  context.after(() => {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
  });
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
  const originalSelection = process.env.DDWG_VALE_BIN;
  delete process.env.DDWG_VALE_BIN;
  context.after(() => {
    if (originalSelection === undefined) delete process.env.DDWG_VALE_BIN;
    else process.env.DDWG_VALE_BIN = originalSelection;
  });
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
  const originalBinaryDigest = descriptor.binarySha256;
  const actualRead = fs.readFileSync;
  const actualEntries = fs.readdirSync;
  const actualStat = fs.lstatSync;
  const actualSpawn = childProcess.spawnSync;
  const modes = [];
  const executions = [];
  let concurrentTarget = false;
  let extractionCount = 0;
  const mocks = [
    context.mock.method(fs, "readFileSync", (file, options) =>
      file === asset ||
      (file === target && concurrentTarget) ||
      path.basename(path.dirname(file)) === "extracted"
        ? bytes
        : actualRead(file, options),
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
    context.mock.method(fs, "copyFileSync", () => {
      throw new Error("native tool publication must not expose a partial copy");
    }),
    context.mock.method(fs, "linkSync", (source, destination) => {
      assert.deepEqual(fs.readFileSync(source), bytes);
      assert.equal(destination, target);
      assert.equal(concurrentTarget, false);
      concurrentTarget = true;
      throw Object.assign(new Error("another install completed"), {
        code: "EEXIST",
      });
    }),
    context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      if (command === "tar") {
        if (args.includes("-xf")) {
          extractionCount += 1;
          assert.ok(args.includes("--no-same-owner"));
        }
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
      ) {
        executions.push(command);
        return { status: 0, stdout: selected.versionOutput, stderr: "" };
      }
      return actualSpawn(command, args, options);
    }),
  ];
  descriptor.sha256 = createHash("sha256").update(bytes).digest("hex");
  descriptor.binarySha256 = descriptor.sha256;
  syncBuiltinESMExports();
  try {
    assert.equal(await install({ tool: "vale", assetFile: asset }), target);
    assert.equal(concurrentTarget, true);
    assert.equal(extractionCount, 1);
    assert.equal(modes.includes(target), false);
    assert.equal(executions.length, 2);
    assert.equal(executions[1], target);
  } finally {
    descriptor.sha256 = originalDigest;
    descriptor.binarySha256 = originalBinaryDigest;
    for (const mock of mocks) mock.mock.restore();
    syncBuiltinESMExports();
  }
});
