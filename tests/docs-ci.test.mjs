import assert from "node:assert/strict";
import { test } from "node:test";
import YAML from "yaml";
import { validateCi } from "../tools/docs/ci.mjs";
import { assertNodeRuntime, readText } from "../tools/docs/runtime.mjs";

const github = readText(".github/workflows/docs-verify.yml");
const gitlab = readText(".gitlab-ci.yml");
const offline = readText(".github/workflows/offline-verify.yml");

function changedGitLab(jobName, change) {
  const pipeline = YAML.parse(gitlab);
  change(pipeline, pipeline[jobName]);
  return YAML.stringify(pipeline);
}

test("the repository check rejects an undeclared Node major", () => {
  assert.doesNotThrow(() => assertNodeRuntime("26.10.0"));
  assert.throws(() => assertNodeRuntime("22.23.3"), /Node 26/u);
});

test("both providers invoke one verifier on declared hosts", () => {
  const result = validateCi(github, gitlab);
  assert.equal(result.verifier, "npm run verify");
  assert.equal(result.audit, "npm audit --audit-level=moderate");
  assert.equal(result.nodeMajor, 26);
  assert.deepEqual(result.hosts, [
    "ubuntu-latest",
    "macos-latest",
    "windows-latest",
  ]);
  assert.deepEqual(result.gitlabHosts, [
    "ci-linux-arm64-container",
    "ci-macos-arm64-shell",
    "ci-windows-arm64-shell",
  ]);
  assert.deepEqual(result.gitlabOfflineHosts, result.gitlabHosts);
});

test("GitHub source CI rejects missing or extra branch routes", () => {
  for (const [event, branch] of [
    ["push", "dev"],
    ["push", "main"],
    ["push", "proposal/**"],
    ["pull_request", "dev"],
    ["pull_request", "main"],
  ]) {
    const workflow = YAML.parse(github);
    workflow.on[event].branches = workflow.on[event].branches.filter(
      (candidate) => candidate !== branch,
    );
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /GitHub source triggers/u,
      `${event}:${branch}`,
    );
  }
  const broader = YAML.parse(github);
  broader.on.push.branches.push("work/**");
  assert.throws(
    () => validateCi(YAML.stringify(broader), gitlab, offline),
    /GitHub source triggers/u,
  );
});

test("GitHub source verification cannot be skipped or lose a host", () => {
  for (const [name, change, reason] of [
    [
      "job condition",
      (job) => (job.if = false),
      /GitHub source job cannot skip/u,
    ],
    [
      "allowed failure",
      (job) => (job["continue-on-error"] = true),
      /GitHub source job cannot skip/u,
    ],
    [
      "excluded host",
      (job) => (job.strategy.matrix.exclude = [{ os: "windows-latest" }]),
      /GitHub source host matrix/u,
    ],
    [
      "skipped verifier",
      (job) => (job.steps.at(-1).if = false),
      /GitHub source job cannot skip/u,
    ],
    [
      "ignored verifier failure",
      (job) => (job.steps.at(-1)["continue-on-error"] = true),
      /GitHub source job cannot skip/u,
    ],
  ]) {
    const workflow = YAML.parse(github);
    change(workflow.jobs.verify);
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      reason,
      name,
    );
  }
});

test("GitHub offline verification cannot be skipped or lose a host", () => {
  for (const [name, change, reason] of [
    [
      "job condition",
      (job) => (job.if = false),
      /GitHub offline job cannot skip/u,
    ],
    [
      "allowed failure",
      (job) => (job["continue-on-error"] = true),
      /GitHub offline job cannot skip/u,
    ],
    [
      "excluded host",
      (job) => (job.strategy.matrix.exclude = [{ os: "windows-latest" }]),
      /GitHub offline host matrix/u,
    ],
    [
      "skipped verifier",
      (job) => (job.steps.at(-1).if = false),
      /GitHub offline job cannot skip/u,
    ],
    [
      "ignored verifier failure",
      (job) => (job.steps.at(-1)["continue-on-error"] = true),
      /GitHub offline job cannot skip/u,
    ],
  ]) {
    const workflow = YAML.parse(offline);
    change(workflow.jobs.verify);
    assert.throws(
      () => validateCi(github, gitlab, YAML.stringify(workflow)),
      reason,
      name,
    );
  }
});

test("GitLab offline CI rejects inherited setup and remote includes", () => {
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("default", (pipeline) => {
          pipeline.default.before_script = ["npm ci"];
        }),
        offline,
      ),
    /GitLab default must contain only the pinned image/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("workflow", (pipeline) => {
          pipeline.include = [{ project: "foreign/ci", file: "pipeline.yml" }];
        }),
        offline,
      ),
    /GitLab pipeline cannot import external CI configuration/u,
  );
  for (const [name, change] of [
    ["global pre-script", (pipeline) => (pipeline.before_script = ["npm ci"])],
    [
      "global variables",
      (pipeline) => (pipeline.variables = { NPM_CONFIG_OFFLINE: "false" }),
    ],
  ]) {
    assert.throws(
      () => validateCi(github, changedGitLab("workflow", change), offline),
      /GitLab pipeline cannot add unchecked global setup/u,
      name,
    );
  }
});

