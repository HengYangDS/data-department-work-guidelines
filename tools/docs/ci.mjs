import YAML from "yaml";
import { readText } from "./runtime.mjs";

const verifier = "npm run verify";
const auditCommand = "npm audit --audit-level=moderate";
const renderer = ".config/tools/mermaid-hosted.json";
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

export function validateCi(githubSource, gitlabSource) {
  if (
    githubSource.includes("--no-sandbox") ||
    gitlabSource.includes("--no-sandbox")
  ) {
    throw new Error(
      "provider workflow must not inline a browser sandbox override",
    );
  }
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
  const setupChrome = requireStep(steps, "browser-actions/setup-chrome");
  if (!(
    checkout.index < setupNode.index && setupNode.index < setupChrome.index
  )) {
    throw new Error("GitHub checkout and runtime setup are out of order");
  }
  if (
    String(setupNode.step.with?.["node-version"]) !== "22" ||
    !/^\d+\.\d+\.\d+\.\d+$/u.test(
      String(setupChrome.step.with?.["chrome-version"]),
    )
  ) {
    throw new Error(
      "GitHub Node 22 or version-pinned stable Chrome is missing",
    );
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
  if (
    job.env?.DDWG_HOSTED_RENDERER_CONFIG !== renderer ||
    job.env?.PUPPETEER_SKIP_DOWNLOAD !== "true"
  ) {
    throw new Error("GitHub hosted renderer selection is missing");
  }
  const verificationStep = steps.find((step) => step.run?.trim() === verifier);
  if (!verificationStep?.env?.PUPPETEER_EXECUTABLE_PATH) {
    throw new Error("GitHub verifier lacks the managed Chrome path");
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
  if (
    gitlabJob.variables?.DDWG_HOSTED_RENDERER_CONFIG !== renderer ||
    gitlabJob.variables?.PUPPETEER_SKIP_DOWNLOAD !== "true"
  ) {
    throw new Error("GitLab hosted renderer selection is missing");
  }
  const before = gitlabJob.before_script;
  if (
    !Array.isArray(before) ||
    !before.some((command) =>
      /apt-get install.*\bgit\b.*\bchromium\b/u.test(command),
    )
  ) {
    throw new Error("GitLab runtime must supply Git and Chromium");
  }
  if (
    gitlabJob.variables?.PUPPETEER_EXECUTABLE_PATH ||
    !before.includes(
      'export PUPPETEER_EXECUTABLE_PATH="$(command -v chromium)"',
    )
  ) {
    throw new Error("GitLab must use runtime-discovered Chromium");
  }
  if (
    before.indexOf("npm ci --ignore-scripts") < 0 ||
    before.indexOf("npm ci --ignore-scripts") >= before.indexOf(auditCommand) ||
    before.indexOf(auditCommand) >=
      before.indexOf("node tools/ci/install-lychee.mjs --download")
  ) {
    throw new Error("GitLab dependency audit or locked tool supply is missing");
  }
  if (JSON.stringify(gitlabJob.script) !== JSON.stringify([verifier])) {
    throw new Error(
      "GitLab must invoke the same repository verifier as GitHub",
    );
  }
  return {
    hosts: hostMatrix,
    verifier,
    audit: auditCommand,
    browser: "runtime-discovered",
  };
}

export function checkCi() {
  const result = validateCi(
    readText(".github/workflows/docs-verify.yml"),
    readText(".gitlab-ci.yml"),
  );
  console.log(
    `PASS CI contract: ${result.hosts.join(", ")} and GitLab share ${result.verifier}; hosted runs remain separate evidence`,
  );
}
