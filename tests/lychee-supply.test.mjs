import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { test } from "node:test";
import {
  assertAssetDigest,
  downloadAsset,
  gitlabPackageRequest,
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
  assert.deepEqual(Object.keys(manifest.licenses).sort(), [
    "LICENSE-APACHE",
    "LICENSE-MIT",
  ]);
  for (const license of Object.values(manifest.licenses)) {
    assert.match(license.sha256, /^[0-9a-f]{64}$/u);
    assert.match(license.source, /lychee-v0\.24\.2/u);
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

test("GitLab package request stays on its own CI API with header-only identity", () => {
  const asset = selectedAsset("linux", "arm64");
  const request = gitlabPackageRequest(asset, {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  });
  assert.equal(
    request.url,
    "https://gitlab.example.test/api/v4/projects/42/packages/generic/lychee/0.24.2/lychee-aarch64-unknown-linux-gnu.tar.gz",
  );
  assert.deepEqual(request.headers, { "JOB-TOKEN": "fixture-only" });
  assert.equal(request.redirect, "error");
  assert.doesNotMatch(request.url, /fixture-only|github\.com/u);
});

test("GitLab package request refuses missing or untrusted CI inputs", () => {
  const asset = selectedAsset("linux", "arm64");
  const valid = {
    CI_API_V4_URL: "https://gitlab.example.test/api/v4",
    CI_PROJECT_ID: "42",
    CI_JOB_TOKEN: "fixture-only",
  };
  for (const changed of [
    { CI_API_V4_URL: "" },
    { CI_API_V4_URL: "https://user:pass@gitlab.example.test/api/v4" },
    { CI_API_V4_URL: "https://gitlab.example.test/other" },
    { CI_API_V4_URL: "ftp://gitlab.example.test/api/v4" },
    { CI_PROJECT_ID: "42/other" },
    { CI_JOB_TOKEN: "" },
  ]) {
    assert.throws(() => gitlabPackageRequest(asset, { ...valid, ...changed }));
  }
});

test("authenticated package download refuses redirects before forwarding identity", async () => {
  let assetHits = 0;
  let seenToken = "";
  const server = createServer((request, response) => {
    if (request.url === "/redirect") {
      response.writeHead(302, { Location: "/asset" });
      response.end();
      return;
    }
    assetHits += 1;
    seenToken = request.headers["job-token"];
    response.end("bounded asset");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const request = {
      url: `${base}/asset`,
      headers: { "JOB-TOKEN": "fixture-only" },
      redirect: "error",
    };
    assert.equal((await downloadAsset(request)).toString(), "bounded asset");
    assert.equal(seenToken, "fixture-only");
    await assert.rejects(
      downloadAsset({ ...request, url: `${base}/redirect` }),
    );
    assert.equal(assetHits, 1);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GitLab CLI mode fails closed without CI identity", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/ci/install-lychee.mjs", "--gitlab-package"],
    {
      cwd: root,
      encoding: "utf8",
      timeout: 10_000,
      env: {
        ...process.env,
        CI_API_V4_URL: "",
        CI_PROJECT_ID: "",
        CI_JOB_TOKEN: "",
      },
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /GitLab CI API URL/u);
  assert.doesNotMatch(result.stderr, /github\.com/u);
});
