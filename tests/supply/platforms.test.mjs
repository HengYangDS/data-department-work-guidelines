import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { manifest, selectedAsset } from "../../tools/ci/install-native.mjs";
import {
  managedToolPath,
  nativeToolPlatform,
  nativeToolBinary,
  root,
} from "../../tools/docs/runtime.mjs";

test("official supply declares exactly the supported platform assets", () => {
  assert.deepEqual(Object.keys(manifest.tools.lychee.assets).sort(), [
    "darwin-arm64",
    "darwin-x64",
    "linux-arm64",
    "linux-x64",
    "win32-x64",
  ]);
  for (const [key, asset] of Object.entries(manifest.tools.lychee.assets)) {
    assert.match(asset.sha256, /^[0-9a-f]{64}$/u);
    assert.ok(
      selectedAsset("lychee", ...key.split("-")).url.endsWith(asset.name),
    );
  }
  assert.deepEqual(Object.keys(manifest.tools.lychee.licenses).sort(), [
    "LICENSE-APACHE",
    "LICENSE-MIT",
  ]);
  for (const license of Object.values(manifest.tools.lychee.licenses)) {
    assert.match(license.sha256, /^[0-9a-f]{64}$/u);
    assert.match(license.source, /lychee-v0\.24\.2/u);
  }
  assert.equal(selectedAsset("lychee", "win32", "arm64").key, "win32-x64");
});

test("Windows ARM64 Node selects pinned compatible tools without duplicating assets", () => {
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    const selected = selectedAsset(tool, "win32", "arm64");
    assert.equal(selected.key, "win32-x64", tool);
    assert.equal(selected.name, descriptor.assets["win32-x64"].name, tool);
    assert.equal(selected.sha256, descriptor.assets["win32-x64"].sha256, tool);
    assert.equal(
      managedToolPath(tool, "win32-arm64"),
      managedToolPath(tool, "win32-x64"),
      tool,
    );
    const native = structuredClone(manifest);
    native.tools[tool].assets["win32-arm64"] = { name: "native asset fixture" };
    assert.equal(
      nativeToolPlatform(tool, "win32-arm64", native),
      "win32-arm64",
    );
    delete native.tools[tool].assets["win32-x64"];
    delete native.tools[tool].assets["win32-arm64"];
    assert.throws(
      () => nativeToolPlatform(tool, "win32-arm64", native),
      /unsupported/u,
    );
    assert.throws(
      () => selectedAsset(tool, "linux", "riscv64"),
      /unsupported/u,
    );
  }
});

test("all native consumers share the declared managed path", () => {
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    for (const platform of Object.keys(descriptor.assets)) {
      assert.equal(
        managedToolPath(tool, platform),
        path.join(
          root,
          "build/runtime/tool-cache",
          tool,
          descriptor.version,
          platform,
          descriptor.binary + (platform.startsWith("win32-") ? ".exe" : ""),
        ),
      );
    }
  }
  assert.throws(() => managedToolPath("constructor"), /unknown native tool/u);
  assert.throws(
    () => managedToolPath("lychee", "win32-riscv64"),
    /unsupported/u,
  );
});

test("native tool identities must name declared manifest entries", () => {
  for (const tool of ["constructor", "toString", "missing-tool"]) {
    const expected = `unknown native tool: ${tool}`;
    for (const select of [selectedAsset, nativeToolBinary]) {
      assert.throws(
        () => select(tool),
        (error) => error.message === expected,
      );
    }
  }
});

test("native assets validate every declared size before supply effects", () => {
  for (const tool of ["lychee", "osv-scanner"]) {
    const selected = selectedAsset(tool);
    const pin = manifest.tools[tool].assets[selected.key];
    const original = { ...pin };
    try {
      for (const size of ["unbounded", -1, 64 * 1024 * 1024 + 1]) {
        pin.size = size;
        assert.throws(() => selectedAsset(tool), /format|size/u);
      }
      pin.size = 32;
      assert.equal(selectedAsset(tool).size, 32);
    } finally {
      if (Object.hasOwn(original, "size")) pin.size = original.size;
      else delete pin.size;
    }
  }
});

test("print-spec is read-only and selects this host", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-native.mjs", "lychee", "--print-spec"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const spec = JSON.parse(result.stdout);
  assert.equal(spec.key, selectedAsset("lychee").key);
  assert.equal(spec.sha256, manifest.tools.lychee.assets[spec.key].sha256);
});

test("one supply manifest declares the selected native tools without a retired entry", () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(Object.keys(manifest.tools), [
    "lychee",
    "vale",
    "osv-scanner",
  ]);
  const vale = manifest.tools.vale;
  const platforms = Object.keys(manifest.tools.lychee.assets).sort();
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    assert.deepEqual(
      Object.keys(descriptor.assets).sort(),
      platforms,
      `${tool} supply must match the complete supported tool graph`,
    );
  }
  for (const [key, asset] of Object.entries(vale.assets)) {
    const selected = selectedAsset("vale", ...key.split("-"));
    assert.equal(selected.sha256, asset.sha256);
    assert.match(selected.url, /vale-cli\/vale/u);
  }
  assert.deepEqual(Object.keys(vale.licenses), ["LICENSE"]);
  assert.match(vale.licenses.LICENSE.sha256, /^[0-9a-f]{64}$/u);
  assert.throws(() => selectedAsset("unknown"), /unknown/u);
  assert.throws(
    () => selectedAsset("vale", "linux", "riscv64"),
    /unsupported/u,
  );
  assert.equal(
    fs.existsSync(path.join(root, ".config/tools/lychee.json")),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(root, "tools/ci/install-lychee.mjs")),
    false,
  );
});

test("official OSV supply pins raw binaries and notices for every native host", () => {
  const descriptor = manifest.tools["osv-scanner"];
  assert.ok(descriptor, "the existing supply owner must declare OSV Scanner");
  assert.equal(descriptor.format, "binary");
  assert.deepEqual(
    Object.keys(descriptor.assets).sort(),
    Object.keys(manifest.tools.lychee.assets).sort(),
  );
  for (const [key, asset] of Object.entries(descriptor.assets)) {
    const selected = selectedAsset("osv-scanner", ...key.split("-"));
    assert.equal(selected.format, "binary");
    assert.equal(selected.size, asset.size);
    assert.ok(selected.size > 32 * 1024 * 1024);
    assert.ok(selected.size < 64 * 1024 * 1024);
    assert.match(selected.sha256, /^[0-9a-f]{64}$/u);
    assert.match(selected.url, /google\/osv-scanner\/releases\/download/u);
  }
  assert.deepEqual(Object.keys(descriptor.licenses), ["LICENSE"]);
  assert.match(descriptor.licenses.LICENSE.sha256, /^[0-9a-f]{64}$/u);
});
