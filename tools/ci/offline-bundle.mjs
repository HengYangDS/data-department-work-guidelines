import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { projectPackageRequest } from "./gitlab-package.mjs";
import { declaredToolRuntime, root, run } from "../docs/runtime.mjs";

const recordKeys = [
  "fileName",
  "lockSha256",
  "lycheeSha256",
  "nodeMajor",
  "npmMajor",
  "schemaVersion",
  "sha256",
  "version",
];

function sha256(value) {
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
    record.schemaVersion !== 1 ||
    record.nodeMajor !== source.nodeMajor ||
    record.npmMajor !== source.npmMajor ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u.test(record.version) ||
    record.version !== source.version ||
    record.fileName !==
      `data-department-work-guidelines-v${record.version}-offline-tools.tar.gz` ||
    !sha256(record.sha256) ||
    !sha256(record.lockSha256) ||
    !sha256(record.lycheeSha256) ||
    record.lockSha256 !== source.lockSha256 ||
    record.lycheeSha256 !== source.lycheeSha256
  ) {
    throw new Error("offline bundle identity does not match source");
  }
  return record;
}

function lines(source) {
  return source.split(/\r?\n/u).filter(Boolean);
}

export function assertSafeBundleListing(namesSource, verboseSource) {
  const names = lines(namesSource);
  const verbose = lines(verboseSource);
  if (!names.length || names.length !== verbose.length) {
    throw new Error("offline bundle listing is incomplete");
  }
  const seen = new Set();
  let cacheFile = false;
  let lycheeFile = false;
  let licenseFile = false;
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
    if (relative === "" || relative === "manifest.json") continue;
    if (
      relative === "npm-cache/" ||
      relative === "npm-cache/_cacache/" ||
      (relative.startsWith("npm-cache/_cacache/") &&
        (directory || relative.length > "npm-cache/_cacache/".length))
    ) {
      if (!directory) cacheFile = true;
      continue;
    }
    if (
      relative === "lychee/" ||
      (!directory &&
        /^lychee\/lychee-[a-z0-9_.-]+\.(?:tar\.gz|zip)$/u.test(relative))
    ) {
      if (!directory) lycheeFile = true;
      continue;
    }
    if (
      relative === "licenses/" ||
      relative === "licenses/lychee/" ||
      (!directory && /^licenses\/lychee\/LICENSE-[A-Z0-9-]+$/u.test(relative))
    ) {
      if (!directory) licenseFile = true;
      continue;
    }
    throw new Error(`unexpected offline bundle member: ${name}`);
  }
  if (!seen.has("manifest.json") || !cacheFile || !lycheeFile || !licenseFile) {
    throw new Error("offline bundle is missing required members");
  }
  return names;
}

export function inspectBundle(bundlePath, record, source) {
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
    timeout: 30_000,
  });
  const verbose = run("tar", ["-tvf", archive], {
    capture: true,
    timeout: 30_000,
  });
  assertSafeBundleListing(names, verbose);
  return { sha256: actual, version: record.version };
}

function digestBytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function assertRegularTree(directory) {
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

function pinnedFile(directory, name, expectedDigest, kind) {
  const directoryStat = lstatSync(directory);
  if (!directoryStat.isDirectory() || directoryStat.isSymbolicLink()) {
    throw new Error(`offline bundle ${kind} directory is not regular`);
  }
  const safeName =
    kind === "asset"
      ? /^lychee-[a-z0-9_.-]+\.(?:tar\.gz|zip)$/u
      : /^LICENSE-(?:APACHE|MIT)$/u;
  if (typeof name !== "string" || !safeName.test(name)) {
    throw new Error(`unsafe offline bundle ${kind} name`);
  }
  const file = path.join(directory, name);
  let stat;
  try {
    stat = lstatSync(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`missing offline bundle ${kind}: ${name}`);
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

export function sourceIdentity(repository) {
  const version = readFileSync(path.join(repository, "VERSION"), "utf8").trim();
  const lockSha256 = digestBytes(
    readFileSync(path.join(repository, "package-lock.json")),
  );
  const lycheeSha256 = digestBytes(
    readFileSync(path.join(repository, ".config", "tools", "lychee.json")),
  );
  const runtime = declaredToolRuntime(repository);
  return { version, lockSha256, lycheeSha256, ...runtime };
}

export function assembleBundle({
  repository,
  cacheDirectory,
  assetDirectory,
  licenseDirectory,
  outputPath,
}) {
  const source = sourceIdentity(repository);
  const archive = path.resolve(outputPath);
  const fileName = `data-department-work-guidelines-v${source.version}-offline-tools.tar.gz`;
  if (path.basename(archive) !== fileName) {
    throw new Error("offline bundle output name does not match source version");
  }
  try {
    lstatSync(archive);
    throw new Error("offline bundle output already exists");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (Number.parseInt(process.versions.node, 10) !== source.nodeMajor) {
    throw new Error(`offline bundle builder requires Node ${source.nodeMajor}`);
  }
  const lychee = JSON.parse(
    readFileSync(
      path.join(repository, ".config", "tools", "lychee.json"),
      "utf8",
    ),
  );
  const cache = path.join(cacheDirectory, "_cacache");
  const cacheFileCount = assertRegularTree(cache);
  if (!cacheFileCount) throw new Error("offline bundle cache is empty");
  const stage = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-build-"));
  let created = false;
  try {
    const stagedCache = path.join(stage, "npm-cache", "_cacache");
    mkdirSync(path.dirname(stagedCache), { recursive: true });
    cpSync(cache, stagedCache, { recursive: true, force: false });
    const stagedAssets = path.join(stage, "lychee");
    const stagedLicenses = path.join(stage, "licenses", "lychee");
    mkdirSync(stagedAssets, { recursive: true });
    mkdirSync(stagedLicenses, { recursive: true });
    const assets = {};
    for (const [platform, asset] of Object.entries(lychee.assets)) {
      const input = pinnedFile(
        assetDirectory,
        asset.name,
        asset.sha256,
        "asset",
      );
      copyFileSync(input, path.join(stagedAssets, asset.name));
      assets[platform] = { name: asset.name, sha256: asset.sha256 };
    }
    const licenses = {};
    for (const [name, license] of Object.entries(lychee.licenses)) {
      const input = pinnedFile(
        licenseDirectory,
        name,
        license.sha256,
        "license",
      );
      copyFileSync(input, path.join(stagedLicenses, name));
      licenses[name] = license.sha256;
    }
    const manifest = {
      schemaVersion: 1,
      ...source,
      cacheFileCount,
      assets,
      licenses,
    };
    writeFileSync(
      path.join(stage, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );
    mkdirSync(path.dirname(archive), { recursive: true });
    created = true;
    run("tar", ["-czf", archive, "-C", stage, "."], {
      timeout: 90_000,
      env: { ...process.env, COPYFILE_DISABLE: "1" },
    });
    const record = {
      schemaVersion: 1,
      ...source,
      fileName,
      sha256: digestBytes(readFileSync(archive)),
    };
    inspectBundle(archive, record, source);
    return record;
  } catch (error) {
    if (created) rmSync(archive, { force: true });
    throw error;
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
}

function sameNames(directory, expected) {
  const actual = readdirSync(directory).sort();
  return JSON.stringify(actual) === JSON.stringify([...expected].sort());
}

export function validateExtractedBundle(directory, repository) {
  assertRegularTree(directory);
  if (
    !sameNames(directory, ["manifest.json", "npm-cache", "lychee", "licenses"])
  ) {
    throw new Error("unexpected offline bundle root member");
  }
  const manifest = JSON.parse(
    readFileSync(path.join(directory, "manifest.json"), "utf8"),
  );
  const source = sourceIdentity(repository);
  if (
    manifest.schemaVersion !== 1 ||
    manifest.version !== source.version ||
    manifest.lockSha256 !== source.lockSha256 ||
    manifest.lycheeSha256 !== source.lycheeSha256 ||
    manifest.nodeMajor !== source.nodeMajor ||
    manifest.npmMajor !== source.npmMajor
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
  const lychee = JSON.parse(
    readFileSync(
      path.join(repository, ".config", "tools", "lychee.json"),
      "utf8",
    ),
  );
  const expectedAssets = Object.fromEntries(
    Object.entries(lychee.assets).map(([key, asset]) => [
      key,
      {
        name: asset.name,
        sha256: asset.sha256,
      },
    ]),
  );
  if (JSON.stringify(manifest.assets) !== JSON.stringify(expectedAssets)) {
    throw new Error("offline bundle asset manifest differs from source");
  }
  const assetDirectory = path.join(directory, "lychee");
  if (
    !sameNames(
      assetDirectory,
      Object.values(lychee.assets).map((asset) => asset.name),
    )
  ) {
    throw new Error("offline bundle asset inventory differs from source");
  }
  for (const asset of Object.values(lychee.assets)) {
    pinnedFile(assetDirectory, asset.name, asset.sha256, "asset");
  }
  const licenseRoot = path.join(directory, "licenses");
  if (!sameNames(licenseRoot, ["lychee"])) {
    throw new Error("unexpected offline bundle license member");
  }
  const licenseDirectory = path.join(licenseRoot, "lychee");
  if (!sameNames(licenseDirectory, Object.keys(lychee.licenses))) {
    throw new Error("offline bundle license inventory differs from source");
  }
  const expectedLicenses = Object.fromEntries(
    Object.entries(lychee.licenses).map(([name, value]) => [
      name,
      value.sha256,
    ]),
  );
  if (JSON.stringify(manifest.licenses) !== JSON.stringify(expectedLicenses)) {
    throw new Error("offline bundle license manifest differs from source");
  }
  for (const [name, value] of Object.entries(lychee.licenses)) {
    pinnedFile(licenseDirectory, name, value.sha256, "license");
  }
  return { source, cacheFileCount };
}

function pathExists(target) {
  try {
    lstatSync(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export function npmCliPath({
  platform = process.platform,
  pathValue = process.env.PATH ?? "",
} = {}) {
  const directories = [
    ...new Set([
      ...pathValue.split(path.delimiter),
      path.dirname(process.execPath),
    ]),
  ].filter(Boolean);
  const launchers =
    platform === "win32" ? ["npm.cmd", "npm.exe", "npm"] : ["npm"];
  for (const directory of directories) {
    for (const name of launchers) {
      const launcher = path.join(directory, name);
      if (!pathExists(launcher)) continue;
      const resolved = realpathSync(launcher);
      if (
        path.basename(resolved) === "npm-cli.js" &&
        lstatSync(resolved).isFile()
      ) {
        return resolved;
      }
    }
    for (const candidate of [
      path.join(directory, "node_modules", "npm", "bin", "npm-cli.js"),
      path.join(
        directory,
        "..",
        "lib",
        "node_modules",
        "npm",
        "bin",
        "npm-cli.js",
      ),
    ]) {
      if (pathExists(candidate) && lstatSync(candidate).isFile()) {
        return path.resolve(candidate);
      }
    }
  }
  throw new Error("supported npm JavaScript entrypoint is unavailable");
}

function isolatedNpmEnvironment(
  directory,
  cacheDirectory,
  { offline = true } = {},
) {
  const userConfig = path.join(directory, "empty-user.npmrc");
  const globalConfig = path.join(directory, "empty-global.npmrc");
  writeFileSync(userConfig, "");
  writeFileSync(globalConfig, "");
  const environment = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) =>
        !/^npm_config_/iu.test(key) &&
        !["NPM_TOKEN", "NODE_AUTH_TOKEN"].includes(key),
    ),
  );
  return {
    ...environment,
    npm_config_userconfig: userConfig,
    npm_config_globalconfig: globalConfig,
    npm_config_cache: cacheDirectory,
    npm_config_offline: String(offline),
    npm_config_audit: "false",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
  };
}

export function installBundle({
  bundlePath,
  record,
  repository,
  commandRunner = run,
}) {
  const source = sourceIdentity(repository);
  const archive = path.resolve(bundlePath);
  validateBundleRecord(record, source);
  if (Number.parseInt(process.versions.node, 10) !== record.nodeMajor) {
    throw new Error(`offline bundle requires Node ${record.nodeMajor}`);
  }
  const nodeModules = path.join(repository, "node_modules");
  if (pathExists(nodeModules)) {
    throw new Error(
      "node_modules already exists; preserve or remove it explicitly",
    );
  }
  inspectBundle(archive, record, source);
  const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-install-"));
  let startedNpmInstall = false;
  try {
    run("tar", ["-xf", archive, "-C", temporary], {
      timeout: 90_000,
    });
    validateExtractedBundle(temporary, repository);
    const cacheDirectory = path.join(temporary, "npm-cache");
    const env = isolatedNpmEnvironment(temporary, cacheDirectory);
    const npmCli = npmCliPath();
    const npmVersion = commandRunner(process.execPath, [npmCli, "--version"], {
      cwd: repository,
      env,
      capture: true,
      timeout: 10_000,
    }).trim();
    if (!npmVersion.startsWith(`${record.npmMajor}.`)) {
      throw new Error(
        `offline bundle requires npm ${record.npmMajor}, got ${npmVersion}`,
      );
    }
    startedNpmInstall = true;
    commandRunner(
      process.execPath,
      [
        npmCli,
        "ci",
        "--offline",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--cache",
        cacheDirectory,
      ],
      { cwd: repository, env, timeout: 120_000 },
    );
    if (!pathExists(nodeModules)) {
      throw new Error("offline npm install returned without node_modules");
    }
    const lychee = JSON.parse(
      readFileSync(
        path.join(repository, ".config", "tools", "lychee.json"),
        "utf8",
      ),
    );
    const platform = `${process.platform}-${process.arch}`;
    const asset = lychee.assets[platform];
    if (!asset) throw new Error(`offline bundle does not support ${platform}`);
    const assetPath = path.join(temporary, "lychee", asset.name);
    commandRunner(
      process.execPath,
      [
        path.join(repository, "tools", "ci", "install-lychee.mjs"),
        "--asset",
        assetPath,
      ],
      { cwd: repository, timeout: 90_000 },
    );
    return { version: source.version, sha256: record.sha256, npmVersion };
  } catch (error) {
    if (startedNpmInstall) {
      rmSync(nodeModules, { recursive: true, force: true });
    }
    throw error;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

export function validateLockSupply(lock) {
  if (
    lock?.lockfileVersion !== 3 ||
    !lock.packages ||
    typeof lock.packages !== "object"
  ) {
    throw new Error("offline bundle requires an npm v3 lockfile");
  }
  let count = 0;
  for (const [location, entry] of Object.entries(lock.packages)) {
    if (!location) continue;
    if (!location.startsWith("node_modules/") || !entry) {
      throw new Error(`unsupported offline package location: ${location}`);
    }
    let resolved;
    try {
      resolved = new URL(entry.resolved);
    } catch {
      throw new Error(`missing package source: ${location}`);
    }
    if (
      resolved.protocol !== "https:" ||
      resolved.hostname !== "registry.npmjs.org" ||
      location.includes("..") ||
      location.includes("\\") ||
      resolved.username ||
      resolved.password ||
      resolved.search ||
      resolved.hash ||
      entry.optional ||
      entry.os ||
      entry.cpu ||
      entry.hasInstallScript ||
      !/^sha512-[A-Za-z0-9+/]+={0,2}$/u.test(entry.integrity ?? "")
    ) {
      throw new Error(
        `offline package is not portable public supply: ${location}`,
      );
    }
    count += 1;
  }
  if (!count) throw new Error("offline bundle lockfile has no packages");
  return count;
}

function boundedNpm(args, { cwd, env, timeout = 150_000 }) {
  const result = spawnSync(process.execPath, [npmCliPath(), ...args], {
    cwd,
    env,
    encoding: "utf8",
    input: "",
    timeout,
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error) {
    throw new Error(`npm execution failed: ${result.error.code ?? "unknown"}`);
  }
  if (result.status !== 0) {
    const cause = result.stderr?.includes("ENOTCACHED")
      ? "cache incomplete"
      : `exit ${result.status}`;
    throw new Error(`locked npm installation failed: ${cause}`);
  }
  return result.stdout.trim();
}

function checkPackageLicenses(installation, lock) {
  let count = 0;
  for (const location of Object.keys(lock.packages)) {
    if (!location) continue;
    const packageDirectory = path.join(installation, location);
    const manifest = JSON.parse(
      readFileSync(path.join(packageDirectory, "package.json"), "utf8"),
    );
    const licenseFiles = readdirSync(packageDirectory).filter((name) =>
      /^(?:LICENSE|LICENCE|COPYING|NOTICE)(?:[.-]|$)/iu.test(name),
    );
    if (!manifest.license || !licenseFiles.length) {
      throw new Error(`offline package lacks its license: ${location}`);
    }
    count += 1;
  }
  return count;
}

export function buildReleaseBundle({
  repository,
  assetDirectory,
  licenseDirectory,
  outputPath,
}) {
  const source = sourceIdentity(repository);
  if (Number.parseInt(process.versions.node, 10) !== source.nodeMajor) {
    throw new Error(`offline bundle builder requires Node ${source.nodeMajor}`);
  }
  const lock = JSON.parse(
    readFileSync(path.join(repository, "package-lock.json"), "utf8"),
  );
  const packageCount = validateLockSupply(lock);
  const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-prime-"));
  try {
    const online = path.join(temporary, "online");
    const offline = path.join(temporary, "offline");
    const cacheDirectory = path.join(temporary, "cache");
    for (const checkout of [online, offline]) {
      mkdirSync(checkout);
      for (const name of ["package.json", "package-lock.json"]) {
        copyFileSync(path.join(repository, name), path.join(checkout, name));
      }
    }
    mkdirSync(cacheDirectory);
    const onlineEnv = isolatedNpmEnvironment(temporary, cacheDirectory, {
      offline: false,
    });
    const npmVersion = boundedNpm(["--version"], {
      cwd: online,
      env: onlineEnv,
      timeout: 10_000,
    });
    if (!npmVersion.startsWith(`${source.npmMajor}.`)) {
      throw new Error(
        `offline bundle builder requires npm ${source.npmMajor}, got ${npmVersion}`,
      );
    }
    boundedNpm(["ci", "--ignore-scripts", "--no-audit", "--no-fund"], {
      cwd: online,
      env: onlineEnv,
    });
    const licensedPackageCount = checkPackageLicenses(online, lock);
    if (licensedPackageCount !== packageCount) {
      throw new Error("offline package license inventory is incomplete");
    }
    const offlineEnv = { ...onlineEnv, npm_config_offline: "true" };
    boundedNpm(
      ["ci", "--offline", "--ignore-scripts", "--no-audit", "--no-fund"],
      {
        cwd: offline,
        env: offlineEnv,
        timeout: 90_000,
      },
    );
    return {
      record: assembleBundle({
        repository,
        cacheDirectory,
        assetDirectory,
        licenseDirectory,
        outputPath,
      }),
      packageCount,
      licensedPackageCount,
      npmVersion,
    };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

export function readBundleRecord(repository = root) {
  const record = JSON.parse(
    readFileSync(
      path.join(repository, ".config", "tools", "offline-bundle.json"),
      "utf8",
    ),
  );
  return validateBundleRecord(record, sourceIdentity(repository));
}

export function verifyBundle({ bundlePath, record, repository = root }) {
  const archive = path.resolve(bundlePath);
  inspectBundle(archive, record, sourceIdentity(repository));
  const temporary = mkdtempSync(path.join(os.tmpdir(), "ddwg-bundle-check-"));
  try {
    run("tar", ["-xf", archive, "-C", temporary], { timeout: 90_000 });
    validateExtractedBundle(temporary, repository);
    return { version: record.version, sha256: record.sha256 };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

async function cli(argv) {
  const [mode, ...options] = argv;
  const parsed = parseArgs({
    args: options,
    options: {
      assets: { type: "string" },
      licenses: { type: "string" },
      output: { type: "string" },
      bundle: { type: "string" },
    },
    strict: true,
    allowPositionals: false,
  }).values;
  if (
    mode === "build" &&
    parsed.assets &&
    parsed.licenses &&
    parsed.output &&
    !parsed.bundle
  ) {
    const result = buildReleaseBundle({
      repository: root,
      assetDirectory: path.resolve(parsed.assets),
      licenseDirectory: path.resolve(parsed.licenses),
      outputPath: path.resolve(parsed.output),
    });
    console.error(`PASS ${result.packageCount} locked packages and licenses`);
    console.log(JSON.stringify(result.record, null, 2));
    return;
  }
  if (
    mode === "acquire-github" &&
    !parsed.bundle &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const result = acquireGitHubBundle();
    console.log(`PASS offline acquisition: ${result.version} ${result.sha256}`);
    return;
  }
  if (
    mode === "acquire-gitlab" &&
    !parsed.bundle &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const result = await acquireGitLabBundle();
    console.log(`PASS offline acquisition: ${result.version} ${result.sha256}`);
    return;
  }
  if (
    (mode === "inspect" || mode === "install") &&
    !parsed.assets &&
    !parsed.licenses &&
    !parsed.output
  ) {
    const record = readBundleRecord();
    const bundlePath =
      parsed.bundle ??
      path.join(root, "build", "artifacts", "offline-bundle", record.fileName);
    const result =
      mode === "inspect"
        ? verifyBundle({ bundlePath, record })
        : installBundle({ bundlePath, record, repository: root });
    console.log(`PASS offline ${mode}: ${result.version} ${result.sha256}`);
    return;
  }
  throw new Error(
    "usage: node tools/ci/offline-bundle.mjs build --assets DIR --licenses DIR --output FILE | acquire-github | acquire-gitlab | inspect [--bundle FILE] | install [--bundle FILE]",
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  cli(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

function downloadGitHubRelease({ tag, repository, fileName, directory, env }) {
  const result = spawnSync(
    "gh",
    [
      "release",
      "download",
      tag,
      "--repo",
      repository,
      "--pattern",
      fileName,
      "--dir",
      directory,
    ],
    {
      env,
      input: "",
      encoding: "utf8",
      timeout: 90_000,
      maxBuffer: 1024 * 1024,
    },
  );
  if (result.error) {
    throw new Error(
      `GitHub release download failed: ${result.error.code ?? "unknown"}`,
    );
  }
  if (result.status !== 0) {
    throw new Error(`GitHub release download failed: exit ${result.status}`);
  }
}

export function acquireGitHubBundle({
  repository = root,
  environment = process.env,
  download = downloadGitHubRelease,
} = {}) {
  const record = readBundleRecord(repository);
  const tag = environment.DDWG_RELEASE_TAG;
  const githubRepository = environment.GITHUB_REPOSITORY;
  if (tag !== `v${record.version}`) {
    throw new Error("GitHub release tag does not match source version");
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(githubRepository ?? "")) {
    throw new Error("GitHub repository identity is missing or invalid");
  }
  if (!environment.GH_TOKEN || /[\r\n]/u.test(environment.GH_TOKEN)) {
    throw new Error("GitHub release identity is missing or invalid");
  }
  const directory = path.join(
    repository,
    "build",
    "artifacts",
    "offline-bundle",
  );
  const target = path.join(directory, record.fileName);
  if (pathExists(target)) {
    return verifyBundle({ bundlePath: target, record, repository });
  }
  mkdirSync(directory, { recursive: true });
  try {
    download({
      tag,
      repository: githubRepository,
      fileName: record.fileName,
      directory,
      env: { ...environment, GH_PROMPT_DISABLED: "1" },
    });
    return verifyBundle({ bundlePath: target, record, repository });
  } catch (error) {
    rmSync(target, { force: true });
    throw error;
  }
}

export function gitlabBundleRequest(record, environment = process.env) {
  if (
    environment.CI_COMMIT_TAG !== `v${record.version}` ||
    !["api", "web"].includes(environment.CI_PIPELINE_SOURCE)
  ) {
    throw new Error("GitLab release pipeline does not match the source tag");
  }
  return projectPackageRequest(
    {
      packageName: "release-assets",
      version: `v${record.version}`,
      fileName: record.fileName,
    },
    environment,
  );
}

export async function acquireGitLabBundle({
  repository = root,
  environment = process.env,
  fetcher = fetch,
} = {}) {
  const record = readBundleRecord(repository);
  const request = gitlabBundleRequest(record, environment);
  const directory = path.join(
    repository,
    "build",
    "artifacts",
    "offline-bundle",
  );
  const target = path.join(directory, record.fileName);
  if (pathExists(target)) {
    return verifyBundle({ bundlePath: target, record, repository });
  }
  mkdirSync(directory, { recursive: true });
  try {
    let response;
    try {
      response = await fetcher(request.url, {
        headers: request.headers,
        redirect: request.redirect,
        signal: AbortSignal.timeout(90_000),
      });
    } catch {
      throw new Error("GitLab release bundle download failed");
    }
    if (!response.ok || !response.body) {
      throw new Error(
        `GitLab release bundle download failed: HTTP ${response.status}`,
      );
    }
    const limit = 128 * 1024 * 1024;
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > limit) {
        throw new Error("GitLab release bundle exceeds the size limit");
      }
      chunks.push(chunk);
    }
    writeFileSync(target, Buffer.concat(chunks));
    return verifyBundle({ bundlePath: target, record, repository });
  } catch (error) {
    rmSync(target, { force: true });
    throw error;
  }
}
