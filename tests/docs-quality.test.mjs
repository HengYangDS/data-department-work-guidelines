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
import { pathToFileURL } from "node:url";
import {
  blankLineError,
  proseAlerts,
  checkProse,
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
  gitFiles,
  nativeToolBinary,
  nodeTool,
  root,
  sourceMarkdown,
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
    "<!--",
    "---",
    "subject: fixture:DR-0001",
    "role: decision",
    "state: canonical",
    "decision_id: DR-0001",
    "decision_status: accepted",
    "relations:",
    "  canonical_for: fixture choice",
    "---",
    "-->",
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

test("document metadata reads the product-supported title-first carrier", () => {
  const source = [
    "<!--",
    "---",
    "subject: fixture:guide",
    "role: policy",
    "state: canonical",
    "relations:",
    "  canonical_for: reader guidance",
    "---",
    "-->",
    "",
    "# Fixture",
    "",
    "Reader-facing content.",
    "",
  ].join("\n");
  assert.deepEqual(documentMetadata("docs/fixture.md", source), {
    subject: "fixture:guide",
    role: "policy",
    state: "canonical",
    relations: { canonical_for: "reader guidance" },
  });
});

test("document metadata rejects a duplicate key", () => {
  const source =
    "<!--\n---\nsubject: first\nsubject: second\nrole: policy\nstate: canonical\nrelations: {}\n---\n-->\n\n# Fixture\n";
  assert.throws(
    () => documentMetadata("docs/fixture.md", source),
    /invalid document metadata/u,
  );
});

test("document metadata rejects visible declarations and pre-title prose", () => {
  const metadata =
    "subject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}";
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `---\n${metadata}\n---\n\n# Fixture\n`,
      ),
    /title-first/u,
  );
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `<!--\n---\n${metadata}\n---\n-->\n\nA visible preface.\n\n# Fixture\n`,
      ),
    /first visible block/u,
  );
});

test("document metadata rejects incomplete or prematurely closed comments", () => {
  const incomplete =
    "<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}\n---\n# Fixture\n";
  const premature =
    '<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations:\n  canonical_for: "unsafe --> suffix"\n---\n-->\n\n# Fixture\n';
  for (const source of [incomplete, premature]) {
    assert.throws(
      () => documentMetadata("docs/fixture.md", source),
      /invalid document metadata/u,
    );
  }
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
    /code block/u,
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

test("command classification does not inherit object properties", () => {
  for (const source of [
    "constructor selection preserves the domain boundary.",
    "toString defines the reader representation.",
    "hasOwnProperty checks one declared property.",
    "__proto__ is a literal key, not an execution request.",
  ]) {
    assert.equal(commandInvocation(source), false);
    assert.doesNotThrow(() =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ body: source }),
      ),
    );
  }
  assert.equal(commandInvocation("ethos status --json"), true);
});

test("native shell tokens preserve quoting and compound invocation boundaries", () => {
  for (const source of [
    '"ethos" status --json',
    "'openspec' validate --all --strict",
    "true && ethos status --json",
    "printf value | node tools/docs/cli.mjs check",
    "env X=1 'ethos' plan --changed",
    "env X=1 ./tools/docs/cli.mjs verify",
    "sudo ./tools/docs/cli.mjs check",
    "sudo -u root ethos status --json",
    "/usr/local/bin/ethos status --json",
    "git reset --hard",
    "rm -rf ./temporary",
    "curl --fail https://example.test/source",
  ]) {
    assert.equal(commandInvocation(source), true, source);
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({
            body: `The record links execution instead of embedding \`${source}\`.`,
          }),
        ),
      /command invocation/u,
      source,
    );
  }
  for (const source of [
    "node represents an executable host.",
    "python describes the example language.",
    "a < b is a comparison, not an execution request.",
    "ETHOS lifecycle describes current work.",
    "./tools/docs/cli.mjs",
  ]) {
    assert.equal(commandInvocation(source), false, source);
  }
});

