import assert from "node:assert/strict";
import childProcess from "node:child_process";
import {
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
import { readText } from "../../tools/docs/runtime.mjs";
import {
  approvedFinding,
  dependencyPolicy,
  dependencyReviewTime,
} from "./fixtures.mjs";

test("one native audit retains all findings without a filtered second scan", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-findings-"));
  const actual = childProcess.spawnSync;
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = dependencies.validateDependencyInput(lock);
  const reports = [];
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[0] !== "scan") return actual(command, args, options);
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
              ...(identity.name === "braces"
                ? {
                    vulnerabilities: [
                      { id: "OSV-EXAMPLE" },
                      { id: "OSV-UNRELATED" },
                    ],
                  }
                : {}),
            })),
          },
        ],
      };
      reports.push(report);
      assert.ok(args.includes("--no-ignore"));
      assert.ok(args.includes("--all-vulns"));
      assert.equal(
        readFileSync(args[args.indexOf("--config") + 1], "utf8"),
        "IgnoredVulns = []\n",
      );
      writeFileSync(
        args[args.indexOf("--output-file") + 1],
        JSON.stringify(report),
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
    assert.throws(
      () =>
        dependencies.auditDependencies({
          repository: directory,
          offline: true,
          now: dependencyReviewTime,
        }),
      /unapproved/u,
    );
    const evidence = path.join(
      directory,
      "build/evidence/dependencies",
      readdirSync(path.join(directory, "build/evidence/dependencies"))[0],
    );
    assert.equal(
      reports.length,
      1,
      "no filtering or duplicate scan is permitted",
    );
    assert.equal(
      readFileSync(path.join(evidence, "raw.json"), "utf8"),
      JSON.stringify(reports[0]),
    );
    assert.equal(existsSync(path.join(evidence, "decision.json")), false);
    assert.deepEqual(
      JSON.parse(
        readFileSync(path.join(evidence, "execution.json"), "utf8"),
      ).execution.map((entry) => entry.status),
      [1],
    );
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native audit rejects unapproved findings without filtering evidence", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-approval-"));
  const actual = childProcess.spawnSync;
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = dependencies.validateDependencyInput(lock);
  let evidence;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      if (args[0] !== "scan") return actual(command, args, options);
      const output = args[args.indexOf("--output-file") + 1];
      evidence = path.dirname(output);
      writeFileSync(
        output,
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
                  ? { vulnerabilities: [{ id: "OSV-UNAPPROVED" }] }
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
    assert.throws(
      () =>
        dependencies.auditDependencies({
          repository: directory,
          offline: true,
        }),
      /unapproved/u,
    );
    const raw = JSON.parse(
      readFileSync(path.join(evidence, "raw.json"), "utf8"),
    );
    assert.equal(
      raw.results[0].packages.find((entry) => entry.package.name === "braces")
        .vulnerabilities[0].id,
      "OSV-UNAPPROVED",
    );
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("native audit refuses input drift after scanning", (context) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-audit-drift-"));
  const actual = childProcess.spawnSync;
  let calls = 0;
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = dependencies.validateDependencyInput(lock);
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
          ? { vulnerabilities: [approvedFinding()] }
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
    assert.throws(
      () =>
        dependencies.auditDependencies({
          repository: directory,
          offline: true,
        }),
      /inputs changed/u,
    );
    assert.equal(calls, 1, "input drift cannot trigger another scan");
  } finally {
    mock.mock.restore();
    syncBuiltinESMExports();
    rmSync(directory, { recursive: true, force: true });
  }
});
