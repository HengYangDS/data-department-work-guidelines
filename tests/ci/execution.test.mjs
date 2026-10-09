import assert from "node:assert/strict";
import { test } from "node:test";
import YAML from "yaml";
import { validateCi } from "../../tools/docs/ci.mjs";
import { github, gitlab, offline, changedGitLab } from "./fixtures.mjs";

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
