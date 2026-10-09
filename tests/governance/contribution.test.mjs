import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parse as parseToml } from "smol-toml";
import {
  checkLineEndingAttributes,
  checkLicense,
} from "../../tools/docs/governance.mjs";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { contentUnderHeading } from "./fixtures.mjs";

test("source checking precedes conditional tool preparation without hiding inputs", () => {
  const relative = "CONTRIBUTING.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertCheckEntry = (text) => {
    const editing = contentUnderHeading(
      text,
      relative,
      "Edit a documentation page",
    );
    assert.match(
      editing.map((token) => token.text).join("\n"),
      /leading ETHOS HTML metadata comment.*node_modules.*generated output/su,
      "documentation metadata and Git duties need their own editing section",
    );
    const section = contentUnderHeading(text, relative, "Verify the source");
    assert.ok(
      !section.some((token) =>
        token.text.includes("leading ETHOS HTML metadata"),
      ),
      "document editing is not a source-check step",
    );
    const locate = (title) =>
      section.findIndex((token) => headingText(token) === title);
    const check = locate("Run the full source check");
    const runtime = locate("Prepare the runtime and dependencies");
    const supply = locate("Supply native checks");
    assert.ok(
      check >= 0 && check < runtime && runtime < supply,
      "source checks must precede conditional runtime and native-tool preparation",
    );
    const entryLinks = markdownLinkDestinations(
      section
        .slice(0, check)
        .map((token) => token.text)
        .join("\n"),
    );
    for (const prerequisite of [
      "#prepare-the-runtime-and-dependencies",
      "#supply-native-checks",
    ]) {
      assert.ok(
        entryLinks.includes(prerequisite),
        "preparation must stay discoverable at the check entry",
      );
    }
    const command = section.find((token) => token.type === "codeFenced");
    assert.ok(
      command &&
        command.text.includes("npm run verify\nethos plan --changed --json"),
      "the first verification example must run the checks, not install tools",
    );
    const acquisition = [
      ...walkMarkdown(
        contentUnderHeading(text, relative, "Acquire supplied assets"),
      ),
    ]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    assert.deepEqual(
      acquisition.map((paragraph) =>
        paragraph.split(" ").slice(0, 3).join(" "),
      ),
      [
        "Use Node's native",
        "Publish a fully",
        "Preserve permissions and",
        "Official OpenSpec child-process",
        "Archives exclude host",
      ],
      "download, cache, cleanup, child controls, and extraction need separate boundaries",
    );
  };
  assertCheckEntry(source);
  assert.throws(
    () =>
      assertCheckEntry(
        source
          .replace(
            "## Edit a documentation page",
            "## Verify the source\n\n### Edit a documentation page",
          )
          .replace("## Verify the source\n\nThe full check", "The full check"),
      ),
    /document editing is not a source-check step/u,
  );
  const checkStart = source.indexOf("### Run the full source check\n");
  const preparationStart = source.indexOf(
    "### Prepare the runtime and dependencies\n",
  );
  const end = source.indexOf("## Use the offline maintenance toolkit\n");
  assert.throws(
    () =>
      assertCheckEntry(
        source.slice(0, checkStart) +
          source.slice(preparationStart, end) +
          source.slice(checkStart, preparationStart) +
          source.slice(end),
      ),
    /source checks must precede/u,
  );
  assert.throws(
    () =>
      assertCheckEntry(
        source.replace(
          "(#prepare-the-runtime-and-dependencies)",
          "(#supply-native-checks)",
        ),
      ),
    /preparation must stay discoverable/u,
  );
  assert.throws(
    () =>
      assertCheckEntry(
        source.replace(
          "before network or staging.\n\nPublish",
          "before network or staging. Publish",
        ),
      ),
    /separate boundaries/u,
  );
});

test("platform qualification separates common, architecture, and tool evidence", () => {
  const relative = "docs/governance/ethos.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertLayers = (text) => {
    const tokens = markdownTokens(text, relative);
    const start = tokens.findIndex(
      (token) =>
        headingLevel(token) === 3 &&
        headingText(token) === "Qualify Each Platform",
    );
    assert.notEqual(start, -1);
    const end = tokens.findIndex(
      (token, index) =>
        index > start && headingLevel(token) > 0 && headingLevel(token) <= 3,
    );
    const paragraphs = [
      ...walkMarkdown(tokens.slice(start + 1, end < 0 ? undefined : end)),
    ]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    assert.equal(paragraphs.length, 3, "platform readers need distinct layers");
    assert.ok(paragraphs[0].startsWith("CI bootstraps Node/npm"));
    assert.ok(paragraphs[1].startsWith("The manifest supplies macOS x64"));
    assert.ok(paragraphs[2].startsWith("For managed tools, invoke"));
  };
  assertLayers(source);
  assert.throws(
    () =>
      assertLayers(
        source.replace("\n\nThe manifest supplies", "\nThe manifest supplies"),
      ),
    /distinct layers/u,
  );
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
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-checkout-text-"));
  try {
    const initialized = spawnSync("git", ["init", "--quiet", directory], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.ifError(initialized.error);
    assert.equal(initialized.status, 0, initialized.stderr);
    const attributes = path.join(directory, ".gitattributes");
    writeFileSync(path.join(directory, "README.md"), "# Text source\n");
    writeFileSync(path.join(directory, "asset.bin"), Buffer.from([0, 255]));
    writeFileSync(attributes, "* text=auto eol=lf\nasset.bin -text\n");
    assert.doesNotThrow(() => checkLineEndingAttributes(directory));
    writeFileSync(attributes, "* text=auto\n");
    assert.throws(
      () => checkLineEndingAttributes(directory),
      /LF on every host/u,
    );
    writeFileSync(attributes, "* text=auto eol=lf\nREADME.md eol=crlf\n");
    assert.throws(
      () => checkLineEndingAttributes(directory),
      /README\.md.*LF on every host/u,
    );
    writeFileSync(
      attributes,
      "* text=auto eol=lf\nREADME.md -text\nasset.bin -text\n",
    );
    assert.doesNotThrow(() => checkLineEndingAttributes(directory));
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
