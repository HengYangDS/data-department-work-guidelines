import assert from "node:assert/strict";
import childProcess from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import { test } from "node:test";
import YAML from "yaml";
import { validateCi } from "../tools/docs/ci.mjs";
import * as ci from "../tools/docs/ci.mjs";
import { assertNodeRuntime, readText, root } from "../tools/docs/runtime.mjs";

const github = readText(".github/workflows/docs-verify.yml");
const gitlab = readText(".gitlab-ci.yml");
const offline = readText(".github/workflows/offline-verify.yml");

const dependencyPolicy = `[[IgnoredVulns]]
id = "GHSA-vfj7-8cjw-p6xm"
ignoreUntil = 2026-10-18
reason = "Human-approved reviewed development checks only; retain complete raw findings."
`;
const dependencyReviewTime = new Date("2026-10-04T00:00:00Z");

test("withdrawal leaves an explicit native policy with no ignored findings", () => {
  const policy = ci.parseDependencyPolicy("IgnoredVulns = []\n");
  assert.deepEqual(Object.keys(policy), ["IgnoredVulns"]);
  assert.deepEqual(policy.IgnoredVulns, []);
  const lock = JSON.parse(readText("package-lock.json"));
  assert.doesNotThrow(() =>
    ci.validateDependencyInput(lock, policy, new Date("2026-10-18T00:00:00Z")),
  );
  assert.throws(
    () => ci.parseDependencyPolicy("# Removed the only disposition.\n"),
    /native OSV fields/u,
  );
});

test("the bounded native disposition admits only the approved development input", () => {
  const policy = ci.parseDependencyPolicy(dependencyPolicy);
  const lock = JSON.parse(readText("package-lock.json"));
  const current = new Date("2026-10-04T00:00:00Z");
  assert.doesNotThrow(() => ci.validateDependencyInput(lock, policy, current));
  for (const mutate of [
    (copy) => {
      copy.packages["node_modules/braces"].dev = false;
    },
    (copy) => {
      copy.packages["node_modules/braces"].version = "3.0.4";
    },
    (copy) => {
      delete copy.packages["node_modules/braces"];
    },
    (copy) => {
      copy.packages["node_modules/other/node_modules/braces"] = {
        ...copy.packages["node_modules/braces"],
        dev: false,
      };
    },
  ]) {
    const changed = structuredClone(lock);
    mutate(changed);
    assert.throws(
      () => ci.validateDependencyInput(changed, policy, current),
      /approved|development|braces/u,
    );
  }
  assert.throws(
    () =>
      ci.validateDependencyInput(
        lock,
        policy,
        new Date("2026-10-18T00:00:00Z"),
      ),
    /expired/u,
  );
  for (const invalid of [
    dependencyPolicy.replace("GHSA-vfj7-8cjw-p6xm", "OSV-OTHER"),
    `${dependencyPolicy}\nscope = { name = "braces" }\n`,
    `${dependencyPolicy}\n[[PackageOverrides]]\nignore = true\n`,
  ]) {
    assert.throws(
      () => ci.parseDependencyPolicy(invalid),
      /native|approved|policy/u,
    );
  }
});

test("native raw evidence must cover the exact input and retain every finding", () => {
  const policy = ci.parseDependencyPolicy(dependencyPolicy);
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = ci.validateDependencyInput(
    lock,
    policy,
    new Date("2026-10-04T00:00:00Z"),
  );
  const report = {
    results: [
      {
        source: { path: "package-lock.json", type: "lockfile" },
        packages: [...identities.values()].map((identity) => ({
          package: identity,
          dependency_groups: ["dev"],
        })),
      },
    ],
  };
  const braces = report.results[0].packages.find(
    (entry) => entry.package.name === "braces",
  );
  braces.vulnerabilities = [
    { id: "GHSA-vfj7-8cjw-p6xm", aliases: ["CVE-2026-93687"] },
    { id: "OSV-UNRELATED" },
  ];
  assert.deepEqual(
    ci.validateDependencyEvidence(report, identities, policy, 1),
    {
      findings: 2,
      approvedFindings: 1,
    },
  );
  assert.equal(
    braces.vulnerabilities.length,
    2,
    "admission must not filter raw evidence",
  );
  for (const mutate of [
    (copy) => {
      copy.results[0].source.path = "../other/package-lock.json";
    },
    (copy) => {
      copy.results[0].packages.pop();
    },
    (copy) => {
      copy.results[0].packages.push(copy.results[0].packages[0]);
    },
    (copy) => {
      copy.results[0].packages.find(
        (entry) => entry.package.name === "braces",
      ).dependency_groups = ["prod"];
    },
    (copy) => {
      copy.results[0].packages.find(
        (entry) => entry.package.name === "braces",
      ).vulnerabilities = [];
    },
  ]) {
    const changed = structuredClone(report);
    mutate(changed);
    assert.throws(
      () => ci.validateDependencyEvidence(changed, identities, policy, 1),
      /native|approved|input|finding/u,
    );
  }
  assert.throws(
    () => ci.validateDependencyEvidence(report, identities, policy, 0),
    /exit|native/u,
  );
});

