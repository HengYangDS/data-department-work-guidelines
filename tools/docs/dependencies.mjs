import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { validateLockSupply } from "../ci/offline/npm.mjs";
import { managedFileExists, root } from "../runtime.mjs";
import { nativeToolBinary } from "../supply.mjs";

export const dependencyPolicyPath = ".config/checks/dependencies/policy.toml";
// Existing input owner until accepted ETHOS supplies the shared disposition.
// The known braces finding is non-blocking; raw diagnostics stay complete.
const approvedDependency = {
  id: "GHSA-vfj7-8cjw-p6xm",
  ecosystem: "npm",
  name: "braces",
};

function isNativeObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseDependencyPolicy(source) {
  const policy = parseToml(source);
  if (
    Object.keys(policy).join(",") !== "IgnoredVulns" ||
    !Array.isArray(policy.IgnoredVulns) ||
    policy.IgnoredVulns.length > 1
  )
    throw new Error(
      "dependency policy must use the approved native OSV disposition",
    );
  for (const entry of policy.IgnoredVulns) {
    if (
      Object.keys(entry).sort().join(",") !== "id,reason" ||
      entry.id !== approvedDependency.id ||
      typeof entry.reason !== "string" ||
      !entry.reason.trim()
    )
      throw new Error(
        "dependency policy exceeds the approved native OSV disposition",
      );
  }
  return policy;
}

export function validateDependencyInput(lock) {
  validateLockSupply(lock);
  const identities = new Map();
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location) continue;
    const name = entry.name ?? location.split("node_modules/").at(-1);
    if (entry.dev !== true)
      throw new Error(`dependency input is not development-only: ${location}`);
    identities.set(`${name}@${entry.version}`, {
      name,
      version: entry.version,
      ecosystem: "npm",
    });
  }
  return identities;
}

export function validateDependencyEvidence(
  report,
  identities,
  exitCode,
  repository = root,
  policy = { IgnoredVulns: [] },
) {
  const expected = realpathSync(path.join(repository, "package-lock.json"));
  const results = report?.results;
  if (!Array.isArray(results) || results.length !== 1)
    throw new Error("native dependency report must cover the exact input");
  const result = results[0];
  let observed;
  try {
    observed = realpathSync(
      path.resolve(repository, result.source?.path ?? ""),
    );
  } catch {
    throw new Error("native dependency report names an unavailable input");
  }
  if (
    result.source?.type !== "lockfile" ||
    observed !== expected ||
    !Array.isArray(result.packages)
  )
    throw new Error("native dependency report names a different input");
  const seen = new Set();
  let findings = 0;
  let approvedFindings = 0;
  for (const entry of result.packages) {
    const identity = entry.package;
    const key = `${identity?.name}@${identity?.version}`;
    if (
      !identities.has(key) ||
      seen.has(key) ||
      identity.ecosystem !== "npm" ||
      !Array.isArray(entry.dependency_groups) ||
      entry.dependency_groups.length !== 1 ||
      entry.dependency_groups[0] !== "dev" ||
      (entry.vulnerabilities !== undefined &&
        !Array.isArray(entry.vulnerabilities))
    )
      throw new Error(
        "native dependency report has incomplete or inconsistent input identities",
      );
    seen.add(key);
    for (const finding of entry.vulnerabilities ?? []) {
      if (
        !isNativeObject(finding) ||
        typeof finding.id !== "string" ||
        !finding.id.trim() ||
        (finding.aliases !== undefined &&
          (!Array.isArray(finding.aliases) ||
            finding.aliases.some(
              (alias) => typeof alias !== "string" || !alias.trim(),
            )))
      )
        throw new Error(
          "native dependency report has an invalid finding identity",
        );
      findings++;
      if (
        policy.IgnoredVulns.length &&
        identity.name === approvedDependency.name &&
        [finding.id, ...(finding.aliases ?? [])].includes(approvedDependency.id)
      ) {
        // Inspect only native fields used by this exact disposition. The scanner
        // owns the report; this boundary cannot reinterpret another subject.
        if (!Array.isArray(finding.affected) || !finding.affected.length)
          throw new Error("approved finding has invalid affected subjects");
        for (const affected of finding.affected) {
          if (
            !isNativeObject(affected) ||
            !isNativeObject(affected.package) ||
            affected.package.ecosystem !== approvedDependency.ecosystem ||
            affected.package.name !== approvedDependency.name ||
            (affected.ranges !== undefined &&
              !Array.isArray(affected.ranges)) ||
            (affected.versions !== undefined &&
              (!Array.isArray(affected.versions) ||
                affected.versions.some(
                  (version) => typeof version !== "string" || !version.trim(),
                ))) ||
            (!affected.ranges?.length &&
              !affected.versions?.includes(identity.version))
          )
            throw new Error(
              "approved finding subject changed; retire the disposition",
            );
          for (const range of affected.ranges ?? []) {
            if (
              !isNativeObject(range) ||
              range.type !== "SEMVER" ||
              !Array.isArray(range.events) ||
              !range.events.some(
                (event) =>
                  isNativeObject(event) &&
                  typeof event.introduced === "string" &&
                  event.introduced.trim(),
              )
            )
              throw new Error(
                "approved finding has invalid native range events",
              );
            for (const event of range.events) {
              if (
                !isNativeObject(event) ||
                !["introduced", "fixed", "last_affected", "limit"].some(
                  (field) =>
                    typeof event[field] === "string" && event[field].trim(),
                )
              )
                throw new Error(
                  "approved finding has an invalid native range event",
                );
              if (event.fixed !== undefined) {
                if (typeof event.fixed !== "string" || !event.fixed.trim())
                  throw new Error(
                    "approved finding has an invalid native fixed event",
                  );
              }
            }
          }
        }
        approvedFindings++;
      }
    }
  }
  if (seen.size !== identities.size)
    throw new Error("native dependency report omits input identities");
  if (exitCode !== (findings ? 1 : 0))
    throw new Error("native dependency report disagrees with its exit status");
  return { findings, approvedFindings };
}

