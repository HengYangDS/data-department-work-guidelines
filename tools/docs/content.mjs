import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { getFileInfo } from "prettier";
import { isDeepStrictEqual } from "node:util";
import { parse as parseToml } from "smol-toml";
import YAML from "yaml";
import { lint } from "markdownlint/sync";
import { noQualityControl } from "./markdown.mjs";
import {
  currentMarkdown,
  filePath,
  gitFiles,
  readText,
  root,
  run,
  runNodeTool,
  sourceAttributes,
  temporaryRoot,
} from "../runtime.mjs";
import { nativeToolBinary } from "../supply.mjs";

const requiredMetadata = ["subject", "role", "state", "relations"];
const cjk = /[\p{Script=Han}\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/u;
const plainTextIdentities = new Set([
  "LICENSE",
  "VERSION",
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
]);
const nativeGeneratedToml = new Set([".config/mise/mise.lock"]);
export function nativeTomlConfiguration(repository = root) {
  const policyPath = path.join(repository, ".config/checks/taplo/taplo.toml");
  const { formatting } = parseToml(readFileSync(policyPath, "utf8"));
  const sourcePolicy = parseToml(
    readFileSync(path.join(repository, ".config/checks/prettier/prettier.toml"), "utf8"),
  );
  const required = {
    column_width: sourcePolicy.printWidth,
    indent_string: " ".repeat(sourcePolicy.tabWidth),
    crlf: false,
    reorder_keys: false,
    trailing_newline: true,
  };
  if (Object.entries(required).some(([key, value]) => formatting?.[key] !== value)) {
    throw new Error("native TOML policy must agree with source width, indentation, and data order");
  }
  return policyPath;
}

export async function formatTargets(files = gitFiles()) {
  const targets = { prettier: [], toml: [] };
  for (const relative of files) {
    const absolute = filePath(relative);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
    if (relative.endsWith(".toml")) {
      targets.toml.push(relative);
      continue;
    }
    const { inferredParser } = await getFileInfo(absolute, {
      ignorePath: [],
      withNodeModules: true,
      resolveConfig: false,
    });
    if (inferredParser) targets.prettier.push(relative);
  }
  return targets;
}

export async function formatSource({ check = true } = {}) {
  const configuration = nativeTomlConfiguration();
  const targets = await formatTargets();
  const taplo = targets.toml.length ? nativeToolBinary("taplo") : "";
  const changes = new Map();
  const findings = [];
  for (const relative of targets.toml) {
    const source = readText(relative);
    try {
      const formatted = run(
        taplo,
        [
          "format",
          "--config",
          configuration,
          "--no-auto-config",
          "--colors",
          "never",
          "--stdin-filepath",
          filePath(relative),
          "-",
        ],
        {
          input: source,
          capture: true,
          rejectStderr: true,
          env: { ...process.env, RUST_LOG: "warn" },
        },
      );
      if (!isDeepStrictEqual(parseToml(source), parseToml(formatted))) {
        throw new Error("native formatting changes TOML data");
      }
      if (formatted !== source) {
        if (check) findings.push(`${relative}: native TOML formatting differs`);
        else changes.set(relative, formatted);
      }
    } catch (error) {
      findings.push(`${relative}: ${error.message}`);
    }
  }
  if (findings.length) throw new Error(findings.join("\n"));
  if (targets.prettier.length) {
    runNodeTool("prettier", "prettier", [
      "--config",
      ".config/checks/prettier/prettier.toml",
      "--no-editorconfig",
      "--ignore-path",
      os.devNull,
      "--with-node-modules",
      check ? "--check" : "--write",
      "--",
      ...targets.prettier.map(filePath),
    ]);
  }
  for (const [relative, formatted] of changes) writeFileSync(filePath(relative), formatted);
  console.log(`PASS native TOML formatting: ${targets.toml.length} source files`);
}

export function checkProse(files = currentMarkdown()) {
  const vale = JSON.parse(
    run(
      nativeToolBinary("vale"),
      ["--no-global", `--config=${path.join(root, ".config/checks/vale/vale.ini")}`, "ls-config"],
      { cwd: root, capture: true, rejectStderr: true, timeout: 10_000 },
    ),
  );
  if (
    !Array.isArray(vale.Paths) ||
    vale.Paths.length !== 1 ||
    path.resolve(vale.Paths[0]) !== path.resolve(root, ".config/checks/vale/styles")
  )
    throw new Error("native prose must keep Vale styles concern-local");
  if (!files.length) throw new Error("no current Markdown files to check for prose");
  const absoluteFiles = files.map((relative) =>
    path.isAbsolute(relative) ? relative : filePath(relative),
  );
  const controls = lint({
    files: absoluteFiles,
    noInlineConfig: true,
    config: { default: false, "no-quality-control": true },
    customRules: [noQualityControl],
  });
  const violations = Object.entries(controls).flatMap(([file, errors]) =>
    errors.map(
      ({ lineNumber, errorDetail }) => `${file}:${lineNumber} [no-quality-control] ${errorDetail}`,
    ),
  );
  if (violations.length) throw new Error(violations.join("\n"));
  const output = run(
    nativeToolBinary("vale"),
    [
      "--no-global",
      `--config=${filePath(".config/checks/vale/vale.ini")}`,
      "--output=line",
      "--no-color",
      ...absoluteFiles,
    ],
    { capture: true, rejectStderr: true },
  );
  if (output) {
    process.stdout.write(output);
    throw new Error("native Vale reported findings");
  }
  console.log(
    `PASS native Vale spelling, prose and terminology: ${files.length} current Markdown files`,
  );
}

export function documentMetadata(relative, source) {
  const lines = source.split(/\r?\n/u);
  if (lines[0] !== "---") {
    throw new Error(`document metadata requires native YAML front matter: ${relative}`);
  }
  const end = lines.indexOf("---", 1);
  if (end < 0) {
    throw new Error(`invalid document metadata: ${relative}`);
  }
  const payload = lines.slice(1, end).join("\n");
  if (lines[end + 1] !== "" || !/^# \S/u.test(lines[end + 2] ?? "")) {
    throw new Error(`document title must be the first visible block: ${relative}`);
  }
  const document = YAML.parseDocument(payload, { uniqueKeys: true });
  if (document.errors.length) {
    throw new Error(`invalid document metadata: ${relative}: ${document.errors[0].message}`);
  }
  const metadata = document.toJS();
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new Error(`invalid document metadata mapping: ${relative}`);
  }
  for (const key of requiredMetadata) {
    if (!(key in metadata)) {
      throw new Error(`missing ${key} metadata: ${relative}`);
    }
  }
  for (const key of ["subject", "role", "state"]) {
    if (typeof metadata[key] !== "string" || !metadata[key]) {
      throw new Error(`invalid ${key} metadata: ${relative}`);
    }
  }
  if (
    !metadata.relations ||
    typeof metadata.relations !== "object" ||
    Array.isArray(metadata.relations)
  ) {
    throw new Error(`invalid relations metadata: ${relative}`);
  }
  return metadata;
}

