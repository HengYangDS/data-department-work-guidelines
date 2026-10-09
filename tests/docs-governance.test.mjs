import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import * as governance from "../tools/docs/governance.mjs";
import {
  checkLineEndingAttributes,
  checkLicense,
  checkNavigation,
  checkProfile,
} from "../tools/docs/governance.mjs";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../tools/docs/markdown.mjs";
import { root } from "../tools/docs/runtime.mjs";

function fixture(run) {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-governance-test-"),
  );
  try {
    cpSync(path.join(root, "docs"), path.join(directory, "docs"), {
      recursive: true,
    });
    mkdirSync(path.join(directory, ".ethos"));
    cpSync(
      path.join(root, ".ethos", "profile.toml"),
      path.join(directory, ".ethos", "profile.toml"),
    );
    for (const name of ["README.md", "AGENTS.md"]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("publication verification declares the complete local tool graph", () => {
  const release = parseToml(
    readFileSync(path.join(root, ".ethos/release.toml"), "utf8"),
  );
  assert.equal(
    release.publication.local_verification_command,
    "node tools/docs/cli.mjs verify",
  );
});

test("profile rejects a third proof gate and an old shell entrypoint", () => {
  fixture((directory) => {
    checkProfile(directory);
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace(
        'code_correctness_gates = ["docs-integrity", "markdown-format"]',
        'code_correctness_gates = ["docs-integrity", "markdown-format", "governance-lifecycle"]',
      ),
    );
    assert.throws(() => checkProfile(directory), /proof floor/u);
    writeFileSync(
      file,
      original.replace(
        'command = ["node", "tools/docs/cli.mjs", "check"]',
        'command = ["bash", "scripts/validate-docs.sh"]',
      ),
    );
    assert.throws(
      () => checkProfile(directory),
      /portable repository entrypoint/u,
    );
  });
});

test("profile requires product-owned native evidence on both document gates", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    const behavior =
      'verification_providers = ["ethos.adapters.gates.code_quality:behavior_report"]';
    const staticAnalysis =
      'verification_providers = ["ethos.adapters.gates.code_quality:static_report"]';
    assert.ok(original.includes(behavior));
    assert.ok(original.includes(staticAnalysis));
    writeFileSync(file, original.replace(`${behavior}\n`, ""));
    assert.throws(
      () => checkProfile(directory),
      /native verification provider/u,
    );
    writeFileSync(file, original.replace(staticAnalysis, behavior));
    assert.throws(
      () => checkProfile(directory),
      /native verification provider/u,
    );
  });
});

test("profile preserves the dimensions and trust boundary of its native gates", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = parseToml(readFileSync(file, "utf8"));
    assert.doesNotThrow(() => checkProfile(directory));
    const changes = [
      (profile) => {
        profile.proof.code_correctness_map.behavior = "markdown-format";
      },
      (profile) => {
        profile.proof.gates[0].kind = "lint";
      },
      (profile) => {
        profile.proof.gates[1].network_policy = "online";
      },
      (profile) => {
        profile.proof.gates[0].trust_bearing = false;
      },
      (profile) => {
        profile.proof.gates[0].evidence_class = "contract";
      },
    ];
    for (const change of changes) {
      const altered = structuredClone(original);
      change(altered);
      writeFileSync(file, stringifyToml(altered));
      assert.throws(
        () => checkProfile(directory),
        /proof dimensions|native document gate contract/u,
      );
    }
    writeFileSync(file, stringifyToml(original));
    assert.doesNotThrow(() => checkProfile(directory));
  });
});

test("profile admits every tracked candidate without an enumerated path list", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace(
        'material_paths = ["**"]',
        'material_paths = ["docs/**"]',
      ),
    );
    assert.throws(() => checkProfile(directory), /all tracked candidates/u);
  });
});

test("OpenSpec entry selects only the locked portable CLI", () => {
  const source = readFileSync(path.join(root, "openspec", "README.md"), "utf8");
  const expected =
    "node node_modules/@fission-ai/openspec/bin/openspec.js validate --all --strict --json";
  const requirePortableCommand = (text) => {
    const commands = text
      .split(/\r?\n/u)
      .filter((line) => line.endsWith("validate --all --strict --json"));
    assert.deepEqual(commands, [expected], "locked portable OpenSpec CLI");
  };
  requirePortableCommand(source);
  for (const invalid of [
    "node_modules/.bin/openspec validate --all --strict --json",
    "openspec validate --all --strict --json",
    "npm exec --offline -- openspec validate --all --strict --json",
    "npm exec --no --package=@fission-ai/openspec -- openspec validate --all --strict --json",
    "npm exec --offline --no -- openspec validate --all --strict --json",
    "npm exec --offline --no --package=@fission-ai/openspec -- openspec validate --all --strict --json",
  ]) {
    assert.throws(
      () => requirePortableCommand(source.replace(expected, invalid)),
      /locked portable OpenSpec CLI/u,
    );
  }
});

