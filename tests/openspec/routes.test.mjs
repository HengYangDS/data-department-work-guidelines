import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { checkNavigation, checkNoScope } from "../../tools/docs/governance.mjs";
import { markdownLinkDestinations } from "../../tools/docs/markdown.mjs";
import { fixture } from "../governance/fixtures.mjs";

test("governance readers reach Change intent and durable decision rationale", () => {
  fixture((directory) => {
    const entry = path.join(directory, "docs/governance/README.md");
    const original = readFileSync(entry, "utf8");
    for (const destination of ["../../openspec/README.md", "../decisions/README.md"]) {
      const route = `(${destination})`;
      assert.ok(original.includes(route), "the governance route must be visible");
      checkNavigation(directory);
      const isTarget = (href) => href.split(/[?#]/u, 1)[0] === destination;
      const partial = original.replace(route, "");
      if (markdownLinkDestinations(partial).some(isTarget)) {
        writeFileSync(entry, partial);
        assert.doesNotThrow(() => checkNavigation(directory));
      }
      let missing = original;
      for (const href of new Set(markdownLinkDestinations(original).filter(isTarget))) {
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
        /missing task routes in docs\/governance\/README\.md/u,
      );
      writeFileSync(entry, original);
    }
  });
});

test("current task routes reject retired method and private scope carriers", () => {
  fixture((directory) => {
    assert.doesNotThrow(() => checkNavigation(directory));
    assert.doesNotThrow(() => checkNoScope(directory));
    const methods = path.join(directory, "docs", "superpowers");
    mkdirSync(methods);
    assert.throws(() => checkNavigation(directory), /retired.*carrier/u);
    rmSync(methods, { recursive: true });
    const change = path.join(directory, "openspec", "changes", "fixture");
    mkdirSync(change, { recursive: true });
    writeFileSync(path.join(change, "scope.toml"), "schema_version = 1\n");
    assert.throws(() => checkNoScope(directory), /scope companion/u);
  });
});
