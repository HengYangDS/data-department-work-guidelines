import { spawnSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const offlineBundleRecordPath = ".config/release/offline-bundle.json";

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
  const { devEngines } = JSON.parse(readFileSync(path.join(repository, "package.json"), "utf8"));
  const major = (value, name) => {
    const match = /^([1-9]\d*)\.x$/u.exec(value);
    if (!match) throw new Error(`invalid declared ${name} major`);
    return Number(match[1]);
  };
  const runtime = devEngines?.runtime;
  if (runtime?.name !== "node" || runtime.onFail !== "error") {
    throw new Error("invalid declared Node runtime");
  }
  return {
    nodeMajor: major(runtime.version, "Node"),
  };
}

export function assertNodeRuntime(version = process.versions.node) {
  const { nodeMajor } = declaredToolRuntime();
  if (Number(version.split(".")[0]) !== nodeMajor) {
    throw new Error(`repository tools require Node ${nodeMajor}, got ${version}`);
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
    const message = current instanceof Error ? current.message : String(current);
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
    throw new Error(`${command}${detail}`, result.error ? { cause: result.error } : undefined);
  }
  if (rejectStderr && result.stderr) {
    process.stdout.write(result.stdout ?? "");
    throw new Error(`${command} emitted warning output:\n${result.stderr}`);
  }
  return capture ? result.stdout : "";
}

export function gitFiles(repository = root) {
  const output = run("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: repository,
    capture: true,
    rejectStderr: true,
    timeout: 30_000,
  });
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
    if (textPath !== relative || eolPath !== relative || textName !== "text" || eolName !== "eol") {
      throw new Error(`native Git text attributes do not identify selected source: ${relative}`);
    }
    attributes.set(relative, { text, eol });
  }
  return attributes;
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
