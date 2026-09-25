import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import {
  blankLineError,
  checkSpelling,
  documentMetadata,
  formatTargets,
  repositoryFileUri,
  textViolations,
} from "../tools/docs/content.mjs";
import {
  checkDecisions,
  checkNoScope,
  commandInvocation,
  executionViolation,
  validateDecision,
} from "../tools/docs/governance.mjs";
import {
  currentMarkdown,
  lycheeBinary,
  nodeTool,
  root,
} from "../tools/docs/runtime.mjs";

const sections = [
  "Context",
  "Decision",
  "Alternatives Rejected",
  "Consequences and Boundary",
  "Evidence and Revisit",
];

function decision({
  headings = sections,
  body = "An evidence link can describe the ETHOS lifecycle.",
} = {}) {
  return [
    "---",
    "subject: fixture:DR-0001",
    "role: decision",
    "state: canonical",
    "decision_id: DR-0001",
    "decision_status: accepted",
    "relations:",
    "  canonical_for: fixture choice",
    "---",
    "",
    "# DR-0001: Fixture choice",
    "",
    ...headings.flatMap((heading) => [`## ${heading}`, "", body, ""]),
  ].join("\n");
}

function fixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-quality-test-"));
  try {
    mkdirSync(path.join(directory, "docs", "decisions"), { recursive: true });
    writeFileSync(
      path.join(directory, "docs", "decisions", "dr-0001-fixture.md"),
      decision(),
      "utf8",
    );
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("document metadata rejects a duplicate key", () => {
  const source =
    "---\nsubject: first\nsubject: second\nrole: policy\nstate: canonical\nrelations: {}\n---\n# Fixture\n";
  assert.throws(
    () => documentMetadata("docs/fixture.md", source),
    /invalid document metadata/u,
  );
});

test("decision sections and identity remain exact", () => {
  assert.doesNotThrow(() =>
    validateDecision("docs/decisions/dr-0001-fixture.md", decision()),
  );
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ headings: sections.slice(0, -1) }),
      ),
    /sections/u,
  );
  assert.throws(
    () => validateDecision("docs/decisions/2026-09-25-fixture.md", decision()),
    /filename/u,
  );
  assert.throws(
    () => validateDecision("docs/decisions/dr-0002-fixture.md", decision()),
    /identity/u,
  );
});

test("shell syntax is rejected without rejecting concept prose or evidence links", () => {
  assert.equal(
    commandInvocation("ETHOS lifecycle describes current work."),
    false,
  );
  assert.equal(commandInvocation("./scripts/validate-docs.sh"), false);
  assert.equal(
    executionViolation(
      "The evidence link is [source](../../openspec/README.md).",
    ),
    "",
  );
  assert.match(
    executionViolation("```bash\nethos status --json\n```"),
    /fenced execution/u,
  );
  assert.match(
    executionViolation("Run `openspec validate --all --strict`."),
    /inline command/u,
  );
  assert.match(executionViolation("$ git status"), /shell prompt/u);
  assert.match(
    executionViolation("env X=1 ethos plan --changed"),
    /command invocation/u,
  );
});

test("current decision tree rejects date names, superseded records, and method carriers", () => {
  fixture((directory) => {
    checkDecisions(directory);
    const records = path.join(directory, "docs", "decisions");
    writeFileSync(path.join(records, "2026-09-25-old.md"), decision(), "utf8");
    assert.throws(() => checkDecisions(directory), /filename/u);
    rmSync(path.join(records, "2026-09-25-old.md"));
    writeFileSync(
      path.join(records, "dr-0001-fixture.md"),
      decision().replace(
        "decision_status: accepted",
        "decision_status: superseded",
      ),
    );
    assert.throws(() => checkDecisions(directory), /status/u);
    mkdirSync(path.join(directory, "docs", "superpowers"));
    assert.throws(() => checkDecisions(directory), /superpowers/u);
  });
});

test("a private Change scope companion cannot return", () => {
  fixture((directory) => {
    const change = path.join(directory, "openspec", "changes", "fixture");
    mkdirSync(change, { recursive: true });
    writeFileSync(path.join(change, "scope.toml"), "schema_version = 1\n");
    assert.throws(() => checkNoScope(directory), /scope companion/u);
  });
});

