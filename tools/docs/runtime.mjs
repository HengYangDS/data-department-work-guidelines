import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  accessSync,
  constants,
  existsSync,
  lstatSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statfsSync,
  statSync,
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

export function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((item) => {
    const target = path.join(directory, item.name);
    return item.isDirectory()
      ? filesUnder(target)
      : item.isFile()
        ? [target]
        : [];
  });
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
  const pending = [error];
  const seen = new Set();
  let observed = "";
  while (pending.length) {
    const current = pending.pop();
    if (seen.has(current)) continue;
    seen.add(current);
    const message =
      current instanceof Error ? current.message : String(current);
    const code = current instanceof Error ? current.code : undefined;
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
    if (current instanceof Error && current.cause !== undefined) {
      pending.push(current.cause);
    }
    if (current instanceof SuppressedError) {
      pending.push(current.error, current.suppressed);
    }
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

export function gitFiles(repository = root) {
  const output = run(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
      cwd: repository,
      capture: true,
      rejectStderr: true,
      timeout: 30_000,
    },
  );
  return [...new Set(output.split("\0").filter(Boolean))]
    .filter((relative) => {
      try {
        lstatSync(path.join(repository, relative));
        return true;
      } catch (error) {
        if (["ENOENT", "ENOTDIR"].includes(error.code)) return false;
        throw error;
      }
    })
    .sort();
}

export function sourceMarkdown(files = gitFiles()) {
  return files.filter((relative) => relative.endsWith(".md"));
}

export function sourceAttributes(files = gitFiles(), repository = root) {
  if (!files.length) return new Map();
  const output = run("git", ["check-attr", "--stdin", "-z", "text", "eol"], {
    cwd: repository,
    capture: true,
    input: `${files.join("\0")}\0`,
    rejectStderr: true,
    timeout: 30_000,
  });
  const fields = output.split("\0");
  if (fields.pop() !== "" || fields.length !== files.length * 6) {
    throw new Error("native Git text attribute report is incomplete");
  }
  const attributes = new Map();
  for (const [index, relative] of files.entries()) {
    const [textPath, textName, text, eolPath, eolName, eol] = fields.slice(
      index * 6,
      index * 6 + 6,
    );
    if (
      textPath !== relative ||
      eolPath !== relative ||
      textName !== "text" ||
      eolName !== "eol"
    ) {
      throw new Error(
        `native Git text attributes do not identify selected source: ${relative}`,
      );
    }
    attributes.set(relative, { text, eol });
  }
  return attributes;
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

export function assertNativeBinaryDigest(bytes, asset, tool) {
  const expected =
    asset?.format === "binary" ? asset.sha256 : asset?.binarySha256;
  if (typeof expected !== "string" || !/^[0-9a-f]{64}$/u.test(expected))
    throw new Error(`unpinned ${tool} binary digest`);
  if (createHash("sha256").update(bytes).digest("hex") !== expected)
    throw new Error(`${tool} binary digest mismatch`);
}

function nativeExecutablePath(selected) {
  const windows = process.platform === "win32";
  if (windows && selected === ".")
    throw new Error(`native executable not found: ${selected}`);
  const explicit =
    path.isAbsolute(selected) || (windows ? /[/\\:]/u : /\//u).test(selected);
  const name = windows ? selected.split(/[/\\:]/u).at(-1) : selected;
  const directories = [];
  if (explicit) {
    directories.push("");
  } else if (windows) {
    if (!Object.hasOwn(process.env, "NoDefaultCurrentDirectoryInExePath"))
      directories.push(root);
    const search = process.env.PATH ?? "";
    for (let offset = 0; offset < search.length;) {
      const quote = search[offset];
      const quoted = quote === '"' || quote === "'";
      const close = quoted ? search.indexOf(quote, offset + 1) : offset;
      const separator = search.indexOf(";", close < 0 ? search.length : close);
      const end = separator < 0 ? search.length : separator;
      let directory = search.slice(offset, end);
      if (quoted) directory = directory.slice(1);
      if (directory.endsWith('"') || directory.endsWith("'"))
        directory = directory.slice(0, -1);
      if (directory) directories.push(directory);
      offset = end + 1;
    }
  } else {
    directories.push(...(process.env.PATH?.split(path.delimiter) ?? []));
  }
  const names = windows
    ? [
        ...(name.indexOf(".") >= 0 && name.indexOf(".") < name.length - 1
          ? [selected]
          : []),
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
        base +
        (base.endsWith(path.sep) ? "" : path.sep) +
        original.slice(prefix.length);
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
  if (!Object.hasOwn(manifest.tools, tool))
    throw new Error(`unknown native tool: ${tool}`);
  const assets = manifest.tools[tool].assets;
  if (Object.hasOwn(assets, platform)) return platform;
  if (platform === "win32-arm64" && Object.hasOwn(assets, "win32-x64"))
    return "win32-x64";
  throw new Error(`unsupported ${tool} platform: ${platform}`);
}

export function managedToolPath(
  tool,
  platform = `${process.platform}-${process.arch}`,
  repository = root,
) {
  const manifest = readNativeSupply(repository);
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
  const cached = managedToolPath(tool, platform);
  const selected = nativeExecutablePath(
    process.env[`DDWG_${tool.toUpperCase().replaceAll("-", "_")}_BIN`] ||
      (managedFileExists(cached) ? cached : descriptor.binary + suffix),
  );
  const selectedPath = path.resolve(root, selected);
  const managedRoot = filePath("build/runtime/tool-cache");
  const inManagedCache = (candidate) => {
    const relative = path.relative(managedRoot, candidate);
    return (
      relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative)
    );
  };
  const resolved = realpathSync.native(selected);
  if (inManagedCache(selectedPath) || inManagedCache(resolved)) {
    if (path.relative(cached, resolved) !== "")
      throw new Error(
        `${tool} managed executable identity does not match its platform pin`,
      );
    if (!managedFileExists(selectedPath))
      throw new Error(`${tool} managed binary is missing`);
    assertNativeBinaryDigest(
      readFileSync(selected),
      {
        ...descriptor.assets[platform],
        format: descriptor.format ?? "archive",
      },
      tool,
    );
  }
  const version = run(selected, ["--version"], {
    capture: true,
    rejectStderr: true,
    timeout: 10_000,
  }).trim();
  if (version !== descriptor.versionOutput) {
    throw new Error(
      `${tool} version mismatch: expected ${descriptor.version}, got ${version}`,
    );
  }
  return selected;
}

export function temporaryRoot() {
  return path.join(os.tmpdir(), "ddwg-docs-");
}