test("the documented official CLI cannot borrow an npm cache", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-openspec-entry-"));
  try {
    const cache = path.join(directory, "npm-cache", "_npx", "unrelated");
    mkdirSync(path.join(cache, "node_modules", ".bin"), { recursive: true });
    const marker = path.join(directory, "ambient-cli-ran");
    writeFileSync(
      path.join(cache, "node_modules", ".bin", "openspec"),
      `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');`,
    );
    const result = spawnSync(
      process.execPath,
      ["node_modules/@fission-ai/openspec/bin/openspec.js", "--version"],
      {
        cwd: directory,
        env: { ...process.env, npm_config_cache: path.dirname(cache) },
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /MODULE_NOT_FOUND/u);
    assert.equal(existsSync(marker), false);
    const installed = spawnSync(
      process.execPath,
      [
        path.join(root, "node_modules/@fission-ai/openspec/bin/openspec.js"),
        "--version",
      ],
      { cwd: root, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(installed.error);
    assert.equal(installed.status, 0);
    const locked = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ).devDependencies["@fission-ai/openspec"];
    assert.equal(installed.stdout.trim(), locked);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

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

test("L1 and L2 work records use the full charter boundary at both task routes", () => {
  for (const [relative, opening] of [
    ["docs/decide.md", "A low-risk matter"],
    ["docs/deliver.md", "These duties can share"],
  ]) {
    const source = readFileSync(path.join(root, relative), "utf8");
    const paragraph = [...walkMarkdown(markdownTokens(source, relative))].find(
      (token) =>
        token.type === "paragraph" && markdownText(token).startsWith(opening),
    );
    assert.ok(paragraph, relative);
    assert.match(markdownText(paragraph), /\bL1 and L2\b/u, relative);
    assert.ok(
      markdownLinkDestinations(paragraph.text).includes(
        "charter.md#form-follows-risk",
      ),
      relative,
    );
  }
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

function contentUnderHeading(source, relative, title) {
  const tokens = markdownTokens(source, relative);
  const start = tokens.findIndex(
    (token) => headingLevel(token) > 0 && headingText(token) === title,
  );
  assert.notEqual(start, -1, `${relative}: missing ${title}`);
  const level = headingLevel(tokens[start]);
  const end = tokens.findIndex(
    (token, index) =>
      index > start && headingLevel(token) > 0 && headingLevel(token) <= level,
  );
  return tokens.slice(start + 1, end < 0 ? undefined : end);
}

test("collaboration keeps member checks before the Agent execution section", () => {
  const relative = "docs/human-agent.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertReaderOrder = (text) => {
    const headings = markdownTokens(text, relative).filter(
      (token) => headingLevel(token) > 0,
    );
    const locate = (title) =>
      headings.findIndex((token) => headingText(token) === title);
    const shared = locate("Execute and Verify");
    const check = locate("Check Agent Output");
    const agent = locate("Agent Execution");
    const parallel = locate("Parallel Work");
    assert.ok(
      shared >= 0 && shared < check && check < agent && agent < parallel,
      "member acceptance must not be interrupted by the Agent procedure",
    );
    assert.equal(headingLevel(headings[check]), 3);
    assert.equal(
      headingLevel(headings[agent]),
      2,
      "Agent execution needs a distinct peer section",
    );
    assert.equal(headingLevel(headings[parallel]), 3);
  };
  assertReaderOrder(source);
  assert.throws(
    () =>
      assertReaderOrder(
        source.replace("## Agent Execution", "### Agent Execution"),
      ),
    /distinct peer section/u,
  );
  const checkStart = source.indexOf("### Check Agent Output\n");
  const agentStart = source.indexOf("## Agent Execution\n");
  const parallelStart = source.indexOf("### Parallel Work\n");
  assert.throws(
    () =>
      assertReaderOrder(
        source.slice(0, checkStart) +
          source.slice(agentStart, parallelStart) +
          source.slice(checkStart, agentStart) +
          source.slice(parallelStart),
      ),
    /member acceptance/u,
  );
});

test("source checking precedes conditional tool preparation without hiding inputs", () => {
  const relative = "CONTRIBUTING.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertCheckEntry = (text) => {
    const editing = contentUnderHeading(
      text,
      relative,
      "Edit a documentation page",
    );
    assert.match(
      editing.map((token) => token.text).join("\n"),
      /leading ETHOS HTML metadata comment.*node_modules.*generated output/su,
      "documentation metadata and Git duties need their own editing section",
    );
    const section = contentUnderHeading(text, relative, "Verify the source");
    assert.ok(
      !section.some((token) =>
        token.text.includes("leading ETHOS HTML metadata"),
      ),
      "document editing is not a source-check step",
    );
    const locate = (title) =>
      section.findIndex((token) => headingText(token) === title);
    const check = locate("Run the full source check");
    const runtime = locate("Prepare the runtime and dependencies");
    const supply = locate("Supply native checks");
    assert.ok(
      check >= 0 && check < runtime && runtime < supply,
      "source checks must precede conditional runtime and native-tool preparation",
    );
    const entryLinks = markdownLinkDestinations(
      section
        .slice(0, check)
        .map((token) => token.text)
        .join("\n"),
    );
    for (const prerequisite of [
      "#prepare-the-runtime-and-dependencies",
      "#supply-native-checks",
    ]) {
      assert.ok(
        entryLinks.includes(prerequisite),
        "preparation must stay discoverable at the check entry",
      );
    }
    const command = section.find((token) => token.type === "codeFenced");
    assert.ok(
      command &&
        command.text.includes("npm run verify\nethos plan --changed --json"),
      "the first verification example must run the checks, not install tools",
    );
    const acquisition = [
      ...walkMarkdown(
        contentUnderHeading(text, relative, "Acquire supplied assets"),
      ),
    ]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    assert.deepEqual(
      acquisition.map((paragraph) =>
        paragraph.split(" ").slice(0, 3).join(" "),
      ),
      [
        "Use Node's native",
        "Publish a fully",
        "Preserve permissions and",
        "Official OpenSpec child-process",
        "Archives exclude host",
      ],
      "download, cache, cleanup, child controls, and extraction need separate boundaries",
    );
  };
  assertCheckEntry(source);
  assert.throws(
    () =>
      assertCheckEntry(
        source
          .replace(
            "## Edit a documentation page",
            "## Verify the source\n\n### Edit a documentation page",
          )
          .replace("## Verify the source\n\nThe full check", "The full check"),
      ),
    /document editing is not a source-check step/u,
  );
  const checkStart = source.indexOf("### Run the full source check\n");
  const preparationStart = source.indexOf(
    "### Prepare the runtime and dependencies\n",
  );
  const end = source.indexOf("## Use the offline maintenance toolkit\n");
  assert.throws(
    () =>
      assertCheckEntry(
        source.slice(0, checkStart) +
          source.slice(preparationStart, end) +
          source.slice(checkStart, preparationStart) +
          source.slice(end),
      ),
    /source checks must precede/u,
  );
  assert.throws(
    () =>
      assertCheckEntry(
        source.replace(
          "(#prepare-the-runtime-and-dependencies)",
          "(#supply-native-checks)",
        ),
      ),
    /preparation must stay discoverable/u,
  );
  assert.throws(
    () =>
      assertCheckEntry(
        source.replace(
          "before network or staging.\n\nPublish",
          "before network or staging. Publish",
        ),
      ),
    /separate boundaries/u,
  );
});

test("writing aims do not absorb document-order and sending-review procedures", () => {
  const relative = "docs/communicate.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const aims = contentUnderHeading(
      text,
      relative,
      "Write for Fidelity, Clarity, and Elegance",
    );
    assert.deepEqual(
      aims.filter((token) => headingLevel(token) > 0).map(headingText),
      ["Fidelity", "Clarity", "Elegance"],
      "the three writing aims must not absorb practical procedures",
    );
    const headings = markdownTokens(text, relative).filter(
      (token) => headingLevel(token) > 0,
    );
    for (const title of [
      "Structure a Decision Document",
      "Review Before Sending",
    ]) {
      assert.equal(
        headingLevel(headings.find((token) => headingText(token) === title)),
        2,
      );
    }
    const order = contentUnderHeading(
      text,
      relative,
      "Structure a Decision Document",
    )
      .map((token) => token.text)
      .join("\n");
    assert.match(order, /by default/u);
    assert.match(order, /Appendices hold only supporting detail/u);
    assert.match(order, /Combine or reorder these parts/u);
  };
  assertComposition(source);
  assert.throws(
    () =>
      assertComposition(
        source.replace(
          "## Structure a Decision Document",
          "### Structure a Decision Document",
        ),
      ),
    /three writing aims/u,
  );
});

test("general risk review and management duties are peers of coaching and cadence", () => {
  const relative = "docs/evolve.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const headings = markdownTokens(text, relative).filter(
      (token) => headingLevel(token) > 0,
    );
    for (const title of [
      "Review Critical Risks",
      "Management Responsibilities",
    ]) {
      assert.equal(
        headingLevel(headings.find((token) => headingText(token) === title)),
        2,
        "general review and management duties must not be coaching or cadence subtopics",
      );
    }
    const riskReview = contentUnderHeading(
      text,
      relative,
      "Review Critical Risks",
    );
    const riskParagraphs = [...walkMarkdown(riskReview)]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    const minimum = riskParagraphs.find((text) =>
      text.startsWith("Every task must meet"),
    );
    const exceptional = riskParagraphs.find((text) =>
      text.startsWith("Call a result exceptional"),
    );
    assert.ok(
      minimum && !minimum.includes("Call a result exceptional"),
      "the minimum duty must not absorb the exceptional-performance standard",
    );
    assert.ok(
      exceptional &&
        exceptional.includes("Not every task needs an exceptional result"),
      "the higher standard must retain its applicability limit",
    );
    assert.ok(
      riskReview.some((token) => headingText(token) === "Use Scores with Care"),
    );
    assert.ok(
      !contentUnderHeading(
        text,
        relative,
        "Grow Capability Through Real Work",
      ).some((token) => headingText(token) === "Review Critical Risks"),
    );
  };
  assertComposition(source);
  assert.throws(
    () =>
      assertComposition(
        source.replace("## Review Critical Risks", "### Review Critical Risks"),
      ),
    /coaching or cadence subtopics/u,
  );
  assert.throws(
    () =>
      assertComposition(source.replace("reliably.\n\nCall", "reliably. Call")),
    /minimum duty/u,
  );
});