test("repository file links cannot escape the checkout", () => {
  const outside = pathToFileURL(path.resolve(root, "..", "outside.md")).href;
  assert.throws(() => repositoryFileUri(outside), /escapes repository root/u);
  const inside = pathToFileURL(path.join(root, "README.md")).href;
  assert.doesNotThrow(() => repositoryFileUri(inside));
});

test("one blank line is allowed; visual padding is not", () => {
  assert.equal(blankLineError("fixture.md", "# A\n\nText\n"), "");
  assert.match(
    blankLineError("fixture.md", "# A\n\n\nText\n"),
    /consecutive blank lines/u,
  );
});

test("changelog categories may recur under different releases, not one release", () => {
  const lint = (source) =>
    spawnSync(
      process.execPath,
      [
        nodeTool("markdownlint-cli2", "markdownlint-cli2"),
        "--config",
        ".config/tools/markdownlint-cli2.yaml",
        "-",
      ],
      { cwd: root, encoding: "utf8", input: source, timeout: 10_000 },
    );
  const first = "# Changelog\n\n## [4.0.1]\n\n### Fixed\n\n- New.\n\n";
  const second = "## [4.0.0]\n\n### Fixed\n\n- Old.\n";
  const separate = lint(first + second);
  assert.equal(separate.status, 0, separate.stderr);

  const duplicate = lint(first + "### Fixed\n\n- Duplicate.\n");
  assert.notEqual(duplicate.status, 0);
  assert.match(duplicate.stderr, /MD024/u);
});

test("formatting selects source configuration and TOML syntax is checked", () => {
  const targets = formatTargets([
    "docs/README.md",
    ".config/tools/lychee.json",
    "openspec/config.yaml",
    ".github/workflows/docs-verify.yml",
    "tools/docs/cli.mjs",
  ]);
  for (const file of [
    ".config/tools/lychee.json",
    "openspec/config.yaml",
    ".github/workflows/docs-verify.yml",
  ]) {
    assert.ok(targets.includes(file), file);
  }
  assert.match(
    textViolations(".ethos/workspace.toml", "[invalid\n")[0],
    /invalid TOML/u,
  );
});

test("current Markdown inventory excludes official archives, not live topics", () => {
  assert.deepEqual(
    currentMarkdown([
      "README.md",
      "docs/decide.md",
      "openspec/changes/archive/old/spec.md",
    ]),
    ["README.md", "docs/decide.md"],
  );
});

test("the public check command rejects incomplete-mode waivers", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "check", "--allow-incomplete"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /check accepts no arguments/u);
});

test("English and spacing failures identify a file and line", () => {
  assert.match(
    textViolations("docs/example.md", "# Heading\n\u4e2d\u6587\n")[0],
    /docs\/example\.md:2/u,
  );
  assert.match(
    textViolations("docs/example.md", "# Heading\n\n\nText\n")[0],
    /docs\/example\.md:3/u,
  );
});

test("pinned lychee rejects a broken local fragment", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-links-test-"));
  try {
    writeFileSync(path.join(directory, "target.md"), "# Present\n");
    writeFileSync(
      path.join(directory, "source.md"),
      "[Missing](target.md#absent)\n",
    );
    const result = spawnSync(
      lycheeBinary(),
      [
        "--offline",
        "--include-fragments=anchor-only",
        "--no-progress",
        "--max-retries",
        "0",
        path.join(directory, "source.md"),
      ],
      {
        encoding: "utf8",
        timeout: 15_000,
      },
    );
    assert.notEqual(result.status, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("locked prose spelling rejects a real typo without changing source", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-spelling-test-"));
  try {
    const file = path.join(directory, "sample.md");
    writeFileSync(file, "The result is verified.\n", "utf8");
    assert.doesNotThrow(() => checkSpelling([file]));
    writeFileSync(file, "The result is veriified.\n", "utf8");
    assert.throws(() => checkSpelling([file]), /exited 1/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
