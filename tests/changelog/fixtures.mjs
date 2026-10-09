import assert from "node:assert/strict";

import { spawnSync } from "node:child_process";

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";

import os from "node:os";

import path from "node:path";

import {
  parseChangelog as parseChangelogSource,
  validateChangelog,
} from "../../tools/docs/changelog.mjs";

export const intro = [
  "# Changelog",
  "",
  "All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and",
  "[Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
  "",
].join("\n");

export const peers = [
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

export function parseChangelog(source) {
  return parseChangelogSource(source, { peers });
}

export function historyRow(label) {
  return `History: [GitLab][${label}-gitlab] · [GitHub][${label}-github]`;
}

export function historyDefinitions(label, base, target, directTag = false) {
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

export function source(
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
        labels[index + 1] ? `v${labels[index + 1]}` : base,
        index === 0 ? releaseTarget : `v${label}`,
      ),
    ),
  ].join("\n");
  return `${intro}## Unreleased\n\n${historyRow("Unreleased")}\n\n### Changed\n\n- Describe a real change.\n\n${decorated}${definitions}\n`;
}

export function preparedSource(base, releases, releaseTarget = "v4.0.0") {
  return source(base, releases, releaseTarget, "v4.0.0").replace(
    "### Changed\n\n- Describe a real change.\n\n",
    "",
  );
}

export function firstReleaseTagSource(base) {
  return preparedSource(
    base,
    "## 4.0.0 - 2026-09-25\n\n### Added\n\n- First release.\n\n",
  ).replace(
    historyDefinitions("4.0.0", base, "v4.0.0"),
    historyDefinitions("4.0.0", "", "v4.0.0", true),
  );
}

export function git(directory, ...args) {
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

export function commit(directory, message) {
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

export function fixture(run) {
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

export function validateReleaseEnvironment(repository, selection) {
  const keys = [
    "DDWG_RELEASE_TAG",
    "GITHUB_REF_TYPE",
    "GITHUB_REF_NAME",
    "CI_COMMIT_TAG",
  ];
  const original = keys.map((key) => [key, process.env[key]]);
  try {
    for (const key of keys) {
      if (Object.hasOwn(selection, key)) process.env[key] = selection[key];
      else delete process.env[key];
    }
    return validateChangelog({ repository });
  } finally {
    for (const [key, value] of original) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}
