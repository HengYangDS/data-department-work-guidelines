import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import {
  checkConfigPlacement,
  checkNavigation,
  checkPortableEntrypoints,
  checkProfile,
} from "../tools/docs/governance.mjs";
import { root } from "../tools/docs/runtime.mjs";

function fixture(run) {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-governance-test-"),
  );
  try {
    cpSync(path.join(root, "docs"), path.join(directory, "docs"), {
      recursive: true,
    });
    mkdirSync(path.join(directory, ".ethos"));
    cpSync(
      path.join(root, ".ethos", "profile.toml"),
      path.join(directory, ".ethos", "profile.toml"),
    );
    for (const name of ["README.md", "AGENTS.md"]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("profile rejects a third proof gate and an old shell entrypoint", () => {
  fixture((directory) => {
    checkProfile(directory);
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace(
        'code_correctness_gates = ["docs-integrity", "markdown-format"]',
        'code_correctness_gates = ["docs-integrity", "markdown-format", "governance-lifecycle"]',
      ),
    );
    assert.throws(() => checkProfile(directory), /proof floor/u);
    writeFileSync(
      file,
      original.replace(
        'command = ["node", "tools/docs/cli.mjs", "check"]',
        'command = ["bash", "scripts/validate-docs.sh"]',
      ),
    );
    assert.throws(
      () => checkProfile(directory),
      /portable repository entrypoint/u,
    );
  });
});

test("profile rejects material patterns for retired repository roots", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace('  "tools/**",', '  "scripts/**",\n  "tools/**",'),
    );
    assert.throws(() => checkProfile(directory), /retired material roots/u);
  });
});

test("navigation rejects a missing map, repeated root topic, and missing reader cue", () => {
  fixture((directory) => {
    checkNavigation(directory);
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    writeFileSync(
      entry,
      original.replace("(docs/README.md)", "(docs/missing.md)"),
    );
    assert.throws(() => checkNavigation(directory), /missing task routes/u);
    writeFileSync(entry, `${original}\n[Duplicate](docs/charter.md)\n`);
    assert.throws(() => checkNavigation(directory), /repeats topic routes/u);
    writeFileSync(entry, original);
    const topic = path.join(directory, "docs", "decide.md");
    writeFileSync(
      topic,
      readFileSync(topic, "utf8").replace("**When to use:**", "**Read this:**"),
    );
    assert.throws(() => checkNavigation(directory), /missing reader entry/u);
  });
});

test("portable entrypoints reject revived shell wrappers or tracked hooks", () => {
  assert.doesNotThrow(() =>
    checkPortableEntrypoints(["tools/docs/cli.mjs", "docs/README.md"]),
  );
  for (const file of [
    "scripts/validate-docs.sh",
    ".githooks/pre-push",
    "tools/ci/scripts/wrapper",
    "tests/legacy.sh",
  ]) {
    assert.throws(
      () => checkPortableEntrypoints(["tools/docs/cli.mjs", file]),
      /obsolete shell or hook carriers/u,
    );
  }
});

test("native commit policy rejects unscoped or vague subjects", () => {
  const workspace = parseToml(
    readFileSync(path.join(root, ".ethos/workspace.toml"), "utf8"),
  );
  assert.equal(workspace.commit_policy.signing_required, true);
  const subject = new RegExp(workspace.commit_policy.subject_pattern);
  for (const valid of [
    "fix(quality): bind fixture identity to its own repository",
    "docs(guidance)!: restore risk-scaled work rules",
    "chore(openspec): archive completed change",
  ]) {
    assert.equal(subject.test(valid), true, valid);
  }
  for (const invalid of [
    "update docs",
    "docs: change everything",
    "WIP",
    "fix(quality): ",
    "fix(quality): vague. ",
  ]) {
    assert.equal(subject.test(invalid), false, invalid);
  }
});

test("tool configuration cannot drift back to redundant root files", () => {
  const current = [
    ".config/tools/markdownlint-cli2.yaml",
    ".config/tools/mermaid-hosted.json",
    ".config/tools/mermaid-local.json",
    ".config/tools/lychee.json",
    ".config/tools/cspell.json",
  ];
  assert.doesNotThrow(() => checkConfigPlacement(current));
  for (const old of [
    ".markdownlint-cli2.yaml",
    ".prettierignore",
    "tools/ci/config/mermaid-puppeteer-hosted.json",
  ]) {
    assert.throws(
      () => checkConfigPlacement([...current, old]),
      /redundant tool configuration/u,
    );
  }
});
