import assert from "node:assert/strict";
import { test } from "node:test";
import * as dependencies from "../../tools/docs/dependencies.mjs";
import { readText, root } from "../../tools/runtime.mjs";
import { approvedFinding, dependencyPolicy } from "./fixtures.mjs";

test("native disposition keeps the exact finding separate from supply integrity", () => {
  const policy = dependencies.parseDependencyPolicy(dependencyPolicy);
  const lock = JSON.parse(readText("package-lock.json"));
  assert.equal(policy.IgnoredVulns[0].id, "GHSA-vfj7-8cjw-p6xm");
  assert.doesNotThrow(() => dependencies.validateDependencyInput(lock));
  const updated = structuredClone(lock);
  updated.packages["node_modules/braces"].version = "3.0.4";
  assert.doesNotThrow(() => dependencies.validateDependencyInput(updated));
  assert.deepEqual(
    dependencies.parseDependencyPolicy("IgnoredVulns = []\n").IgnoredVulns,
    [],
  );
  for (const change of [
    (copy) => {
      copy.packages["node_modules/braces"].integrity = "invalid";
    },
    (copy) => {
      copy.packages["node_modules/braces"].dev = false;
    },
  ]) {
    const changed = structuredClone(lock);
    change(changed);
    assert.throws(
      () => dependencies.validateDependencyInput(changed),
      /supply|development/u,
    );
  }
  const changed = structuredClone(lock);
  delete changed.packages["node_modules/braces"];
  assert.doesNotThrow(() => dependencies.validateDependencyInput(changed));
  for (const invalid of [
    "# No explicit scanner policy.\n",
    dependencyPolicy.replace("GHSA-vfj7-8cjw-p6xm", "OSV-UNAPPROVED"),
    dependencyPolicy + "ignoreUntil = 2026-10-18\n",
    dependencyPolicy + "\n[[PackageOverrides]]\nignore = true\n",
  ])
    assert.throws(
      () => dependencies.parseDependencyPolicy(invalid),
      /approved.*OSV/u,
    );
});

test("native raw evidence must cover the exact input and retain every finding", () => {
  const lock = JSON.parse(readText("package-lock.json"));
  const identities = dependencies.validateDependencyInput(lock);
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
    dependencies.validateDependencyEvidence(report, identities, 1),
    {
      findings: 2,
      approvedFindings: 0,
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
      ).vulnerabilities = [{ id: "" }];
    },
  ]) {
    const changed = structuredClone(report);
    mutate(changed);
    assert.throws(
      () => dependencies.validateDependencyEvidence(changed, identities, 1),
      /native|approved|input|finding/u,
    );
  }
  assert.throws(
    () => dependencies.validateDependencyEvidence(report, identities, 0),
    /exit|native/u,
  );
});

test("accepted braces findings preserve evidence without an expiry or release hold", () => {
  const lock = JSON.parse(readText("package-lock.json"));
  const policy = dependencies.parseDependencyPolicy(dependencyPolicy);
  const identities = dependencies.validateDependencyInput(lock);
  const report = {
    results: [
      {
        source: { type: "lockfile", path: "package-lock.json" },
        packages: [...identities.values()].map((identity) => ({
          package: identity,
          dependency_groups: ["dev"],
          ...(identity.name === "braces"
            ? { vulnerabilities: [approvedFinding()] }
            : {}),
        })),
      },
    ],
  };
  const snapshot = JSON.stringify(report);
  assert.deepEqual(
    dependencies.validateDependencyEvidence(
      report,
      identities,
      1,
      root,
      policy,
    ),
    { findings: 1, approvedFindings: 1 },
  );
  assert.equal(JSON.stringify(report), snapshot);
  for (const update of [
    (finding) => {
      finding.withdrawn = "2026-10-18T00:00:00Z";
    },
    (finding) => {
      finding.affected[0].ranges[0].events.push({ fixed: "3.0.4" });
    },
  ]) {
    const changed = structuredClone(report);
    update(
      changed.results[0].packages.find(
        (entry) => entry.package.name === "braces",
      ).vulnerabilities[0],
    );
    assert.deepEqual(
      dependencies.validateDependencyEvidence(
        changed,
        identities,
        1,
        root,
        policy,
      ),
      { findings: 1, approvedFindings: 1 },
    );
  }
  const other = structuredClone(report);
  other.results[0].packages
    .find((entry) => entry.package.name === "braces")
    .vulnerabilities.push({ id: "OSV-UNAPPROVED" });
  assert.deepEqual(
    dependencies.validateDependencyEvidence(other, identities, 1, root, policy),
    { findings: 2, approvedFindings: 1 },
  );
  for (const invalid of [
    { id: "GHSA-vfj7-8cjw-p6xm", aliases: "GHSA-vfj7-8cjw-p6xm" },
    {
      id: "GHSA-vfj7-8cjw-p6xm",
      affected: [{ package: { ecosystem: "npm", name: "other-package" } }],
    },
    {
      id: "GHSA-vfj7-8cjw-p6xm",
      affected: [
        {
          package: { ecosystem: "npm", name: "braces" },
          ranges: [{ type: "SEMVER", events: [{ fixed: "3.0.4" }] }],
        },
      ],
    },
  ]) {
    const changed = structuredClone(report);
    changed.results[0].packages.find(
      (entry) => entry.package.name === "braces",
    ).vulnerabilities = [invalid];
    assert.throws(
      () =>
        dependencies.validateDependencyEvidence(
          changed,
          identities,
          1,
          root,
          policy,
        ),
      /finding|approved|retire/u,
    );
  }
  const noFindings = structuredClone(report);
  delete noFindings.results[0].packages.find(
    (entry) => entry.package.name === "braces",
  ).vulnerabilities;
  assert.deepEqual(
    dependencies.validateDependencyEvidence(
      noFindings,
      identities,
      0,
      root,
      policy,
    ),
    { findings: 0, approvedFindings: 0 },
  );
  assert.deepEqual(
    dependencies.validateDependencyEvidence(noFindings, identities, 0, root, {
      IgnoredVulns: [],
    }),
    { findings: 0, approvedFindings: 0 },
  );
});

