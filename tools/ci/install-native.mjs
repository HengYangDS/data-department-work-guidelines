import { createHash } from "node:crypto";
import {
  linkSync,
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
import {
  packageTransportFailure,
  projectPackageRequest,
} from "./gitlab-package.mjs";
import {
  assertNativeBinaryDigest,
  filePath,
  managedFileExists,
  readNativeSupply,
  reportError,
  root,
  run,
} from "../docs/runtime.mjs";

export const manifest = readNativeSupply();

export function selectedAsset(
  tool,
  platform = process.platform,
  architecture = process.arch,
) {
  const key = `${platform}-${architecture}`;
  if (!Object.hasOwn(manifest.tools, tool)) {
    throw new Error(`unknown native tool: ${tool}`);
  }
  const descriptor = manifest.tools[tool];
  const asset = descriptor.assets[key];
  if (!asset || !/^[0-9a-f]{64}$/u.test(asset.sha256)) {
    throw new Error(`unsupported or unpinned ${tool} platform: ${key}`);
  }
  const format = descriptor.format ?? "archive";
  if (
    !["archive", "binary"].includes(format) ||
    ((format === "binary" || asset.size !== undefined) &&
      (!Number.isSafeInteger(asset.size) ||
        asset.size <= 0 ||
        asset.size > 64 * 1024 * 1024))
  )
    throw new Error(`invalid ${tool} asset format or size: ${key}`);
  if (format === "archive" && !/^[0-9a-f]{64}$/u.test(asset.binarySha256 ?? ""))
    throw new Error(`unpinned ${tool} binary digest: ${key}`);
  return {
    ...asset,
    format,
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
  if (!managedFileExists(target)) return false;
  assertNativeBinaryDigest(readFileSync(target), selected, selected.tool);
  const version = run(target, ["--version"], {
    capture: true,
    rejectStderr: true,
    timeout: 10_000,
  }).trim();
  if (version !== selected.versionOutput) {
    throw new Error(
      `existing ${selected.tool} cache entry is invalid: ${target}`,
    );
  }
  return true;
}

export async function downloadAsset(request, asset = {}) {
  let response;
  try {
    response = await fetch(request.url, {
      headers: request.headers,
      redirect: request.redirect ?? "follow",
      signal: AbortSignal.timeout(90_000),
    });
  } catch (error) {
    throw new Error("native tool download failed", {
      cause: request.headers ? packageTransportFailure(error) : error,
    });
  }
  if (!response.ok) {
    let cause;
    try {
      await response.body?.cancel();
    } catch (error) {
      cause = request.headers ? packageTransportFailure(error) : error;
    }
    throw new Error(
      `native tool download failed: HTTP ${response.status}`,
      cause === undefined ? undefined : { cause },
    );
  }
  if (!response.body) throw new Error("native tool download returned no body");
  const limit = asset.size ?? 32 * 1024 * 1024;
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > limit) break;
      chunks.push(chunk);
    }
  } catch (error) {
    throw new Error(
      size > limit
        ? "native tool download exceeds the size limit"
        : "native tool download body failed",
      { cause: request.headers ? packageTransportFailure(error) : error },
    );
  }
  if (size > limit)
    throw new Error("native tool download exceeds the size limit");
  return Buffer.concat(chunks);
}

export function assertAssetDigest(bytes, asset) {
  if (asset.size !== undefined && bytes.length !== asset.size)
    throw new Error(`native asset size mismatch: ${asset.name}`);
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
  const cached = managedFileExists(target);
  if (!assetFile && !request) {
    if (cached && verifiedCached(target, selected)) return target;
    throw new Error(
      `${tool} is not cached; provide --asset PATH, --download, or --gitlab-package`,
    );
  }
  mkdirSync(directory, { recursive: true });
  const temporary = mkdtempSync(path.join(directory, ".install-"));
  let primaryFailure;
  try {
    const archive = path.join(temporary, selected.name);
    const bytes = assetFile
      ? readFileSync(path.resolve(assetFile))
      : await downloadAsset(request, selected);
    assertAssetDigest(bytes, selected);
    writeFileSync(archive, bytes);
    let candidate = archive;
    if (selected.format === "archive") {
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
      run("tar", ["-xf", archive, "--no-same-owner", "-C", extracted], {
        rejectStderr: true,
        timeout: 30_000,
      });
      const candidates = binaryFiles(extracted, binaryName);
      if (candidates.length !== 1)
        throw new Error(`${tool} archive has ${candidates.length} binaries`);
      candidate = candidates[0];
    }
    const verifiedBytes = readFileSync(candidate);
    assertNativeBinaryDigest(verifiedBytes, selected, tool);
    if (process.platform !== "win32") chmodSync(candidate, 0o755);
    const version = run(candidate, ["--version"], {
      capture: true,
      rejectStderr: true,
      timeout: 10_000,
    }).trim();
    if (version !== selected.versionOutput)
      throw new Error(`${tool} binary version mismatch: ${version}`);
    let published = true;
    try {
      linkSync(candidate, target);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      published = false;
    }
    if (
      !managedFileExists(target) ||
      !readFileSync(target).equals(verifiedBytes)
    )
      throw new Error(`installed ${tool} published bytes failed verification`);
    if (published) {
      if (
        process.platform !== "win32" &&
        (lstatSync(target).mode & 0o777) !== 0o755
      )
        throw new Error(`installed ${tool} published mode failed verification`);
    } else if (!verifiedCached(target, selected)) {
      throw new Error(`installed ${tool} failed verification`);
    }
    return target;
  } catch (error) {
    primaryFailure = error;
    throw error;
  } finally {
    try {
      await rm(temporary, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 200,
      });
    } catch (cleanup) {
      if (primaryFailure !== undefined) {
        throw new SuppressedError(
          cleanup,
          primaryFailure,
          `native installation and stage cleanup failed: ${temporary}`,
        );
      }
      throw cleanup;
    }
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
        reportError(error);
        process.exitCode = 1;
      });
  } else {
    console.error(
      "usage: node tools/ci/install-native.mjs TOOL --print-spec|--asset PATH|--download|--gitlab-package",
    );
    process.exitCode = 2;
  }
}
