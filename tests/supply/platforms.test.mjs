import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { manifest, selectedAsset } from "../../tools/ci/install-native.mjs";
import { root } from "../../tools/runtime.mjs";
import { managedToolPath, nativeToolPlatform, nativeToolBinary } from "../../tools/supply.mjs";

test("Windows ARM64 selects native assets before pinned compatible fallbacks", () => {
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    const selected = selectedAsset(tool, "win32", "arm64");
    const expected = Object.hasOwn(descriptor.assets, "win32-arm64") ? "win32-arm64" : "win32-x64";
    assert.equal(selected.key, expected, tool);
    assert.equal(selected.name, descriptor.assets[expected].name, tool);
    assert.equal(selected.sha256, descriptor.assets[expected].sha256, tool);
    assert.equal(managedToolPath(tool, "win32-arm64"), managedToolPath(tool, expected), tool);
    const native = structuredClone(manifest);
    native.tools[tool].assets["win32-arm64"] = { name: "native asset fixture" };
    assert.equal(nativeToolPlatform(tool, "win32-arm64", native), "win32-arm64");
    delete native.tools[tool].assets["win32-x64"];
    delete native.tools[tool].assets["win32-arm64"];
    assert.throws(() => nativeToolPlatform(tool, "win32-arm64", native), /unsupported/u);
    assert.throws(() => selectedAsset(tool, "linux", "riscv64"), /unsupported/u);
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
  assert.throws(() => managedToolPath("osv-scanner", "win32-riscv64"), /unsupported/u);
});

test("managed paths retain their bound manifest without rereading supply", () => {
  using workspace = fs.mkdtempDisposableSync(path.join(os.tmpdir(), "ddwg-native-path-binding-"));
  const repository = workspace.path;
  const before = structuredClone(manifest);
  assert.throws(() => managedToolPath("osv-scanner", undefined, repository), {
    code: "ENOENT",
  });
  for (const [tool, descriptor] of Object.entries(manifest.tools)) {
    for (const platform of [...Object.keys(descriptor.assets), "win32-arm64"]) {
      const selected = selectedAsset(tool, ...platform.split("-"));
      assert.equal(
        managedToolPath(tool, platform, repository, manifest),
        path.join(
          repository,
          "build/runtime/tool-cache",
          tool,
          selected.version,
          selected.key,
          selected.binaryName,
        ),
      );
    }
  }
  assert.deepEqual(manifest, before);
  assert.deepEqual(fs.readdirSync(repository), []);
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
  for (const tool of Object.keys(manifest.tools)) {
    const selected = selectedAsset(tool);
    const pin = manifest.tools[tool].assets[selected.key];
    const original = { ...pin };
    try {
      for (const size of [undefined, "unbounded", 0, -1, 64 * 1024 * 1024 + 1]) {
        pin.size = size;
        assert.throws(() => selectedAsset(tool), /format|size/u);
      }
      pin.size = 32;
      assert.equal(selectedAsset(tool).size, 32);
      pin.format = "gzip";
      assert.throws(() => selectedAsset(tool), /format/u);
    } finally {
      for (const key of Object.keys(pin)) delete pin[key];
      Object.assign(pin, original);
    }
  }
});

test("print-spec is read-only and selects this host", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-native.mjs", "osv-scanner", "--print-spec"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
    },
  );
  assert.equal(result.status, 0, result.stderr);
  const spec = JSON.parse(result.stdout);
  assert.equal(spec.key, selectedAsset("osv-scanner").key);
  assert.equal(spec.sha256, manifest.tools["osv-scanner"].assets[spec.key].sha256);
});

test("official OSV supply pins raw binaries and notices for every native host", () => {
  const descriptor = manifest.tools["osv-scanner"];
  assert.ok(descriptor, "the existing supply owner must declare OSV Scanner");
  assert.equal(descriptor.format, "binary");
  assert.deepEqual(Object.keys(descriptor.assets).sort(), [
    "darwin-arm64",
    "darwin-x64",
    "linux-arm64",
    "linux-x64",
    "win32-x64",
  ]);
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
