import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { root, run } from "../../tools/runtime.mjs";

test("source context finishes before inherited child output without merging streams", () => {
  const childSource = [
    'process.stdout.write("CHILD_STDOUT\\n");',
    'process.stderr.write("CHILD_STDERR\\n");',
  ].join(" ");
  const hostname = `fixture-${"x".repeat(262_144)}`;
  for (const command of ["check"]) {
    const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import fs from "node:fs";
    import os from "node:os";
    import { syncBuiltinESMExports } from "node:module";
    const originalRead = fs.readFileSync;
    const target = ${JSON.stringify(path.join(root, "package-lock.json"))};
    os.hostname = () => ${JSON.stringify(hostname)};
    fs.readFileSync = (file, options) => {
      if (file !== target) return originalRead(file, options);
      const child = childProcess.spawnSync(
        process.execPath,
        ["--eval", ${JSON.stringify(childSource)}],
        { stdio: "inherit", timeout: 5_000 },
      );
      assert.ifError(child.error);
      assert.equal(child.status, 0);
      throw new Error("fixture validation stopped after child output");
    };
    syncBuiltinESMExports();
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, ${JSON.stringify(command)}];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
  `;
    const result = spawnSync(process.execPath, ["--input-type=module"], {
      cwd: root,
      encoding: "utf8",
      input: script,
      timeout: 15_000,
      maxBuffer: 1024 * 1024,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stderr);
    const lines = result.stdout.trimEnd().split(/\r?\n/u);
    assert.equal(lines.length, 2, "complete INFO precedes one child line");
    assert.ok(
      lines[1] === "CHILD_STDOUT",
      "child output remains a separate line",
    );
    assert.ok(lines[0].startsWith("INFO "));
    const context = JSON.parse(lines[0].slice(5));
    assert.equal(context.kind, "repository-verification-context");
    assert.equal(context.repository, fs.realpathSync.native(root));
    assert.equal(context.runtime.hostname, hostname);
    assert.equal(
      result.stderr,
      "CHILD_STDERR\nfixture validation stopped after child output\n",
    );
  }
});

test("source checks preserve a failed context write before starting validation", () => {
  for (const command of ["check"]) {
    const script = `
    import fs from "node:fs";
    import { syncBuiltinESMExports } from "node:module";
    const originalWrite = process.stdout.write.bind(process.stdout);
    const originalRead = fs.readFileSync;
    process.stdout.write = (chunk, ...arguments_) => {
      if (!String(chunk).startsWith("INFO ")) return originalWrite(chunk, ...arguments_);
      const callback = arguments_.find((value) => typeof value === "function");
      if (callback) queueMicrotask(() => callback(new Error("fixture context write failed")));
      return false;
    };
    fs.readFileSync = (file, options) => {
      if (file === ${JSON.stringify(path.join(root, "package-lock.json"))})
        throw new Error("validation ran after context write failure");
      return originalRead(file, options);
    };
    syncBuiltinESMExports();
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, ${JSON.stringify(command)}];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
  `;
    const result = spawnSync(process.execPath, ["--input-type=module"], {
      cwd: root,
      encoding: "utf8",
      input: script,
      timeout: 15_000,
    });
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, "fixture context write failed\n");
  }
});

test("source checks report a closed stdout through their native error owner", async () => {
  for (const command of ["check"]) {
    const script = `
    const originalWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk, ...arguments_) => {
      if (String(chunk).startsWith("INFO ")) {
        const index = arguments_.findIndex((value) => typeof value === "function");
        if (index >= 0) {
          const callback = arguments_[index];
          arguments_[index] = (error) => {
            if (error) process.stderr.write(JSON.stringify({
              kind: "native-write-error", code: error.code, message: error.message,
            }) + "\\n");
            callback(error);
          };
        }
      }
      return originalWrite(chunk, ...arguments_);
    };
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, ${JSON.stringify(command)}];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
  `;
    const child = childProcess.spawn(
      process.execPath,
      ["--input-type=module"],
      {
        cwd: root,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 15_000,
      },
    );
    child.stdout.once("close", () => child.stdin.end(script));
    child.stdout.destroy();
    child.stderr.setEncoding("utf8");
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    const { status, signal } = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (status, signal) => resolve({ status, signal }));
    });
    assert.equal(status, 1, stderr);
    assert.equal(signal, null);
    const lines = stderr.trimEnd().split(/\r?\n/u);
    assert.equal(
      lines.length,
      2,
      "one native observation and one owned diagnosis",
    );
    const observed = JSON.parse(lines[0]);
    assert.equal(observed.kind, "native-write-error");
    assert.equal(typeof observed.code, "string");
    assert.ok(observed.code.length > 0);
    assert.equal(lines[1], observed.message);
  }
});

test("verification context binds native workspace capacity without claiming VM identity", async () => {
  const { workspaceObservation } = await import("../../tools/runtime.mjs");
  assert.equal(typeof workspaceObservation, "function");
  const actual = workspaceObservation();
  assert.equal(actual.kind, "repository-verification-context");
  assert.equal(actual.repository, fs.realpathSync.native(root));
  assert.equal(
    actual.source.commit,
    run("git", ["rev-parse", "HEAD"], { capture: true }).trim(),
  );
  assert.equal(
    actual.source.tree,
    run("git", ["rev-parse", "HEAD^{tree}"], { capture: true }).trim(),
  );
  assert.equal(typeof actual.source.trackedChanges, "boolean");
  assert.ok(Number.isFinite(Date.parse(actual.observedAt)));
  assert.deepEqual(actual.runtime, {
    platform: process.platform,
    processArchitecture: process.arch,
    hostname: os.hostname(),
    node: process.versions.node,
  });
  assert.equal(actual.workspaceFilesystem.unit, "bytes");
  assert.ok(BigInt(actual.workspaceFilesystem.total) > 0n);
  assert.ok(BigInt(actual.workspaceFilesystem.available) >= 0n);
  assert.match(actual.limit, /workspace filesystem only/iu);
  assert.match(actual.limit, /not VM identity, isolation, or throughput/iu);

  const original = fs.statfsSync;
  const blocks = 2n ** 53n + 1n;
  try {
    fs.statfsSync = (target, options) => {
      assert.equal(target, fs.realpathSync.native(root));
      assert.deepEqual(options, { bigint: true });
      return { bsize: 4096n, blocks, bfree: blocks - 1n, bavail: blocks - 2n };
    };
    syncBuiltinESMExports();
    const exact = workspaceObservation();
    assert.deepEqual(exact.workspaceFilesystem, {
      unit: "bytes",
      total: String(4096n * blocks),
      free: String(4096n * (blocks - 1n)),
      available: String(4096n * (blocks - 2n)),
    });

    const denied = Object.assign(new Error("native workspace read denied"), {
      code: "EACCES",
    });
    fs.statfsSync = () => {
      throw denied;
    };
    syncBuiltinESMExports();
    assert.throws(
      () => workspaceObservation(),
      (error) => error === denied,
    );
  } finally {
    fs.statfsSync = original;
    syncBuiltinESMExports();
  }
});
