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
import { parse as parseToml } from "smol-toml";
import * as governance from "../tools/docs/governance.mjs";
import {
  checkLineEndingAttributes,
  checkLicense,
  checkNavigation,
  checkProfile,
} from "../tools/docs/governance.mjs";
import { root } from "../tools/docs/runtime.mjs";

function fixture(run) {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-governance-test-"),
  );
  try {
    cpSync(path.join(root, "docs"), path.join(directory, "docs"), {
      recursive: true,
    });
    mkdirSync(path.join(directory, ".ethos"));
    cpSync(
      path.join(root, ".ethos", "profile.toml"),
      path.join(directory, ".ethos", "profile.toml"),
    );
    for (const name of ["README.md", "AGENTS.md"]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

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

test("OpenSpec entry selects only the locked portable CLI", () => {
  const source = readFileSync(path.join(root, "openspec", "README.md"), "utf8");
  const expected =
    "node node_modules/@fission-ai/openspec/bin/openspec.js validate --all --strict --json";
  const requirePortableCommand = (text) => {
    const commands = text
      .split(/\r?\n/u)
      .filter((line) => line.endsWith("validate --all --strict --json"));
    assert.deepEqual(commands, [expected], "locked portable OpenSpec CLI");
  };
  requirePortableCommand(source);
  for (const invalid of [
    "node_modules/.bin/openspec validate --all --strict --json",
    "openspec validate --all --strict --json",
    "npm exec --offline -- openspec validate --all --strict --json",
    "npm exec --no --package=@fission-ai/openspec -- openspec validate --all --strict --json",
    "npm exec --offline --no -- openspec validate --all --strict --json",
    "npm exec --offline --no --package=@fission-ai/openspec -- openspec validate --all --strict --json",
  ]) {
    assert.throws(
      () => requirePortableCommand(source.replace(expected, invalid)),
      /locked portable OpenSpec CLI/u,
    );
  }
});

test("the documented official CLI cannot borrow an npm cache", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-openspec-entry-"));
  try {
    const cache = path.join(directory, "npm-cache", "_npx", "unrelated");
    mkdirSync(path.join(cache, "node_modules", ".bin"), { recursive: true });
    const marker = path.join(directory, "ambient-cli-ran");
    writeFileSync(
      path.join(cache, "node_modules", ".bin", "openspec"),
      `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'ran');`,
    );
    const result = spawnSync(
      process.execPath,
      ["node_modules/@fission-ai/openspec/bin/openspec.js", "--version"],
      {
        cwd: directory,
        env: { ...process.env, npm_config_cache: path.dirname(cache) },
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /MODULE_NOT_FOUND/u);
    assert.equal(existsSync(marker), false);
    const installed = spawnSync(
      process.execPath,
      [
        path.join(root, "node_modules/@fission-ai/openspec/bin/openspec.js"),
        "--version",
      ],
      { cwd: root, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(installed.error);
    assert.equal(installed.status, 0);
    const locked = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ).devDependencies["@fission-ai/openspec"];
    assert.equal(installed.stdout.trim(), locked);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("navigation rejects a missing map, repeated root topic, and missing reader cue", () => {
  fixture((directory) => {
    checkNavigation(directory);
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    writeFileSync(
      entry,
      original.replace("(docs/README.md)", "(docs/missing.md)"),
    );
    assert.throws(() => checkNavigation(directory), /missing task routes/u);
    writeFileSync(entry, `${original}\n[Duplicate](docs/charter.md)\n`);
    assert.throws(() => checkNavigation(directory), /repeats topic routes/u);
    writeFileSync(entry, original);
    const topic = path.join(directory, "docs", "decide.md");
    writeFileSync(
      topic,
      readFileSync(topic, "utf8").replace("**When to use:**", "**Read this:**"),
    );
    assert.throws(() => checkNavigation(directory), /missing reader entry/u);
  });
});

test("navigation requires a rendered link rather than an example or image", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    assert.ok(original.includes(route));
    for (const replacement of [
      `\`${route}\``,
      `\n\n\`\`\`text\n${route}\n\`\`\`\n\n`,
      `<!-- ${route} -->`,
      `!${route}`,
      "![Preview with [documentation map](docs/README.md)](preview.png)",
      "\\[documentation map](docs/README.md)",
      "[documentation map](https://example.test/docs/README.md)",
      "the documentation map\n\n[unused]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: https://example.test/\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation resolves native link destinations and first reference definitions", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      '[documentation map](docs/README.md "Task map")',
      "[documentation map](<docs/README.md>)",
      "[documentation map](./docs/README.md)",
      "[documentation map](docs/README.md#start-with-the-work-question)",
      "[documentation map](docs/REA&#68;ME.md)",
      "[documentation map](docs/%52EADME.md)",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md",
      "[documentation map][SS]\n\n[ß]: docs/README.md",
      "[documentation map][ß]\n\n[SS]: docs/README.md",
      "[documentation map][TASK MAP]\n\n[task map]: docs/README.md",
      "[documentation map][]\n\n[documentation map]: docs/README.md",
      "[documentation map]\n\n[documentation map]: docs/README.md",
      "[documentation map][task-map]\n\n[task-map]: docs/README.md\n\n[task-map]: https://example.test/",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation rejects anchors without readable rendered content", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[](docs/README.md)",
      '[ ](docs/README.md "Task map")',
      "[\n\t](docs/README.md)",
      "[&#32;&nbsp;](docs/README.md)",
      "[\u200b\u2060\u00ad](docs/README.md)",
      "[ ][task-map]\n\n[task-map]: docs/README.md",
      "[![](preview.png)](docs/README.md)",
      "[![&#32;&nbsp;](preview.png)](docs/README.md)",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing task routes/u,
        replacement,
      );
    }
  });
});

test("navigation preserves formatted text and descriptive linked-image labels", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    const route = "[documentation map](docs/README.md)";
    for (const replacement of [
      "[**Task** `map`](docs/README.md)",
      "[&#84;ask map](docs/README.md)",
      "[\u200bTask map\u2060](docs/README.md)",
      "[![Task map](preview.png)](docs/README.md)",
      "[![&#84;ask map](preview.png)][task-map]\n\n[task-map]: docs/README.md",
    ]) {
      writeFileSync(entry, original.replace(route, replacement));
      assert.doesNotThrow(() => checkNavigation(directory), replacement);
    }
  });
});

