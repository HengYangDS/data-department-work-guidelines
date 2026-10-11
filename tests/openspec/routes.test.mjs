import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkNavigation } from "../../tools/docs/governance.mjs";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { root } from "../../tools/runtime.mjs";
import { fixture, contentUnderHeading } from "../governance/fixtures.mjs";

test("practice admission preserves preventive obligations across current carriers", () => {
  const carriers = [
    ["docs/evolve.md", "Admit Practices and Prevent Recurrence"],
    ["openspec/changes/native-document-quality/proposal.md", "What Changes"],
    [
      "openspec/changes/native-document-quality/specs/work-practice/spec.md",
      "Scenario: Prevention is needed before the first failure",
    ],
  ];
  const contract = (paragraphs) => ({
    need: paragraphs.some((text) =>
      text.includes(
        "observed problem, substantiated material risk, or applicable obligation",
      ),
    ),
    safeguards: paragraphs.some(
      (text) =>
        text.includes("safeguards") &&
        text.includes("not wait for an incident or practice admission"),
    ),
    implementation: paragraphs.some(
      (text) =>
        text.includes("trial") &&
        text.includes("implementation") &&
        text.includes("not") &&
        text.includes("whether the obligation applies"),
    ),
  });
  const selected = Object.fromEntries(
    carriers.map(([relative, title]) => {
      const source = readFileSync(path.join(root, relative), "utf8");
      const paragraphs = [
        ...walkMarkdown(contentUnderHeading(source, relative, title)),
      ]
        .filter((token) => token.type === "paragraph")
        .map((token) =>
          markdownText(token).replace(/\s+/gu, " ").toLowerCase(),
        );
      const expected = { need: true, safeguards: true, implementation: true };
      const legacy = paragraphs.map((text) =>
        text.replace(
          "observed problem, substantiated material risk, or applicable obligation",
          "observed failure mode",
        ),
      );
      assert.equal(contract(legacy).need, false, relative);
      const waived = paragraphs.map((text) =>
        text.replace(
          "whether the obligation applies",
          "when to admit the practice",
        ),
      );
      assert.equal(contract(waived).implementation, false, relative);
      return [relative, { actual: contract(paragraphs), expected }];
    }),
  );
  for (const [relative, { actual, expected }] of Object.entries(selected)) {
    assert.deepEqual(actual, expected, relative);
  }
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

test("lifecycle readers reach current artifacts and source retirement duties", () => {
  const entry = readFileSync(path.join(root, "openspec/README.md"), "utf8");
  const governancePage = readFileSync(
    path.join(root, "docs/governance/ethos.md"),
    "utf8",
  );
  const containsRetirementDuty = (tokens) =>
    [...walkMarkdown(tokens)].some(
      (token) =>
        token.type === "paragraph" &&
        markdownText(token).includes("completed-Change copies"),
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
      containsRetirementDuty(retirement),
      "source retirement duties must be reachable through their retirement owner",
    );
    assert.ok(
      !containsRetirementDuty(
        contentUnderHeading(
          governanceText,
          "docs/governance/ethos.md",
          "Decision Record Form",
        ),
      ),
      "source retirement is not a decision-format rule",
    );
  };
  assertJourney(entry, governancePage);
  const duty = [...walkMarkdown(markdownTokens(governancePage))].find(
    (token) =>
      token.type === "paragraph" &&
      markdownText(token).includes("completed-Change copies"),
  );
  assert.ok(duty, "the source retirement duty must have a paragraph owner");
  assert.throws(
    () => assertJourney(entry, governancePage.replace(duty.text, "")),
    /source retirement duties must be reachable/u,
  );
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
      const isTarget = (href) => href.split(/[?#]/u, 1)[0] === destination;
      const partial = original.replace(route, "");
      if (markdownLinkDestinations(partial).some(isTarget)) {
        writeFileSync(entry, partial);
        assert.doesNotThrow(() => checkNavigation(directory));
      }
      let missing = original;
      for (const href of new Set(
        markdownLinkDestinations(original).filter(isTarget),
      )) {
        missing = missing.replaceAll(`(${href})`, "");
      }
      assert.equal(
        markdownLinkDestinations(missing).some(isTarget),
        false,
        "the missing-route fixture must remove every route to the owner",
      );
      writeFileSync(entry, missing);
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes in docs\/governance\/ethos\.md/u,
      );
      writeFileSync(entry, original);
    }
  });
});

test("Change and main-spec readers reach every capability at its owner", () => {
  const capabilities = [
    "quality",
    "guidance-discovery",
    "repository-governance",
    "work-practice",
    "verification",
    "tool-supply",
    "publication",
  ];
  const assertRoutes = (text, relative, prefix) => {
    const links = markdownLinkDestinations(text);
    for (const capability of capabilities) {
      assert.ok(
        links.includes(`${prefix}${capability}/spec.md`),
        `${relative} must link to the ${capability} owner`,
      );
    }
  };
  for (const [relative, prefix] of [
    ["openspec/changes/native-document-quality/proposal.md", "specs/"],
    ["openspec/changes/native-document-quality/design.md", "specs/"],
    ["openspec/specs/README.md", ""],
  ]) {
    const source = readFileSync(path.join(root, relative), "utf8");
    assertRoutes(source, relative, prefix);
    for (const capability of capabilities) {
      assert.throws(
        () =>
          assertRoutes(
            source.replace(`(${prefix}${capability}/spec.md)`, ""),
            relative,
            prefix,
          ),
        /must link to the .* owner/u,
      );
    }
  }
});

