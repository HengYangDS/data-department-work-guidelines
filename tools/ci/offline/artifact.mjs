import { createHash } from "node:crypto";
import {
  lstatSync,
  mkdtempDisposableSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  declaredToolRuntime,
  nativeSupplyPath,
  offlineBundleRecordPath,
  readNativeSupply,
  root,
  run,
} from "../../docs/runtime.mjs";

const recordKeys = [
  "fileName",
  "lockSha256",
  "nativeToolsSha256",
  "nodeMajor",
  "packageJsonSha256",
  "schemaVersion",
  "sha256",
  "version",
];

export function sha256(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{64}$/u.test(value) &&
    value !== "0".repeat(64)
  );
}

export function validateBundleRecord(record, source) {
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record) ||
    JSON.stringify(Object.keys(record).sort()) !== JSON.stringify(recordKeys)
  ) {
    throw new Error("offline bundle record has invalid fields");
  }
  if (
    record.schemaVersion !== 4 ||
    record.nodeMajor !== source.nodeMajor ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u.test(record.version) ||
    record.version !== source.version ||
    record.fileName !==
      `data-department-work-guidelines-v${record.version}-offline-tools.tar.gz` ||
    !sha256(record.sha256) ||
    !sha256(record.lockSha256) ||
    !sha256(record.nativeToolsSha256) ||
    !sha256(record.packageJsonSha256) ||
    record.packageJsonSha256 !== source.packageJsonSha256 ||
    record.lockSha256 !== source.lockSha256 ||
    record.nativeToolsSha256 !== source.nativeToolsSha256
  ) {
    throw new Error("offline bundle identity does not match source");
  }
  return record;
}

export function digestBytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function sourceIdentity(repository) {
  const version = readFileSync(path.join(repository, "VERSION"), "utf8").trim();
  const packageJsonSha256 = digestBytes(
    readFileSync(path.join(repository, "package.json")),
  );
  const lockSha256 = digestBytes(
    readFileSync(path.join(repository, "package-lock.json")),
  );
  const nativeToolsSha256 = digestBytes(
    readFileSync(path.join(repository, nativeSupplyPath)),
  );
  const runtime = declaredToolRuntime(repository);
  return {
    version,
    packageJsonSha256,
    lockSha256,
    nativeToolsSha256,
    ...runtime,
  };
}

export function readBundleRecord(repository = root) {
  const record = JSON.parse(
    readFileSync(path.join(repository, offlineBundleRecordPath), "utf8"),
  );
  return validateBundleRecord(record, sourceIdentity(repository));
}

function lines(source) {
  return source.split(/\r?\n/u).filter(Boolean);
}

