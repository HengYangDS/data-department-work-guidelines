import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import semver from "semver";
import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import YAML from "yaml";
import {
  isolatedNpmEnvironment,
  npmCliPath,
  validateLockSupply,
} from "../ci/offline-bundle.mjs";
import {
  declaredToolRuntime,
  managedFileExists,
  nativeToolBinary,
  readText,
  root,
  run,
} from "./runtime.mjs";

export const dependencyPolicyPath = ".config/checks/dependencies/policy.toml";
const approvedDependency = {
  id: "GHSA-vfj7-8cjw-p6xm",
  ecosystem: "npm",
  name: "braces",
  version: "3.0.3",
  group: "dev",
};

// Temporary repository input boundary for the human-approved exception.
// Native OSV owns finding disposition; ETHOS will own reusable risk admission.
export function parseDependencyPolicy(source) {
  const policy = parseToml(source);
  if (
    Object.keys(policy).some((key) => key !== "IgnoredVulns") ||
    !Array.isArray(policy.IgnoredVulns) ||
    policy.IgnoredVulns.length > 1
  )
    throw new Error(
      "dependency policy must use only the approved native OSV fields",
    );
  for (const entry of policy.IgnoredVulns) {
    if (
      Object.keys(entry).sort().join(",") !== "id,ignoreUntil,reason" ||
      entry.id !== approvedDependency.id ||
      !(entry.ignoreUntil instanceof Date) ||
      !Number.isFinite(entry.ignoreUntil.getTime()) ||
      entry.ignoreUntil.getTime() > Date.UTC(2026, 9, 18) ||
      typeof entry.reason !== "string" ||
      !entry.reason.trim()
    )
      throw new Error(
        "dependency policy exceeds the approved native disposition",
      );
  }
  return policy;
}

export function validateDependencyInput(lock, policy, now = new Date()) {
  validateLockSupply(lock);
  const identities = new Map();
  let approvedPaths = 0;
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location) continue;
    const name = entry.name ?? location.split("node_modules/").at(-1);
    const identity = { name, version: entry.version, ecosystem: "npm" };
    if (entry.dev !== true)
      throw new Error(`dependency input is not development-only: ${location}`);
    identities.set(`${name}@${entry.version}`, identity);
    if (policy.IgnoredVulns.length && name === approvedDependency.name) {
      if (entry.version !== approvedDependency.version)
        throw new Error(`approved braces version changed: ${location}`);
      approvedPaths++;
    }
  }
  if (policy.IgnoredVulns.length) {
    if (policy.IgnoredVulns[0].ignoreUntil.getTime() <= now.getTime())
      throw new Error("approved dependency disposition has expired");
    if (!approvedPaths)
      throw new Error(
        "approved braces input is absent; retire the disposition",
      );
  }
  return identities;
}