test("decision command inspection never evaluates shell input or ambient variables", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-command-inspection-"),
  );
  const marker = path.join(directory, "unexpected-execution");
  const previous = process.env.FLAGS;
  try {
    process.env.FLAGS = "not a command";
    assert.equal(commandInvocation("ethos status $FLAGS"), true);
    process.env.FLAGS = "--json";
    assert.equal(commandInvocation("ethos status $FLAGS"), true);
    assert.equal(commandInvocation(`ethos status $(touch '${marker}')`), true);
    assert.equal(existsSync(marker), false);
  } finally {
    if (previous === undefined) delete process.env.FLAGS;
    else process.env.FLAGS = previous;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native command operands remain words across glob and literal syntax", () => {
  for (const source of [
    "rm *",
    "rm file?.txt",
    "rm files.txt",
    "rm notes",
    "rm $TARGET",
    "rm -- notes",
    "true && rm *",
    "env X=1 rm 'notes'",
    "curl example.com",
  ]) {
    assert.equal(commandInvocation(source), true, source);
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body: `The producing Change owns \`${source}\`.` }),
        ),
      /command invocation/u,
      source,
    );
  }
  for (const source of [
    "rm describes a file-removal command.",
    "curl retrieves a remote resource.",
    "node represents an executable host.",
    "./tools/docs/cli.mjs",
  ]) {
    assert.equal(commandInvocation(source), false, source);
    assert.doesNotThrow(() =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision({ body: source }),
      ),
    );
  }
});

test("each required decision section contains readable content", () => {
  for (const heading of sections) {
    for (const empty of [
      "",
      "---",
      "[source]: https://example.test/evidence",
    ]) {
      const source = decision().replace(
        `## ${heading}\n\nAn evidence link can describe the ETHOS lifecycle.\n`,
        `## ${heading}\n\n${empty}\n`,
      );
      assert.throws(
        () => validateDecision("docs/decisions/dr-0001-fixture.md", source),
        /section.*readable content/u,
      );
    }
  }
  for (const body of [
    "[Evidence](https://example.test/source)",
    "> One accountable owner keeps the decision reversible.",
    "- Keep one source of truth.",
    "| Alternative | Boundary |\n| --- | --- |\n| One owner | One decision |",
  ]) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("parsed decision content rejects wrapped execution and task progress", async (t) => {
  const cases = [
    ["quoted Bash fence", "> ```bash\n> git status\n> ```"],
    [
      "list-nested shell fence",
      "- Evidence:\n\n  ```sh\n  ethos prove --execute\n  ```",
    ],
    ["PowerShell fence", '```powershell\nWrite-Output "Task complete"\n```'],
    ["PowerShell short label", '```ps1\nWrite-Output "Task complete"\n```'],
    ["Windows command fence", "```cmd\ndir /b\n```"],
    ["indented command", "    ethos prove --execute"],
    ["checked task", "- [x] Implement the Change."],
    ["unchecked task", "- [ ] Run the checks."],
    ["quoted task", "> - [x] Publish the result."],
    ["nested task", "- Work:\n  - [ ] Verify the current source."],
    ["long fenced command", "````text\nethos prove --execute\n```\n````"],
    ["inline command under emphasis", "**`ethos status --json`**"],
    ["opaque HTML command", "<pre>ethos prove --execute</pre>"],
    [
      "HTML task carrier",
      '<ul><li><input type="checkbox" checked>Done</li></ul>',
    ],
  ];
  for (const [name, body] of cases) {
    await t.test(name, () => {
      assert.throws(
        () =>
          validateDecision(
            "docs/decisions/dr-0001-fixture.md",
            decision({ body }),
          ),
        /execution|command invocation|task progress|unsupported HTML/u,
      );
    });
  }
});

test("parsed decision headings cannot be forged by a code block or quote", () => {
  const missing = decision({ headings: sections.slice(0, -1) });
  for (const wrapper of [
    "```text\n## Evidence and Revisit\n\nDurable rationale.\n```",
    "> ## Evidence and Revisit\n> Durable rationale.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          `${missing}\n${wrapper}\n`,
        ),
      /sections/u,
    );
  }
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        decision().replace("# DR-0001:", "# DR-0002:"),
      ),
    /title/u,
  );
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        `${decision()}\n# Second title\n`,
      ),
    /title/u,
  );
});

test("decision records have no additional or nested sections", () => {
  for (const body of [
    "### Task summary\n\nA task narrative does not belong in a decision.",
    "> ### Evidence detail\n> A nested heading is still a section.",
    "- Rationale:\n\n  ## Context\n\n  This is not a root decision section.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body }),
        ),
      /sections/u,
    );
  }
});

