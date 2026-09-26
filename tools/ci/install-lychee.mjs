import { createHash } from "node:crypto";
import {
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
  chmodSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { filePath, root, run } from "../docs/runtime.mjs";

export const manifest = JSON.parse(
  readFileSync(filePath(".config/tools/lychee.json"), "utf8"),
);

export function selectedAsset(
  platform = process.platform,
  architecture = process.arch,
) {
  const key = `${platform}-${architecture}`;
  const asset = manifest.assets[key];
  if (!asset || !/^[0-9a-f]{64}$/u.test(asset.sha256)) {
    throw new Error(`unsupported or unpinned lychee platform: ${key}`);
  }
  return {
    ...asset,
    key,
    version: manifest.version,
    url: `${manifest.github_download_base}/${asset.name}`,
  };
}

export function gitlabPackageRequest(
  asset = selectedAsset(),
  environment = process.env,
) {
  const apiUrl = environment.CI_API_V4_URL;
  const projectId = environment.CI_PROJECT_ID;
  const token = environment.CI_JOB_TOKEN;
  let api;
  try {
    api = new URL(apiUrl);
  } catch {
    throw new Error("GitLab CI API URL is missing or invalid");
  }
  const apiPath = api.pathname.replace(/\/+$/u, "");
  if (
    !["http:", "https:"].includes(api.protocol) ||
    api.username ||
    api.password ||
    api.search ||
    api.hash ||
    !apiPath.endsWith("/api/v4")
  ) {
    throw new Error("GitLab CI API URL is not a trusted API base");
  }
  if (!/^\d+$/u.test(projectId ?? ""))
    throw new Error("GitLab CI project ID is missing or invalid");
  if (!token || /[\r\n]/u.test(token))
    throw new Error("GitLab CI job token is missing or invalid");
  const packageName = manifest.gitlab_package_name;
  if (!/^[a-z][a-z0-9-]*$/u.test(packageName ?? ""))
    throw new Error("GitLab package name is missing or invalid");
  if (!asset.name || path.basename(asset.name) !== asset.name)
    throw new Error("lychee asset name is not portable");
  const route = [
    apiPath,
    "projects",
    projectId,
    "packages/generic",
    packageName,
    manifest.version,
    encodeURIComponent(asset.name),
  ].join("/");
  return {
    url: new URL(route, api.origin).href,
    headers: { "JOB-TOKEN": token },
    redirect: "error",
  };
}

export function safeArchiveEntries(listing) {
  const entries = listing.split(/\r?\n/u).filter(Boolean);
  for (const entry of entries) {
    const parts = entry.replaceAll("\\", "/").split("/");
    if (
      entry.startsWith("/") ||
      /^[A-Za-z]:/u.test(entry) ||
      parts.includes("..")
    ) {
      throw new Error(`unsafe lychee archive member: ${entry}`);
    }
  }
  return entries;
}

function binaryFiles(directory, name) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const target = path.join(directory, item.name);
    if (item.isDirectory()) return binaryFiles(target, name);
    return item.isFile() &&
      item.name === name &&
      !lstatSync(target).isSymbolicLink()
      ? [target]
      : [];
  });
}

function verifiedCached(target) {
  if (!existsSync(target)) return false;
  const version = run(target, ["--version"], {
    capture: true,
    timeout: 10_000,
  }).trim();
  if (version !== `lychee ${manifest.version}`) {
    throw new Error(`existing lychee cache entry is invalid: ${target}`);
  }
  return true;
}

export async function downloadAsset(request) {
  const response = await fetch(request.url, {
    headers: request.headers,
    redirect: request.redirect ?? "follow",
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok)
    throw new Error(`lychee download failed: HTTP ${response.status}`);
  if (!response.body) throw new Error("lychee download returned no body");
  const limit = 32 * 1024 * 1024;
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error("lychee download exceeds the size limit");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function assertAssetDigest(bytes, asset) {
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256)
    throw new Error(`lychee asset digest mismatch: ${asset.name}`);
}

export async function install({ assetFile = "", downloadSource = "" } = {}) {
  if (assetFile && downloadSource)
    throw new Error("choose one lychee supply path");
  const selected = selectedAsset();
  const request = assetFile
    ? null
    : downloadSource === "github"
      ? { url: selected.url }
      : downloadSource === "gitlab"
        ? gitlabPackageRequest(selected)
        : null;
  const binaryName = process.platform === "win32" ? "lychee.exe" : "lychee";
  const directory = filePath(
    `build/runtime/tool-cache/lychee/${selected.version}/${selected.key}`,
  );
  const target = path.join(directory, binaryName);
  if (!assetFile && !request) {
    if (verifiedCached(target)) return target;
    throw new Error(
      "lychee is not cached; provide --asset PATH, --download, or --gitlab-package",
    );
  }
  mkdirSync(directory, { recursive: true });
  const temporary = mkdtempSync(path.join(directory, ".install-"));
  try {
    const archive = path.join(temporary, selected.name);
    const bytes = assetFile
      ? readFileSync(path.resolve(assetFile))
      : await downloadAsset(request);
    assertAssetDigest(bytes, selected);
    writeFileSync(archive, bytes);
    safeArchiveEntries(
      run("tar", ["-tf", archive], { capture: true, timeout: 30_000 }),
    );
    const extracted = path.join(temporary, "extracted");
    mkdirSync(extracted);
    run("tar", ["-xf", archive, "-C", extracted], { timeout: 30_000 });
    const candidates = binaryFiles(extracted, binaryName);
    if (candidates.length !== 1)
      throw new Error(`lychee archive has ${candidates.length} binaries`);
    if (process.platform !== "win32") chmodSync(candidates[0], 0o755);
    const version = run(candidates[0], ["--version"], {
      capture: true,
      timeout: 10_000,
    }).trim();
    if (version !== `lychee ${manifest.version}`)
      throw new Error(`lychee binary version mismatch: ${version}`);
    try {
      copyFileSync(candidates[0], target, constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== "EEXIST" || !verifiedCached(target)) throw error;
    }
    if (process.platform !== "win32") chmodSync(target, 0o755);
    if (!verifiedCached(target))
      throw new Error("installed lychee failed verification");
    return target;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const print = args.length === 1 && args[0] === "--print-spec";
  const downloadRequested = args.length === 1 && args[0] === "--download";
  const gitlabRequested = args.length === 1 && args[0] === "--gitlab-package";
  const localAsset = args.length === 2 && args[0] === "--asset" ? args[1] : "";
  if (print) {
    console.log(JSON.stringify(selectedAsset(), null, 2));
  } else if (downloadRequested || gitlabRequested || localAsset) {
    install({
      assetFile: localAsset,
      downloadSource: gitlabRequested
        ? "gitlab"
        : downloadRequested
          ? "github"
          : "",
    })
      .then((target) =>
        console.log(
          `PASS pinned lychee installed: ${path.relative(root, target)}`,
        ),
      )
      .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      });
  } else {
    console.error(
      "usage: node tools/ci/install-lychee.mjs --print-spec|--asset PATH|--download|--gitlab-package",
    );
    process.exitCode = 2;
  }
}
