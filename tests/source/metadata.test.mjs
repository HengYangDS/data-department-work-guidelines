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
import {
  documentMetadata,
  lintMarkdown,
  textViolations,
} from "../../tools/docs/content.mjs";
import { gitFiles, root } from "../../tools/docs/runtime.mjs";

test("document metadata reads the product-supported title-first carrier", () => {
  const source = [
    "<!--",
    "---",
    "subject: fixture:guide",
    "role: policy",
    "state: canonical",
    "relations:",
    "  canonical_for: reader guidance",
    "---",
    "-->",
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
    "<!--\n---\nsubject: first\nsubject: second\nrole: policy\nstate: canonical\nrelations: {}\n---\n-->\n\n# Fixture\n";
  assert.throws(
    () => documentMetadata("docs/fixture.md", source),
    /invalid document metadata/u,
  );
});

test("document metadata rejects visible declarations and pre-title prose", () => {
  const metadata =
    "subject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}";
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `---\n${metadata}\n---\n\n# Fixture\n`,
      ),
    /title-first/u,
  );
  assert.throws(
    () =>
      documentMetadata(
        "docs/fixture.md",
        `<!--\n---\n${metadata}\n---\n-->\n\nA visible preface.\n\n# Fixture\n`,
      ),
    /first visible block/u,
  );
});

test("document metadata rejects incomplete or prematurely closed comments", () => {
  const incomplete =
    "<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations: {}\n---\n# Fixture\n";
  const premature =
    '<!--\n---\nsubject: fixture:guide\nrole: policy\nstate: canonical\nrelations:\n  canonical_for: "unsafe --> suffix"\n---\n-->\n\n# Fixture\n';
  for (const source of [incomplete, premature]) {
    assert.throws(
      () => documentMetadata("docs/fixture.md", source),
      /invalid document metadata/u,
    );
  }
});

test("English failures identify a file and line; formatting owns spacing", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u4e2d\u6587\n"))[0],
    /docs\/example\.md:2/u,
  );
  assert.doesNotThrow(() =>
    lintMarkdown({
      files: [],
      strings: { "docs/example.md": "# Heading\n\n\nText\n" },
    }),
  );
});

test("English source checks include supplementary Han characters", async () => {
  assert.match(
    (await textViolations("docs/example.md", "# Heading\n\u{20000}\n"))[0] ??
      "",
    /docs\/example\.md:2: CJK text/u,
  );
});

test("tracked text refuses invalid UTF-8 and NUL while declared binary assets remain reachable", () => {
  using directory = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-source-bytes-"),
  );
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
  const module = pathToFileURL(
    path.join(directory.path, "tools/docs/content.mjs"),
  ).href;
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
  assert.match(
    hidden.stderr,
    /README\.md:.*native text owner cannot be declared binary/u,
  );
});

test("native spacing checks archived Markdown; other text keeps its own boundary", async () => {
  const { check, format } = await import("prettier");
  const file = "openspec/changes/archive/example/spec.md";
  assert.doesNotThrow(() =>
    lintMarkdown({ files: [], strings: { [file]: "# Example\n\nText.\n" } }),
  );
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
  const lock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"), "utf8"),
  );
  assert.deepEqual(
    Object.keys(lock.packages).filter((name) => retiredPackage.test(name)),
    [],
  );
  const currentCode = gitFiles().filter((name) =>
    /^(?:tools|tests)\/.*\.mjs$/u.test(name),
  );
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
    assert.equal(
      existsSync(path.join(root, "node_modules", name)),
      false,
      name,
    );
  }
  for (const name of [
    ".config/tools/textlint.json",
    ".config/tools/cspell.json",
    ".config/checks/markdown/markdownlint-cli2.toml",
  ]) {
    assert.equal(existsSync(path.join(root, name)), false, name);
  }
});