test("native decision headings retain their reader identity", () => {
  const source = decision()
    .replace("## Context", "## **Context**")
    .replace("## Decision", "## &#68;ecision");
  assert.doesNotThrow(() =>
    validateDecision("docs/decisions/dr-0001-fixture.md", source),
  );
  for (const body of [
    "- \\[x] This is a literal marker, not task progress.",
    "A link may name [ethos status](https://example.test/rationale).",
  ]) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("parsed decision content retains meaningful rationale and evidence links", () => {
  const bodies = [
    "ETHOS lifecycle describes current work.",
    "[Implementation](../../tools/docs/cli.mjs) and [OpenSpec](../../openspec/README.md) explain the boundary.",
    "The old `./scripts/validate-docs.sh` path names a retired implementation, not an execution record.",
    "- Keep one authority.\n- Reject duplicated lifecycle state.",
    "| Alternative | Consequence |\n| --- | --- |\n| One native owner | Less duplicate state. |",
    "> A method pack does not grant authority.",
    "A decision records a choice and its boundary.",
    "**Evidence:** <https://example.com/decision>.",
  ];
  for (const body of bodies) {
    assert.doesNotThrow(() =>
      validateDecision("docs/decisions/dr-0001-fixture.md", decision({ body })),
    );
  }
});

test("decision rationale links to code instead of carrying opaque executable blocks", () => {
  for (const body of [
    "```\nrm -rf ./temporary\n```",
    '```python\nprint("Task complete")\n```',
    '```text\nWrite-Output "Task complete"\n```',
    "```text\nA choice has a boundary and a revisit trigger.\n```",
    "    A choice has a boundary and a revisit trigger.",
  ]) {
    assert.throws(
      () =>
        validateDecision(
          "docs/decisions/dr-0001-fixture.md",
          decision({ body }),
        ),
      /unsupported code block/u,
    );
  }
  assert.throws(
    () =>
      validateDecision(
        "docs/decisions/dr-0001-fixture.md",
        `${decision()}\n> # Another decision\n`,
      ),
    /title/u,
  );
});

test("public boundary command rejects parsed progress and preserves evidence prose", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-decision-command-"),
  );
  const sourceRoot = path.join(directory, "repository");
  const record = "docs/decisions/dr-0001-fixture.md";
  try {
    cpSync(path.join(root, "tools"), path.join(sourceRoot, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(sourceRoot, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package.json"),
      path.join(sourceRoot, "package.json"),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(sourceRoot, "node_modules"),
      "junction",
    );
    mkdirSync(path.join(sourceRoot, "docs", "decisions"), { recursive: true });
    const runBoundary = () =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "boundary"], {
        cwd: sourceRoot,
        encoding: "utf8",
        timeout: 15_000,
      });
    for (const body of [
      '> ```powershell\n> Write-Output "Task complete"\n> ```',
      "- [x] Complete the release tasks.",
      'The record excludes `"ethos" status --json`.',
      "The record excludes `git reset --hard`.",
    ]) {
      const source = decision({ body });
      writeFileSync(path.join(sourceRoot, record), source);
      const result = runBoundary();
      assert.ifError(result.error);
      assert.equal(result.status, 1, result.stderr);
      assert.match(
        result.stderr,
        /execution|task progress|command invocation/u,
      );
      assert.equal(readFileSync(path.join(sourceRoot, record), "utf8"), source);
    }
    const source = decision({
      body: "[Evidence](../../openspec/README.md) explains the choice.",
    });
    writeFileSync(path.join(sourceRoot, record), source);
    const result = runBoundary();
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PASS decision boundary/u);
    assert.equal(readFileSync(path.join(sourceRoot, record), "utf8"), source);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
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

test("the decision tree rejects reused stable identifiers", () => {
  fixture((directory) => {
    const records = path.join(directory, "docs", "decisions");
    const second = decision()
      .replace("subject: fixture:DR-0001", "subject: fixture:second-choice")
      .replace(
        "canonical_for: fixture choice",
        "canonical_for: another choice",
      );
    const duplicate = path.join(records, "dr-0001-second-choice.md");
    writeFileSync(duplicate, second);
    assert.throws(
      () => checkDecisions(directory),
      /duplicate decision ID DR-0001/u,
    );
    rmSync(duplicate);
    writeFileSync(
      path.join(records, "dr-0002-second-choice.md"),
      second.replaceAll("DR-0001", "DR-0002"),
    );
    assert.doesNotThrow(() => checkDecisions(directory));
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
        ".config/tools/markdownlint-cli2.mjs",
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
    "openspec/changes/archive/2026-09-28-spelling-supply-refresh/design.md",
    ".config/tools/native.json",
    ".config/tools/markdownlint-cli2.mjs",
    "openspec/config.yaml",
    ".github/workflows/docs-verify.yml",
    "tools/docs/cli.mjs",
  ]);
  for (const file of [
    "openspec/changes/archive/2026-09-28-spelling-supply-refresh/design.md",
    ".config/tools/native.json",
    ".config/tools/markdownlint-cli2.mjs",
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
  const files = [
    "README.md",
    "docs/decide.md",
    "openspec/changes/archive/old/spec.md",
  ];
  assert.deepEqual(sourceMarkdown(files), files);
  assert.deepEqual(currentMarkdown(files), ["README.md", "docs/decide.md"]);
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

test("spacing rejects archived text and files without extensions without rejecting one blank line", () => {
  for (const file of ["openspec/changes/archive/example/spec.md", "LICENSE"]) {
    assert.deepEqual(textViolations(file, "First\n\nSecond\n"), []);
    assert.match(
      textViolations(file, "First\n\n\nSecond\n")[0],
      /:3: consecutive blank lines/u,
    );
  }
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
      nativeToolBinary("lychee"),
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

test("live link checking is explicit and retains the offline source boundary", async () => {
  const content = await import("../tools/docs/content.mjs");
  assert.equal(typeof content.linkCheckArguments, "function");
  const offline = content.linkCheckArguments("files.txt");
  const online = content.linkCheckArguments("files.txt", { online: true });
  assert.ok(offline.includes("--offline"));
  assert.ok(!online.includes("--offline"));
  assert.deepEqual(
    offline.filter((arg) => arg !== "--offline"),
    online,
  );
  assert.ok(!online.includes("--accept"));
  assert.equal(online.at(-1), "files.txt");
});

test("link checking rejects an incomplete-mode waiver", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/docs/cli.mjs", "links", "--allow-incomplete"],
    { cwd: root, encoding: "utf8", timeout: 10_000 },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /links accepts only --online/u);
});

function proseFindings(source) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-prose-"));
  const file = path.join(directory, "sample.md");
  try {
    writeFileSync(file, source, "utf8");
    const findings = Object.values(proseAlerts([file])).flat();
    assert.equal(readFileSync(file, "utf8"), source);
    return findings;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("native prose spelling rejects a real typo without changing source", () => {
  assert.deepEqual(proseFindings("The result is verified.\n"), []);
  const findings = proseFindings("The result is veriified.\n");
  assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
});

test("native prose ignores ambient global configuration", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-vale-global-"));
  const previousHome = process.env.HOME;
  try {
    writeFileSync(
      path.join(directory, ".vale.ini"),
      "[*.md]\nVale.Spelling = NO\nVale.Repetition = NO\n",
    );
    process.env.HOME = directory;
    const findings = proseFindings(
      "The result is veriified. Use the the report.\n",
    );
    assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
    assert.ok(findings.some(({ Check }) => Check === "Vale.Repetition"));
  } finally {
    if (previousHome === undefined) delete process.env.HOME;
    else process.env.HOME = previousHome;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose ignores inherited Vale configuration and styles paths", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-vale-environment-"),
  );
  const config = process.env.VALE_CONFIG_PATH;
  const styles = process.env.VALE_STYLES_PATH;
  try {
    const disabled = path.join(directory, "disabled.ini");
    writeFileSync(
      disabled,
      "[*.md]\nVale.Spelling = NO\nVale.Repetition = NO\n",
    );
    process.env.VALE_CONFIG_PATH = disabled;
    process.env.VALE_STYLES_PATH = path.join(directory, "empty-styles");
    mkdirSync(process.env.VALE_STYLES_PATH);
    const findings = proseFindings(
      "The result is veriified. Use the the report in order to decide.\n",
    );
    assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
    assert.ok(findings.some(({ Check }) => Check === "Vale.Repetition"));
    assert.ok(findings.some(({ Check }) => Check === "Plain.Concise"));
  } finally {
    if (config === undefined) delete process.env.VALE_CONFIG_PATH;
    else process.env.VALE_CONFIG_PATH = config;
    if (styles === undefined) delete process.env.VALE_STYLES_PATH;
    else process.env.VALE_STYLES_PATH = styles;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose rules reject repeated words, filler and term variants", () => {
  const findings = proseFindings(
    "Use the the report in order to decide on Github.\n",
  );
  assert.ok(
    findings.some(
      ({ Check, Message }) =>
        Check === "Vale.Repetition" && Message.includes("repeated"),
    ),
  );
  assert.ok(
    findings.some(
      ({ Check, Match }) =>
        Check === "Plain.Concise" && Match === "in order to",
    ),
  );
  assert.ok(findings.some(({ Check }) => Check === "Vale.Terms"));
  assert.ok(findings.every(({ Line, Span }) => Line === 1 && Span[0] > 0));
});

test("native prose reports diagnosed stock phrases without requiring a rewrite", () => {
  const findings = proseFindings("This offers a rich tapestry of insights.\n");
  assert.ok(
    findings.some(
      ({ Check, Match }) =>
        Check === "Plain.StockPhrases" && Match === "rich tapestry of insights",
    ),
  );
  assert.deepEqual(
    proseFindings(
      "This comparison identifies the changed values and their limits.\n",
    ),
    [],
  );
});

test("native prose preserves syntax, quoted examples and honest uncertainty", () => {
  assert.deepEqual(
    proseFindings(
      "The request may be rejected when evidence is incomplete.\n\n" +
        "Use `Github in order to` only as a literal token.\n\n" +
        "```text\nGithub in order to use the the API\n```\n\n" +
        "Read [the source](https://example.com/Github/in-order-to).\n",
    ),
    [],
  );
  assert.ok(
    proseFindings("> Utilize Github for a rich tapestry of insights.\n").length,
  );
});

test("the repository prose owner fails on a real current file", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-prose-"));
  try {
    const file = path.join(directory, "current.md");
    writeFileSync(file, "# Current\n\nUse the the report.\n");
    assert.throws(() => checkProse([file]), /Vale\.Repetition.*repeated/u);
    writeFileSync(file, "# Current\n\nUse the report.\n");
    assert.doesNotThrow(() => checkProse([file]));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose preserves domain authority and standard Markdown terms", () => {
  assert.deepEqual(
    proseFindings(
      "Authority to act remains subject to explicit permission.\n\n" +
        "Compare feasible options. Use one blank line between paragraphs.\n\n" +
        "Name the deliverable's format. Inspect the deliverables.\n",
    ),
    [],
  );
  assert.ok(proseFindings("Inspect the delivrables.\n").length > 0);
});

test("native repeated-word checks cover headings, emphasis and reader quotes", () => {
  for (const source of [
    "# Use the the report\n",
    "Use **the the** report.\n",
    "> Use the the report.\n",
    "Use the **the** report.\n",
  ]) {
    assert.ok(
      proseFindings(source).some(({ Check }) => Check === "Vale.Repetition"),
      source,
    );
  }
});

test("native prose checks table cells without joining distinct columns", () => {
  const findings = proseFindings(
    "| Duty |\n| --- |\n| Use **the the** report on Github. |\n",
  );
  assert.ok(
    findings.some(
      ({ Check, Line }) => Check === "Vale.Repetition" && Line === 3,
    ),
  );
  assert.ok(findings.some(({ Check }) => Check === "Vale.Terms"));
  assert.deepEqual(
    proseFindings(
      "| First | Second |\n| --- | --- |\n| the | the |\n| `the the` | Correct |\n",
    ),
    [],
  );
});

test("real Vale control comments cannot disable prose checks", () => {
  for (const control of [
    "<!-- vale off -->",
    "<!-- vale on -->",
    "<!-- vale style = NO -->",
    "<!-- vale styles = YES -->",
    "<!-- vale Vale.Spelling = NO -->",
    "<!-- vale Vale.Repetition = off -->",
    "<!-- v&#97;le off -->",
    "<!-- vale&#32;off -->",
  ]) {
    for (const source of [
      `${control}\n\nUse the the report.\n`,
      `Use ${control} the the report.\n`,
      `> ${control}\n> Use the the report.\n`,
      `- ${control}\n  Use the the report.\n`,
      `| Duty |\n| --- |\n| ${control} Use the the report. |\n`,
    ])
      assert.throws(() => proseFindings(source), /no-prose-control/u);
  }
  for (const source of [
    "<!-- Vale explains configured prose rules. -->\n\nThe result is verified.\n",
    "<!-- vale output was discussed during review -->\n\nThe result is verified.\n",
    "`<!-- vale off -->` is a literal example.\n",
    "```text\n<!-- vale off -->\n```\n",
    "&lt;!-- vale off --&gt;\n",
    '<span title="<!-- vale off -->">The result is verified.</span>\n',
  ]) {
    const findings = proseFindings(source);
    // Escaped directive examples are prose, not controls; Vale may still
    // enforce the visible tool-name spelling.
    assert.ok(
      findings.every(({ Check }) => Check === "Vale.Terms"),
      source,
    );
  }
});

test("public prose and integrity commands reject the same current-file defect", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-prose-entry-"));
  try {
    const clone = spawnSync(
      "git",
      [
        "clone",
        "--quiet",
        "--local",
        "--shared",
        "--no-checkout",
        root,
        directory,
      ],
      { encoding: "utf8", timeout: 30_000 },
    );
    assert.equal(clone.status, 0, clone.stderr);
    for (const relative of gitFiles()) {
      if (!existsSync(path.join(root, relative))) continue;
      const target = path.join(directory, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      cpSync(path.join(root, relative), target);
    }
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const target = path.join(directory, "README.md");
    const original = readFileSync(target, "utf8");
    const defective = `${original}\nUse the the report.\n`;
    const environment = {
      ...process.env,
      DDWG_VALE_BIN: nativeToolBinary("vale"),
      DDWG_LYCHEE_BIN: nativeToolBinary("lychee"),
    };
    writeFileSync(target, defective);
    for (const command of ["prose", "check"]) {
      const result = spawnSync(
        process.execPath,
        ["tools/docs/cli.mjs", command],
        {
          cwd: directory,
          env: environment,
          encoding: "utf8",
          timeout: 120_000,
        },
      );
      assert.ifError(result.error);
      assert.equal(result.status, 1, `${command}: ${result.stderr}`);
      assert.match(
        result.stderr,
        /README\.md:\d+:\d+ \[Vale\.Repetition\].*repeated/u,
      );
      assert.equal(readFileSync(target, "utf8"), defective);
    }
    writeFileSync(target, original);
    const valid = spawnSync(process.execPath, ["tools/docs/cli.mjs", "prose"], {
      cwd: directory,
      env: environment,
      encoding: "utf8",
      timeout: 120_000,
    });
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("retired quality owners are absent from current source and dependencies", () => {
  const retiredPackage =
    /(?:^|\/)(?:@textlint|@cspell|cspell[^/]*|textlint[^/]*|write-good)(?:\/|$)/u;
  const lock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"), "utf8"),
  );
  assert.deepEqual(
    Object.keys(lock.packages).filter((name) => retiredPackage.test(name)),
    [],
  );
  const currentCode = gitFiles().filter((name) =>
    /^(?:tools|tests)\/.*\.mjs$/u.test(name),
  );
  for (const name of currentCode) {
    if (!existsSync(path.join(root, name))) continue;
    const source = readFileSync(path.join(root, name), "utf8");
    assert.doesNotMatch(
      source,
      /(?:from\s+["']|require\(["'])(?:@textlint\/|@cspell\/|cspell|write-good|textlint-)/u,
      name,
    );
  }
  for (const name of [
    "@textlint",
    "@cspell",
    "cspell",
    "write-good",
    "textlint-util-to-string",
  ]) {
    assert.equal(
      existsSync(path.join(root, "node_modules", name)),
      false,
      name,
    );
  }
  for (const name of [
    ".config/tools/textlint.json",
    ".config/tools/cspell.json",
  ]) {
    assert.equal(existsSync(path.join(root, name)), false, name);
  }
});
