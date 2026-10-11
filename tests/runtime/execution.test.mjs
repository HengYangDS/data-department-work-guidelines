import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { root, run } from "../../tools/runtime.mjs";
import { fixtureGit } from "../source/fixtures.mjs";

test("native process input reaches its selected child without a shell", () => {
  const input = "First reference\0Second reference\0";
  const output = run(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      "const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk); process.stdout.write(Buffer.concat(chunks));",
    ],
    { capture: true, input, timeout: 10_000 },
  );
  assert.equal(output, input);
});

test("the public test command bounds workers without reducing its discovered inventory", () => {
  const fixtures = [
    null,
    [
      "tests/new domain/entry [sample].test.mjs",
      "tests/another-domain/behavior.test.mjs",
      "tests/new domain/entry [sample].test.mjs",
      "tests/new domain/fixtures.mjs",
      "docs/entry.test.mjs",
      "tests/new domain/README.md",
    ],
    [],
  ];
  const outcomes = [
    {
      success: true,
      counts: {
        tests: 1,
        passed: 1,
        failed: 0,
        cancelled: 0,
        skipped: 0,
        todo: 0,
      },
    },
    {
      success: true,
      counts: {
        tests: 0,
        passed: 0,
        failed: 0,
        cancelled: 0,
        skipped: 0,
        todo: 0,
      },
    },
    {
      success: false,
      counts: {
        tests: 1,
        passed: 0,
        failed: 1,
        cancelled: 0,
        skipped: 0,
        todo: 0,
      },
    },
    {
      success: false,
      counts: {
        tests: 1,
        passed: 0,
        failed: 0,
        cancelled: 1,
        skipped: 0,
        todo: 0,
      },
    },
  ];
  for (const suppliedInventory of fixtures) {
    for (const outcome of suppliedInventory?.length === 0
      ? outcomes.slice(0, 1)
      : outcomes) {
      const selected = suppliedInventory?.length !== 0;
      const expectedExit =
        selected && outcome.success && outcome.counts.tests ? 0 : 1;
      const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import fs from "node:fs";
    import path from "node:path";
    import { PassThrough } from "node:stream";
    import { registerHooks, syncBuiltinESMExports } from "node:module";
    const repository = ${JSON.stringify(root)};
    const sourcePrefix = ${JSON.stringify(pathToFileURL(path.join(root, "tools")).href + "/")};
    const entries = new Set(${JSON.stringify(
      ["tools/docs/cli.mjs", "tools/runtime.mjs"].map(
        (relative) => pathToFileURL(path.join(root, relative)).href,
      ),
    )});
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier === "node:test" && context.parentURL === ${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)})
          return { url: "data:text/javascript,export const run = globalThis.testRunFixture;", shortCircuit: true };
        const resolved = nextResolve(specifier, context);
        if (resolved.url.startsWith(sourcePrefix)) assert.ok(
          entries.has(resolved.url),
          "the test command must not load unrelated repository checks",
        );
        return resolved;
      },
    });
    const original = childProcess.spawnSync;
    const supplied = ${JSON.stringify(suppliedInventory)};
    const inventory = supplied === null
      ? original("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
          cwd: repository, encoding: "utf8", timeout: 10_000,
        })
      : { status: 0, stdout: supplied.join("\\0") + "\\0", stderr: "" };
    assert.ifError(inventory.error);
    assert.equal(inventory.status, 0, inventory.stderr);
    const expected = [...new Set(inventory.stdout.split("\\0").filter(Boolean))]
      .filter((file) => file.startsWith("tests/") && file.endsWith(".test.mjs") &&
        (supplied !== null || fs.existsSync(path.join(repository, file))))
      .sort();
    const selected = expected.length > 0;
    if (supplied !== null) {
      const originalStat = fs.lstatSync;
      const fixturePaths = new Set(supplied.map((file) => path.join(repository, file)));
      fs.lstatSync = (file, options) => fixturePaths.has(file)
        ? { isFile: () => true }
        : originalStat(file, options);
    }
    let executions = 0;
    let deadlines = 0;
    const signal = new AbortController().signal;
    AbortSignal.timeout = (milliseconds) => {
      assert.equal(milliseconds, 180_000);
      deadlines += 1;
      return signal;
    };
    childProcess.spawnSync = (command, args, options) => {
      if (supplied !== null && command === "git" && args[0] === "ls-files") {
        assert.deepEqual(args, ["ls-files", "--cached", "--others", "--exclude-standard", "-z"]);
        return inventory;
      }
      return original(command, args, options);
    };
    globalThis.testRunFixture = (options) => {
      assert.deepEqual(options, { files: expected, cwd: repository, concurrency: 2, signal });
      executions += 1;
      const stream = new PassThrough({ objectMode: true });
      const summary = ${JSON.stringify(outcome)};
      queueMicrotask(() => {
        stream.emit("test:summary", summary);
        stream.end({ type: "test:summary", data: summary });
      });
      return stream;
    };
    syncBuiltinESMExports();
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, "test"];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
    assert.equal(executions, selected ? 1 : 0);
    assert.equal(deadlines, selected ? 1 : 0);
    assert.equal(process.exitCode ?? 0, ${expectedExit});
  `;
      const result = spawnSync(process.execPath, ["--input-type=module"], {
        cwd: root,
        encoding: "utf8",
        input: script,
        timeout: 20_000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, expectedExit, result.stderr);
      assert.equal(
        result.stderr,
        expectedExit
          ? `${selected ? "repository quality tests failed" : "no repository quality tests found"}\n`
          : "",
      );
    }
  }
});

test("public test execution preserves literal Git inputs and a new cohort", () => {
  let directory;
  {
    using workspace = fs.mkdtempDisposableSync(
      path.join(os.tmpdir(), "ddwg-native-tests-"),
    );
    directory = workspace.path;
    for (const relative of [
      "package.json",
      "tools/docs/cli.mjs",
      "tools/runtime.mjs",
    ]) {
      const destination = path.join(directory, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(root, relative), destination);
    }
    fs.writeFileSync(
      path.join(directory, ".gitignore"),
      "tests/local-only/\nexecutions.jsonl\n",
    );
    const git = (args) => fixtureGit(directory, args);
    git(["init", "--quiet"]);
    const marker = path.join(directory, "executions.jsonl");
    const writeTest = (relative, body = "assert.ok(true);") => {
      const destination = path.join(directory, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(
        destination,
        `import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { setTimeout } from "node:timers/promises";
