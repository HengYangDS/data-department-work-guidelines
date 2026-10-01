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

test("GitLab version-tag admission matches the GitHub namespace", () => {
  const pipeline = YAML.parse(gitlab);
  const tagRule = "$CI_COMMIT_TAG =~ /^v[^\\/]*$/";
  assert.deepEqual(YAML.parse(github).on.push.tags, ["v*"]);
  assert.equal(pipeline.workflow.rules[0].if, tagRule);
  for (const system of ["linux", "macos", "windows"]) {
    assert.equal(
      pipeline[`docs:verify:${system}`].rules[0].if,
      `$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || ${tagRule}`,
    );
  }
  assert.deepEqual(pipeline[".offline:verify"].rules, [
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "web"` },
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "api"` },
  ]);
  for (const [tag, admitted] of [
    ["v7.0.4", true],
    ["v7.1.0-rc.1", true],
    ["v", true],
    ["vfoo", true],
    ["v7.0.4/topic", false],
    ["v7/review", false],
    ["v/7.0.4", false],
    ["release-7.0.4", false],
    ["candidate/dev", false],
    ["", false],
  ]) {
    assert.equal(/^v[^/]*$/u.test(tag), admitted, tag);
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("the CI contract rejects broader GitLab tag routes", () => {
  for (const [owner, ruleIndex] of [
    ["workflow", 0],
    ["docs:verify:linux", 0],
    ["docs:verify:macos", 0],
    ["docs:verify:windows", 0],
    [".offline:verify", 0],
    [".offline:verify", 1],
  ]) {
    const pipeline = YAML.parse(gitlab);
    pipeline[owner].rules[ruleIndex].if = pipeline[owner].rules[
      ruleIndex
    ].if.replace("$CI_COMMIT_TAG =~ /^v[^\\/]*$/", "$CI_COMMIT_TAG");
    assert.throws(
      () => validateCi(github, YAML.stringify(pipeline), offline),
      /GitLab/u,
      `${owner}:${ruleIndex}`,
    );
  }
});

test("GitLab runnable verification jobs name their phase and platform", () => {
  const pipeline = YAML.parse(gitlab);
  const jobs = Object.keys(pipeline).filter((name) =>
    /^(?:docs|offline):verify(?:$|:)/u.test(name),
  );
  const expected = ["linux", "macos", "windows"].flatMap((system) => [
    `docs:verify:${system}`,
    `docs:verify:${system}:review`,
    `offline:verify:${system}`,
  ]);
  assert.deepEqual(jobs.sort(), expected.sort());
  for (const phase of ["docs", "offline"]) {
    const owner = `.${phase}:verify`;
    assert.ok(pipeline[owner], `${phase} shared verification owner is missing`);
    for (const name of jobs.filter((job) => job.startsWith(`${phase}:`))) {
      assert.equal(pipeline[name].extends, owner, name);
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("GitLab verification rejects platform-less aliases and runnable shared owners", () => {
  for (const phase of ["docs", "offline"]) {
    const owner = `.${phase}:verify`;
    const platform = `${phase}:verify:linux`;
    for (const change of [
      (pipeline) => (pipeline[`${phase}:verify`] = pipeline[platform]),
      (pipeline) => {
        pipeline[`${phase}:verify`] = pipeline[owner];
        delete pipeline[owner];
      },
      (pipeline) => (pipeline[platform].extends = "docs:verify:linux"),
    ]) {
      const pipeline = YAML.parse(gitlab);
      change(pipeline);
      assert.throws(
        () => validateCi(github, YAML.stringify(pipeline), offline),
        /GitLab/u,
        phase,
      );
    }
  }
});

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
    "ci-linux-arm64-container-protected",
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
  assert.deepEqual(result.gitlabReviewHosts.slice(1), [
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
        if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
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

test("GitLab Linux review and protected jobs use separate capabilities", () => {
  const result = validateCi(github, gitlab, offline);
  const pipeline = YAML.parse(gitlab);
  const trusted = pipeline["docs:verify:linux"];
  const review = pipeline["docs:verify:linux:review"];
  const offlineJob = pipeline["offline:verify:linux"];
  assert.ok(review, "Linux review job is missing");
  assert.equal(result.gitlabReviewHosts.length, 3);
  assert.deepEqual(trusted.rules, [
    {
      if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
    },
  ]);
  assert.deepEqual(review.rules, [
    { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
    {
      if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
    },
  ]);
  assert.notDeepEqual(trusted.tags, review.tags);
  assert.deepEqual(offlineJob.tags, trusted.tags);

  for (const change of [
    (source) => delete source["docs:verify:linux:review"],
    (source) => delete source["docs:verify:linux"].rules,
    (source) =>
      (source["docs:verify:linux:review"].rules =
        source["docs:verify:linux"].rules),
    (source) =>
      (source["docs:verify:linux:review"].inherit = { default: false }),
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab("docs:verify:linux", (source) => change(source)),
          offline,
        ),
      /GitLab .*runner|GitLab Linux/u,
    );
  }
});

test("GitLab suppresses duplicate proposal pushes after an MR opens", () => {
  const pipeline = YAML.parse(gitlab);
  assert.deepEqual(pipeline.workflow?.rules, [
    { if: "$CI_COMMIT_TAG =~ /^v[^\\/]*$/" },
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
    [".docs:verify", "20m"],
    [".offline:verify", "25m"],
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
    /dependency audit|native source supply/u,
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

test("GitLab Linux capabilities are exact and role-specific", () => {
  const result = validateCi(github, gitlab, offline);
  assert.equal(result.gitlabHosts[0], "ci-linux-arm64-container-protected");
  assert.equal(result.gitlabReviewHosts[0], "ci-linux-arm64-container");
  assert.equal(
    result.gitlabOfflineHosts[0],
    "ci-linux-arm64-container-protected",
  );
  for (const [jobName, tags] of [
    ["docs:verify:linux", ["ci-linux-arm64-container"]],
    ["docs:verify:linux", ["ci-linux-arm64-docker"]],
    ["docs:verify:linux:review", ["ci-linux-arm64-container-protected"]],
    ["docs:verify:linux:review", ["ci-linux-arm64-docker"]],
    ["offline:verify:linux", ["ci-linux-arm64-container"]],
    [
      "offline:verify:linux",
      ["ci-linux-arm64-container-protected", "ci-linux-arm64-container"],
    ],
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(jobName, (_pipeline, job) => (job.tags = tags)),
          offline,
        ),
      /GitLab.*(?:runner|capability)/u,
      jobName,
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
      offline.replace(
        "        run: node tools/ci/offline-bundle.mjs acquire-github",
        "        run: node tools/ci/offline-bundle.mjs acquire-github\n        env: { GH_TOKEN: fixture }",
      ),
      /public offline acquisition needs no credentials/u,
    ],
    [
      offline.replace(
        "      - name: Install without remote supply",
        `      - uses: actions/cache@${"0".repeat(40)}\n      - name: Install without remote supply`,
      ),
      /exact seven steps/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, gitlab, changed), reason);
  }
});

test("GitLab offline release CI runs only after a release asset is available", () => {
  const result = validateCi(github, gitlab, offline);
  assert.equal(
    result.gitlabOfflineHosts[0],
    "ci-linux-arm64-container-protected",
  );
  for (const [changed, reason] of [
    [gitlab.replace(/\n\.offline:verify:[\s\S]*$/u, ""), /GitLab offline/u],
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
        /(\.offline:verify:[\s\S]*?    - )npm run verify/u,
        "$1npm run partial",
      ),
      /GitLab offline verifier/u,
    ],
  ]) {
    assert.throws(() => validateCi(github, changed, offline), reason);
  }
});

test("Node setup avoids npm before native package-manager supply", () => {
  for (const source of [github, offline]) {
    const workflow = YAML.parse(source);
    const setup = workflow.jobs.verify.steps.find((step) =>
      step.uses?.startsWith("actions/setup-node@"),
    );
    assert.equal(setup.with["package-manager-cache"], false);
    assert.equal(setup.with["check-latest"], true);
    for (const mutation of [
      () => delete setup.with["package-manager-cache"],
      () => (setup.with["package-manager-cache"] = true),
      () => (setup.with.cache = "npm"),
      () => (setup.with["check-latest"] = false),
    ]) {
      setup.with = {
        "node-version": 26,
        "package-manager-cache": false,
        "check-latest": true,
      };
      mutation();
      const changed = YAML.stringify(workflow);
      assert.throws(
        () =>
          source === github
            ? validateCi(changed, gitlab, offline)
            : validateCi(github, gitlab, changed),
        /Node setup must resolve the latest declared runtime without invoking npm/u,
      );
    }
  }
});

test("package-manager supply cannot bypass native admission or become a second version owner", () => {
  const workflow = YAML.parse(github);
  const install = workflow.jobs.verify.steps.find(
    (step) => step.name === "Install the declared package manager",
  );
  for (const command of [
    "npm install --global npm@11",
    "npm install --global --force npm@12.1.0",
  ]) {
    install.run = command;
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /package-manager supply/u,
    );
  }
  const native = YAML.parse(gitlab);
  native["docs:verify:macos"].before_script = [
    "npm install --global npm@12.1.0",
    ...native["docs:verify:macos"].before_script,
  ];
  assert.throws(
    () => validateCi(github, YAML.stringify(native), offline),
    /platform job/u,
  );
});

test("both source planes must supply native Vale before verification", () => {
  const workflow = YAML.parse(github);
  workflow.jobs.verify.steps = workflow.jobs.verify.steps.filter(
    (step) => step.run !== "node tools/ci/install-native.mjs vale --download",
  );
  assert.throws(
    () => validateCi(YAML.stringify(workflow), gitlab, offline),
    /supply/u,
  );
  for (const name of [
    ".docs:source-supply",
    ".docs:verify",
    "docs:verify:macos",
    "docs:verify:windows",
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(name, (_, job) => {
            job.before_script = job.before_script
              .flat(10)
              .filter(
                (command) =>
                  command !==
                  "node tools/ci/install-native.mjs vale --gitlab-package",
              );
          }),
          offline,
        ),
      /supply|native|setup|full proof/u,
    );
  }
});

test("native YAML aliases preserve one source-supply list and reject omissions", () => {
  const pipeline = YAML.parse(gitlab);
  const supply = pipeline[".docs:source-supply"].before_script;
  assert.strictEqual(pipeline[".docs:verify"].before_script[1], supply);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].before_script,
        supply,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const change of [
    (owner) => owner.before_script.splice(2, 1),
    (owner) => (owner.script = ["npm run verify"]),
  ]) {
    assert.throws(
      () =>
        validateCi(
          github,
          changedGitLab(".docs:source-supply", (_, owner) => change(owner)),
          offline,
        ),
      /native source supply/u,
    );
  }
});
