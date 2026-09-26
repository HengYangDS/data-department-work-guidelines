import assert from "node:assert/strict";
import { test } from "node:test";
import { validateCi } from "../tools/docs/ci.mjs";
import { readText } from "../tools/docs/runtime.mjs";

const github = readText(".github/workflows/docs-verify.yml");
const gitlab = readText(".gitlab-ci.yml");

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
