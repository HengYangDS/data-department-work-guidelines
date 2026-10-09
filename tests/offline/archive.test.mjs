import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import childProcess from "node:child_process";
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import path from "node:path";
import { test } from "node:test";
import { readNativeSupply } from "../../tools/docs/runtime.mjs";
import { assembleBundle } from "../../tools/ci/offline/build.mjs";
import {
  assertSafeBundleListing,
  inspectBundle,
  readBundleRecord,
  validateBundleRecord,
  validateExtractedBundle,
  verifyBundle,
} from "../../tools/ci/offline/artifact.mjs";
import { installBundle } from "../../tools/ci/offline/install.mjs";
import {
  digest,
  listingSupply,
  record,
  source,
  bundleFixture,
  buildFixture,
} from "../offline/fixtures.mjs";

test("bundle identity is bound to the exact source inputs", () => {
  assert.doesNotThrow(() => validateBundleRecord(record(), source));
  for (const changed of [
    { version: "4.1.1" },
    { lockSha256: digest("other lock") },
    { nativeToolsSha256: digest("other native tools") },
    { sha256: "0".repeat(64) },
    { fileName: "../offline-tools.tar.gz" },
    { nodeMajor: 22 },
    { npmMajor: 11 },
    { unexpected: "second authority" },
  ]) {
    assert.throws(() => validateBundleRecord(record(changed), source));
  }
  assert.throws(() =>
    validateBundleRecord(record(), { ...source, version: "4.3.0" }),
  );
  assert.throws(() =>
    validateBundleRecord(record(), { ...source, nodeMajor: 22 }),
  );
});

test("bundle archive admits only regular files in its declared roots", () => {
  const names = [
    "./",
    "./manifest.json",
    "./npm-cache/",
    "./npm-cache/_cacache/",
    "./npm-cache/_cacache/index-v5/one",
    "./native/",
    "./native/lychee/",
    "./native/vale/",
    "./native/vale/vale-fixture.tar.gz",
    "./native/lychee/lychee-aarch64-apple-darwin.tar.gz",
    "./licenses/",
    "./licenses/lychee/",
    "./licenses/lychee/LICENSE-MIT",
    "./licenses/vale/",
    "./licenses/vale/LICENSE",
  ].join("\n");
  const verbose = [
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/_cacache/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./npm-cache/_cacache/index-v5/one",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/lychee/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./native/vale/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./native/vale/vale-fixture.tar.gz",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./native/lychee/lychee-aarch64-apple-darwin.tar.gz",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/lychee/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./licenses/lychee/LICENSE-MIT",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/vale/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./licenses/vale/LICENSE",
  ].join("\n");
  assert.doesNotThrow(() =>
    assertSafeBundleListing(names, verbose, listingSupply),
  );
  for (const unsafe of [
    "../outside",
    "/tmp/outside",
    "C:/outside",
    "./npm-cache/../outside",
    "./npm-cache\\outside",
    "./unexpected/file",
  ]) {
    assert.throws(() =>
      assertSafeBundleListing(
        `${names}\n${unsafe}`,
        `${verbose}\n-rw-r--r-- 0/0 10 Jan 1 00:00 ${unsafe}`,
        listingSupply,
      ),
    );
  }
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./manifest.json`,
      `${verbose}\n-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json`,
      listingSupply,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./native/lychee/link`,
      `${verbose}\nlrwxr-xr-x 0/0 0 Jan 1 00:00 ./native/lychee/link -> /tmp/outside`,
      listingSupply,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(
      names,
      verbose.split("\n").slice(0, -1).join("\n"),
      listingSupply,
    ),
  );
});

test("bundle inventory derives raw and archived assets from the same supply manifest", () => {
  const tools = {
    "osv-scanner": {
      format: "binary",
      assets: { "linux-arm64": { name: "osv-scanner_linux_arm64" } },
      licenses: { LICENSE: {} },
    },
  };
  const members = [
    ["./", "d"],
    ["./manifest.json", "-"],
    ["./npm-cache/", "d"],
    ["./npm-cache/_cacache/", "d"],
    ["./npm-cache/_cacache/entry", "-"],
    ["./native/", "d"],
    ["./native/osv-scanner/", "d"],
    ["./native/osv-scanner/osv-scanner_linux_arm64", "-"],
    ["./licenses/", "d"],
    ["./licenses/osv-scanner/", "d"],
    ["./licenses/osv-scanner/LICENSE", "-"],
  ];
  const listing = (items) => [
    items.map(([name]) => name).join("\n"),
    items.map(([name, type]) => `${type}rwxr-xr-x 0/0 10 ${name}`).join("\n"),
  ];
  assert.doesNotThrow(() =>
    assertSafeBundleListing(...listing(members), { tools }),
  );
  for (const extra of [
    "./native/osv-scanner/undeclared",
    "./native/retired/",
    "./licenses/osv-scanner/old-notice",
  ]) {
    assert.throws(
      () =>
        assertSafeBundleListing(
          ...listing([...members, [extra, extra.endsWith("/") ? "d" : "-"]]),
          { tools },
        ),
      /unexpected|missing/u,
    );
  }
  assert.throws(
    () =>
      assertSafeBundleListing(
        ...listing(
          members.filter(([name]) => !name.endsWith("osv-scanner_linux_arm64")),
        ),
        { tools },
      ),
    /missing/u,
  );
});

