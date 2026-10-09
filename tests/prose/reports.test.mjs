import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { proseAlerts } from "../../tools/docs/content.mjs";
import { root } from "../../tools/docs/runtime.mjs";

test("source checks reject prose before unrelated native prerequisites", () => {
  const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import { readFileSync } from "node:fs";
    import { syncBuiltinESMExports } from "node:module";
    const original = childProcess.spawnSync;
    const invocations = [];
    childProcess.spawnSync = (command, args, options) => {
      const normalized = args?.[0]?.replaceAll(String.fromCharCode(92), "/") ?? "";
      if (
        normalized.includes("@fission-ai/openspec/") ||
        (command === "git" && ["for-each-ref", "cat-file", "merge-base"].includes(args?.[0]))
      )
        throw new Error("unrelated native prerequisite executed before prose rejection");
      if (args?.includes("--output=JSON") && args.includes("--no-exit")) {
        invocations.push("vale");
        return {
          status: 0,
          stdout: JSON.stringify({ "README.md": [{ Line: 1, Span: [1, 4], Check: "Vale.Repetition", Message: "fixture repeated word" }] }),
          stderr: "",
        };
      }
      return original(command, args, options);
    };
    syncBuiltinESMExports();
    const before = readFileSync("README.md", "utf8");
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, "check"];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
    assert.equal(process.exitCode, 1);
    assert.deepEqual(invocations, ["vale"]);
    assert.equal(readFileSync("README.md", "utf8"), before);
    process.exitCode = 0;
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: root,
      encoding: "utf8",
      input: "",
      timeout: 20_000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stderr,
    /README\.md:1:1 \[Vale\.Repetition\].*fixture repeated word/u,
  );
});

test("native Vale refuses malformed successful reports with their raw diagnosis", (context) => {
  const nativeSpawn = childProcess.spawnSync;
  let report = {};
  const observation = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args?.includes("--output=JSON")) {
        return { status: 0, stdout: JSON.stringify(report), stderr: "" };
      }
      return nativeSpawn(command, args, options);
    },
  );
  syncBuiltinESMExports();
  try {
    for (const invalid of [
      { Code: "E201", Text: "fixture runtime diagnosis" },
      { "README.md": {} },
      {
        "README.md": [
          { Line: 1, Span: [1], Check: "Vale.Repetition", Message: "fixture" },
        ],
      },
      {
        "README.md": [
          {
            Line: 0,
            Span: [1, 2],
            Check: "Vale.Repetition",
            Message: "fixture",
          },
        ],
      },
    ]) {
      report = invalid;
      assert.throws(
        () => proseAlerts(["README.md"]),
        (error) =>
          error.message.includes("native Vale returned an invalid report") &&
          error.message.includes(JSON.stringify(invalid)),
      );
    }
    report = { "README.md": [] };
    assert.deepEqual(proseAlerts(["README.md"]), report);
    report = {
      "README.md": [
        { Line: 1, Span: [1, 2], Check: "Vale.Repetition", Message: "fixture" },
      ],
    };
    assert.deepEqual(proseAlerts(["README.md"]), report);
  } finally {
    observation.mock.restore();
    syncBuiltinESMExports();
  }
});
