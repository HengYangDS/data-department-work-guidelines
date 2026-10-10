import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

export function fixtureGit(directory, args, { env } = {}) {
  const result = spawnSync("git", args, {
    cwd: directory,
    env,
    encoding: "utf8",
    timeout: 10_000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

export function assertFixtureSources(directory, expected) {
  const inventory = fixtureGit(directory, [
    "ls-files",
    "--cached",
    "--others",
    "--exclude-standard",
    "-z",
  ]);
  assert.deepEqual(
    [...new Set(inventory.split("\0").filter(Boolean))].sort(),
    [...expected].sort(),
    "native fixture source contains only the declared test inputs",
  );
}
