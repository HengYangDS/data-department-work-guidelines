import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

export const digest = (text) => createHash("sha256").update(text).digest("hex");

export const listingSupply = {
  tools: {
    lychee: {
      assets: { fixture: { name: "lychee-aarch64-apple-darwin.tar.gz" } },
      licenses: { "LICENSE-MIT": {} },
    },
    vale: {
      assets: { fixture: { name: "vale-fixture.tar.gz" } },
      licenses: { LICENSE: {} },
    },
  },
};

export function record(overrides = {}) {
  return {
    schemaVersion: 4,
    version: "4.2.0",
    fileName: "data-department-work-guidelines-v4.2.0-offline-tools.tar.gz",
    sha256: digest("archive"),
    lockSha256: digest("lock"),
    packageJsonSha256: digest("package"),
    nativeToolsSha256: digest("native tools"),
    nodeMajor: 26,
    ...overrides,
  };
}

export const source = {
  version: "4.2.0",
  lockSha256: digest("lock"),
  packageJsonSha256: digest("package"),
  nativeToolsSha256: digest("native tools"),
  nodeMajor: 26,
};

export async function bundleFixture(
  run,
  { cache = true, lychee = true, vale = true } = {},
) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-test-"));
  try {
    const stage = path.join(directory, "stage");
    mkdirSync(path.join(stage, "npm-cache", "_cacache"), {
      recursive: true,
    });
    mkdirSync(path.join(stage, "native", "lychee"), { recursive: true });
    mkdirSync(path.join(stage, "native", "vale"));
    mkdirSync(path.join(stage, "licenses", "vale"), { recursive: true });
    writeFileSync(
      path.join(stage, "licenses", "vale", "LICENSE"),
      "Vale fixture license",
    );
    if (vale)
      writeFileSync(
        path.join(stage, "native", "vale", "vale-fixture.tar.gz"),
        "pinned Vale archive",
      );
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
        path.join(
          stage,
          "native",
          "lychee",
          "lychee-aarch64-apple-darwin.tar.gz",
        ),
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

export function buildFixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-build-test-"));
  const cleanup = () => rmSync(directory, { recursive: true, force: true });
  try {
    const repository = path.join(directory, "repository");
    const cacheDirectory = path.join(directory, "cache");
    const assetDirectory = path.join(directory, "assets");
    const licenseDirectory = path.join(directory, "licenses");
    mkdirSync(path.join(repository, ".config", "supply"), { recursive: true });
    mkdirSync(path.join(repository, ".config", "release"));
    mkdirSync(path.join(cacheDirectory, "_cacache", "index-v5"), {
      recursive: true,
    });
    mkdirSync(path.join(assetDirectory, "lychee"), { recursive: true });
    mkdirSync(path.join(assetDirectory, "vale"));
    mkdirSync(path.join(licenseDirectory, "lychee"), { recursive: true });
    mkdirSync(path.join(licenseDirectory, "vale"));
    writeFileSync(path.join(repository, "VERSION"), "4.2.0\n");
    writeFileSync(
      path.join(repository, "package.json"),
      JSON.stringify({ engines: { node: "26.x" } }),
    );
    writeFileSync(path.join(repository, "package-lock.json"), "fixture lock\n");
    writeFileSync(
      path.join(cacheDirectory, "_cacache", "index-v5", "entry"),
      "cached package",
    );
    const platform = `${process.platform}-${process.arch}`;
    const assetName = `lychee-${platform}.tar.gz`;
    const asset = Buffer.from("pinned lychee asset");
    writeFileSync(path.join(assetDirectory, "lychee", assetName), asset);
    const licenses = {};
    for (const name of ["LICENSE-APACHE", "LICENSE-MIT"]) {
      const bytes = Buffer.from(`${name} fixture`);
      writeFileSync(path.join(licenseDirectory, "lychee", name), bytes);
      licenses[name] = {
        sha256: digest(bytes),
        source: `https://example.test/${name}`,
      };
    }
    const valeAssetName = `vale-${platform}.tar.gz`;
    const valeAsset = Buffer.from("pinned Vale asset");
    const valeLicense = Buffer.from("Vale license fixture");
    writeFileSync(path.join(assetDirectory, "vale", valeAssetName), valeAsset);
    writeFileSync(path.join(licenseDirectory, "vale", "LICENSE"), valeLicense);
    const lychee = {
      version: "0.24.2",
      binary: "lychee",
      assets: { [platform]: { name: assetName, sha256: digest(asset) } },
      licenses,
    };
    writeFileSync(
      path.join(repository, ".config", "supply", "native.json"),
      JSON.stringify({
        schemaVersion: 1,
        tools: {
          lychee,
          vale: {
            version: "3.23.0",
            binary: "vale",
            assets: {
              [platform]: { name: valeAssetName, sha256: digest(valeAsset) },
            },
            licenses: {
              LICENSE: {
                sha256: digest(valeLicense),
                source: "https://example.test/vale/LICENSE",
              },
            },
          },
        },
      }),
    );
    const outputPath = path.join(directory, record().fileName);
    const result = run({
      repository,
      cacheDirectory,
      assetDirectory,
      licenseDirectory,
      outputPath,
      assetName,
    });
    if (result && typeof result.then === "function") {
      return result.finally(cleanup);
    }
    cleanup();
    return result;
  } catch (error) {
    cleanup();
    throw error;
  }
}

export function pathExistsForTest(file) {
  try {
    readFileSync(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export function assertNpmResult(result, expectedStatus, args) {
  const diagnostic = JSON.stringify(
    {
      args,
      expectedStatus,
      status: result.status,
      signal: result.signal,
      error: result.error && {
        name: result.error.name,
        message: result.error.message,
        code: result.error.code,
        path: result.error.path,
        syscall: result.error.syscall,
      },
      stdout: result.stdout,
      stderr: result.stderr,
    },
    null,
    2,
  );
  assert.equal(result.error, undefined, diagnostic);
  assert.equal(result.status, expectedStatus, diagnostic);
  return diagnostic;
}
