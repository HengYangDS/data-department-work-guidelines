import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const nativeSupplyPath = ".config/supply/native.json";
export const offlineBundleRecordPath = ".config/release/offline-bundle.json";

export function readNativeSupply(repository = root) {
  return JSON.parse(
    readFileSync(path.join(repository, nativeSupplyPath), "utf8"),
  );
}

export function filePath(relative) {
  const parts = relative.split("/");
  if (!relative || parts.includes("..") || path.isAbsolute(relative)) {
    throw new Error(`invalid repository path: ${relative}`);
  }
  return path.join(root, ...parts);
}

export function readText(relative) {
  return readFileSync(filePath(relative), "utf8");
}

export function declaredToolRuntime(repository = root) {
  const { engines } = JSON.parse(
    readFileSync(path.join(repository, "package.json"), "utf8"),
  );
  const major = (value, name) => {
    const match = /^([1-9]\d*)\.x$/u.exec(value);
    if (!match) throw new Error(`invalid declared ${name} major`);
    return Number(match[1]);
  };
  return {
    nodeMajor: major(engines?.node, "Node"),
  };
}

export function assertNodeRuntime(version = process.versions.node) {
  const { nodeMajor } = declaredToolRuntime();
  if (Number(version.split(".")[0]) !== nodeMajor) {
    throw new Error(
      `repository tools require Node ${nodeMajor}, got ${version}`,
    );
  }
}

export function run(command, args = [], options = {}) {
  const {
    capture = false,
    cwd = root,
    env = process.env,
    rejectStderr = false,
    timeout = 120_000,
  } = options;
  const piped = capture || rejectStderr;
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    timeout,
    maxBuffer: 16 * 1024 * 1024,
    stdio: piped ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.error) {
    throw new Error(`${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    if (capture && !rejectStderr) {
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    throw new Error(`${command} exited ${result.status ?? "without status"}`);
  }
  if (rejectStderr && result.stderr) {
    throw new Error(`${command} emitted warning output`);
  }
  return capture ? result.stdout : "";
}

export function nodeTool(packageName, binName) {
  const manifestPath = filePath(`node_modules/${packageName}/package.json`);
  if (!existsSync(manifestPath)) {
    throw new Error(
      `missing locked ${packageName}; run npm ci --ignore-scripts`,
    );
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const bin =
    typeof manifest.bin === "string" ? manifest.bin : manifest.bin?.[binName];
  if (!bin) {
    throw new Error(`${packageName} has no ${binName} entrypoint`);
  }
  const resolved = path.resolve(path.dirname(manifestPath), bin);
  if (!existsSync(resolved)) {
    throw new Error(`missing ${packageName} entrypoint: ${bin}`);
  }
  return resolved;
}

export function runNodeTool(packageName, binName, args, options = {}) {
  return run(
    process.execPath,
    [nodeTool(packageName, binName), ...args],
    options,
  );
}

export function validateOpenSpec() {
  const output = runNodeTool(
    "@fission-ai/openspec",
    "openspec",
    ["validate", "--all", "--strict", "--json"],
    {
      capture: true,
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            ([key]) => key.toUpperCase() !== "OPENSPEC_TELEMETRY",
          ),
        ),
        OPENSPEC_TELEMETRY: "0",
      },
    },
  );
  const result = JSON.parse(output);
  if (result.summary?.totals?.failed !== 0 || !result.summary?.totals?.items) {
    throw new Error("official OpenSpec validation did not pass");
  }
  console.log(`PASS official OpenSpec: ${result.summary.totals.passed} items`);
}

export function gitFiles() {
  const output = spawnSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
      cwd: root,
      encoding: "buffer",
      timeout: 30_000,
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  if (output.error || output.status !== 0) {
    throw new Error(
      "could not inventory tracked and candidate repository files",
    );
  }
  return [
    ...new Set(output.stdout.toString("utf8").split("\0").filter(Boolean)),
  ].sort();
}

export function sourceMarkdown(files = gitFiles()) {
  return files.filter((relative) => relative.endsWith(".md"));
}

export function currentMarkdown(files = gitFiles()) {
  return sourceMarkdown(files).filter(
    (relative) => !relative.startsWith("openspec/changes/archive/"),
  );
}

export function managedFileExists(target, repository = root) {
  const boundary = path.resolve(repository);
  const selected = path.resolve(target);
  const relative = path.relative(boundary, selected);
  if (
    !relative ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  )
    throw new Error("managed file must remain inside the repository");
  for (
    let directory = path.dirname(selected);
    path.relative(boundary, directory);
    directory = path.dirname(directory)
  ) {
    const parent = lstatSync(directory, { throwIfNoEntry: false });
    if (parent && (!parent.isDirectory() || parent.isSymbolicLink()))
      throw new Error(`managed file parent is not a directory: ${directory}`);
  }
  const entry = lstatSync(selected, { throwIfNoEntry: false });
  if (!entry) return false;
  if (!entry.isFile() || entry.isSymbolicLink())
    throw new Error(`managed entry is not a regular file: ${selected}`);
  return true;
}

export function nativeToolBinary(tool) {
  const manifest = readNativeSupply();
  const descriptor = manifest.tools[tool];
  if (!descriptor) throw new Error(`unknown native tool: ${tool}`);
  const expected = descriptor.version;
  const suffix = process.platform === "win32" ? ".exe" : "";
  const cached = filePath(
    `build/runtime/tool-cache/${tool}/${expected}/${process.platform}-${process.arch}/${descriptor.binary}${suffix}`,
  );
  const selected =
    process.env[`DDWG_${tool.toUpperCase()}_BIN`] ||
    (managedFileExists(cached) ? cached : descriptor.binary + suffix);
  const version = run(selected, ["--version"], {
    capture: true,
    timeout: 10_000,
  }).trim();
  if (version !== descriptor.versionOutput) {
    throw new Error(
      `${tool} version mismatch: expected ${expected}, got ${version}`,
    );
  }
  return selected;
}

export function temporaryRoot() {
  return path.join(os.tmpdir(), "ddwg-docs-");
}
