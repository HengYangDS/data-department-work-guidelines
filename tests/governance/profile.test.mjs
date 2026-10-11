import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml, stringify as stringifyToml } from "smol-toml";
import { checkProfile } from "../../tools/docs/governance.mjs";
import { root } from "../../tools/runtime.mjs";
import { fixture } from "./fixtures.mjs";

function profileFixture(run) {
  return fixture((directory) => {
    mkdirSync(path.join(directory, "tools", "docs"), { recursive: true });
    cpSync(
      path.join(root, "tools", "docs", "cli.mjs"),
      path.join(directory, "tools", "docs", "cli.mjs"),
    );
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    return run(directory);
  });
}

function changedRegistry(directory, change) {
  const file = path.join(directory, ".ethos", "gates.toml");
  const registry = parseToml(readFileSync(file, "utf8"));
  change(registry);
  writeFileSync(file, stringifyToml(registry));
}

function rejectRegistry(change, pattern = /native document gate contract/u) {
  profileFixture((directory) => {
    changedRegistry(directory, change);
    assert.throws(() => checkProfile(directory), pattern);
  });
}

function changeGate(id, key, value) {
  return (registry) => {
    registry.gates.find((gate) => gate.id === id)[key] = value;
  };
}

test("publication verification declares the complete local tool graph", () => {
  const release = parseToml(
    readFileSync(path.join(root, ".ethos/release.toml"), "utf8"),
  );
  assert.equal(
    release.publication.local_verification_command,
    "node tools/docs/cli.mjs verify",
  );
});

test("one native registry preserves two roots independently of declaration order", () => {
  profileFixture((directory) => {
    const profile = parseToml(
      readFileSync(path.join(directory, ".ethos/profile.toml"), "utf8"),
    );
    assert.deepEqual(
      { ...profile.proof },
      { gate_registry: ".ethos/gates.toml" },
    );
    assert.doesNotThrow(() => checkProfile(directory));
    changedRegistry(directory, (registry) => {
      registry.gates.reverse();
      registry.proof_sets.default.reverse();
      registry.proof_sets.full.reverse();
    });
    assert.doesNotThrow(() => checkProfile(directory));
  });
});

test("profile rejects inline proof declarations beside its native registry", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos/profile.toml");
    const original = parseToml(readFileSync(file, "utf8"));
    for (const [key, value] of [
      ["code_correctness_gates", ["docs-integrity", "markdown-format"]],
      ["code_correctness_map", { behavior: "docs-integrity" }],
      ["gates", []],
    ]) {
      const profile = structuredClone(original);
      profile.proof[key] = value;
      writeFileSync(file, stringifyToml(profile));
      assert.throws(() => checkProfile(directory), /one native gate registry/u);
    }
  });
});

test("the provider prerequisite cannot become a third root or replace a document root", () => {
  for (const change of [
    (registry) => registry.proof_sets.default.push("code-behavior"),
    (registry) => {
      registry.proof_sets.full = ["markdown-format"];
    },
    (registry) => registry.gates.push({ ...registry.gates[0], id: "extra" }),
  ])
    rejectRegistry(change, /proof floor|native prerequisite/u);
});

test("behavior evidence owns its test attempt rather than a document invocation", () => {
  for (const change of [
    (registry) => {
      registry.gates[0].verification_providers = registry.gates[2].providers;
    },
    (registry) => {
      registry.gates[2].command = registry.gates[0].command;
    },
    (registry) => {
      registry.gates[2].providers = [];
    },
    (registry) => {
      registry.gates[0].depends_on = [];
    },
  ])
    rejectRegistry(change);
});

test("native gates preserve axes, trust, offline policy, and the total behavior budget", () => {
  for (const [id, key, value] of [
    ["docs-integrity", "kind", "lint"],
    ["docs-integrity", "evidence_class", "contract"],
    ["docs-integrity", "trust_bearing", false],
    ["markdown-format", "network_policy", "online"],
    ["markdown-format", "dimensions", ["behavior"]],
    ["markdown-format", "verification_providers", []],
    ["code-behavior", "execution_mode", "subprocess"],
    ["code-behavior", "timeout_seconds", 600],
    ["code-behavior", "cpu_reservation", 1],
  ])
    rejectRegistry(changeGate(id, key, value));
});

test("profile admits every tracked candidate without an enumerated path list", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos/profile.toml");
    const profile = parseToml(readFileSync(file, "utf8"));
    profile.openspec.material_paths = ["docs/**"];
    writeFileSync(file, stringifyToml(profile));
    assert.throws(() => checkProfile(directory), /all tracked candidates/u);
  });
});

