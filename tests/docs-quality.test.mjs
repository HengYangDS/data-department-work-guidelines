import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
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
  checkSpelling,
  proseFindings,
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
  lycheeBinary,
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
    ]) {
      const source = decision({ body });
      writeFileSync(path.join(sourceRoot, record), source);
      const result = runBoundary();
      assert.ifError(result.error);
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /execution|task progress/u);
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
    "openspec/changes/archive/2026-09-28-spelling-supply-refresh/design.md",
    ".config/tools/lychee.json",
    "openspec/config.yaml",
    ".github/workflows/docs-verify.yml",
    "tools/docs/cli.mjs",
  ]);
  for (const file of [
    "openspec/changes/archive/2026-09-28-spelling-supply-refresh/design.md",
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

test("locked prose spelling checks an explicit file despite ignorePaths", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-spelling-force-"));
  try {
    const file = path.join(directory, "misspelled.md");
    const config = path.join(directory, "cspell.json");
    writeFileSync(file, "The result is veriified.\n", "utf8");
    writeFileSync(
      config,
      JSON.stringify({
        version: "0.2",
        language: "en",
        ignorePaths: ["**/misspelled.md"],
      }),
      "utf8",
    );
    const result = spawnSync(
      process.execPath,
      [
        nodeTool("cspell", "cspell"),
        "lint",
        "--config",
        config,
        "--no-progress",
        "--force-check",
        "--file",
        file,
      ],
      { encoding: "utf8", timeout: 15_000 },
    );
    assert.equal(result.status, 1, result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /veriified/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose rules reject repeated words, filler and term variants", async () => {
  const findings = await proseFindings(
    "Use the the report in order to decide on Github.\n",
  );
  assert.ok(
    findings.some(
      ({ ruleId, message }) =>
        ruleId === "write-good" && message.includes("repeated"),
    ),
  );
  assert.ok(
    findings.some(
      ({ ruleId, message }) =>
        ruleId === "stop-words" && message.includes("in order to"),
    ),
  );
  assert.ok(findings.some(({ ruleId }) => ruleId === "terminology"));
  assert.ok(findings.every(({ line, column }) => line === 1 && column > 0));
});

test("native prose preserves syntax, quoted examples and honest uncertainty", async () => {
  assert.deepEqual(
    await proseFindings(
      "The request may be rejected when evidence is incomplete.\n\n" +
        "Use `Github in order to` only as a literal token.\n\n" +
        "```text\nGithub in order to use the the API\n```\n\n" +
        "Read [the source](https://example.com/Github/in-order-to).\n",
    ),
    [],
  );
  assert.ok(
    (await proseFindings("> Utilize Github for a rich tapestry of insights.\n"))
      .length,
  );
  assert.ok(
    (await proseFindings("<!-- textlint-disable -->\nUse the the report.\n"))
      .length,
  );
});

test("the repository prose owner fails on a real current file", async () => {
  const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-prose-"));
  try {
    const file = path.join(temporary, "current.md");
    writeFileSync(file, "# Current\n\nUse the the report.\n");
    await assert.rejects(checkProse([file]), /write-good.*repeated/u);
    writeFileSync(file, "# Current\n\nUse the report.\n");
    await assert.doesNotReject(checkProse([file]));
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("native prose preserves domain authority and standard Markdown terms", async () => {
  assert.deepEqual(
    await proseFindings(
      "Authority to act remains subject to explicit permission.\n\n" +
        "Compare feasible options. Use one blank line between paragraphs.\n",
    ),
    [],
  );
});

test("native repeated-word checks cover headings, emphasis and reader quotes", async () => {
  for (const source of [
    "# Use the the report\n",
    "Use **the the** report.\n",
    "> Use the the report.\n",
    "Use the **the** report.\n",
  ]) {
    assert.ok(
      (await proseFindings(source)).some(
        ({ ruleId, message }) =>
          ruleId === "write-good" && message.includes("repeated"),
      ),
      source,
    );
  }
});

test("native prose checks table cells without joining distinct columns", async () => {
  const source = "| Duty |\n| --- |\n| Use **the the** report on Github. |\n";
  const findings = await proseFindings(source);
  assert.ok(
    findings.some(({ ruleId, line }) => ruleId === "write-good" && line === 3),
  );
  assert.ok(findings.some(({ ruleId }) => ruleId === "terminology"));
  assert.deepEqual(
    await proseFindings(
      "| First | Second |\n| --- | --- |\n| the | the |\n| `the the` | Correct |\n",
    ),
    [],
  );
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
    writeFileSync(target, defective);
    for (const command of ["prose", "check"]) {
      const result = spawnSync(
        process.execPath,
        ["tools/docs/cli.mjs", command],
        { cwd: directory, encoding: "utf8", timeout: 120_000 },
      );
      assert.ifError(result.error);
      assert.equal(result.status, 1, `${command}: ${result.stderr}`);
      assert.match(
        result.stderr,
        /README\.md:\d+:\d+ \[write-good\].*repeated/u,
      );
      assert.equal(readFileSync(target, "utf8"), defective);
    }
    writeFileSync(target, original);
    const valid = spawnSync(process.execPath, ["tools/docs/cli.mjs", "prose"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 120_000,
    });
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
