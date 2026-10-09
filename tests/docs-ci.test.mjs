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

test("GitLab candidate qualification selects only the existing offline jobs", () => {
  const pipeline = YAML.parse(gitlab);
  const candidate = {
    if: '$DDWG_OFFLINE_CANDIDATE && $CI_COMMIT_REF_PROTECTED == "true" && ($CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main") && ($CI_PIPELINE_SOURCE == "api" || $CI_PIPELINE_SOURCE == "web")',
  };
  const exclude = { if: "$DDWG_OFFLINE_CANDIDATE", when: "never" };
  assert.deepEqual(pipeline.workflow.rules.slice(0, 2), [candidate, exclude]);
  assert.deepEqual(pipeline[".offline:verify"].rules.slice(0, 2), [
    candidate,
    exclude,
  ]);
  for (const system of ["linux", "macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.deepEqual(
        pipeline[`docs:verify:${system}${suffix}`].rules[0],
        exclude,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const mutate of [
    (copy) => copy.workflow.rules.shift(),
    (copy) => copy[".offline:verify"].rules.shift(),
    (copy) => copy["docs:verify:windows"].rules.shift(),
    (copy) => {
      copy[".offline:verify"].rules[0].if = "$DDWG_OFFLINE_CANDIDATE";
    },
  ]) {
    const changed = structuredClone(pipeline);
    mutate(changed);
    assert.throws(
      () => validateCi(github, YAML.stringify(changed), offline),
      /GitLab/u,
    );
  }
});

test("GitLab version-tag admission matches the GitHub namespace", () => {
  const pipeline = YAML.parse(gitlab);
  const tagRule = "$CI_COMMIT_TAG =~ /^v[^\\/]*$/";
  assert.deepEqual(YAML.parse(github).on.push.tags, ["v*"]);
  assert.equal(pipeline.workflow.rules[2].if, tagRule);
  for (const system of ["linux", "macos", "windows"]) {
    assert.equal(
      pipeline[`docs:verify:${system}`].rules[1].if,
      `$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || ${tagRule}`,
    );
  }
  assert.deepEqual(pipeline[".offline:verify"].rules.slice(2), [
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "web"` },
    { if: `${tagRule} && $CI_PIPELINE_SOURCE == "api"` },
  ]);
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("the CI contract rejects broader GitLab tag routes", () => {
  for (const [owner, ruleIndex] of [
    ["workflow", 2],
    ["docs:verify:linux", 1],
    ["docs:verify:macos", 1],
    ["docs:verify:windows", 1],
    [".offline:verify", 2],
    [".offline:verify", 3],
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

test("native shell jobs select locked process runtimes without changing host npm", () => {
  const pipeline = YAML.parse(gitlab);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      const job = pipeline[`docs:verify:${system}${suffix}`];
      assert.equal(
        job.script[0],
        "mise exec --locked -- npm run verify",
        "the selected native runtime must execute the complete verifier",
      );
      assert.equal(
        job.variables.MISE_OVERRIDE_CONFIG_FILENAMES,
        ".config/supply/mise.toml",
        "the supply configuration must be a project input, not a global override",
      );
      assert.ok(
        job.before_script.flat(10).includes("mise install --locked --jobs=1"),
      );
    }
    assert.deepEqual(pipeline[`offline:verify:${system}`].script, [
      "mise exec --locked -- node tools/ci/offline-bundle.mjs acquire-gitlab",
      "mise exec --locked -- node tools/ci/offline-bundle.mjs install",
      "mise exec --locked -- npm run verify",
    ]);
  }
  const changed = structuredClone(pipeline);
  changed["docs:verify:windows"].script = ["npm run verify"];
  assert.throws(
    () => validateCi(github, YAML.stringify(changed), offline),
    /native runtime|platform job/u,
  );
});

test("Windows jobs refresh only their process from the native machine path", () => {
  const pipeline = YAML.parse(gitlab);
  const refresh =
    "$env:PATH = $env:PATH + [IO.Path]::PathSeparator + [Environment]::GetEnvironmentVariable('Path', 'Machine')";
  for (const name of [
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:windows",
  ]) {
    const commands = pipeline[name].before_script.flat(10);
    assert.equal(commands[0], refresh, name);
    assert.equal(
      commands[1],
      "Get-Command mise -CommandType Application -ErrorAction Stop | Select-Object -ExpandProperty Source",
      name,
    );
    assert.equal(commands[2], "mise --version", name);
    assert.equal(commands[3], "whoami", name);
    assert.equal(commands[4], "mise install --locked --jobs=1", name);
    for (const change of [
      (job) => {
        job.before_script = commands.slice(1);
      },
      (job) => {
        job.before_script = [
          "$env:PATH = [Environment]::GetEnvironmentVariable('Path', 'Machine') + [IO.Path]::PathSeparator + $env:PATH",
          ...commands.slice(1),
        ];
      },
      (job) => {
        job.before_script = [
          "[Environment]::SetEnvironmentVariable('Path', $env:PATH, 'Machine')",
          ...commands.slice(1),
        ];
      },
    ]) {
      const changed = structuredClone(pipeline);
      change(changed[name]);
      assert.throws(
        () => validateCi(github, YAML.stringify(changed), offline),
        /platform job/u,
        name,
      );
    }
  }
});

test("both providers invoke one verifier on declared hosts", () => {
  const result = validateCi(github, gitlab);
  assert.equal(result.verifier, "npm run verify");
  assert.equal(result.audit, "node tools/docs/cli.mjs audit");
  assert.equal(result.nodeMajor, 26);
  assert.deepEqual(result.hosts, [
    "ubuntu-latest",
    "ubuntu-24.04-arm",
    "macos-latest",
    "windows-latest",
  ]);
  assert.deepEqual(result.hosts, result.offlineHosts);
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

test("both Forge source and offline jobs retain one bounded deadline", () => {
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const kind of ["source", "offline"]) {
    for (const minutes of [undefined, 0, 360]) {
      const source = YAML.parse(github);
      const release = YAML.parse(offline);
      const job = (kind === "source" ? source : release).jobs.verify;
      if (minutes === undefined) delete job["timeout-minutes"];
      else job["timeout-minutes"] = minutes;
      assert.throws(
        () =>
          validateCi(YAML.stringify(source), gitlab, YAML.stringify(release)),
        /GitHub .* timeout/u,
        `${kind}: ${minutes}`,
      );
    }
  }
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

test("each declared hosted source and offline platform is required", () => {
  for (const kind of ["source", "offline"]) {
    for (const host of [
      "ubuntu-latest",
      "ubuntu-24.04-arm",
      "macos-latest",
      "windows-latest",
    ]) {
      const source = YAML.parse(github);
      const release = YAML.parse(offline);
      const job = (kind === "source" ? source : release).jobs.verify;
      job.strategy.matrix.os = job.strategy.matrix.os.filter(
        (candidate) => candidate !== host,
      );
      assert.throws(
        () =>
          validateCi(YAML.stringify(source), gitlab, YAML.stringify(release)),
        /GitHub .* host matrix/u,
        `${kind}: ${host}`,
      );
    }
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
    assert.deepEqual(trusted.rules.slice(1), [
      {
        if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
      },
    ]);
    assert.deepEqual(review.rules.slice(1), [
      { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' },
      {
        if: '$CI_COMMIT_BRANCH =~ /^proposal\\// && $CI_PIPELINE_SOURCE == "push"',
      },
    ]);
  }
});

test("GitLab Windows verification shares one project resource without merging trust", () => {
  const pipeline = YAML.parse(gitlab);
  const jobs = [
    "docs:verify:windows",
    "docs:verify:windows:review",
    "offline:verify:windows",
  ];
  const resource = pipeline[jobs[0]].resource_group;
  assert.equal(typeof resource, "string");
  assert.ok(resource.trim());
  assert.ok(
    !resource.includes("$"),
    "the resource must not split by event or ref",
  );
  for (const name of jobs) {
    assert.equal(pipeline[name].resource_group, resource, name);
  }
  assert.notDeepEqual(
    pipeline[jobs[0]].tags,
    pipeline[jobs[1]].tags,
    "sharing a capacity reservation does not share a runner identity",
  );
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
  for (const name of jobs) {
    for (const change of [
      (job) => delete job.resource_group,
      (job) => (job.resource_group = "windows-$CI_COMMIT_REF_SLUG"),
      (job) => (job.resource_group = "separate-event"),
    ]) {
      const changed = YAML.parse(gitlab);
      change(changed[name]);
      assert.throws(
        () => validateCi(github, YAML.stringify(changed), offline),
        /GitLab.*resource/u,
        name,
      );
    }
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
  assert.deepEqual(trusted.rules.slice(1), [
    {
      if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "main" || $CI_COMMIT_TAG =~ /^v[^\\/]*$/',
    },
  ]);
  assert.deepEqual(review.rules.slice(1), [
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
  assert.deepEqual(pipeline.workflow?.rules.slice(2), [
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
          "run: node tools/docs/cli.mjs audit",
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
        gitlab.replace("- node tools/docs/cli.mjs audit", "- echo skipped"),
      ),
    /dependency audit|native source supply/u,
  );
});

test("both source planes preserve complete audit evidence after a failure", () => {
  const workflow = YAML.parse(github);
  const archive = workflow.jobs.verify.steps.find((step) =>
    step.uses?.startsWith("actions/upload-artifact@"),
  );
  assert.ok(archive);
  for (const changed of [undefined, "success()"])
    assert.throws(
      () =>
        validateCi(
          YAML.stringify({
            ...workflow,
            jobs: {
              verify: {
                ...workflow.jobs.verify,
                steps: workflow.jobs.verify.steps.map((step) =>
                  step === archive ? { ...step, if: changed } : step,
                ),
              },
            },
          }),
          gitlab,
          offline,
        ),
      /evidence|cannot skip/u,
    );
  const pipeline = YAML.parse(gitlab);
  pipeline[".docs:verify"].artifacts.when = "on_success";
  assert.throws(
    () => validateCi(github, YAML.stringify(pipeline), offline),
    /evidence/u,
  );
});

test("both providers supply tools without a browser installation", () => {
  assert.doesNotMatch(github, /setup-chrome|PUPPETEER|mermaid/u);
  assert.doesNotMatch(gitlab, /chromium|PUPPETEER|mermaid|apt-get/u);
  assert.equal(validateCi(github, gitlab).verifier, "npm run verify");
});

test("GitLab jobs pin the official multiarch Node image by digest", () => {
  const image = gitlab.match(
    /image: (public\.ecr\.aws\/docker\/library\/node:26-trixie@sha256:[0-9a-f]{64})/u,
  )?.[1];
  assert.ok(image, "GitLab Node image is not digest-pinned");
  assert.equal(gitlab.split(`image: ${image}`).length - 1, 1);
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(image, "public.ecr.aws/docker/library/node:26-trixie"),
        offline,
      ),
    /digest-pinned/u,
  );
});

test("CI uses the current official Debian base without weakening image pins", () => {
  const declared = YAML.parse(gitlab).default.image;
  assert.equal(validateCi(github, gitlab, offline).verifier, "npm run verify");
  assert.throws(
    () =>
      validateCi(
        github,
        gitlab.replace(declared, declared.replace("-trixie@", "-bookworm@")),
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
      validateCi(github, gitlab.replace("node:26-trixie", "node:22-trixie")),
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

test("offline release checkout names the tag namespace explicitly", () => {
  const workflow = YAML.parse(offline);
  const job = workflow.jobs.verify;
  const checkout = job.steps.find((step) =>
    step.uses?.startsWith("actions/checkout@"),
  );
  checkout.with.ref = `refs/tags/${job.env.DDWG_RELEASE_TAG}`;
  assert.doesNotThrow(() =>
    validateCi(github, gitlab, YAML.stringify(workflow)),
  );
  checkout.with.ref = job.env.DDWG_RELEASE_TAG;
  assert.throws(
    () => validateCi(github, gitlab, YAML.stringify(workflow)),
    /exact tag/u,
  );
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
        /actions\/setup-node@[0-9a-f]{40}/u,
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

test("Forge verification triggers remain complete and cannot filter material changes", () => {
  for (const [source, edits, expected] of [
    [
      github,
      [
        (workflow) => {
          workflow.on.push["paths-ignore"] = ["**/*.md"];
        },
        (workflow) => {
          workflow.on.pull_request_target = {};
        },
      ],
      /GitHub source triggers/u,
    ],
    [
      offline,
      [
        (workflow) => {
          workflow.on.push = { branches: ["dev"] };
        },
        (workflow) => {
          workflow.on.release["paths-ignore"] = ["**"];
        },
      ],
      /published release trigger/u,
    ],
  ]) {
    for (const edit of edits) {
      const workflow = YAML.parse(source);
      edit(workflow);
      assert.throws(
        () =>
          validateCi(
            source === github ? YAML.stringify(workflow) : github,
            gitlab,
            source === offline ? YAML.stringify(workflow) : offline,
          ),
        expected,
      );
    }
  }
  assert.doesNotThrow(() => validateCi(github, gitlab, offline));
});

test("hosted verification cannot enlarge workflow or job token permissions", () => {
  for (const source of [github, offline]) {
    for (const edit of [
      (workflow) => {
        workflow.permissions["id-token"] = "write";
      },
      (workflow) => {
        workflow.jobs.verify.permissions = { contents: "write" };
      },
    ]) {
      const workflow = YAML.parse(source);
      edit(workflow);
      assert.throws(
        () =>
          validateCi(
            source === github ? YAML.stringify(workflow) : github,
            gitlab,
            source === offline ? YAML.stringify(workflow) : offline,
          ),
        /read-only/u,
      );
    }
  }
});

test("hosted source verification stays on the selected repository and exact execution journey", () => {
  for (const source of [github, offline]) {
    const workflow = YAML.parse(source);
    workflow.jobs.verify.steps[0].with.repository = "Other/Repository";
    assert.throws(
      () =>
        validateCi(
          source === github ? YAML.stringify(workflow) : github,
          gitlab,
          source === offline ? YAML.stringify(workflow) : offline,
        ),
      /checkout|full history/u,
    );
  }
  for (const edit of [
    (workflow) => {
      workflow.jobs.verify.steps[0].with.ref = "main";
    },
    (workflow) => {
      workflow.jobs.verify.steps.splice(2, 0, {
        run: "node -e 'process.exit(0)'",
      });
    },
    (workflow) => {
      workflow.jobs.verify.steps.at(-1).env = {
        NODE_OPTIONS: "--require ./other.mjs",
      };
    },
    (workflow) => {
      workflow.jobs.verify.steps.at(-1)["working-directory"] = "other";
    },
    (workflow) => {
      workflow.jobs.verify.steps.at(-1).shell = "bash";
    },
    (workflow) => {
      workflow.jobs.verify.env = { NODE_OPTIONS: "--require ./other.mjs" };
    },
  ]) {
    const workflow = YAML.parse(github);
    edit(workflow);
    assert.throws(
      () => validateCi(YAML.stringify(workflow), gitlab, offline),
      /checkout|execution|environment|sequence/u,
    );
  }
});

test("GitLab verification owner variables cannot override native execution or supply", () => {
  for (const owner of [".docs:verify", ".offline:verify"]) {
    const pipeline = YAML.parse(gitlab);
    pipeline[owner].variables.NPM_CONFIG_REGISTRY = "http://other.example.test";
    assert.throws(
      () => validateCi(github, YAML.stringify(pipeline), offline),
      /variables/u,
    );
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
      changedGitLab(".offline:verify", (_pipeline, job) => {
        job.rules[3].if = job.rules[3].if.replace(
          'CI_PIPELINE_SOURCE == "api"',
          'CI_PIPELINE_SOURCE == "push"',
        );
      }),
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
        /(\.offline:verify:[\s\S]*? {4}- )npm run verify/u,
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
      () => (setup.with["node-version-file"] = "unowned.toml"),
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
    ".docs:native-source-supply",
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
                  !command.endsWith(
                    "node tools/ci/install-native.mjs vale --gitlab-package",
                  ),
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
  const selectedSupply = pipeline[".docs:native-source-supply"].before_script;
  const windowsSupply = pipeline[".docs:windows-source-supply"].before_script;
  assert.strictEqual(pipeline[".docs:verify"].before_script[1], supply);
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].before_script,
        system === "windows" ? windowsSupply : selectedSupply,
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
  const runtime = pipeline[".docs:native-runtime"];
  for (const system of ["macos", "windows"]) {
    for (const suffix of ["", ":review"]) {
      assert.strictEqual(
        pipeline[`docs:verify:${system}${suffix}`].variables,
        runtime.variables,
      );
    }
    assert.strictEqual(
      pipeline[`offline:verify:${system}`].before_script,
      system === "windows"
        ? pipeline[".docs:windows-runtime"].before_script
        : runtime.before_script,
    );
  }
});
