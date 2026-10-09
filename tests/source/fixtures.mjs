import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

export function assertFixtureSources(directory, expected) {
  const inventory = spawnSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: directory, encoding: "utf8", timeout: 10_000 },
  );
  assert.ifError(inventory.error);
  assert.equal(inventory.status, 0, inventory.stderr);
  assert.deepEqual(
    [...new Set(inventory.stdout.split("\0").filter(Boolean))].sort(),
    [...expected].sort(),
    "native fixture source contains only the declared test inputs",
  );
}