test("native disposition rejects malformed subject, range, and event objects", () => {
  const policy = dependencies.parseDependencyPolicy(dependencyPolicy);
  const identities = dependencies.validateDependencyInput(
    JSON.parse(readText("package-lock.json")),
  );
  const report = {
    results: [
      {
        source: { type: "lockfile", path: "package-lock.json" },
        packages: [...identities.values()].map((identity) => ({
          package: identity,
          dependency_groups: ["dev"],
          ...(identity.name === "braces"
            ? {
                vulnerabilities: [
                  {
                    id: "GHSA-vfj7-8cjw-p6xm",
                    affected: [
                      {
                        package: { ecosystem: "npm", name: "braces" },
                        ranges: [
                          { type: "SEMVER", events: [{ introduced: "0" }] },
                        ],
                      },
                    ],
                  },
                ],
              }
            : {}),
        })),
      },
    ],
  };
  const validate = (input) =>
    dependencies.validateDependencyEvidence(input, identities, 1, root, policy);
  assert.deepEqual(validate(report), { findings: 1, approvedFindings: 1 });
  const explicitVersion = structuredClone(report);
  const affected = explicitVersion.results[0].packages.find(
    (entry) => entry.package.name === "braces",
  ).vulnerabilities[0].affected[0];
  delete affected.ranges;
  affected.versions = ["3.0.3"];
  assert.deepEqual(validate(explicitVersion), {
    findings: 1,
    approvedFindings: 1,
  });
  affected.versions = ["2.0.0"];
  assert.throws(() => validate(explicitVersion), /subject/u);
  for (const removeEvidence of [
    (finding) => delete finding.affected,
    (finding) => (finding.affected = []),
    (finding) => delete finding.affected[0].package,
    (finding) => delete finding.affected[0].ranges,
    (finding) => (finding.affected[0].ranges = []),
    (finding) => delete finding.affected[0].ranges[0].events,
    (finding) => (finding.affected[0].ranges[0].events = []),
    (finding) => delete finding.affected[0].ranges[0].type,
    (finding) => (finding.affected[0].ranges[0].events = [{}]),
    (finding) =>
      (finding.affected[0].ranges[0].events = [{ last_affected: "3.0.3" }]),
  ]) {
    const changed = structuredClone(report);
    removeEvidence(
      changed.results[0].packages.find(
        (entry) => entry.package.name === "braces",
      ).vulnerabilities[0],
    );
    assert.throws(() => validate(changed), /native|finding|subject/u);
  }
  for (const affected of [
    true,
    [],
    null,
    { package: { ecosystem: "npm", name: "braces" }, ranges: [17] },
    { ranges: [[]] },
    { package: [], ranges: [] },
    { ranges: [{ events: [true] }] },
    { ranges: [{ events: [[]] }] },
    { ranges: [{ events: [{ fixed: false }] }] },
  ]) {
    const changed = structuredClone(report);
    changed.results[0].packages.find(
      (entry) => entry.package.name === "braces",
    ).vulnerabilities[0].affected = [affected];
    assert.throws(() => validate(changed), /native|finding|subject/u);
  }
});
