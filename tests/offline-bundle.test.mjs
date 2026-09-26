import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  assembleBundle,
  assertSafeBundleListing,
  inspectBundle,
  installBundle,
  readBundleRecord,
  validateBundleRecord,
  validateExtractedBundle,
  validateLockSupply,
} from "../tools/ci/offline-bundle.mjs";
import { root } from "../tools/docs/runtime.mjs";

const digest = (text) => createHash("sha256").update(text).digest("hex");

function record(overrides = {}) {
  return {
    schemaVersion: 1,
    version: "4.2.0",
    fileName: "data-department-work-guidelines-v4.2.0-offline-tools.tar.gz",
    sha256: digest("archive"),
    lockSha256: digest("lock"),
    lycheeSha256: digest("lychee"),
    nodeMajor: 22,
    npmMajor: 10,
    ...overrides,
  };
}

const source = {
  version: "4.2.0",
  lockSha256: digest("lock"),
  lycheeSha256: digest("lychee"),
};

test("bundle identity is bound to the exact source inputs", () => {
  assert.doesNotThrow(() => validateBundleRecord(record(), source));
  for (const changed of [
    { version: "4.1.1" },
    { lockSha256: digest("other lock") },
    { lycheeSha256: digest("other lychee") },
    { sha256: "0".repeat(64) },
    { fileName: "../offline-tools.tar.gz" },
    { nodeMajor: 26 },
    { npmMajor: 11 },
    { unexpected: "second authority" },
  ]) {
    assert.throws(() => validateBundleRecord(record(changed), source));
  }
  assert.throws(() =>
    validateBundleRecord(record(), { ...source, version: "4.3.0" }),
  );
});