export function validateDependencyEvidence(
  report,
  identities,
  policy,
  exitCode,
  repository = root,
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
      if (typeof finding.id !== "string" || !finding.id.trim())
        throw new Error("native dependency report has an invalid finding");
      findings++;
      if (
        [finding.id, ...(finding.aliases ?? [])].includes(approvedDependency.id)
      ) {
        if (
          identity.name !== approvedDependency.name ||
          identity.version !== approvedDependency.version ||
          finding.withdrawn ||
          (finding.affected ?? []).some((affected) =>
            (affected.ranges ?? []).some((range) =>
              (range.events ?? []).some((event) => event.fixed),
            ),
          )
        )
          throw new Error(
            "approved dependency finding is changed, withdrawn, or fixed",
          );
        approvedFindings++;
      }
    }
  }
  if (seen.size !== identities.size)
    throw new Error("native dependency report omits input identities");
  if (exitCode !== (findings ? 1 : 0))
    throw new Error("native dependency report disagrees with its exit status");
  if (policy.IgnoredVulns.length && !approvedFindings)
    throw new Error("approved raw finding is absent; retire the disposition");
  return {
    findings,
    approvedFindings: policy.IgnoredVulns.length ? approvedFindings : 0,
  };
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
  let identities;
  const binary = nativeToolBinary("osv-scanner");
  const evidenceRoot = path.join(repository, "build/evidence/dependencies");
  managedFileExists(path.join(evidenceRoot, "boundary-check"), repository);
  mkdirSync(evidenceRoot, { recursive: true });
  const evidence = mkdtempSync(path.join(evidenceRoot, "scan-"));
  writeFileSync(path.join(evidence, "policy.toml"), policySource);
  writeFileSync(
    path.join(evidence, "raw-policy.toml"),
    stringifyToml({ IgnoredVulns: [] }),
  );
  writeFileSync(path.join(evidence, "package-lock.json"), lockSource);
  const execution = [];
  const assertInputs = () => {
    if (
      readFileSync(path.join(repository, "package-lock.json"), "utf8") !==
        lockSource ||
      readFileSync(path.join(repository, dependencyPolicyPath), "utf8") !==
        policySource
    )
      throw new Error(
        "dependency audit inputs changed during native execution",
      );
  };
  const execute = (mode) => {
    const output = path.join(evidence, `${mode}.json`);
    const args = [
      "scan",
      "source",
      ...(offline ? ["--offline"] : []),
      "--no-ignore",
      "--config",
      path.join(evidence, mode === "raw" ? "raw-policy.toml" : "policy.toml"),
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
    writeFileSync(path.join(evidence, `${mode}.stdout`), result.stdout ?? "");
    writeFileSync(path.join(evidence, `${mode}.stderr`), result.stderr ?? "");
    execution.push({
      command: [binary, ...args],
      status: result.status,
      signal: result.signal,
      error: result.error?.message,
    });
    writeFileSync(
      path.join(evidence, "execution.json"),
      JSON.stringify(
        { time: new Date().toISOString(), offline, execution },
        null,
        2,
      ) + "\n",
    );
    if (
      result.error ||
      ![0, 1].includes(result.status) ||
      result.stderr ||
      result.stdout
    )
      throw new Error(
        `native ${mode} audit failed; complete output retained at ${evidence}`,
      );
    return {
      report: JSON.parse(readFileSync(output, "utf8")),
      status: result.status,
    };
  };
  identities = validateDependencyInput(JSON.parse(lockSource), policy);
  assertInputs();
  if (!offline && policy.IgnoredVulns.length) {
    const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-npm-view-"));
    try {
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
      for (const name of ["empty-user.npmrc", "empty-global.npmrc"]) {
        writeFileSync(
          path.join(evidence, name),
          readFileSync(path.join(temporary, name)),
        );
      }
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
      writeFileSync(
        path.join(evidence, "execution.json"),
        JSON.stringify(
          { time: new Date().toISOString(), offline, execution },
          null,
          2,
        ) + "\n",
      );
      if (registry.error || registry.status !== 0 || registry.stderr)
        throw new Error(
          `official stable version observation failed; evidence ${evidence}`,
        );
      const result = JSON.parse(registry.stdout);
      const versions = Array.isArray(result) ? result : [result];
      if (
        versions.length !== 1 ||
        !semver.valid(versions[0]) ||
        versions[0] !== approvedDependency.version
      )
        throw new Error(
          "official stable braces changed; retire and requalify the disposition",
        );
    } finally {
      rmSync(temporary, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 200,
      });
    }
  }
  const raw = execute("raw");
  assertInputs();
  const { findings: findingCount, approvedFindings } =
    validateDependencyEvidence(
      raw.report,
      identities,
      policy,
      raw.status,
      repository,
    );
  const decided = execute("decision");
  assertInputs();
  validateDependencyEvidence(
    decided.report,
    identities,
    { IgnoredVulns: [] },
    decided.status,
    repository,
  );
  if (decided.status !== 0 || findingCount !== approvedFindings)
    throw new Error(
      `unapproved dependency findings block execution; full raw evidence: ${evidence}`,
    );
  assertInputs();
  console.log(
    `PASS native dependency audit: ${identities.size} identities; ${findingCount} raw findings; evidence ${path.relative(repository, evidence)}`,
  );
  return { evidence, findingCount };
}

