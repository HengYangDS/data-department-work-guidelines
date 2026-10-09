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
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { fixture, contentUnderHeading } from "../governance/fixtures.mjs";

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
    assert.ok(markdownText(paragraphs[0]).startsWith("[ ] 2.38 Qualify"));
    const actions = paragraphs
      .map((token) => markdownText(token, { code: true }))
      .join(" ")
      .replace(/\s+/gu, " ");
    let previous = -1;
    for (const action of [
      "Verify the format, risk, and execution contracts",
      "Preserve findings and runner failures",
      "Complete Windows, both-Forge, and accepted shared-runtime checks before closing this task.",
    ]) {
      const position = actions.indexOf(action);
      assert.ok(
        position > previous,
        `completion action must remain in its task and order: ${action}`,
      );
      previous = position;
    }
    assert.ok(
      actions.includes(
        "816cb6432b150825c22073cce0a89e6632721aa0477620b44496dab739166162",
      ),
      "qualification evidence reference must remain in its task",
    );
    const links = markdownLinkDestinations(
      paragraphs.map((token) => token.text).join("\n\n"),
    );
    for (const destination of [
      "design.md#give-native-quality-concerns-one-owner",
      "design.md#bind-risk-approval-to-the-actual-subject",
      "design.md#preserve-native-execution-and-complete-validation-evidence",
    ]) {
      assert.ok(
        links.includes(destination),
        `missing task route: ${destination}`,
      );
    }
  };
  assertTaskContainer(source);
  const qualification = "\n      Verify the [format]";
  assert.ok(source.includes(qualification));
  assertTaskContainer(
    source
      .replace(qualification, "\n\n  Verify the [format]")
      .replace("\n      Preserve findings", "\n\n  Preserve findings"),
  );
  assert.throws(
    () =>
      assertTaskContainer(
        source.replace(qualification, "\n\n      Verify the [format]"),
      ),
    /completion checks must not become code/u,
  );
  assert.throws(
    () =>
      assertTaskContainer(
        source.replace(qualification, "\n\nVerify the [format]"),
      ),
    /completion action must remain in its task/u,
  );
});
