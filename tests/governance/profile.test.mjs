import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import { root } from "../../tools/runtime.mjs";

test("DDWG verification uses the installed full native graph", () => {
  const manifest = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );
  const release = parseToml(
    readFileSync(path.join(root, ".ethos/release.toml"), "utf8"),
  );
  assert.equal(
    manifest.scripts.verify,
    "ethos prove --host --execute --full --json",
  );
  assert.equal(
    release.publication.local_verification_command,
    manifest.scripts.verify,
  );
  assert.equal(Object.hasOwn(manifest.scripts, "test"), false);
});

test("DDWG keeps two roots and product-owned Markdown and code observations", () => {
  const registry = parseToml(
    readFileSync(path.join(root, ".ethos/gates.toml"), "utf8"),
  );
  assert.deepEqual(registry.proof_sets.default, [
    "docs-integrity",
    "markdown-format",
  ]);
  assert.deepEqual(registry.proof_sets.full, registry.proof_sets.default);
  const gates = new Map(registry.gates.map((gate) => [gate.id, gate]));
  assert.deepEqual(gates.get("docs-integrity").depends_on, ["code-behavior"]);
  assert.deepEqual(gates.get("code-behavior").providers, [
    "ethos.adapters.gates.code_quality:behavior_report",
  ]);
  assert.deepEqual(gates.get("markdown-format").verification_providers, [
    "ethos.adapters.gates.code_quality:static_report",
  ]);
});