export function repositoryFileUri(uri, files) {
  const url = new URL(uri);
  if (url.protocol !== "file:") return;
  if (url.hostname && url.hostname !== "localhost") {
    throw new Error(`nonlocal file link is not portable: ${uri}`);
  }
  const target = fileURLToPath(url);
  const resolved = existsSync(target) ? realpathSync(target) : path.resolve(target);
  const relatives = [path.relative(root, target), path.relative(realpathSync(root), resolved)];
  if (
    relatives.some(
      (relative) =>
        relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative),
    )
  ) {
    throw new Error(`local link escapes repository root: ${uri}`);
  }
  const sources = files ?? gitFiles();
  const directory = existsSync(resolved) && lstatSync(resolved).isDirectory();
  for (const item of relatives) {
    const relative = item.split(path.sep).join("/");
    const prefix = relative ? `${relative}/` : "";
    if (
      !sources.includes(relative) &&
      !(directory && sources.some((source) => source.startsWith(prefix)))
    ) {
      throw new Error(`local link is not repository source: ${uri}`);
    }
  }
}

export function linkCheckArguments(list, { literalFiles = [] } = {}) {
  return [
    "--config",
    filePath(".config/checks/lychee/lychee.toml"),
    "--files-from",
    list,
    ...(literalFiles.length ? ["--", ...literalFiles] : []),
  ];
}

