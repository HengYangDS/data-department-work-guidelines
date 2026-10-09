import assert from "node:assert/strict";
import childProcess, { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { validateChangelog } from "../../tools/docs/changelog.mjs";
import {
  source,
  preparedSource,
  git,
  commit,
  fixture,
  validateReleaseEnvironment,
} from "./fixtures.mjs";

test("offline dispatch tag activates release validation from a branch", () => {
  fixture((directory, base) => {
    const validate = () =>
      validateReleaseEnvironment(directory, {
        DDWG_RELEASE_TAG: "v4.0.0",
        GITHUB_REF_TYPE: "branch",
        GITHUB_REF_NAME: "main",
      });
    const changelog = path.join(directory, "CHANGELOG.md");
    const release =
      "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n";
    const prepared = preparedSource(base, release);
    writeFileSync(changelog, prepared);
    assert.throws(
      validate,
      /selected release tag disagrees with VERSION or changelog/u,
    );
    commit(directory, "prepare dispatch release");
    git(directory, "tag", "v4.0.0");
    assert.throws(validate, /release tag must be annotated/u);
    git(directory, "tag", "-d", "v4.0.0");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.equal(validate().tagCount, 1);
    writeFileSync(changelog, source(base, release, "v4.0.0", "v4.0.0"));
    assert.throws(validate, /Unreleased changes/u);
    writeFileSync(changelog, prepared);
    writeFileSync(path.join(directory, "later"), "later\n");
    commit(directory, "later dispatch source");
    assert.throws(validate, /selected release tag does not identify HEAD/u);
  });
});

test("release environment selectors agree across dispatch and native tags", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      preparedSource(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
      ),
    );
    commit(directory, "prepare selected release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    for (const selection of [
      { DDWG_RELEASE_TAG: "v4.0.0" },
      { GITHUB_REF_TYPE: "tag", GITHUB_REF_NAME: "v4.0.0" },
      { CI_COMMIT_TAG: "v4.0.0" },
      {
        DDWG_RELEASE_TAG: "v4.0.0",
        GITHUB_REF_TYPE: "tag",
        GITHUB_REF_NAME: "v4.0.0",
        CI_COMMIT_TAG: "v4.0.0",
      },
    ]) {
      assert.equal(
        validateReleaseEnvironment(directory, selection).tagCount,
        1,
      );
    }
    for (const selection of [
      {
        DDWG_RELEASE_TAG: "v4.0.0",
        GITHUB_REF_TYPE: "tag",
        GITHUB_REF_NAME: "v4.0.1",
      },
      { DDWG_RELEASE_TAG: "v4.0.0", CI_COMMIT_TAG: "v4.0.1" },
      {
        GITHUB_REF_TYPE: "tag",
        GITHUB_REF_NAME: "v4.0.0",
        CI_COMMIT_TAG: "v4.0.1",
      },
    ]) {
      assert.throws(
        () => validateReleaseEnvironment(directory, selection),
        /Forge release tag environments disagree/u,
      );
    }
  });
});

test("offline release input refuses branches and nonrelease references", () => {
  fixture((directory) => {
    for (const tag of ["main", "docs/snapshot", "4.0.0", "v4.0.1"]) {
      assert.throws(
        () =>
          validateReleaseEnvironment(directory, {
            DDWG_RELEASE_TAG: tag,
            GITHUB_REF_TYPE: "branch",
            GITHUB_REF_NAME: "main",
          }),
        /selected release tag disagrees with VERSION or changelog/u,
      );
    }
    assert.equal(
      validateReleaseEnvironment(directory, {
        GITHUB_REF_TYPE: "branch",
        GITHUB_REF_NAME: "main",
      }).version,
      "4.0.0",
    );
  });
});

test("release tag inventory rejects nested non-SemVer names", () => {
  fixture((directory) => {
    git(
      directory,
      "tag",
      "-a",
      "v4.0.0/not-a-version",
      "-m",
      "invalid release",
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /strict SemVer/u,
    );
  });
});

test("native tag inventory ignores non-release tag namespaces", () => {
  fixture((directory) => {
    git(directory, "tag", "docs/snapshot");
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).tagCount,
      0,
    );
  });
});

