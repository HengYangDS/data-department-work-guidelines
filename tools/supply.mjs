import { createHash } from "node:crypto";
import { accessSync, constants, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { filePath, managedFileExists, root, run } from "./runtime.mjs";

export const nativeSupplyPath = ".config/supply/native.json";
export function readNativeSupply(repository = root) {
  return JSON.parse(readFileSync(path.join(repository, nativeSupplyPath), "utf8"));
}

export function assertNativeBinaryDigest(bytes, asset, tool) {
  const expected = asset?.sha256;
  if (typeof expected !== "string" || !/^[0-9a-f]{64}$/u.test(expected))
    throw new Error(`unpinned ${tool} binary digest`);
  if (createHash("sha256").update(bytes).digest("hex") !== expected)
    throw new Error(`${tool} binary digest mismatch`);
}

function nativeExecutablePath(selected) {
  const windows = process.platform === "win32";
  if (windows && selected === ".") throw new Error(`native executable not found: ${selected}`);
  const explicit = path.isAbsolute(selected) || (windows ? /[/\\:]/u : /\//u).test(selected);
  const name = windows ? selected.split(/[/\\:]/u).at(-1) : selected;
  const directories = [];
  if (explicit) {
    directories.push("");
  } else if (windows) {
    if (!Object.hasOwn(process.env, "NoDefaultCurrentDirectoryInExePath")) directories.push(root);
    const search = process.env.PATH ?? "";
    for (let offset = 0; offset < search.length;) {
      const quote = search[offset];
      const quoted = quote === '"' || quote === "'";
      const close = quoted ? search.indexOf(quote, offset + 1) : offset;
      const separator = search.indexOf(";", close < 0 ? search.length : close);
      const end = separator < 0 ? search.length : separator;
      let directory = search.slice(offset, end);
      if (quoted) directory = directory.slice(1);
      if (directory.endsWith('"') || directory.endsWith("'")) directory = directory.slice(0, -1);
      if (directory) directories.push(directory);
      offset = end + 1;
    }
  } else {
    directories.push(...(process.env.PATH?.split(path.delimiter) ?? []));
  }
  const names = windows
    ? [
        ...(name.indexOf(".") >= 0 && name.indexOf(".") < name.length - 1 ? [selected] : []),
        `${selected}.com`,
        `${selected}.exe`,
      ]
    : [selected];
  for (const directory of directories) {
    for (const name of names) {
      const original = directory ? `${directory}${path.sep}${name}` : name;
      const prefix = path.parse(original).root;
      const base = path.resolve(root, prefix || ".");
      const candidate =
        base + (base.endsWith(path.sep) ? "" : path.sep) + original.slice(prefix.length);
      try {
        if (!statSync(candidate).isFile()) continue;
        accessSync(candidate, windows ? constants.F_OK : constants.X_OK);
        return candidate;
      } catch (error) {
        if (!["ENOENT", "ENOTDIR", "EACCES"].includes(error.code)) throw error;
      }
    }
  }
  throw new Error(`native executable not found: ${selected}`);
}

export function nativeToolPlatform(
  tool,
  platform = `${process.platform}-${process.arch}`,
  manifest = readNativeSupply(),
) {
  if (!Object.hasOwn(manifest.tools, tool)) throw new Error(`unknown native tool: ${tool}`);
  const assets = manifest.tools[tool].assets;
  if (Object.hasOwn(assets, platform)) return platform;
  if (platform === "win32-arm64" && Object.hasOwn(assets, "win32-x64")) return "win32-x64";
  throw new Error(`unsupported ${tool} platform: ${platform}`);
}

export function managedToolPath(
  tool,
  platform = `${process.platform}-${process.arch}`,
  repository = root,
  manifest = readNativeSupply(repository),
) {
  const selectedPlatform = nativeToolPlatform(tool, platform, manifest);
  const descriptor = manifest.tools[tool];
  return path.join(
    repository,
    "build/runtime/tool-cache",
    tool,
    descriptor.version,
    selectedPlatform,
    descriptor.binary + (selectedPlatform.startsWith("win32-") ? ".exe" : ""),
  );
}

export function nativeToolBinary(tool) {
  const manifest = readNativeSupply();
  if (!Object.hasOwn(manifest.tools, tool)) {
    throw new Error(`unknown native tool: ${tool}`);
  }
  const descriptor = manifest.tools[tool];
  const platform = nativeToolPlatform(tool, undefined, manifest);
  const suffix = process.platform === "win32" ? ".exe" : "";
  const cached = managedToolPath(tool, platform, root, manifest);
  const selected = nativeExecutablePath(
    process.env[`DDWG_${tool.toUpperCase().replaceAll("-", "_")}_BIN`] ||
      (managedFileExists(cached) ? cached : descriptor.binary + suffix),
  );
  const selectedPath = path.resolve(root, selected);
  const managedRoot = filePath("build/runtime/tool-cache");
  const inManagedCache = (candidate) => {
    const relative = path.relative(managedRoot, candidate);
    return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  };
  const resolved = realpathSync.native(selected);
  if (inManagedCache(selectedPath) || inManagedCache(resolved)) {
    if (path.relative(cached, resolved) !== "")
      throw new Error(`${tool} managed executable identity does not match its platform pin`);
    if (!managedFileExists(selectedPath)) throw new Error(`${tool} managed binary is missing`);
    assertNativeBinaryDigest(readFileSync(selected), descriptor.assets[platform], tool);
  }
  const version = run(selected, ["--version"], {
    capture: true,
    rejectStderr: true,
    timeout: 10_000,
  }).trim();
  if (version !== descriptor.versionOutput) {
    throw new Error(`${tool} version mismatch: expected ${descriptor.version}, got ${version}`);
  }
  return selected;
}
