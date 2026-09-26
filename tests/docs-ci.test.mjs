import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCi } from "../tools/docs/ci.mjs";
import { readText } from "../tools/docs/runtime.mjs";

const github = readText(".github/workflows/docs-verify.yml");
const gitlab = readText(".gitlab-ci.yml");
const offline = readText(".github/workflows/offline-verify.yml");

test("both providers invoke one verifier on declared hosts", () => {
  const result = validateCi(github, gitlab);
  assert.equal(result.verifier, "npm run verify");
  assert.equal(result.audit, "npm audit --audit-level=moderate");
  assert.deepEqual(result.hosts, [
    "ubuntu-latest",
    "macos-latest",
    "windows-latest",
  ]);
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
    /image: (node:22-bookworm@sha256:[0-9a-f]{64})/u,
  )?.[1];
  assert.ok(image, "GitLab Node image is not digest-pinned");
  assert.equal(gitlab.split(`image: ${image}`).length - 1, 2);
  assert.throws(
    () =>
      validateCi(github, gitlab.replace(image, "node:22-bookworm"), offline),
    /digest-pinned/u,
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
  assert.equal(result.gitlabOfflineHost, "ci-linux-arm64-docker");
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
