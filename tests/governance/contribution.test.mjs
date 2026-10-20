import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { checkLineEndingAttributes, checkLicense } from "../../tools/docs/governance.mjs";
import { root } from "../../tools/runtime.mjs";

test("MIT license, entry, and package metadata must agree", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-license-test-"));
  try {
    for (const name of ["LICENSE", "README.md", "package.json", "package-lock.json"]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    assert.doesNotThrow(() => checkLicense(directory));

    const license = path.join(directory, "LICENSE");
    const originalLicense = readFileSync(license, "utf8");
    writeFileSync(license, originalLicense.replace("MIT License", "Apache License"));
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    writeFileSync(license, originalLicense);
    writeFileSync(license, originalLicense.replace("without restriction", "with restrictions"));
    assert.throws(() => checkLicense(directory), /standard MIT text/u);
    rmSync(license);
    assert.throws(() => checkLicense(directory), /missing MIT LICENSE/u);
    writeFileSync(license, originalLicense);

    const entry = path.join(directory, "README.md");
    const originalEntry = readFileSync(entry, "utf8");
    writeFileSync(entry, originalEntry.replace("(LICENSE)", "(missing-license)"));
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
    writeFileSync(lock, originalLock.replace('"license": "MIT"', '"license": "Apache-2.0"'));
    assert.throws(() => checkLicense(directory), /MIT package metadata/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
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
    assert.throws(() => checkLineEndingAttributes(directory), /LF on every host/u);
    writeFileSync(attributes, "* text=auto eol=lf\nREADME.md eol=crlf\n");
    assert.throws(() => checkLineEndingAttributes(directory), /README\.md.*LF on every host/u);
    writeFileSync(attributes, "* text=auto eol=lf\nREADME.md -text\nasset.bin -text\n");
    assert.doesNotThrow(() => checkLineEndingAttributes(directory));
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});