test("GitLab native review and protected jobs use separate capabilities", () => {
  const result = validateCi(github, gitlab, offline);
  assert.deepEqual(result.gitlabReviewHosts, [
    "ci-macos-arm64-review",
    "ci-windows-arm64-review",
  ]);
  const pipeline = YAML.parse(gitlab);
  for (const system of ["macos", "windows"]) {
    const trusted = pipeline[`docs:verify:${system}`];
    const review = pipeline[`docs:verify:${system}:review`];
    assert.ok(review, `${system} review job is missing`);
    assert.notDeepEqual(trusted.tags, review.tags);
    assert.deepEqual(trusted.rules, [
      {
        if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG',
      },
    ]);
    assert.deepEqual(review.rules, [
      { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
      {
        if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
      },
    ]);
  }
});

test("GitLab suppresses duplicate proposal pushes after an MR opens", () => {
  const pipeline = YAML.parse(gitlab);
  assert.deepEqual(pipeline.workflow?.rules, [
    { if: "$CI_COMMIT_TAG" },
    { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
    { if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main"' },
    {
      if: "$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_OPEN_MERGE_REQUESTS",
      when: "never",
    },
    { if: "$CI_COMMIT_BRANCH =~ /^proposal\\//" },
  ]);
  assert.throws(
    () =>
      validateCi(
        github,
        changedGitLab("workflow", (source) => delete source.workflow),
        offline,
      ),
    /GitLab workflow/u,
  );
});

test("GitLab native jobs cannot disappear or bypass the shared proof", () => {
  for (const jobName of [
    "docs:verify:macos",
    "docs:verify:macos:review",
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:macos",
    "offline:verify:windows",
  ]) {
    for (const change of [
      (pipeline) => delete pipeline[jobName],
      (_pipeline, job) => (job.tags = ["ci-linux-arm64-container"]),
      (_pipeline, job) => (job.inherit.default = true),
      (_pipeline, job) => (job.script = ["echo passed"]),
      (_pipeline, job) => (job.allow_failure = true),
      (_pipeline, job) => (job.when = "manual"),
      (_pipeline, job) => (job.rules = [{ if: "$CI_COMMIT_TAG" }]),
    ]) {
      assert.throws(
        () => validateCi(github, changedGitLab(jobName, change), offline),
        /GitLab .* platform job/u,
        jobName,
      );
    }
  }
});

test("GitLab source and offline jobs use bounded peer-equivalent deadlines", () => {
  for (const [jobName, minutes] of [
    ["docs:verify", "20m"],
    ["offline:verify", "25m"],
  ]) {
    const pipeline = YAML.parse(gitlab);
    pipeline[jobName].timeout = minutes;
    assert.doesNotThrow(() =>
      validateCi(github, YAML.stringify(pipeline), offline),
    );
    pipeline[jobName].timeout = "1h";
    assert.throws(
      () => validateCi(github, YAML.stringify(pipeline), offline),
      /GitLab .* timeout/u,
    );
  }
});

test("both providers refuse to skip the dependency audit", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace(
          "run: npm audit --audit-level=moderate",
          "run: echo skipped",
        ),
        gitlab,
      ),
    /dependency audit/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace("- npm audit --audit-level=moderate", "- echo skipped"),
      ),
    /dependency audit/u,
  );
});

test("both providers supply tools without a browser installation", () => {
  assert.doesNotMatch(github, /setup-chrome|PUPPETEER|mermaid/u);
  assert.doesNotMatch(gitlab, /chromium|PUPPETEER|mermaid|apt-get/u);
  assert.equal(validateCi(github, gitlab).verifier, "npm run verify");
});

test("GitLab jobs pin the official multiarch Node image by digest", () => {
  const image = gitlab.match(
    /image: (public\.ecr\.aws\/docker\/library\/node:26-bookworm@sha256:[0-9a-f]{64})/u,
  )?.[1];
  assert.ok(image, "GitLab Node image is not digest-pinned");
  assert.equal(gitlab.split(`image: ${image}`).length - 1, 1);
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(image, "public.ecr.aws/docker/library/node:26-bookworm"),
        offline,
      ),
    /digest-pinned/u,
  );
});

test("CI runtime follows the declared stable Node line", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace("node-version: 26", "node-version: 22"),
        gitlab,
      ),
    /Node 26/u,
  );
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace("node:26-bookworm", "node:22-bookworm"),
      ),
    /Node 26/u,
  );
});

test("CI contract refuses a missing checkout and a changed verifier", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace("actions/checkout@", "other/checkout@"),
        gitlab,
      ),
    /missing actions\/checkout/u,
  );
  assert.throws(
    () =>
      validateCi(github, gitlab.replace("npm run verify", "npm run partial")),
    /same repository verifier/u,
  );
});