export function checkLinks() {
  const source = gitFiles();
  const files = currentMarkdown(source);
  const directory = mkdtempSync(temporaryRoot());
  try {
    const list = path.join(directory, "files.txt");
    const sourcePaths = files.map(filePath);
    const literalFiles = sourcePaths.filter((file) => /[\r\n]/u.test(file));
    const listedFiles = sourcePaths.filter((file) => !/[\r\n]/u.test(file));
    writeFileSync(list, `${listedFiles.join("\n")}\n`, "utf8");
    const lychee = nativeToolBinary("lychee");
    const links = run(lychee, ["--dump", ...linkCheckArguments(list, { literalFiles })], {
      capture: true,
      rejectStderr: true,
      timeout: 60_000,
    });
    for (const uri of links.split(/\r?\n/u).filter(Boolean)) repositoryFileUri(uri.trim(), source);
    run(lychee, linkCheckArguments(list, { literalFiles }), {
      timeout: 90_000,
    });
    console.log("PASS offline links and repository confinement");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function blankLineError(relative, source) {
  const lines = source.split(/\r?\n/u);
  for (let index = 1; index < lines.length; index += 1) {
    if (!lines[index].trim() && !lines[index - 1].trim() && index < lines.length - 1) {
      return `${relative}:${index + 1}: consecutive blank lines are not allowed`;
    }
  }
  return "";
}

export async function textViolations(relative, source) {
  const errors = [];
  const toml = relative.endsWith(".toml") || nativeGeneratedToml.has(relative);
  if (toml) {
    try {
      parseToml(source);
    } catch (error) {
      errors.push(`${relative}: invalid TOML: ${error.message}`);
    }
  }
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (cjk.test(line)) errors.push(`${relative}:${index + 1}: CJK text is not allowed`);
  }
  const { inferredParser } = await getFileInfo(filePath(relative), {
    ignorePath: [],
    withNodeModules: true,
    resolveConfig: false,
  });
  if (!inferredParser && !toml) {
    const extension = path.extname(relative);
    if (!plainTextIdentities.has(relative) && ![".txt", ".ini"].includes(extension)) {
      errors.push(`${relative}: no native formatting owner for this text format`);
    } else {
      const error = blankLineError(relative, source);
      if (error) errors.push(error);
    }
  }
  return errors;
}

export async function checkTextLayout() {
  const errors = [];
  const files = gitFiles();
  const attributes = sourceAttributes(files);
  for (const relative of files) {
    const absolute = filePath(relative);
    if (!existsSync(absolute) || lstatSync(absolute).isSymbolicLink()) continue;
    const bytes = readFileSync(absolute);
    if (attributes.get(relative).text === "unset") {
      const { inferredParser } = await getFileInfo(absolute, {
        ignorePath: [],
        withNodeModules: true,
        resolveConfig: false,
      });
      if (
        inferredParser ||
        path.extname(relative) === ".toml" ||
        plainTextIdentities.has(relative) ||
        [".txt", ".ini"].includes(path.extname(relative))
      ) {
        errors.push(`${relative}: source with a native text owner cannot be declared binary`);
      }
      continue;
    }
    if (bytes.includes(0)) {
      errors.push(`${relative}: text source contains a NUL byte`);
      continue;
    }
    let source;
    try {
      source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (error) {
      errors.push(`${relative}: text source is not valid UTF-8: ${error.message}`);
      continue;
    }
    errors.push(...(await textViolations(relative, source)));
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS English source and native or plain-text spacing ownership");
}
