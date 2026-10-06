import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import {
  cpSync,
  existsSync,
  mkdtempDisposableSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire, syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { Parser } from "htmlparser2";
import { micromark } from "micromark";
import { parse as parseShell } from "shell-quote";
import { parse as parseToml } from "smol-toml";
import { markdownTokens, walkMarkdown } from "../tools/docs/markdown.mjs";
import {
  documentMetadata,
  formatSource,
  checkLinks,
  lintMarkdown,
  repositoryFileUri,
  proseAlerts,
  textViolations,
} from "../tools/docs/content.mjs";
import {
  checkConfigurationLayout,
  checkDecisions,
  checkNoScope,
  commandInvocation,
  executionViolation,
  validateDecision,
} from "../tools/docs/governance.mjs";
import {
  currentMarkdown,
  gitFiles,
  nativeToolBinary,
  nodeTool,
  root,
  run,
  sourceAttributes,
  sourceMarkdown,
} from "../tools/docs/runtime.mjs";

const sections = [
  "Context",
  "Decision",
  "Alternatives Rejected",
  "Consequences and Boundary",
  "Evidence and Revisit",
];

function decision({
  headings = sections,
  body = "An evidence link can describe the ETHOS lifecycle.",
} = {}) {
  return [
    "<!--",
    "---",
    "subject: fixture:DR-0001",
    "role: decision",
    "state: canonical",
    "decision_id: DR-0001",
    "decision_status: accepted",
    "relations:",
    "  canonical_for: fixture choice",
    "---",
    "-->",
    "",
    "# DR-0001: Fixture choice",
    "",
    ...headings.flatMap((heading) => [`## ${heading}`, "", body, ""]),
  ].join("\n");
}

function fixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-quality-test-"));
  try {
    mkdirSync(path.join(directory, "docs", "decisions"), { recursive: true });
    writeFileSync(
      path.join(directory, "docs", "decisions", "dr-0001-fixture.md"),
      decision(),
      "utf8",
    );
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function assertFixtureSources(directory, expected) {
  const inventory = spawnSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: directory, encoding: "utf8", timeout: 10_000 },
  );
  assert.ifError(inventory.error);
  assert.equal(inventory.status, 0, inventory.stderr);
  assert.deepEqual(
    [...new Set(inventory.stdout.split("\0").filter(Boolean))].sort(),
    [...expected].sort(),
    "native fixture source contains only the declared test inputs",
  );
}

test("document metadata reads the product-supported title-first carrier", () => {
  const source = [
    "<!--",
    "---",
    "subject: fixture:guide",
    "role: policy",
    "state: canonical",
    "relations:",
    "  canonical_for: reader guidance",
    "---",
    "-->",
    "",
    "# Fixture",
    "",
    "Reader-facing content.",
    "",
  ].join("\n");
  assert.deepEqual(documentMetadata("docs/fixture.md", source), {
    subject: "fixture:guide",
    role: "policy",
    state: "canonical",
    relations: { canonical_for: "reader guidance" },
  });
});

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

