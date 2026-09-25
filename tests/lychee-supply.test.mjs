import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import {
  assertAssetDigest,
  manifest,
  safeArchiveEntries,
  selectedAsset,
} from "../tools/ci/install-lychee.mjs";
import { root } from "../tools/docs/runtime.mjs";

test("official supply declares exactly the qualified host assets", () => {
  assert.deepEqual(Object.keys(manifest.assets).sort(), [
    "darwin-arm64",
    "darwin-x64",
    "linux-arm64",
    "linux-x64",
    "win32-x64",
  ]);
  for (const [key, asset] of Object.entries(manifest.assets)) {
    assert.match(asset.sha256, /^[0-9a-f]{64}$/u);
    assert.ok(selectedAsset(...key.split("-")).url.endsWith(asset.name));
  }
  assert.throws(() => selectedAsset("win32", "arm64"), /unsupported/u);
});

test("asset digest is checked before extraction", () => {
  const bytes = Buffer.from("bounded fixture");
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  assert.doesNotThrow(() =>
    assertAssetDigest(bytes, { name: "fixture", sha256 }),
  );
  assert.throws(
    () => assertAssetDigest(bytes, { name: "fixture", sha256: "0".repeat(64) }),
    /digest mismatch/u,
  );
});

test("archive listing rejects traversal and absolute paths", () => {
  assert.deepEqual(safeArchiveEntries("lychee-linux/lychee\n"), [
    "lychee-linux/lychee",
  ]);
  for (const member of [
    "../lychee",
    "/tmp/lychee",
    "C:/outside/lychee",
    "bin\\..\\outside",
  ]) {
    assert.throws(() => safeArchiveEntries(`${member}\n`), /unsafe/u);
  }
});

test("print-spec is read-only and selects this host", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-lychee.mjs", "--print-spec"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const spec = JSON.parse(result.stdout);
  assert.equal(spec.key, `${process.platform}-${process.arch}`);
  assert.equal(spec.sha256, manifest.assets[spec.key].sha256);
});