test("bundle archive admits only regular files in its declared roots", () => {
  const names = [
    "./",
    "./manifest.json",
    "./npm-cache/",
    "./npm-cache/_cacache/",
    "./npm-cache/_cacache/index-v5/one",
    "./lychee/",
    "./lychee/lychee-aarch64-apple-darwin.tar.gz",
    "./licenses/",
    "./licenses/lychee/",
    "./licenses/lychee/LICENSE-MIT",
  ].join("\n");
  const verbose = [
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./npm-cache/_cacache/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./npm-cache/_cacache/index-v5/one",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./lychee/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./lychee/lychee-aarch64-apple-darwin.tar.gz",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/",
    "drwxr-xr-x 0/0 0 Jan 1 00:00 ./licenses/lychee/",
    "-rw-r--r-- 0/0 10 Jan 1 00:00 ./licenses/lychee/LICENSE-MIT",
  ].join("\n");
  assert.doesNotThrow(() => assertSafeBundleListing(names, verbose));
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
      ),
    );
  }
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./manifest.json`,
      `${verbose}\n-rw-r--r-- 0/0 10 Jan 1 00:00 ./manifest.json`,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(
      `${names}\n./lychee/link`,
      `${verbose}\nlrwxr-xr-x 0/0 0 Jan 1 00:00 ./lychee/link -> /tmp/outside`,
    ),
  );
  assert.throws(() =>
    assertSafeBundleListing(names, verbose.split("\n").slice(0, -1).join("\n")),
  );
});

async function bundleFixture(run, { cache = true, lychee = true } = {}) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-test-"));
  try {
    const stage = path.join(directory, "stage");
    mkdirSync(path.join(stage, "npm-cache", "_cacache"), {
      recursive: true,
    });
    mkdirSync(path.join(stage, "lychee"));
    mkdirSync(path.join(stage, "licenses", "lychee"), { recursive: true });
    writeFileSync(
      path.join(stage, "licenses", "lychee", "LICENSE-MIT"),
      "license fixture",
    );
    writeFileSync(path.join(stage, "manifest.json"), "{}\n");
    if (cache) {
      writeFileSync(
        path.join(stage, "npm-cache", "_cacache", "entry"),
        "cached package",
      );
    }
    if (lychee) {
      writeFileSync(
        path.join(stage, "lychee", "lychee-aarch64-apple-darwin.tar.gz"),
        "pinned archive",
      );
    }
    const bundle = path.join(directory, record().fileName);
    const result = spawnSync("tar", ["-czf", bundle, "-C", stage, "."], {
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.equal(result.status, 0, result.stderr);
    const bytes = readFileSync(bundle);
    return await run(bundle, record({ sha256: digest(bytes) }));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("bundle digest is verified before archive inspection", async () => {
  await bundleFixture(async (bundle, expected) => {
    assert.equal(
      (await inspectBundle(bundle, expected, source)).sha256,
      expected.sha256,
    );
    appendFileSync(bundle, "altered");
    assert.throws(() => inspectBundle(bundle, expected, source), /digest/u);
  });
});

test("bundle inspection rejects incomplete supply", async () => {
  for (const missing of [{ cache: false }, { lychee: false }]) {
    await bundleFixture(async (bundle, expected) => {
      assert.throws(() => inspectBundle(bundle, expected, source), /missing/u);
    }, missing);
  }
});

function buildFixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-build-test-"));
  try {
    const repository = path.join(directory, "repository");
    const cacheDirectory = path.join(directory, "cache");
    const assetDirectory = path.join(directory, "assets");
    const licenseDirectory = path.join(directory, "licenses");
    mkdirSync(path.join(repository, ".config", "tools"), { recursive: true });
    mkdirSync(path.join(cacheDirectory, "_cacache", "index-v5"), {
      recursive: true,
    });
    mkdirSync(assetDirectory);
    mkdirSync(licenseDirectory);
    writeFileSync(path.join(repository, "VERSION"), "4.2.0\n");
    writeFileSync(path.join(repository, "package-lock.json"), "fixture lock\n");
    writeFileSync(
      path.join(cacheDirectory, "_cacache", "index-v5", "entry"),
      "cached package",
    );
    const platform = `${process.platform}-${process.arch}`;
    const assetName = `lychee-${platform}.tar.gz`;
    const asset = Buffer.from("pinned lychee asset");
    writeFileSync(path.join(assetDirectory, assetName), asset);
    const licenses = {};
    for (const name of ["LICENSE-APACHE", "LICENSE-MIT"]) {
      const bytes = Buffer.from(`${name} fixture`);
      writeFileSync(path.join(licenseDirectory, name), bytes);
      licenses[name] = {
        sha256: digest(bytes),
        source: `https://example.test/${name}`,
      };
    }
    const lychee = {
      version: "0.24.2",
      assets: { [platform]: { name: assetName, sha256: digest(asset) } },
      licenses,
    };
    writeFileSync(
      path.join(repository, ".config", "tools", "lychee.json"),
      JSON.stringify(lychee),
    );
    const outputPath = path.join(directory, record().fileName);
    return run({
      repository,
      cacheDirectory,
      assetDirectory,
      licenseDirectory,
      outputPath,
      assetName,
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("builder admits only pinned, licensed, regular supply", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    assert.equal(built.version, "4.2.0");
    assert.match(built.sha256, /^[0-9a-f]{64}$/u);
    const checked = inspectBundle(inputs.outputPath, built, {
      version: built.version,
      lockSha256: built.lockSha256,
      lycheeSha256: built.lycheeSha256,
    });
    assert.equal(checked.sha256, built.sha256);
  });
  buildFixture((inputs) => {
    writeFileSync(
      path.join(inputs.assetDirectory, inputs.assetName),
      "altered",
    );
    assert.throws(() => assembleBundle(inputs), /digest/u);
  });
  buildFixture((inputs) => {
    rmSync(path.join(inputs.licenseDirectory, "LICENSE-MIT"));
    assert.throws(() => assembleBundle(inputs), /license/u);
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "tools",
      "lychee.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.assets[`${process.platform}-${process.arch}`].name =
      "../outside.tar.gz";
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*asset/u);
  });
  buildFixture((inputs) => {
    const manifestPath = path.join(
      inputs.repository,
      ".config",
      "tools",
      "lychee.json",
    );
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.licenses["../outside"] = manifest.licenses["LICENSE-MIT"];
    writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.throws(() => assembleBundle(inputs), /unsafe.*license/u);
  });

  if (process.platform !== "win32") {
    buildFixture((inputs) => {
      symlinkSync(
        path.join(inputs.assetDirectory, inputs.assetName),
        path.join(inputs.cacheDirectory, "_cacache", "index-v5", "link"),
      );
      assert.throws(() => assembleBundle(inputs), /symlink|regular/u);
    });
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
    const asset = path.join(extracted, "lychee", inputs.assetName);
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

test("installer invokes only the locked offline supply path", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args, options) => {
      calls.push({ command, args, options });
      if (command === "npm" && args[0] === "--version") return "10.9.4\n";
      if (command === "npm" && args[0] === "ci") {
        assert.ok(args.includes("--offline"));
        assert.ok(args.includes("--ignore-scripts"));
        assert.ok(args.includes("--cache"));
        assert.ok(!args.includes("--dry-run"));
        mkdirSync(path.join(inputs.repository, "node_modules"));
        assert.equal(options.env.npm_config_offline, "true");
        assert.notEqual(
          options.env.npm_config_userconfig,
          options.env.npm_config_globalconfig,
        );
      }
      return "";
    };
    const result = installBundle({
      bundlePath: inputs.outputPath,
      record: built,
      repository: inputs.repository,
      commandRunner,
    });
    assert.equal(result.version, "4.2.0");
    assert.deepEqual(
      calls.map(({ command, args }) => [command, args[0]]),
      [
        ["npm", "--version"],
        ["npm", "ci"],
        [
          process.execPath,
          path.join(inputs.repository, "tools", "ci", "install-lychee.mjs"),
        ],
      ],
    );
    assert.deepEqual(calls[2].args.slice(1, 2), ["--asset"]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const calls = [];
    const commandRunner = (command, args) => {
      calls.push([command, args[0]]);
      if (args[0] === "--version") return "10.9.4\n";
      throw new Error("simulated offline cache miss");
    };
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner,
        }),
      /offline cache miss/u,
    );
    assert.deepEqual(calls, [
      ["npm", "--version"],
      ["npm", "ci"],
    ]);
  });
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    mkdirSync(path.join(inputs.repository, "node_modules"));
    assert.throws(
      () =>
        installBundle({
          bundlePath: inputs.outputPath,
          record: built,
          repository: inputs.repository,
          commandRunner: () => {
            throw new Error("must not run");
          },
        }),
      /node_modules/u,
    );
  });
});