test("delivery entry reaches action and completion gates before the loop reference", () => {
  const relative = "docs/deliver.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const headings = markdownTokens(text, relative)
      .filter((token) => headingLevel(token) > 0)
      .map(headingText);
    const selected = headings.filter((title) =>
      [
        "Before Acting",
        "Close the Work",
        "The Working Loop",
        "Name the State, Not the Effort",
      ].includes(title),
    );
    assert.deepEqual(
      selected,
      [
        "Before Acting",
        "Close the Work",
        "The Working Loop",
        "Name the State, Not the Effort",
      ],
      "action and completion gates precede the supporting loop reference",
    );
  };
  assertComposition(source);
  const loopStart = source.indexOf("## The Working Loop\n");
  const stateStart = source.indexOf("## Name the State, Not the Effort\n");
  const loop = source.slice(loopStart, stateStart);
  assert.throws(
    () =>
      assertComposition(
        source
          .replace(loop, "")
          .replace("## Before Acting\n", loop + "## Before Acting\n"),
      ),
    /supporting loop reference/u,
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

test("authority priority exposes four ordered tiers and retains the waiver boundary", () => {
  const relative = "docs/charter.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertAuthorityOrder = (text) => {
    const section = contentUnderHeading(
      text,
      relative,
      "Two Kinds of Authority",
    );
    const priority = section.find((token) => token.type === "listOrdered");
    assert.ok(priority, "authority priority must be individually readable");
    const tiers = priority.children
      .filter((token) => token.type === "content")
      .map((token) => markdownText(token));
    assert.equal(tiers.length, 4);
    for (const [index, phrase] of [
      "Law, regulation, security requirements, and mandatory company policy.",
      "Within those boundaries, the explicit decision of the authorized owner for the current matter.",
      "Effective contracts, policies, specifications, and decision records.",
      "Work plans, provisional agreements, and personal preferences.",
    ].entries()) {
      assert.equal(tiers[index].replace(/\s+/gu, " ").trim(), phrase);
    }
    const limits = section
      .slice(section.indexOf(priority) + 1)
      .map((token) => markdownText(token))
      .join("\n");
    assert.match(limits, /does not grant waiver authority/u);
    assert.match(
      limits,
      /factual evidence does not itself grant permission to act/u,
    );
  };
  assertAuthorityOrder(source);
  assert.throws(
    () => assertAuthorityOrder(source.replace(/^([1-4])\. /gmu, "- ")),
    /individually readable/u,
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

test("reasoning checks keep each distinction independently readable", () => {
  const relative = "docs/decide.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertChecks = (text) => {
    const tokens = markdownTokens(text, relative);
    const start = tokens.findIndex(
      (token) =>
        headingLevel(token) === 3 &&
        headingText(token) === "Check the Reasoning",
    );
    assert.notEqual(start, -1);
    const end = tokens.findIndex(
      (token, index) =>
        index > start && headingLevel(token) > 0 && headingLevel(token) <= 3,
    );
    const list = tokens
      .slice(start + 1, end < 0 ? undefined : end)
      .find((token) => token.type === "listUnordered");
    assert.ok(list, "reasoning checks need separately readable items");
    assert.deepEqual(
      list.children
        .filter((token) => token.type === "content")
        .map((token) => markdownText(token).replace(/\s+/gu, " ").trim()),
      [
        "Correlation presented as causation.",
        "A case presented as a population.",
        "A necessary condition treated as sufficient.",
        "A later outcome used to infer a unique earlier cause.",
        "Selective search for supporting evidence.",
        "Criteria changed midstream.",
        "An appeal to common sense, experience, or “best practice” without checking its applicable boundary.",
      ],
    );
  };
  assertChecks(source);
  assert.throws(
    () => assertChecks(source.replace(/^-(?= )/gmu, " ")),
    /separately readable items/u,
  );
});

test("platform qualification separates common, architecture, and tool evidence", () => {
  const relative = "docs/governance/ethos.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertLayers = (text) => {
    const tokens = markdownTokens(text, relative);
    const start = tokens.findIndex(
      (token) =>
        headingLevel(token) === 3 &&
        headingText(token) === "Qualify Each Platform",
    );
    assert.notEqual(start, -1);
    const end = tokens.findIndex(
      (token, index) =>
        index > start && headingLevel(token) > 0 && headingLevel(token) <= 3,
    );
    const paragraphs = [
      ...walkMarkdown(tokens.slice(start + 1, end < 0 ? undefined : end)),
    ]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    assert.equal(paragraphs.length, 3, "platform readers need distinct layers");
    assert.ok(paragraphs[0].startsWith("CI bootstraps Node/npm"));
    assert.ok(paragraphs[1].startsWith("The manifest supplies macOS x64"));
    assert.ok(paragraphs[2].startsWith("For managed tools, invoke"));
  };
  assertLayers(source);
  assert.throws(
    () =>
      assertLayers(
        source.replace("\n\nThe manifest supplies", "\nThe manifest supplies"),
      ),
    /distinct layers/u,
  );
});

test("lifecycle readers reach current artifacts and source retirement duties", () => {
  const entry = readFileSync(path.join(root, "openspec/README.md"), "utf8");
  const governancePage = readFileSync(
    path.join(root, "docs/governance/ethos.md"),
    "utf8",
  );
  const assertJourney = (entryText, governanceText) => {
    const links = markdownLinkDestinations(entryText);
    for (const artifact of [
      "specs/README.md",
      "changes/native-document-quality/proposal.md",
      "changes/native-document-quality/design.md",
      "changes/native-document-quality/tasks.md",
    ]) {
      assert.ok(
        links.includes(artifact),
        `missing lifecycle reading route: ${artifact}`,
      );
    }
    const retirement = contentUnderHeading(
      governanceText,
      "docs/governance/ethos.md",
      "Evidence and Retirement",
    );
    assert.ok(
      [...walkMarkdown(retirement)].some((token) =>
        markdownText(token).startsWith("Retire completed-Change copies"),
      ),
      "source retirement duties must be reachable through their retirement owner",
    );
    assert.ok(
      ![
        ...walkMarkdown(
          contentUnderHeading(
            governanceText,
            "docs/governance/ethos.md",
            "Decision Record Form",
          ),
        ),
      ].some((token) =>
        markdownText(token).startsWith("Retire completed-Change copies"),
      ),
      "source retirement is not a decision-format rule",
    );
  };
  assertJourney(entry, governancePage);
  assert.throws(
    () => assertJourney(entry.replace("(specs/README.md)", ""), governancePage),
    /missing lifecycle reading route/u,
  );
});

test("governance readers reach Change intent and durable decision rationale", () => {
  fixture((directory) => {
    const entry = path.join(directory, "docs/governance/ethos.md");
    const original = readFileSync(entry, "utf8");
    for (const destination of [
      "../../openspec/README.md",
      "../decisions/README.md",
    ]) {
      const route = `(${destination})`;
      assert.ok(
        original.includes(route),
        "the governance route must be visible",
      );
      checkNavigation(directory);
      writeFileSync(entry, original.replace(route, ""));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes in docs\/governance\/ethos\.md/u,
      );
      writeFileSync(entry, original);
    }
  });
});

test("Change readers reach every affected capability at its delta owner", () => {
  const capabilities = [
    "quality",
    "guidance-discovery",
    "repository-governance",
  ];
  const assertRoutes = (text, relative) => {
    const links = markdownLinkDestinations(text);
    for (const capability of capabilities) {
      assert.ok(
        links.includes(`specs/${capability}/spec.md`),
        `${relative} must link to the ${capability} delta`,
      );
    }
  };
  for (const name of ["proposal.md", "design.md"]) {
    const relative = `openspec/changes/native-document-quality/${name}`;
    const source = readFileSync(path.join(root, relative), "utf8");
    assertRoutes(source, relative);
    assert.throws(
      () =>
        assertRoutes(source.replace("(specs/quality/spec.md)", ""), relative),
      /must link to the quality delta/u,
    );
  }
});

test("task qualification and evidence stay in one readable task item", () => {
  const relative = "openspec/changes/native-document-quality/tasks.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertTaskContainer = (text) => {
    const list = markdownTokens(text, relative).find(
      (token) =>
        token.type === "listUnordered" && token.text.includes("2.38 Qualify"),
    );
    assert.ok(list, "the existing task must remain in its numbered group");
    const start = list.children.findIndex(
      (token) => token.type === "content" && token.text.startsWith("[ ] 2.38 "),
    );
    assert.notEqual(start, -1);
    const next = list.children.findIndex(
      (token, index) => index > start && token.type === "listItemPrefix",
    );
    const item = list.children.slice(start, next < 0 ? undefined : next);
    const tokens = [...walkMarkdown(item)];
    assert.ok(
      tokens.every(
        (token) => !["codeIndented", "codeFenced"].includes(token.type),
      ),
      "task actions and completion checks must not become code",
    );
    const paragraphs = tokens.filter((token) => token.type === "paragraph");
    assert.equal(paragraphs.length, 3, "retain the three semantic task groups");
    assert.ok(markdownText(paragraphs[0]).startsWith("[ ] 2.38 Qualify"));
    assert.ok(markdownText(paragraphs[1]).startsWith("Verify the"));
    assert.ok(markdownText(paragraphs[2]).startsWith("Preserve findings"));
  };
  assertTaskContainer(source);
  const qualification = "\n\n  Verify the [format]";
  assert.ok(source.includes(qualification));
  assert.throws(
    () =>
      assertTaskContainer(
        source.replace(qualification, "\n\n      Verify the [format]"),
      ),
    /completion checks must not become code/u,
  );
});