test("actual native audit retains undisposed raw findings and blocks advisory inputs", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-osv-"));
  // Fixed native OSV database archives, produced by the official ZIP format.
  const databases = [
    "UEsDBBQAAAAIAAAARF2pSvlpjgAAAKkAAAAYAAAAR0hTQS12Zmo3LThjanctcDZ4bS5qc29uLY7BDoIwGIPfpWe2/IABw82T3vWkIWaOfzrMYGEENYR3dxiTXpp+bToj6Ac7dZ14CLbvUCGVpSQksE00+8NxJybTlmKr25fwxdvFyPWNNZZXIKOsECkJ2pyIqp/OkVDGsB5X4jLDK/1Ud0Y1g3UfPmFkF6udX7c65WKC26A0BywJ/k9CrCKXJHPUS718AVBLAQIUAxQAAAAIAAAARF2pSvlpjgAAAKkAAAAYAAAAAAAAAAAAAACAAQAAAABHSFNBLXZmajctOGNqdy1wNnhtLmpzb25QSwUGAAAAAAEAAQBGAAAAxAAAAAAA",
    "UEsDBBQAAAAIAAAARF2pSvlpjgAAAKkAAAAYAAAAR0hTQS12Zmo3LThjanctcDZ4bS5qc29uLY7BDoIwGIPfpWe2/IABw82T3vWkIWaOfzrMYGEENYR3dxiTXpp+bToj6Ac7dZ14CLbvUCGVpSQksE00+8NxJybTlmKr25fwxdvFyPWNNZZXIKOsECkJ2pyIqp/OkVDGsB5X4jLDK/1Ud0Y1g3UfPmFkF6udX7c65WKC26A0BywJ/k9CrCKXJHPUS718AVBLAwQUAAAACAAAAERdt1qSG5QAAACrAAAAGgAAAE9TVi1GSVhUVVJFLVVOUkVMQVRFRC5qc29uLY7RCoJAEEX/ZZ7dZdQo8C3IIIgC04hCYl1na4lVcSUI8d8bI7gvl3sO3BG8fpJT9zf13rYNJBDKlUQIwNZcjqez2O4ueZGlojhk6X6dpxseXVtbY2lGIoyWIkSBixwx+eXKhDKG9DATtxE6pV/qQZCMQLr1Hz+QY7XpHJONcrxA1StNHqYA/l88qxBLlDGUUzl9AVBLAQIUAxQAAAAIAAAARF2pSvlpjgAAAKkAAAAYAAAAAAAAAAAAAACAAQAAAABHSFNBLXZmajctOGNqdy1wNnhtLmpzb25QSwECFAMUAAAACAAAAERdt1qSG5QAAACrAAAAGgAAAAAAAAAAAAAAgAHEAAAAT1NWLUZJWFRVUkUtVU5SRUxBVEVELmpzb25QSwUGAAAAAAIAAgCOAAAAkAEAAAAA",
  ];
  try {
    mkdirSync(path.join(directory, ".config/checks/dependencies"), {
      recursive: true,
    });
    // Native scanner fixtures must not inherit the live exception's expiry.
    writeFileSync(
      path.join(directory, ci.dependencyPolicyPath),
      "IgnoredVulns = []\n",
    );
    const braces = JSON.parse(readText("package-lock.json")).packages[
      "node_modules/braces"
    ];
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify({
        lockfileVersion: 3,
        packages: { "": {}, "node_modules/braces": braces },
      }),
    );
    mkdirSync(path.join(directory, "cache/osv-scalibr/npm"), {
      recursive: true,
    });
    // A caller's broad ignore cannot shadow the explicitly selected native policy.
    writeFileSync(
      path.join(directory, "osv-scanner.toml"),
      "[[PackageOverrides]]\nignore = true\n",
    );
    const environment = {
      ...process.env,
      OSV_SCALIBR_LOCAL_DB_CACHE_DIRECTORY: path.join(directory, "cache"),
    };
    writeFileSync(
      path.join(directory, "cache/osv-scalibr/npm/all.zip"),
      Buffer.from("UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==", "base64"),
    );
    const accepted = ci.auditDependencies({
      repository: directory,
      offline: true,
      environment,
      now: dependencyReviewTime,
    });
    const raw = JSON.parse(
      readFileSync(path.join(accepted.evidence, "raw.json"), "utf8"),
    );
    const rawBytes = readFileSync(path.join(accepted.evidence, "raw.json"));
    const decision = JSON.parse(
      readFileSync(path.join(accepted.evidence, "decision.json"), "utf8"),
    );
    assert.equal(raw.results[0].packages[0].vulnerabilities, undefined);
    assert.equal(decision.results[0].packages[0].vulnerabilities, undefined);
    assert.deepEqual(
      JSON.parse(
        readFileSync(path.join(accepted.evidence, "execution.json"), "utf8"),
      ).execution.map((entry) => entry.status),
      [0, 0],
    );
    for (const database of databases) {
      writeFileSync(
        path.join(directory, "cache/osv-scalibr/npm/all.zip"),
        Buffer.from(database, "base64"),
      );
      assert.throws(
        () =>
          ci.auditDependencies({
            repository: directory,
            offline: true,
            environment,
            now: dependencyReviewTime,
          }),
        /unapproved dependency findings/u,
      );
    }
    assert.deepEqual(
      readFileSync(path.join(accepted.evidence, "raw.json")),
      rawBytes,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native audit refusal retains malformed, warning, failure and timeout output", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-refusal-"));
  const actual = childProcess.spawnSync;
  let response;
  const timedExecutions = [];
  let calls = 0;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[0] !== "scan") return actual(command, args, options);
      calls++;
      if (response === "timeout" || response === "timeout-before-output") {
        const output =
          'process.stdout.write("partial native report"); process.stderr.write("timeout diagnostic");';
        const result = actual(
          process.execPath,
          [
            "-e",
            response === "timeout"
              ? `${output} setTimeout(() => {}, 5000);`
              : `setTimeout(() => { ${output} }, 5000);`,
          ],
          { ...options, timeout: 1000 },
        );
        timedExecutions.push({ result, command: [command, ...args] });
        return result;
      }
      if (response === "malformed") {
        writeFileSync(
          args[args.indexOf("--output-file") + 1],
          "not a native report",
        );
        return { status: 0, stdout: "", stderr: "" };
      }
      return response;
    },
  );
  syncBuiltinESMExports();
  try {
    mkdirSync(path.join(directory, path.dirname(ci.dependencyPolicyPath)), {
      recursive: true,
    });
    writeFileSync(
      path.join(directory, ci.dependencyPolicyPath),
      dependencyPolicy,
    );
    cpSync(
      path.join(root, "package-lock.json"),
      path.join(directory, "package-lock.json"),
    );
    for (const result of [
      { status: 1, stdout: "partial report", stderr: "native warning" },
      { status: 127, stdout: "failed report", stderr: "execution failed" },
      { status: 0, stdout: "", stderr: "" },
      "malformed",
      "timeout",
      "timeout-before-output",
    ]) {
      response = result;
      const before = calls;
      assert.throws(
        () =>
          ci.auditDependencies({
            repository: directory,
            offline: true,
            now: dependencyReviewTime,
          }),
        /native|ENOENT|JSON|Unexpected/u,
      );
      assert.equal(
        calls,
        before + 1,
        "failed raw execution cannot reach disposition",
      );
    }
    const evidenceRoot = path.join(directory, "build/evidence/dependencies");
    const records = readdirSync(evidenceRoot).map((name) => {
      const evidence = path.join(evidenceRoot, name);
      const execution = JSON.parse(
        readFileSync(path.join(evidence, "execution.json"), "utf8"),
      );
      return {
        execution,
        stdout: readFileSync(path.join(evidence, "raw.stdout"), "utf8"),
        stderr: readFileSync(path.join(evidence, "raw.stderr"), "utf8"),
      };
    });
    assert.equal(records.length, 6);
    assert.ok(
      records.some(
        (entry) =>
          entry.stderr === "native warning" &&
          entry.stdout === "partial report",
      ),
    );
    assert.equal(timedExecutions.length, 2);
    for (const { result, command } of timedExecutions) {
      assert.equal(result.error?.code, "ETIMEDOUT");
      const record = records.find(
        (entry) =>
          JSON.stringify(entry.execution.execution[0].command) ===
          JSON.stringify(command),
      );
      assert.ok(record, "each native timeout must retain its own evidence");
      assert.equal(record.stdout, result.stdout ?? "");
      assert.equal(record.stderr, result.stderr ?? "");
      assert.equal(record.execution.execution[0].status, result.status);
      assert.equal(record.execution.execution[0].signal, result.signal);
      assert.equal(record.execution.execution[0].error, result.error.message);
    }
    assert.equal(timedExecutions[1].result.stdout, "");
    assert.equal(timedExecutions[1].result.stderr, "");
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("an unapproved raw finding cannot disappear between native scans", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-findings-"));
  const actual = childProcess.spawnSync;
  const lock = JSON.parse(readText("package-lock.json"));
  const policy = ci.parseDependencyPolicy(dependencyPolicy);
  const identities = ci.validateDependencyInput(
    lock,
    policy,
    new Date("2026-10-04T00:00:00Z"),
  );
  const reports = [];
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[0] !== "scan") return actual(command, args, options);
      const raw = reports.length === 0;
      const report = {
        results: [
          {
            source: {
              type: "lockfile",
              path: path.join(directory, "package-lock.json"),
            },
            packages: [...identities.values()].map((identity) => ({
              package: identity,
              dependency_groups: ["dev"],
              ...(raw && identity.name === "braces"
                ? {
                    vulnerabilities: [
                      { id: "GHSA-vfj7-8cjw-p6xm" },
                      { id: "OSV-UNRELATED" },
                    ],
                  }
                : {}),
            })),
          },
        ],
      };
      reports.push(report);
      writeFileSync(
        args[args.indexOf("--output-file") + 1],
        JSON.stringify(report),
      );
      return { status: raw ? 1 : 0, stdout: "", stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    mkdirSync(path.join(directory, path.dirname(ci.dependencyPolicyPath)), {
      recursive: true,
    });
    writeFileSync(
      path.join(directory, ci.dependencyPolicyPath),
      dependencyPolicy,
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    assert.throws(
      () =>
        ci.auditDependencies({
          repository: directory,
          offline: true,
          now: dependencyReviewTime,
        }),
      /unapproved dependency findings/u,
    );
    assert.equal(
      reports.length,
      2,
      "both original native reports must be retained",
    );
    const evidenceRoot = path.join(directory, "build/evidence/dependencies");
    const [scan] = readdirSync(evidenceRoot);
    const evidence = path.join(evidenceRoot, scan);
    for (const [index, mode] of ["raw", "decision"].entries()) {
      assert.equal(
        readFileSync(path.join(evidence, `${mode}.json`), "utf8"),
        JSON.stringify(reports[index]),
      );
    }
    assert.deepEqual(
      JSON.parse(
        readFileSync(path.join(evidence, "execution.json"), "utf8"),
      ).execution.map((entry) => entry.status),
      [1, 0],
    );
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("stable withdrawal observes the public registry without ambient npm policy", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-registry-"));
  const actual = childProcess.spawnSync;
  const lock = JSON.parse(readText("package-lock.json"));
  const policy = ci.parseDependencyPolicy(dependencyPolicy);
  const identities = ci.validateDependencyInput(
    lock,
    policy,
    new Date("2026-10-04T00:00:00Z"),
  );
  const observations = [];
  let version = "3.0.3";
  let registryFailure = false;
  let scans = 0;
  const environment = {
    ...process.env,
    npm_config_registry: "https://mirror.invalid",
    NPM_CONFIG_OFFLINE: "true",
    npm_config_prefer_offline: "true",
    npm_config_cache: path.join(directory, "ambient-cache"),
    NPM_TOKEN: "fixture-only",
    NODE_AUTH_TOKEN: "fixture-only",
  };
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[1] === "view") {
        mkdirSync(options.env.npm_config_cache, { recursive: true });
        writeFileSync(
          path.join(options.env.npm_config_cache, "retained-cache"),
          "disposable native cache",
        );
        observations.push({
          args,
          options,
          configs: ["npm_config_userconfig", "npm_config_globalconfig"].map(
            (key) => readFileSync(options.env[key], "utf8"),
          ),
        });
        if (registryFailure)
          return {
            status: 127,
            stdout: "partial registry result",
            stderr: "native registry diagnostic",
          };
        return { status: 0, stdout: JSON.stringify(version), stderr: "" };
      }
      if (args[0] !== "scan") return actual(command, args, options);
      const raw = scans++ % 2 === 0;
      writeFileSync(
        args[args.indexOf("--output-file") + 1],
        JSON.stringify({
          results: [
            {
              source: {
                type: "lockfile",
                path: path.join(directory, "package-lock.json"),
              },
              packages: [...identities.values()].map((identity) => ({
                package: identity,
                dependency_groups: ["dev"],
                ...(raw && identity.name === "braces"
                  ? { vulnerabilities: [{ id: "GHSA-vfj7-8cjw-p6xm" }] }
                  : {}),
              })),
            },
          ],
        }),
      );
      return { status: raw ? 1 : 0, stdout: "", stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    mkdirSync(path.join(directory, path.dirname(ci.dependencyPolicyPath)), {
      recursive: true,
    });
    writeFileSync(
      path.join(directory, ci.dependencyPolicyPath),
      dependencyPolicy,
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    writeFileSync(
      path.join(directory, ".npmrc"),
      "registry=https://mirror.invalid\noffline=true\n",
    );
    const accepted = ci.auditDependencies({
      repository: directory,
      environment,
      now: dependencyReviewTime,
    });
    const { args, options, configs } = observations[0];
    for (const argument of [
      "--registry=https://registry.npmjs.org",
      "--offline=false",
      "--prefer-online=true",
      "--prefer-offline=false",
      "--fetch-retries=0",
    ])
      assert.ok(
        args.includes(argument),
        `official observation requires ${argument}`,
      );
    assert.notEqual(
      options.cwd,
      directory,
      "repository npm policy cannot influence the observation",
    );
    assert.equal(args[args.indexOf("--prefix") + 1], options.cwd);
    assert.equal(options.env.npm_config_registry, undefined);
    assert.equal(options.env.NPM_CONFIG_OFFLINE, undefined);
    assert.equal(options.env.npm_config_offline, "false");
    assert.equal(options.env.NPM_TOKEN, undefined);
    assert.equal(options.env.NODE_AUTH_TOKEN, undefined);
    assert.notEqual(options.env.npm_config_cache, environment.npm_config_cache);
    assert.deepEqual(configs, ["", ""]);
    assert.equal(
      existsSync(options.cwd),
      false,
      "successful observation must retire its native cache and config stage",
    );
    for (const name of ["empty-user.npmrc", "empty-global.npmrc"]) {
      assert.equal(
        readFileSync(path.join(accepted.evidence, name), "utf8"),
        "",
      );
    }
    const execution = JSON.parse(
      readFileSync(path.join(accepted.evidence, "execution.json"), "utf8"),
    );
    assert.deepEqual(execution.execution[0].command.slice(1), args);
    version = "3.0.4";
    assert.throws(
      () =>
        ci.auditDependencies({
          repository: directory,
          environment,
          now: dependencyReviewTime,
        }),
      /official stable braces changed/u,
    );
    assert.equal(scans, 2, "changed upstream cannot reach another native scan");
    assert.equal(observations.length, 2);
    assert.equal(
      existsSync(observations[1].options.cwd),
      false,
      "upstream withdrawal must also retire its native stage",
    );
    const evidenceRoot = path.join(directory, "build/evidence/dependencies");
    const retained = readdirSync(evidenceRoot).map((name) =>
      readFileSync(
        path.join(evidenceRoot, name, "stable-version.stdout"),
        "utf8",
      ),
    );
    assert.ok(retained.includes(JSON.stringify("3.0.4")));
    registryFailure = true;
    assert.throws(
      () =>
        ci.auditDependencies({
          repository: directory,
          environment,
          now: dependencyReviewTime,
        }),
      /official stable version observation failed/u,
    );
    assert.equal(
      scans,
      2,
      "failed registry observation cannot reach native scans",
    );
    assert.equal(
      existsSync(observations[2].options.cwd),
      false,
      "native failure must retire its cache stage",
    );
    const failures = readdirSync(evidenceRoot).map((name) => ({
      stdout: readFileSync(
        path.join(evidenceRoot, name, "stable-version.stdout"),
        "utf8",
      ),
      stderr: readFileSync(
        path.join(evidenceRoot, name, "stable-version.stderr"),
        "utf8",
      ),
    }));
    assert.ok(
      failures.some(
        (entry) =>
          entry.stdout === "partial registry result" &&
          entry.stderr === "native registry diagnostic",
      ),
    );
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native audit refuses an input changed after raw evidence before disposition", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-drift-"));
  const actual = childProcess.spawnSync;
  let calls = 0;
  const lock = JSON.parse(readText("package-lock.json"));
  const policy = ci.parseDependencyPolicy(dependencyPolicy);
  const identities = ci.validateDependencyInput(
    lock,
    policy,
    new Date("2026-10-04T00:00:00Z"),
  );
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[0] !== "scan") return actual(command, args, options);
      calls++;
      const packages = [...identities.values()].map((identity) => ({
        package: identity,
        dependency_groups: ["dev"],
        ...(identity.name === "braces"
          ? { vulnerabilities: [{ id: "GHSA-vfj7-8cjw-p6xm" }] }
          : {}),
      }));
      writeFileSync(
        args[args.indexOf("--output-file") + 1],
        JSON.stringify({
          results: [
            {
              source: {
                type: "lockfile",
                path: path.join(directory, "package-lock.json"),
              },
              packages,
            },
          ],
        }),
      );
      writeFileSync(
        path.join(directory, "package-lock.json"),
        "changed after scan",
      );
      return { status: 1, stdout: "", stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    mkdirSync(path.join(directory, path.dirname(ci.dependencyPolicyPath)), {
      recursive: true,
    });
    writeFileSync(
      path.join(directory, ci.dependencyPolicyPath),
      dependencyPolicy,
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    assert.throws(
      () =>
        ci.auditDependencies({
          repository: directory,
          offline: true,
          now: dependencyReviewTime,
        }),
      /inputs changed/u,
    );
    assert.equal(calls, 1, "stale input cannot reach the native disposition");
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});

function changedGitLab(jobName, change) {
  const pipeline = YAML.parse(gitlab);
  change(pipeline, pipeline[jobName]);
  return YAML.stringify(pipeline);
}

test("GitLab candidate qualification selects only the existing offline jobs", () => {
  const pipeline = YAML.parse(gitlab);
  const candidate = {
    if: '$DDWG_OFFLINE_CANDIDATE && $CI_COMMIT_REF_PROTECTED == "true" && ($CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main") && ($CI_PIPELINE_SOURCE == "api" || $CI_PIPELINE_SOURCE == "web")',
  };
  const exclude = { if: "$DDWG_OFFLINE_CANDIDATE", when: "never" };
  assert.deepEqual(pipeline.workflow.rules.slice(0, 2), [candidate, exclude]);
  assert.deepEqual(pipeline[".offline:verify"].rules.slice(0, 2), [
    candidate,
    exclude,
  ]);
  for (const system of ["linux", "macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.deepEqual(
        pipeline[`docs:verify:${system}${suffix}`].rules[0],
        exclude,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const mutate of [
    (copy) => copy.workflow.rules.shift(),
    (copy) => copy[".offline:verify"].rules.shift(),
    (copy) => copy["docs:verify:windows"].rules.shift(),
    (copy) => {
      copy[".offline:verify"].rules[0].if = "$DDWG_OFFLINE_CANDIDATE";
    },
  ]) {
    const changed = structuredClone(pipeline);
    mutate(changed);
    assert.throws(
      () => validateCi(github, YAML.stringify(changed), offline),
      /GitLab/u,
    );
  }
});

test("GitLab version-tag admission matches the GitHub namespace", () => {
  const pipeline = YAML.parse(gitlab);
  const tagRule = "$CI_COMMIT_TAG =~ /^v[^\\/]*$/";
  assert.deepEqual(YAML.parse(github).on.push.tags, ["v*"]);
  assert.equal(pipeline.workflow.rules[2].if, tagRule);
  for (const system of ["linux", "macos", "windows"]) {
    assert.equal(
      pipeline[`docs:verify:${system}`].rules[1].if,
      `$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || ${tagRule}`,
    );
  }
  assert.deepEqual(pipeline[".offline:verify"].rules.slice(2), [
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "web"` },
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "api"` },
  ]);
  for (const [tag, admitted] of [
    ["v7.0.4", true],
    ["v7.1.0-rc.1", true],
    ["v", true],
    ["vfoo", true],
    ["v7.0.4/topic", false],
    ["v7/review", false],
    ["v/7.0.4", false],
    ["release-7.0.4", false],
    ["candidate/dev", false],
    ["", false],
  ]) {
    assert.equal(/^v[^/]*$/u.test(tag), admitted, tag);
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("the CI contract rejects broader GitLab tag routes", () => {
  for (const [owner, ruleIndex] of [
    ["workflow", 2],
    ["docs:verify:linux", 1],
    ["docs:verify:macos", 1],
    ["docs:verify:windows", 1],
    [".offline:verify", 2],
    [".offline:verify", 3],
  ]) {
    const pipeline = YAML.parse(gitlab);
    pipeline[owner].rules[ruleIndex].if = pipeline[owner].rules[
      ruleIndex
    ].if.replace("$CI_COMMIT_TAG =~ /^v[^\\/]*$/", "$CI_COMMIT_TAG");
    assert.throws(
      () => validateCi(github, YAML.stringify(pipeline), offline),
      /GitLab/u,
      `${owner}:${ruleIndex}`,
    );
  }
});

test("GitLab runnable verification jobs name their phase and platform", () => {
  const pipeline = YAML.parse(gitlab);
  const jobs = Object.keys(pipeline).filter((name) =>
    /^(?:docs|offline):verify(?:$|:)/u.test(name),
  );
  const expected = ["linux", "macos", "windows"].flatMap((system) => [
    `docs:verify:${system}`,
    `docs:verify:${system}:review`,
    `offline:verify:${system}`,
  ]);
  assert.deepEqual(jobs.sort(), expected.sort());
  for (const phase of ["docs", "offline"]) {
    const owner = `.${phase}:verify`;
    assert.ok(pipeline[owner], `${phase} shared verification owner is missing`);
    for (const name of jobs.filter((job) => job.startsWith(`${phase}:`))) {
      assert.equal(pipeline[name].extends, owner, name);
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("GitLab verification rejects platform-less aliases and runnable shared owners", () => {
  for (const phase of ["docs", "offline"]) {
    const owner = `.${phase}:verify`;
    const platform = `${phase}:verify:linux`;
    for (const change of [
      (pipeline) => (pipeline[`${phase}:verify`] = pipeline[platform]),
      (pipeline) => {
        pipeline[`${phase}:verify`] = pipeline[owner];
        delete pipeline[owner];
      },
      (pipeline) => (pipeline[platform].extends = "docs:verify:linux"),
    ]) {
      const pipeline = YAML.parse(gitlab);
      change(pipeline);
      assert.throws(
        () => validateCi(github, YAML.stringify(pipeline), offline),
        /GitLab/u,
        phase,
      );
    }
  }
});

test("the repository check rejects an undeclared Node major", () => {
  assert.doesNotThrow(() => assertNodeRuntime("26.10.0"));
  assert.throws(() => assertNodeRuntime("22.23.3"), /Node 26/u);
});

test("both providers invoke one verifier on declared hosts", () => {
  const result = validateCi(github, gitlab);
  assert.equal(result.verifier, "npm run verify");
  assert.equal(result.audit, "node tools/docs/cli.mjs audit");
  assert.equal(result.nodeMajor, 26);
  assert.deepEqual(result.hosts, [
    "ubuntu-latest",
    "macos-latest",
    "windows-latest",
  ]);
  assert.deepEqual(result.gitlabHosts, [
    "ci-linux-arm64-container-protected",
    "ci-macos-arm64-shell",
    "ci-windows-arm64-shell",
  ]);
  assert.deepEqual(result.gitlabOfflineHosts, result.gitlabHosts);
});

test("GitHub source CI rejects missing or extra branch routes", () => {
  for (const [event, branch] of [
    ["push", "dev"],
    ["push", "main"],
    ["push", "proposal/**"],
    ["pull_request", "dev"],
    ["pull_request", "main"],
  ]) {
    const workflow = YAML.parse(github);
    workflow.on[event].branches = workflow.on[event].branches.filter(
      (candidate) => candidate !== branch,
    );
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /GitHub source triggers/u,
      `${event}:${branch}`,
    );
  }
  const broader = YAML.parse(github);
  broader.on.push.branches.push("work/**");
  assert.throws(
    () => validateCi(YAML.stringify(broader), gitlab, offline),
    /GitHub source triggers/u,
  );
});

test("GitHub source verification cannot be skipped or lose a host", () => {
  for (const [name, change, reason] of [
    [
      "job condition",
      (job) => (job.if = false),
      /GitHub source job cannot skip/u,
    ],
    [
      "allowed failure",
      (job) => (job["continue-on-error"] = true),
      /GitHub source job cannot skip/u,
    ],
    [
      "excluded host",
      (job) => (job.strategy.matrix.exclude = [{ os: "windows-latest" }]),
      /GitHub source host matrix/u,
    ],
    [
      "skipped verifier",
      (job) => (job.steps.at(-1).if = false),
      /GitHub source job cannot skip/u,
    ],
    [
      "ignored verifier failure",
      (job) => (job.steps.at(-1)["continue-on-error"] = true),
      /GitHub source job cannot skip/u,
    ],
  ]) {
    const workflow = YAML.parse(github);
    change(workflow.jobs.verify);
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      reason,
      name,
    );
  }
});

test("GitHub offline verification cannot be skipped or lose a host", () => {
  for (const [name, change, reason] of [
    [
      "job condition",
      (job) => (job.if = false),
      /GitHub offline job cannot skip/u,
    ],
    [
      "allowed failure",
      (job) => (job["continue-on-error"] = true),
      /GitHub offline job cannot skip/u,
    ],
    [
      "excluded host",
      (job) => (job.strategy.matrix.exclude = [{ os: "windows-latest" }]),
      /GitHub offline host matrix/u,
    ],
    [
      "skipped verifier",
      (job) => (job.steps.at(-1).if = false),
      /GitHub offline job cannot skip/u,
    ],
    [
      "ignored verifier failure",
      (job) => (job.steps.at(-1)["continue-on-error"] = true),
      /GitHub offline job cannot skip/u,
    ],
  ]) {
    const workflow = YAML.parse(offline);
    change(workflow.jobs.verify);
    assert.throws(
      () => validateCi(github, gitlab, YAML.stringify(workflow)),
      reason,
      name,
    );
  }
});

test("GitLab offline CI rejects inherited setup and remote includes", () => {
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("default", (pipeline) => {
          pipeline.default.before_script = ["npm ci"];
        }),
        offline,
      ),
    /GitLab default must contain only the pinned image/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("workflow", (pipeline) => {
          pipeline.include = [{ project: "foreign/ci", file: "pipeline.yml" }];
        }),
        offline,
      ),
    /GitLab pipeline cannot import external CI configuration/u,
  );
  for (const [name, change] of [
    ["global pre-script", (pipeline) => (pipeline.before_script = ["npm ci"])],
    [
      "global variables",
      (pipeline) => (pipeline.variables = { NPM_CONFIG_OFFLINE: "false" }),
    ],
  ]) {
    assert.throws(
      () => validateCi(github, changedGitLab("workflow", change), offline),
      /GitLab pipeline cannot add unchecked global setup/u,
      name,
    );
  }
});

test("GitLab native review and protected jobs use separate capabilities", () => {
  const result = validateCi(github, gitlab, offline);
  assert.deepEqual(result.gitlabReviewHosts.slice(1), [
    "ci-macos-arm64-review",
    "ci-windows-arm64-review",
  ]);
  const pipeline = YAML.parse(gitlab);
  for (const system of ["macos", "windows"]) {
    const trusted = pipeline[`docs:verify:${system}`];
    const review = pipeline[`docs:verify:${system}:review`];
    assert.ok(review, `${system} review job is missing`);
    assert.notDeepEqual(trusted.tags, review.tags);
    assert.deepEqual(trusted.rules.slice(1), [
      {
        if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
      },
    ]);
    assert.deepEqual(review.rules.slice(1), [
      { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
      {
        if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
      },
    ]);
  }
});

test("GitLab Windows verification shares one project resource without merging trust", () => {
  const pipeline = YAML.parse(gitlab);
  const jobs = [
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:windows",
  ];
  const resource = pipeline[jobs[0]].resource_group;
  assert.equal(typeof resource, "string");
  assert.ok(resource.trim());
  assert.ok(
    !resource.includes("$"),
    "the resource must not split by event or ref",
  );
  for (const name of jobs) {
    assert.equal(pipeline[name].resource_group, resource, name);
  }
  assert.notDeepEqual(
    pipeline[jobs[0]].tags,
    pipeline[jobs[1]].tags,
    "sharing a capacity reservation does not share a runner identity",
  );
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const name of jobs) {
    for (const change of [
      (job) => delete job.resource_group,
      (job) => (job.resource_group = "windows-$CI_COMMIT_REF_SLUG"),
      (job) => (job.resource_group = "separate-event"),
    ]) {
      const changed = YAML.parse(gitlab);
      change(changed[name]);
      assert.throws(
        () => validateCi(github, YAML.stringify(changed), offline),
        /GitLab.*resource/u,
        name,
      );
    }
  }
});

test("GitLab Linux review and protected jobs use separate capabilities", () => {
  const result = validateCi(github, gitlab, offline);
  const pipeline = YAML.parse(gitlab);
  const trusted = pipeline["docs:verify:linux"];
  const review = pipeline["docs:verify:linux:review"];
  const offlineJob = pipeline["offline:verify:linux"];
  assert.ok(review, "Linux review job is missing");
  assert.equal(result.gitlabReviewHosts.length, 3);
  assert.deepEqual(trusted.rules.slice(1), [
    {
      if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
    },
  ]);
  assert.deepEqual(review.rules.slice(1), [
    { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
    {
      if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
    },
  ]);
  assert.notDeepEqual(trusted.tags, review.tags);
  assert.deepEqual(offlineJob.tags, trusted.tags);

  for (const change of [
    (source) => delete source["docs:verify:linux:review"],
    (source) => delete source["docs:verify:linux"].rules,
    (source) =>
      (source["docs:verify:linux:review"].rules =
        source["docs:verify:linux"].rules),
    (source) =>
      (source["docs:verify:linux:review"].inherit = { default: false }),
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab("docs:verify:linux", (source) => change(source)),
          offline,
        ),
      /GitLab .*runner|GitLab Linux/u,
    );
  }
});

test("GitLab suppresses duplicate proposal pushes after an MR opens", () => {
  const pipeline = YAML.parse(gitlab);
  assert.deepEqual(pipeline.workflow?.rules.slice(2), [
    { if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/" },
    { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
    { if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main"' },
    {
      if: "$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_OPEN_MERGE_REQUESTS",
      when: "never",
    },
    { if: "$CI_COMMIT_BRANCH =~ /^proposal\\//" },
  ]);
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("workflow", (source) => delete source.workflow),
        offline,
      ),
    /GitLab workflow/u,
  );
});

test("GitLab native jobs cannot disappear or bypass the shared proof", () => {
  for (const jobName of [
    "docs:verify:macos",
    "docs:verify:macos:review",
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:macos",
    "offline:verify:windows",
  ]) {
    for (const change of [
      (pipeline) => delete pipeline[jobName],
      (_pipeline, job) => (job.tags = ["ci-linux-arm64-container"]),
      (_pipeline, job) => (job.inherit.default = true),
      (_pipeline, job) => (job.script = ["echo passed"]),
      (_pipeline, job) => (job.allow_failure = true),
      (_pipeline, job) => (job.when = "manual"),
      (_pipeline, job) => (job.rules = [{ if: "$CI_COMMIT_TAG" }]),
    ]) {
      assert.throws(
        () => validateCi(github, changedGitLab(jobName, change), offline),
        /GitLab .* platform job/u,
        jobName,
      );
    }
  }
});

test("GitLab source and offline jobs use bounded peer-equivalent deadlines", () => {
  for (const [jobName, minutes] of [
    [".docs:verify", "20m"],
    [".offline:verify", "25m"],
  ]) {
    const pipeline = YAML.parse(gitlab);
    pipeline[jobName].timeout = minutes;
    assert.doesNotThrow(() =>
      validateCi(github, YAML.stringify(pipeline), offline),
    );
    pipeline[jobName].timeout = "1h";
    assert.throws(
      () => validateCi(github, YAML.stringify(pipeline), offline),
      /GitLab .* timeout/u,
    );
  }
});

test("both providers refuse to skip the dependency audit", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace(
          "run: node tools/docs/cli.mjs audit",
          "run: echo skipped",
        ),
        gitlab,
      ),
    /dependency audit/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace("- node tools/docs/cli.mjs audit", "- echo skipped"),
      ),
    /dependency audit|native source supply/u,
  );
});

test("both source planes preserve complete audit evidence after a failure", () => {
  const workflow = YAML.parse(github);
  const archive = workflow.jobs.verify.steps.find((step) =>
    step.uses?.startsWith("actions/upload-artifact@"),
  );
  assert.ok(archive);
  for (const changed of [undefined, "success()"])
    assert.throws(
      () =>
        validateCi(
          YAML.stringify({
            ...workflow,
            jobs: {
              verify: {
                ...workflow.jobs.verify,
                steps: workflow.jobs.verify.steps.map((step) =>
                  step === archive ? { ...step, if: changed } : step,
                ),
              },
            },
          }),
          gitlab,
          offline,
        ),
      /evidence|cannot skip/u,
    );
  const pipeline = YAML.parse(gitlab);
  pipeline[".docs:verify"].artifacts.when = "on_success";
  assert.throws(
    () => validateCi(github, YAML.stringify(pipeline), offline),
    /evidence/u,
  );
});

test("both providers supply tools without a browser installation", () => {
  assert.doesNotMatch(github, /setup-chrome|PUPPETEER|mermaid/u);
  assert.doesNotMatch(gitlab, /chromium|PUPPETEER|mermaid|apt-get/u);
  assert.equal(validateCi(github, gitlab).verifier, "npm run verify");
});

test("GitLab jobs pin the official multiarch Node image by digest", () => {
  const image = gitlab.match(
    /image: (public\.ecr\.aws\/docker\/library\/node:26-bookworm@sha256:[0-9a-f]{64})/u,
  )?.[1];
  assert.ok(image, "GitLab Node image is not digest-pinned");
  assert.equal(gitlab.split(`image: ${image}`).length - 1, 1);
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(image, "public.ecr.aws/docker/library/node:26-bookworm"),
        offline,
      ),
    /digest-pinned/u,
  );
});

