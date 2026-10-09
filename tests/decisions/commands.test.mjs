import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseShell } from "shell-quote";
import {
  commandInvocation,
  executionViolation,
  validateDecision,
} from "../../tools/docs/decisions.mjs";
import { decision } from "../decisions/fixtures.mjs";

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
    "printf value >(ethos status --json)",
    "cat <<(ethos status --json)",
    "true &>log; ethos status --json",
    "true &>>log; ethos status --json",
    "case value in value) true ;& ethos status --json ;; esac",
    "case value in value) true ;;& value) ethos status --json ;; esac",
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
    "The rationale describes here-documents and output redirection.",
    "A case terminator differs from an actual decision boundary.",
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

test("native lexer groups supported operators and preserves quoted text", () => {
  for (const operator of ["<<", "<<-", ">|", "<>", "&>", "&>>", ";&", ";;&"]) {
    assert.deepEqual(
      parseShell(`printf value ${operator}target`, (name) => `$${name}`),
      ["printf", "value", { op: operator }, "target"],
      operator,
    );
  }
  assert.deepEqual(
    parseShell("printf value >(ethos status --json)", (name) => `$${name}`),
    ["printf", "value", { op: ">(" }, "ethos", "status", "--json", { op: ")" }],
  );
  assert.deepEqual(
    parseShell("cat <<(ethos status --json)", (name) => `$${name}`),
    [
      "cat",
      { op: "<" },
      { op: "<(" },
      "ethos",
      "status",
      "--json",
      { op: ")" },
    ],
  );
  assert.deepEqual(parseShell("printf '<<-' '>(value)' '&>>' '$TARGET'"), [
    "printf",
    "<<-",
    ">(value)",
    "&>>",
    "$TARGET",
  ]);
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
