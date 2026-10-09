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
import { createRequire } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { Parser } from "htmlparser2";
import { micromark } from "micromark";
import { markdownTokens, walkMarkdown } from "../../tools/docs/markdown.mjs";
import { lintMarkdown } from "../../tools/docs/content.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { assertFixtureSources } from "../source/fixtures.mjs";

test("native Markdown preserves delimiter flanking and ordinary emphasis", () => {
  assert.equal(micromark("a*_*"), "<p>a*_*</p>");
  assert.equal(
    micromark("*review* and **acceptance**"),
    "<p><em>review</em> and <strong>acceptance</strong></p>",
  );
});

test("native math keeps Markdownlint tokens and inline/display rendering", async () => {
  const require = createRequire(import.meta.url);
  const mathEntry = createRequire(require.resolve("markdownlint/sync")).resolve(
    "micromark-extension-math",
  );
  const { math, mathHtml } = await import(pathToFileURL(mathEntry).href);
  const source = "# Mathematics\n\nInline $x^2$.\n\n$$\nx^2 + y^2 = z^2\n$$\n";
  assert.deepEqual(
    [...walkMarkdown(markdownTokens(source))]
      .filter((token) => ["mathText", "mathFlow"].includes(token.type))
      .map((token) => token.type),
    ["mathText", "mathFlow"],
  );
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { "mathematics.md": source } }),
  );
  const classes = new Set();
  new Parser({
    onopentag(_name, attributes) {
      for (const name of (attributes.class ?? "").split(/\s+/u))
        classes.add(name);
    },
  }).end(
    micromark(source, { extensions: [math()], htmlExtensions: [mathHtml()] }),
  );
  for (const name of ["math-inline", "math-display", "katex", "katex-display"])
    assert.equal(classes.has(name), true, name);
});

test("native math admits only explicitly owned trusted renderer settings", async () => {
  const require = createRequire(import.meta.url);
  const mathEntry = createRequire(require.resolve("markdownlint/sync")).resolve(
    "micromark-extension-math",
  );
  const renderer = createRequire(mathEntry)("katex");
  const { math, mathHtml } = await import(pathToFileURL(mathEntry).href);
  const expression = "\\href{https://example.org}{x}";
  const destinations = (html) => {
    const found = [];
    new Parser({
      onopentag(_name, attributes) {
        if (attributes.href !== undefined) found.push(attributes.href);
      },
    }).end(html);
    return found;
  };
  const renderMath = (options) =>
    micromark(`$${expression}$`, {
      extensions: [math()],
      htmlExtensions: [mathHtml(options)],
    });

  assert.deepEqual(destinations(renderMath()), []);
  assert.deepEqual(
    destinations(
      renderer.renderToString(expression, Object.create({ trust: true })),
    ),
    [],
  );
  assert.equal(
    destinations(renderMath({ trust: true })).includes("https://example.org"),
    true,
  );

  const original = Object.getOwnPropertyDescriptor(Object.prototype, "trust");
  try {
    Object.defineProperty(Object.prototype, "trust", {
      configurable: true,
      writable: true,
      value: true,
    });
    assert.deepEqual(destinations(renderMath()), []);
    assert.deepEqual(destinations(renderMath({ trust: false })), []);
    assert.equal(
      destinations(renderMath({ trust: true })).includes("https://example.org"),
      true,
    );
  } finally {
    if (original) Object.defineProperty(Object.prototype, "trust", original);
    else delete Object.prototype.trust;
  }
  assert.deepEqual(
    Object.getOwnPropertyDescriptor(Object.prototype, "trust"),
    original,
  );
});

