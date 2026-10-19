import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempDisposableSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { documentMetadata, textViolations } from "../../tools/docs/content.mjs";
import {
  headingLevel,
  markdownLinkDestinations,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { gitFiles, root } from "../../tools/runtime.mjs";

test("Markdown lint preserves formatter-owned layout and scopes repeated headings", async () => {
  const { lintMarkdown } = await import("../../tools/docs/content.mjs");
  const source = [
    "---",
    "subject: fixture:guide",
    "---",
    "",
    "# Fixture",
    "",
    "A paragraph stays on its original line even when its length exceeds the shared formatter width. ".repeat(
      2,
    ),
    "",
    "## First",
    "",
    "### Detail",
    "",
    "- First paragraph.",
    "",
    "  Second paragraph.",
    "",
    "- Next item.",
    "",
    "## Second",
    "",
    "### Detail",
    "",
    "```text",
    "literal",
    "",
    "",
    "bytes",
    "```",
    "",
  ].join("\n");
  assert.doesNotThrow(() => lintMarkdown({ files: [], strings: { fixture: source } }));
});

test("Markdown lint reports all structural findings despite inline suppression", async () => {
  const { lintMarkdown } = await import("../../tools/docs/content.mjs");
  const source =
    "# Fixture\n\n<!-- markdownlint-disable -->\n\n[Missing]()\n\n## Same\n\n## Same\n";
  assert.throws(
    () => lintMarkdown({ files: [], strings: { fixture: source } }),
    (error) => {
      assert.match(error.message, /fixture:5 \[MD042\]/u);
      assert.match(error.message, /fixture:9 \[MD024\]/u);
      return true;
    },
  );
});

test("Markdown lint checks selected literal paths without writing or discovering siblings", async () => {
  const { lintMarkdown } = await import("../../tools/docs/content.mjs");
  using directory = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-markdown-lint-"));
  const selected = path.join(directory.path, "selected [literal]*.md");
  const sibling = path.join(directory.path, "unselected.md");
  writeFileSync(selected, "# Fixture\n\n[Missing]()\n");
  writeFileSync(sibling, "# Sibling\n\n[Missing]()\n");
  const before = readFileSync(selected);
  assert.throws(
    () => lintMarkdown({ files: [selected] }),
    (error) => {
      assert.ok(error.message.includes(`${selected}:3 [MD042]`), error.message);
      assert.ok(!error.message.includes(sibling), error.message);
      return true;
    },
  );
  assert.deepEqual(readFileSync(selected), before);
  writeFileSync(selected, "# Fixture\n");
  assert.doesNotThrow(() => lintMarkdown({ files: [selected] }));
});

test("document metadata reads native YAML front matter", () => {
  const source = [
    "---",
    "subject: fixture:guide",
    "role: policy",
    "state: canonical",
    "relations:",
    "  canonical_for: reader guidance",
    "---",
    "",
    "# Fixture",
    "",
    "Reader-facing content.",
    "",
  ].join("\n");
  assert.deepEqual(documentMetadata("docs/fixture.md", source), {
    subject: "fixture:guide",
    role: "policy",
    state: "canonical",
    relations: { canonical_for: "reader guidance" },
  });
});

test("document metadata rejects a duplicate key", () => {
  const source =
    "---\nsubject: first\nsubject: second\nrole: policy\nstate: canonical\nrelations: {}\n---\n\n# Fixture\n";
  assert.throws(() => documentMetadata("docs/fixture.md", source), /invalid document metadata/u);
});

test("document metadata rejects HTML carriers and pre-title prose", () => {
  const metadata = "subject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}";
  assert.throws(
    () => documentMetadata("docs/fixture.md", `<!--\n---\n${metadata}\n---\n-->\n\n# Fixture\n`),
    /native YAML front matter/u,
  );
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `---\n${metadata}\n---\n\nA visible preface.\n\n# Fixture\n`,
      ),
    /first visible block/u,
  );
});

test("document metadata rejects incomplete YAML without treating literal markers as HTML", () => {
  const metadata = "subject: fixture:guide\nrole: policy\nstate: canonical\nrelations:";
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `---\n${metadata}\n  canonical_for: reader guidance\n\n# Fixture\n`,
      ),
    /invalid document metadata/u,
  );
  assert.equal(
    documentMetadata(
      "docs/fixture.md",
      `---\n${metadata}\n  canonical_for: "arrow --> marker"\n---\n\n# Fixture\n`,
    ).relations.canonical_for,
    "arrow --> marker",
  );
});

test("native front matter stays outside reader headings and links with physical source lines", () => {
  const source = [
    "---",
    "subject: fixture:guide",
    "role: policy",
    "state: canonical",
    "relations:",
    '  canonical_for: "[Metadata only](missing.md)"',
    "---",
    "",
    "# Fixture",
    "",
    "Reader [target](target.md).",
    "",
  ].join("\n");
  const headings = [...walkMarkdown(markdownTokens(source, "docs/fixture.md"))].filter(
    headingLevel,
  );
  assert.equal(headings.length, 1);
  assert.equal(headings[0].text, "# Fixture");
  assert.equal(headings[0].startLine, 9);
  assert.deepEqual(markdownLinkDestinations(source), ["target.md"]);
});