test("registry and document entrypoints may move without changing their contract", () => {
  profileFixture((directory) => {
    const profileFile = path.join(directory, ".ethos/profile.toml");
    const profile = parseToml(readFileSync(profileFile, "utf8"));
    const registryFile = path.join(directory, ".ethos/quality.toml");
    cpSync(path.join(directory, ".ethos/gates.toml"), registryFile);
    profile.proof.gate_registry = ".ethos/quality.toml";
    writeFileSync(profileFile, stringifyToml(profile));
    const entry = path.join(directory, "tools/docs/verification.mjs");
    cpSync(path.join(directory, "tools/docs/cli.mjs"), entry);
    writeFileSync(
      registryFile,
      readFileSync(registryFile, "utf8").replaceAll(
        "tools/docs/cli.mjs",
        "tools/docs/verification.mjs",
      ),
    );
    assert.doesNotThrow(() => checkProfile(directory));
    assert.deepEqual(
      readFileSync(entry),
      readFileSync(path.join(root, "tools/docs/cli.mjs")),
    );
  });
});

test("the registry must be selected regular source, not ignored or linked state", () => {
  profileFixture((directory) => {
    const profileFile = path.join(directory, ".ethos/profile.toml");
    const profile = parseToml(readFileSync(profileFile, "utf8"));
    const registryFile = path.join(directory, ".ethos/gates.toml");
    const registry = readFileSync(registryFile);
    rmSync(registryFile);
    assert.throws(() => checkProfile(directory), /repository source/u);
    mkdirSync(path.join(directory, "build"));
    writeFileSync(path.join(directory, "build/gates.toml"), registry);
    writeFileSync(path.join(directory, ".gitignore"), "/build/\n");
    profile.proof.gate_registry = "build/gates.toml";
    writeFileSync(profileFile, stringifyToml(profile));
    assert.throws(() => checkProfile(directory), /repository source/u);
    profile.proof.gate_registry = ".ethos/gates.toml";
    writeFileSync(profileFile, stringifyToml(profile));
    writeFileSync(registryFile, registry);
    assert.doesNotThrow(() => checkProfile(directory));
    symlinkSync(
      path.join(root, ".ethos"),
      path.join(directory, "linked"),
      "junction",
    );
    profile.proof.gate_registry = "linked/gates.toml";
    writeFileSync(profileFile, stringifyToml(profile));
    assert.throws(() => checkProfile(directory), Error);
    assert.deepEqual(readFileSync(registryFile), registry);
  });
});

test("document commands require selected regular source rather than a remembered path", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos/gates.toml");
    const original = readFileSync(file, "utf8");
    const entry = path.join(directory, "tools/docs/cli.mjs");
    const source = readFileSync(entry);
    rmSync(entry);
    assert.throws(() => checkProfile(directory), /repository source/u);
    mkdirSync(path.join(directory, "build"));
    writeFileSync(path.join(directory, "build/verification.mjs"), source);
    writeFileSync(path.join(directory, ".gitignore"), "/build/\n");
    writeFileSync(
      file,
      original.replaceAll("tools/docs/cli.mjs", "build/verification.mjs"),
    );
    assert.throws(() => checkProfile(directory), /repository source/u);
    writeFileSync(entry, source);
    writeFileSync(file, original);
    assert.doesNotThrow(() => checkProfile(directory));
    symlinkSync(
      path.join(root, "tools/docs"),
      path.join(directory, "linked"),
      "junction",
    );
    writeFileSync(
      file,
      original.replaceAll("tools/docs/cli.mjs", "linked/cli.mjs"),
    );
    const linked = readFileSync(file, "utf8");
    assert.throws(() => checkProfile(directory), Error);
    assert.equal(readFileSync(file, "utf8"), linked);
    assert.deepEqual(readFileSync(entry), source);
  });
});

test("document gates retain direct portable Node invocation and their distinct arguments", () => {
  for (const [id, command] of [
    ["docs-integrity", ["bash", "scripts/validate-docs.sh"]],
    ["docs-integrity", [process.execPath, "tools/docs/cli.mjs", "check"]],
    ["docs-integrity", ["node", "--eval", "process.exit(0)"]],
    [
      "docs-integrity",
      ["node", path.join(root, "tools/docs/cli.mjs"), "check"],
    ],
    ["docs-integrity", ["node", "../tools/docs/cli.mjs", "check"]],
    ["docs-integrity", ["node", "tools/\0docs/cli.mjs", "check"]],
    ["docs-integrity", ["node", "tools/docs/cli.mjs", "verify"]],
    ["markdown-format", ["node", "tools/docs/cli.mjs", "format"]],
  ])
    rejectRegistry(changeGate(id, "command", command), /portable repository/u);
});
