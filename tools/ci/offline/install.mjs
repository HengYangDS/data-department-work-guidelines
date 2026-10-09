import { mkdirSync, mkdtempDisposableSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  managedFileExists,
  managedToolPath,
  nativeToolPlatform,
  readNativeSupply,
  run,
} from "../../docs/runtime.mjs";
import {
  inspectBundle,
  sourceIdentity,
  validateBundleRecord,
  validateExtractedBundle,
} from "./artifact.mjs";
import { isolatedNpmEnvironment, npmCliPath, pathExists } from "./npm.mjs";

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
  const runtime = path.join(repository, "build/runtime");
  const reservation = path.join(runtime, ".offline-install");
  managedFileExists(path.join(runtime, ".parent-check"), repository);
  mkdirSync(runtime, { recursive: true });
  using ownership = new DisposableStack();
  try {
    mkdirSync(reservation);
  } catch (error) {
    if (error.code === "EEXIST") {
      throw new Error(
        "offline installation already in progress; preserve its reservation",
        { cause: error },
      );
    }
    throw error;
  }
  ownership.defer(() =>
    rmSync(reservation, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 200,
    }),
  );
  const nodeModules = path.join(repository, "node_modules");
  if (pathExists(nodeModules)) {
    throw new Error(
      "node_modules already exists; preserve or remove it explicitly",
    );
  }
  const native = readNativeSupply(repository);
  const platform = `${process.platform}-${process.arch}`;
  const installations = Object.entries(native.tools).map(
    ([tool, descriptor]) => {
      const selectedPlatform = nativeToolPlatform(tool, platform, native);
      const asset = descriptor.assets[selectedPlatform];
      const target = managedToolPath(tool, selectedPlatform, repository);
      return { tool, asset, target };
    },
  );
  inspectBundle(archive, record, source, native);
  using extracted = mkdtempDisposableSync(
    path.join(os.tmpdir(), "ddwg-bundle-install-"),
  );
  const temporary = extracted.path;
  run("tar", ["-xf", archive, "--no-same-owner", "-C", temporary], {
    rejectStderr: true,
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
  let completed = false;
  using npmOutput = new DisposableStack();
  npmOutput.defer(() => {
    if (!completed)
      rmSync(nodeModules, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 200,
      });
  });
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
  for (const { tool, asset, target } of installations) {
    const assetPath = path.join(temporary, "native", tool, asset.name);
    commandRunner(
      process.execPath,
      [
        path.join(repository, "tools", "ci", "install-native.mjs"),
        tool,
        "--asset",
        assetPath,
      ],
      { cwd: repository, timeout: 90_000 },
    );
    if (!managedFileExists(target, repository)) {
      throw new Error(`native install returned without managed ${tool}`);
    }
  }
  completed = true;
  return { version: source.version, sha256: record.sha256, npmVersion };
}
