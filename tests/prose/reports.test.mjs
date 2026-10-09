import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { checkProse } from "../../tools/docs/content.mjs";
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
      if (args?.includes("--output=line")) {
        invocations.push("vale");
        return {
          status: 0,
          stdout: "README.md:1:1:Vale.Repetition:fixture repeated word\\n",
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
    result.stdout,
    /README\.md:1:1:Vale\.Repetition:fixture repeated word/u,
  );
});

test("native Vale findings keep their original output without a report schema", (context) => {
  const nativeSpawn = childProcess.spawnSync;
  let report = "";
  let status = 0;
  let executions = 0;
  const output = context.mock.method(process.stdout, "write", () => true);
  const observation = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args?.includes("--output=line")) {
        assert.equal(args.includes("--no-exit"), false);
        assert.equal(args.includes("--output=JSON"), false);
        executions += 1;
        return { status, stdout: report, stderr: "" };
      }
      return nativeSpawn(command, args, options);
    },
  );
  syncBuiltinESMExports();
  try {
    for (const finding of [
      "README.md:1:1:Vale.Repetition:fixture repeated word\n",
      "README.md:2:1:Plain.Warning:fixture warning\n",
      "README.md:3:1:Plain.Suggestion:fixture suggestion\n",
      JSON.stringify({ Code: "E201", Text: "fixture runtime diagnosis" }),
    ]) {
      report = finding;
      const before = output.mock.callCount();
      assert.throws(() => checkProse(["README.md"]), /reported findings/u);
      assert.equal(output.mock.callCount(), before + 1);
      assert.equal(output.mock.calls[before].arguments[0], finding);
    }
    status = 1;
    report = "README.md:1:1:Vale.Repetition:fixture repeated word\n";
    const before = output.mock.callCount();
    assert.throws(() => checkProse(["README.md"]), /exited 1/u);
    assert.equal(output.mock.callCount(), before + 1);
    assert.equal(output.mock.calls[before].arguments[0], report);
    status = 0;
    report = "";
    assert.doesNotThrow(() => checkProse(["README.md"]));
    assert.equal(executions, 6);
  } finally {
    observation.mock.restore();
    output.mock.restore();
    syncBuiltinESMExports();
  }
});
