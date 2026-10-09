import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  parseChangelog as parseChangelogSource,
  validateChangelog,
} from "../../tools/docs/changelog.mjs";
import {
  peers,
  parseChangelog,
  historyRow,
  historyDefinitions,
  source,
  firstReleaseTagSource,
  fixture,
} from "./fixtures.mjs";

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
