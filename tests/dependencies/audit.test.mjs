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
import * as dependencies from "../../tools/docs/dependencies.mjs";
import { readText, root } from "../../tools/docs/runtime.mjs";
import {
  approvedFinding,
  dependencyPolicy,
  dependencyReviewTime,
} from "./fixtures.mjs";

test("online native approval observes the stable public release in isolation", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-stable-view-"));
  const actual = childProcess.spawnSync;
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = dependencies.validateDependencyInput(lock);
  const observations = [];
  let stableVersion = "3.0.3";
  let registryFailure = false;
  let scans = 0;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[1] === "view") {
        assert.equal(command, process.execPath);
        assert.equal(path.basename(args[0]), "npm-cli.js");
        assert.deepEqual(args.slice(1, 4), ["view", "braces", "version"]);
        for (const flag of [
          "--registry=https://registry.npmjs.org",
          "--offline=false",
          "--prefer-online=true",
          "--prefer-offline=false",
          "--fetch-retries=0",
        ])
          assert.ok(args.includes(flag));
        assert.equal(args[args.indexOf("--prefix") + 1], options.cwd);
        assert.notEqual(options.cwd, directory);
        assert.equal(options.env.NPM_TOKEN, undefined);
        assert.equal(options.env.NODE_AUTH_TOKEN, undefined);
        assert.equal(options.env.npm_config_registry, undefined);
        assert.equal(options.env.npm_config_offline, "false");
        assert.equal(
          options.env.npm_config_cache.startsWith(options.cwd),
          true,
        );
        assert.equal(existsSync(options.env.npm_config_cache), false);
        for (const key of ["npm_config_userconfig", "npm_config_globalconfig"])
          assert.equal(readFileSync(options.env[key], "utf8"), "");
        observations.push(options.cwd);
        mkdirSync(options.env.npm_config_cache);
        writeFileSync(
          path.join(options.env.npm_config_cache, "owned-cache"),
          "fixture",
        );
        if (registryFailure)
          return {
            status: 127,
            stdout: "partial registry observation",
            stderr: "native registry diagnostic",
          };
        return { status: 0, stdout: JSON.stringify(stableVersion), stderr: "" };
      }
      if (args[0] !== "scan") return actual(command, args, options);
      scans++;
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
                ...(identity.name === "braces"
                  ? { vulnerabilities: [approvedFinding()] }
                  : {}),
              })),
            },
          ],
        }),
      );
      return { status: 1, stdout: "", stderr: "" };
    },
  );
  syncBuiltinESMExports();
  try {
    mkdirSync(
      path.join(directory, path.dirname(dependencies.dependencyPolicyPath)),
      {
        recursive: true,
      },
    );
    writeFileSync(
      path.join(directory, dependencies.dependencyPolicyPath),
      dependencyPolicy,
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    writeFileSync(path.join(directory, ".npmrc"), "offline=true\n");
    const audit = () =>
      dependencies.auditDependencies({
        repository: directory,
        now: dependencyReviewTime,
        environment: {
          ...process.env,
          npm_config_registry: "https://invalid.example",
          npm_config_cache: path.join(directory, "foreign-cache"),
          NPM_TOKEN: "fixture-not-a-secret",
          NODE_AUTH_TOKEN: "fixture-not-a-secret",
        },
      });
    const accepted = audit();
    assert.equal(observations.length, 1);
    assert.equal(scans, 1);
    assert.equal(
      readFileSync(
        path.join(accepted.evidence, "stable-version.stdout"),
        "utf8",
      ),
      '"3.0.3"',
    );
    stableVersion = "3.0.4";
    assert.throws(audit, /stable.*changed|requalify/u);
    assert.equal(scans, 2, "metadata changes must not replay the native scan");
    assert.equal(new Set(observations).size, 2);
    registryFailure = true;
    assert.throws(audit, /stable version observation failed/u);
    assert.equal(
      scans,
      3,
      "each failed qualification retains one unfiltered scan",
    );
    for (const temporary of observations)
      assert.equal(existsSync(temporary), false);
    assert.equal(existsSync(path.join(directory, "foreign-cache")), false);
    const evidence = path.join(directory, "build/evidence/dependencies");
    const registryErrors = [];
    for (const record of readdirSync(evidence)) {
      assert.equal(existsSync(path.join(evidence, record, "raw.json")), true);
      registryErrors.push(
        readFileSync(
          path.join(evidence, record, "stable-version.stderr"),
          "utf8",
        ),
      );
      const execution = JSON.parse(
        readFileSync(path.join(evidence, record, "execution.json"), "utf8"),
      );
      assert.equal(execution.execution.length, 2);
      assert.equal(execution.execution[0].status, 1);
      assert.ok([0, 127].includes(execution.execution[1].status));
      for (const name of ["empty-user.npmrc", "empty-global.npmrc"])
        assert.equal(
          readFileSync(path.join(evidence, record, name), "utf8"),
          "",
        );
    }
    assert.deepEqual(registryErrors.sort(), [
      "",
      "",
      "native registry diagnostic",
    ]);
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("actual native audit retains all findings and applies exact disposition", () => {
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
    // Native scanner fixtures expose every finding through the same policy.
    writeFileSync(
      path.join(directory, dependencies.dependencyPolicyPath),
      dependencyPolicy,
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
    assert.throws(
      () =>
        dependencies.auditDependencies({
          repository: directory,
          offline: true,
          environment,
          now: dependencyReviewTime,
        }),
      /absent.*retire/u,
    );
    writeFileSync(
      path.join(directory, dependencies.dependencyPolicyPath),
      "IgnoredVulns = []\n",
    );
    const accepted = dependencies.auditDependencies({
      repository: directory,
      offline: true,
      environment,
      now: dependencyReviewTime,
    });
    const raw = JSON.parse(
      readFileSync(path.join(accepted.evidence, "raw.json"), "utf8"),
    );
    const rawBytes = readFileSync(path.join(accepted.evidence, "raw.json"));
    assert.equal(raw.results[0].packages[0].vulnerabilities, undefined);
    assert.deepEqual(
      JSON.parse(
        readFileSync(path.join(accepted.evidence, "execution.json"), "utf8"),
      ).execution.map((entry) => entry.status),
      [0],
    );
    for (const [index, database] of databases.entries()) {
      writeFileSync(
        path.join(directory, "cache/osv-scalibr/npm/all.zip"),
        Buffer.from(database, "base64"),
      );
      let observed;
      if (index === 0) {
        writeFileSync(
          path.join(directory, dependencies.dependencyPolicyPath),
          dependencyPolicy,
        );
        observed = dependencies.auditDependencies({
          repository: directory,
          offline: true,
          environment,
          now: dependencyReviewTime,
        });
        assert.equal(observed.findingCount, 1);
        assert.equal(observed.approvedFindings, 1);
        const retained = JSON.parse(
          readFileSync(path.join(observed.evidence, "raw.json"), "utf8"),
        );
        assert.equal(
          retained.results[0].packages[0].vulnerabilities[0].id,
          "GHSA-vfj7-8cjw-p6xm",
        );
        assert.throws(
          () =>
            dependencies.auditDependencies({
              repository: directory,
              offline: true,
              environment,
              now: new Date("2026-10-18T00:00:00Z"),
            }),
          /expired/u,
        );
      } else {
        assert.throws(
          () =>
            dependencies.auditDependencies({
              repository: directory,
              offline: true,
              environment,
              now: dependencyReviewTime,
            }),
          /unapproved/u,
        );
        const reports = readdirSync(
          path.join(directory, "build/evidence/dependencies"),
        ).map((name) =>
          JSON.parse(
            readFileSync(
              path.join(
                directory,
                "build/evidence/dependencies",
                name,
                "raw.json",
              ),
              "utf8",
            ),
          ),
        );
        assert.ok(
          reports.some((report) =>
            report.results[0].packages[0].vulnerabilities?.some(
              (finding) => finding.id === "OSV-FIXTURE-UNRELATED",
            ),
          ),
        );
      }
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
    mkdirSync(
      path.join(directory, path.dirname(dependencies.dependencyPolicyPath)),
      {
        recursive: true,
      },
    );
    writeFileSync(
      path.join(directory, dependencies.dependencyPolicyPath),
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
          dependencies.auditDependencies({
            repository: directory,
            offline: true,
          }),
        /native|ENOENT|JSON|Unexpected/u,
      );
      assert.equal(
        calls,
        before + 1,
        "failed scan retains one complete attempt",
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
