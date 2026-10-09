import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import { checkNavigation } from "../../tools/docs/governance.mjs";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { fixture } from "../governance/fixtures.mjs";

test("navigation rejects a missing map, repeated root topic, and missing reader cue", () => {
  fixture((directory) => {
    checkNavigation(directory);
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    writeFileSync(
      entry,
      original.replace("(docs/README.md)", "(docs/missing.md)"),
    );
    assert.throws(() => checkNavigation(directory), /missing task routes/u);
    writeFileSync(entry, `${original}\n[Duplicate](docs/charter.md)\n`);
    assert.throws(() => checkNavigation(directory), /repeats topic routes/u);
    writeFileSync(entry, original);
    const topic = path.join(directory, "docs", "decide.md");
    writeFileSync(
      topic,
      readFileSync(topic, "utf8").replace("**When to use:**", "**Read this:**"),
    );
    assert.throws(() => checkNavigation(directory), /missing reader entry/u);
  });
});

test("task-map hierarchy separates destinations, related reading, and urgent entry", () => {
  const relative = "docs/README.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertHierarchy = (text) => {
    const tokens = markdownTokens(text, relative);
    const primary = tokens
      .filter((token) => token.type === "listUnordered")
      .flatMap((token) => token.children)
      .filter((token) => token.type === "content")
      .map((token) => markdownLinkDestinations(token.text));
    for (const links of primary) {
      assert.equal(
        links.length,
        1,
        "one primary destination per work question",
      );
    }
    const primaryLinks = new Set(primary.flat());
    for (const destination of [
      "data.md#change-shared-or-production-data",
      "evolve.md#grow-capability-through-real-work",
    ]) {
      assert.ok(
        primaryLinks.has(destination),
        `the work question needs its direct rule: ${destination}`,
      );
    }
    const destinations = new Set(
      primary.flatMap((links) =>
        links.map((link) => `docs/${link.split("#")[0]}`),
      ),
    );
    const profile = parseToml(
      readFileSync(path.join(root, ".ethos/profile.toml"), "utf8"),
    );
    for (const topic of profile.normative_sources) {
      assert.ok(destinations.has(topic), `${topic} needs a primary work route`);
    }
    const firstSection = tokens.findIndex((token) => headingLevel(token) === 2);
    assert.notEqual(firstSection, -1);
    assert.ok(
      markdownLinkDestinations(
        tokens
          .slice(0, firstSection)
          .map((token) => token.text)
          .join("\n"),
      ).includes("evolve.md#emergencies-and-exceptions"),
      "urgent containment must be discoverable before routine work routes",
    );
  };
  assertHierarchy(source);
  assert.throws(
    () => assertHierarchy(source.replace(/^  - /gmu, "  ")),
    /one primary destination per work question/u,
  );
  assert.throws(
    () =>
      assertHierarchy(
        source.replace("(evolve.md#emergencies-and-exceptions)", "(evolve.md)"),
      ),
    /urgent containment/u,
  );
});

test("data entry routes readers to recovery and current qualification", () => {
  const relative = "docs/data.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const introductionOf = (text) => {
    const tokens = markdownTokens(text, relative);
    const firstSection = tokens.findIndex((token) => headingLevel(token) === 2);
    assert.notEqual(firstSection, -1, "data work needs a first topic section");
    return tokens.slice(0, firstSection);
  };
  const destinationsOf = (tokens) =>
    markdownLinkDestinations(tokens.map((token) => token.text).join("\n"));
  const introduction = introductionOf(source);
  const opening = [...walkMarkdown(introduction)].find(
    (token) =>
      token.type === "paragraph" &&
      markdownText(token).startsWith("When to use:"),
  );
  assert.ok(opening, "data work needs a visible point-of-use entry");
  const destinations = destinationsOf(introduction);
  for (const destination of [
    "#change-shared-or-production-data",
    "#move-from-a-signal-to-controlled-use",
    "#admit-a-durable-data-asset",
  ]) {
    assert.ok(
      destinations.includes(destination),
      `data entry needs the current recovery and qualification route: ${destination}`,
    );
  }
  const lateRecovery = source.replaceAll(
    "(#change-shared-or-production-data)",
    "(charter.md)",
  );
  assert.equal(
    destinationsOf(
      introductionOf(
        `${lateRecovery}\n[Late recovery](#change-shared-or-production-data)\n`,
      ),
    ).includes("#change-shared-or-production-data"),
    false,
    "a link after the first topic section cannot satisfy the reader entry",
  );
});

