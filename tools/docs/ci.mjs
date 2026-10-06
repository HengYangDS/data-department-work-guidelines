import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { parse as parseToml } from "smol-toml";
import YAML from "yaml";
import { validateLockSupply } from "../ci/offline-bundle.mjs";
import {
  declaredToolRuntime,
  managedFileExists,
  nativeToolBinary,
  readText,
  root,
} from "./runtime.mjs";

export const dependencyPolicyPath = ".config/checks/dependencies/policy.toml";
export function parseDependencyPolicy(source) {
  const policy = parseToml(source);
  if (
    Object.keys(policy).join(",") !== "IgnoredVulns" ||
    !Array.isArray(policy.IgnoredVulns) ||
    policy.IgnoredVulns.length !== 0
  )
    throw new Error(
      "native OSV policy must expose all findings without ignores",
    );
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
    }
  }
  if (seen.size !== identities.size)
    throw new Error("native dependency report omits input identities");
  if (exitCode !== (findings ? 1 : 0))
    throw new Error("native dependency report disagrees with its exit status");
  return { findings };
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
  parseDependencyPolicy(policySource);
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
  writeFileSync(path.join(evidence, "package-lock.json"), lockSource);
  const output = path.join(evidence, "raw.json");
  const args = [
    "scan",
    "source",
    ...(offline ? ["--offline"] : []),
    "--no-ignore",
    "--config",
    path.join(evidence, "policy.toml"),
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
  writeFileSync(
    path.join(evidence, "execution.json"),
    JSON.stringify(
      {
        time: new Date().toISOString(),
        offline,
        execution: [
          {
            command: [binary, ...args],
            status: result.status,
            signal: result.signal,
            error: result.error?.message,
          },
        ],
      },
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
  try {
    ({ findings: findingCount } = validateDependencyEvidence(
      JSON.parse(readFileSync(output, "utf8")),
      identities,
      result.status,
      repository,
    ));
  } catch (cause) {
    throw new Error(
      `native dependency report is invalid: ${cause.message}; evidence ${evidence}`,
      { cause },
    );
  }
  console.log(
    `${findingCount ? "REPORT" : "PASS"} native dependency audit: ${identities.size} identities; ${findingCount} raw findings; advisory findings do not block delivery; evidence ${path.relative(repository, evidence)}`,
  );
  return { evidence, findingCount };
}

const verifier = "npm run verify";
const auditCommand = "node tools/docs/cli.mjs audit";
const verificationMinutes = { source: 20, offline: 25 };
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
const candidateRule = {
  if: '$DDWG_OFFLINE_CANDIDATE && $CI_COMMIT_REF_PROTECTED == "true" && ($CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main") && ($CI_PIPELINE_SOURCE == "api" || $CI_PIPELINE_SOURCE == "web")',
};
const excludeCandidate = { if: "$DDWG_OFFLINE_CANDIDATE", when: "never" };
const protectedRules = [
  excludeCandidate,
  {
    if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
  },
];
const reviewRules = [
  excludeCandidate,
  { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
  {
    if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
  },
];
const workflowRules = [
  candidateRule,
  excludeCandidate,
  { if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/" },
  { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
  { if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main"' },
  {
    if: "$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_OPEN_MERGE_REQUESTS",
    when: "never",
  },
  { if: "$CI_COMMIT_BRANCH =~ /^proposal\\//" },
];
const hostMatrix = [
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
  if (job.permissions !== undefined) {
    throw new Error(
      `GitHub ${kind} job must inherit read-only workflow permissions`,
    );
  }
  if (kind === "source" && job.env !== undefined) {
    throw new Error(
      "GitHub source job cannot override the execution environment",
    );
  }
  if (job["timeout-minutes"] !== verificationMinutes[kind]) {
    throw new Error(
      `GitHub ${kind} timeout must be ${verificationMinutes[kind]} minutes`,
    );
  }
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
    !isDeepStrictEqual(workflow.on, {
      workflow_dispatch: {
        inputs: {
          tag: {
            description: "Signed release tag (vX.Y.Z)",
            required: true,
            type: "string",
          },
        },
      },
      release: { types: ["published"] },
    })
  ) {
    throw new Error(
      "offline verification requires a published release trigger",
    );
  }
  const job = workflow.jobs?.verify;
  if (
    !isDeepStrictEqual(workflow.permissions, { contents: "read" }) ||
    !job ||
    job.container
  ) {
    throw new Error("offline verification must use read-only hosted runners");
  }
  requireHostedJobExecution(job, "offline", hostMatrix);
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
    !isDeepStrictEqual(checkout.step.with, {
      ref: expectedRef,
      "fetch-depth": 0,
    })
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
  return hostMatrix;
}

function validateGitLabOffline(gitlab, expectedImage) {
  const job = gitlab[".offline:verify"];
  if (!job) throw new Error("GitLab offline verification owner is missing");
  if (job.timeout !== `${verificationMinutes.offline}m`) {
    throw new Error(
      `GitLab offline timeout must match its ${verificationMinutes.offline}m peer`,
    );
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
  if (!isDeepStrictEqual(job.variables, { GIT_DEPTH: "0" })) {
    throw new Error(
      "GitLab offline variables must preserve only full-history selection",
    );
  }
  const expectedRules = [
    candidateRule,
    excludeCandidate,
    { if: '$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == "web"' },
    { if: '$CI_COMMIT_TAG =~ /^v[^\\/]*$/ && $CI_PIPELINE_SOURCE == "api"' },
  ];
  if (JSON.stringify(job.rules) !== JSON.stringify(expectedRules)) {
    throw new Error(
      "GitLab offline job requires an explicit protected candidate or post-publication pipeline",
    );
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
    `^public\\.ecr\\.aws/docker/library/node:${nodeMajor}-trixie@sha256:[0-9a-f]{64}$`,
    "u",
  );
  const job = github.jobs?.verify;
  if (
    !isDeepStrictEqual(github.on, {
      push: { branches: ["dev", "main", "proposal/**"], tags: ["v*"] },
      pull_request: { branches: ["dev", "main"] },
    })
  ) {
    throw new Error(
      "GitHub source triggers must cover accepted and proposal branches, pull requests, and version tags",
    );
  }
  if (
    !job ||
    job.container ||
    !isDeepStrictEqual(github.permissions, { contents: "read" })
  ) {
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
  if (!isDeepStrictEqual(checkout.step.with, { "fetch-depth": 0 })) {
    throw new Error(
      "GitHub source checkout must use full history and the triggering repository ref",
    );
  }
  const setupNode = requireStep(steps, "actions/setup-node");
  if (checkout.index >= setupNode.index) {
    throw new Error("GitHub checkout and runtime setup are out of order");
  }
  if (String(setupNode.step.with?.["node-version"]) !== String(nodeMajor)) {
    throw new Error(`GitHub Node ${nodeMajor} is missing`);
  }
  const packageManager = requirePackageManagerSetup(steps, setupNode.index);
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
  const expectedSequence = [
    checkout.step.uses,
    setupNode.step.uses,
    steps.find((step) => step.id === "npm-version").run,
    steps[packageManager].run,
    "npm ci --ignore-scripts",
    "node tools/ci/install-native.mjs osv-scanner --download",
    auditCommand,
    evidenceStep.step.uses,
    "node tools/ci/install-native.mjs lychee --download",
    "node tools/ci/install-native.mjs vale --download",
    verifier,
  ];
  if (
    !isDeepStrictEqual(
      steps.map((step) => step.uses ?? step.run),
      expectedSequence,
    )
  ) {
    throw new Error(
      "GitHub source execution sequence must preserve dependency audit, supply, and common verification exactly",
    );
  }
  if (
    steps.some(
      (step) =>
        step.env !== undefined ||
        step.shell !== undefined ||
        step["working-directory"] !== undefined,
    )
  ) {
    throw new Error(
      "GitHub source steps cannot override the execution environment",
    );
  }
  const gitlabJob = gitlab[".docs:verify"];
  if (
    JSON.stringify(gitlabJob?.artifacts) !==
    JSON.stringify({ when: "always", paths: ["build/evidence/dependencies/"] })
  )
    throw new Error(
      "GitLab must preserve complete dependency evidence on every result",
    );
  const gitlabImage = gitlab.default?.image;
  if (gitlabJob && gitlabJob.timeout !== `${verificationMinutes.source}m`) {
    throw new Error(
      `GitLab source timeout must match its ${verificationMinutes.source}m peer`,
    );
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
  if (!isDeepStrictEqual(gitlabJob.variables, { GIT_DEPTH: "0" })) {
    throw new Error(
      "GitLab variables must preserve only full history and release tags",
    );
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
    `PASS CI contract: GitHub ${result.hosts.length} hosted platforms; GitLab ${result.gitlabHosts.length} OS with ${result.gitlabReviewHosts.length} separate review selectors; shared ${result.verifier}; hosted execution unverified`,
  );
}
