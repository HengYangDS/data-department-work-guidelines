import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
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
import { root } from "../../tools/docs/runtime.mjs";
import { assertFixtureSources } from "../source/fixtures.mjs";

test("native TOML formatting checks literal Git paths and preserves data", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-toml-format-"));
  try {
    writeFileSync(
      path.join(directory, ".gitignore"),
      readFileSync(path.join(root, ".gitignore"), "utf8") +
        "\n/tools/\n/.config/\n/package.json\n/node_modules\n",
    );
    cpSync(path.join(root, "tools"), path.join(directory, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package.json"),
      path.join(directory, "package.json"),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const name = "{literal} source.toml";
    const file = path.join(directory, name);
    const source = 'literal = """\nfirst\n\n\nsecond\n"""\n\n\nnext=2\n';
    writeFileSync(file, source);
    mkdirSync(path.join(directory, "build"));
    writeFileSync(path.join(directory, "build", "cache.toml"), "broken = [\n");
    writeFileSync(path.join(directory, "taplo.toml"), "include = []\n");
    writeFileSync(
      path.join(directory, "dprint.json"),
      '{ "excludes": ["**"] }\n',
    );
    const init = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(init.status, 0, init.stderr);
    const add = spawnSync("git", ["add", "--", name], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(add.status, 0, add.stderr);
    assertFixtureSources(directory, [
      ".gitignore",
      name,
      "dprint.json",
      "taplo.toml",
    ]);
    const invoke = (args) =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "format", ...args], {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
      });
    const checked = invoke(["--check"]);
    assert.ifError(checked.error);
    assert.equal(checked.status, 1, checked.stderr);
    assert.ok(checked.stderr.includes(name), checked.stderr);
    assert.equal(readFileSync(file, "utf8"), source);
    const written = invoke([]);
    assert.ifError(written.error);
    assert.equal(written.status, 0, written.stderr);
    assert.equal(
      readFileSync(file, "utf8"),
      'literal = """\nfirst\n\n\nsecond\n"""\n\nnext = 2\n',
    );
    const clean = invoke(["--check"]);
    assert.ifError(clean.error);
    assert.equal(clean.status, 0, clean.stderr);
    for (const malformed of ["[invalid\n", "value = 1\nvalue = 2\n"]) {
      writeFileSync(file, malformed);
      const invalid = invoke(["--check"]);
      assert.ifError(invalid.error);
      assert.equal(invalid.status, 1, invalid.stderr);
      assert.ok(invalid.stderr.includes(name), invalid.stderr);
      assert.equal(readFileSync(file, "utf8"), malformed);
    }
    const retained =
      '#:schema offline-only\nliteral = """\nfirst\n\n\nsecond\n"""\n\nitems = [2, 1]\n\nz = 2\na = 1\n';
    writeFileSync(file, retained);
    const preserved = invoke([]);
    assert.ifError(preserved.error);
    assert.equal(preserved.status, 0, preserved.stderr);
    assert.equal(readFileSync(file, "utf8"), retained);
    const policy = path.join(directory, ".config/checks/format/toml.toml");
    const policyBefore = readFileSync(policy, "utf8");
    writeFileSync(policy, `${policyBefore}unknownNativeOption = true\n`);
    const diagnostic = invoke(["--check"]);
    assert.ifError(diagnostic.error);
    assert.equal(diagnostic.status, 1, diagnostic.stderr);
    assert.match(diagnostic.stderr, /unknownNativeOption/u);
    assert.equal(readFileSync(file, "utf8"), retained);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("native formatting policy preserves prose and ignores ambient editor settings", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-format-policy-"));
  try {
    const tomlRelative = ".config/checks/markdown/markdownlint.toml";
    cpSync(path.join(root, "tools"), path.join(directory, "tools"), {
      recursive: true,
    });
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    const manifest = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    );
    delete manifest.prettier;
    writeFileSync(
      path.join(directory, "package.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    writeFileSync(
      path.join(directory, ".editorconfig"),
      "root = true\n\n[*]\nindent_size = 8\nmax_line_length = 20\n",
    );
    const sentence = "Keep the report readable without changing its meaning.";
    writeFileSync(
      path.join(directory, "README.md"),
      `# Report\n\n${sentence}\n`,
    );
    writeFileSync(
      path.join(directory, "sample.json"),
      '{"result":{"ready":true}}\n',
    );
    const sources = new Map([
      ["sample.mjs", "export const result={ready:true}\n"],
      ["nested/sample.cjs", "module.exports={ready:true}\n"],
      [
        "nested/sample.ts",
        "export const result:{ready:boolean}={ready:true}\n",
      ],
      ["build/tracked.mjs", "export const result={ready:true}\n"],
      ["build/tracked.json", '{"result":{"ready":true}}\n'],
      ["build/tracked.yml", "ready:    true\n"],
      ["quote source.md", "# Report\n\n> First.\n>\n>\n> Second.\n"],
      ["nested quote.md", "# Report\n\n> > First.\n> >\n> >\n> > Second.\n"],
      ["quote boundary.md", "# Report\n\nText.\n> Quoted.\n"],
      [
        "openspec/changes/archive/fixture/design.md",
        "# Historical Design\n\nUse   the report.\n",
      ],
      [".worktrees/tracked.md", "# Source\n\nUse   the report.\n"],
      [
        ".worktrees/node_modules/tracked.mjs",
        "export const result={ready:true}\n",
      ],
    ]);
    writeFileSync(
      path.join(directory, ".gitignore"),
      "node_modules/\nbuild/\n.worktrees/\n/tools/\n/.config/\n/package.json\n/node_modules\n",
    );
    writeFileSync(
      path.join(directory, ".prettierignore"),
      `${[...sources.keys()].join("\n")}\n`,
    );
    for (const [relative, source] of sources) {
      const target = path.join(directory, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      writeFileSync(target, source);
    }
    const added = spawnSync(
      "git",
      [
        "add",
        "--force",
        "--",
        tomlRelative,
        ...[...sources.keys()].filter(
          (relative) =>
            relative.startsWith("build/") || relative.startsWith(".worktrees/"),
        ),
      ],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(added.error);
    assert.equal(added.status, 0, added.stderr);
    const ignored = path.join(directory, "build", "ignored.mjs");
    const ignoredSource = "export const result={ready:true}\n";
    writeFileSync(ignored, ignoredSource);
    const literals = new Map([
      ["literal.md", "# Report\n\n> ```text\n> first\n>\n>\n> second\n> ```\n"],
      [
        "byte-exact.md",
        "# Report\n\n<!-- prettier-ignore -->\n```js\nconst value={ready:true}\n```\n",
      ],
      ["byte-exact-heading.md", "<!-- prettier-ignore -->\n#  Report\n"],
      [
        "byte-exact-table.md",
        "# Report\n\n<!-- prettier-ignore -->\n| first |second|\n| --- | --- |\n| input |output|\n",
      ],
      ["literal.mjs", "export const literal = `first\n\n\nsecond`;\n"],
      ["literal.yaml", "literal: |\n  first\n\n\n  second\n"],
    ]);
    for (const [relative, source] of literals) {
      writeFileSync(path.join(directory, relative), source);
    }
    const nativeToml = path.join(directory, tomlRelative);
    const tomlBefore = readFileSync(nativeToml, "utf8");
    assertFixtureSources(directory, [
      ".editorconfig",
      ".gitignore",
      ".prettierignore",
      "README.md",
      "sample.json",
      tomlRelative,
      ...sources.keys(),
      ...literals.keys(),
    ]);
    const checked = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format", "--check"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(checked.error);
    assert.equal(checked.status, 1, checked.stderr);
    for (const relative of sources.keys()) {
      assert.ok(
        checked.stderr.replaceAll("\\", "/").includes(relative),
        `format check omitted ${relative}: ${checked.stderr}`,
      );
    }
    const result = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format"],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
      },
    );
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(path.join(directory, "README.md"), "utf8"),
      `# Report\n\n${sentence}\n`,
    );
    assert.equal(
      readFileSync(path.join(directory, "sample.json"), "utf8"),
      '{ "result": { "ready": true } }\n',
    );
    for (const [relative, source] of sources) {
      assert.notEqual(
        readFileSync(path.join(directory, relative), "utf8"),
        source,
        relative,
      );
    }
    assert.equal(readFileSync(ignored, "utf8"), ignoredSource);
    for (const [relative, source] of literals) {
      assert.equal(
        readFileSync(path.join(directory, relative), "utf8"),
        source,
      );
    }
    assert.equal(
      readFileSync(path.join(directory, "quote source.md"), "utf8"),
      "# Report\n\n> First.\n>\n> Second.\n",
    );
    assert.equal(
      readFileSync(path.join(directory, "nested quote.md"), "utf8"),
      "# Report\n\n> > First.\n> >\n> > Second.\n",
    );
    assert.equal(
      readFileSync(path.join(directory, "quote boundary.md"), "utf8"),
      "# Report\n\nText.\n\n> Quoted.\n",
    );
    assert.equal(readFileSync(nativeToml, "utf8"), tomlBefore);
    const repaired = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format", "--check"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(repaired.error);
    assert.equal(repaired.status, 0, repaired.stderr);
    const inventory = spawnSync("git", ["ls-files", "-z"], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(inventory.error);
    assert.equal(inventory.status, 0, inventory.stderr);
    const selected = inventory.stdout.split("\0").filter(Boolean);
    const firstPass = new Map(
      selected.map((relative) => [
        relative,
        readFileSync(path.join(directory, relative)),
      ]),
    );
    const secondPass = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(secondPass.error);
    assert.equal(secondPass.status, 0, secondPass.stderr);
    for (const [relative, bytes] of firstPass)
      assert.deepEqual(readFileSync(path.join(directory, relative)), bytes);
    const nonSpacing = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "lint"],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(nonSpacing.error);
    assert.equal(nonSpacing.status, 0, nonSpacing.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
