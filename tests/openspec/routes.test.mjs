import assert from "node:assert/strict";
import { mkdirSync, mkdtempDisposableSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkNoScope } from "../../tools/docs/governance.mjs";

test("active Changes reject a private scope companion", () => {
  using directory = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-scope-test-"));
  assert.doesNotThrow(() => checkNoScope(directory.path));
  const change = path.join(directory.path, "openspec", "changes", "fixture");
  mkdirSync(change, { recursive: true });
  writeFileSync(path.join(change, "scope.toml"), "schema_version = 1\n");
  assert.throws(() => checkNoScope(directory.path), /scope companion/u);
});
