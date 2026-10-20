import { cpSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";

import os from "node:os";

import path from "node:path";

import { root } from "../../tools/runtime.mjs";

export function fixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-governance-test-"));
  try {
    cpSync(path.join(root, "docs"), path.join(directory, "docs"), {
      recursive: true,
    });
    mkdirSync(path.join(directory, ".ethos"));
    cpSync(path.join(root, ".ethos/profile.toml"), path.join(directory, ".ethos/profile.toml"));
    for (const name of ["README.md", "AGENTS.md"]) {
      cpSync(path.join(root, name), path.join(directory, name));
    }
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
