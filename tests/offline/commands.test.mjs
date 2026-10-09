import assert from "node:assert/strict";
import childProcess, { spawnSync } from "node:child_process";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { root } from "../../tools/docs/runtime.mjs";

test("the offline CLI is inert on import and exposes no library facade", async (context) => {
  const execution = context.mock.method(childProcess, "spawnSync", () => {
    assert.fail("importing a command entry must not execute a child");
  });
  context.mock.method(globalThis, "fetch", () => {
    assert.fail("importing a command entry must not acquire remote supply");
  });
  syncBuiltinESMExports();
  const exitCode = process.exitCode;
  try {
    const command = await import("../../tools/ci/offline-bundle.mjs");
    assert.deepEqual(Object.keys(command), []);
    assert.equal(process.exitCode, exitCode);
    assert.equal(execution.mock.callCount(), 0);
  } finally {
    execution.mock.restore();
    syncBuiltinESMExports();
  }
});

test("offline command admission rejects incomplete modes and unknown options before effects", () => {
  for (const args of [
    [],
    ["unknown"],
    ["build"],
    ["acquire-github", "--bundle", "unused"],
    ["acquire-gitlab", "--output", "unused"],
    ["inspect", "--assets", "unused"],
    ["install", "--licenses", "unused"],
    ["inspect", "--allow-incomplete"],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["tools/ci/offline-bundle.mjs", ...args],
      { cwd: root, encoding: "utf8", timeout: 10_000 },
    );
    const diagnostic = JSON.stringify({ args, ...result });
    assert.equal(result.error, undefined, diagnostic);
    assert.equal(result.signal, null, diagnostic);
    assert.equal(result.status, 1, diagnostic);
    assert.equal(result.stdout, "", diagnostic);
    assert.match(result.stderr, /usage:|Unknown option/u, diagnostic);
  }
});