test("bundle digest is verified before archive inspection", async () => {
  await bundleFixture(async (bundle, expected) => {
    assert.equal(
      (await inspectBundle(bundle, expected, source, listingSupply)).sha256,
      expected.sha256,
    );
    appendFileSync(bundle, "altered");
    assert.throws(
      () => inspectBundle(bundle, expected, source, listingSupply),
      /digest/u,
    );
  });
});

test("bundle inspection rejects incomplete supply", async () => {
  for (const missing of [
    { cache: false },
    { lychee: false },
    { vale: false },
  ]) {
    await bundleFixture(async (bundle, expected) => {
      assert.throws(
        () => inspectBundle(bundle, expected, source, listingSupply),
        /missing/u,
      );
    }, missing);
  }
});

test("extracted bundle contents agree with source and pinned supply", () => {
  buildFixture((inputs) => {
    assembleBundle(inputs);
    const extracted = path.join(path.dirname(inputs.outputPath), "extracted");
    mkdirSync(extracted);
    const result = spawnSync(
      "tar",
      ["-xf", inputs.outputPath, "-C", extracted],
      {
        encoding: "utf8",
        timeout: 10_000,
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotThrow(() =>
      validateExtractedBundle(extracted, inputs.repository),
    );
    const asset = path.join(extracted, "native", "lychee", inputs.assetName);
    const originalAsset = readFileSync(asset);
    writeFileSync(asset, "altered");
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /asset.*digest/u,
    );
    writeFileSync(asset, originalAsset);
    const license = path.join(extracted, "licenses", "lychee", "LICENSE-MIT");
    const originalLicense = readFileSync(license);
    writeFileSync(license, "altered");
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /license.*digest/u,
    );
    writeFileSync(license, originalLicense);
    rmSync(path.join(extracted, "npm-cache", "_cacache", "index-v5", "entry"));
    assert.throws(
      () => validateExtractedBundle(extracted, inputs.repository),
      /cache.*count/u,
    );
  });
});

test("bundle extraction retains the current executor's ownership", (context) => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const nativeSpawn = childProcess.spawnSync;
    const extraction = context.mock.method(
      childProcess,
      "spawnSync",
      (command, args, options) => {
        if (command === "tar" && args.includes("-xf")) {
          assert.ok(args.includes("--no-same-owner"));
        }
        return nativeSpawn(command, args, options);
      },
    );
    syncBuiltinESMExports();
    try {
      verifyBundle({
        bundlePath: inputs.outputPath,
        record: built,
        repository: inputs.repository,
      });
      installBundle({
        bundlePath: inputs.outputPath,
        record: built,
        repository: inputs.repository,
        commandRunner: (_command, args) => {
          if (args[1] === "--version") return "12.2.0\n";
          if (args[1] === "ci") {
            mkdirSync(path.join(inputs.repository, "node_modules"));
          }
          if (path.basename(args[0]) === "install-native.mjs") {
            const descriptor = readNativeSupply(inputs.repository).tools[
              args[1]
            ];
            const target = path.join(
              inputs.repository,
              "build/runtime/tool-cache",
              args[1],
              descriptor.version,
              `${process.platform}-${process.arch}`,
              descriptor.binary + (process.platform === "win32" ? ".exe" : ""),
            );
            mkdirSync(path.dirname(target), { recursive: true });
            writeFileSync(target, "verified native fixture");
          }
          return "";
        },
      });
      assert.equal(
        extraction.mock.calls.filter(
          ({ arguments: [command, args] }) =>
            command === "tar" && args.includes("-xf"),
        ).length,
        2,
      );
    } finally {
      extraction.mock.restore();
      syncBuiltinESMExports();
    }
  });
});

test("tracked bundle identity rejects source drift", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const recordPath = path.join(
      inputs.repository,
      ".config",
      "release",
      "offline-bundle.json",
    );
    writeFileSync(recordPath, JSON.stringify(built));
    assert.deepEqual(readBundleRecord(inputs.repository), built);
    writeFileSync(
      path.join(inputs.repository, "CHANGELOG.md"),
      "# Changelog\n\n## 4.2.0 - 2026-10-08\n\n### Fixed\n\n- Clarify release qualification.\n",
    );
    assert.deepEqual(readBundleRecord(inputs.repository), built);
    const packagePath = path.join(inputs.repository, "package.json");
    const packageBytes = readFileSync(packagePath);
    const manifest = JSON.parse(packageBytes);
    manifest.scripts = { ...manifest.scripts, test: "node --test" };
    writeFileSync(packagePath, JSON.stringify(manifest));
    assert.throws(() => readBundleRecord(inputs.repository), /source/u);
    writeFileSync(packagePath, packageBytes);
    writeFileSync(path.join(inputs.repository, "package-lock.json"), "altered");
    assert.throws(() => readBundleRecord(inputs.repository), /source/u);
  });
});
