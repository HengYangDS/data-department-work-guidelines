import { readFileSync } from "node:fs";
import path from "node:path";
import semver from "semver";
import { parse as parseToml } from "smol-toml";
import { headingLevel, markdownTokens, walkMarkdown } from "./markdown.mjs";
import { root, run } from "./runtime.mjs";

const categories = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
];
const releaseHeading = /^## (\S+) - (\d{4}-\d{2}-\d{2})(?: \[YANKED\])?$/u;
const linkDefinition = /^\[([^\]]+)\]: (https?:\/\/\S+)$/u;
const historyRow =
  /^History: \[GitLab\]\[([^\]]+)\] · \[GitHub\]\[([^\]]+)\]$/u;
const historyRoutes = {
  gitlab: { comparison: "/-/compare/", tag: "/-/tags/" },
  github: { comparison: "/compare/", tag: "/releases/tag/" },
};

function publicationPeers(repository) {
  return parseToml(
    readFileSync(path.join(repository, ".ethos", "release.toml"), "utf8"),
  ).publication?.peers;
}

function historyPeers(peers) {
  if (
    !Array.isArray(peers) ||
    peers.length !== 2 ||
    new Set(peers.map((peer) => peer?.id)).size !== 2 ||
    peers.some(
      (peer) => !/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(peer?.id ?? ""),
    ) ||
    peers
      .map((peer) => peer.provider)
      .sort()
      .join(",") !== "github,gitlab"
  ) {
    throw new Error(
      "changelog requires the declared GitLab and GitHub publication peers",
    );
  }
  return new Map(
    peers.map((peer) => {
      const href = peer.forge_repository;
      let url;
      try {
        url = new URL(href);
      } catch {
        throw new Error(`invalid publication peer repository: ${peer.id}`);
      }
      if (
        typeof href !== "string" ||
        href !== href.trim() ||
        !["http:", "https:"].includes(url.protocol) ||
        !url.hostname ||
        url.port === "0" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname.split("/").filter(Boolean).length < 2
      ) {
        throw new Error(
          `publication peer requires a credential-free HTTP(S) repository: ${peer.id}`,
        );
      }
      url.pathname = url.pathname.replace(/\/+$/u, "");
      return [peer.provider, url];
    }),
  );
}

function historyRef(raw, label) {
  let ref;
  try {
    ref = decodeURIComponent(raw);
  } catch {
    throw new Error(`invalid history comparison ref: ${label}`);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._+/-]*$/u.test(ref) || ref.includes("..")) {
    throw new Error(`invalid history comparison ref: ${label}`);
  }
  return ref;
}

function historyDestination(href, repository, provider, label) {
  const url = new URL(href);
  if (
    url.origin !== repository.origin ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `history link does not identify its declared peer repository: ${label} ${provider}`,
    );
  }
  const routes = historyRoutes[provider];
  const comparison = `${repository.pathname}${routes.comparison}`;
  const tag = `${repository.pathname}${routes.tag}`;
  if (url.pathname.startsWith(comparison)) {
    const refs = url.pathname.slice(comparison.length).split("...");
    if (refs.length !== 2 || !refs[0] || !refs[1]) {
      throw new Error(`history comparison needs two refs: ${label}`);
    }
    return {
      kind: "comparison",
      base: historyRef(refs[0], label),
      target: historyRef(refs[1], label),
    };
  }
  if (url.pathname.startsWith(tag)) {
    const target = historyRef(url.pathname.slice(tag.length), label);
    if (target.includes("/"))
      throw new Error(`invalid native history tag: ${label}`);
    if (label === "Unreleased")
      throw new Error("Unreleased history must be a comparison");
    return { kind: "tag", target };
  }
  throw new Error(
    `history link needs its peer repository's native history route: ${label} ${provider}`,
  );
}

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