export function assertSafeBundleListing(
  namesSource,
  verboseSource,
  supply = readNativeSupply(),
) {
  const names = lines(namesSource);
  const verbose = lines(verboseSource);
  if (!names.length || names.length !== verbose.length) {
    throw new Error("offline bundle listing is incomplete");
  }
  const seen = new Set();
  let cacheFile = false;
  const requiredFiles = new Set(["manifest.json"]);
  const allowedDirectories = new Set(["", "native/", "licenses/"]);
  for (const [tool, descriptor] of Object.entries(supply.tools)) {
    allowedDirectories.add(`native/${tool}/`);
    allowedDirectories.add(`licenses/${tool}/`);
    for (const asset of Object.values(descriptor.assets))
      requiredFiles.add(`native/${tool}/${asset.name}`);
    for (const name of Object.keys(descriptor.licenses))
      requiredFiles.add(`licenses/${tool}/${name}`);
  }
  for (const [index, name] of names.entries()) {
    if (
      !name.startsWith("./") ||
      name.includes("\\") ||
      name.includes("\0") ||
      /^[A-Za-z]:/u.test(name.slice(2))
    ) {
      throw new Error(`unsafe offline bundle member: ${name}`);
    }
    const relative = name.slice(2);
    const pathParts = relative.split("/");
    if (
      (relative !== "" &&
        pathParts.some(
          (part, partIndex) =>
            (part === "" && partIndex !== pathParts.length - 1) ||
            part === "." ||
            part === "..",
        )) ||
      seen.has(relative)
    ) {
      throw new Error(`unsafe offline bundle member: ${name}`);
    }
    seen.add(relative);
    const type = verbose[index]?.[0];
    const directory = relative === "" || relative.endsWith("/");
    if (directory ? type !== "d" : type !== "-") {
      throw new Error(`non-regular offline bundle member: ${name}`);
    }
    if (
      (directory && allowedDirectories.has(relative)) ||
      (!directory && requiredFiles.has(relative))
    )
      continue;
    if (
      relative === "npm-cache/" ||
      relative === "npm-cache/_cacache/" ||
      (relative.startsWith("npm-cache/_cacache/") &&
        (directory || relative.length > "npm-cache/_cacache/".length))
    ) {
      if (!directory) cacheFile = true;
      continue;
    }
    throw new Error(`unexpected offline bundle member: ${name}`);
  }
  if (!cacheFile || [...requiredFiles].some((member) => !seen.has(member))) {
    throw new Error("offline bundle is missing required members");
  }
  return names;
}

export function inspectBundle(
  bundlePath,
  record,
  source,
  supply = readNativeSupply(),
) {
  validateBundleRecord(record, source);
  const archive = path.resolve(bundlePath);
  const stat = lstatSync(archive);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error("offline bundle archive is not a regular file");
  }
  if (path.basename(archive) !== record.fileName) {
    throw new Error("offline bundle file name does not match source");
  }
  const actual = createHash("sha256")
    .update(readFileSync(archive))
    .digest("hex");
  if (actual !== record.sha256) {
    throw new Error("offline bundle digest mismatch");
  }
  const names = run("tar", ["-tf", archive], {
    capture: true,
    rejectStderr: true,
    timeout: 30_000,
  });
  const verbose = run("tar", ["-tvf", archive], {
    capture: true,
    rejectStderr: true,
    timeout: 30_000,
  });
  assertSafeBundleListing(names, verbose, supply);
  return { sha256: actual, version: record.version };
}

export function assertRegularTree(directory) {
  const rootStat = lstatSync(directory);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new Error(
      `offline bundle cache is not a regular directory: ${directory}`,
    );
  }
  let files = 0;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`offline bundle input contains a symlink: ${target}`);
    }
    if (entry.isDirectory()) {
      files += assertRegularTree(target);
    } else if (entry.isFile()) {
      files += 1;
    } else {
      throw new Error(`offline bundle input is not a regular file: ${target}`);
    }
  }
  return files;
}

export function pinnedFile(directory, name, expectedDigest, kind) {
  const directoryStat = lstatSync(directory);
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    throw new Error(`offline bundle ${kind} directory is not regular`);
  }
  const safeName =
    kind === "asset"
      ? /^[A-Za-z0-9][A-Za-z0-9_.-]*$/u
      : /^(?:LICENSE|LICENCE|COPYING|NOTICE)(?:-[A-Z0-9-]+)?$/u;
  if (typeof name !== "string" || !safeName.test(name)) {
    throw new Error(`unsafe offline bundle ${kind} name`);
  }
  const file = path.join(directory, name);
  let stat;
  try {
    stat = lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`missing offline bundle ${kind}: ${name}`, {
        cause: error,
      });
    }
    throw error;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error(`offline bundle ${kind} is not a regular file: ${name}`);
  }
  if (digestBytes(readFileSync(file)) !== expectedDigest) {
    throw new Error(`offline bundle ${kind} digest mismatch: ${name}`);
  }
  return file;
}

function sameNames(directory, expected) {
  const actual = readdirSync(directory).sort();
  return JSON.stringify(actual) === JSON.stringify([...expected].sort());
}

