import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  strictVersion,
  validateChangelog,
} from "../../tools/docs/changelog.mjs";
import {
  parseChangelog,
  source,
  preparedSource,
  git,
  commit,
  fixture,
} from "./fixtures.mjs";

test("strict SemVer admits build metadata, not coercions or invalid identifiers", () => {
  for (const version of [
    "4.0.0",
    "4.0.0-rc.1",
    "4.0.0+build.1",
    "4.0.0-rc.1+build.2",
  ]) {
    assert.equal(strictVersion(version), version);
  }
  for (const version of ["v4.0.0", "04.0.0", "4.0", "4.0.0-01", "4.0.0+"]) {
    assert.throws(() => strictVersion(version), /strict SemVer/u);
  }
});

test("Keep a Changelog grammar rejects custom headings and categories", () => {
  const valid = source("a".repeat(40));
  assert.equal(parseChangelog(valid).sections[0].label, "Unreleased");
  for (const changed of [
    valid.replace("## Unreleased", "## Future"),
    valid.replace("### Changed", "### Quality"),
    valid.replace("### Changed", "### Changed\n\n### Changed"),
    valid.replace("- Describe a real change.", ""),
    valid.replace("[Unreleased-gitlab]:", "[Current-gitlab]:"),
  ]) {
    assert.throws(() => parseChangelog(changed));
  }
});

test("official yanked headings and category orderings are valid", () => {
  const base = "a".repeat(40);
  const released = source(
    base,
    "## 4.0.0 - 2026-09-25 [YANKED]\n\n### Added\n\n- Add a feature.\n\n### Fixed\n\n- Repair a bug.\n\n### Changed\n\n- Change a behavior.\n\n",
  );
  assert.deepEqual(
    [...parseChangelog(released).sections[1].categories.keys()],
    ["Added", "Fixed", "Changed"],
  );
  for (const invalid of [
    released.replace("[YANKED]", "[RETRACTED]"),
    released.replace("[YANKED]", "[yanked]"),
    released.replace(
      "### Changed\n\n- Change a behavior.",
      "### Fixed\n\n- Change a behavior.",
    ),
    released.replace(
      "### Changed\n\n- Change a behavior.",
      "### Quality\n\n- Change a behavior.",
    ),
  ]) {
    assert.throws(() => parseChangelog(invalid));
  }
});

test("strict SemVer prerelease and build identifiers remain valid in headings", () => {
  const base = "a".repeat(40);
  for (const version of ["4.0.0-alpha.1", "4.0.0+build.1"]) {
    const released = source(
      base,
      `## ${version} - 2026-09-25\n\n### Fixed\n\n- Repair a bug.\n\n`,
      `v${version}`,
    );
    assert.equal(parseChangelog(released).sections[1].version, version);
  }
});

test("a release section cannot hide uncategorized prose", () => {
  const valid = source("a".repeat(40));
  assert.throws(
    () =>
      parseChangelog(
        valid.replace(
          "### Changed\n\n- Describe a real change.",
          "### Changed\n\nUncategorized status.\n\n- Describe a real change.",
        ),
      ),
    /uncategorized changelog content/u,
  );
});

test("release headings require strict versions, real dates, and descending order", () => {
  const base = "a".repeat(40);
  const released = source(
    base,
    "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- A change.\n\n",
  );
  assert.equal(parseChangelog(released).sections[1].version, "4.0.0");
  for (const changed of [
    released.replace("2026-09-25", "2026-02-30"),
    released.replace("## 4.0.0", "## 04.0.0"),
    released.replace("## 4.0.0 - 2026-09-25", "## 4.0.0 — 2026-09-25"),
    released.replace(
      "## 4.0.0 - 2026-09-25",
      "## 3.0.0 - 2026-09-25\n\n### Fixed\n\n- Old.\n\n## 4.0.0 - 2026-09-24",
    ),
  ]) {
    assert.throws(() => parseChangelog(changed));
  }
});

test("VERSION, charter, and private npm metadata have one owner", () => {
  fixture((directory) => {
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).version,
      "4.0.0",
    );
    const charter = path.join(directory, "docs", "charter.md");
    writeFileSync(charter, "> **Guideline edition:** v3.0.0\n");
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /charter edition/u,
    );
    writeFileSync(charter, "> **Guideline edition:** v4.0.0\n");
    const manifest = path.join(directory, "package.json");
    writeFileSync(
      manifest,
      '{"name":"fixture","version":"4.0.0","private":true}\n',
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /second guideline version/u,
    );
  });
});

test("only the current version may be a prepared untagged release", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    writeFileSync(
      changelog,
      preparedSource(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n",
      ),
    );
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).pending,
      "4.0.0",
    );
    writeFileSync(
      changelog,
      preparedSource(
        base,
        "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n## 3.0.0 - 2026-09-24\n\n### Fixed\n\n- Fictitious older release.\n\n",
      ),
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /untagged historical release/u,
    );
  });
});

test("the next edition can keep its notes in Unreleased until the release cut", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const release =
      "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Released change.\n\n";
    writeFileSync(changelog, preparedSource(base, release));
    commit(directory, "cut released edition");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");

    writeFileSync(path.join(directory, "VERSION"), "4.1.0\n");
    writeFileSync(
      path.join(directory, "docs", "charter.md"),
      "> **Guideline edition:** v4.1.0\n",
    );
    writeFileSync(changelog, source(base, release, "v4.0.0", "v4.0.0"));
    commit(directory, "prepare next edition without a release date");

    const result = validateChangelog({
      repository: directory,
      selectedTag: "",
    });
    assert.equal(result.version, "4.1.0");
    assert.equal(result.pending, "");
    assert.equal(result.tagCount, 1);
  });
});

test("a prepared release has one comparison source before and after tagging", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const prepared = preparedSource(
      base,
      "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n",
    );
    writeFileSync(changelog, prepared);
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).pending,
      "4.0.0",
    );
    commit(directory, "prepare release");
    git(directory, "tag", "-a", "v4.0.0", "-m", "fixture release");
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "v4.0.0" })
        .tagCount,
      1,
    );
  });
});

test("prepared release links and Unreleased content cannot hide a post-tag failure", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const release =
      "## 4.0.0 - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n";
    for (const [changed, expected] of [
      [source(base, release, "v4.0.0", "v4.0.0"), /Unreleased changes/u],
      [
        preparedSource(base, release).replaceAll(
          "v4.0.0...main",
          `${base}...main`,
        ),
        /Unreleased comparison must start at v4\.0\.0/u,
      ],
      [
        preparedSource(base, release, "main"),
        /release comparison must end at v4\.0\.0/u,
      ],
    ]) {
      writeFileSync(changelog, changed);
      assert.throws(
        () => validateChangelog({ repository: directory, selectedTag: "" }),
        expected,
      );
    }
  });
});
