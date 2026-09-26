import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

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
    npmMajor: major(engines?.npm, "npm"),
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
    timeout = 120_000,
  } = options;
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    timeout,
    maxBuffer: 16 * 1024 * 1024,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  if (result.error) {
    throw new Error(`${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    if (capture) {
      process.stdout.write(result.stdout ?? "");
      process.stderr.write(result.stderr ?? "");
    }
    throw new Error(`${command} exited ${result.status ?? "without status"}`);
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

export function currentMarkdown(files = gitFiles()) {
  return files.filter(
    (relative) =>
      relative.endsWith(".md") &&
      !relative.startsWith("openspec/changes/archive/") &&
      ![".superpowers/", ".worktrees/", "build/", "node_modules/"].some(
        (prefix) => relative.startsWith(prefix),
      ),
  );
}

export function lycheeBinary() {
  const { version: expected } = JSON.parse(
    readText(".config/tools/lychee.json"),
  );
  const suffix = process.platform === "win32" ? ".exe" : "";
  const cached = filePath(
    `build/runtime/tool-cache/lychee/${expected}/${process.platform}-${process.arch}/lychee${suffix}`,
  );
  const selected =
    process.env.DDWG_LYCHEE_BIN || (existsSync(cached) ? cached : "lychee");
  const version = run(selected, ["--version"], {
    capture: true,
    timeout: 10_000,
  }).trim();
  if (version !== `lychee ${expected}`) {
    throw new Error(
      `lychee version mismatch: expected ${expected}, got ${version}`,
    );
  }
  return selected;
}

export function temporaryRoot() {
  return path.join(os.tmpdir(), "ddwg-docs-");
}
