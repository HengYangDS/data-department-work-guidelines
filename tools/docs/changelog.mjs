import { readFileSync } from "node:fs";
import path from "node:path";
import semver from "semver";
import { root, run } from "./runtime.mjs";

const categories = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
];
const releaseHeading = /^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})$/u;
const linkDefinition = /^\[([^\]]+)\]: (https:\/\/\S+)$/u;

export function strictVersion(value) {
  if (
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u.test(
      value,
    ) ||
    !semver.parse(value, { loose: false })
  ) {
    throw new Error(`invalid strict SemVer version: ${value}`);
  }
  return value;
}

function releaseDate(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`invalid ISO release date: ${value}`);
  }
  return date;
}

export function parseChangelog(source) {
  const lines = source.split(/\r?\n/u);
  if (lines[0] !== "# Changelog")
    throw new Error("CHANGELOG.md must start with # Changelog");
  const firstHeading = lines.findIndex((line) => line.startsWith("## "));
  if (firstHeading < 0)
    throw new Error("CHANGELOG.md has no Unreleased section");
  const introduction = lines.slice(0, firstHeading).join("\n");
  if (
    !introduction.includes("https://keepachangelog.com/en/1.1.0/") ||
    !introduction.includes("https://semver.org/spec/v2.0.0.html")
  ) {
    throw new Error(
      "CHANGELOG.md must identify Keep a Changelog 1.1.0 and SemVer 2.0.0",
    );
  }
  const sections = [];
  const links = new Map();
  let section = null;
  let category = null;
  let lastCategory = -1;
  let linkDefinitionsStarted = false;
  for (const [index, line] of lines.entries()) {
    const number = index + 1;
    if (index < firstHeading || !line.trim()) continue;
    const link = linkDefinition.exec(line);
    if (link) {
      if (links.has(link[1]))
        throw new Error(`duplicate changelog link: ${link[1]}`);
      links.set(link[1], link[2]);
      linkDefinitionsStarted = true;
      continue;
    }
    if (linkDefinitionsStarted) {
      throw new Error(`content follows changelog links at line ${number}`);
    }
    if (line.startsWith("## ")) {
      if (line === "## [Unreleased]") {
        if (sections.length)
          throw new Error(
            `duplicate or misplaced Unreleased section at line ${number}`,
          );
        section = {
          label: "Unreleased",
          version: "",
          date: "",
          items: 0,
          categories: new Map(),
        };
      } else {
        const match = releaseHeading.exec(line);
        if (!match)
          throw new Error(
            `malformed release heading at line ${number}: ${line}`,
          );
        const version = strictVersion(match[1]);
        releaseDate(match[2]);
        const previous = sections.at(-1);
        if (
          !previous ||
          (previous.version && !semver.gt(previous.version, version))
        ) {
          throw new Error(
            "release versions must be unique and strictly newest first",
          );
        }
        if (previous?.date && previous.date < match[2]) {
          throw new Error("release dates must be newest first");
        }
        section = {
          label: version,
          version,
          date: match[2],
          items: 0,
          categories: new Map(),
        };
      }
      sections.push(section);
      category = null;
      lastCategory = -1;
      continue;
    }
    if (line.startsWith("### ")) {
      if (!section)
        throw new Error(
          `change category precedes Unreleased at line ${number}`,
        );
      const name = line.slice(4);
      const position = categories.indexOf(name);
      if (position < 0 || position <= lastCategory) {
        throw new Error(
          `noncanonical or out-of-order category at line ${number}: ${name}`,
        );
      }
      section.categories.set(name, 0);
      category = name;
      lastCategory = position;
      continue;
    }
    if (line.startsWith("#### "))
      throw new Error(`unsupported changelog heading at line ${number}`);
    if (line.startsWith("- ")) {
      if (!section || !category || !line.slice(2).trim()) {
        throw new Error(`uncategorized or empty change item at line ${number}`);
      }
      section.items += 1;
      section.categories.set(category, section.categories.get(category) + 1);
      continue;
    }
    if (line.startsWith("  ") && section?.items && category) continue;
    throw new Error(`uncategorized changelog content at line ${number}`);
  }
  if (sections[0]?.label !== "Unreleased")
    throw new Error("Unreleased must be the first changelog section");
  for (const entry of sections) {
    if (entry.version && !entry.items)
      throw new Error(`release ${entry.version} has no categorized changes`);
    for (const [name, count] of entry.categories) {
      if (!count)
        throw new Error(`${entry.label} ${name} category has no change item`);
    }
  }
  const expected = new Set(sections.map((item) => item.label));
  for (const label of expected) {
    const href = links.get(label);
    if (!href) throw new Error(`missing history link for ${label}`);
    const url = new URL(href);
    if (url.protocol !== "https:" || !url.pathname.includes("/compare/")) {
      throw new Error(`history link must be an HTTPS comparison: ${label}`);
    }
  }
  for (const label of links.keys()) {
    if (!expected.has(label))
      throw new Error(`history link has no changelog section: ${label}`);
  }
  return { sections, links };
}