test("navigation requires a rendered link rather than an example or image", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    assert.ok(original.includes(route));
    for (const replacement of [
      `\`${route}\``,
      `\n\n\`\`\`text\n${route}\n\`\`\`\n\n`,
      `<!-- ${route} -->`,
      `!${route}`,
      "![Preview with [documentation map](docs/README.md)](preview.png)",
      "\\[documentation map](docs/README.md)",
      "[documentation map](https://example.test/docs/README.md)",
      "the documentation map\n\n[unused]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: https://example.test/\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation resolves native link destinations and first reference definitions", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      '[documentation map](docs/README.md "Task map")',
      "[documentation map](<docs/README.md>)",
      "[documentation map](./docs/README.md)",
      "[documentation map](docs/README.md#start-with-the-work-question)",
      "[documentation map](docs/REA&#68;ME.md)",
      "[documentation map](docs/%52EADME.md)",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md",
      "[documentation map][SS]\n\n[ß]: docs/README.md",
      "[documentation map][ß]\n\n[SS]: docs/README.md",
      "[documentation map][TASK MAP]\n\n[task map]: docs/README.md",
      "[documentation map][]\n\n[documentation map]: docs/README.md",
      "[documentation map]\n\n[documentation map]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md\n\n[task-map]: https://example.test/",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation follows native GFM table cell boundaries", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    const table = (cell) =>
      `\n\n| Task | Entry |\n| --- | --- |\n| Start | ${cell} |\n\n`;
    for (const cell of [route, "[documentation \\| map](docs/README.md)"]) {
      writeFileSync(entry, original.replace(route, table(cell)));
      assert.doesNotThrow(() => checkNavigation(directory), cell);
    }
    for (const cell of [
      "[documentation | map](docs/README.md)",
      "unlinked | [documentation map](docs/README.md)",
    ]) {
      writeFileSync(entry, original.replace(route, table(cell)));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        cell,
      );
    }
  });
});

