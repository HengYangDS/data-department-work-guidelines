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
import { fileURLToPath } from "node:url";
import {
  parseChangelog as parseChangelogSource,
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

const peers = [
  {
    id: "gitlab",
    provider: "gitlab",
    forge_repository: "http://gitlab.example.invalid/group/project",
  },
  {
    id: "github",
    provider: "github",
    forge_repository: "https://github.example.invalid/owner/project",
  },
];

function parseChangelog(source) {
  return parseChangelogSource(source, { peers });
}

function historyRow(label) {
  return `History: [GitLab][${label}-gitlab] · [GitHub][${label}-github]`;
}

function historyDefinitions(label, base, target, directTag = false) {
  return peers
    .map((peer) => {
      const route =
        peer.provider === "gitlab"
          ? directTag
            ? "/-/tags/"
            : "/-/compare/"
          : directTag
            ? "/releases/tag/"
            : "/compare/";
      const refs = directTag ? target : `${base}...${target}`;
      return `[${label}-${peer.provider}]: ${peer.forge_repository}${route}${refs}`;
    })
    .join("\n");
}

function source(
  base,
  releases = "",
  releaseTarget = "main",
  unreleasedBase = base,
) {
  const labels = [...releases.matchAll(/^## (\S+)/gmu)].map(
    (match) => match[1],
  );
  const decorated = releases.replace(
    /^## (\S+)(.*)$/gmu,
    (_, label, suffix) => `## ${label}${suffix}\n\n${historyRow(label)}`,
  );
  const definitions = [
    historyDefinitions("Unreleased", unreleasedBase, "main"),
    ...labels.map((label, index) =>
      historyDefinitions(
        label,
        base,
        index === 0 ? releaseTarget : `v${label}`,
      ),
    ),
  ].join("\n");
  return `${intro}## Unreleased\n\n${historyRow("Unreleased")}\n\n### Changed\n\n- Describe a real change.\n\n${decorated}${definitions}\n`;
}

function preparedSource(base, releases, releaseTarget = "v4.0.0") {
  return source(base, releases, releaseTarget, "v4.0.0").replace(
    "### Changed\n\n- Describe a real change.\n\n",
    "",
  );
}

function firstReleaseTagSource(base) {
  return preparedSource(
    base,
    "## 4.0.0 - 2026-09-25\n\n### Added\n\n- First release.\n\n",
  ).replace(
    historyDefinitions("4.0.0", base, "v4.0.0"),
    historyDefinitions("4.0.0", "", "v4.0.0", true),
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
    mkdirSync(path.join(directory, ".ethos"));
    writeFileSync(
      path.join(directory, ".ethos", "release.toml"),
      peers
        .map(
          (peer) =>
            `[[publication.peers]]\nid = "${peer.id}"\nprovider = "${peer.provider}"\nforge_repository = "${peer.forge_repository}"\n`,
        )
        .join("\n"),
    );
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
  const script = `
    import assert from "node:assert/strict";
    import childProcess from "node:child_process";
    import { syncBuiltinESMExports } from "node:module";
    const original = childProcess.spawnSync;
    const inventory = [];
    childProcess.spawnSync = (command, args, options) => {
      if (args?.[0] === "tag" || args?.[0] === "for-each-ref" || args?.[0] === "cat-file")
        inventory.push(args);
      return original(command, args, options);
    };
    syncBuiltinESMExports();
    const { validateChangelog } = await import(${JSON.stringify(new URL("../tools/docs/changelog.mjs", import.meta.url).href)});
    validateChangelog({ selectedTag: "" });
    assert.equal(inventory.length, 1, JSON.stringify(inventory));
    assert.equal(inventory[0][0], "for-each-ref");
    assert.ok(inventory[0].includes("refs/tags"));
    assert.ok(inventory[0].some((argument) => argument.includes("%(objecttype)")));
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
      encoding: "utf8",
      input: "",
      timeout: 30_000,
    },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
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
  fixture((directory, base) => {
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
      /comparison base is not an ancestor: Unreleased/u,
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

test("one neutral changelog exposes native history for both declared peers", () => {
  const valid = source("a".repeat(40));
  assert.equal(parseChangelog(valid).links.size, 1);
  assert.match(valid, /^## Unreleased$/mu);
  assert.match(
    valid,
    /History: \[GitLab\]\[Unreleased-gitlab\] · \[GitHub\]\[Unreleased-github\]/u,
  );
  assert.match(
    valid,
    /http:\/\/gitlab\.example\.invalid\/group\/project\/-\/compare\//u,
  );
  assert.match(
    valid,
    /https:\/\/github\.example\.invalid\/owner\/project\/compare\//u,
  );
});

test("single-peer, hidden, mislabeled, and unused history navigation is rejected", () => {
  const valid = source("a".repeat(40));
  for (const changed of [
    valid.replace(
      historyRow("Unreleased"),
      "History: [GitHub][Unreleased-github]",
    ),
    valid.replace(
      historyRow("Unreleased"),
      "History: [GitLab][Unreleased-github] · [GitHub][Unreleased-gitlab]",
    ),
    valid.replace(
      historyRow("Unreleased"),
      "History: [Source][Unreleased-gitlab] · [Mirror][Unreleased-github]",
    ),
    valid.replace(historyRow("Unreleased"), ""),
    valid.replace("## Unreleased", "## [Unreleased]"),
    valid.replace(/^\[Unreleased-gitlab\]:[^\n]*\n/mu, ""),
    valid + historyDefinitions("Ghost", "a".repeat(40), "main") + "\n",
    valid + historyDefinitions("Unreleased", "a".repeat(40), "main") + "\n",
  ]) {
    assert.throws(() => parseChangelog(changed));
  }
});

test("peer history binds the exact declared scheme, host, repository, and route", () => {
  const valid = source("a".repeat(40));
  for (const changed of [
    valid.replace(
      "http://gitlab.example.invalid",
      "https://gitlab.example.invalid",
    ),
    valid.replace(
      "http://gitlab.example.invalid",
      "http://other.example.invalid",
    ),
    valid.replace(
      "/group/project/-/compare/",
      "/group/project-extra/-/compare/",
    ),
    valid.replace("/group/project/-/compare/", "/other/project/-/compare/"),
    valid.replace("/group/project/-/compare/", "/group/project/compare/"),
    valid.replace("/owner/project/compare/", "/owner/project/-/compare/"),
    valid.replace(
      "[Unreleased-gitlab]: http://gitlab.example.invalid/group/project/-/compare/",
      "[Unreleased-gitlab]: https://github.example.invalid/owner/project/compare/",
    ),
    valid.replace("...main", "...main?view=other"),
    valid.replace("...main", "...main#other"),
    valid.replace(
      "http://gitlab.example.invalid",
      "http://user:password@gitlab.example.invalid",
    ),
  ]) {
    assert.throws(() => parseChangelog(changed), /history|peer|credential/u);
  }
});

test("declared peers cannot be missing, duplicate, or credential-bearing", () => {
  const valid = source("a".repeat(40));
  for (const selected of [
    [],
    [peers[0]],
    [peers[0], peers[0]],
    [peers[0], { ...peers[1], provider: "other" }],
    [
      peers[0],
      {
        ...peers[1],
        forge_repository:
          "https://user:password@github.example.invalid/owner/project",
      },
    ],
    [peers[0], { ...peers[1], forge_repository: "owner/project" }],
  ]) {
    assert.throws(
      () => parseChangelogSource(valid, { peers: selected }),
      /publication|peer|credential/u,
    );
  }
});

test("both peers must identify the same comparison or direct tag", () => {
  const valid = source("a".repeat(40));
  for (const changed of [
    valid.replace("a".repeat(40) + "...main", "b".repeat(40) + "...main"),
    valid.replace("...main", "...dev"),
    valid.replace("...main", "..main"),
    valid.replace("...main", "...main...extra"),
  ]) {
    assert.throws(() => parseChangelog(changed), /history|comparison|refs/u);
  }
  const direct = firstReleaseTagSource("a".repeat(40));
  assert.throws(
    () => parseChangelog(direct.replace("/-/tags/v4.0.0", "/-/tags/v3.0.0")),
    /history|refs/u,
  );
  assert.throws(
    () =>
      parseChangelog(
        direct.replace("/-/tags/v4.0.0", "/-/compare/v3.0.0...v4.0.0"),
      ),
    /history|refs/u,
  );
});

test("the public changelog check reads peer identity from the native declaration", () => {
  fixture((directory) => {
    assert.equal(
      validateChangelog({ repository: directory, selectedTag: "" }).version,
      "4.0.0",
    );
    const declaration = path.join(directory, ".ethos", "release.toml");
    const original = readFileSync(declaration, "utf8");
    writeFileSync(
      declaration,
      original.replace("/group/project", "/group/different"),
    );
    assert.throws(
      () => validateChangelog({ repository: directory, selectedTag: "" }),
      /history.*peer|peer.*repository/u,
    );
  });
});

test("code, comments, and quoted links cannot impersonate visible history rows", () => {
  const valid = source("a".repeat(40));
  for (const hidden of [
    `\`\`\`markdown\n${historyRow("Unreleased")}\n\`\`\``,
    `<!--\n${historyRow("Unreleased")}\n-->`,
    `> ${historyRow("Unreleased")}`,
    `    ${historyRow("Unreleased")}`,
    `${historyRow("Unreleased")}\nUncategorized text.`,
    `${historyRow("Unreleased")}\n\n${historyRow("Unreleased")}`,
  ]) {
    assert.throws(() =>
      parseChangelog(valid.replace(historyRow("Unreleased"), hidden)),
    );
  }
  const direct = historyDefinitions("Unreleased", "", "v4.0.0", true);
  assert.throws(
    () =>
      parseChangelog(
        valid.replace(
          historyDefinitions("Unreleased", "a".repeat(40), "main"),
          direct,
        ),
      ),
    /Unreleased.*comparison/u,
  );
});

