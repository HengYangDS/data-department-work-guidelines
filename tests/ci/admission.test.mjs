import assert from "node:assert/strict";
import { test } from "node:test";
import YAML from "yaml";
import { validateCi } from "../../tools/docs/ci.mjs";
import { github, gitlab, offline, changedGitLab } from "./fixtures.mjs";

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
