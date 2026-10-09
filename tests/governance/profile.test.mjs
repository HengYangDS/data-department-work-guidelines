import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import { checkProfile } from "../../tools/docs/governance.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { fixture } from "./fixtures.mjs";

test("publication verification declares the complete local tool graph", () => {
  const release = parseToml(
    readFileSync(path.join(root, ".ethos/release.toml"), "utf8"),
  );
  assert.equal(
    release.publication.local_verification_command,
    "node tools/docs/cli.mjs verify",
  );
});

test("profile rejects a third proof gate and an old shell entrypoint", () => {
  fixture((directory) => {
    checkProfile(directory);
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace(
        'code_correctness_gates = ["docs-integrity", "markdown-format"]',
        'code_correctness_gates = ["docs-integrity", "markdown-format", "governance-lifecycle"]',
      ),
    );
    assert.throws(() => checkProfile(directory), /proof floor/u);
    writeFileSync(
      file,
      original.replace(
        'command = ["node", "tools/docs/cli.mjs", "check"]',
        'command = ["bash", "scripts/validate-docs.sh"]',
      ),
    );
    assert.throws(
      () => checkProfile(directory),
      /portable repository entrypoint/u,
    );
  });
});

test("profile requires product-owned native evidence on both document gates", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    const behavior =
      'verification_providers = ["ethos.adapters.gates.code_quality:behavior_report"]';
    const staticAnalysis =
      'verification_providers = ["ethos.adapters.gates.code_quality:static_report"]';
    assert.ok(original.includes(behavior));
    assert.ok(original.includes(staticAnalysis));
    writeFileSync(file, original.replace(`${behavior}\n`, ""));
    assert.throws(
      () => checkProfile(directory),
      /native verification provider/u,
    );
    writeFileSync(file, original.replace(staticAnalysis, behavior));
    assert.throws(
      () => checkProfile(directory),
      /native verification provider/u,
    );
  });
});

test("profile preserves the dimensions and trust boundary of its native gates", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = parseToml(readFileSync(file, "utf8"));
    assert.doesNotThrow(() => checkProfile(directory));
    const changes = [
      (profile) => {
        profile.proof.code_correctness_map.behavior = "markdown-format";
      },
      (profile) => {
        profile.proof.gates[0].kind = "lint";
      },
      (profile) => {
        profile.proof.gates[1].network_policy = "online";
      },
      (profile) => {
        profile.proof.gates[0].trust_bearing = false;
      },
      (profile) => {
        profile.proof.gates[0].evidence_class = "contract";
      },
    ];
    for (const change of changes) {
      const altered = structuredClone(original);
      change(altered);
      writeFileSync(file, stringifyToml(altered));
      assert.throws(
        () => checkProfile(directory),
        /proof dimensions|native document gate contract/u,
      );
    }
    writeFileSync(file, stringifyToml(original));
    assert.doesNotThrow(() => checkProfile(directory));
  });
});

test("profile admits every tracked candidate without an enumerated path list", () => {
  fixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    writeFileSync(
      file,
      original.replace(
        'material_paths = ["**"]',
        'material_paths = ["docs/**"]',
      ),
    );
    assert.throws(() => checkProfile(directory), /all tracked candidates/u);
  });
});
