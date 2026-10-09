import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { run as runCommand } from "../../tools/docs/runtime.mjs";
import * as runtime from "../../tools/docs/runtime.mjs";

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

test("piped native failures preserve diagnostics without duplicate output", () => {
  const module = new URL("../../tools/docs/runtime.mjs", import.meta.url).href;
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