test("navigation detects real duplicate topic routes without counting examples", () => {
  fixture((directory) => {
    const entry = path.join(directory, "README.md");
    const original = readFileSync(entry, "utf8");
    for (const duplicate of [
      '[Charter](docs/charter.md "Charter")',
      "[Charter](./docs/charter.md)",
      "[Charter](docs/char&#116;er.md)",
      "[Charter][charter]\n\n[charter]: docs/charter.md",
      "[Charter][SS]\n\n[ß]: docs/charter.md",
    ]) {
      writeFileSync(entry, `${original}\n${duplicate}\n`);
      assert.throws(
        () => checkNavigation(directory),
        /repeats topic routes/u,
        duplicate,
      );
    }
    for (const example of [
      "`[Charter](docs/charter.md)`",
      "<!-- [Charter](docs/charter.md) -->",
      "```text\n[Charter](docs/charter.md)\n```",
    ]) {
      writeFileSync(entry, `${original}\n${example}\n`);
      assert.doesNotThrow(() => checkNavigation(directory), example);
    }
  });
});

test("navigation requires the reader cue in the visible topic opening", () => {
  fixture((directory) => {
    const topic = path.join(directory, "docs", "decide.md");
    const original = readFileSync(topic, "utf8");
    for (const replacement of [
      "`**When to use:**`",
      "<!-- **When to use:** -->",
      "\n\n```text\n**When to use:**\n```\n\n",
      "![When to use:](../README.md)",
    ]) {
      writeFileSync(topic, original.replace("**When to use:**", replacement));
      assert.throws(
        () => checkNavigation(directory),
        /missing reader entry/u,
        replacement,
      );
    }
    writeFileSync(topic, original.replace("**When to use:**", "When to use:"));
    assert.doesNotThrow(() => checkNavigation(directory));
  });
});