test("offline verification disables official telemetry only in its OpenSpec child", () => {
  const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import { syncBuiltinESMExports } from "node:module";
    const before = { ...process.env };
    const original = childProcess.spawnSync;
    let captured = false;
    childProcess.spawnSync = (command, args, options) => {
      if (!args?.[0]?.replaceAll(String.fromCharCode(92), "/").includes("@fission-ai/openspec/"))
        return original(command, args, options);
      assert.equal(options.env?.OPENSPEC_TELEMETRY, "0");
      assert.deepEqual(
        Object.keys(options.env).filter((key) => key.toUpperCase() === "OPENSPEC_TELEMETRY"),
        ["OPENSPEC_TELEMETRY"],
      );
      assert.equal(options.env.DDWG_ENV_FIXTURE, "preserved");
      assert.deepEqual(args.slice(1), ["validate", "--all", "--strict", "--json"]);
      captured = true;
      throw new Error("offline environment captured before execution");
    };
    syncBuiltinESMExports();
    const { validateOpenSpec } = await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/runtime.mjs")).href)});
    assert.throws(validateOpenSpec, /offline environment captured before execution/u);
    assert.equal(captured, true);
    assert.deepEqual({ ...process.env }, before);
    process.exitCode = 0;
  `;
  const environment = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !["OPENSPEC_TELEMETRY", "CI"].includes(key.toUpperCase()),
    ),
  );
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: root,
      encoding: "utf8",
      input: "",
      timeout: 20_000,
      env: {
        ...environment,
        OPENSPEC_TELEMETRY: "1",
        openspec_telemetry: "on",
        DO_NOT_TRACK: "0",
        DDWG_ENV_FIXTURE: "preserved",
      },
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
});

test("official OpenSpec findings and report identity cannot be reduced to totals", () => {
  const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import fs from "node:fs";
    import { syncBuiltinESMExports } from "node:module";
    import path from "node:path";
    const original = childProcess.spawnSync;
    const repository = ${JSON.stringify(root)};
    const clean = {
      version: "1.0",
      root: { path: repository, source: "nearest" },
      items: [{ id: "fixture", type: "spec", valid: true, issues: [], durationMs: 1 }],
      summary: {
        totals: { items: 1, passed: 1, failed: 0 },
        byType: {
          change: { items: 0, passed: 0, failed: 0 },
          spec: { items: 1, passed: 1, failed: 0 },
        },
      },
    };
    let report = clean;
    let stderr = "";
    let status = 0;
    let executionError;
    childProcess.spawnSync = (command, args, options) => {
      if (!args?.[0]?.replaceAll(String.fromCharCode(92), "/").includes("@fission-ai/openspec/"))
        return original(command, args, options);
      assert.equal(command, process.execPath);
      assert.deepEqual(args.slice(1), ["validate", "--all", "--strict", "--json"]);
      return { status, error: executionError, stdout: JSON.stringify(report), stderr };
    };
    syncBuiltinESMExports();
    const { validateOpenSpec } = await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/runtime.mjs")).href)});
    assert.doesNotThrow(validateOpenSpec);
    report = structuredClone(clean);
    report.items.push({ id: "fixture-change", type: "change", valid: true, issues: [], durationMs: 0, futureField: "retained native extension" });
    report.summary.totals.items = report.summary.totals.passed = 2;
    report.summary.byType.change = { items: 1, passed: 1, failed: 0 };
    assert.doesNotThrow(validateOpenSpec);
    // Model equivalent Windows short-path spelling through the native owner.
    const ordinaryRealpath = fs.realpathSync;
    const nativeRealpath = ordinaryRealpath.native;
    const alias = path.join(repository, "native-root-alias");
    fs.realpathSync = (target) => target === alias ? alias : ordinaryRealpath(target);
    fs.realpathSync.native = (target) => target === alias ? nativeRealpath(repository) : nativeRealpath(target);
    syncBuiltinESMExports();
    report = structuredClone(clean);
    report.root.path = alias;
    try {
      assert.doesNotThrow(validateOpenSpec, "equivalent native roots must not depend on path spelling");
      report.root.path = path.dirname(repository);
      assert.throws(validateOpenSpec, /OpenSpec/u, "a genuinely different native root stays invalid");
    } finally {
      fs.realpathSync = ordinaryRealpath;
      syncBuiltinESMExports();
    }
    const cases = [
      ...["INFO", "WARNING", "ERROR"].map((level) => ({
        name: level,
        change: (value) => value.items[0].issues.push({ level, path: "requirements[0]", message: "native fixture finding" }),
        expected: /fixture.*requirements\\[0\\].*native fixture finding/u,
      })),
      { name: "stderr", stderr: "native fixture warning\\n", expected: /native fixture warning/u },
      { name: "wrong root", change: (value) => { value.root.path = path.dirname(repository); } },
      { name: "missing root", change: (value) => { delete value.root; } },
      { name: "wrong version", change: (value) => { value.version = "2.0"; } },
      { name: "missing items", change: (value) => { delete value.items; } },
      { name: "empty items", change: (value) => { value.items = []; } },
      { name: "wrong totals", change: (value) => { value.summary.totals.items = 2; } },
      { name: "wrong passed", change: (value) => { value.summary.totals.passed = 0; } },
      { name: "string count", change: (value) => { value.summary.totals.items = "1"; } },
      { name: "wrong type totals", change: (value) => { value.summary.byType.spec.items = 2; } },
      { name: "invalid item", change: (value) => { value.items[0].valid = false; } },
      { name: "duplicate identity", change: (value) => { value.items.push(structuredClone(value.items[0])); value.summary.totals.items = value.summary.totals.passed = 2; value.summary.byType.spec.items = value.summary.byType.spec.passed = 2; } },
      { name: "missing issues", change: (value) => { delete value.items[0].issues; } },
      { name: "unknown item type", change: (value) => { value.items[0].type = "other"; } },
      { name: "nonstring item type", change: (value) => { value.items[0].type = ["spec"]; } },
      { name: "missing type totals", change: (value) => { delete value.summary.byType.spec; } },
      { name: "missing empty type totals", change: (value) => { delete value.summary.byType.change; } },
      { name: "unknown type totals", change: (value) => { value.summary.byType.other = { items: 0, passed: 0, failed: 0 }; } },
      { name: "negative duration", change: (value) => { value.items[0].durationMs = -1; } },
      { name: "unknown severity", change: (value) => { value.items[0].issues.push({ level: "other", path: "file", message: "native fixture finding" }); } },
    ];
    const incorrectlyAccepted = [];
    for (const sample of cases) {
      report = structuredClone(clean);
      sample.change?.(report);
      stderr = sample.stderr ?? "";
      try {
        assert.throws(validateOpenSpec, sample.expected ?? /OpenSpec/u);
      } catch (error) {
        incorrectlyAccepted.push({ name: sample.name, message: error.message });
      }
    }
    for (const exitStatus of [0, 1, null]) {
      report = structuredClone(clean);
      const failed = exitStatus !== 0;
      report.items[0].valid = !failed;
      const finding = failed ? "native failed-process finding" : "native successful-process finding";
      report.items[0].issues.push({ level: failed ? "ERROR" : "INFO", path: "requirements[0]", message: finding });
      report.summary.totals.passed = report.summary.byType.spec.passed = failed ? 0 : 1;
      report.summary.totals.failed = report.summary.byType.spec.failed = failed ? 1 : 0;
      status = exitStatus;
      executionError = exitStatus === null ? Object.assign(new Error("native fixture process timed out"), { code: "ETIMEDOUT" }) : undefined;
      stderr = "native process diagnostic\\n";
      const stdoutWrite = process.stdout.write;
      const stderrWrite = process.stderr.write;
      let failureOutput = "";
      let failureError = "";
      process.stdout.write = (chunk) => { failureOutput += chunk; return true; };
      process.stderr.write = (chunk) => { failureError += chunk; return true; };
      try {
        assert.throws(validateOpenSpec, (error) => {
          failureError += error.message;
          return exitStatus === null ? /native fixture process timed out/u.test(error.message) : exitStatus ? /exited 1/u.test(error.message) : /emitted warning output/u.test(error.message);
        });
        assert.ok(failureOutput.includes(finding), "native findings must survive process diagnostic rejection");
        assert.match(failureError, /native process diagnostic/u);
      } catch (error) {
        incorrectlyAccepted.push({ name: "findings with standard error at exit " + exitStatus, message: error.message });
      } finally {
        process.stdout.write = stdoutWrite;
        process.stderr.write = stderrWrite;
      }
    }
    assert.deepEqual(incorrectlyAccepted, [], JSON.stringify(incorrectlyAccepted));
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    { cwd: root, encoding: "utf8", input: "", timeout: 20_000 },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
});

test("real official OpenSpec diagnostics block source verification", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-openspec-report-"),
  );
  try {
    const runtime = path.join(directory, "tools", "docs", "runtime.mjs");
    mkdirSync(path.dirname(runtime), { recursive: true });
    cpSync(path.join(root, "tools", "docs", "runtime.mjs"), runtime);
    const manifest = path.join(
      directory,
      "node_modules",
      "@fission-ai",
      "openspec",
      "package.json",
    );
    mkdirSync(path.dirname(manifest), { recursive: true });
    writeFileSync(
      manifest,
      JSON.stringify({
        bin: { openspec: nodeTool("@fission-ai/openspec", "openspec") },
      }),
    );
    const spec = path.join(
      directory,
      "openspec",
      "specs",
      "fixture",
      "spec.md",
    );
    mkdirSync(path.dirname(spec), { recursive: true });
    writeFileSync(
      path.join(directory, "openspec", "config.yaml"),
      "schema: spec-driven\n",
    );
    const source = (body) =>
      [
        "# Fixture",
        "",
        "## Purpose",
        "",
        "Qualify complete native report consumption and preserve every diagnostic.",
        "",
        "## Requirements",
        "",
        "### Requirement: A native finding is preserved",
        "",
        body,
        "",
        "#### Scenario: A source check is requested",
        "",
        "- **WHEN** the fixture is checked",
        "- **THEN** native diagnostics remain visible.",
        "",
      ].join("\n");
    for (const finding of [false, true]) {
      writeFileSync(
        spec,
        source(
          `The tool SHALL preserve native diagnostics.${finding ? " Native source detail.".repeat(30) : ""}`,
        ),
      );
      const before = readFileSync(spec, "utf8");
      const script = `
        import assert from "node:assert/strict";
        const { validateOpenSpec } = await import(${JSON.stringify(pathToFileURL(runtime).href)});
        ${finding ? "assert.throws(validateOpenSpec, /exited 1/u);" : "assert.doesNotThrow(validateOpenSpec);"}
      `;
      const result = spawnSync(
        process.execPath,
        ["--input-type=module", "--eval", script],
        {
          cwd: directory,
          encoding: "utf8",
          input: "",
          timeout: 20_000,
        },
      );
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr + result.stdout);
      assert.equal(result.stderr, "");
      if (finding) {
        const report = JSON.parse(result.stdout);
        assert.equal(report.items.length, 1);
        assert.equal(report.items[0].id, "fixture");
        assert.equal(report.items[0].type, "spec");
        assert.equal(report.items[0].valid, false);
        assert.equal(report.items[0].issues.length, 1);
        assert.equal(report.items[0].issues[0].level, "WARNING");
        assert.equal(report.items[0].issues[0].path, "requirements[0]");
        assert.match(report.items[0].issues[0].message, /very long/u);
        assert.equal(report.summary.totals.failed, 1);
      }
      assert.equal(readFileSync(spec, "utf8"), before);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("the public test command bounds workers without reducing its discovered inventory", () => {
  const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import { syncBuiltinESMExports } from "node:module";
    const original = childProcess.spawnSync;
    let captured = false;
    childProcess.spawnSync = (command, args, options) => {
      if (args?.[0] !== "--test") return original(command, args, options);
      assert.equal(command, process.execPath);
      assert.equal(args[1], "--test-concurrency=2");
      assert.equal(options.timeout, 180_000);
      captured = true;
      return { status: 0, stdout: "", stderr: "" };
    };
    syncBuiltinESMExports();
    const { gitFiles } = await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/runtime.mjs")).href)});
    const expected = gitFiles().filter((file) => /^tests\\/[^/]+\\.test\\.mjs$/u.test(file));
    assert.ok(expected.length > 0);
    const checkedSpawn = childProcess.spawnSync;
    childProcess.spawnSync = (command, args, options) => {
      if (args?.[0] === "--test") assert.deepEqual(args.slice(2), expected);
      return checkedSpawn(command, args, options);
    };
    syncBuiltinESMExports();
    process.argv = [process.execPath, ${JSON.stringify(path.join(root, "tools/docs/cli.mjs"))}, "test"];
    await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/cli.mjs")).href)});
    assert.equal(captured, true);
    assert.equal(process.exitCode ?? 0, 0);
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
});

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

test("the pinned OpenSpec CLI suppresses requests at exit, with an enabled control", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-offline-openspec-"),
  );
  try {
    const config = path.join(directory, "openspec", "config.json");
    mkdirSync(path.dirname(config));
    const original = JSON.stringify({
      telemetry: {
        enabled: true,
        noticeSeen: true,
        anonymousId: "00000000-0000-4000-8000-000000000000",
      },
    });
    writeFileSync(config, original);
    const script = `
      import assert from "node:assert/strict";
      let requests = 0;
      globalThis.fetch = async () => {
        requests += 1;
        throw new Error("outbound request is forbidden in this fixture");
      };
      process.once("exit", () => {
        if (process.env.OPENSPEC_TELEMETRY === "0") assert.equal(requests, 0);
        else assert.ok(requests > 0, "enabled telemetry must trigger the request trap after settlement");
        console.error("Settled OpenSpec outbound requests:", requests);
      });
      process.argv = [process.execPath, ${JSON.stringify(nodeTool("@fission-ai/openspec", "openspec"))}, "validate", "--all", "--strict", "--json"];
      await import(${JSON.stringify(pathToFileURL(nodeTool("@fission-ai/openspec", "openspec")).href)});
    `;
    const environment = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          ![
            "CI",
            "OPENSPEC_TELEMETRY",
            "XDG_CONFIG_HOME",
            "DO_NOT_TRACK",
            "NODE_ENV",
          ].includes(key.toUpperCase()),
      ),
    );
    for (const telemetry of ["1", "0"]) {
      const result = spawnSync(
        process.execPath,
        ["--input-type=module", "--eval", script],
        {
          cwd: root,
          encoding: "utf8",
          input: "",
          timeout: 20_000,
          env: {
            ...environment,
            OPENSPEC_TELEMETRY: telemetry,
            DO_NOT_TRACK: "0",
            NODE_ENV: "production",
            XDG_CONFIG_HOME: directory,
          },
        },
      );
      assert.ifError(result.error);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(JSON.parse(result.stdout).summary.totals.failed, 0);
      assert.match(
        result.stderr,
        telemetry === "0"
          ? /Settled OpenSpec outbound requests: 0/u
          : /Settled OpenSpec outbound requests: [1-9]\d*/u,
      );
      assert.equal(readFileSync(config, "utf8"), original);
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("document metadata rejects a duplicate key", () => {
  const source =
    "<!--\n---\nsubject: first\nsubject: second\nrole: policy\nstate: canonical\nrelations: {}\n---\n-->\n\n# Fixture\n";
  assert.throws(
    () => documentMetadata("docs/fixture.md", source),
    /invalid document metadata/u,
  );
});

test("document metadata rejects visible declarations and pre-title prose", () => {
  const metadata =
    "subject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}";
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `---\n${metadata}\n---\n\n# Fixture\n`,
      ),
    /title-first/u,
  );
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `<!--\n---\n${metadata}\n---\n-->\n\nA visible preface.\n\n# Fixture\n`,
      ),
    /first visible block/u,
  );
});

test("document metadata rejects incomplete or prematurely closed comments", () => {
  const incomplete =
    "<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}\n---\n# Fixture\n";
  const premature =
    '<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations:\n  canonical_for: "unsafe --> suffix"\n---\n-->\n\n# Fixture\n';
  for (const source of [incomplete, premature]) {
    assert.throws(
      () => documentMetadata("docs/fixture.md", source),
      /invalid document metadata/u,
    );
  }
});

test("decision sections and identity remain exact", () => {
  assert.doesNotThrow(() =>
    validateDecision("docs/decisions/dr-0001-fixture.md", decision()),
  );
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ headings: sections.slice(0, -1) }),
      ),
    /sections/u,
  );
  assert.throws(
    () => validateDecision("docs/decisions/2026-09-25-fixture.md", decision()),
    /filename/u,
  );
  assert.throws(
    () => validateDecision("docs/decisions/dr-0002-fixture.md", decision()),
    /identity/u,
  );
});

test("shell syntax is rejected without rejecting concept prose or evidence links", () => {
  assert.equal(
    commandInvocation("ETHOS lifecycle describes current work."),
    false,
  );
  assert.equal(commandInvocation("./scripts/validate-docs.sh"), false);
  assert.equal(
    executionViolation(
      "The evidence link is [source](../../openspec/README.md).",
    ),
    "",
  );
  assert.match(
    executionViolation("```bash\nethos status --json\n```"),
    /code block/u,
  );
  assert.match(
    executionViolation("Run `openspec validate --all --strict`."),
    /inline command/u,
  );
  assert.match(executionViolation("$ git status"), /shell prompt/u);
  assert.match(
    executionViolation("env X=1 ethos plan --changed"),
    /command invocation/u,
  );
});

test("command classification does not inherit object properties", () => {
  for (const source of [
    "constructor selection preserves the domain boundary.",
    "toString defines the reader representation.",
    "hasOwnProperty checks one declared property.",
    "__proto__ is a literal key, not an execution request.",
  ]) {
    assert.equal(commandInvocation(source), false);
    assert.doesNotThrow(() =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ body: source }),
      ),
    );
  }
  assert.equal(commandInvocation("ethos status --json"), true);
});