test("native tag inventory verifies every tag in one Git observation", () => {
  fixture((directory, base) => {
    writeFileSync(path.join(directory, "VERSION"), "4.0.1\n");
    writeFileSync(
      path.join(directory, "docs", "charter.md"),
      "> **Guideline edition:** v4.0.1\n",
    );
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      source(
        base,
        "## 4.0.1 - 2026-09-26\n\n### Fixed\n\n- Correct a boundary.\n\n" +
          "## 4.0.0 - 2026-09-25\n\n### Added\n\n- First release.\n\n",
        "v4.0.1",
        "v4.0.1",
      ),
    );
    commit(directory, "prepare releases");
    for (const version of ["4.0.0", "4.0.1"])
      git(directory, "tag", "-a", `v${version}`, "-m", "fixture release");
    git(directory, "tag", "docs/snapshot");
    const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import { syncBuiltinESMExports } from "node:module";
    const original = childProcess.spawnSync;
    const inventory = [];
    const resolutions = [];
    childProcess.spawnSync = (command, args, options) => {
      if (args?.[0] === "tag" || args?.[0] === "for-each-ref")
        inventory.push(args);
      if (args?.[0] === "rev-parse" || args?.[0] === "cat-file")
        resolutions.push({ args, options });
      return original(command, args, options);
    };
    syncBuiltinESMExports();
    const { validateChangelog } = await import(${JSON.stringify(new URL("../../tools/docs/changelog.mjs", import.meta.url).href)});
    const result = validateChangelog({ repository: ${JSON.stringify(directory)}, selectedTag: "" });
    assert.equal(result.tagCount, 2);
    assert.equal(inventory.length, 1, JSON.stringify(inventory));
    assert.equal(inventory[0][0], "for-each-ref");
    assert.ok(inventory[0].includes("refs/tags"));
    assert.ok(inventory[0].some((argument) => argument.includes("%(objecttype)")));
    assert.equal(resolutions.length, 1);
    assert.deepEqual(resolutions[0].args, ["cat-file", "--batch-check=%(objectname) %(objecttype)"]);
    assert.equal(resolutions[0].options.cwd, ${JSON.stringify(directory)});
    assert.deepEqual(
      new Set(resolutions[0].options.input.split("\\n").filter(Boolean)),
      new Set([${JSON.stringify(`${base}^{commit}`)}, "v4.0.0^{commit}", "v4.0.1^{commit}", "HEAD"]),
    );
  `;
    const result = spawnSync(
      process.execPath,
      ["--input-type=module", "--eval", script],
      {
        cwd: directory,
        encoding: "utf8",
        input: "",
        timeout: 30_000,
      },
    );
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
  });
});

test("native history resolution requires complete commit observations", (context) => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const valid = source(base);
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).version,
      "4.0.0",
    );
    const nativeSpawn = childProcess.spawnSync;
    let truncate = false;
    const observation = context.mock.method(
      childProcess,
      "spawnSync",
      (command, args, options) => {
        const result = nativeSpawn(command, args, options);
        if (truncate && command === "git" && args[0] === "cat-file") {
          assert.equal(result.status, 0, result.stderr);
          return { ...result, stdout: result.stdout.slice(0, -1) };
        }
        return result;
      },
    );
    syncBuiltinESMExports();
    try {
      truncate = true;
      assert.throws(
        () => validateChangelog({ repository: directory, selectedTag: "" }),
        /native history reference report is incomplete/u,
      );
      truncate = false;
      writeFileSync(changelog, source("f".repeat(40)));
      assert.throws(
        () => validateChangelog({ repository: directory, selectedTag: "" }),
        /native history reference is not a commit/u,
      );
      const blob = git(directory, "rev-parse", "HEAD:VERSION");
      writeFileSync(changelog, source(blob));
      assert.throws(
        () => validateChangelog({ repository: directory, selectedTag: "" }),
        /not a commit|warning output/u,
      );
      writeFileSync(changelog, valid);
      assert.equal(
        validateChangelog({ repository: directory, selectedTag: "" }).version,
        "4.0.0",
      );
    } finally {
      observation.mock.restore();
      syncBuiltinESMExports();
    }
  });
});