test("Markdown lint checks literal Git source without a glob or ambient policy", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-native-lint-"));
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
    const source = "{literal} markdown.md";
    const file = path.join(directory, source);
    writeFileSync(file, "# Example\n\nUse the report.\n");
    mkdirSync(path.join(directory, "build"));
    writeFileSync(
      path.join(directory, "build", "cache.md"),
      "# Cache\n\n\n\nIgnored install state.\n",
    );
    writeFileSync(
      path.join(directory, ".markdownlint-cli2.jsonc"),
      '{"ignores":["**"],"config":{"default":false}}\n',
    );
    writeFileSync(
      path.join(directory, ".markdownlint.json"),
      '{"default":false}\n',
    );
    const init = spawnSync("git", ["init", "-q", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(init.status, 0, init.stderr);
    const add = spawnSync("git", ["add", "--", source], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(add.status, 0, add.stderr);
    const selected = [
      ".gitignore",
      ".markdownlint-cli2.jsonc",
      ".markdownlint.json",
      source,
    ];
    assertFixtureSources(directory, selected);
    const invoke = () =>
      spawnSync(process.execPath, ["tools/docs/cli.mjs", "lint"], {
        cwd: directory,
        encoding: "utf8",
        timeout: 10_000,
      });
    const valid = invoke();
    assert.ifError(valid.error);
    assert.equal(valid.status, 0, valid.stderr);
    const paddedList =
      "# Example\n\n- First with a wrapped\n  paragraph.\n\n- Second.\n";
    writeFileSync(file, paddedList);
    const listResult = invoke();
    assert.ifError(listResult.error);
    assert.equal(listResult.status, 0, listResult.stderr);
    assert.equal(readFileSync(file, "utf8"), paddedList);
    const literals = [
      "# Example\n\n```text\nfirst\n\n\nsecond\n```\n",
      "# Example\n\n    first\n\n\n    second\n",
    ];
    for (const literal of literals) {
      writeFileSync(file, literal);
      const native = invoke();
      assert.ifError(native.error);
      assert.equal(native.status, 0, native.stderr);
      const layout = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          "import { checkTextLayout } from './tools/docs/content.mjs'; await checkTextLayout();",
        ],
        { cwd: directory, encoding: "utf8", timeout: 10_000 },
      );
      assert.ifError(layout.error);
      assert.equal(layout.status, 0, layout.stderr);
      assert.equal(readFileSync(file, "utf8"), literal);
    }
    writeFileSync(file, `${literals[0]}\n\nOutside.\n`);
    const padded = invoke();
    assert.ifError(padded.error);
    assert.equal(padded.status, 0, padded.stderr);
    const formatCheck = spawnSync(
      process.execPath,
      ["tools/docs/cli.mjs", "format", "--check"],
      { cwd: directory, encoding: "utf8", timeout: 10_000 },
    );
    assert.ifError(formatCheck.error);
    assert.equal(formatCheck.status, 1, formatCheck.stderr);
    assert.ok(formatCheck.stderr.includes(source), formatCheck.stderr);
    writeFileSync(
      file,
      "# Example\n\n<!-- markdownlint-disable MD013 -->\n\n" +
        "word ".repeat(40).trim() +
        "\n",
    );
    const before = readFileSync(file, "utf8");
    const invalid = invoke();
    assert.ifError(invalid.error);
    assert.equal(invalid.status, 1, invalid.stderr);
    assert.match(invalid.stderr, /MD013/u);
    assert.ok(invalid.stderr.includes(source), invalid.stderr);
    assert.equal(readFileSync(file, "utf8"), before);
    const historical = "openspec/changes/archive/fixture/specs/quality/spec.md";
    const historicalFile = path.join(directory, historical);
    mkdirSync(path.dirname(historicalFile), { recursive: true });
    writeFileSync(
      historicalFile,
      "# Historical Spec\n\n" + "word ".repeat(40).trim() + "\n",
    );
    const addHistory = spawnSync("git", ["add", "--", historical], {
      cwd: directory,
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(addHistory.status, 0, addHistory.stderr);
    assertFixtureSources(directory, [...selected, historical]);
    writeFileSync(file, "# Example\n\nUse the report.\n");
    const archived = invoke();
    assert.equal(archived.status, 1, archived.stderr);
    assert.match(archived.stderr, /MD013/u);
    assert.ok(archived.stderr.includes("spec.md"), archived.stderr);
    assert.equal(
      readFileSync(historicalFile, "utf8"),
      "# Historical Spec\n\n" + "word ".repeat(40).trim() + "\n",
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