test("native shell tokens preserve quoting and compound invocation boundaries", () => {
  for (const source of [
    '"ethos" status --json',
    "'openspec' validate --all --strict",
    "true && ethos status --json",
    "printf value | node tools/docs/cli.mjs check",
    "env X=1 'ethos' plan --changed",
    "env X=1 ./tools/docs/cli.mjs verify",
    "sudo ./tools/docs/cli.mjs check",
    "sudo -u root ethos status --json",
    "/usr/local/bin/ethos status --json",
    "git reset --hard",
    "rm -rf ./temporary",
    "curl --fail https://example.test/source",
    "printf value >(ethos status --json)",
    "cat <<(ethos status --json)",
    "true &>log; ethos status --json",
    "true &>>log; ethos status --json",
    "case value in value) true ;& ethos status --json ;; esac",
    "case value in value) true ;;& value) ethos status --json ;; esac",
  ]) {
    assert.equal(commandInvocation(source), true, source);
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({
            body: `The record links execution instead of embedding \`${source}\`.`,
          }),
        ),
      /command invocation/u,
      source,
    );
  }
  for (const source of [
    "node represents an executable host.",
    "python describes the example language.",
    "a < b is a comparison, not an execution request.",
    "ETHOS lifecycle describes current work.",
    "./tools/docs/cli.mjs",
    "The rationale describes here-documents and output redirection.",
    "A case terminator differs from an actual decision boundary.",
  ]) {
    assert.equal(commandInvocation(source), false, source);
    assert.doesNotThrow(() =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ body: source }),
      ),
    );
  }
});

test("native lexer groups supported operators and preserves quoted text", () => {
  for (const operator of ["<<", "<<-", ">|", "<>", "&>", "&>>", ";&", ";;&"]) {
    assert.deepEqual(
      parseShell(`printf value ${operator}target`, (name) => `$${name}`),
      ["printf", "value", { op: operator }, "target"],
      operator,
    );
  }
  assert.deepEqual(
    parseShell("printf value >(ethos status --json)", (name) => `$${name}`),
    ["printf", "value", { op: ">(" }, "ethos", "status", "--json", { op: ")" }],
  );
  assert.deepEqual(
    parseShell("cat <<(ethos status --json)", (name) => `$${name}`),
    [
      "cat",
      { op: "<" },
      { op: "<(" },
      "ethos",
      "status",
      "--json",
      { op: ")" },
    ],
  );
  assert.deepEqual(parseShell("printf '<<-' '>(value)' '&>>' '$TARGET'"), [
    "printf",
    "<<-",
    ">(value)",
    "&>>",
    "$TARGET",
  ]);
});

test("decision command inspection never evaluates shell input or ambient variables", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-command-inspection-"),
  );
  const marker = path.join(directory, "unexpected-execution");
  const previous = process.env.FLAGS;
  try {
    process.env.FLAGS = "not a command";
    assert.equal(commandInvocation("ethos status $FLAGS"), true);
    process.env.FLAGS = "--json";
    assert.equal(commandInvocation("ethos status $FLAGS"), true);
    assert.equal(commandInvocation(`ethos status $(touch '${marker}')`), true);
    assert.equal(existsSync(marker), false);
  } finally {
    if (previous === undefined) delete process.env.FLAGS;
    else process.env.FLAGS = previous;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native command operands remain words across glob and literal syntax", () => {
  for (const source of [
    "rm *",
    "rm file?.txt",
    "rm files.txt",
    "rm notes",
    "rm $TARGET",
    "rm -- notes",
    "true && rm *",
    "env X=1 rm 'notes'",
    "curl example.com",
  ]) {
    assert.equal(commandInvocation(source), true, source);
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body: `The producing Change owns \`${source}\`.` }),
        ),
      /command invocation/u,
      source,
    );
  }
  for (const source of [
    "rm describes a file-removal command.",
    "curl retrieves a remote resource.",
    "node represents an executable host.",
    "./tools/docs/cli.mjs",
  ]) {
    assert.equal(commandInvocation(source), false, source);
    assert.doesNotThrow(() =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ body: source }),
      ),
    );
  }
});

test("each required decision section contains readable content", () => {
  for (const heading of sections) {
    for (const empty of [
      "",
      "---",
      "[source]: https://example.test/evidence",
    ]) {
      const source = decision().replace(
        `## ${heading}\n\nAn evidence link can describe the ETHOS lifecycle.\n`,
        `## ${heading}\n\n${empty}\n`,
      );
      assert.throws(
        () => validateDecision("docs/decisions/dr-0001-fixture.md", source),
        /section.*readable content/u,
      );
    }
  }
  for (const body of [
    "[Evidence](https://example.test/source)",
    "> One accountable owner keeps the decision reversible.",
    "- Keep one source of truth.",
    "| Alternative | Boundary |\n| --- | --- |\n| One owner | One decision |",
  ]) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("parsed decision content rejects wrapped execution and task progress", async (t) => {
  const cases = [
    ["quoted Bash fence", "> ```bash\n> git status\n> ```"],
    [
      "list-nested shell fence",
      "- Evidence:\n\n  ```sh\n  ethos prove --execute\n  ```",
    ],
    ["PowerShell fence", '```powershell\nWrite-Output "Task complete"\n```'],
    ["PowerShell short label", '```ps1\nWrite-Output "Task complete"\n```'],
    ["Windows command fence", "```cmd\ndir /b\n```"],
    ["indented command", "    ethos prove --execute"],
    ["checked task", "- [x] Implement the Change."],
    ["unchecked task", "- [ ] Run the checks."],
    ["quoted task", "> - [x] Publish the result."],
    ["nested task", "- Work:\n  - [ ] Verify the current source."],
    ["long fenced command", "````text\nethos prove --execute\n```\n````"],
    ["inline command under emphasis", "**`ethos status --json`**"],
    ["opaque HTML command", "<pre>ethos prove --execute</pre>"],
    [
      "HTML task carrier",
      '<ul><li><input type="checkbox" checked>Done</li></ul>',
    ],
  ];
  for (const [name, body] of cases) {
    await t.test(name, () => {
      assert.throws(
        () =>
          validateDecision(
            "docs/decisions/dr-0001-fixture.md",
            decision({ body }),
          ),
        /execution|command invocation|task progress|unsupported HTML/u,
      );
    });
  }
});

test("parsed decision headings cannot be forged by a code block or quote", () => {
  const missing = decision({ headings: sections.slice(0, -1) });
  for (const wrapper of [
    "```text\n## Evidence and Revisit\n\nDurable rationale.\n```",
    "> ## Evidence and Revisit\n> Durable rationale.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          `${missing}\n${wrapper}\n`,
        ),
      /sections/u,
    );
  }
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision().replace("# DR-0001:", "# DR-0002:"),
      ),
    /title/u,
  );
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        `${decision()}\n# Second title\n`,
      ),
    /title/u,
  );
});

test("decision records have no additional or nested sections", () => {
  for (const body of [
    "### Task summary\n\nA task narrative does not belong in a decision.",
    "> ### Evidence detail\n> A nested heading is still a section.",
    "- Rationale:\n\n  ## Context\n\n  This is not a root decision section.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body }),
        ),
      /sections/u,
    );
  }
});

