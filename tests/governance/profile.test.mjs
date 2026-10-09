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
import { root } from "../../tools/docs/runtime.mjs";
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
  profileFixture((directory) => {
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
  profileFixture((directory) => {
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
  profileFixture((directory) => {
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
  profileFixture((directory) => {
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

test("profile accepts a different relative source without changing gate meaning", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    const entry = path.join(directory, "tools", "docs", "verification.mjs");
    cpSync(path.join(directory, "tools", "docs", "cli.mjs"), entry);
    assert.deepEqual(
      readFileSync(entry),
      readFileSync(path.join(directory, "tools", "docs", "cli.mjs")),
    );
    writeFileSync(
      file,
      original.replaceAll("tools/docs/cli.mjs", "tools/docs/verification.mjs"),
    );
    assert.doesNotThrow(() => checkProfile(directory));
  });
});

test("profile requires selected regular source rather than a remembered path", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = readFileSync(file, "utf8");
    rmSync(path.join(directory, "tools", "docs", "cli.mjs"));
    assert.throws(() => checkProfile(directory), /repository source/u);

    mkdirSync(path.join(directory, "build"));
    cpSync(
      path.join(root, "tools", "docs", "cli.mjs"),
      path.join(directory, "build", "verification.mjs"),
    );
    writeFileSync(path.join(directory, ".gitignore"), "/build/\n");
    writeFileSync(
      file,
      original.replaceAll("tools/docs/cli.mjs", "build/verification.mjs"),
    );
    assert.throws(() => checkProfile(directory), /repository source/u);

    symlinkSync(
      path.join(root, "tools", "docs"),
      path.join(directory, "linked"),
      "junction",
    );
    writeFileSync(
      file,
      original.replaceAll("tools/docs/cli.mjs", "linked/cli.mjs"),
    );
    assert.throws(() => checkProfile(directory), /repository source/u);
  });
});

test("profile retains direct Node source invocation and each gate's arguments", () => {
  profileFixture((directory) => {
    const file = path.join(directory, ".ethos", "profile.toml");
    const original = parseToml(readFileSync(file, "utf8"));
    const invalidCommands = [
      [0, [process.execPath, "tools/docs/cli.mjs", "check"]],
      [0, ["node", "--eval", "process.exit(0)"]],
      [0, ["node", path.join(directory, "tools", "docs", "cli.mjs"), "check"]],
      [0, ["node", "../tools/docs/cli.mjs", "check"]],
      [0, ["node", "tools/docs/cli.mjs", "verify"]],
      [1, ["node", "tools/docs/cli.mjs", "format"]],
    ];
    for (const [index, command] of invalidCommands) {
      const altered = structuredClone(original);
      altered.proof.gates[index].command = command;
      writeFileSync(file, stringifyToml(altered));
      assert.throws(
        () => checkProfile(directory),
        /portable repository entrypoint/u,
      );
    }
  });
});
