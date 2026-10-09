import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { validateChangelog } from "../../tools/docs/changelog.mjs";
import {
  intro,
  historyRow,
  historyDefinitions,
  source,
  preparedSource,
  firstReleaseTagSource,
  git,
  commit,
  fixture,
} from "./fixtures.mjs";

test("release comparisons cannot skip their immediate predecessor", () => {
  fixture((directory, base) => {
    writeFileSync(path.join(directory, "VERSION"), "4.0.1\n");
    writeFileSync(
      path.join(directory, "docs/charter.md"),
      "> **Guideline edition:** v4.0.1\n",
    );
    const releases =
      "## 4.0.1 - 2026-09-26\n\n### Fixed\n\n- Correct the boundary.\n\n## 4.0.0 - 2026-09-25\n\n### Added\n\n- First release.\n\n";
    const corrected = source(base, releases, "v4.0.1", "v4.0.1");
    const skipped = corrected.replaceAll("v4.0.0...v4.0.1", `${base}...v4.0.1`);
    writeFileSync(path.join(directory, "CHANGELOG.md"), skipped);
    commit(directory, "prepare two releases");
    for (const version of ["4.0.0", "4.0.1"])
      git(directory, "tag", "-a", `v${version}`, "-m", "fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /comparison must start at previous release v4\.0\.0/u,
    );
    writeFileSync(path.join(directory, "CHANGELOG.md"), corrected);
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" })
        .releaseCount,
      2,
    );
  });
});

test("selected release validation refuses source that differs from its committed tag", () => {
  fixture((directory, base) => {
    const file = path.join(directory, "CHANGELOG.md");
    const released = firstReleaseTagSource(base);
    writeFileSync(file, released);
    commit(directory, "prepare clean release source");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "v4.0.0" })
        .tagCount,
      1,
    );
    for (const relative of [
      "CHANGELOG.md",
      "VERSION",
      "docs/charter.md",
      "package.json",
      "package-lock.json",
      ".ethos/release.toml",
    ]) {
      const target = path.join(directory, relative);
      const original = readFileSync(target);
      writeFileSync(target, Buffer.concat([original, Buffer.from("\n")]));
      assert.throws(
        () =>
          validateChangelog({ repository: directory, selectedTag: "v4.0.0" }),
        (error) =>
          error.message ===
          `selected release source differs from HEAD: ${relative}`,
      );
      writeFileSync(target, original);
    }
    writeFileSync(
      file,
      released.replace("First release.", "Uncommitted rewritten release."),
    );
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).tagCount,
      1,
    );
  });
});

test("direct oldest release links must resolve an annotated commit tag", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      firstReleaseTagSource(base),
    );
    commit(directory, "prepare direct oldest release");
    git(
      directory,
      "tag",
      "-a",
      "v4.0.0",
      "HEAD^{tree}",
      "-m",
      "non-commit fixture tag",
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /expected commit type|native history reference is not a commit/u,
    );
  });
});

test("release tags must be annotated and covered by the changelog", () => {
  fixture((directory, base) => {
    git(directory, "tag", "v4.0.0");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /annotated/u,
    );
    git(directory, "tag", "-d", "v4.0.0");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /missing changelog section/u,
    );
    git(directory, "tag", "-d", "v4.0.0");
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      preparedSource(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
      ),
    );
    commit(directory, "prepare release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "v4.0.0" })
        .tagCount,
      1,
    );
    writeFileSync(path.join(directory, "later"), "later\n");
    commit(directory, "later source");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "v4.0.0" }),
      /does not identify HEAD/u,
    );
  });
});

test("tagged release links identify the tag, not a moving branch", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      preparedSource(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
        "main",
      ),
    );
    commit(directory, "prepare release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "v4.0.0" }),
      /release comparison must end at v4\.0\.0/u,
    );
  });
});

test("the oldest annotated release may link directly to its exact tag", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const valid = firstReleaseTagSource(base);
    writeFileSync(changelog, valid);
    commit(directory, "prepare first release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "v4.0.0" })
        .tagCount,
      1,
    );

    writeFileSync(
      changelog,
      valid.replace(
        historyDefinitions("4.0.0", "", "v4.0.0", true),
        historyDefinitions("4.0.0", "", "v3.0.0", true),
      ),
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /tag link must identify v4\.0\.0/u,
    );

    writeFileSync(
      changelog,
      valid.replace(
        historyDefinitions("4.0.0", "", "v4.0.0", true),
        historyDefinitions("4.0.0", "side", "side/releases/tag/v4.0.0"),
      ),
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /release comparison must end at v4\.0\.0/u,
    );
  });
});

test("an untagged prepared release cannot use the direct-tag exception", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      firstReleaseTagSource(base),
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /direct tag link requires an annotated local tag/u,
    );
  });
});

test("later tagged releases cannot use the first-release link exception", () => {
  fixture((directory) => {
    git(directory, "tag", "-a", "v3.0.0", "-m", "older fixture release");
    const changelog = [
      intro,
      "## Unreleased",
      "",
      historyRow("Unreleased"),
      "",
      "## 4.0.0 - 2026-09-25",
      "",
      historyRow("4.0.0"),
      "",
      "### Fixed",
      "",
      "- Fix the current version.",
      "",
      "## 3.0.0 - 2026-09-24",
      "",
      historyRow("3.0.0"),
      "",
      "### Added",
      "",
      "- Add the first version.",
      "",
      historyDefinitions("Unreleased", "v4.0.0", "main"),
      historyDefinitions("4.0.0", "", "v4.0.0", true),
      historyDefinitions("3.0.0", "", "v3.0.0", true),
      "",
    ].join("\n");
    writeFileSync(path.join(directory, "CHANGELOG.md"), changelog);
    commit(directory, "prepare later release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "current fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /direct tag link is only valid for the oldest release/u,
    );
  });
});

test("Unreleased comparison begins at the latest versioned release", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      source(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
        "v4.0.0",
      ),
    );
    commit(directory, "prepare release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /Unreleased comparison must start at v4\.0\.0/u,
    );
  });
});

test("comparison bases must belong to the published ancestry", () => {
  fixture((directory, base) => {
    git(directory, "checkout", "-q", "-b", "side-history", base);
    commit(directory, "unpublished side history");
    const sideBase = git(directory, "rev-parse", "HEAD");
    git(directory, "checkout", "-q", "main");

    const changelog = path.join(directory, "CHANGELOG.md");
    writeFileSync(changelog, source(sideBase));
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      (error) => {
        assert.match(
          error.message,
          /comparison base is not an ancestor: Unreleased/u,
        );
        assert.equal(error.cause?.message, "git exited 1");
        return true;
      },
    );

    writeFileSync(
      changelog,
      preparedSource(
        sideBase,
        "## 4.0.0 - 2026-09-25\n\n### Fixed\n\n- Repair a link.\n\n",
      ),
    );
    commit(directory, "prepare release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "v4.0.0" }),
      /comparison base is not an ancestor: 4\.0\.0/u,
    );
  });
});