test("task completion routes stay in their Markdown item after prose editing", () => {
  const relative = "openspec/changes/native-document-quality/tasks.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertTaskContainer = (text, id, destinations) => {
    const marker = `[ ] ${id} `;
    const list = [...walkMarkdown(markdownTokens(text, relative))].find(
      (token) =>
        token.type === "listUnordered" &&
        token.children.some(
          (child) => child.type === "content" && child.text.startsWith(marker),
        ),
    );
    assert.ok(list, "the selected task must remain a Markdown list item");
    const start = list.children.findIndex(
      (token) => token.type === "content" && token.text.startsWith(marker),
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
    assert.ok(markdownText(paragraphs[0]).startsWith(marker));
    const links = markdownLinkDestinations(
      paragraphs.map((token) => token.text).join("\n\n"),
    );
    for (const destination of destinations) {
      assert.ok(
        links.includes(destination),
        `missing task route: ${destination}`,
      );
    }
  };
  assertTaskContainer(source, "2.38", [
    "design.md#give-native-quality-concerns-one-owner",
    "design.md#bind-risk-approval-to-the-actual-subject",
    "design.md#preserve-native-execution-and-complete-validation-evidence",
  ]);
  const destination = "design.md#native-supply";
  const check = `[Check the selected version](${destination}).`;
  for (const description of ["Select the tool.", "Qualify the native input."]) {
    for (const separator of ["\n  ", "\n\n  "]) {
      const fixture = `# Tasks\n\n## 1. Native supply\n\n- [ ] 1.1 ${description}${separator}${check}\n`;
      assertTaskContainer(fixture, "1.1", [destination]);
    }
  }
  const prefix = "# Tasks\n\n## 1. Native supply\n\n- [ ] 1.1 Select the tool.";
  for (const misplaced of [
    `\n\n      ${check}\n`,
    `\n\n${check}\n`,
    `\n  \x60\x60\x60text\n  ${check}\n  \x60\x60\x60\n`,
  ]) {
    assert.throws(
      () => assertTaskContainer(prefix + misplaced, "1.1", [destination]),
      /must not become code|missing task route/u,
    );
  }
});

test("official apply tracks every readable item without a second progress section", () => {
  const relative = "openspec/changes/native-document-quality/tasks.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => key.toUpperCase() !== "OPENSPEC_TELEMETRY",
    ),
  );
  env.OPENSPEC_TELEMETRY = "0";
  const result = spawnSync(
    process.execPath,
    [
      path.join(root, "node_modules/@fission-ai/openspec/bin/openspec.js"),
      "instructions",
      "apply",
      "--change",
      "native-document-quality",
      "--json",
    ],
    { cwd: root, env, encoding: "utf8", timeout: 10_000 },
  );
  assert.ifError(result.error);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
  const report = JSON.parse(result.stdout);
  assert.equal(report.changeName, "native-document-quality");
  assert.equal(report.root.path, root);
  assert.equal(report.taskTrackingConfigured, true);
  assert.equal(report.progress.total, report.tasks.length);
  assert.equal(
    report.progress.complete,
    report.tasks.filter((task) => task.done).length,
  );
  assert.equal(
    report.progress.remaining,
    report.tasks.filter((task) => !task.done).length,
  );
  const tokens = markdownTokens(source, relative);
  const groups = tokens.filter((token) => headingLevel(token) === 2);
  assert.ok(groups.length, "the official checklist has numbered task groups");
  assert.ok(
    groups.every((token) => /^\d+\.\s/u.test(headingText(token))),
    "task progress must not acquire an unnumbered status section",
  );
  const designRelative = "openspec/changes/native-document-quality/design.md";
  const migration = contentUnderHeading(
    readFileSync(path.join(root, designRelative), "utf8"),
    designRelative,
    "Migration Plan",
  );
  assert.ok(
    migration.some((token) => token.type === "listOrdered"),
    "the design retains the migration dependency order",
  );
  const paragraphs = [...walkMarkdown(tokens)]
    .filter((token) => token.type === "listUnordered")
    .flatMap((token) =>
      token.children
        .filter((child) => child.type === "content")
        .map((child) =>
          child.children.find((item) => item.type === "paragraph"),
        ),
    )
    .filter(
      (token) =>
        token &&
        ["[ ] ", "[x] "].some((marker) => token.text.startsWith(marker)),
    );
  assert.ok(
    paragraphs.length,
    "the active checklist must contain readable work",
  );
  const expected = paragraphs.map((token) => ({
    description: token.text.split("\n")[0].slice(4),
    done: token.text.startsWith("[x] "),
    line: token.startLine,
  }));
  const assertCompleteSelection = (tasks) => {
    assert.deepEqual(
      tasks.map(({ description, done, line }) => ({ description, done, line })),
      expected,
      "native apply must preserve every readable task in source order",
    );
  };
  assertCompleteSelection(report.tasks);
  assert.throws(
    () => assertCompleteSelection(report.tasks.slice(1)),
    /every readable task/u,
  );
  for (const task of report.tasks) {
    assert.equal(task.sourcePath, path.join(root, relative));
    const paragraph = paragraphs.find((token) => token.startLine === task.line);
    assert.ok(paragraph, "each native task is readable, not code or a comment");
    assert.ok(paragraph.text.includes(task.description));
    assert.ok(markdownText(paragraph, { code: true }).trim());
  }
});
