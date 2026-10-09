import assert from "node:assert/strict";

import { cpSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";

import os from "node:os";

import path from "node:path";

import * as governance from "../../tools/docs/governance.mjs";

import {
  headingLevel,
  headingText,
  markdownTokens,
} from "../../tools/docs/markdown.mjs";

import { root } from "../../tools/docs/runtime.mjs";

export function fixture(run) {
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

export function contentUnderHeading(source, relative, title) {
  const tokens = markdownTokens(source, relative);
  const start = tokens.findIndex(
    (token) => headingLevel(token) > 0 && headingText(token) === title,
  );
  assert.notEqual(start, -1, `${relative}: missing ${title}`);
  const level = headingLevel(tokens[start]);
  const end = tokens.findIndex(
    (token, index) =>
      index > start && headingLevel(token) > 0 && headingLevel(token) <= level,
  );
  return tokens.slice(start + 1, end < 0 ? undefined : end);
}

export function configurationFixture(run) {
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