test("English failures identify the source file and line", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u4e2d\u6587\n"))[0],
    /docs\/example\.md:2/u,
  );
});

test("English source checks include supplementary Han characters", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u{20000}\n"))[0] ?? "",
    /docs\/example\.md:2: CJK text/u,
  );
});

test("tracked text refuses invalid UTF-8 and NUL while declared binary assets remain reachable", () => {
  using directory = mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-source-bytes-"));
  cpSync(path.join(root, "tools"), path.join(directory.path, "tools"), {
    recursive: true,
  });
  symlinkSync(
    path.join(root, "node_modules"),
    path.join(directory.path, "node_modules"),
    "junction",
  );
  const initialized = spawnSync("git", ["init", "--quiet", directory.path], {
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(initialized.error);
  assert.equal(initialized.status, 0, initialized.stderr);
  writeFileSync(path.join(directory.path, ".gitignore"), "node_modules/\n");
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\n",
  );
  writeFileSync(path.join(directory.path, "asset.bin"), Buffer.from([0, 255]));
  const module = pathToFileURL(path.join(directory.path, "tools/docs/content.mjs")).href;
  const command = [
    "--input-type=module",
    "--eval",
    `const { checkTextLayout } = await import(${JSON.stringify(module)}); await checkTextLayout();`,
  ];
  for (const [bytes, message] of [
    [Buffer.from([0xc3, 0x28]), /README\.md:.*UTF-8/u],
    [Buffer.from("Readable\0hidden\n"), /README\.md:.*NUL/u],
  ]) {
    writeFileSync(path.join(directory.path, "README.md"), bytes);
    const result = spawnSync(process.execPath, command, {
      cwd: directory.path,
      encoding: "utf8",
      timeout: 15_000,
    });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, message);
  }
  writeFileSync(path.join(directory.path, "README.md"), "# Valid source\n");
  const valid = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(valid.error);
  assert.equal(valid.status, 0, valid.stderr);
  writeFileSync(
    path.join(directory.path, ".gitattributes"),
    "* text=auto eol=lf\nasset.bin -text\nREADME.md -text\n",
  );
  const hidden = spawnSync(process.execPath, command, {
    cwd: directory.path,
    encoding: "utf8",
    timeout: 15_000,
  });
  assert.ifError(hidden.error);
  assert.notEqual(hidden.status, 0);
  assert.match(hidden.stderr, /README\.md:.*native text owner cannot be declared binary/u);
});

test("native spacing checks archived Markdown; other text keeps its own boundary", async () => {
  const { check, format } = await import("prettier");
  const file = "openspec/changes/archive/example/spec.md";
  const source = "# Example\n\n\nText.\n";
  const options = { filepath: file };
  assert.equal(await check(source, options), false);
  const formatted = await format(source, options);
  assert.equal(formatted, "# Example\n\nText.\n");
  assert.equal(await check(formatted, options), true);
  for (const name of ["LICENSE", ".config/README.txt", ".config/example.ini"]) {
    assert.deepEqual(await textViolations(name, "First\n\nSecond\n"), []);
    assert.match(
      (await textViolations(name, "First\n\n\nSecond\n"))[0],
      /:3: consecutive blank lines/u,
    );
  }
});

test("retired quality owners are absent from current source and dependencies", () => {
  const retiredPackage =
    /(?:^|\/)(?:@textlint|@cspell|cspell[^/]*|textlint[^/]*|write-good|markdownlint-cli2(?:-formatter-default)?)(?:\/|$)/u;
  const lock = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"));
  assert.deepEqual(
    Object.keys(lock.packages).filter((name) => retiredPackage.test(name)),
    [],
  );
  const currentCode = gitFiles().filter((name) => /^(?:tools|tests)\/.*\.mjs$/u.test(name));
  for (const name of currentCode) {
    if (!existsSync(path.join(root, name))) continue;
    const source = readFileSync(path.join(root, name), "utf8");
    assert.doesNotMatch(
      source,
      /(?:from\s+["']|require\(["'])(?:@textlint\/|@cspell\/|cspell|write-good|textlint-)/u,
      name,
    );
  }
  for (const name of [
    "@textlint",
    "@cspell",
    "cspell",
    "write-good",
    "textlint-util-to-string",
    "markdownlint-cli2",
    "markdownlint-cli2-formatter-default",
  ]) {
    assert.equal(existsSync(path.join(root, "node_modules", name)), false, name);
  }
  for (const name of [
    ".config/tools/textlint.json",
    ".config/tools/cspell.json",
    ".config/checks/markdown/markdownlint-cli2.toml",
  ]) {
    assert.equal(existsSync(path.join(root, name)), false, name);
  }
});