test("native history preserves SemVer metadata, encoded refs, and declared ports", () => {
  const valid = source("a".repeat(40));
  const encoded = valid.replaceAll("a".repeat(40), "%61" + "a".repeat(39));
  assert.equal(
    parseChangelog(encoded).links.get("Unreleased").base,
    "a".repeat(40),
  );
  for (const ref of [
    "-option",
    "base^",
    "base%ZZ",
    "base%20",
    "base%3Fquery",
    "base%00",
    "../base",
  ]) {
    assert.throws(
      () =>
        parseChangelog(
          valid.replaceAll("a".repeat(40) + "...main", ref + "...main"),
        ),
      /history|comparison|refs/u,
    );
  }
  const selected = peers.map((peer) => ({
    ...peer,
    forge_repository: peer.forge_repository + "/",
  }));
  assert.equal(parseChangelogSource(valid, { peers: selected }).links.size, 1);
  const portPeers = peers.map((peer) => ({
    ...peer,
    forge_repository: peer.forge_repository.replace(
      ".invalid/",
      ".invalid:18086/",
    ),
  }));
  const portSource = valid.replaceAll(".invalid/", ".invalid:18086/");
  assert.equal(
    parseChangelogSource(portSource, { peers: portPeers }).links.size,
    1,
  );
});

test("earlier or case-folded reference definitions cannot shadow checked peer links", () => {
  const valid = source("a".repeat(40));
  for (const key of [
    "Unreleased-github",
    "unreleased-GITHUB",
    "Unreleased-gitlab",
  ]) {
    const shadow = `[${key}]: https://other.example.invalid/redirect\n\n`;
    assert.throws(
      () =>
        parseChangelog(
          valid.replace("## Unreleased", "\n" + shadow + "## Unreleased"),
        ),
      /history|definition|duplicate/u,
    );
  }
});

test("quote- and list-nested definitions cannot shadow visible peer destinations", () => {
  const valid = source("a".repeat(40));
  for (const prefix of ["> ", "- "]) {
    const hidden = `${prefix}[Unreleased-github]: https://other.example.invalid/redirect\n\n`;
    assert.throws(
      () =>
        parseChangelog(
          valid.replace("## Unreleased", hidden + "## Unreleased"),
        ),
      /history|definition|duplicate/u,
    );
  }
});