test("CI runtime follows the declared stable Node line", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace("node-version: 26", "node-version: 22"),
        gitlab,
      ),
    /Node 26/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace("node:26-bookworm", "node:22-bookworm"),
      ),
    /Node 26/u,
  );
});

test("CI contract refuses a missing checkout and a changed verifier", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace("actions/checkout@", "other/checkout@"),
        gitlab,
      ),
    /missing actions\/checkout/u,
  );
  assert.throws(
    () =>
      validateCi(github, gitlab.replace("npm run verify", "npm run partial")),
    /same repository verifier/u,
  );
});

test("CI contract refuses an unpinned action or local runner", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace(
          /actions\/setup-node@[0-9a-f]{40}/u,
          "actions/setup-node@main",
        ),
        gitlab,
      ),
    /not pinned/u,
  );
  assert.throws(
    () => validateCi(github.replace("ubuntu-latest", "self-hosted"), gitlab),
    /hosted runners/u,
  );
});

test("versioned CI refuses shallow history or missing tag triggers", () => {
  assert.throws(
    () =>
      validateCi(github.replace("fetch-depth: 0", "fetch-depth: 1"), gitlab),
    /full history/u,
  );
  assert.throws(
    () =>
      validateCi(github.replace('      - "v*"', '      - "other*"'), gitlab),
    /version tags/u,
  );
  assert.throws(
    () =>
      validateCi(github, gitlab.replace('GIT_DEPTH: "0"', 'GIT_DEPTH: "1"')),
    /full history/u,
  );
});

