import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readFileSync,
  realpathSync,
  statfsSync,
} from "node:fs";
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

export function reportError(error) {
  let observed = error instanceof Error ? error.message : String(error);
  console.error(observed);
  const seen = new Set([error]);
  let cause = error instanceof Error ? error.cause : undefined;
  while (cause !== undefined && !seen.has(cause)) {
    seen.add(cause);
    const message = cause instanceof Error ? cause.message : String(cause);
    const code = cause instanceof Error ? cause.code : undefined;
    const detail =
      typeof code === "string" && !message.includes(code)
        ? message
          ? `${code}: ${message}`
          : code
        : message;
    if (detail && !observed.includes(detail)) {
      console.error(detail);
      observed += `\n${detail}`;
    }
    cause = cause instanceof Error ? cause.cause : undefined;
  }
}

export function run(command, args = [], options = {}) {
  const {
    capture = false,
    cwd = root,
    env = process.env,
    input,
    rejectStderr = false,
    timeout = 120_000,
  } = options;
  const piped = capture || rejectStderr;
  const result = spawnSync(command, args, {
    cwd,
    env,
    input,
    encoding: "utf8",
    timeout,
    maxBuffer: 16 * 1024 * 1024,
    stdio:
      input === undefined
        ? piped
          ? ["ignore", "pipe", "pipe"]
          : "inherit"
        : ["pipe", piped ? "pipe" : "inherit", piped ? "pipe" : "inherit"],
  });
  if (result.error || result.status !== 0) {
    if (piped) {
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    const detail = result.error
      ? `: ${result.error.message}`
      : ` exited ${result.status ?? "without status"}`;
    throw new Error(
      `${command}${detail}`,
      result.error ? { cause: result.error } : undefined,
    );
  }
  if (rejectStderr && result.stderr) {
    process.stdout.write(result.stdout ?? "");
    throw new Error(`${command} emitted warning output:\n${result.stderr}`);
  }
  return capture ? result.stdout : "";
}

export function workspaceObservation(repository = root) {
  const target = realpathSync.native(repository);
  const git = (args) =>
    run("git", args, { cwd: target, capture: true, rejectStderr: true }).trim();
  const [commit, tree] = git(["rev-parse", "HEAD", "HEAD^{tree}"]).split(
    /\r?\n/u,
  );
  const source = {
    commit,
    tree,
    trackedChanges: Boolean(
      git(["status", "--porcelain", "--untracked-files=no"]),
    ),
  };
  const filesystem = statfsSync(target, { bigint: true });
  return {
    kind: "repository-verification-context",
    observedAt: new Date().toISOString(),
    repository: target,
    source,
    runtime: {
      platform: process.platform,
      processArchitecture: process.arch,
      hostname: os.hostname(),
      node: process.versions.node,
    },
    workspaceFilesystem: {
      unit: "bytes",
      total: String(filesystem.bsize * filesystem.blocks),
      free: String(filesystem.bsize * filesystem.bfree),
      available: String(filesystem.bsize * filesystem.bavail),
    },
    limit:
      "Workspace filesystem only; not VM identity, isolation, or throughput.",
  };
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
      rejectStderr: true,
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
  const invalidReport = () => {
    throw new Error(
      "official OpenSpec validation report is incomplete or inconsistent",
    );
  };
  let reportedRoot;
  try {
    reportedRoot =
      typeof result?.root?.path === "string"
        ? realpathSync.native(result.root.path)
        : undefined;
  } catch {
    invalidReport();
  }
  if (
    result?.version !== "1.0" ||
    typeof result.root?.path !== "string" ||
    !path.isAbsolute(result.root.path) ||
    reportedRoot !== realpathSync.native(root) ||
    !Array.isArray(result.items) ||
    !result.items.length
  ) {
    invalidReport();
  }
  const counts = {
    change: { items: 0, passed: 0, failed: 0 },
    spec: { items: 0, passed: 0, failed: 0 },
  };
  const identities = new Set();
  const findings = [];
  for (const item of result.items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !item.id.trim() ||
      typeof item.type !== "string" ||
      !Object.hasOwn(counts, item.type) ||
      typeof item.valid !== "boolean" ||
      !Array.isArray(item.issues) ||
      !Number.isFinite(item.durationMs) ||
      item.durationMs < 0
    ) {
      invalidReport();
    }
    const identity = `${item.type}:${item.id}`;
    if (identities.has(identity)) invalidReport();
    identities.add(identity);
    counts[item.type].items++;
    counts[item.type][item.valid ? "passed" : "failed"]++;
    for (const issue of item.issues) {
      if (
        !issue ||
        !["INFO", "WARNING", "ERROR"].includes(issue.level) ||
        typeof issue.path !== "string" ||
        typeof issue.message !== "string" ||
        !issue.message.trim()
      ) {
        invalidReport();
      }
      findings.push(
        `${identity} ${issue.path} [${issue.level}] ${issue.message}`,
      );
    }
  }
  const byType = result.summary?.byType;
  if (!byType || typeof byType !== "object" || Array.isArray(byType)) {
    invalidReport();
  }
  for (const type of new Set([
    ...Object.keys(counts),
    ...Object.keys(byType),
  ])) {
    if (!Object.hasOwn(counts, type) || !Object.hasOwn(byType, type))
      invalidReport();
    for (const key of ["items", "passed", "failed"]) {
      if (byType[type]?.[key] !== counts[type][key]) invalidReport();
    }
  }
  const passed = counts.change.passed + counts.spec.passed;
  const failed = counts.change.failed + counts.spec.failed;
  if (
    result.summary?.totals?.items !== result.items.length ||
    result.summary.totals.passed !== passed ||
    result.summary.totals.failed !== failed
  ) {
    invalidReport();
  }
  if (findings.length) {
    throw new Error(
      `official OpenSpec validation findings:\n${findings.join("\n")}`,
    );
  }
  if (failed) throw new Error("official OpenSpec validation did not pass");
  console.log(`PASS official OpenSpec: ${passed} items`);
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
    process.env[`DDWG_${tool.toUpperCase().replaceAll("-", "_")}_BIN`] ||
    (managedFileExists(cached) ? cached : descriptor.binary + suffix);
  const version = run(selected, ["--version"], {
    capture: true,
    rejectStderr: true,
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