test("CI contract refuses an unpinned action or local runner", () => {
  assert.throws(
    () =>
      validateCi(
        github.replace(
          /actions\/setup-node@[0-9a-f]{40}/u,
          "actions/setup-node@main",
        ),
        gitlab,
      ),
    /not pinned/u,
  );
  assert.throws(
    () => validateCi(github.replace("ubuntu-latest", "self-hosted"), gitlab),
    /hosted runners/u,
  );
});

test("versioned CI refuses shallow history or missing tag triggers", () => {
  assert.throws(
    () =>
      validateCi(github.replace("fetch-depth: 0", "fetch-depth: 1"), gitlab),
    /full history/u,
  );
  assert.throws(
    () =>
      validateCi(github.replace('      - "v*"', '      - "other*"'), gitlab),
    /version tags/u,
  );
  assert.throws(
    () =>
      validateCi(github, gitlab.replace('GIT_DEPTH: "0"', 'GIT_DEPTH: "1"')),
    /full history/u,
  );
});

test("GitLab CI cannot regress to a GitHub-hosted tool download", () => {
  assert.throws(
    () => validateCi(github, gitlab.replace("--gitlab-package", "--download")),
    /GitLab.*supply/u,
  );
});

test("GitLab jobs require one canonical ARM64 container capability", () => {
  const canonical = gitlab;
  const offlineTag =
    /(offline:verify:[\s\S]*?  tags:\n)    - ci-linux-arm64-container\n/u;
  assert.doesNotMatch(canonical, /ci-linux-arm64-docker/u);
  assert.match(canonical, offlineTag);
  assert.equal(
    validateCi(github, canonical, offline).gitlabOfflineHosts[0],
    "ci-linux-arm64-container",
  );
  for (const changed of [
    canonical.replaceAll("ci-linux-arm64-container", "ci-linux-arm64-docker"),
    canonical.replace(
      "    - ci-linux-arm64-container\n",
      "    - ci-linux-arm64-docker\n",
    ),
    canonical.replace("    - ci-linux-arm64-container\n", ""),
    canonical.replace(
      "    - ci-linux-arm64-container\n",
      "    - ci-linux-arm64-container\n    - ci-linux-arm64-docker\n",
    ),
    canonical.replace(offlineTag, "$1"),
    canonical.replace(
      offlineTag,
      "$1    - ci-linux-arm64-container\n    - ci-linux-arm64-docker\n",
    ),
    canonical.replace(
      /(offline:verify:[\s\S]*?    - )ci-linux-arm64-container/u,
      "$1ci-linux-arm64-docker",
    ),
  ]) {
    assert.throws(
      () => validateCi(github, changed, offline),
      /GitLab.*runner/u,
    );
  }
});

test("offline release CI runs the source-pinned bundle on four hosted systems", () => {
  assert.deepEqual(validateCi(github, gitlab, offline).offlineHosts, [
    "ubuntu-latest",
    "ubuntu-24.04-arm",
    "macos-latest",
    "windows-latest",
  ]);
  for (const [changed, reason] of [
    [
      offline.replace("types: [published]", "types: [created]"),
      /published release/u,
    ],
    [offline.replace("fetch-depth: 0", "fetch-depth: 1"), /full history/u],
    [
      offline.replace(
        "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
        "actions/setup-node@main",
      ),
      /not pinned/u,
    ],
    [
      offline.replace(
        "run: node tools/ci/offline-bundle.mjs acquire-github",
        "run: echo skipped",
      ),
      /offline acquisition/u,
    ],
    [
      offline.replace(
        "run: node tools/ci/offline-bundle.mjs install",
        "run: npm ci",
      ),
      /offline installation/u,
    ],
    [
      offline.replace("run: npm run verify", "run: npm run partial"),
      /offline verifier/u,
    ],
    [
      offline.replace("GH_TOKEN: ${{ github.token }}", "GH_TOKEN: fixture"),
      /read-only token/u,
    ],
    [
      offline.replace(
        "      - name: Install without remote supply",
        `      - uses: actions/cache@${"0".repeat(40)}\n      - name: Install without remote supply`,
      ),
      /exact five steps/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, gitlab, changed), reason);
  }
});

test("GitLab offline release CI runs only after a release asset is available", () => {
  const result = validateCi(github, gitlab, offline);
  assert.equal(result.gitlabOfflineHosts[0], "ci-linux-arm64-container");
  for (const [changed, reason] of [
    [gitlab.replace(/\noffline:verify:[\s\S]*$/u, ""), /GitLab offline/u],
    [
      gitlab.replace(
        'CI_PIPELINE_SOURCE == "api"',
        'CI_PIPELINE_SOURCE == "push"',
      ),
      /post-publication/u,
    ],
    [
      gitlab.replace("acquire-gitlab", "acquire-github"),
      /GitLab offline acquisition/u,
    ],
    [
      gitlab.replace("offline-bundle.mjs install", "npm ci"),
      /GitLab offline installation/u,
    ],
    [
      gitlab.replace(
        /(offline:verify:[\s\S]*?    - )npm run verify/u,
        "$1npm run partial",
      ),
      /GitLab offline verifier/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, changed, offline), reason);
  }
});
