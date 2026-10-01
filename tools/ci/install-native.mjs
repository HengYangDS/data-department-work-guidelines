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
  writeFileSync,
  chmodSync,
} from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { projectPackageRequest } from "./gitlab-package.mjs";
import { filePath, readNativeSupply, root, run } from "../docs/runtime.mjs";

export const manifest = readNativeSupply();

export function selectedAsset(
  tool,
  platform = process.platform,
  architecture = process.arch,
) {
  const key = `${platform}-${architecture}`;
  const descriptor = manifest.tools[tool];
  if (!descriptor) throw new Error(`unknown native tool: ${tool}`);
  const asset = descriptor.assets[key];
  if (!asset || !/^[0-9a-f]{64}$/u.test(asset.sha256)) {
    throw new Error(`unsupported or unpinned ${tool} platform: ${key}`);
  }
  return {
    ...asset,
    key,
    tool,
    version: descriptor.version,
    versionOutput: descriptor.versionOutput,
    binaryName: descriptor.binary + (platform === "win32" ? ".exe" : ""),
    url: `${descriptor.github_download_base}/${asset.name}`,
  };
}

export function gitlabPackageRequest(
  tool,
  asset = selectedAsset(tool),
  environment = process.env,
) {
  return projectPackageRequest(
    {
      packageName: manifest.tools[tool].gitlab_package_name,
      version: manifest.tools[tool].version,
      fileName: asset.name,
    },
    environment,
  );
}

export function safeArchiveEntries(listing, verbose) {
  const entries = listing.split(/\r?\n/u).filter(Boolean);
  const details = verbose?.split(/\r?\n/u).filter(Boolean) ?? [];
  if (!entries.length || entries.length !== details.length)
    throw new Error("native archive listing is incomplete");
  const seen = new Set();
  for (const [index, entry] of entries.entries()) {
    const normalized = entry.replace(/^\.\//u, "").replace(/\/$/u, "");
    const parts = normalized.split("/");
    if (
      entry.startsWith("/") ||
      entry.includes("\\") ||
      entry.includes("\0") ||
      entry.includes(":") ||
      parts.includes("..") ||
      (normalized !== "." && parts.includes(".")) ||
      (normalized && parts.includes("")) ||
      seen.has(normalized)
    )
      throw new Error(`unsafe native archive member: ${entry}`);
    seen.add(normalized);
    const directory = entry.endsWith("/") || entry === ".";
    if (details[index][0] !== (directory ? "d" : "-"))
      throw new Error(`non-regular native archive member: ${entry}`);
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

function verifiedCached(target, selected) {
  if (!existsSync(target)) return false;
  const version = run(target, ["--version"], {
    capture: true,
    timeout: 10_000,
  }).trim();
  if (version !== selected.versionOutput) {
    throw new Error(
      `existing ${selected.tool} cache entry is invalid: ${target}`,
    );
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
    throw new Error(`native tool download failed: HTTP ${response.status}`);
  if (!response.body) throw new Error("native tool download returned no body");
  const limit = 32 * 1024 * 1024;
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit)
      throw new Error("native tool download exceeds the size limit");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function assertAssetDigest(bytes, asset) {
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256)
    throw new Error(`native asset digest mismatch: ${asset.name}`);
}

export async function install({
  tool,
  assetFile = "",
  downloadSource = "",
} = {}) {
  if (!["", "github", "gitlab"].includes(downloadSource))
    throw new Error("invalid native tool supply source");
  if (assetFile && downloadSource)
    throw new Error("choose one native tool supply path");
  const selected = selectedAsset(tool);
  const request = assetFile
    ? null
    : downloadSource === "github"
      ? { url: selected.url }
      : downloadSource === "gitlab"
        ? gitlabPackageRequest(tool, selected)
        : null;
  const binaryName = selected.binaryName;
  const directory = filePath(
    `build/runtime/tool-cache/${tool}/${selected.version}/${selected.key}`,
  );
  const target = path.join(directory, binaryName);
  if (!assetFile && !request) {
    if (verifiedCached(target, selected)) return target;
    throw new Error(
      `${tool} is not cached; provide --asset PATH, --download, or --gitlab-package`,
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
      run("tar", ["-tf", archive], {
        capture: true,
        rejectStderr: true,
        timeout: 30_000,
      }),
      run("tar", ["-tvf", archive], {
        capture: true,
        rejectStderr: true,
        timeout: 30_000,
      }),
    );
    const extracted = path.join(temporary, "extracted");
    mkdirSync(extracted);
    run("tar", ["-xf", archive, "-C", extracted], {
      rejectStderr: true,
      timeout: 30_000,
    });
    const candidates = binaryFiles(extracted, binaryName);
    if (candidates.length !== 1)
      throw new Error(`${tool} archive has ${candidates.length} binaries`);
    if (process.platform !== "win32") chmodSync(candidates[0], 0o755);
    const version = run(candidates[0], ["--version"], {
      capture: true,
      timeout: 10_000,
    }).trim();
    if (version !== selected.versionOutput)
      throw new Error(`${tool} binary version mismatch: ${version}`);
    try {
      copyFileSync(candidates[0], target, constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== "EEXIST" || !verifiedCached(target, selected))
        throw error;
    }
    if (process.platform !== "win32") chmodSync(target, 0o755);
    if (!verifiedCached(target, selected))
      throw new Error(`installed ${tool} failed verification`);
    return target;
  } finally {
    await rm(temporary, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200,
    });
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [tool, ...args] = process.argv.slice(2);
  const print = args.length === 1 && args[0] === "--print-spec";
  const downloadRequested = args.length === 1 && args[0] === "--download";
  const gitlabRequested = args.length === 1 && args[0] === "--gitlab-package";
  const localAsset = args.length === 2 && args[0] === "--asset" ? args[1] : "";
  if (print) {
    console.log(JSON.stringify(selectedAsset(tool), null, 2));
  } else if (downloadRequested || gitlabRequested || localAsset) {
    install({
      tool,
      assetFile: localAsset,
      downloadSource: gitlabRequested
        ? "gitlab"
        : downloadRequested
          ? "github"
          : "",
    })
      .then((target) =>
        console.log(
          `PASS pinned ${tool} installed: ${path.relative(root, target)}`,
        ),
      )
      .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
      });
  } else {
    console.error(
      "usage: node tools/ci/install-native.mjs TOOL --print-spec|--asset PATH|--download|--gitlab-package",
    );
    process.exitCode = 2;
  }
}