test("native decision headings retain their reader identity", () => {
  const source = decision()
    .replace("## Context", "## **Context**")
    .replace("## Decision", "## &#68;ecision");
  assert.doesNotThrow(() =>
    validateDecision("docs/decisions/dr-0001-fixture.md", source),
  );
  for (const body of [
    "- \\[x] This is a literal marker, not task progress.",
    "A link may name [ethos status](https://example.test/rationale).",
  ]) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("parsed decision content retains meaningful rationale and evidence links", () => {
  const bodies = [
    "ETHOS lifecycle describes current work.",
    "[Implementation](../../tools/docs/cli.mjs) and [OpenSpec](../../openspec/README.md) explain the boundary.",
    "The old `./scripts/validate-docs.sh` path names a retired implementation, not an execution record.",
    "- Keep one authority.\n- Reject duplicated lifecycle state.",
    "| Alternative | Consequence |\n| --- | --- |\n| One native owner | Less duplicate state. |",
    "> A method pack does not grant authority.",
    "A decision records a choice and its boundary.",
    "**Evidence:** <https://example.com/decision>.",
  ];
  for (const body of bodies) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("decision rationale links to code instead of carrying opaque executable blocks", () => {
  for (const body of [
    "```\nrm -rf ./temporary\n```",
    '```python\nprint("Task complete")\n```',
    '```text\nWrite-Output "Task complete"\n```',
    "```text\nA choice has a boundary and a revisit trigger.\n```",
    "    A choice has a boundary and a revisit trigger.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body }),
        ),
      /unsupported code block/u,
    );
  }
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        `${decision()}\n> # Another decision\n`,
      ),
    /title/u,
  );
});

test("public boundary command rejects parsed progress and preserves evidence prose", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-decision-command-"),
  );
  const sourceRoot = path.join(directory, "repository");
  const record = "docs/decisions/dr-0001-fixture.md";
  try {
    cpSync(path.join(root, "tools"), path.join(sourceRoot, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(sourceRoot, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package.json"),
      path.join(sourceRoot, "package.json"),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(sourceRoot, "node_modules"),
      "junction",
    );
    mkdirSync(path.join(sourceRoot, "docs", "decisions"), { recursive: true });
    const runBoundary = () =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "boundary"], {
        cwd: sourceRoot,
        encoding: "utf8",
        timeout: 15_000,
      });
    for (const body of [
      '> ```powershell\n> Write-Output "Task complete"\n> ```',
      "- [x] Complete the release tasks.",
      'The record excludes `"ethos" status --json`.',
      "The record excludes `git reset --hard`.",
    ]) {
      const source = decision({ body });
      writeFileSync(path.join(sourceRoot, record), source);
      const result = runBoundary();
      assert.ifError(result.error);
      assert.equal(result.status, 1, result.stderr);
      assert.match(
        result.stderr,
        /execution|task progress|command invocation/u,
      );
      assert.equal(readFileSync(path.join(sourceRoot, record), "utf8"), source);
    }
    const source = decision({
      body: "[Evidence](../../openspec/README.md) explains the choice.",
    });
    writeFileSync(path.join(sourceRoot, record), source);
    const result = runBoundary();
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASS decision boundary/u);
    assert.equal(readFileSync(path.join(sourceRoot, record), "utf8"), source);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("current decision tree rejects date names, superseded records, and method carriers", () => {
  fixture((directory) => {
    checkDecisions(directory);
    const records = path.join(directory, "docs", "decisions");
    writeFileSync(path.join(records, "2026-09-25-old.md"), decision(), "utf8");
    assert.throws(() => checkDecisions(directory), /filename/u);
    rmSync(path.join(records, "2026-09-25-old.md"));
    writeFileSync(
      path.join(records, "dr-0001-fixture.md"),
      decision().replace(
        "decision_status: accepted",
        "decision_status: superseded",
      ),
    );
    assert.throws(() => checkDecisions(directory), /status/u);
    mkdirSync(path.join(directory, "docs", "superpowers"));
    assert.throws(() => checkDecisions(directory), /superpowers/u);
  });
});

test("the decision tree rejects reused stable identifiers", () => {
  fixture((directory) => {
    const records = path.join(directory, "docs", "decisions");
    const second = decision()
      .replace("subject: fixture:DR-0001", "subject: fixture:second-choice")
      .replace(
        "canonical_for: fixture choice",
        "canonical_for: another choice",
      );
    const duplicate = path.join(records, "dr-0001-second-choice.md");
    writeFileSync(duplicate, second);
    assert.throws(
      () => checkDecisions(directory),
      /duplicate decision ID DR-0001/u,
    );
    rmSync(duplicate);
    writeFileSync(
      path.join(records, "dr-0002-second-choice.md"),
      second.replaceAll("DR-0001", "DR-0002"),
    );
    assert.doesNotThrow(() => checkDecisions(directory));
  });
});

test("a private Change scope companion cannot return", () => {
  fixture((directory) => {
    const change = path.join(directory, "openspec", "changes", "fixture");
    mkdirSync(change, { recursive: true });
    writeFileSync(path.join(change, "scope.toml"), "schema_version = 1\n");
    assert.throws(() => checkNoScope(directory), /scope companion/u);
  });
});

test("repository file links cannot escape the checkout", () => {
  const outside = pathToFileURL(path.resolve(root, "..", "outside.md")).href;
  assert.throws(() => repositoryFileUri(outside), /escapes repository root/u);
  const inside = pathToFileURL(path.join(root, "README.md")).href;
  assert.doesNotThrow(() => repositoryFileUri(inside));
  const directory = pathToFileURL(path.join(root, "docs")).href;
  assert.doesNotThrow(() => repositoryFileUri(directory));
});

test("an ignored local file cannot satisfy a repository source link", () => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(path.join(root, "build", "ddwg-source-link-"));
  try {
    const target = path.join(directory, "local evidence.md");
    writeFileSync(target, "# Local Evidence\n\nThis file is not source.\n");
    const relative = path.relative(root, target).split(path.sep).join("/");
    assert.equal(gitFiles().includes(relative), false);
    assert.throws(
      () => repositoryFileUri(pathToFileURL(target).href),
      /not repository source/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("a delivered directory alias must also resolve to repository source", () => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(path.join(root, "build", "ddwg-source-alias-"));
  try {
    const delivered = path.join(directory, "delivered");
    symlinkSync(path.join(root, "docs"), delivered, "junction");
    const relativeAlias = path
      .relative(root, delivered)
      .split(path.sep)
      .join("/");
    const sources = [...gitFiles(), relativeAlias];
    assert.doesNotThrow(() =>
      repositoryFileUri(pathToFileURL(delivered).href, sources),
    );
    assert.throws(
      () => repositoryFileUri(pathToFileURL(delivered).href),
      /not repository source/u,
    );

    const local = path.join(directory, "local");
    mkdirSync(local);
    writeFileSync(path.join(local, "README.md"), "# Local State\n");
    const localAlias = path.join(directory, "local-alias");
    symlinkSync(local, localAlias, "junction");
    const candidate = path.relative(root, localAlias).split(path.sep).join("/");
    assert.throws(
      () =>
        repositoryFileUri(pathToFileURL(localAlias).href, [
          ...sources,
          candidate,
        ]),
      /not repository source/u,
    );
    const outsideAlias = path.join(directory, "outside-alias");
    symlinkSync(path.dirname(root), outsideAlias, "junction");
    const outsideCandidate = path
      .relative(root, outsideAlias)
      .split(path.sep)
      .join("/");
    assert.throws(
      () =>
        repositoryFileUri(pathToFileURL(outsideAlias).href, [
          ...sources,
          outsideCandidate,
        ]),
      /escapes repository root/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("native Markdown preserves delimiter flanking and ordinary emphasis", () => {
  assert.equal(micromark("a*_*"), "<p>a*_*</p>");
  assert.equal(
    micromark("*review* and **acceptance**"),
    "<p><em>review</em> and <strong>acceptance</strong></p>",
  );
});

test("native math keeps Markdownlint tokens and inline/display rendering", async () => {
  const require = createRequire(import.meta.url);
  const mathEntry = createRequire(require.resolve("markdownlint/sync")).resolve(
    "micromark-extension-math",
  );
  const { math, mathHtml } = await import(pathToFileURL(mathEntry).href);
  const source = "# Mathematics\n\nInline $x^2$.\n\n$$\nx^2 + y^2 = z^2\n$$\n";
  assert.deepEqual(
    [...walkMarkdown(markdownTokens(source))]
      .filter((token) => ["mathText", "mathFlow"].includes(token.type))
      .map((token) => token.type),
    ["mathText", "mathFlow"],
  );
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { "mathematics.md": source } }),
  );
  const classes = new Set();
  new Parser({
    onopentag(_name, attributes) {
      for (const name of (attributes.class ?? "").split(/\s+/u))
        classes.add(name);
    },
  }).end(
    micromark(source, { extensions: [math()], htmlExtensions: [mathHtml()] }),
  );
  for (const name of ["math-inline", "math-display", "katex", "katex-display"])
    assert.equal(classes.has(name), true, name);
});

test("native math admits only explicitly owned trusted renderer settings", async () => {
  const require = createRequire(import.meta.url);
  const mathEntry = createRequire(require.resolve("markdownlint/sync")).resolve(
    "micromark-extension-math",
  );
  const renderer = createRequire(mathEntry)("katex");
  const { math, mathHtml } = await import(pathToFileURL(mathEntry).href);
  const expression = "\\href{https://example.org}{x}";
  const destinations = (html) => {
    const found = [];
    new Parser({
      onopentag(_name, attributes) {
        if (attributes.href !== undefined) found.push(attributes.href);
      },
    }).end(html);
    return found;
  };
  const renderMath = (options) =>
    micromark(`$${expression}$`, {
      extensions: [math()],
      htmlExtensions: [mathHtml(options)],
    });

  assert.deepEqual(destinations(renderMath()), []);
  assert.deepEqual(
    destinations(
      renderer.renderToString(expression, Object.create({ trust: true })),
    ),
    [],
  );
  assert.equal(
    destinations(renderMath({ trust: true })).includes("https://example.org"),
    true,
  );

  const original = Object.getOwnPropertyDescriptor(Object.prototype, "trust");
  try {
    Object.defineProperty(Object.prototype, "trust", {
      configurable: true,
      writable: true,
      value: true,
    });
    assert.deepEqual(destinations(renderMath()), []);
    assert.deepEqual(destinations(renderMath({ trust: false })), []);
    assert.equal(
      destinations(renderMath({ trust: true })).includes("https://example.org"),
      true,
    );
  } finally {
    if (original) Object.defineProperty(Object.prototype, "trust", original);
    else delete Object.prototype.trust;
  }
  assert.deepEqual(
    Object.getOwnPropertyDescriptor(Object.prototype, "trust"),
    original,
  );
});

test("Markdown spacing preserves fenced and indented literal content", async () => {
  for (const source of [
    "# Example\n\n```text\nfirst\n\n\nsecond\n```\n",
    "# Example\n\n````text\n```\n\n\n```\n````\n",
    "# Example\n\n    first\n\n\n    second\n",
    "# Example\n\n> ```text\n> first\n>\n>\n> second\n> ```\n",
  ]) {
    assert.doesNotThrow(() =>
      lintMarkdown({ files: [], strings: { "fixture.md": source } }),
    );
    assert.deepEqual(await textViolations("fixture.md", source), []);
  }
});

test("Markdown spacing rejects reader padding after literal content", async () => {
  const source = "# Example\n\n```text\nfirst\n\n\nsecond\n```\n\n\nOutside.\n";
  assert.throws(
    () => lintMarkdown({ files: [], strings: { "fixture.md": source } }),
    /fixture\.md:10 \[MD012\]/u,
  );
  assert.deepEqual(await textViolations("fixture.md", source), []);
});

test("one blank line is allowed; visual padding is not", () => {
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { "fixture.md": "# A\n\nText\n" } }),
  );
  assert.throws(
    () =>
      lintMarkdown({ files: [], strings: { "fixture.md": "# A\n\n\nText\n" } }),
    /fixture\.md:3 \[MD012\]/u,
  );
});

test("Markdown list spacing rejects gaps between single-paragraph items", () => {
  for (const body of [
    "- First.\n\n- Second.\n",
    "- First with a wrapped\n  paragraph.\n\n- Second.\n",
    "1. First.\n\n2. Second.\n",
    "- [x] First.\n\n- [ ] Second.\n",
    "> - First.\n>\n> - Second.\n",
    "- Parent.\n  - First.\n\n  - Second.\n",
    "<!-- markdownlint-disable list-item-spacing -->\n\n- First.\n\n- Second.\n",
    "<!-- remark-lint: disable list-item-spacing -->\n\n- First.\n\n- Second.\n",
  ]) {
    assert.throws(
      () =>
        lintMarkdown({
          files: [],
          strings: { "spacing.md": `# Spacing\n\n${body}` },
        }),
      /spacing\.md:\d+ \[list-item-spacing\]/u,
      body,
    );
  }
});

test("Markdown list spacing preserves meaningful block and literal boundaries", () => {
  for (const body of [
    "- First with a wrapped\n  paragraph.\n- Second.\n",
    "- First.\n\n  Separate paragraph.\n\n- Second.\n",
    "- First.\n\n  ```text\n  first\n\n\n  second\n  ```\n\n- Second.\n",
    "- Parent.\n  - First.\n  - Second.\n- Next parent.\n",
    "> - First.\n> - Second.\n",
    "- First.\n\n## Separate Work\n\n- Second.\n",
    "```markdown\n- First.\n\n- Second.\n```\n",
  ]) {
    assert.doesNotThrow(() =>
      lintMarkdown({
        files: [],
        strings: { "spacing.md": `# Spacing\n\n${body}` },
      }),
    );
  }
});

test("Markdown list spacing rejects inconsistent genuinely loose lists", () => {
  const source = "# Spacing\n\n- First.\n\n  Separate paragraph.\n- Second.\n";
  assert.throws(
    () => lintMarkdown({ files: [], strings: { "spacing.md": source } }),
    /spacing\.md:\d+ \[list-item-spacing\]/u,
  );
});

test("document comments cannot waive native Markdown formatting", () => {
  for (const control of [
    "<!-- prettier-ignore -->",
    "<!-- prettier-ignore-start -->",
    "<!-- prettier-ignore-end -->",
  ]) {
    for (const source of [
      `# Spacing\n\n${control}\n\n> First.\n>\n>\n> Second.\n`,
      `# Spacing\n\n> ${control}\n>\n> First.\n`,
      `# Spacing\n\n- ${control}\n  First.\n`,
    ]) {
      assert.throws(
        () => lintMarkdown({ files: [], strings: { "spacing.md": source } }),
        /Remove the.*control comment/u,
      );
    }
    for (const source of [
      `# Spacing\n\n\`${control}\` is a literal example.\n`,
      `# Spacing\n\n\`\`\`text\n${control}\n\`\`\`\n`,
    ]) {
      assert.doesNotThrow(() =>
        lintMarkdown({ files: [], strings: { "spacing.md": source } }),
      );
    }
  }
  assert.doesNotThrow(() =>
    lintMarkdown({
      files: [],
      strings: {
        "spacing.md":
          "# Spacing\n\n<!-- prettier-ignore was discussed in review. -->\n\nUse the report.\n",
      },
    }),
  );
});

test("changelog categories may recur under different releases, not one release", () => {
  const lint = (source) =>
    lintMarkdown({ files: [], strings: { "fixture.md": source } });
  const first = "# Changelog\n\n## [4.0.1]\n\n### Fixed\n\n- New.\n\n";
  const second = "## [4.0.0]\n\n### Fixed\n\n- Old.\n";
  assert.doesNotThrow(() => lint(first + second));

  assert.throws(() => lint(first + "### Fixed\n\n- Duplicate.\n"), /MD024/u);
});

test("native structured formats preserve literal blank lines", async () => {
  for (const [name, source] of [
    ["example.mjs", "export const literal = `first\n\n\nsecond`;\n"],
    ["example.yaml", "literal: |\n  first\n\n\n  second\n"],
    ["example.toml", 'literal = """\nfirst\n\n\nsecond\n"""\n'],
  ]) {
    assert.deepEqual(await textViolations(name, source), [], name);
    if (name.endsWith(".toml")) {
      assert.equal(parseToml(source).literal, "first\n\n\nsecond\n");
    }
  }
});

test("one formatting attempt uses one fresh native TOML formatter", async (context) => {
  const NativeModule = WebAssembly.Module;
  let constructions = 0;
  WebAssembly.Module = new Proxy(NativeModule, {
    construct(target, args) {
      constructions += 1;
      return Reflect.construct(target, args);
    },
  });
  const nativeSpawn = childProcess.spawnSync;
  const mocked = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args?.[0] === nodeTool("prettier", "prettier"))
        return { status: 0, stdout: "", stderr: "" };
      return nativeSpawn(command, args, options);
    },
  );
  syncBuiltinESMExports();
  try {
    await formatSource();
    assert.equal(
      constructions,
      1,
      "matching and formatting share one native instance",
    );
  } finally {
    WebAssembly.Module = NativeModule;
    mocked.mock.restore();
    syncBuiltinESMExports();
  }
});

