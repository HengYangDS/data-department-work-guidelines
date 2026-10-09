import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { nodeTool, root } from "../../tools/docs/runtime.mjs";

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
    const { validateOpenSpec } = await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/openspec.mjs")).href)});
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
    const { validateOpenSpec } = await import(${JSON.stringify(pathToFileURL(path.join(root, "tools/docs/openspec.mjs")).href)});
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
    const runtime = path.join(directory, "tools", "docs", "openspec.mjs");
    mkdirSync(path.dirname(runtime), { recursive: true });
    cpSync(path.join(root, "tools", "docs", "openspec.mjs"), runtime);
    cpSync(
      path.join(root, "tools", "docs", "runtime.mjs"),
      path.join(path.dirname(runtime), "runtime.mjs"),
    );
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
