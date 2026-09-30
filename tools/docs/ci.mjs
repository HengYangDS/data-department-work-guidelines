import YAML from "yaml";
import { declaredToolRuntime, readText } from "./runtime.mjs";

const verifier = "npm run verify";
const auditCommand = "npm audit --audit-level=moderate";
const gitlabLinuxCapability = "ci-linux-arm64-container";
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
    if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG',
  },
];
const reviewRules = [
  { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
  {
    if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
  },
];
const workflowRules = [
  { if: "$CI_COMMIT_TAG" },
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

function parseYaml(source, name) {
  const document = YAML.parseDocument(source, { uniqueKeys: true });
  if (document.errors.length)
    throw new Error(`${name}: ${document.errors[0].message}`);
  return document.toJS();
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
          step.if !== undefined || step["continue-on-error"] !== undefined,
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
  if (!Array.isArray(steps) || steps.length !== 5)
    throw new Error("offline verification requires exact five steps");
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
  const commands = steps.filter((step) => typeof step.run === "string");
  if (
    commands[0]?.run !== "node tools/ci/offline-bundle.mjs acquire-github" ||
    setupNode.index >= steps.indexOf(commands[0])
  ) {
    throw new Error("offline acquisition must follow runtime setup");
  }
  if (
    commands[0].env?.GH_TOKEN !== "${{ github.token }}" ||
    commands[0].env?.GH_PROMPT_DISABLED !== "1" ||
    commands.slice(1).some((step) => step.env?.GH_TOKEN)
  ) {
    throw new Error("offline acquisition needs a step-scoped read-only token");
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
  const job = gitlab["offline:verify"];
  if (!job) throw new Error("GitLab offline verification job is missing");
  if (job.timeout !== "25m") {
    throw new Error("GitLab offline timeout must match its 25m peer");
  }
  if (
    job.image !== undefined ||
    gitlab.default?.image !== expectedImage ||
    JSON.stringify(job.tags) !== JSON.stringify([gitlabLinuxCapability]) ||
    job.stage !== "verify" ||
    job.allow_failure !== undefined ||
    job.when !== undefined ||
    String(job.variables?.GIT_DEPTH) !== "0"
  ) {
    throw new Error("GitLab offline verification needs the declared runner");
  }
  const expectedRules = [
    { if: '$CI_COMMIT_TAG && $CI_PIPELINE_SOURCE == "web"' },
    { if: '$CI_COMMIT_TAG && $CI_PIPELINE_SOURCE == "api"' },
  ];
  if (JSON.stringify(job.rules) !== JSON.stringify(expectedRules)) {
    throw new Error("GitLab offline job requires a post-publication pipeline");
  }
  if (job.before_script) {
    throw new Error("GitLab offline job cannot install online supply");
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
  return job.tags[0];
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
    if (
      !job ||
      typeof job !== "object" ||
      Array.isArray(job) ||
      Object.keys(job).sort().join(",") !==
        (rules ? "extends,inherit,rules,tags" : "extends,inherit,tags") ||
      job.extends !== base ||
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
    "docs:verify",
    "offline:verify",
    ...gitlabNativeCapabilities.flatMap(({ system }) => [
      `docs:verify:${system}`,
      `docs:verify:${system}:review`,
      `offline:verify:${system}`,
    ]),
  ]);
  if (Object.keys(gitlab).some((key) => !admittedGitLabKeys.has(key))) {
    throw new Error("GitLab pipeline cannot add unchecked global setup");
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
  const commands = steps.map((step) => step.run?.trim()).filter(Boolean);
  const install = commands.indexOf("npm ci --ignore-scripts");
  const audit = commands.indexOf(auditCommand);
  const supply = commands.indexOf(
    "node tools/ci/install-lychee.mjs --download",
  );
  const verify = commands.indexOf(verifier);
  if (!(install >= 0 && install < audit && audit < supply && supply < verify)) {
    throw new Error(
      "GitHub dependency audit, supply, and common verification are out of order",
    );
  }
  const gitlabJob = gitlab["docs:verify"];
  const gitlabImage = gitlab.default?.image;
  if (gitlabJob && gitlabJob.timeout !== "20m") {
    throw new Error("GitLab source timeout must match its 20m peer");
  }
  if (
    !gitlabJob ||
    gitlabJob.image !== undefined ||
    !imagePattern.test(gitlabImage ?? "") ||
    JSON.stringify(gitlabJob.tags) !==
      JSON.stringify([gitlabLinuxCapability]) ||
    gitlabJob.stage !== "verify" ||
    gitlabJob.interruptible !== true ||
    gitlabJob.rules !== undefined ||
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
  const before = gitlabJob.before_script;
  if (
    !Array.isArray(before) ||
    before.indexOf("npm ci --ignore-scripts") < 0 ||
    before.indexOf("npm ci --ignore-scripts") >= before.indexOf(auditCommand)
  ) {
    throw new Error("GitLab dependency audit or locked tool supply is missing");
  }
  if (
    JSON.stringify(before) !==
    JSON.stringify([
      "npm ci --ignore-scripts",
      auditCommand,
      "node tools/ci/install-lychee.mjs --gitlab-package",
    ])
  ) {
    throw new Error("GitLab tool supply must use its own package registry");
  }
  if (JSON.stringify(gitlabJob.script) !== JSON.stringify([verifier])) {
    throw new Error(
      "GitLab must invoke the same repository verifier as GitHub",
    );
  }
  const gitlabHosts = [
    gitlabLinuxCapability,
    ...validateGitLabNativeJobs(gitlab, "docs:verify", "source", "protected"),
  ];
  const gitlabReviewHosts = validateGitLabNativeJobs(
    gitlab,
    "docs:verify",
    "source",
    "review",
  );
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
    `PASS CI contract: GitHub ${result.hosts.length} hosted OS; GitLab ${result.gitlabHosts.length} OS with ${result.gitlabReviewHosts.length} separate native review selectors; shared ${result.verifier}; hosted execution unverified`,
  );
}
