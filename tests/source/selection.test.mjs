import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import fs from "node:fs";
import {
  existsSync,
  mkdtempDisposableSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import {
  currentMarkdown,
  gitFiles,
  root,
  sourceAttributes,
  sourceMarkdown,
} from "../../tools/runtime.mjs";
import { fixtureGit } from "./fixtures.mjs";

test("shared Git excludes editor state without hiding guidance source", () => {
  using workspace = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-shared-ignore-"));
  const directory = path.join(workspace.path, "repository");
  const home = path.join(workspace.path, "home");
  mkdirSync(directory);
  mkdirSync(home);
  const emptyConfig = path.join(home, "gitconfig");
  writeFileSync(emptyConfig, "");
  const environment = {
    ...process.env,
    HOME: home,
    USERPROFILE: home,
    XDG_CONFIG_HOME: home,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_SYSTEM: emptyConfig,
    GIT_CONFIG_GLOBAL: emptyConfig,
    GIT_CONFIG_COUNT: "0",
  };
  const git = (args) => fixtureGit(directory, args, { env: environment });
  git(["init", "--quiet"]);
  writeFileSync(path.join(directory, ".gitignore"), readFileSync(path.join(root, ".gitignore")));
  writeFileSync(path.join(directory, ".git/info/exclude"), "");
  const local = [".idea/workspace.xml", ".serena/cache/record.json", ".DS_Store", "docs/.DS_Store"];
  for (const name of [...local, "docs/decide.md"]) {
    mkdirSync(path.dirname(path.join(directory, name)), { recursive: true });
    writeFileSync(path.join(directory, name), "fixture\n");
  }
  git(["add", "--", ".gitignore", "docs/decide.md"]);
  const ignored = git(["check-ignore", "--verbose", "--", ...local])
    .trimEnd()
    .split("\n");
  assert.equal(ignored.length, local.length);
  for (const [index, line] of ignored.entries()) {
    assert.ok(line.startsWith(".gitignore:"), line);
    assert.ok(line.endsWith(`\t${local[index]}`), line);
  }
  assert.deepEqual(
    git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
      .split("\0")
      .filter(Boolean)
      .sort(),
    [".gitignore", "docs/decide.md"],
  );
});

test("fixture Git retains caller inputs and native failures", (context) => {
  const args = ["ls-files", "-z"];
  const environment = { PATH: process.env.PATH };
  let result = { status: 0, stdout: "one\0two\0", stderr: "" };
  const observation = context.mock.method(
    childProcess,
    "spawnSync",
    (command, selected, options) => {
      assert.equal(command, "git");
      assert.equal(selected, args);
      assert.deepEqual(options, {
        cwd: root,
        env: environment,
        encoding: "utf8",
        timeout: 10_000,
      });
      return result;
    },
  );
  syncBuiltinESMExports();
  try {
    assert.equal(fixtureGit(root, args, { env: environment }), result.stdout);
    result = {
      status: 128,
      stdout: "",
      stderr: "native fixture Git refusal\n",
    };
    assert.throws(
      () => fixtureGit(root, args, { env: environment }),
      (error) =>
        error.actual === 128 &&
        error.expected === 0 &&
        error.message.includes(result.stderr.trimEnd()),
    );
    const nativeError = Object.assign(new Error("native fixture spawn failed"), {
      code: "ENOENT",
    });
    result = { error: nativeError, status: null, stdout: "", stderr: "" };
    assert.throws(
      () => fixtureGit(root, args, { env: environment }),
      (error) => error.actual === nativeError,
    );
  } finally {
    observation.mock.restore();
    syncBuiltinESMExports();
  }
});

test("Git selection excludes worktree deletions and preserves native failure evidence", (context) => {
  mkdirSync(path.join(root, "build"), { recursive: true });
  const directory = mkdtempSync(path.join(root, "build", "ddwg-git-selection-"));
  const previousCeiling = process.env.GIT_CEILING_DIRECTORIES;
  try {
    process.env.GIT_CEILING_DIRECTORIES = fs.realpathSync.native(path.dirname(directory));
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    writeFileSync(path.join(directory, "README.md"), "# Source\n");
    writeFileSync(path.join(directory, "removed.md"), "# Removed\n");
    const indexed = spawnSync("git", ["add", "--", "README.md", "removed.md"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.ifError(indexed.error);
    assert.equal(indexed.status, 0, indexed.stderr);
    rmSync(path.join(directory, "removed.md"));
    writeFileSync(path.join(directory, "candidate.md"), "# Candidate\n");
    assert.deepEqual(gitFiles(directory), ["README.md", "candidate.md"]);
    rmSync(path.join(directory, ".git"), { recursive: true });
    let diagnostic = "";
    context.mock.method(process.stderr, "write", (chunk) => {
      diagnostic += chunk;
      return true;
    });
    const nativeSpawn = childProcess.spawnSync;
    let nativeResult;
    const observation = context.mock.method(childProcess, "spawnSync", (command, args, options) => {
      nativeResult = nativeSpawn(command, args, options);
      return nativeResult;
    });
    syncBuiltinESMExports();
    try {
      assert.throws(() => gitFiles(directory), /git.*exited/u);
      assert.equal(observation.mock.callCount(), 1);
      assert.ifError(nativeResult.error);
      assert.equal(nativeResult.status, 128);
      assert.equal(nativeResult.signal, null);
      assert.notEqual(nativeResult.stderr, "");
      assert.equal(diagnostic, nativeResult.stderr);
    } finally {
      observation.mock.restore();
      syncBuiltinESMExports();
    }
  } finally {
    if (previousCeiling === undefined) delete process.env.GIT_CEILING_DIRECTORIES;
    else process.env.GIT_CEILING_DIRECTORIES = previousCeiling;
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("current Markdown inventory excludes official archives, not live topics", () => {
  const files = [
    "README.md",
    "docs/decide.md",
    ".superpowers/source.md",
    ".worktrees/source.md",
    "build/source.md",
    "node_modules/source.md",
    "openspec/changes/archive/old/spec.md",
  ];
  assert.deepEqual(sourceMarkdown(files), files);
  assert.deepEqual(currentMarkdown(files), files.slice(0, -1));
});

test("native Git roles distinguish executable tests from their fixture support", () => {
  using workspace = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-test-roles-"));
  const directory = workspace.path;
  const git = (args) => fixtureGit(directory, args);
  git(["init", "--quiet"]);
  writeFileSync(
    path.join(directory, ".gitattributes"),
    readFileSync(path.join(root, ".gitattributes")),
  );
  const paths = [
    "tests/retained/contract.test.mjs",
    "tests/new domain/nested/behavior.test.mjs",
    "tests/new domain/nested/fixtures.mjs",
    "tools/runtime.mjs",
  ];
  const expected = ["test", "test", "tooling", "unspecified"];
  for (const relative of paths) {
    mkdirSync(path.dirname(path.join(directory, relative)), {
      recursive: true,
    });
    writeFileSync(path.join(directory, relative), "export {};\n");
  }
  git(["add", "--", ".gitattributes", paths[0]]);
  for (const source of [[], ["--cached"]]) {
    assert.deepEqual(
      git(["check-attr", "-z", ...source, "ethos-role", "--", ...paths])
        .split("\0")
        .slice(0, -1),
      paths.flatMap((relative, index) => [relative, "ethos-role", expected[index]]),
    );
  }
  const selected = git(["ls-files", "--cached", "--others", "--exclude-standard", "-z"])
    .split("\0")
    .filter((relative) => relative.endsWith(".test.mjs"))
    .sort();
  assert.deepEqual(selected, paths.slice(0, 2).sort());
});

test("native Git attributes bind complete ordered reports to selected paths", (context) => {
  const selected = ["README.md", "docs/with space.md"];
  const nativeSpawn = childProcess.spawnSync;
  const valid =
    selected.flatMap((file) => [file, "text", "auto", file, "eol", "lf"]).join("\0") + "\0";
  let report = valid;
  const observation = context.mock.method(childProcess, "spawnSync", (command, args, options) => {
    if (command === "git" && args[0] === "check-attr") {
      assert.deepEqual(args, ["check-attr", "--stdin", "-z", "text", "eol"]);
      assert.equal(options.cwd, root);
      assert.equal(options.input, `${selected.join("\0")}\0`);
      return { status: 0, stdout: report, stderr: "" };
    }
    return nativeSpawn(command, args, options);
  });
  syncBuiltinESMExports();
  try {
    assert.deepEqual(
      [...sourceAttributes(selected)],
      selected.map((file) => [file, { text: "auto", eol: "lf" }]),
    );
    for (const invalid of [
      valid.slice(0, -1),
      valid.slice(0, valid.indexOf(selected[1])),
      valid.replace("README.md", "docs/other.md"),
      valid.replace("\0text\0", "\0eol\0"),
    ]) {
      report = invalid;
      assert.throws(() => sourceAttributes(selected), /native Git text attribute/u);
    }
  } finally {
    observation.mock.restore();
    syncBuiltinESMExports();
  }
});