export function validateExtractedBundle(directory, repository) {
  assertRegularTree(directory);
  if (
    !sameNames(directory, ["manifest.json", "npm-cache", "native", "licenses"])
  ) {
    throw new Error("unexpected offline bundle root member");
  }
  const manifest = JSON.parse(
    readFileSync(path.join(directory, "manifest.json"), "utf8"),
  );
  const source = sourceIdentity(repository);
  if (
    manifest.schemaVersion !== 4 ||
    manifest.version !== source.version ||
    manifest.packageJsonSha256 !== source.packageJsonSha256 ||
    manifest.lockSha256 !== source.lockSha256 ||
    manifest.nativeToolsSha256 !== source.nativeToolsSha256 ||
    manifest.nodeMajor !== source.nodeMajor
  ) {
    throw new Error("offline bundle manifest does not match source");
  }
  const cacheRoot = path.join(directory, "npm-cache");
  if (!sameNames(cacheRoot, ["_cacache"])) {
    throw new Error("unexpected offline bundle cache member");
  }
  const cacheFileCount = assertRegularTree(path.join(cacheRoot, "_cacache"));
  if (!cacheFileCount || cacheFileCount !== manifest.cacheFileCount) {
    throw new Error("offline bundle cache file count mismatch");
  }
  const native = readNativeSupply(repository);
  const toolNames = Object.keys(native.tools);
  if (
    !sameNames(path.join(directory, "native"), toolNames) ||
    !sameNames(path.join(directory, "licenses"), toolNames) ||
    JSON.stringify(Object.keys(manifest.tools ?? {}).sort()) !==
      JSON.stringify([...toolNames].sort())
  )
    throw new Error("offline bundle native inventory differs from source");
  for (const [tool, descriptor] of Object.entries(native.tools)) {
    const expectedAssets = Object.fromEntries(
      Object.entries(descriptor.assets).map(([key, asset]) => [
        key,
        { name: asset.name, sha256: asset.sha256 },
      ]),
    );
    if (
      JSON.stringify(manifest.tools[tool].assets) !==
      JSON.stringify(expectedAssets)
    )
      throw new Error("offline bundle asset manifest differs from source");
    const assetDirectory = path.join(directory, "native", tool);
    if (
      !sameNames(
        assetDirectory,
        Object.values(descriptor.assets).map((asset) => asset.name),
      )
    )
      throw new Error("offline bundle asset inventory differs from source");
    for (const asset of Object.values(descriptor.assets))
      pinnedFile(assetDirectory, asset.name, asset.sha256, "asset");
    const licenseDirectory = path.join(directory, "licenses", tool);
    if (!sameNames(licenseDirectory, Object.keys(descriptor.licenses)))
      throw new Error("offline bundle license inventory differs from source");
    const expectedLicenses = Object.fromEntries(
      Object.entries(descriptor.licenses).map(([name, value]) => [
        name,
        value.sha256,
      ]),
    );
    if (
      JSON.stringify(manifest.tools[tool].licenses) !==
      JSON.stringify(expectedLicenses)
    )
      throw new Error("offline bundle license manifest differs from source");
    for (const [name, value] of Object.entries(descriptor.licenses))
      pinnedFile(licenseDirectory, name, value.sha256, "license");
  }
  return { source, cacheFileCount };
}

export function verifyBundle({ bundlePath, record, repository = root }) {
  const archive = path.resolve(bundlePath);
  inspectBundle(
    archive,
    record,
    sourceIdentity(repository),
    readNativeSupply(repository),
  );
  using checking = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-bundle-check-"),
  );
  const temporary = checking.path;
  run("tar", ["-xf", archive, "--no-same-owner", "-C", temporary], {
    rejectStderr: true,
    timeout: 90_000,
  });
  validateExtractedBundle(temporary, repository);
  return { version: record.version, sha256: record.sha256 };
}
