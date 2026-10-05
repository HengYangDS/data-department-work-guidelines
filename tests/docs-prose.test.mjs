import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
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
import { syncBuiltinESMExports } from "node:module";
import { test } from "node:test";
import { proseAlerts, checkProse } from "../tools/docs/content.mjs";
import { gitFiles, nativeToolBinary, root } from "../tools/docs/runtime.mjs";

function proseBatch(sources) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-prose-"));
  try {
    const files = sources.map((source, index) => {
      const file = path.join(directory, `sample-${index}.md`);
      writeFileSync(file, source, "utf8");
      return file;
    });
    const alerts = proseAlerts(files);
    return files.map((file, index) => {
      assert.equal(readFileSync(file, "utf8"), sources[index]);
      return alerts[file] ?? [];
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
}

function proseFindings(source) {
  return proseBatch([source])[0];
}

test("native prose spelling rejects a real typo without changing source", () => {
  const [valid, findings] = proseBatch([
    "The result is verified.\n",
    "The result is veriified.\n",
  ]);
  assert.deepEqual(valid, []);
  assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
});

test("native prose refuses process warnings without losing its report", (context) => {
  const actualSpawn = childProcess.spawnSync;
  const output = context.mock.method(process.stdout, "write", () => true);
  let executions = 0;
  let nativeOutput;
  const mock = context.mock.method(
    childProcess,
    "spawnSync",
    (command, args, options) => {
      const result = actualSpawn(command, args, options);
      if (args.includes("--output=JSON")) {
        executions += 1;
        nativeOutput = result.stdout;
        return {
          ...result,
          stderr: `${result.stderr ?? ""}native prose warning\n`,
        };
      }
      return result;
    },
  );
  syncBuiltinESMExports();
  try {
    assert.throws(
      () => proseFindings("The result is verified.\n"),
      /emitted warning output:[\s\S]*native prose warning/u,
    );
    assert.equal(executions, 1);
    assert.equal(output.mock.callCount(), 1);
    assert.equal(output.mock.calls[0].arguments[0], nativeOutput);
  } finally {
    mock.mock.restore();
    output.mock.restore();
    syncBuiltinESMExports();
  }
});

test("native prose ignores ambient global configuration", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-vale-global-"));
  const previousHome = process.env.HOME;
  try {
    writeFileSync(
      path.join(directory, ".vale.ini"),
      "[*.md]\nVale.Spelling = NO\nVale.Repetition = NO\n",
    );
    process.env.HOME = directory;
    const findings = proseFindings(
      "The result is veriified. Use the the report.\n",
    );
    assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
    assert.ok(findings.some(({ Check }) => Check === "Vale.Repetition"));
  } finally {
    if (previousHome === undefined) delete process.env.HOME;
    else process.env.HOME = previousHome;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose ignores inherited Vale configuration and styles paths", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-vale-environment-"),
  );
  const config = process.env.VALE_CONFIG_PATH;
  const styles = process.env.VALE_STYLES_PATH;
  try {
    const disabled = path.join(directory, "disabled.ini");
    writeFileSync(
      disabled,
      "[*.md]\nVale.Spelling = NO\nVale.Repetition = NO\n",
    );
    process.env.VALE_CONFIG_PATH = disabled;
    process.env.VALE_STYLES_PATH = path.join(directory, "empty-styles");
    mkdirSync(process.env.VALE_STYLES_PATH);
    const findings = proseFindings(
      "The result is veriified. Use the the report in order to decide.\n",
    );
    assert.ok(findings.some(({ Check }) => Check === "Vale.Spelling"));
    assert.ok(findings.some(({ Check }) => Check === "Vale.Repetition"));
    assert.ok(findings.some(({ Check }) => Check === "Plain.Concise"));
  } finally {
    if (config === undefined) delete process.env.VALE_CONFIG_PATH;
    else process.env.VALE_CONFIG_PATH = config;
    if (styles === undefined) delete process.env.VALE_STYLES_PATH;
    else process.env.VALE_STYLES_PATH = styles;
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose rules reject repeated words, filler and term variants", () => {
  const findings = proseFindings(
    "Use the the report in order to decide on Github.\n",
  );
  assert.ok(
    findings.some(
      ({ Check, Message }) =>
        Check === "Vale.Repetition" && Message.includes("repeated"),
    ),
  );
  assert.ok(
    findings.some(
      ({ Check, Match }) =>
        Check === "Plain.Concise" && Match === "in order to",
    ),
  );
  assert.ok(findings.some(({ Check }) => Check === "Vale.Terms"));
  assert.ok(findings.every(({ Line, Span }) => Line === 1 && Span[0] > 0));
});

test("native prose reports diagnosed stock phrases without requiring a rewrite", () => {
  const [findings, validProse] = proseBatch([
    "This offers a rich tapestry of insights.\n",
    "This comparison identifies the changed values and their limits.\n",
  ]);
  assert.ok(
    findings.some(
      ({ Check, Match }) =>
        Check === "Plain.StockPhrases" && Match === "rich tapestry of insights",
    ),
  );
  assert.deepEqual(validProse, []);
  const verifyRules = (directory) =>
    spawnSync(
      nativeToolBinary("vale"),
      [
        "--no-global",
        `--config=${path.join(root, ".config/checks/prose/vale.ini")}`,
        "--no-color",
        "--output=JSON",
        "test",
        "--coverage",
        directory,
      ],
      { cwd: root, encoding: "utf8", timeout: 30_000 },
    );
  const style = path.join(root, ".config/checks/prose/styles/Plain");
  const valid = verifyRules(style);
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  const report = JSON.parse(valid.stdout);
  assert.equal(report.failed, 0);
  assert.equal(report.passed, 5);
  assert.ok(report.results.every(({ passed }) => passed));
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-rule-coverage-"));
  try {
    const rules = path.join(directory, "Plain");
    cpSync(style, rules, { recursive: true });
    const defective = path.join(rules, "StockPhrases.yml");
    writeFileSync(
      defective,
      readFileSync(defective, "utf8").replace(
        "  - rich tapestry of insights",
        "  - a phrase absent from every case",
      ),
    );
    const invalid = verifyRules(rules);
    assert.ifError(invalid.error);
    assert.equal(invalid.status, 1, invalid.stderr);
    const findings = JSON.parse(invalid.stdout);
    assert.ok(findings.failed > 0);
    assert.ok(
      findings.results.some(
        ({ name, passed }) =>
          name === "diagnosed stock phrase fires" && !passed,
      ),
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

test("native prose preserves syntax, quoted examples and honest uncertainty", () => {
  assert.deepEqual(
    proseFindings(
      "The request may be rejected when evidence is incomplete.\n\n" +
        "Use `Github in order to` only as a literal token.\n\n" +
        "```text\nGithub in order to use the the API\n```\n\n" +
        "Read [the source](https://example.com/Github/in-order-to).\n",
    ),
    [],
  );
  assert.ok(
    proseFindings("> Utilize Github for a rich tapestry of insights.\n").length,
  );
});

test("the repository prose owner fails on a real current file", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-prose-"));
  try {
    const file = path.join(directory, "current.md");
    writeFileSync(file, "# Current\n\nUse the the report.\n");
    assert.throws(() => checkProse([file]), /Vale\.Repetition.*repeated/u);
    writeFileSync(file, "# Current\n\nUse the report.\n");
    assert.doesNotThrow(() => checkProse([file]));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("native prose preserves domain authority and standard Markdown terms", () => {
  assert.deepEqual(
    proseFindings(
      "Authority to act remains subject to explicit permission.\n\n" +
        "Compare feasible options. Use one blank line between paragraphs.\n\n" +
        "Name the deliverable's format. Inspect the deliverables.\n\n" +
        "Ignored untracked caches remain outside source.\n",
    ),
    [],
  );
  assert.ok(proseFindings("Inspect the delivrables.\n").length > 0);
  assert.ok(proseFindings("Inspect the untraked source.\n").length > 0);
});

test("native repeated-word checks cover headings, emphasis and reader quotes", () => {
  const sources = [
    "# Use the the report\n",
    "Use **the the** report.\n",
    "> Use the the report.\n",
    "Use the **the** report.\n",
  ];
  for (const [index, findings] of proseBatch(sources).entries()) {
    assert.ok(
      findings.some(({ Check }) => Check === "Vale.Repetition"),
      sources[index],
    );
  }
});

test("native prose checks table cells without joining distinct columns", () => {
  const [findings, validTable] = proseBatch([
    "| Duty |\n| --- |\n| Use **the the** report on Github. |\n",
    "| First | Second |\n| --- | --- |\n| the | the |\n| `the the` | Correct |\n",
  ]);
  assert.ok(
    findings.some(
      ({ Check, Line }) => Check === "Vale.Repetition" && Line === 3,
    ),
  );
  assert.ok(findings.some(({ Check }) => Check === "Vale.Terms"));
  assert.deepEqual(validTable, []);
});

test("real Vale control comments cannot disable prose checks", () => {
  for (const control of [
    "<!-- vale off -->",
    "<!-- vale on -->",
    "<!-- vale style = NO -->",
    "<!-- vale styles = YES -->",
    "<!-- vale Vale.Spelling = NO -->",
    "<!-- vale Vale.Repetition = off -->",
    "<!-- v&#97;le off -->",
    "<!-- vale&#32;off -->",
  ]) {
    for (const source of [
      `${control}\n\nUse the the report.\n`,
      `Use ${control} the the report.\n`,
      `> ${control}\n> Use the the report.\n`,
      `- ${control}\n  Use the the report.\n`,
      `| Duty |\n| --- |\n| ${control} Use the the report. |\n`,
    ])
      assert.throws(() => proseFindings(source), /no-quality-control/u);
  }
  const validSources = [
    "<!-- Vale explains configured prose rules. -->\n\nThe result is verified.\n",
    "<!-- vale output was discussed during review -->\n\nThe result is verified.\n",
    "`<!-- vale off -->` is a literal example.\n",
    "```text\n<!-- vale off -->\n```\n",
    "&lt;!-- vale off --&gt;\n",
    '<span title="<!-- vale off -->">The result is verified.</span>\n',
  ];
  for (const [index, findings] of proseBatch(validSources).entries()) {
    // Escaped directive examples are prose, not controls; Vale may still
    // enforce the visible tool-name spelling.
    assert.ok(
      findings.every(({ Check }) => Check === "Vale.Terms"),
      validSources[index],
    );
  }
});

test("public prose and integrity commands reject the same current-file defect", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-prose-entry-"));
  try {
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    const required = new Set([
      ".ethos/profile.toml",
      ".gitattributes",
      "LICENSE",
      "VERSION",
      "package.json",
      "package-lock.json",
    ]);
    for (const relative of gitFiles()) {
      if (
        !required.has(relative) &&
        !relative.startsWith(".config/") &&
        !relative.startsWith("tools/")
      )
        continue;
      if (!existsSync(path.join(root, relative))) continue;
      const target = path.join(directory, relative);
      mkdirSync(path.dirname(target), { recursive: true });
      cpSync(path.join(root, relative), target);
    }
    writeFileSync(
      path.join(directory, ".gitignore"),
      ["node_modules/", "build/", ".superpowers/", ".worktrees/", ""].join(
        "\n",
      ),
    );
    symlinkSync(
      path.join(root, "node_modules"),
      path.join(directory, "node_modules"),
      "junction",
    );
    const target = path.join(directory, "README.md");
    const original =
      "# Source\n\nThe result is verified.\n\n[MIT License](LICENSE)\n";
    writeFileSync(target, original);
    writeFileSync(
      path.join(directory, ".config/README.md"),
      "# Configuration\n\n[Source](../README.md)\n",
    );
    const defective = `${original}\nUse the the report.\n`;
    const environment = {
      ...process.env,
      DDWG_VALE_BIN: nativeToolBinary("vale"),
      DDWG_LYCHEE_BIN: nativeToolBinary("lychee"),
    };
    const observedSource = spawnSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(observedSource.error);
    assert.equal(observedSource.status, 0, observedSource.stderr);
    assert.deepEqual(
      observedSource.stdout.split("\0").filter((file) => file.endsWith(".md")),
      [".config/README.md", "README.md"],
      "the public defect journey must not rescan unrelated documents",
    );
    writeFileSync(target, defective);
    for (const command of ["prose", "check"]) {
      const result = spawnSync(
        process.execPath,
        ["tools/docs/cli.mjs", command],
        {
          cwd: directory,
          env: environment,
          encoding: "utf8",
          timeout: 120_000,
        },
      );
      assert.ifError(result.error);
      assert.equal(result.status, 1, `${command}: ${result.stderr}`);
      assert.match(
        result.stderr,
        /README\.md:\d+:\d+ \[Vale\.Repetition\].*repeated/u,
      );
      assert.equal(readFileSync(target, "utf8"), defective);
    }
    writeFileSync(target, original);
    const valid = spawnSync(process.execPath, ["tools/docs/cli.mjs", "prose"], {
      cwd: directory,
      env: environment,
      encoding: "utf8",
      timeout: 120_000,
    });
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
    const sources = [".superpowers", ".worktrees", "build"].map((prefix) => ({
      relative: `${prefix}/source.md`,
      anchor: `missing-${prefix.replace(/^\./u, "")}-anchor`,
    }));
    const writeSources = (content) => {
      for (const source of sources) {
        const file = path.join(directory, source.relative);
        mkdirSync(path.dirname(file), { recursive: true });
        writeFileSync(file, content(source));
      }
    };
    const runCheck = (command) =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", command], {
        cwd: directory,
        env: environment,
        encoding: "utf8",
        timeout: 120_000,
      });
    writeSources(() => "# Source\n\nUse the the report.\n");
    const ignored = runCheck("prose");
    assert.ifError(ignored.error);
    assert.equal(ignored.status, 0, ignored.stderr);
    const added = spawnSync(
      "git",
      ["add", "--force", "--", ...sources.map(({ relative }) => relative)],
      { cwd: directory, encoding: "utf8", timeout: 30_000 },
    );
    assert.ifError(added.error);
    assert.equal(added.status, 0, added.stderr);
    const invalidProse = runCheck("prose");
    assert.ifError(invalidProse.error);
    assert.equal(invalidProse.status, 1, invalidProse.stdout);
    assert.match(invalidProse.stderr, /\[Vale\.Repetition\].*repeated/u);
    for (const { relative } of sources)
      assert.ok(invalidProse.stderr.replaceAll("\\", "/").includes(relative));
    writeSources(
      ({ anchor }) => `# Source\n\n[Entry](../README.md#${anchor})\n`,
    );
    const invalidLink = runCheck("links");
    assert.ifError(invalidLink.error);
    assert.equal(invalidLink.status, 1, invalidLink.stdout);
    for (const { anchor } of sources)
      assert.ok(invalidLink.stdout.includes(anchor), invalidLink.stdout);
    writeSources(() => "# Source\n\nThe result is verified.\n");
    const repaired = runCheck("prose");
    assert.ifError(repaired.error);
    assert.equal(repaired.status, 0, repaired.stderr);
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
