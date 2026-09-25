import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  parseChangelog,
  strictVersion,
  validateChangelog,
} from "../tools/docs/changelog.mjs";

const intro = [
  "# Changelog",
  "",
  "All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and",
  "[Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
  "",
].join("\n");

function source(
  base,
  releases = "",
  releaseTarget = "main",
  unreleasedBase = base,
) {
  return `${intro}## [Unreleased]\n\n### Changed\n\n- Describe a real change.\n\n${releases}[Unreleased]: https://example.invalid/compare/${unreleasedBase}...main\n${releases ? `[4.0.0]: https://example.invalid/compare/${base}...${releaseTarget}\n` : ""}`;
}

function preparedSource(base, releases, releaseTarget = "v4.0.0") {
  return source(base, releases, releaseTarget, "v4.0.0").replace(
    "### Changed\n\n- Describe a real change.\n\n",
    "",
  );
}

function git(directory, ...args) {
  const hooks = path.join(directory, "empty-hooks");
  mkdirSync(hooks, { recursive: true });
  const result = spawnSync(
    "git",
    [
      "-C",
      directory,
      "-c",
      `core.hooksPath=${hooks}`,
      "-c",
      "tag.gpgSign=false",
      ...args,
    ],
    {
      encoding: "utf8",
      timeout: 15_000,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "Release Fixture",
        GIT_AUTHOR_EMAIL: "release@example.invalid",
        GIT_COMMITTER_NAME: "Release Fixture",
        GIT_COMMITTER_EMAIL: "release@example.invalid",
      },
    },
  );
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function commit(directory, message) {
  git(directory, "add", ".");
  git(
    directory,
    "-c",
    "commit.gpgsign=false",
    "commit",
    "--allow-empty",
    "-qm",
    message,
  );
}

function fixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-changelog-test-"));
  try {
    git(directory, "init", "-q", "-b", "main");
    commit(directory, "base");
    const base = git(directory, "rev-parse", "HEAD");
    mkdirSync(path.join(directory, "docs"));
    writeFileSync(path.join(directory, "VERSION"), "4.0.0\n");
    writeFileSync(
      path.join(directory, "docs", "charter.md"),
      "> **Guideline edition:** v4.0.0\n",
    );
    writeFileSync(
      path.join(directory, "package.json"),
      '{"name":"fixture","private":true}\n',
    );
    writeFileSync(
      path.join(directory, "package-lock.json"),
      '{"name":"fixture","lockfileVersion":3,"packages":{"":{}}}\n',
    );
    writeFileSync(path.join(directory, "CHANGELOG.md"), source(base));
    commit(directory, "pending version");
    return run(directory, base);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

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
    valid.replace("## [Unreleased]", "## Future"),
    valid.replace("### Changed", "### Quality"),
    valid.replace("### Changed", "### Changed\n\n### Changed"),
    valid.replace("- Describe a real change.", ""),
    valid.replace("[Unreleased]:", "[Current]:"),
  ]) {
    assert.throws(() => parseChangelog(changed));
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
    "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- A change.\n\n",
  );
  assert.equal(parseChangelog(released).sections[1].version, "4.0.0");
  for (const changed of [
    released.replace("2026-09-25", "2026-02-30"),
    released.replace("[4.0.0]", "[04.0.0]"),
    released.replace("## [4.0.0] - 2026-09-25", "## [4.0.0] — 2026-09-25"),
    released.replace(
      "## [4.0.0] - 2026-09-25",
      "## [3.0.0] - 2026-09-25\n\n### Fixed\n\n- Old.\n\n## [4.0.0] - 2026-09-24",
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
        "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n",
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
        "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n## [3.0.0] - 2026-09-24\n\n### Fixed\n\n- Fictitious older release.\n\n",
      ) + `[3.0.0]: https://example.invalid/compare/${base}...main\n`,
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /untagged historical release/u,
    );
  });
});

test("a prepared release has one comparison source before and after tagging", () => {
  fixture((directory, base) => {
    const changelog = path.join(directory, "CHANGELOG.md");
    const prepared = preparedSource(
      base,
      "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n",
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
      "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Prepared change.\n\n";
    for (const [changed, expected] of [
      [source(base, release, "v4.0.0", "v4.0.0"), /Unreleased changes/u],
      [
        preparedSource(base, release).replace(
          "/compare/v4.0.0...main",
          `/compare/${base}...main`,
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
        "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
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
        "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
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

test("Unreleased comparison begins at the latest versioned release", () => {
  fixture((directory, base) => {
    writeFileSync(
      path.join(directory, "CHANGELOG.md"),
      source(
        base,
        "## [4.0.0] - 2026-09-25\n\n### Changed\n\n- Released change.\n\n",
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
      /comparison base is not an ancestor: Unreleased/u,
    );

    writeFileSync(
      changelog,
      preparedSource(
        sideBase,
        "## [4.0.0] - 2026-09-25\n\n### Fixed\n\n- Repair a link.\n\n",
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