function localTags(repository) {
  const names = run("git", ["tag", "--list", "v*"], {
    cwd: repository,
    capture: true,
    timeout: 20_000,
  })
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean);
  const tags = new Map();
  for (const name of names) {
    if (!name.startsWith("v")) throw new Error(`invalid release tag: ${name}`);
    const version = strictVersion(name.slice(1));
    const type = run("git", ["cat-file", "-t", `refs/tags/${name}`], {
      cwd: repository,
      capture: true,
      timeout: 20_000,
    }).trim();
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
  if (github && gitlab && github !== gitlab)
    throw new Error("Forge release tag environments disagree");
  return github || gitlab;
}

export function validateChangelog({
  repository = root,
  selectedTag = selectedReleaseTag(),
} = {}) {
  const version = readFileSync(path.join(repository, "VERSION"), "utf8").trim();
  strictVersion(version);
  const charter = readFileSync(
    path.join(repository, "docs", "charter.md"),
    "utf8",
  );
  const editions = [
    ...charter.matchAll(/\*\*Guideline edition:\*\* v([^\s]+)/gu),
  ].map((match) => match[1]);
  if (editions.length !== 1 || editions[0] !== version) {
    throw new Error(`charter edition must match VERSION ${version}`);
  }
  const packageManifest = JSON.parse(
    readFileSync(path.join(repository, "package.json"), "utf8"),
  );
  const lock = JSON.parse(
    readFileSync(path.join(repository, "package-lock.json"), "utf8"),
  );
  if (
    Object.hasOwn(packageManifest, "version") ||
    Object.hasOwn(lock, "version") ||
    Object.hasOwn(lock.packages?.[""] ?? {}, "version")
  ) {
    throw new Error(
      "private npm metadata must not carry a second guideline version",
    );
  }
  const { sections, links } = parseChangelog(
    readFileSync(path.join(repository, "CHANGELOG.md"), "utf8"),
  );
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
  if (
    releases.length &&
    !tags.has(releases[0].version) &&
    releases[0].version !== version
  ) {
    throw new Error("prepared release must identify VERSION");
  }
  const latest = [...tags.keys()].sort(semver.rcompare)[0];
  if (latest && semver.lt(version, latest))
    throw new Error(`VERSION ${version} precedes released ${latest}`);
  for (const [label, href] of links) {
    const comparison = new URL(href).pathname.split("/compare/")[1];
    const refs = comparison?.split("...");
    if (refs?.length !== 2 || !refs[0] || !refs[1]) {
      throw new Error(`history comparison needs two refs: ${label}`);
    }
    const [base, target] = refs;
    run("git", ["rev-parse", "--verify", `${base}^{commit}`], {
      cwd: repository,
      capture: true,
      timeout: 20_000,
    });
    if (label === "Unreleased") {
      if (target !== "main") {
        throw new Error("Unreleased comparison must end at main");
      }
      if (latest && base !== `v${latest}`) {
        throw new Error(`Unreleased comparison must start at v${latest}`);
      }
    }
    if (label !== "Unreleased" && tags.has(label) && target !== `v${label}`) {
      throw new Error(`release comparison must end at v${label}`);
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
    const taggedHead = run("git", ["rev-parse", `${selectedTag}^{}`], {
      cwd: repository,
      capture: true,
    }).trim();
    const head = run("git", ["rev-parse", "HEAD"], {
      cwd: repository,
      capture: true,
    }).trim();
    if (taggedHead !== head)
      throw new Error(
        `selected release tag does not identify HEAD: ${selectedTag}`,
      );
  }
  return {
    version,
    releaseCount: releases.length,
    tagCount: tags.size,
    pending:
      releases[0] && !tags.has(releases[0].version) ? releases[0].version : "",
  };
}

export function checkChangelog() {
  const result = validateChangelog();
  console.log(
    `PASS changelog and SemVer: VERSION ${result.version}, ${result.tagCount} local release tags, pending ${result.pending || "none"}`,
  );
}