test("native TOML formatting checks literal Git paths and preserves data", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-toml-format-"));
  try {
    writeFileSync(
      path.join(directory, ".gitignore"),
      readFileSync(path.join(root, ".gitignore"), "utf8") +
        "\n/tools/\n/.config/\n/package.json\n/node_modules\n",
    );
    cpSync(path.join(root, "tools"), path.join(directory, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package.json"),
      path.join(directory, "package.json"),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const name = "{literal} source.toml";
    const file = path.join(directory, name);
    const source = 'literal = """\nfirst\n\n\nsecond\n"""\n\n\nnext=2\n';
    writeFileSync(file, source);
    mkdirSync(path.join(directory, "build"));
    writeFileSync(path.join(directory, "build", "cache.toml"), "broken = [\n");
    writeFileSync(path.join(directory, "taplo.toml"), "include = []\n");
    writeFileSync(
      path.join(directory, "dprint.json"),
      '{ "excludes": ["**"] }\n',
    );
    const init = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(init.status, 0, init.stderr);
    const add = spawnSync("git", ["add", "--", name], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(add.status, 0, add.stderr);
    assertFixtureSources(directory, [
      ".gitignore",
      name,
      "dprint.json",
      "taplo.toml",
    ]);
    const invoke = (args) =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "format", ...args], {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
      });
    const checked = invoke(["--check"]);
    assert.ifError(checked.error);
    assert.equal(checked.status, 1, checked.stderr);
    assert.ok(checked.stderr.includes(name), checked.stderr);
    assert.equal(readFileSync(file, "utf8"), source);
    const written = invoke([]);
    assert.ifError(written.error);
    assert.equal(written.status, 0, written.stderr);
    assert.equal(
      readFileSync(file, "utf8"),
      'literal = """\nfirst\n\n\nsecond\n"""\n\nnext = 2\n',
    );
    const clean = invoke(["--check"]);
    assert.ifError(clean.error);
    assert.equal(clean.status, 0, clean.stderr);
    for (const malformed of ["[invalid\n", "value = 1\nvalue = 2\n"]) {
      writeFileSync(file, malformed);
      const invalid = invoke(["--check"]);
      assert.ifError(invalid.error);
      assert.equal(invalid.status, 1, invalid.stderr);
      assert.ok(invalid.stderr.includes(name), invalid.stderr);
      assert.equal(readFileSync(file, "utf8"), malformed);
    }
    const retained =
      '#:schema offline-only\nliteral = """\nfirst\n\n\nsecond\n"""\n\nitems = [2, 1]\n\nz = 2\na = 1\n';
    writeFileSync(file, retained);
    const preserved = invoke([]);
    assert.ifError(preserved.error);
    assert.equal(preserved.status, 0, preserved.stderr);
    assert.equal(readFileSync(file, "utf8"), retained);
    const policy = path.join(directory, ".config/checks/format/toml.toml");
    const policyBefore = readFileSync(policy, "utf8");
    writeFileSync(policy, `${policyBefore}unknownNativeOption = true\n`);
    const diagnostic = invoke(["--check"]);
    assert.ifError(diagnostic.error);
    assert.equal(diagnostic.status, 1, diagnostic.stderr);
    assert.match(diagnostic.stderr, /unknownNativeOption/u);
    assert.equal(readFileSync(file, "utf8"), retained);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("Git selection excludes worktree deletions and preserves native failure evidence", (context) => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(
    path.join(root, "build", "ddwg-git-selection-"),
  );
  const previousCeiling = process.env.GIT_CEILING_DIRECTORIES;
  try {
    process.env.GIT_CEILING_DIRECTORIES = fs.realpathSync.native(
      path.dirname(directory),
    );
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    writeFileSync(path.join(directory, "README.md"), "# Source\n");
    writeFileSync(path.join(directory, "removed.md"), "# Removed\n");
    const indexed = spawnSync("git", ["add", "--", "README.md", "removed.md"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.ifError(indexed.error);
    assert.equal(indexed.status, 0, indexed.stderr);
    rmSync(path.join(directory, "removed.md"));
    writeFileSync(path.join(directory, "candidate.md"), "# Candidate\n");
    assert.deepEqual(gitFiles(directory), ["README.md", "candidate.md"]);
    rmSync(path.join(directory, ".git"), { recursive: true });
    let diagnostic = "";
    context.mock.method(process.stderr, "write", (chunk) => {
      diagnostic += chunk;
      return true;
    });
    assert.throws(() => gitFiles(directory), /git.*exited/u);
    assert.match(diagnostic, /not a git repository/u);
  } finally {
    if (previousCeiling === undefined)
      delete process.env.GIT_CEILING_DIRECTORIES;
    else process.env.GIT_CEILING_DIRECTORIES = previousCeiling;
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("the text boundary retains TOML syntax without duplicating native formatting", async () => {
  const toml = ".config/checks/markdown/markdownlint.toml";
  assert.deepEqual(
    await textViolations(toml, "[MD013]\nline_length = 80\n"),
    [],
  );
  assert.match((await textViolations(toml, "[invalid\n"))[0], /invalid TOML/u);
});

test("native TOML policy preserves data and agrees with the source format owner", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-toml-policy-"));
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    const policyPath = path.join(directory, ".config/checks/format/toml.toml");
    const original = readFileSync(policyPath, "utf8");
    assert.doesNotThrow(() => checkConfigurationLayout(directory));
    for (const [before, after] of [
      ["lineWidth = 80", "lineWidth = 120"],
      ["indentWidth = 2", "indentWidth = 4"],
      ['newLineKind = "lf"', 'newLineKind = "crlf"'],
      ['quoteStyle = "maintain"', 'quoteStyle = "preferDouble"'],
      ["sortKeys = false", "sortKeys = true"],
      ["sortArrays = false", "sortArrays = true"],
      ["sortInlineTables = false", "sortInlineTables = true"],
      [
        '"comment.forceLeadingSpace" = false',
        '"comment.forceLeadingSpace" = true',
      ],
      ['"cargo.applyConventions" = false', '"cargo.applyConventions" = true'],
    ]) {
      assert.ok(original.includes(before), before);
      writeFileSync(policyPath, original.replace(before, after));
      assert.throws(
        () => checkConfigurationLayout(directory),
        /native TOML.*policy/u,
        after,
      );
    }
    writeFileSync(policyPath, `${original}unknownNativeOption = true\n`);
    assert.throws(
      () => checkConfigurationLayout(directory),
      /unknownNativeOption/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("unowned code formats fail explicitly instead of accepting raw whitespace", async () => {
  for (const name of ["sample.py", "sample.rs", "sample.sh"]) {
    assert.match(
      (await textViolations(name, "first\n\n\nsecond\n"))[0],
      /no native formatting owner/u,
      name,
    );
  }
});

test("Markdown checks consume the native concern-local TOML policy", () => {
  const relative = ".config/checks/markdown/markdownlint.toml";
  assert.ok(existsSync(path.join(root, relative)), relative);
  const source = "# Example\n\n<!-- vale off -->\n\nUse the report.\n";
  assert.throws(
    () => lintMarkdown({ files: [], strings: { "fixture.md": source } }),
    /no-quality-control/u,
  );
});

test("Markdown lint checks literal Git source without a glob or ambient policy", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-lint-"));
  try {
    writeFileSync(
      path.join(directory, ".gitignore"),
      readFileSync(path.join(root, ".gitignore"), "utf8") +
        "\n/tools/\n/.config/\n/package.json\n/node_modules\n",
    );
    cpSync(path.join(root, "tools"), path.join(directory, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package.json"),
      path.join(directory, "package.json"),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const source = "{literal} markdown.md";
    const file = path.join(directory, source);
    writeFileSync(file, "# Example\n\nUse the report.\n");
    mkdirSync(path.join(directory, "build"));
    writeFileSync(
      path.join(directory, "build", "cache.md"),
      "# Cache\n\n\n\nIgnored install state.\n",
    );
    writeFileSync(
      path.join(directory, ".markdownlint-cli2.jsonc"),
      '{"ignores":["**"],"config":{"default":false}}\n',
    );
    writeFileSync(
      path.join(directory, ".markdownlint.json"),
      '{"default":false}\n',
    );
    const init = spawnSync("git", ["init", "-q", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(init.status, 0, init.stderr);
    const add = spawnSync("git", ["add", "--", source], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(add.status, 0, add.stderr);
    const selected = [
      ".gitignore",
      ".markdownlint-cli2.jsonc",
      ".markdownlint.json",
      source,
    ];
    assertFixtureSources(directory, selected);
    const invoke = () =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "lint"], {
        cwd: directory,
        encoding: "utf8",
        timeout: 10_000,
      });
    const valid = invoke();
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
    const paddedList =
      "# Example\n\n- First with a wrapped\n  paragraph.\n\n- Second.\n";
    writeFileSync(file, paddedList);
    const listResult = invoke();
    assert.ifError(listResult.error);
    assert.equal(listResult.status, 1, listResult.stderr);
    assert.match(listResult.stderr, /list-item-spacing/u);
    assert.ok(listResult.stderr.includes(source), listResult.stderr);
    assert.equal(readFileSync(file, "utf8"), paddedList);
    const literals = [
      "# Example\n\n```text\nfirst\n\n\nsecond\n```\n",
      "# Example\n\n    first\n\n\n    second\n",
    ];
    for (const literal of literals) {
      writeFileSync(file, literal);
      const native = invoke();
      assert.ifError(native.error);
      assert.equal(native.status, 0, native.stderr);
      const layout = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          "import { checkTextLayout } from './tools/docs/content.mjs'; await checkTextLayout();",
        ],
        { cwd: directory, encoding: "utf8", timeout: 10_000 },
      );
      assert.ifError(layout.error);
      assert.equal(layout.status, 0, layout.stderr);
      assert.equal(readFileSync(file, "utf8"), literal);
    }
    writeFileSync(file, `${literals[0]}\n\nOutside.\n`);
    const padded = invoke();
    assert.ifError(padded.error);
    assert.equal(padded.status, 1, padded.stderr);
    assert.match(padded.stderr, /MD012/u);
    writeFileSync(
      file,
      "# Example\n\n<!-- markdownlint-disable MD013 -->\n\n" +
        "word ".repeat(40).trim() +
        "\n",
    );
    const before = readFileSync(file, "utf8");
    const invalid = invoke();
    assert.ifError(invalid.error);
    assert.equal(invalid.status, 1, invalid.stderr);
    assert.match(invalid.stderr, /MD013/u);
    assert.ok(invalid.stderr.includes(source), invalid.stderr);
    assert.equal(readFileSync(file, "utf8"), before);
    const historical = "openspec/changes/archive/fixture/specs/quality/spec.md";
    const historicalFile = path.join(directory, historical);
    mkdirSync(path.dirname(historicalFile), { recursive: true });
    writeFileSync(
      historicalFile,
      "# Historical Spec\n\n" + "word ".repeat(40).trim() + "\n",
    );
    const addHistory = spawnSync("git", ["add", "--", historical], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(addHistory.status, 0, addHistory.stderr);
    assertFixtureSources(directory, [...selected, historical]);
    writeFileSync(file, "# Example\n\nUse the report.\n");
    const archived = invoke();
    assert.equal(archived.status, 1, archived.stderr);
    assert.match(archived.stderr, /MD013/u);
    assert.ok(archived.stderr.includes("spec.md"), archived.stderr);
    assert.equal(
      readFileSync(historicalFile, "utf8"),
      "# Historical Spec\n\n" + "word ".repeat(40).trim() + "\n",
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("native formatting policy preserves prose and ignores ambient editor settings", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-format-policy-"));
  try {
    const tomlRelative = ".config/checks/markdown/markdownlint.toml";
    cpSync(path.join(root, "tools"), path.join(directory, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    const manifest = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    );
    delete manifest.prettier;
    writeFileSync(
      path.join(directory, "package.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    writeFileSync(
      path.join(directory, ".editorconfig"),
      "root = true\n\n[*]\nindent_size = 8\nmax_line_length = 20\n",
    );
    const sentence = "Keep the report readable without changing its meaning.";
    writeFileSync(
      path.join(directory, "README.md"),
      `# Report\n\n${sentence}\n`,
    );
    writeFileSync(
      path.join(directory, "sample.json"),
      '{"result":{"ready":true}}\n',
    );
    const sources = new Map([
      ["sample.mjs", "export const result={ready:true}\n"],
      ["nested/sample.cjs", "module.exports={ready:true}\n"],
      [
        "nested/sample.ts",
        "export const result:{ready:boolean}={ready:true}\n",
      ],
      ["build/tracked.mjs", "export const result={ready:true}\n"],
      ["build/tracked.json", '{"result":{"ready":true}}\n'],
      ["build/tracked.yml", "ready:    true\n"],
      ["quote source.md", "# Report\n\n> First.\n>\n>\n> Second.\n"],
      ["nested quote.md", "# Report\n\n> > First.\n> >\n> >\n> > Second.\n"],
      ["quote boundary.md", "# Report\n\nText.\n> Quoted.\n"],
      [
        "openspec/changes/archive/fixture/design.md",
        "# Historical Design\n\nUse   the report.\n",
      ],
      [".worktrees/tracked.md", "# Source\n\nUse   the report.\n"],
      [
        ".worktrees/node_modules/tracked.mjs",
        "export const result={ready:true}\n",
      ],
    ]);
    writeFileSync(
      path.join(directory, ".gitignore"),
      "node_modules/\nbuild/\n.worktrees/\n/tools/\n/.config/\n/package.json\n/node_modules\n",
    );
    writeFileSync(
      path.join(directory, ".prettierignore"),
      `${[...sources.keys()].join("\n")}\n`,
    );
    for (const [relative, source] of sources) {
      const target = path.join(directory, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, source);
    }
    const added = spawnSync(
      "git",
      [
        "add",
        "--force",
        "--",
        tomlRelative,
        ...[...sources.keys()].filter(
          (relative) =>
            relative.startsWith("build/") || relative.startsWith(".worktrees/"),
        ),
      ],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(added.error);
    assert.equal(added.status, 0, added.stderr);
    const ignored = path.join(directory, "build", "ignored.mjs");
    const ignoredSource = "export const result={ready:true}\n";
    writeFileSync(ignored, ignoredSource);
    const literals = new Map([
      ["literal.md", "# Report\n\n> ```text\n> first\n>\n>\n> second\n> ```\n"],
      ["literal.mjs", "export const literal = `first\n\n\nsecond`;\n"],
      ["literal.yaml", "literal: |\n  first\n\n\n  second\n"],
    ]);
    for (const [relative, source] of literals) {
      writeFileSync(path.join(directory, relative), source);
    }
    const nativeToml = path.join(directory, tomlRelative);
    const tomlBefore = readFileSync(nativeToml, "utf8");
    assertFixtureSources(directory, [
      ".editorconfig",
      ".gitignore",
      ".prettierignore",
      "README.md",
      "sample.json",
      tomlRelative,
      ...sources.keys(),
      ...literals.keys(),
    ]);
    const checked = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format", "--check"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(checked.error);
    assert.equal(checked.status, 1, checked.stderr);
    for (const relative of sources.keys()) {
      assert.ok(
        checked.stderr.replaceAll("\\", "/").includes(relative),
        `format check omitted ${relative}: ${checked.stderr}`,
      );
    }
    const result = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format"],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
      },
    );
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(path.join(directory, "README.md"), "utf8"),
      `# Report\n\n${sentence}\n`,
    );
    assert.equal(
      readFileSync(path.join(directory, "sample.json"), "utf8"),
      '{ "result": { "ready": true } }\n',
    );
    for (const [relative, source] of sources) {
      assert.notEqual(
        readFileSync(path.join(directory, relative), "utf8"),
        source,
        relative,
      );
    }
    assert.equal(readFileSync(ignored, "utf8"), ignoredSource);
    for (const [relative, source] of literals) {
      assert.equal(
        readFileSync(path.join(directory, relative), "utf8"),
        source,
      );
    }
    assert.equal(
      readFileSync(path.join(directory, "quote source.md"), "utf8"),
      "# Report\n\n> First.\n>\n> Second.\n",
    );
    assert.equal(
      readFileSync(path.join(directory, "nested quote.md"), "utf8"),
      "# Report\n\n> > First.\n> >\n> > Second.\n",
    );
    assert.equal(
      readFileSync(path.join(directory, "quote boundary.md"), "utf8"),
      "# Report\n\nText.\n\n> Quoted.\n",
    );
    assert.equal(readFileSync(nativeToml, "utf8"), tomlBefore);
    const repaired = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format", "--check"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(repaired.error);
    assert.equal(repaired.status, 0, repaired.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("current Markdown inventory excludes official archives, not live topics", () => {
  const files = [
    "README.md",
    "docs/decide.md",
    ".superpowers/source.md",
    ".worktrees/source.md",
    "build/source.md",
    "node_modules/source.md",
    "openspec/changes/archive/old/spec.md",
  ];
  assert.deepEqual(sourceMarkdown(files), files);
  assert.deepEqual(currentMarkdown(files), files.slice(0, -1));
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

test("English and spacing failures identify a file and line", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u4e2d\u6587\n"))[0],
    /docs\/example\.md:2/u,
  );
  assert.throws(
    () =>
      lintMarkdown({
        files: [],
        strings: { "docs/example.md": "# Heading\n\n\nText\n" },
      }),
    /docs\/example\.md:3 \[MD012\]/u,
  );
});

test("English source checks include supplementary Han characters", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u{20000}\n"))[0] ??
      "",
    /docs\/example\.md:2: CJK text/u,
  );
});

test("native source comment controls cannot suppress formatting while literal examples stay data", async () => {
  const { format } = await import("prettier");
  for (const separator of [" ", "\t", "\n"]) {
    const source = `<!-- prettier-ignore-attribute${separator}class -->\n<div class = 'example'>Read the source.</div>\n`;
    assert.equal(await format(source, { parser: "html" }), source);
    assert.match(
      (await textViolations("fixture.html", source)).join("\n"),
      /Prettier control comment/u,
      `native HTML whitespace: ${JSON.stringify(separator)}`,
    );
  }
  assert.equal(
    await format("<div class = 'example'>Read the source.</div>\n", {
      parser: "html",
    }),
    '<div class="example">Read the source.</div>\n',
  );
  for (const [relative, source] of [
    ["fixture.mjs", "// prettier-ignore\nconst result={ready: true};\n"],
    ["fixture.ts", "/* prettier-ignore */\nconst result: boolean = true;\n"],
    ["fixture.yaml", "# prettier-ignore\nready:   true\n"],
    ["fixture.jsonc", '// prettier-ignore\n{"ready":   true}\n'],
    ["fixture.css", "/* prettier-ignore */\na{color: red;}\n"],
    [
      "fixture.html",
      "<!-- prettier-ignore-attribute class -->\n<div class='example'>Read the source.</div>\n",
    ],
    ["fixture.graphql", "# prettier-ignore\ntype Query { result: String }\n"],
    ["fixture.hbs", "{{! prettier-ignore }}\n<div>{{value}}</div>\n"],
  ]) {
    assert.match(
      (await textViolations(relative, source)).join("\n"),
      /Prettier control comment/u,
      relative,
    );
  }
  for (const [relative, source] of [
    ["fixture.mjs", 'const message = "// prettier-ignore";\n'],
    ["fixture.ts", 'const message: string = "/* prettier-ignore */";\n'],
    ["fixture.yaml", 'message: "# prettier-ignore"\n'],
    ["fixture.yaml", "message: |\n  # prettier-ignore\n"],
    ["fixture.jsonc", '{"message": "// prettier-ignore"}\n'],
    ["fixture.css", 'a::before { content: "/* prettier-ignore */"; }\n'],
    ["fixture.html", "<p>prettier-ignore</p>\n"],
    [
      "fixture.graphql",
      'type Query { result(message: String = "prettier-ignore"): String }\n',
    ],
    ["fixture.hbs", "<p>prettier-ignore</p>\n"],
    ["fixture.toml", "# dprint-ignore\nkey=   1\n"],
  ]) {
    assert.deepEqual(await textViolations(relative, source), [], relative);
  }
});

test("only declared plain-text identities bypass native parser ownership", async () => {
  for (const name of ["Makefile", "Dockerfile", "custom-build"]) {
    assert.match(
      (await textViolations(name, "Build the source.\n"))[0] ?? "",
      /no native formatting owner/u,
      name,
    );
  }
  for (const name of ["LICENSE", "VERSION", ".gitignore", ".gitattributes"]) {
    assert.deepEqual(await textViolations(name, "Plain text.\n"), [], name);
  }
});

test("parser ownership resolves the source path rather than the caller cwd", async () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-parser-owner-"),
  );
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const source =
    "#!/usr/bin/env node\nconst value = 1;\n\n\nconsole.log(value);\n";
  writeFileSync(path.join(directory.path, "cli"), source);
  const module = pathToFileURL(
    path.join(directory.path, "tools/docs/content.mjs"),
  ).href;
  const script = `
    import assert from "node:assert/strict";
    const { formatTargets, textViolations } = await import(${JSON.stringify(module)});
    assert.deepEqual((await formatTargets(["cli"], { fileExtensions: ["toml"], fileNames: [] })).prettier, ["cli"]);
    assert.deepEqual(await textViolations("cli", ${JSON.stringify(source)}), []);
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 15_000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test("native Git attributes bind complete ordered reports to selected paths", (context) => {
  const selected = ["README.md", "docs/with space.md"];
  const nativeSpawn = childProcess.spawnSync;
  const valid =
    selected
      .flatMap((file) => [file, "text", "auto", file, "eol", "lf"])
      .join("\0") + "\0";
  let report = valid;
  const observation = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (command === "git" && args[0] === "check-attr") {
        assert.deepEqual(args, ["check-attr", "--stdin", "-z", "text", "eol"]);
        assert.equal(options.cwd, root);
        assert.equal(options.input, `${selected.join("\0")}\0`);
        return { status: 0, stdout: report, stderr: "" };
      }
      return nativeSpawn(command, args, options);
    },
  );
  syncBuiltinESMExports();
  try {
    assert.deepEqual(
      [...sourceAttributes(selected)],
      selected.map((file) => [file, { text: "auto", eol: "lf" }]),
    );
    for (const invalid of [
      valid.slice(0, -1),
      valid.slice(0, valid.indexOf(selected[1])),
      valid.replace("README.md", "docs/other.md"),
      valid.replace("\0text\0", "\0eol\0"),
    ]) {
      report = invalid;
      assert.throws(
        () => sourceAttributes(selected),
        /native Git text attribute/u,
      );
    }
  } finally {
    observation.mock.restore();
    syncBuiltinESMExports();
  }
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

test("tracked text refuses invalid UTF-8 and NUL while declared binary assets remain reachable", () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-source-bytes-"),
  );
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const initialized = spawnSync("git", ["init", "--quiet", directory.path], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(initialized.error);
  assert.equal(initialized.status, 0, initialized.stderr);
  writeFileSync(path.join(directory.path, ".gitignore"), "node_modules/\n");
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\n",
  );
  writeFileSync(path.join(directory.path, "asset.bin"), Buffer.from([0, 255]));
  const module = pathToFileURL(
    path.join(directory.path, "tools/docs/content.mjs"),
  ).href;
  const command = [
    "--input-type=module",
    "--eval",
    `const { checkTextLayout } = await import(${JSON.stringify(module)}); await checkTextLayout();`,
  ];
  for (const [bytes, message] of [
    [Buffer.from([0xc3, 0x28]), /README\.md:.*UTF-8/u],
    [Buffer.from("Readable\0hidden\n"), /README\.md:.*NUL/u],
  ]) {
    writeFileSync(path.join(directory.path, "README.md"), bytes);
    const result = spawnSync(process.execPath, command, {
      cwd: directory.path,
      encoding: "utf8",
      timeout: 15_000,
    });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, message);
  }
  writeFileSync(path.join(directory.path, "README.md"), "# Valid source\n");
  const valid = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\nREADME.md -text\n",
  );
  const hidden = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(hidden.error);
  assert.notEqual(hidden.status, 0);
  assert.match(
    hidden.stderr,
    /README\.md:.*native text owner cannot be declared binary/u,
  );
});

test("native spacing checks archived Markdown; other text keeps its own boundary", async () => {
  const file = "openspec/changes/archive/example/spec.md";
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { [file]: "# Example\n\nText.\n" } }),
  );
  assert.throws(
    () =>
      lintMarkdown({
        files: [],
        strings: { [file]: "# Example\n\n\nText.\n" },
      }),
    /:3 \[MD012\]/u,
  );
  for (const name of ["LICENSE", ".config/README.txt", ".config/example.ini"]) {
    assert.deepEqual(await textViolations(name, "First\n\nSecond\n"), []);
    assert.match(
      (await textViolations(name, "First\n\n\nSecond\n"))[0],
      /:3: consecutive blank lines/u,
    );
  }
});

test("native source tools treat selected filenames as literal inputs", async () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-literal-tool-input-"),
  );
  writeFileSync(
    path.join(directory.path, ".gitignore"),
    "/tools/\n/.config/\n/node_modules/\n/package.json\n",
  );
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  cpSync(path.join(root, ".config"), path.join(directory.path, ".config"), {
    recursive: true,
  });
  cpSync(
    path.join(root, "package.json"),
    path.join(directory.path, "package.json"),
  );
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const initialized = spawnSync("git", ["init", "--quiet", directory.path], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(initialized.error);
  assert.equal(initialized.status, 0, initialized.stderr);
  const source = path.join(directory.path, "--write.md");
  writeFileSync(source, "# Native Source\n\n-  Item\n");
  const lychee = nativeToolBinary("lychee");
  const environment = {
    ...process.env,
    DDWG_LYCHEE_BIN: /[/\\]/u.test(lychee) ? path.resolve(lychee) : lychee,
  };
  const invoke = (command) =>
    spawnSync(process.execPath, ["tools/docs/cli.mjs", ...command], {
      cwd: directory.path,
      env: environment,
      encoding: "utf8",
      timeout: 30_000,
    });
  const unformatted = invoke(["format", "--check"]);
  assert.ifError(unformatted.error);
  assert.notEqual(unformatted.status, 0);
  assert.match(unformatted.stderr, /Code style issues/u);
  const formatted = invoke(["format"]);
  assert.ifError(formatted.error);
  assert.equal(formatted.status, 0, formatted.stderr);
  const rechecked = invoke(["format", "--check"]);
  assert.ifError(rechecked.error);
  assert.equal(rechecked.status, 0, rechecked.stderr);
  assert.equal(readFileSync(source, "utf8"), "# Native Source\n\n- Item\n");

  const { linkCheckArguments } = await import("../tools/docs/content.mjs");
  const literalFiles = [
    process.platform === "win32" ? "--dump.md" : "with\nline.md",
    "with space.md",
  ].map((name) => path.join(directory.path, name));
  const target = path.join(directory.path, "target.md");
  const list = path.join(directory.path, "files.txt");
  writeFileSync(target, "# Target\n");
  writeFileSync(list, `${source}\n`);
  for (const file of literalFiles)
    writeFileSync(file, "# Links\n\n[Target](target.md#target)\n");
  const check = () =>
    spawnSync(
      environment.DDWG_LYCHEE_BIN,
      linkCheckArguments(list, { literalFiles }),
      {
        cwd: directory.path,
        encoding: "utf8",
        timeout: 15_000,
      },
    );
  const valid = check();
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  writeFileSync(literalFiles[0], "# Links\n\n[Missing](target.md#absent)\n");
  const broken = check();
  assert.ifError(broken.error);
  assert.notEqual(broken.status, 0);
  assert.match(`${broken.stdout}${broken.stderr}`, /absent|fragment/iu);
  const rejected = invoke(["links"]);
  assert.ifError(rejected.error);
  assert.notEqual(rejected.status, 0);
  assert.match(`${rejected.stdout}${rejected.stderr}`, /absent|fragment/iu);
  writeFileSync(literalFiles[0], "# Links\n\n[Target](target.md#target)\n");
  const corrected = invoke(["links"]);
  assert.ifError(corrected.error);
  assert.equal(corrected.status, 0, corrected.stderr);
});

test("pinned lychee rejects a broken local fragment", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-links-test-"));
  try {
    writeFileSync(path.join(directory, "target.md"), "# Present\n");
    writeFileSync(
      path.join(directory, "source.md"),
      "[Missing](target.md#absent)\n",
    );
    const result = spawnSync(
      nativeToolBinary("lychee"),
      [
        "--offline",
        "--include-fragments=anchor-only",
        "--no-progress",
        "--max-retries",
        "0",
        path.join(directory, "source.md"),
      ],
      {
        encoding: "utf8",
        timeout: 15_000,
      },
    );
    assert.notEqual(result.status, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("live link checking is explicit and retains one native policy owner", async () => {
  const content = await import("../tools/docs/content.mjs");
  assert.equal(typeof content.linkCheckArguments, "function");
  const offline = content.linkCheckArguments("files.txt");
  const online = content.linkCheckArguments("files.txt", { online: true });
  assert.equal(offline[0], "--config");
  assert.equal(offline[1], path.join(root, ".config/checks/links/lychee.toml"));
  assert.ok(!offline.some((arg) => arg.startsWith("--offline")));
  assert.ok(online.includes("--offline=false"));
  assert.deepEqual(
    online.filter((arg) => arg !== "--offline=false"),
    offline,
  );
  assert.ok(!online.includes("--accept"));
  assert.equal(online.at(-1), "files.txt");
});

test("native link extraction refuses warnings before checking targets", (context) => {
  const actualSpawn = childProcess.spawnSync;
  const output = context.mock.method(process.stdout, "write", () => true);
  let extractions = 0;
  let checks = 0;
  let sourceList;
  let nativeOutput;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      const result = actualSpawn(command, args, options);
      if (args.includes("--dump")) {
        extractions += 1;
        sourceList = args[args.indexOf("--files-from") + 1];
        nativeOutput = result.stdout;
        return {
          ...result,
          stderr: `${result.stderr ?? ""}native link extraction warning\n`,
        };
      }
      if (args.includes("--files-from")) checks += 1;
      return result;
    },
  );
  syncBuiltinESMExports();
  try {
    assert.throws(
      () => checkLinks(),
      /emitted warning output:[\s\S]*native link extraction warning/u,
    );
    assert.equal(extractions, 1);
    assert.equal(checks, 0);
    assert.equal(output.mock.callCount(), 1);
    assert.equal(output.mock.calls[0].arguments[0], nativeOutput);
    assert.equal(existsSync(path.dirname(sourceList)), false);
  } finally {
    mock.mock.restore();
    output.mock.restore();
    syncBuiltinESMExports();
  }
});

test("native link policy rejects broken local anchors and makes no network request", async () => {
  const { createServer } = await import("node:http");
  const { linkCheckArguments } = await import("../tools/docs/content.mjs");
  let requests = 0;
  const server = createServer((_request, response) => {
    requests += 1;
    response.writeHead(500).end();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-links-"));
  try {
    const target = path.join(directory, "target.md");
    const source = path.join(directory, "source.md");
    const list = path.join(directory, "files.txt");
    writeFileSync(target, "# Report\n");
    writeFileSync(list, `${source}\n`);
    const runLinks = (fragment) => {
      writeFileSync(
        source,
        `# Links\n\n[Report](target.md#${fragment})\n\n[Remote](http://127.0.0.1:${server.address().port}/)\n`,
      );
      return spawnSync(nativeToolBinary("lychee"), linkCheckArguments(list), {
        cwd: root,
        encoding: "utf8",
        timeout: 10_000,
      });
    };
    const valid = runLinks("report");
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
    const broken = runLinks("missing");
    assert.ifError(broken.error);
    assert.notEqual(broken.status, 0);
    assert.match(`${broken.stdout}${broken.stderr}`, /missing|fragment/iu);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(requests, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    await new Promise((resolve) => server.close(resolve));
  }
});

test("native online link policy actually requests the target and rejects HTTP failures", async () => {
  const { createServer } = await import("node:http");
  const { linkCheckArguments } = await import("../tools/docs/content.mjs");
  let requests = 0;
  let status = 200;
  const server = createServer((_request, response) => {
    requests += 1;
    response.writeHead(status).end("link fixture");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    using directory = mkdtempDisposableSync(
      path.join(os.tmpdir(), "ddwg-online-links-"),
    );
    const source = path.join(directory.path, "source.md");
    const list = path.join(directory.path, "files.txt");
    writeFileSync(
      source,
      `# Links\n\n[Remote](http://127.0.0.1:${server.address().port}/)\n`,
    );
    writeFileSync(list, `${source}\n`);
    const check = async () => {
      const child = childProcess.spawn(
        nativeToolBinary("lychee"),
        linkCheckArguments(list, { online: true }),
        {
          cwd: root,
          stdio: ["ignore", "pipe", "pipe"],
          timeout: 10_000,
        },
      );
      let output = "";
      child.stdout.on("data", (bytes) => {
        output += bytes;
      });
      child.stderr.on("data", (bytes) => {
        output += bytes;
      });
      const code = await new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", resolve);
      });
      return { code, output };
    };
    const valid = await check();
    assert.equal(valid.code, 0, valid.output);
    assert.ok(requests > 0, "online mode made an actual HTTP request");
    const beforeFailure = requests;
    status = 404;
    const invalid = await check();
    assert.notEqual(invalid.code, 0, invalid.output);
    assert.ok(
      requests > beforeFailure,
      "the failed request reached the target",
    );
    assert.match(invalid.output, /404/u);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("link checking rejects an incomplete-mode waiver", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "links", "--allow-incomplete"],
    { cwd: root, encoding: "utf8", timeout: 10_000 },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /links accepts only --online/u);
});

test("the public link check rejects cache and Git state but accepts candidate source", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-source-links-"));
  try {
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    for (const prerequisite of ["tools", ".config", "package.json"]) {
      cpSync(
        path.join(root, prerequisite),
        path.join(directory, prerequisite),
        {
          recursive: true,
        },
      );
    }
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const entry = path.join(directory, "README.md");
    const original = "# Source Links\n";
    writeFileSync(entry, original);
    mkdirSync(path.join(directory, "docs"));
    writeFileSync(
      path.join(directory, "docs", "README.md"),
      "# Guide\n\nRead the [source entry](../README.md).\n",
    );
    writeFileSync(
      path.join(directory, ".gitignore"),
      "node_modules/\n/node_modules\n/tools/\n/.config/\n/package.json\nbuild/\n.cache/\n",
    );
    const added = spawnSync(
      "git",
      ["add", "--", ".gitignore", "README.md", "docs/README.md"],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(added.error);
    assert.equal(added.status, 0, added.stderr);
    assertFixtureSources(directory, [
      ".gitignore",
      "README.md",
      "docs/README.md",
    ]);
    const check = (target) => {
      const source = `${original}\n[Source reference](${target})\n`;
      writeFileSync(entry, source);
      const result = spawnSync(
        process.execPath,
        ["tools/docs/cli.mjs", "links"],
        {
          cwd: directory,
          encoding: "utf8",
          timeout: 15_000,
          env: { ...process.env, DDWG_LYCHEE_BIN: nativeToolBinary("lychee") },
        },
      );
      assert.equal(readFileSync(entry, "utf8"), source);
      return result;
    };
    const tracked = check("docs/README.md");
    assert.ifError(tracked.error);
    assert.equal(tracked.status, 0, tracked.stderr);
    const candidate = "docs/source link candidate.md";
    writeFileSync(path.join(directory, candidate), "# Candidate Source\n");
    const valid = check(encodeURI(candidate));
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);

    for (const target of [
      "build/local-only.md",
      ".cache/local-only.md",
      ".git/local-only.md",
    ]) {
      const file = path.join(directory, target);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "# Local State\n");
      const invalid = check(target);
      assert.ifError(invalid.error);
      assert.notEqual(invalid.status, 0, `${target}: ${invalid.stdout}`);
      assert.match(invalid.stderr, /not repository source/u, target);
    }
    assertFixtureSources(directory, [
      ".gitignore",
      "README.md",
      "docs/README.md",
      candidate,
    ]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("retired quality owners are absent from current source and dependencies", () => {
  const retiredPackage =
    /(?:^|\/)(?:@textlint|@cspell|cspell[^/]*|textlint[^/]*|write-good|markdownlint-cli2(?:-formatter-default)?)(?:\/|$)/u;
  const lock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"), "utf8"),
  );
  assert.deepEqual(
    Object.keys(lock.packages).filter((name) => retiredPackage.test(name)),
    [],
  );
  const currentCode = gitFiles().filter((name) =>
    /^(?:tools|tests)\/.*\.mjs$/u.test(name),
  );
  for (const name of currentCode) {
    if (!existsSync(path.join(root, name))) continue;
    const source = readFileSync(path.join(root, name), "utf8");
    assert.doesNotMatch(
      source,
      /(?:from\s+["']|require\(["'])(?:@textlint\/|@cspell\/|cspell|write-good|textlint-)/u,
      name,
    );
  }
  for (const name of [
    "@textlint",
    "@cspell",
    "cspell",
    "write-good",
    "textlint-util-to-string",
    "markdownlint-cli2",
    "markdownlint-cli2-formatter-default",
  ]) {
    assert.equal(
      existsSync(path.join(root, "node_modules", name)),
      false,
      name,
    );
  }
  for (const name of [
    ".config/tools/textlint.json",
    ".config/tools/cspell.json",
    ".config/checks/markdown/markdownlint-cli2.toml",
  ]) {
    assert.equal(existsSync(path.join(root, name)), false, name);
  }
});

test("verification context binds native workspace capacity without claiming VM identity", async () => {
  const { workspaceObservation } = await import("../tools/docs/runtime.mjs");
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