test("navigation rejects anchors without readable rendered content", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[](docs/README.md)",
      '[ ](docs/README.md "Task map")',
      "[\n\t](docs/README.md)",
      "[&#32;&nbsp;](docs/README.md)",
      "[\u200b\u2060\u00ad](docs/README.md)",
      "[ ][task-map]\n\n[task-map]: docs/README.md",
      "[![](preview.png)](docs/README.md)",
      "[![&#32;&nbsp;](preview.png)](docs/README.md)",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation preserves formatted text and descriptive linked-image labels", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[**Task** `map`](docs/README.md)",
      "[&#84;ask map](docs/README.md)",
      "[\u200bTask map\u2060](docs/README.md)",
      "[![Task map](preview.png)](docs/README.md)",
      "[![&#84;ask map](preview.png)][task-map]\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation detects real duplicate topic routes without counting examples", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    for (const duplicate of [
      '[Charter](docs/charter.md "Charter")',
      "[Charter](./docs/charter.md)",
      "[Charter](docs/char&#116;er.md)",
      "[Charter][charter]\n\n[charter]: docs/charter.md",
      "[Charter][SS]\n\n[ß]: docs/charter.md",
    ]) {
      writeFileSync(entry, `${original}\n${duplicate}\n`);
      assert.throws(
        () => checkNavigation(directory),
        /repeats topic routes/u,
        duplicate,
      );
    }
    for (const example of [
      "`[Charter](docs/charter.md)`",
      "<!-- [Charter](docs/charter.md) -->",
      "```text\n[Charter](docs/charter.md)\n```",
    ]) {
      writeFileSync(entry, `${original}\n${example}\n`);
      assert.doesNotThrow(() => checkNavigation(directory), example);
    }
  });
});