test("MIT license, entry, and package metadata must agree", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-license-test-"));
  try {
    for (const name of [
      "LICENSE",
      "README.md",
      "package.json",
      "package-lock.json",
    ]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    assert.doesNotThrow(() => checkLicense(directory));

    const license = path.join(directory, "LICENSE");
    const originalLicense = readFileSync(license, "utf8");
    writeFileSync(
      license,
      originalLicense.replace("MIT License", "Apache License"),
    );
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    writeFileSync(license, originalLicense);
    writeFileSync(
      license,
      originalLicense.replace("without restriction", "with restrictions"),
    );
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    rmSync(license);
    assert.throws(() => checkLicense(directory), /missing MIT LICENSE/u);
    writeFileSync(license, originalLicense);

    const entry = path.join(directory, "README.md");
    const originalEntry = readFileSync(entry, "utf8");
    writeFileSync(
      entry,
      originalEntry.replace("(LICENSE)", "(missing-license)"),
    );
    assert.throws(() => checkLicense(directory), /MIT license link/u);
    writeFileSync(entry, originalEntry);

    const manifest = path.join(directory, "package.json");
    const originalManifest = readFileSync(manifest, "utf8");
    writeFileSync(
      manifest,
      originalManifest.replace('"license": "MIT"', '"license": "Apache-2.0"'),
    );
    assert.throws(() => checkLicense(directory), /MIT package metadata/u);
    writeFileSync(manifest, originalManifest);

    const lock = path.join(directory, "package-lock.json");
    const originalLock = readFileSync(lock, "utf8");
    writeFileSync(
      lock,
      originalLock.replace('"license": "MIT"', '"license": "Apache-2.0"'),
    );
    assert.throws(() => checkLicense(directory), /MIT package metadata/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native commit policy rejects unscoped or vague subjects", () => {
  const workspace = parseToml(
    readFileSync(path.join(root, ".ethos/workspace.toml"), "utf8"),
  );
  assert.equal(workspace.commit_policy.signing_required, true);
  const subject = new RegExp(workspace.commit_policy.subject_pattern);
  for (const valid of [
    "fix(quality): bind fixture identity to its own repository",
    "docs(guidance)!: restore risk-scaled work rules",
    "chore(openspec): archive completed change",
  ]) {
    assert.equal(subject.test(valid), true, valid);
  }
  for (const invalid of [
    "update docs",
    "docs: change everything",
    "WIP",
    "fix(quality): ",
    "fix(quality): vague. ",
  ]) {
    assert.equal(subject.test(invalid), false, invalid);
  }
});

test("Git checkout normalizes text independently of host autocrlf", () => {
  assert.doesNotThrow(() => checkLineEndingAttributes());
  assert.throws(
    () => checkLineEndingAttributes("* text=auto\n"),
    /LF on every host/u,
  );
});

test("configuration has separate native concern owners", () => {
  assert.equal(typeof governance.checkConfigurationLayout, "function");
  assert.doesNotThrow(() => governance.checkConfigurationLayout());
});

function configurationFixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-config-layout-"));
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("configuration rejects mixed ownership, code, duplicates and local state", () => {
  for (const relative of [
    ".config/tools/native.json",
    ".config/checks/markdown/native.json",
    ".config/checks/markdown/rules.mjs",
    ".config/checks/format/prettier.json",
    ".config/checks/links/lychee.ini",
    ".config/supply/native.toml",
    ".config/release/cache/entry",
    ".config/checks/unused/.gitkeep",
  ]) {
    configurationFixture((directory) => {
      const file = path.join(directory, relative);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, "Invalid configuration owner.\n");
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /configuration (?:ownership|layout)/u,
        relative,
      );
    });
  }
});

test("configuration rejects missing native policy owners", () => {
  for (const relative of [
    ".config/checks/format/prettier.toml",
    ".config/checks/links/lychee.toml",
    ".config/checks/markdown/markdownlint.toml",
    ".config/checks/prose/vale.ini",
    ".config/supply/native.json",
    ".config/release/offline-bundle.json",
  ]) {
    configurationFixture((directory) => {
      rmSync(path.join(directory, relative));
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /configuration layout is missing owners/u,
        relative,
      );
    });
  }
});

test("configuration rejects package-embedded policy as a second owner", () => {
  configurationFixture((directory) => {
    writeFileSync(
      path.join(directory, "package.json"),
      JSON.stringify({ prettier: { printWidth: 80 } }),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership.*package/u,
    );
  });
});

test("configuration cannot disable or replace native Markdown policy", () => {
  for (const source of ["[MD013]\nline_length = 0\n", 'globs = ["**"]\n']) {
    configurationFixture((directory) => {
      writeFileSync(
        path.join(directory, ".config/checks/markdown/markdownlint.toml"),
        source,
      );
      assert.throws(
        () => governance.checkConfigurationLayout(directory),
        /preserve native Markdown rule policy/u,
      );
    });
  }
});

test("configuration cannot delegate ownership through a directory link", () => {
  configurationFixture((directory) => {
    const supply = path.join(directory, ".config/supply");
    rmSync(supply, { recursive: true });
    symlinkSync(path.join(root, ".config/supply"), supply, "junction");
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership cannot follow a link/u,
    );
  });
});

test("native Vale resolves equivalent syntax to the single concern-local styles owner", () => {
  configurationFixture((directory) => {
    const config = path.join(directory, ".config/checks/prose/vale.ini");
    const original = readFileSync(config, "utf8");
    writeFileSync(
      config,
      original.replace("StylesPath = styles", "StylesPath=styles"),
    );
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    cpSync(
      path.join(directory, ".config/checks/prose/styles"),
      path.join(directory, "external-styles"),
      { recursive: true },
    );
    writeFileSync(
      config,
      original.replace(
        "StylesPath = styles",
        "StylesPath = ../../../external-styles",
      ),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /configuration ownership.*Vale/u,
    );
  });
});
