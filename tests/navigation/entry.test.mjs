import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { checkNavigation } from "../../tools/docs/governance.mjs";
import { fixture } from "../governance/fixtures.mjs";

test("navigation rejects a missing map, repeated root topic, and missing reader cue", () => {
  fixture((directory) => {
    checkNavigation(directory);
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    writeFileSync(entry, original.replace("(docs/README.md)", "(docs/missing.md)"));
    assert.throws(() => checkNavigation(directory), /missing task routes/u);
    writeFileSync(entry, `${original}\n[Duplicate](docs/charter.md)\n`);
    assert.throws(() => checkNavigation(directory), /repeats topic routes/u);
    writeFileSync(entry, original);
    const topic = path.join(directory, "docs", "decide.md");
    writeFileSync(topic, readFileSync(topic, "utf8").replace("**When to use:**", "**Read this:**"));
    assert.throws(() => checkNavigation(directory), /missing reader entry/u);
  });
});
