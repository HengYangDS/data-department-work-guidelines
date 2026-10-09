import {
  copyFileSync,
  cpSync,
  lstatSync,
  linkSync,
  mkdirSync,
  mkdtempDisposableSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import { createRequire } from "node:module";
import path from "node:path";
import { readNativeSupply, run } from "../../docs/runtime.mjs";
import {
  assertRegularTree,
  digestBytes,
  inspectBundle,
  pinnedFile,
  sourceIdentity,
} from "./artifact.mjs";
import {
  boundedNpm,
  isolatedNpmEnvironment,
  validateLockSupply,
} from "./npm.mjs";

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
  const native = readNativeSupply(repository);
  const cache = path.join(cacheDirectory, "_cacache");
  const cacheFileCount = assertRegularTree(cache);
  if (!cacheFileCount) throw new Error("offline bundle cache is empty");
  mkdirSync(path.dirname(archive), { recursive: true });
  using building = mkdtempDisposableSync(
    path.join(path.dirname(archive), "ddwg-bundle-build-"),
  );
  const stage = path.join(building.path, "contents");
  mkdirSync(stage);
  const candidate = path.join(building.path, fileName);
  const stagedCache = path.join(stage, "npm-cache", "_cacache");
  mkdirSync(path.dirname(stagedCache), { recursive: true });
  cpSync(cache, stagedCache, { recursive: true, force: false });
  const tools = {};
  for (const [tool, descriptor] of Object.entries(native.tools)) {
    const stagedAssets = path.join(stage, "native", tool);
    const stagedLicenses = path.join(stage, "licenses", tool);
    mkdirSync(stagedAssets, { recursive: true });
    mkdirSync(stagedLicenses, { recursive: true });
    const assets = {};
    for (const [platform, asset] of Object.entries(descriptor.assets)) {
      const input = pinnedFile(
        path.join(assetDirectory, tool),
        asset.name,
        asset.sha256,
        "asset",
      );
      copyFileSync(input, path.join(stagedAssets, asset.name));
      assets[platform] = { name: asset.name, sha256: asset.sha256 };
    }
    const licenses = {};
    for (const [name, license] of Object.entries(descriptor.licenses)) {
      const input = pinnedFile(
        path.join(licenseDirectory, tool),
        name,
        license.sha256,
        "license",
      );
      copyFileSync(input, path.join(stagedLicenses, name));
      licenses[name] = license.sha256;
    }
    tools[tool] = { assets, licenses };
  }
  const manifest = {
    schemaVersion: 4,
    ...source,
    cacheFileCount,
    tools,
  };
  writeFileSync(
    path.join(stage, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  run("tar", ["--no-xattrs", "-czf", candidate, "-C", stage, "."], {
    timeout: 90_000,
    env: { ...process.env, COPYFILE_DISABLE: "1" },
    rejectStderr: true,
  });
  const record = {
    schemaVersion: 4,
    ...source,
    fileName,
    sha256: digestBytes(readFileSync(candidate)),
  };
  inspectBundle(candidate, record, source, native);
  try {
    linkSync(candidate, archive);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error("offline bundle output already exists", { cause: error });
    }
    throw error;
  }
  return record;
}

function readmeLicenseNotice(directory, declarations) {
  const name = readdirSync(directory).find((file) =>
    /^readme(?:\.md)?$/iu.test(file),
  );
  if (!name) return false;
  // Resolve the native parser only during an online build. Cold installation
  // must remain executable before any npm package is installed.
  const require = createRequire(import.meta.url);
  const {
    headingLevel,
    headingText,
    markdownText,
    markdownTokens,
  } = require("../../docs/markdown.mjs");
  const tokens = markdownTokens(
    readFileSync(path.join(directory, name), "utf8"),
    name,
  );
  const start = tokens.findIndex(
    (node) =>
      headingLevel(node) > 0 && /^licen[cs]e$/iu.test(headingText(node).trim()),
  );
  if (start < 0) return false;
  const notice = [];
  for (const node of tokens.slice(start + 1)) {
    const level = headingLevel(node);
    if (level > 0 && level <= headingLevel(tokens[start])) break;
    if (node.type === "content") {
      notice.push(
        ...node.children
          .filter((child) => child.type === "paragraph")
          .map((child) => markdownText(child)),
      );
    }
  }
  return declarations.some((identifier) => {
    if (!/^[a-z0-9][a-z0-9.+-]*$/iu.test(identifier)) return false;
    const escaped = RegExp.escape(identifier);
    return new RegExp(
      `(?:^|[^a-z0-9.+-])${escaped}(?=$|[^a-z0-9.+-])`,
      "iu",
    ).test(notice.join("\n"));
  });
}

function nativeFormatterLicenseNotice(
  installation,
  directory,
  manifest,
  entry,
) {
  if (
    manifest.name !== "@dprint/toml" ||
    manifest.license !== "MIT" ||
    !entry?.version ||
    manifest.version !== entry.version
  )
    return false;
  try {
    // The locked plugin publishes its complete notice through its Wasm API.
    // Keep those original bytes; do not add a fabricated package sidecar.
    const require = createRequire(path.join(installation, "package.json"));
    const pluginPath = require("@dprint/toml").getPath();
    const stat = lstatSync(pluginPath);
    if (
      !stat.isFile() ||
      stat.isSymbolicLink() ||
      realpathSync(path.dirname(pluginPath)) !== realpathSync(directory)
    )
      throw new Error("plugin path is not the selected package");
    const bytes = readFileSync(pluginPath);
    if (WebAssembly.Module.imports(new WebAssembly.Module(bytes)).length) {
      throw new Error("license extraction cannot import host capabilities");
    }
    const formatter = require("@dprint/formatter").createFromBuffer(bytes);
    formatter.setConfig({}, {});
    const info = formatter.getPluginInfo();
    if (info.name !== "dprint-plugin-toml" || info.version !== entry.version) {
      throw new Error("native plugin identity differs from its locked package");
    }
    const notice = formatter.getLicenseText();
    const hostNotice = readFileSync(
      path.join(installation, "node_modules/@dprint/formatter/LICENSE"),
      "utf8",
    );
    const grant = "Permission is hereby granted";
    const start = hostNotice.indexOf(grant);
    const normalize = (text) => text.replace(/\s+/gu, " ").trim();
    return (
      start >= 0 &&
      /^The MIT License \(MIT\)/u.test(notice) &&
      /Copyright \(c\)\s+\S/u.test(notice) &&
      normalize(notice).includes(normalize(hostNotice.slice(start)))
    );
  } catch (error) {
    throw new Error(`native formatter license is invalid: ${error.message}`, {
      cause: error,
    });
  }
}

export function checkPackageLicenses(installation, lock) {
  let count = 0;
  for (const location of Object.keys(lock.packages)) {
    if (!location) continue;
    const packageDirectory = path.join(installation, location);
    const manifest = JSON.parse(
      readFileSync(path.join(packageDirectory, "package.json"), "utf8"),
    );
    const declarations =
      typeof manifest.license === "string"
        ? [manifest.license]
        : (manifest.licenses ?? []).map((license) => license.type);
    const declared =
      declarations.length > 0 &&
      declarations.every(
        (identifier) =>
          typeof identifier === "string" && identifier.trim().length > 0,
      );
    const namedNotice = readdirSync(packageDirectory).some((name) => {
      if (!/^(?:LICENSE|LICENCE|COPYING|NOTICE)(?:[.-]|$)/iu.test(name))
        return false;
      const stat = lstatSync(path.join(packageDirectory, name));
      return stat.isFile() && !stat.isSymbolicLink() && stat.size > 0;
    });
    if (
      !declared ||
      (!namedNotice &&
        !readmeLicenseNotice(packageDirectory, declarations) &&
        !nativeFormatterLicenseNotice(
          installation,
          packageDirectory,
          manifest,
          lock.packages[location],
        ))
    ) {
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
  using priming = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-bundle-prime-"),
  );
  const temporary = priming.path;
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
}
