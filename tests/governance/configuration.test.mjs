import assert from "node:assert/strict";
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
import * as governance from "../../tools/docs/governance.mjs";
import { root } from "../../tools/docs/runtime.mjs";
import { configurationFixture } from "./fixtures.mjs";

test("configuration has separate native concern owners", () => {
  assert.equal(typeof governance.checkConfigurationLayout, "function");
  assert.doesNotThrow(() => governance.checkConfigurationLayout());
});

test("offline configuration preserves the exact development disposition", () => {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "ddwg-config-advisories-"),
  );
  try {
    cpSync(path.join(root, ".config"), path.join(directory, ".config"), {
      recursive: true,
    });
    cpSync(
      path.join(root, "package-lock.json"),
      path.join(directory, "package-lock.json"),
    );
    assert.doesNotThrow(() => governance.checkConfigurationLayout(directory));
    writeFileSync(
      path.join(directory, ".config/checks/dependencies/policy.toml"),
      '[[IgnoredVulns]]\nid = "OSV-EXAMPLE"\nreason = "Hidden finding"\n',
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /approved.*OSV/u,
    );
    cpSync(
      path.join(root, ".config/checks/dependencies/policy.toml"),
      path.join(directory, ".config/checks/dependencies/policy.toml"),
    );
    const lock = JSON.parse(
      readFileSync(path.join(directory, "package-lock.json"), "utf8"),
    );
    lock.packages["node_modules/braces"].version = "3.0.4";
    writeFileSync(
      path.join(directory, "package-lock.json"),
      JSON.stringify(lock),
    );
    assert.throws(
      () => governance.checkConfigurationLayout(directory),
      /approved dependency artifact/u,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
    assert.equal(existsSync(directory), false);
  }
});

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
    ".config/checks/format/toml.toml",
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

test("Markdown policy keeps one spacing owner and preserves non-spacing checks", () => {
  const policy = readFileSync(
    path.join(root, ".config/checks/markdown/markdownlint.toml"),
    "utf8",
  );
  for (const source of [
    "[MD013]\nline_length = 0\n",
    'globs = ["**"]\n',
    policy.replace("whitespace = false", "whitespace = true"),
    policy.replace("blank_lines = false", "blank_lines = true"),
    policy.replace("MD019 = false", "MD019 = true"),
    policy.replace("MD021 = false", "MD021 = true"),
    policy.replace("MD060 = false", "MD060 = true"),
    `${policy}\n[list-item-spacing]\ncheckBlanks = true\n`,
    `${policy}\n[MD012]\nmaximum = 1\n`,
  ]) {
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