test("GitLab CI cannot regress to a GitHub-hosted tool download", () => {
  assert.throws(
    () => validateCi(github, gitlab.replace("--gitlab-package", "--download")),
    /GitLab.*supply/u,
  );
});

test("GitLab Linux capabilities are exact and role-specific", () => {
  const result = validateCi(github, gitlab, offline);
  assert.equal(result.gitlabHosts[0], "ci-linux-arm64-container-protected");
  assert.equal(result.gitlabReviewHosts[0], "ci-linux-arm64-container");
  assert.equal(
    result.gitlabOfflineHosts[0],
    "ci-linux-arm64-container-protected",
  );
  for (const [jobName, tags] of [
    ["docs:verify:linux", ["ci-linux-arm64-container"]],
    ["docs:verify:linux", ["ci-linux-arm64-docker"]],
    ["docs:verify:linux:review", ["ci-linux-arm64-container-protected"]],
    ["docs:verify:linux:review", ["ci-linux-arm64-docker"]],
    ["offline:verify:linux", ["ci-linux-arm64-container"]],
    [
      "offline:verify:linux",
      ["ci-linux-arm64-container-protected", "ci-linux-arm64-container"],
    ],
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(jobName, (_pipeline, job) => (job.tags = tags)),
          offline,
        ),
      /GitLab.*(?:runner|capability)/u,
      jobName,
    );
  }
});

