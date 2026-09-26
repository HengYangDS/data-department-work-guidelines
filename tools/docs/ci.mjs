import YAML from "yaml";
import { readText } from "./runtime.mjs";

const verifier = "npm run verify";
const auditCommand = "npm audit --audit-level=moderate";
const hostMatrix = ["ubuntu-latest", "macos-latest", "windows-latest"];

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

function validateOfflineWorkflow(source) {
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
  if (
    workflow.permissions?.contents !== "read" ||
    !job ||
    job.container ||
    JSON.stringify(job.strategy?.matrix?.os) !== JSON.stringify(hostMatrix) ||
    job["runs-on"] !== "${{ matrix.os }}"
  ) {
    throw new Error("offline verification must use read-only hosted runners");
  }
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
    String(setupNode.step.with?.["node-version"]) !== "22"
  ) {
    throw new Error("offline release must configure Node 22 after checkout");
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
  return hostMatrix;
}

export function validateCi(
  githubSource,
  gitlabSource,
  offlineSource = readText(".github/workflows/offline-verify.yml"),
) {
  const github = parseYaml(githubSource, "GitHub workflow");
  const gitlab = parseYaml(gitlabSource, "GitLab pipeline");
  const job = github.jobs?.verify;
  if (!github.on?.push?.tags?.includes("v*")) {
    throw new Error("GitHub must verify version tags as well as branches");
  }
  if (!job || job.container || github.permissions?.contents !== "read") {
    throw new Error(
      "GitHub verification must use a read-only hosted job without a container",
    );
  }
  if (
    JSON.stringify(job.strategy?.matrix?.os) !== JSON.stringify(hostMatrix) ||
    job["runs-on"] !== "${{ matrix.os }}"
  ) {
    throw new Error(
      "GitHub verification must run on Linux, macOS, and Windows hosted runners",
    );
  }
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
  if (String(setupNode.step.with?.["node-version"]) !== "22") {
    throw new Error("GitHub Node 22 is missing");
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
  if (
    !gitlabJob ||
    gitlabJob.image !== "node:22-bookworm" ||
    !gitlabJob.tags?.includes("ci-linux-arm64-docker")
  ) {
    throw new Error(
      "GitLab verification must use the declared Node 22 Docker runner",
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
  return {
    hosts: hostMatrix,
    offlineHosts: validateOfflineWorkflow(offlineSource),
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
    `PASS CI contract: ${result.hosts.join(", ")} and GitLab share ${result.verifier}; hosted runs remain separate evidence`,
  );
}