test("universal npm cache excludes platform and private supply", () => {
  const packageEntry = {
    resolved: "https://registry.npmjs.org/example/-/example-1.0.0.tgz",
    integrity: `sha512-${Buffer.alloc(64).toString("base64")}`,
  };
  const lock = {
    lockfileVersion: 3,
    packages: { "": {}, "node_modules/example": packageEntry },
  };
  assert.equal(validateLockSupply(lock), 1);
  for (const changed of [
    { resolved: "http://registry.npmjs.org/example.tgz" },
    { resolved: "https://user:pass@registry.npmjs.org/example.tgz" },
    { resolved: "https://registry.npmjs.org/example.tgz?token=fixture" },
    { resolved: "https://other.example.test/example.tgz" },
    { optional: true },
    { os: ["darwin"] },
    { cpu: ["arm64"] },
    { hasInstallScript: true },
    { integrity: "" },
  ]) {
    assert.throws(() =>
      validateLockSupply({
        ...lock,
        packages: {
          ...lock.packages,
          "node_modules/example": { ...packageEntry, ...changed },
        },
      }),
    );
  }
});

test("tracked bundle identity rejects source drift", () => {
  buildFixture((inputs) => {
    const built = assembleBundle(inputs);
    const recordPath = path.join(
      inputs.repository,
      ".config",
      "tools",
      "offline-bundle.json",
    );
    writeFileSync(recordPath, JSON.stringify(built));
    assert.deepEqual(readBundleRecord(inputs.repository), built);
    writeFileSync(path.join(inputs.repository, "package-lock.json"), "altered");
    assert.throws(() => readBundleRecord(inputs.repository), /source/u);
  });
});

test("an empty npm cache cannot satisfy the actual offline install", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-empty-cache-"));
  try {
    for (const name of ["package.json", "package-lock.json"]) {
      copyFileSync(path.join(root, name), path.join(directory, name));
    }
    const cache = path.join(directory, "cache");
    mkdirSync(cache);
    const userConfig = path.join(directory, "empty-user.npmrc");
    const globalConfig = path.join(directory, "empty-global.npmrc");
    writeFileSync(userConfig, "");
    writeFileSync(globalConfig, "");
    const result = spawnSync(
      "npm",
      ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
      {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
        env: {
          ...process.env,
          npm_config_cache: cache,
          npm_config_userconfig: userConfig,
          npm_config_globalconfig: globalConfig,
          npm_config_offline: "true",
          npm_config_audit: "false",
          npm_config_fund: "false",
        },
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ENOTCACHED/u);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