const verifier = "npm run verify";
const auditCommand = "node tools/docs/cli.mjs audit";
const gitlabLinuxProtectedCapability = "ci-linux-arm64-container-protected";
const gitlabLinuxReviewCapability = "ci-linux-arm64-container";
const gitlabNativeCapabilities = [
  {
    system: "macos",
    protected: "ci-macos-arm64-shell",
    review: "ci-macos-arm64-review",
  },
  {
    system: "windows",
    protected: "ci-windows-arm64-shell",
    review: "ci-windows-arm64-review",
  },
];
const protectedRules = [
  {
    if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
  },
];
const reviewRules = [
  { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
  {
    if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
  },
];
const workflowRules = [
  { if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/" },
  { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
  { if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main"' },
  {
    if: "$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_OPEN_MERGE_REQUESTS",
    when: "never",
  },
  { if: "$CI_COMMIT_BRANCH =~ /^proposal\\//" },
];
const hostMatrix = ["ubuntu-latest", "macos-latest", "windows-latest"];
const offlineHostMatrix = [
  "ubuntu-latest",
  "ubuntu-24.04-arm",
  "macos-latest",
  "windows-latest",
];

const npmBootstrap =
  'npm install --global --ignore-scripts "npm@$(node -p \'require("./package.json").devEngines.packageManager.version\')"';
const nativeSourceSupply = [
  "npm ci --ignore-scripts",
  "node tools/ci/install-native.mjs osv-scanner --gitlab-package",
  auditCommand,
  "node tools/ci/install-native.mjs lychee --gitlab-package",
  "node tools/ci/install-native.mjs vale --gitlab-package",
];

function requirePackageManagerSetup(steps, setupNode) {
  const setup = steps[setupNode]?.with;
  if (
    setup?.["package-manager-cache"] !== false ||
    setup?.["check-latest"] !== true ||
    setup?.cache !== undefined
  ) {
    throw new Error(
      "Node setup must resolve the latest declared runtime without invoking npm",
    );
  }
  const read = steps.findIndex((step) => step.id === "npm-version");
  const install = steps.findIndex(
    (step) =>
      step.run ===
      "npm install --global --ignore-scripts npm@${{ steps.npm-version.outputs.version }}",
  );
  const expected =
    "node -e \"require('node:fs').appendFileSync(process.env.GITHUB_OUTPUT, 'version=' + require('./package.json').devEngines.packageManager.version + '\\n')\"";
  if (read <= setupNode || install <= read || steps[read]?.run !== expected) {
    throw new Error(
      "package-manager supply must derive the native declaration after Node setup",
    );
  }
  return install;
}

function parseYaml(source, name) {
  const document = YAML.parseDocument(source, { uniqueKeys: true });
  if (document.errors.length)
    throw new Error(`${name}: ${document.errors[0].message}`);
  return document.toJS();
}

function sourceSupply(job) {
  return Array.isArray(job?.before_script)
    ? job.before_script.flat(10)
    : job?.before_script;
}

function requireStep(steps, prefix) {
  const index = steps.findIndex(
    (step) =>
      typeof step.uses === "string" && step.uses.startsWith(`${prefix}@`),
  );
  if (index < 0) throw new Error(`GitHub workflow missing ${prefix}`);
  return { index, step: steps[index] };
}

function requireHostedJobExecution(job, kind, hosts) {
  const strategy = job.strategy ?? {};
  const matrix = strategy.matrix ?? {};
  if (
    strategy["fail-fast"] !== false ||
    Object.keys(strategy).sort().join(",") !== "fail-fast,matrix" ||
    Object.keys(matrix).join(",") !== "os" ||
    JSON.stringify(matrix.os) !== JSON.stringify(hosts) ||
    job["runs-on"] !== "${{ matrix.os }}"
  ) {
    throw new Error(
      `GitHub ${kind} host matrix must be exact on hosted runners`,
    );
  }
  if (
    job.if !== undefined ||
    job["continue-on-error"] !== undefined ||
    (Array.isArray(job.steps) &&
      job.steps.some(
        (step) =>
          (step.if !== undefined &&
            !(
              kind === "source" &&
              step.if === "always()" &&
              step.uses?.startsWith("actions/upload-artifact@")
            )) ||
          step["continue-on-error"] !== undefined,
      ))
  ) {
    throw new Error(`GitHub ${kind} job cannot skip or ignore verification`);
  }
}

function validateOfflineWorkflow(source, nodeMajor) {
  const workflow = parseYaml(source, "GitHub offline workflow");
  if (
    workflow.on?.workflow_dispatch?.inputs?.tag?.required !== true ||
    workflow.on?.workflow_dispatch?.inputs?.tag?.type !== "string" ||
    JSON.stringify(workflow.on?.release?.types) !==
      JSON.stringify(["published"])
  ) {
    throw new Error(
      "offline verification requires a published release trigger",
    );
  }
  const job = workflow.jobs?.verify;
  if (workflow.permissions?.contents !== "read" || !job || job.container) {
    throw new Error("offline verification must use read-only hosted runners");
  }
  requireHostedJobExecution(job, "offline", offlineHostMatrix);
  const expectedRef = "${{ github.event.release.tag_name || inputs.tag }}";
  if (job.env?.DDWG_RELEASE_TAG !== expectedRef || job.env?.GH_TOKEN) {
    throw new Error("offline verification must bind the exact release tag");
  }
  const steps = job.steps;
  if (!Array.isArray(steps) || steps.length !== 7)
    throw new Error("offline verification requires exact seven steps");
  for (const step of steps) {
    if (step.uses && !/^[^@]+@[0-9a-f]{40}$/u.test(step.uses)) {
      throw new Error(`offline action is not pinned by commit: ${step.uses}`);
    }
  }
  const checkout = requireStep(steps, "actions/checkout");
  const setupNode = requireStep(steps, "actions/setup-node");
  if (
    checkout.step.with?.ref !== expectedRef ||
    checkout.step.with?.["fetch-depth"] !== 0
  ) {
    throw new Error(
      "offline release checkout must use full history and the exact tag",
    );
  }
  if (
    checkout.index >= setupNode.index ||
    String(setupNode.step.with?.["node-version"]) !== String(nodeMajor)
  ) {
    throw new Error(
      `offline release must configure Node ${nodeMajor} after checkout`,
    );
  }
  const packageManager = requirePackageManagerSetup(steps, setupNode.index);
  const commands = steps
    .slice(packageManager + 1)
    .filter((step) => typeof step.run === "string");
  if (
    commands[0]?.run !== "node tools/ci/offline-bundle.mjs acquire-github" ||
    setupNode.index >= steps.indexOf(commands[0])
  ) {
    throw new Error("offline acquisition must follow runtime setup");
  }
  if (commands.some((step) => step.env !== undefined)) {
    throw new Error("public offline acquisition needs no credentials");
  }
  if (commands[1]?.run !== "node tools/ci/offline-bundle.mjs install") {
    throw new Error("offline installation must use the pinned bundle");
  }
  if (commands[2]?.run !== verifier || commands.length !== 3) {
    throw new Error("offline verifier must run the full repository check");
  }
  return offlineHostMatrix;
}

function validateGitLabOffline(gitlab, expectedImage) {
  const job = gitlab[".offline:verify"];
  if (!job) throw new Error("GitLab offline verification owner is missing");
  if (job.timeout !== "25m") {
    throw new Error("GitLab offline timeout must match its 25m peer");
  }
  if (
    job.image !== undefined ||
    gitlab.default?.image !== expectedImage ||
    Object.keys(job).sort().join(",") !==
      "before_script,interruptible,rules,script,stage,timeout,variables" ||
    job.stage !== "verify" ||
    job.interruptible !== true ||
    job.allow_failure !== undefined ||
    job.when !== undefined ||
    String(job.variables?.GIT_DEPTH) !== "0"
  ) {
    throw new Error("GitLab offline verification needs the declared runner");
  }
  const expectedRules = [
    { if: '$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == "web"' },
    { if: '$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == "api"' },
  ];
  if (JSON.stringify(job.rules) !== JSON.stringify(expectedRules)) {
    throw new Error("GitLab offline job requires a post-publication pipeline");
  }
  if (JSON.stringify(job.before_script) !== JSON.stringify([npmBootstrap])) {
    throw new Error(
      "GitLab offline job must explicitly acquire the declared package manager before offline work",
    );
  }
  const commands = job.script;
  if (commands?.[0] !== "node tools/ci/offline-bundle.mjs acquire-gitlab") {
    throw new Error("GitLab offline acquisition must use its own package");
  }
  if (commands[1] !== "node tools/ci/offline-bundle.mjs install") {
    throw new Error("GitLab offline installation must use the pinned bundle");
  }
  if (commands[2] !== verifier || commands.length !== 3) {
    throw new Error(
      "GitLab offline verifier must run the full repository check",
    );
  }
  return validateGitLabLinuxJob(gitlab, "offline", "offline");
}

function validateGitLabNativeJobs(gitlab, base, kind, lane) {
  return gitlabNativeCapabilities.map((capabilities) => {
    const name = `${base}:${capabilities.system}${lane === "review" ? ":review" : ""}`;
    const capability = capabilities[lane === "review" ? "review" : "protected"];
    const rules =
      lane === "review"
        ? reviewRules
        : lane === "protected"
          ? protectedRules
          : undefined;
    const job = gitlab[name];
    const resourceKeys =
      capabilities.system === "windows" ? ",resource_group" : "";
    if (capabilities.system === "windows") {
      const resource = gitlab["docs:verify:windows"]?.resource_group;
      if (
        typeof resource !== "string" ||
        !resource.trim() ||
        resource !== resource.trim() ||
        resource.includes("$") ||
        job?.resource_group !== resource
      ) {
        throw new Error(
          `GitLab ${kind} platform job ${name} must share one stable project resource`,
        );
      }
    }
    if (
      !job ||
      typeof job !== "object" ||
      Array.isArray(job) ||
      Object.keys(job).sort().join(",") !==
        `before_script,extends,inherit${resourceKeys}${rules ? ",rules" : ""},tags` ||
      job.extends !== `.${base}` ||
      JSON.stringify(sourceSupply(job)) !==
        JSON.stringify(kind === "source" ? nativeSourceSupply : []) ||
      Object.keys(job.inherit ?? {}).join(",") !== "default" ||
      job.inherit.default !== false ||
      JSON.stringify(job.tags) !== JSON.stringify([capability]) ||
      JSON.stringify(job.rules) !== JSON.stringify(rules)
    ) {
      throw new Error(
        `GitLab ${kind} platform job ${name} must inherit its full proof on ${capability}`,
      );
    }
    return capability;
  });
}

function validateGitLabLinuxJob(gitlab, phase, lane) {
  const name = `${phase}:verify:linux${lane === "review" ? ":review" : ""}`;
  const job = gitlab[name];
  const rules =
    lane === "review"
      ? reviewRules
      : lane === "protected"
        ? protectedRules
        : undefined;
  const capability =
    lane === "review"
      ? gitlabLinuxReviewCapability
      : gitlabLinuxProtectedCapability;
  if (
    !job ||
    typeof job !== "object" ||
    Array.isArray(job) ||
    Object.keys(job).sort().join(",") !==
      (rules ? "extends,rules,tags" : "extends,tags") ||
    job.extends !== `.${phase}:verify` ||
    JSON.stringify(job.tags) !== JSON.stringify([capability]) ||
    JSON.stringify(job.rules) !== JSON.stringify(rules)
  ) {
    throw new Error(
      `GitLab ${phase} Linux runner ${name} must inherit its hidden verification owner on ${capability}`,
    );
  }
  return job.tags[0];
}

export function validateCi(
  githubSource,
  gitlabSource,
  offlineSource = readText(".github/workflows/offline-verify.yml"),
) {
  const github = parseYaml(githubSource, "GitHub workflow");
  const gitlab = parseYaml(gitlabSource, "GitLab pipeline");
  if (gitlab.include !== undefined) {
    throw new Error("GitLab pipeline cannot import external CI configuration");
  }
  if (Object.keys(gitlab.default ?? {}).join(",") !== "image") {
    throw new Error("GitLab default must contain only the pinned image");
  }
  const admittedGitLabKeys = new Set([
    "workflow",
    "stages",
    "default",
    ".docs:source-supply",
    ".docs:verify",
    "docs:verify:linux",
    "docs:verify:linux:review",
    ".offline:verify",
    "offline:verify:linux",
    ...gitlabNativeCapabilities.flatMap(({ system }) => [
      `docs:verify:${system}`,
      `docs:verify:${system}:review`,
      `offline:verify:${system}`,
    ]),
  ]);
  if (Object.keys(gitlab).some((key) => !admittedGitLabKeys.has(key))) {
    throw new Error("GitLab pipeline cannot add unchecked global setup");
  }
  const supplyOwner = gitlab[".docs:source-supply"];
  if (
    Object.keys(supplyOwner ?? {}).join(",") !== "before_script" ||
    JSON.stringify(sourceSupply(supplyOwner)) !==
      JSON.stringify(nativeSourceSupply)
  ) {
    throw new Error("GitLab native source supply must have one complete owner");
  }
  if (
    JSON.stringify(gitlab.workflow?.rules) !== JSON.stringify(workflowRules)
  ) {
    throw new Error(
      "GitLab workflow must admit release, accepted, and proposal events without duplicate open-MR pushes",
    );
  }
  const { nodeMajor } = declaredToolRuntime();
  const imagePattern = new RegExp(
    `^public\\.ecr\\.aws/docker/library/node:${nodeMajor}-bookworm@sha256:[0-9a-f]{64}$`,
    "u",
  );
  const job = github.jobs?.verify;
  if (
    JSON.stringify(github.on?.push?.branches) !==
      JSON.stringify(["dev", "main", "proposal/**"]) ||
    JSON.stringify(github.on?.push?.tags) !== JSON.stringify(["v*"]) ||
    JSON.stringify(github.on?.pull_request?.branches) !==
      JSON.stringify(["dev", "main"])
  ) {
    throw new Error(
      "GitHub source triggers must cover accepted and proposal branches, pull requests, and version tags",
    );
  }
  if (!job || job.container || github.permissions?.contents !== "read") {
    throw new Error(
      "GitHub verification must use a read-only hosted job without a container",
    );
  }
  requireHostedJobExecution(job, "source", hostMatrix);
  const steps = job.steps;
  if (!Array.isArray(steps))
    throw new Error("GitHub verification steps are missing");
  for (const step of steps) {
    if (step.uses && !/^[^@]+@[0-9a-f]{40}$/u.test(step.uses)) {
      throw new Error(`GitHub action is not pinned by commit: ${step.uses}`);
    }
  }
  const checkout = requireStep(steps, "actions/checkout");
  if (checkout.step.with?.["fetch-depth"] !== 0) {
    throw new Error("GitHub must fetch full history and release tags");
  }
  const setupNode = requireStep(steps, "actions/setup-node");
  if (checkout.index >= setupNode.index) {
    throw new Error("GitHub checkout and runtime setup are out of order");
  }
  if (String(setupNode.step.with?.["node-version"]) !== String(nodeMajor)) {
    throw new Error(`GitHub Node ${nodeMajor} is missing`);
  }
  const packageManager = requirePackageManagerSetup(steps, setupNode.index);
  const commands = steps.map((step) => step.run?.trim()).filter(Boolean);
  const install = commands.indexOf("npm ci --ignore-scripts");
  const audit = commands.indexOf(auditCommand);
  const auditSupply = commands.indexOf(
    "node tools/ci/install-native.mjs osv-scanner --download",
  );
  const supply = commands.indexOf(
    "node tools/ci/install-native.mjs lychee --download",
  );
  const proseSupply = commands.indexOf(
    "node tools/ci/install-native.mjs vale --download",
  );
  const verify = commands.indexOf(verifier);
  if (!(
    install >= 0 &&
    packageManager <
      steps.findIndex((step) => step.run === "npm ci --ignore-scripts") &&
    install < auditSupply &&
    auditSupply < audit &&
    audit < supply &&
    supply < proseSupply &&
    proseSupply < verify
  )) {
    throw new Error(
      "GitHub dependency audit, supply, and common verification are out of order",
    );
  }
  const evidenceStep = requireStep(steps, "actions/upload-artifact");
  if (
    evidenceStep.step.if !== "always()" ||
    evidenceStep.step.with?.path !== "build/evidence/dependencies/" ||
    evidenceStep.step.with?.["if-no-files-found"] !== "error" ||
    evidenceStep.index <= steps.findIndex((step) => step.run === auditCommand)
  )
    throw new Error(
      "GitHub must preserve complete dependency evidence on every result",
    );
  const gitlabJob = gitlab[".docs:verify"];
  if (
    JSON.stringify(gitlabJob?.artifacts) !==
    JSON.stringify({ when: "always", paths: ["build/evidence/dependencies/"] })
  )
    throw new Error(
      "GitLab must preserve complete dependency evidence on every result",
    );
  const gitlabImage = gitlab.default?.image;
  if (gitlabJob && gitlabJob.timeout !== "20m") {
    throw new Error("GitLab source timeout must match its 20m peer");
  }
  if (
    !gitlabJob ||
    gitlabJob.image !== undefined ||
    !imagePattern.test(gitlabImage ?? "") ||
    Object.keys(gitlabJob).sort().join(",") !==
      "artifacts,before_script,interruptible,script,stage,timeout,variables" ||
    gitlabJob.stage !== "verify" ||
    gitlabJob.interruptible !== true ||
    gitlabJob.allow_failure !== undefined ||
    gitlabJob.when !== undefined
  ) {
    throw new Error(
      `GitLab verification must use a digest-pinned Node ${nodeMajor} image and declared container runner capability`,
    );
  }
  if (String(gitlabJob.variables?.GIT_DEPTH) !== "0") {
    throw new Error("GitLab must fetch full history and release tags");
  }
  const before = sourceSupply(gitlabJob);
  if (
    !Array.isArray(before) ||
    before.indexOf("npm ci --ignore-scripts") < 0 ||
    before.indexOf("npm ci --ignore-scripts") >= before.indexOf(auditCommand)
  ) {
    throw new Error("GitLab dependency audit or locked tool supply is missing");
  }
  if (
    JSON.stringify(before) !==
    JSON.stringify([npmBootstrap, ...nativeSourceSupply])
  ) {
    throw new Error("GitLab tool supply must use its own package registry");
  }
  if (JSON.stringify(gitlabJob.script) !== JSON.stringify([verifier])) {
    throw new Error(
      "GitLab must invoke the same repository verifier as GitHub",
    );
  }
  const gitlabHosts = [
    validateGitLabLinuxJob(gitlab, "docs", "protected"),
    ...validateGitLabNativeJobs(gitlab, "docs:verify", "source", "protected"),
  ];
  const gitlabReviewHosts = [
    validateGitLabLinuxJob(gitlab, "docs", "review"),
    ...validateGitLabNativeJobs(gitlab, "docs:verify", "source", "review"),
  ];
  const gitlabOfflineHosts = [
    validateGitLabOffline(gitlab, gitlabImage),
    ...validateGitLabNativeJobs(gitlab, "offline:verify", "offline", "offline"),
  ];
  return {
    hosts: hostMatrix,
    offlineHosts: validateOfflineWorkflow(offlineSource, nodeMajor),
    gitlabHosts,
    gitlabReviewHosts,
    gitlabOfflineHosts,
    nodeMajor,
    verifier,
    audit: auditCommand,
  };
}

export function checkCi() {
  const result = validateCi(
    readText(".github/workflows/docs-verify.yml"),
    readText(".gitlab-ci.yml"),
    readText(".github/workflows/offline-verify.yml"),
  );
  console.log(
    `PASS CI contract: GitHub ${result.hosts.length} hosted OS; GitLab ${result.gitlabHosts.length} OS with ${result.gitlabReviewHosts.length} separate review selectors; shared ${result.verifier}; hosted execution unverified`,
  );
}