test("navigation requires the reader cue in the visible topic opening", () => {
  fixture((directory) => {
    const topic = path.join(directory, "docs", "decide.md");
    const original = readFileSync(topic, "utf8");
    for (const replacement of [
      "`**When to use:**`",
      "<!-- **When to use:** -->",
      "\n\n```text\n**When to use:**\n```\n\n",
      "![When to use:](../README.md)",
    ]) {
      writeFileSync(topic, original.replace("**When to use:**", replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing reader entry/u,
        replacement,
      );
    }
    writeFileSync(topic, original.replace("**When to use:**", "When to use:"));
    assert.doesNotThrow(() => checkNavigation(directory));
  });
});

test("MIT license, entry, and package metadata must agree", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-license-test-"));
  try {
    for (const name of [
      "LICENSE",
      "README.md",
      "package.json",
      "package-lock.json",
    ]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    assert.doesNotThrow(() => checkLicense(directory));

    const license = path.join(directory, "LICENSE");
    const originalLicense = readFileSync(license, "utf8");
    writeFileSync(
      license,
      originalLicense.replace("MIT License", "Apache License"),
    );
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    writeFileSync(license, originalLicense);
    writeFileSync(
      license,
      originalLicense.replace("without restriction", "with restrictions"),
    );
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    rmSync(license);
    assert.throws(() => checkLicense(directory), /missing MIT LICENSE/u);
    writeFileSync(license, originalLicense);

    const entry = path.join(directory, "README.md");
    const originalEntry = readFileSync(entry, "utf8");
    writeFileSync(
      entry,
      originalEntry.replace("(LICENSE)", "(missing-license)"),
    );
    assert.throws(() => checkLicense(directory), /MIT license link/u);
    writeFileSync(entry, originalEntry);

    const manifest = path.join(directory, "package.json");
    const originalManifest = readFileSync(manifest, "utf8");
    writeFileSync(
      manifest,
      originalManifest.replace('"license": "MIT"', '"license": "Apache-2.0"'),
    );
    assert.throws(() => checkLicense(directory), /MIT package metadata/u);
    writeFileSync(manifest, originalManifest);

    const lock = path.join(directory, "package-lock.json");
    const originalLock = readFileSync(lock, "utf8");
    writeFileSync(
      lock,
      originalLock.replace('"license": "MIT"', '"license": "Apache-2.0"'),
    );
    assert.throws(() => checkLicense(directory), /MIT package metadata/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native commit policy rejects unscoped or vague subjects", () => {
  const workspace = parseToml(
    readFileSync(path.join(root, ".ethos/workspace.toml"), "utf8"),
  );
  assert.equal(workspace.commit_policy.signing_required, true);
  const subject = new RegExp(workspace.commit_policy.subject_pattern);
  for (const valid of [
    "fix(quality): bind fixture identity to its own repository",
    "docs(guidance)!: restore risk-scaled work rules",
    "chore(openspec): archive completed change",
  ]) {
    assert.equal(subject.test(valid), true, valid);
  }
  for (const invalid of [
    "update docs",
    "docs: change everything",
    "WIP",
    "fix(quality): ",
    "fix(quality): vague. ",
  ]) {
    assert.equal(subject.test(invalid), false, invalid);
  }
});

test("Git checkout normalizes text independently of host autocrlf", () => {
  assert.doesNotThrow(() => checkLineEndingAttributes());
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-checkout-text-"));
  try {
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    const attributes = path.join(directory, ".gitattributes");
    writeFileSync(path.join(directory, "README.md"), "# Text source\n");
    writeFileSync(path.join(directory, "asset.bin"), Buffer.from([0, 255]));
    writeFileSync(attributes, "* text=auto eol=lf\nasset.bin -text\n");
    assert.doesNotThrow(() => checkLineEndingAttributes(directory));
    writeFileSync(attributes, "* text=auto\n");
    assert.throws(
      () => checkLineEndingAttributes(directory),
      /LF on every host/u,
    );
    writeFileSync(attributes, "* text=auto eol=lf\nREADME.md eol=crlf\n");
    assert.throws(
      () => checkLineEndingAttributes(directory),
      /README\.md.*LF on every host/u,
    );
    writeFileSync(
      attributes,
      "* text=auto eol=lf\nREADME.md -text\nasset.bin -text\n",
    );
    assert.doesNotThrow(() => checkLineEndingAttributes(directory));
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("configuration has separate native concern owners", () => {
  assert.equal(typeof governance.checkConfigurationLayout, "function");
  assert.doesNotThrow(() => governance.checkConfigurationLayout());
});

function configurationFixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-config-layout-"));
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("offline configuration preserves the exact development disposition", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-config-advisories-"),
  );
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package-lock.json"),
      path.join(directory, "package-lock.json"),
    );
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    writeFileSync(
      path.join(directory, ".config/checks/dependencies/policy.toml"),
      '[[IgnoredVulns]]\nid = "OSV-EXAMPLE"\nreason = "Hidden finding"\n',
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /approved.*OSV/u,
    );
    cpSync(
      path.join(root, ".config/checks/dependencies/policy.toml"),
      path.join(directory, ".config/checks/dependencies/policy.toml"),
    );
    const lock = JSON.parse(
      readFileSync(path.join(directory, "package-lock.json"), "utf8"),
    );
    lock.packages["node_modules/braces"].version = "3.0.4";
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /approved dependency artifact/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("configuration rejects mixed ownership, code, duplicates and local state", () => {
  for (const relative of [
    ".config/tools/native.json",
    ".config/checks/markdown/native.json",
    ".config/checks/markdown/rules.mjs",
    ".config/checks/format/prettier.json",
    ".config/checks/links/lychee.ini",
    ".config/supply/native.toml",
    ".config/release/cache/entry",
    ".config/checks/unused/.gitkeep",
  ]) {
    configurationFixture((directory) => {
      const file = path.join(directory, relative);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "Invalid configuration owner.\n");
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /configuration (?:ownership|layout)/u,
        relative,
      );
    });
  }
});

test("configuration rejects missing native policy owners", () => {
  for (const relative of [
    ".config/checks/format/prettier.toml",
    ".config/checks/format/toml.toml",
    ".config/checks/links/lychee.toml",
    ".config/checks/markdown/markdownlint.toml",
    ".config/checks/prose/vale.ini",
    ".config/supply/native.json",
    ".config/release/offline-bundle.json",
  ]) {
    configurationFixture((directory) => {
      rmSync(path.join(directory, relative));
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /configuration layout is missing owners/u,
        relative,
      );
    });
  }
});

test("configuration rejects package-embedded policy as a second owner", () => {
  configurationFixture((directory) => {
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify({ prettier: { printWidth: 80 } }),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership.*package/u,
    );
  });
});

test("Markdown policy keeps one spacing owner and preserves non-spacing checks", () => {
  const policy = readFileSync(
    path.join(root, ".config/checks/markdown/markdownlint.toml"),
    "utf8",
  );
  for (const source of [
    "[MD013]\nline_length = 0\n",
    'globs = ["**"]\n',
    policy.replace("whitespace = false", "whitespace = true"),
    policy.replace("blank_lines = false", "blank_lines = true"),
    policy.replace("MD019 = false", "MD019 = true"),
    policy.replace("MD021 = false", "MD021 = true"),
    policy.replace("MD060 = false", "MD060 = true"),
    `${policy}\n[list-item-spacing]\ncheckBlanks = true\n`,
    `${policy}\n[MD012]\nmaximum = 1\n`,
  ]) {
    configurationFixture((directory) => {
      writeFileSync(
        path.join(directory, ".config/checks/markdown/markdownlint.toml"),
        source,
      );
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /preserve native Markdown rule policy/u,
      );
    });
  }
});

test("configuration cannot delegate ownership through a directory link", () => {
  configurationFixture((directory) => {
    const supply = path.join(directory, ".config/supply");
    rmSync(supply, { recursive: true });
    symlinkSync(path.join(root, ".config/supply"), supply, "junction");
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership cannot follow a link/u,
    );
  });
});

test("native Vale resolves equivalent syntax to the single concern-local styles owner", () => {
  configurationFixture((directory) => {
    const config = path.join(directory, ".config/checks/prose/vale.ini");
    const original = readFileSync(config, "utf8");
    writeFileSync(
      config,
      original.replace("StylesPath = styles", "StylesPath=styles"),
    );
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    cpSync(
      path.join(directory, ".config/checks/prose/styles"),
      path.join(directory, "external-styles"),
      { recursive: true },
    );
    writeFileSync(
      config,
      original.replace(
        "StylesPath = styles",
        "StylesPath = ../../../external-styles",
      ),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership.*Vale/u,
    );
  });
});