export function parseChangelog(
  source,
  { peers = publicationPeers(root) } = {},
) {
  const repositories = historyPeers(peers);
  const blocks = markdownTokens(source, "CHANGELOG.md");
  const headings = new Map(
    blocks
      .filter((token) => headingLevel(token))
      .map((token) => [token.startLine, token]),
  );
  const content = blocks.flatMap((token) =>
    token.type === "content" ? token.children : [],
  );
  const paragraphs = new Map(
    content
      .filter((token) => token.type === "paragraph")
      .map((token) => [token.startLine, token]),
  );
  const definitions = new Set(
    content
      .filter((token) => token.type === "definition")
      .map((token) => token.startLine),
  );
  const lines = source.split(/\r?\n/u);
  if (lines[0] !== "# Changelog")
    throw new Error("CHANGELOG.md must start with # Changelog");
  const firstHeading = lines.findIndex((line) => line.startsWith("## "));
  if (firstHeading < 0)
    throw new Error("CHANGELOG.md has no Unreleased section");
  const introduction = lines.slice(0, firstHeading).join("\n");
  if (
    [...walkMarkdown(blocks)].some(
      (token) =>
        token.type === "definition" &&
        (token.startLine <= firstHeading || !definitions.has(token.startLine)),
    )
  ) {
    throw new Error(
      "history definitions must follow all sections at the Markdown document root",
    );
  }
  if (
    !introduction.includes("https://keepachangelog.com/en/1.1.0/") ||
    !introduction.includes("https://semver.org/spec/v2.0.0.html")
  ) {
    throw new Error(
      "CHANGELOG.md must identify Keep a Changelog 1.1.0 and SemVer 2.0.0",
    );
  }
  const sections = [];
  const hrefs = new Map();
  let section = null;
  let category = null;
  let linkDefinitionsStarted = false;
  for (const [index, line] of lines.entries()) {
    const number = index + 1;
    if (index < firstHeading || !line.trim()) continue;
    const link = linkDefinition.exec(line);
    if (link) {
      if (!definitions.has(number))
        throw new Error(
          `history link is not a Markdown definition at line ${number}`,
        );
      if (hrefs.has(link[1].toLowerCase()))
        throw new Error(`duplicate changelog link: ${link[1]}`);
      hrefs.set(link[1].toLowerCase(), link[2]);
      linkDefinitionsStarted = true;
      continue;
    }
    if (linkDefinitionsStarted) {
      throw new Error(`content follows changelog links at line ${number}`);
    }
    if (line.startsWith("## ")) {
      if (headingLevel(headings.get(number) ?? { type: "" }) !== 2)
        throw new Error(
          `release heading is not a top-level Markdown section at line ${number}`,
        );
      if (line === "## Unreleased") {
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
      continue;
    }
    const history = historyRow.exec(line);
    if (history) {
      if (
        !section ||
        category ||
        section.history ||
        paragraphs.get(number)?.text !== line ||
        paragraphs
          .get(number)
          ?.children.filter((token) => token.type === "link").length !== 2 ||
        history[1] !== `${section.label}-gitlab` ||
        history[2] !== `${section.label}-github`
      ) {
        throw new Error(
          `missing, misplaced, or mislabeled peer history at line ${number}`,
        );
      }
      section.history = true;
      continue;
    }
    if (line.startsWith("### ")) {
      if (headingLevel(headings.get(number) ?? { type: "" }) !== 3)
        throw new Error(
          `change category is not a top-level Markdown heading at line ${number}`,
        );
      if (!section)
        throw new Error(
          `change category precedes Unreleased at line ${number}`,
        );
      const name = line.slice(4);
      if (!categories.includes(name) || section.categories.has(name)) {
        throw new Error(
          `noncanonical or repeated category at line ${number}: ${name}`,
        );
      }
      section.categories.set(name, 0);
      category = name;
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
  const expected = new Set();
  const links = new Map();
  for (const { label, history } of sections) {
    if (!history) throw new Error(`missing explicit peer history for ${label}`);
    let common;
    for (const provider of ["gitlab", "github"]) {
      const key = `${label}-${provider}`;
      expected.add(key.toLowerCase());
      const href = hrefs.get(key.toLowerCase());
      if (!href) throw new Error(`missing history link for ${key}`);
      const destination = historyDestination(
        href,
        repositories.get(provider),
        provider,
        label,
      );
      if (common && JSON.stringify(common) !== JSON.stringify(destination)) {
        throw new Error(`peer history refs disagree: ${label}`);
      }
      common = destination;
    }
    links.set(label, common);
  }
  for (const label of hrefs.keys()) {
    if (!expected.has(label))
      throw new Error(`history link has no changelog section: ${label}`);
  }
  return { sections, links };
}

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
    { peers: publicationPeers(repository) },
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
      continue;
    }
    const { base, target } = destination;
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
      if (
        !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u.test(oid) ||
        type !== "commit" ||
        extra.length
      )
        throw new Error(
          `native history reference is not a commit: ${selected[index]}: ${record}`,
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
