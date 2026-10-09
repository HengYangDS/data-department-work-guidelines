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
import { checkNoScope } from "../../tools/docs/governance.mjs";
import {
  checkDecisions,
  validateDecision,
} from "../../tools/docs/decisions.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { sections, decision, fixture } from "../decisions/fixtures.mjs";

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
