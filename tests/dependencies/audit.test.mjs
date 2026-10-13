import assert from "node:assert/strict";
import childProcess from "node:child_process";
import {
  cpSync,
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
import { readText, root } from "../../tools/runtime.mjs";
import { dependencyPolicy } from "./fixtures.mjs";

test("actual native audit keeps the accepted finding non-blocking after the former expiry", (context) => {
  context.mock.method(Date, "now", () => Date.UTC(2027, 0, 1));
  const originalLog = console.log;
  const auditLog = context.mock.method(console, "log", (...args) => originalLog(...args));
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
    writeFileSync(path.join(directory, dependencies.dependencyPolicyPath), dependencyPolicy);
    const braces = JSON.parse(readText("package-lock.json")).packages["node_modules/braces"];
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
    assert.doesNotThrow(() =>
      dependencies.auditDependencies({
        repository: directory,
        offline: true,
        environment,
      }),
    );
    writeFileSync(path.join(directory, dependencies.dependencyPolicyPath), "IgnoredVulns = []\n");
    const accepted = dependencies.auditDependencies({
      repository: directory,
      offline: true,
      environment,
    });
    const raw = JSON.parse(readFileSync(path.join(accepted.evidence, "raw.json"), "utf8"));
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
        writeFileSync(path.join(directory, dependencies.dependencyPolicyPath), dependencyPolicy);
        observed = dependencies.auditDependencies({
          repository: directory,
          offline: true,
          environment,
        });
        assert.equal(observed.findingCount, 1);
        assert.equal(observed.approvedFindings, 1);
        assert.match(auditLog.mock.calls.at(-1).arguments[0], /1 accepted non-blocking findings/u);
        assert.deepEqual(
          JSON.parse(
            readFileSync(path.join(observed.evidence, "execution.json"), "utf8"),
          ).execution.map((entry) => entry.status),
          [1],
        );
        const retained = JSON.parse(readFileSync(path.join(observed.evidence, "raw.json"), "utf8"));
        assert.equal(retained.results[0].packages[0].vulnerabilities[0].id, "GHSA-vfj7-8cjw-p6xm");
        assert.doesNotThrow(() =>
          dependencies.auditDependencies({
            repository: directory,
            offline: true,
            environment,
          }),
        );
      } else {
        assert.throws(
          () =>
            dependencies.auditDependencies({
              repository: directory,
              offline: true,
              environment,
            }),
          /unapproved/u,
        );
        const reports = readdirSync(path.join(directory, "build/evidence/dependencies")).map(
          (name) =>
            JSON.parse(
              readFileSync(
                path.join(directory, "build/evidence/dependencies", name, "raw.json"),
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
    assert.deepEqual(readFileSync(path.join(accepted.evidence, "raw.json")), rawBytes);
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
  const mock = context.mock.method(childProcess, "spawnSync", (command, args, options) => {
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
      writeFileSync(args[args.indexOf("--output-file") + 1], "not a native report");
      return { status: 0, stdout: "", stderr: "" };
    }
    return response;
  });
  syncBuiltinESMExports();
  try {
    mkdirSync(path.join(directory, path.dirname(dependencies.dependencyPolicyPath)), {
      recursive: true,
    });
    writeFileSync(path.join(directory, dependencies.dependencyPolicyPath), dependencyPolicy);
    cpSync(path.join(root, "package-lock.json"), path.join(directory, "package-lock.json"));
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
      assert.equal(calls, before + 1, "failed scan retains one complete attempt");
    }
    const evidenceRoot = path.join(directory, "build/evidence/dependencies");
    const records = readdirSync(evidenceRoot).map((name) => {
      const evidence = path.join(evidenceRoot, name);
      const execution = JSON.parse(readFileSync(path.join(evidence, "execution.json"), "utf8"));
      return {
        execution,
        stdout: readFileSync(path.join(evidence, "raw.stdout"), "utf8"),
        stderr: readFileSync(path.join(evidence, "raw.stderr"), "utf8"),
      };
    });
    assert.equal(records.length, 6);
    assert.ok(
      records.some(
        (entry) => entry.stderr === "native warning" && entry.stdout === "partial report",
      ),
    );
    assert.equal(timedExecutions.length, 2);
    for (const { result, command } of timedExecutions) {
      assert.equal(result.error?.code, "ETIMEDOUT");
      const record = records.find(
        (entry) => JSON.stringify(entry.execution.execution[0].command) === JSON.stringify(command),
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
