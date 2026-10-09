import { readFileSync } from "node:fs";
import path from "node:path";
import semver from "semver";
import { root, run } from "./runtime.mjs";
import {
  parseChangelog,
  publicationPeers,
  strictVersion,
} from "./changelog/parse.mjs";

export { parseChangelog, strictVersion } from "./changelog/parse.mjs";

function localTags(repository) {
  const records = run(
    "git",
    [
      "for-each-ref",
      "--format=%(refname:strip=2)%00%(objecttype)",
      "refs/tags",
    ],
    { cwd: repository, capture: true, rejectStderr: true, timeout: 20_000 },
  )
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean);
  const tags = new Map();
  for (const record of records) {
    const [name, type, ...extra] = record.split("\0");
    if (!name || !type || extra.length)
      throw new Error("invalid native release tag inventory");
    if (!name.startsWith("v")) continue;
    const version = strictVersion(name.slice(1));
    if (type !== "tag")
      throw new Error(`release tag must be annotated: ${name}`);
    tags.set(version, name);
  }
  return tags;
}

function selectedReleaseTag() {
  const github =
    process.env.GITHUB_REF_TYPE === "tag"
      ? process.env.GITHUB_REF_NAME || ""
      : "";
  const gitlab = process.env.CI_COMMIT_TAG || "";
  const tags = new Set(
    [process.env.DDWG_RELEASE_TAG, github, gitlab].filter(Boolean),
  );
  if (tags.size > 1) throw new Error("Forge release tag environments disagree");
  return tags.values().next().value || "";
}

