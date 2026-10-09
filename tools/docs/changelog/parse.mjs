import { readFileSync } from "node:fs";
import path from "node:path";
import semver from "semver";
import { parse as parseToml } from "smol-toml";
import { headingLevel, markdownTokens, walkMarkdown } from "../markdown.mjs";
import { root } from "../runtime.mjs";

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

export function publicationPeers(
  repository,
  source = readFileSync(
    path.join(repository, ".ethos", "release.toml"),
    "utf8",
  ),
) {
  return parseToml(source).publication?.peers;
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