export function auditDependencies({
  repository = root,
  offline = false,
  environment = process.env,
} = {}) {
  const policySource = readFileSync(
    path.join(repository, dependencyPolicyPath),
    "utf8",
  );
  const policy = parseDependencyPolicy(policySource);
  const lockSource = readFileSync(
    path.join(repository, "package-lock.json"),
    "utf8",
  );
  const identities = validateDependencyInput(JSON.parse(lockSource));
  const binary = nativeToolBinary("osv-scanner");
  const evidenceRoot = path.join(repository, "build/evidence/dependencies");
  managedFileExists(path.join(evidenceRoot, "boundary-check"), repository);
  mkdirSync(evidenceRoot, { recursive: true });
  const evidence = mkdtempSync(path.join(evidenceRoot, "scan-"));
  writeFileSync(path.join(evidence, "policy.toml"), policySource);
  // One complete native scan retains approved and unapproved findings alike.
  // The native disposition is evaluated below, never applied as report filtering.
  writeFileSync(path.join(evidence, "raw-policy.toml"), "IgnoredVulns = []\n");
  writeFileSync(path.join(evidence, "package-lock.json"), lockSource);
  const output = path.join(evidence, "raw.json");
  const args = [
    "scan",
    "source",
    ...(offline ? ["--offline"] : []),
    "--no-ignore",
    "--config",
    path.join(evidence, "raw-policy.toml"),
    "--lockfile",
    path.join(repository, "package-lock.json"),
    "--format",
    "json",
    "--all-packages",
    "--all-vulns",
    "--output-file",
    output,
    "--verbosity",
    "warn",
  ];
  const result = spawnSync(binary, args, {
    cwd: repository,
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    timeout: 60_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  writeFileSync(path.join(evidence, "raw.stdout"), result.stdout ?? "");
  writeFileSync(path.join(evidence, "raw.stderr"), result.stderr ?? "");
  const execution = [
    {
      command: [binary, ...args],
      status: result.status,
      signal: result.signal,
      error: result.error?.message,
    },
  ];
  const saveExecution = () =>
    writeFileSync(
      path.join(evidence, "execution.json"),
      JSON.stringify(
        { time: new Date().toISOString(), offline, execution },
        null,
        2,
      ) + "\n",
    );
  saveExecution();
  if (
    result.error ||
    ![0, 1].includes(result.status) ||
    result.stderr ||
    result.stdout
  )
    throw new Error(
      `native raw audit failed; complete output retained at ${evidence}`,
    );
  if (
    readFileSync(path.join(repository, "package-lock.json"), "utf8") !==
      lockSource ||
    readFileSync(path.join(repository, dependencyPolicyPath), "utf8") !==
      policySource
  )
    throw new Error(
      `dependency audit inputs changed during native execution; evidence ${evidence}`,
    );
  let findingCount;
  let approvedFindings;
  try {
    ({ findings: findingCount, approvedFindings } = validateDependencyEvidence(
      JSON.parse(readFileSync(output, "utf8")),
      identities,
      result.status,
      repository,
      policy,
    ));
  } catch (cause) {
    throw new Error(
      `native dependency report is invalid: ${cause.message}; evidence ${evidence}`,
      { cause },
    );
  }
  if (findingCount !== approvedFindings)
    throw new Error(
      `native dependency audit has ${findingCount - approvedFindings} unapproved findings; complete raw evidence ${evidence}`,
    );
  console.log(
    `${findingCount ? "REPORT" : "PASS"} native dependency audit: ${identities.size} identities; ${findingCount} raw findings; ${approvedFindings} accepted non-blocking findings; evidence ${path.relative(repository, evidence)}`,
  );
  return { evidence, findingCount, approvedFindings };
}