export function validateChangelog({
  repository = root,
  selectedTag = selectedReleaseTag(),
} = {}) {
  const sources = new Map();
  const readSource = (relative) => {
    const bytes = readFileSync(path.join(repository, relative));
    sources.set(relative, bytes);
    return bytes.toString("utf8");
  };
  const version = readSource("VERSION").trim();
  strictVersion(version);
  const charter = readSource("docs/charter.md");
  const editions = [
    ...charter.matchAll(/\*\*Guideline edition:\*\* v([^\s]+)/gu),
  ].map((match) => match[1]);
  if (editions.length !== 1 || editions[0] !== version) {
    throw new Error(`charter edition must match VERSION ${version}`);
  }
  const packageManifest = JSON.parse(readSource("package.json"));
  const lock = JSON.parse(readSource("package-lock.json"));
  if (
    Object.hasOwn(packageManifest, "version") ||
    Object.hasOwn(lock, "version") ||
    Object.hasOwn(lock.packages?.[""] ?? {}, "version")
  ) {
    throw new Error(
      "private npm metadata must not carry a second guideline version",
    );
  }
  const { sections, links } = parseChangelog(readSource("CHANGELOG.md"), {
    peers: publicationPeers(repository, readSource(".ethos/release.toml")),
  });
  const releases = sections.filter((entry) => entry.version);
  const tags = localTags(repository);
  for (const tagged of tags.keys()) {
    if (!releases.some((entry) => entry.version === tagged)) {
      throw new Error(`missing changelog section for local tag v${tagged}`);
    }
  }
  for (const [index, entry] of releases.entries()) {
    if (
      !tags.has(entry.version) &&
      !(index === 0 && entry.version === version)
    ) {
      throw new Error(`untagged historical release: ${entry.version}`);
    }
  }
  const latest = [...tags.keys()].sort(semver.rcompare)[0];
  if (latest && semver.lt(version, latest))
    throw new Error(`VERSION ${version} precedes released ${latest}`);
  const references = new Set();
  const comparisons = [];
  const pending =
    releases[0] && !tags.has(releases[0].version) ? releases[0].version : "";
  if (pending && sections[0].items)
    throw new Error("prepared release must not leave Unreleased changes");
  for (const [label, destination] of links) {
    if (destination.kind === "tag") {
      if (label !== releases.at(-1)?.version) {
        throw new Error("direct tag link is only valid for the oldest release");
      }
      if (!tags.has(label)) {
        throw new Error("direct tag link requires an annotated local tag");
      }
      if (destination.target !== `v${label}`) {
        throw new Error(`tag link must identify v${label}`);
      }
      references.add(`${destination.target}^{commit}`);
      continue;
    }
    const { base, target } = destination;
    const previous =
      releases[releases.findIndex((entry) => entry.version === label) + 1];
    if (label !== "Unreleased" && previous && base !== `v${previous.version}`) {
      throw new Error(
        `release comparison must start at previous release v${previous.version}: ${label}`,
      );
    }
    if (label === "Unreleased") {
      if (target !== "main") {
        throw new Error("Unreleased comparison must end at main");
      }
      const expected = pending || latest;
      if (expected && base !== `v${expected}`) {
        throw new Error(`Unreleased comparison must start at v${expected}`);
      }
    }
    if (
      label !== "Unreleased" &&
      (tags.has(label) || label === pending) &&
      target !== `v${label}`
    ) {
      throw new Error(`release comparison must end at v${label}`);
    }
    if (!(label === "Unreleased" && pending && base === `v${pending}`)) {
      const baseReference = `${base}^{commit}`;
      const targetReference =
        label === "Unreleased" || !tags.has(label)
          ? "HEAD"
          : `v${label}^{commit}`;
      references.add(baseReference);
      references.add(targetReference);
      comparisons.push({ label, baseReference, targetReference });
    }
  }
  if (selectedTag) {
    if (
      selectedTag !== `v${version}` ||
      releases[0]?.version !== version ||
      !tags.has(version)
    ) {
      throw new Error(
        `selected release tag disagrees with VERSION or changelog: ${selectedTag}`,
      );
    }
    if (sections[0].items)
      throw new Error("tagged release must not contain Unreleased changes");
    references.add(`${selectedTag}^{commit}`);
    references.add("HEAD");
    for (const relative of sources.keys()) references.add(`HEAD:${relative}`);
  }
  const resolvedCommits = new Map();
  if (references.size) {
    const selected = [...references];
    const records = run(
      "git",
      ["cat-file", "--batch-check=%(objectname) %(objecttype)"],
      {
        cwd: repository,
        capture: true,
        input: `${selected.join("\n")}\n`,
        rejectStderr: true,
        timeout: 20_000,
      },
    ).split(/\r?\n/u);
    if (records.pop() !== "" || records.length !== selected.length)
      throw new Error("native history reference report is incomplete");
    for (const [index, record] of records.entries()) {
      const [oid, type, ...extra] = record.split(" ");
      const expected = selected[index].startsWith("HEAD:") ? "blob" : "commit";
      if (
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(oid) ||
        type !== expected ||
        extra.length
      )
        throw new Error(
          `native history reference is not a ${expected}: ${selected[index]}: ${record}`,
        );
      resolvedCommits.set(selected[index], oid);
    }
  }
  const compared = new Set();
  for (const { label, baseReference, targetReference } of comparisons) {
    const baseCommit = resolvedCommits.get(baseReference);
    const targetCommit = resolvedCommits.get(targetReference);
    const identity = `${baseCommit}:${targetCommit}`;
    if (compared.has(identity)) continue;
    try {
      run("git", ["merge-base", "--is-ancestor", baseCommit, targetCommit], {
        cwd: repository,
        capture: true,
        rejectStderr: true,
        timeout: 20_000,
      });
    } catch (error) {
      if (error.message !== "git exited 1") throw error;
      throw new Error(`comparison base is not an ancestor: ${label}`, {
        cause: error,
      });
    }
    compared.add(identity);
  }
  if (selectedTag) {
    if (
      resolvedCommits.get(`${selectedTag}^{commit}`) !==
      resolvedCommits.get("HEAD")
    )
      throw new Error(
        `selected release tag does not identify HEAD: ${selectedTag}`,
      );
    for (const [relative, bytes] of sources) {
      const actual = run("git", ["hash-object", "--no-filters", "--stdin"], {
        cwd: repository,
        capture: true,
        input: bytes,
        rejectStderr: true,
        timeout: 20_000,
      }).trim();
      if (actual !== resolvedCommits.get(`HEAD:${relative}`)) {
        throw new Error(
          `selected release source differs from HEAD: ${relative}`,
        );
      }
    }
  }
  return {
    version,
    releaseCount: releases.length,
    tagCount: tags.size,
    pending,
  };
}

export function checkChangelog() {
  const result = validateChangelog();
  console.log(
    `PASS changelog and SemVer: VERSION ${result.version}, ${result.tagCount} local release tags, pending ${result.pending || "none"}`,
  );
}
