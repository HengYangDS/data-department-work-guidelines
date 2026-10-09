import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import semver from "semver";
import { parse as parseToml } from "smol-toml";
import {
  isolatedNpmEnvironment,
  npmCliPath,
  validateLockSupply,
} from "../ci/offline-bundle.mjs";
import { managedFileExists, nativeToolBinary, root } from "./runtime.mjs";

export const dependencyPolicyPath = ".config/checks/dependencies/policy.toml";
// Bounded compatibility at the existing input owner until accepted ETHOS risk
// admission supports native findings and controlled-development artifacts.
const approvedDependency = {
  id: "GHSA-vfj7-8cjw-p6xm",
  ecosystem: "npm",
  name: "braces",
  version: "3.0.3",
  integrity:
    "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
  expiresAt: Date.UTC(2026, 9, 18),
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
      Object.keys(entry).sort().join(",") !== "id,ignoreUntil,reason" ||
      entry.id !== approvedDependency.id ||
      !(entry.ignoreUntil instanceof Date) ||
      !Number.isFinite(entry.ignoreUntil.getTime()) ||
      entry.ignoreUntil.getTime() > approvedDependency.expiresAt ||
      typeof entry.reason !== "string" ||
      !entry.reason.trim()
    )
      throw new Error(
        "dependency policy exceeds the approved native OSV disposition",
      );
  }
  return policy;
}

export function validateDependencyInput(lock, policy = { IgnoredVulns: [] }) {
  validateLockSupply(lock);
  const identities = new Map();
  let approvedPaths = 0;
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location) continue;
    const name = entry.name ?? location.split("node_modules/").at(-1);
    if (entry.dev !== true)
      throw new Error(`dependency input is not development-only: ${location}`);
    if (policy.IgnoredVulns.length && name === approvedDependency.name) {
      if (
        entry.version !== approvedDependency.version ||
        entry.integrity !== approvedDependency.integrity
      )
        throw new Error(`approved dependency artifact changed: ${location}`);
      approvedPaths++;
    }
    identities.set(`${name}@${entry.version}`, {
      name,
      version: entry.version,
      ecosystem: "npm",
    });
  }
  if (policy.IgnoredVulns.length && !approvedPaths)
    throw new Error(
      "approved dependency input is absent; retire the disposition",
    );
  return identities;
}

export function validateDependencyEvidence(
  report,
  identities,
  exitCode,
  repository = root,
  policy = { IgnoredVulns: [] },
  now = new Date(),
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
        identity.version === approvedDependency.version &&
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
              !affected.versions?.includes(approvedDependency.version))
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
                throw new Error(
                  "approved finding now has a fix; retire and requalify the disposition",
                );
              }
            }
          }
        }
        if (finding.withdrawn)
          throw new Error(
            "approved finding was withdrawn; retire the disposition",
          );
        if (
          !Number.isFinite(now.getTime()) ||
          policy.IgnoredVulns[0].ignoreUntil.getTime() <= now.getTime()
        )
          throw new Error("approved dependency disposition has expired");
        approvedFindings++;
      }
    }
  }
  if (seen.size !== identities.size)
    throw new Error("native dependency report omits input identities");
  if (exitCode !== (findings ? 1 : 0))
    throw new Error("native dependency report disagrees with its exit status");
  if (policy.IgnoredVulns.length && findings === 0)
    throw new Error("approved finding is absent; retire the disposition");
  return { findings, approvedFindings };
}

export function auditDependencies({
  repository = root,
  offline = false,
  environment = process.env,
  now = new Date(),
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
  const identities = validateDependencyInput(JSON.parse(lockSource), policy);
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
      now,
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
  if (!offline && approvedFindings) {
    const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-view-"));
    using cleanup = new DisposableStack();
    cleanup.defer(() =>
      rmSync(temporary, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 200,
      }),
    );
    const registryArgs = [
      npmCliPath(),
      "view",
      approvedDependency.name,
      "version",
      "--json",
      "--registry=https://registry.npmjs.org",
      "--offline=false",
      "--prefer-online=true",
      "--prefer-offline=false",
      "--fetch-retries=0",
      "--prefix",
      temporary,
    ];
    const registry = spawnSync(process.execPath, registryArgs, {
      cwd: temporary,
      env: isolatedNpmEnvironment(
        temporary,
        path.join(temporary, "npm-cache"),
        {
          offline: false,
          environment,
        },
      ),
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      timeout: 15_000,
      maxBuffer: 1024 * 1024,
    });
    for (const name of ["empty-user.npmrc", "empty-global.npmrc"])
      writeFileSync(
        path.join(evidence, name),
        readFileSync(path.join(temporary, name)),
      );
    writeFileSync(
      path.join(evidence, "stable-version.stdout"),
      registry.stdout ?? "",
    );
    writeFileSync(
      path.join(evidence, "stable-version.stderr"),
      registry.stderr ?? "",
    );
    execution.push({
      command: [process.execPath, ...registryArgs],
      status: registry.status,
      signal: registry.signal,
      error: registry.error?.message,
    });
    saveExecution();
    if (registry.error || registry.status !== 0 || registry.stderr)
      throw new Error(
        `official stable version observation failed; evidence ${evidence}`,
      );
    let observed;
    try {
      observed = JSON.parse(registry.stdout);
    } catch (cause) {
      throw new Error(
        `official stable version report is invalid; evidence ${evidence}`,
        { cause },
      );
    }
    const versions = Array.isArray(observed) ? observed : [observed];
    if (
      versions.length !== 1 ||
      !semver.valid(versions[0]) ||
      versions[0] !== approvedDependency.version
    )
      throw new Error(
        `official stable braces changed; retire and requalify the disposition; evidence ${evidence}`,
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
  }
  console.log(
    `${findingCount ? "REPORT" : "PASS"} native dependency audit: ${identities.size} identities; ${findingCount} raw findings; ${approvedFindings} approved in exact development scope; evidence ${path.relative(repository, evidence)}`,
  );
  return { evidence, findingCount, approvedFindings };
}
