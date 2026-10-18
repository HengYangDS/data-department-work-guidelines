import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import { root } from "../../tools/runtime.mjs";

test("DDWG verification uses the installed full native graph", () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  const release = parseToml(readFileSync(path.join(root, ".ethos/release.toml"), "utf8"));
  assert.equal(manifest.scripts.verify, "ethos prove --host --execute --full --json");
  assert.equal(release.publication.local_verification_command, manifest.scripts.verify);
  assert.equal(Object.hasOwn(manifest.scripts, "test"), false);
});

test("DDWG keeps two roots and product-owned Markdown and code observations", () => {
  const { proof } = parseToml(readFileSync(path.join(root, ".ethos/profile.toml"), "utf8"));
  assert.deepEqual(proof.code_correctness_gates, ["docs-integrity", "markdown-format"]);
  assert.equal(Object.hasOwn(proof, "gate_registry"), false);
  assert.equal(existsSync(path.join(root, ".ethos/gates.toml")), false);
  assert.deepEqual(
    { ...proof.code_correctness_map },
    {
      behavior: "code-behavior",
      "static-analysis": "markdown-format",
    },
  );
  const gates = new Map(proof.gates.map((gate) => [gate.id, gate]));
  assert.equal(gates.size, proof.gates.length);
  assert.deepEqual(gates.get("docs-integrity").command, ["node", "tools/docs/cli.mjs", "check"]);
  assert.deepEqual(gates.get("docs-integrity").depends_on, ["code-behavior", "document-registry"]);
  assert.deepEqual(gates.get("markdown-format").command, [
    "node",
    "tools/docs/cli.mjs",
    "format",
    "--check",
  ]);
  assert.deepEqual(gates.get("document-registry").providers, [
    "ethos.surface.cli.root.reference:docs_registry_report",
  ]);
  assert.equal(Object.hasOwn(gates.get("document-registry"), "command"), false);
  assert.equal(gates.get("code-behavior").timeout_seconds, 180);
  assert.equal(gates.get("code-behavior").cpu_reservation, 2);
  assert.deepEqual(gates.get("code-behavior").providers, [
    "ethos.adapters.gates.code_quality:behavior_report",
  ]);
  assert.deepEqual(gates.get("markdown-format").verification_providers, [
    "ethos.adapters.gates.code_quality:static_report",
  ]);
});