test("offline release CI runs the source-pinned bundle on four hosted systems", () => {
  assert.deepEqual(validateCi(github, gitlab, offline).offlineHosts, [
    "ubuntu-latest",
    "ubuntu-24.04-arm",
    "macos-latest",
    "windows-latest",
  ]);
  for (const [changed, reason] of [
    [
      offline.replace("types: [published]", "types: [created]"),
      /published release/u,
    ],
    [offline.replace("fetch-depth: 0", "fetch-depth: 1"), /full history/u],
    [
      offline.replace(
        "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
        "actions/setup-node@main",
      ),
      /not pinned/u,
    ],
    [
      offline.replace(
        "run: node tools/ci/offline-bundle.mjs acquire-github",
        "run: echo skipped",
      ),
      /offline acquisition/u,
    ],
    [
      offline.replace(
        "run: node tools/ci/offline-bundle.mjs install",
        "run: npm ci",
      ),
      /offline installation/u,
    ],
    [
      offline.replace("run: npm run verify", "run: npm run partial"),
      /offline verifier/u,
    ],
    [
      offline.replace(
        "        run: node tools/ci/offline-bundle.mjs acquire-github",
        "        run: node tools/ci/offline-bundle.mjs acquire-github\n        env: { GH_TOKEN: fixture }",
      ),
      /public offline acquisition needs no credentials/u,
    ],
    [
      offline.replace(
        "      - name: Install without remote supply",
        `      - uses: actions/cache@${"0".repeat(40)}\n      - name: Install without remote supply`,
      ),
      /exact seven steps/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, gitlab, changed), reason);
  }
});