test("root entry puts the reading action immediately after the purpose", () => {
  const relative = "README.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const paragraphs = [...walkMarkdown(markdownTokens(text, relative))].filter(
      (token) => token.type === "paragraph",
    );
    assert.ok(paragraphs.length > 1);
    assert.ok(
      markdownLinkDestinations(paragraphs[1].text).includes("docs/README.md"),
      "the reading action follows purpose before expression and maintainer detail",
    );
  };
  assertComposition(source);
  const entryStart = source.indexOf("**Start with your work question:**");
  const entryEnd = source.indexOf("\n\n", entryStart);
  const entry = source.slice(entryStart, entryEnd + 2);
  assert.throws(
    () =>
      assertComposition(
        source
          .replace(entry, "")
          .replace(
            "To change this repository",
            entry + "To change this repository",
          ),
      ),
    /reading action follows purpose/u,
  );
});

test("emergency containment routes to hard boundaries and both risk entries", () => {
  const relative = "docs/evolve.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const tokens = markdownTokens(source, relative);
  const heading = tokens.findIndex(
    (token) =>
      headingLevel(token) === 2 &&
      headingText(token) === "Emergencies and Exceptions",
  );
  assert.notEqual(heading, -1, "emergency duties need a discoverable section");
  const following = tokens.findIndex(
    (token, index) =>
      index > heading && headingLevel(token) > 0 && headingLevel(token) <= 2,
  );
  const section = tokens.slice(
    heading + 1,
    following < 0 ? undefined : following,
  );
  assert.ok(
    [...walkMarkdown(section)].some(
      (token) => token.type === "paragraph" && markdownText(token).trim(),
    ),
    "containment duties must remain under their heading",
  );
  assert.ok(
    markdownLinkDestinations(
      section.map((token) => token.text).join("\n"),
    ).includes("charter.md#four-non-negotiable-boundaries"),
    "urgency must retain the canonical truth, authority, and accountability boundaries",
  );
  for (const entry of ["docs/charter.md", "docs/deliver.md"]) {
    assert.ok(
      markdownLinkDestinations(
        readFileSync(path.join(root, entry), "utf8"),
      ).includes("evolve.md#emergencies-and-exceptions"),
      `${entry} must route to emergency containment without restating it`,
    );
  }
});

test("reader handoffs link to the section that owns the named decision", () => {
  const journeys = [
    ["docs/README.md", "data.md#admit-a-durable-data-asset"],
    ["docs/README.md", "deliver.md#close-the-work"],
    ["docs/README.md", "evolve.md#emergencies-and-exceptions"],
    ["docs/README.md", "communicate.md#structure-an-important-update"],
    ["docs/communicate.md", "#structure-an-important-update"],
    ["docs/charter.md", "data.md#admit-a-durable-data-asset"],
    ["docs/decide.md", "communicate.md#structure-a-decision-document"],
    ["docs/human-agent.md", "decide.md#decision-readiness"],
  ];
  for (const [relative, destination] of journeys) {
    const source = readFileSync(path.join(root, relative), "utf8");
    assert.ok(
      markdownLinkDestinations(source).includes(destination),
      `${relative} must hand off to ${destination}, not a broader parent`,
    );
  }
});

test("important-update entry lands on its actionable fields", () => {
  const relative = "docs/communicate.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertUpdateSection = (text) => {
    const tokens = markdownTokens(text, relative);
    const start = tokens.findIndex(
      (token) =>
        headingLevel(token) === 3 &&
        headingText(token) === "Structure an Important Update",
    );
    assert.notEqual(start, -1, "updates need their own navigable subsection");
    const fields = tokens
      .slice(start + 1)
      .find((token) => !token.type.startsWith("lineEnding"));
    assert.equal(fields.type, "listUnordered");
    assert.equal(
      fields.children.filter((token) => token.type === "content").length,
      4,
    );
    assert.match(
      markdownText(fields),
      /Conclusion or present state:.*Basis and impact:.*Decision needed:.*Next action:/su,
    );
  };
  assertUpdateSection(source);
  assert.throws(
    () =>
      assertUpdateSection(
        source.replace(
          "### Structure an Important Update",
          "For an important update:",
        ),
      ),
    /navigable subsection/u,
  );
});