test(${JSON.stringify(relative)}, async () => {
  fs.appendFileSync(${JSON.stringify(marker)}, ${JSON.stringify(JSON.stringify(relative) + "\n")});
  ${body}
});
`,
      );
    };
    const initial = [
      "tests/retained/contract.test.mjs",
      "tests/new domain/[sample].test.mjs",
      "tests/local-only/tracked.test.mjs",
    ];
    for (const relative of [...initial, "tests/local-only/ignored.test.mjs"])
      writeTest(relative);
    git(["add", "--", ".gitignore", initial[0]]);
    git(["add", "--force", "--", initial[2]]);
    const inventory = () =>
      git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
        .split("\0")
        .filter((relative) => relative.endsWith(".test.mjs"))
        .sort();
    const environment = { ...process.env };
    delete environment.NODE_TEST_CONTEXT;
    const invoke = (bootstrap) => {
      fs.rmSync(marker, { force: true });
      if (bootstrap)
        fs.writeFileSync(path.join(directory, "bootstrap.mjs"), bootstrap);
      const result = spawnSync(
        process.execPath,
        bootstrap ? ["bootstrap.mjs"] : ["tools/docs/cli.mjs", "test"],
        {
          cwd: directory,
          env: environment,
          encoding: "utf8",
          timeout: 10_000,
        },
      );
      assert.ifError(result.error);
      assert.equal(result.signal, null);
      return result;
    };
    const executions = () =>
      fs.readFileSync(marker, "utf8").trimEnd().split("\n").map(JSON.parse);
    for (const added of [null, "tests/new-cohort/added.test.mjs"]) {
      if (added) writeTest(added);
      const selected = inventory();
      const result = invoke();
      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(executions().sort(), selected);
      assert.equal(new Set(executions()).size, selected.length);
    }
    writeTest(
      "tests/new-cohort/added.test.mjs",
      "assert.fail('selected failure');",
    );
    const failed = invoke();
    assert.equal(failed.status, 1, failed.stderr);
    assert.match(failed.stdout, /selected failure/u);
    assert.deepEqual(executions().sort(), inventory());
    writeTest("tests/new-cohort/added.test.mjs", "await setTimeout(60_000);");
    const aborted = invoke(`
import assert from "node:assert/strict";
const nativeTimeout = AbortSignal.timeout;
AbortSignal.timeout = (milliseconds) => {
  assert.equal(milliseconds, 180_000);
  return nativeTimeout(500);
};
process.argv = [process.execPath, ${JSON.stringify(path.join(directory, "tools/docs/cli.mjs"))}, "test"];
await import(${JSON.stringify(pathToFileURL(path.join(directory, "tools/docs/cli.mjs")).href)});
`);
    assert.equal(aborted.status, 1, aborted.stderr);
    assert.match(aborted.stdout, /cancelled [1-9]/u);
  }
  assert.equal(fs.existsSync(directory), false);
});

test("the public check command rejects incomplete-mode waivers", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "check", "--allow-incomplete"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /check accepts no arguments/u);
});