test("GitLab offline release CI runs only after a release asset is available", () => {
  const result = validateCi(github, gitlab, offline);
  assert.equal(
    result.gitlabOfflineHosts[0],
    "ci-linux-arm64-container-protected",
  );
  for (const [changed, reason] of [
    [gitlab.replace(/\n\.offline:verify:[\s\S]*$/u, ""), /GitLab offline/u],
    [
      changedGitLab(".offline:verify", (_pipeline, job) => {
        job.rules[3].if = job.rules[3].if.replace(
          'CI_PIPELINE_SOURCE == "api"',
          'CI_PIPELINE_SOURCE == "push"',
        );
      }),
      /post-publication/u,
    ],
    [
      gitlab.replace("acquire-gitlab", "acquire-github"),
      /GitLab offline acquisition/u,
    ],
    [
      gitlab.replace("offline-bundle.mjs install", "npm ci"),
      /GitLab offline installation/u,
    ],
    [
      gitlab.replace(
        /(\.offline:verify:[\s\S]*? {4}- )npm run verify/u,
        "$1npm run partial",
      ),
      /GitLab offline verifier/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, changed, offline), reason);
  }
});

test("Node setup avoids npm before native package-manager supply", () => {
  for (const source of [github, offline]) {
    const workflow = YAML.parse(source);
    const setup = workflow.jobs.verify.steps.find((step) =>
      step.uses?.startsWith("actions/setup-node@"),
    );
    assert.equal(setup.with["package-manager-cache"], false);
    assert.equal(setup.with["check-latest"], true);
    for (const mutation of [
      () => delete setup.with["package-manager-cache"],
      () => (setup.with["package-manager-cache"] = true),
      () => (setup.with.cache = "npm"),
      () => (setup.with["check-latest"] = false),
    ]) {
      setup.with = {
        "node-version": 26,
        "package-manager-cache": false,
        "check-latest": true,
      };
      mutation();
      const changed = YAML.stringify(workflow);
      assert.throws(
        () =>
          source === github
            ? validateCi(changed, gitlab, offline)
            : validateCi(github, gitlab, changed),
        /Node setup must resolve the latest declared runtime without invoking npm/u,
      );
    }
  }
});

test("package-manager supply cannot bypass native admission or become a second version owner", () => {
  const workflow = YAML.parse(github);
  const install = workflow.jobs.verify.steps.find(
    (step) => step.name === "Install the declared package manager",
  );
  for (const command of [
    "npm install --global npm@11",
    "npm install --global --force npm@12.1.0",
  ]) {
    install.run = command;
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /package-manager supply/u,
    );
  }
  const native = YAML.parse(gitlab);
  native["docs:verify:macos"].before_script = [
    "npm install --global npm@12.1.0",
    ...native["docs:verify:macos"].before_script,
  ];
  assert.throws(
    () => validateCi(github, YAML.stringify(native), offline),
    /platform job/u,
  );
});

test("both source planes must supply native Vale before verification", () => {
  const workflow = YAML.parse(github);
  workflow.jobs.verify.steps = workflow.jobs.verify.steps.filter(
    (step) => step.run !== "node tools/ci/install-native.mjs vale --download",
  );
  assert.throws(
    () => validateCi(YAML.stringify(workflow), gitlab, offline),
    /supply/u,
  );
  for (const name of [
    ".docs:source-supply",
    ".docs:verify",
    "docs:verify:macos",
    "docs:verify:windows",
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(name, (_, job) => {
            job.before_script = job.before_script
              .flat(10)
              .filter(
                (command) =>
                  command !==
                  "node tools/ci/install-native.mjs vale --gitlab-package",
              );
          }),
          offline,
        ),
      /supply|native|setup|full proof/u,
    );
  }
});

test("native YAML aliases preserve one source-supply list and reject omissions", () => {
  const pipeline = YAML.parse(gitlab);
  const supply = pipeline[".docs:source-supply"].before_script;
  assert.strictEqual(pipeline[".docs:verify"].before_script[1], supply);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].before_script,
        supply,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const change of [
    (owner) => owner.before_script.splice(2, 1),
    (owner) => (owner.script = ["npm run verify"]),
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(".docs:source-supply", (_, owner) => change(owner)),
          offline,
        ),
      /native source supply/u,
    );
  }
});
