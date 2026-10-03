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
import { parse as parseToml } from "smol-toml";
import YAML from "yaml";
import { lint, readConfig } from "markdownlint/sync";
import { noProseControl } from "./markdown.mjs";
import {
  currentMarkdown,
  filePath,
  gitFiles,
  nativeToolBinary,
  readText,
  root,
  run,
  runNodeTool,
  sourceMarkdown,
  temporaryRoot,
} from "./runtime.mjs";

const requiredMetadata = ["subject", "role", "state", "relations"];
const cjk = /[\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/u;
export async function formatTargets(files = gitFiles()) {
  const targets = [];
  for (const relative of files) {
    const absolute = filePath(relative);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
    const { inferredParser } = await getFileInfo(absolute, {
      ignorePath: [],
      withNodeModules: true,
      resolveConfig: false,
    });
    if (inferredParser) targets.push(relative);
  }
  return targets;
}

export async function formatSource({ check = true } = {}) {
  const targets = await formatTargets();
  runNodeTool("prettier", "prettier", [
    "--config",
    ".config/checks/format/prettier.toml",
    "--no-editorconfig",
    "--ignore-path",
    os.devNull,
    "--with-node-modules",
    check ? "--check" : "--write",
    ...targets,
  ]);
}

export function lintMarkdown({ files = sourceMarkdown(), strings } = {}) {
  const config = readConfig(
    filePath(".config/checks/markdown/markdownlint.toml"),
    [(source) => structuredClone(parseToml(source))],
  );
  const results = lint({
    files: files.map((relative) =>
      path.isAbsolute(relative) ? relative : filePath(relative),
    ),
    strings,
    config,
    noInlineConfig: true,
    customRules: [noProseControl],
  });
  const findings = Object.entries(results).flatMap(([file, errors]) =>
    errors.map(
      ({ lineNumber, ruleNames, errorDetail, errorContext }) =>
        `${file}:${lineNumber} [${ruleNames[0]}] ${errorDetail ?? errorContext ?? "Markdown rule violation"}`,
    ),
  );
  if (findings.length) throw new Error(findings.join("\n"));
  console.log(
    `PASS native Markdown policy: ${Object.keys(results).length} source inputs`,
  );
}

export function proseAlerts(files = currentMarkdown()) {
  if (!files.length)
    throw new Error("no current Markdown files to check for prose");
  const absoluteFiles = files.map((relative) =>
    path.isAbsolute(relative) ? relative : filePath(relative),
  );
  const controls = lint({
    files: absoluteFiles,
    frontMatter: null,
    noInlineConfig: true,
    config: { default: false, "no-prose-control": true },
    customRules: [noProseControl],
  });
  const violations = Object.entries(controls).flatMap(([file, errors]) =>
    errors.map(
      ({ lineNumber, errorDetail }) =>
        `${file}:${lineNumber} [no-prose-control] ${errorDetail}`,
    ),
  );
  if (violations.length) throw new Error(violations.join("\n"));
  const output = run(
    nativeToolBinary("vale"),
    [
      "--no-global",
      `--config=${filePath(".config/checks/prose/vale.ini")}`,
      "--output=JSON",
      "--no-exit",
      "--no-color",
      ...absoluteFiles,
    ],
    { capture: true },
  );
  const alerts = JSON.parse(output);
  if (!alerts || typeof alerts !== "object" || Array.isArray(alerts))
    throw new Error("native Vale returned an invalid report");
  return alerts;
}

export function checkProse(files = currentMarkdown()) {
  const findings = Object.entries(proseAlerts(files)).flatMap(
    ([file, alerts]) =>
      alerts.map(
        ({ Line, Span, Check, Message }) =>
          `${file}:${Line}:${Span[0]} [${Check}] ${Message}`,
      ),
  );
  if (findings.length) throw new Error(findings.join("\n"));
  console.log(
    `PASS native Vale spelling, prose and terminology: ${files.length} current Markdown files`,
  );
}

export function documentMetadata(relative, source) {
  const lines = source.split(/\r?\n/u);
  if (lines[0] !== "<!--") {
    throw new Error(
      `document metadata requires a title-first carrier: ${relative}`,
    );
  }
  const end = lines.indexOf("---", 2);
  if (lines[1] !== "---" || end < 0 || lines[end + 1] !== "-->") {
    throw new Error(`invalid document metadata: ${relative}`);
  }
  const payload = lines.slice(2, end).join("\n");
  if (payload.includes("-->") || payload.includes("--!>")) {
    throw new Error(`invalid document metadata: ${relative}`);
  }
  if (lines[end + 2] !== "" || !/^# \S/u.test(lines[end + 3] ?? "")) {
    throw new Error(
      `document title must be the first visible block: ${relative}`,
    );
  }
  const document = YAML.parseDocument(payload, { uniqueKeys: true });
  if (document.errors.length) {
    throw new Error(
      `invalid document metadata: ${relative}: ${document.errors[0].message}`,
    );
  }
  const metadata = document.toJS();
  if (!metadata || typeof metadata !== "object") {
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

export function checkDocumentMetadata() {
  const files = currentMarkdown();
  const subjects = new Map();
  for (const relative of files) {
    const source = readText(relative);
    if (relative.startsWith("docs/")) {
      const { subject } = documentMetadata(relative, source);
      if (subjects.has(subject)) {
        throw new Error(
          `duplicate document subject ${subject}: ${subjects.get(subject)} and ${relative}`,
        );
      }
      subjects.set(subject, relative);
    }
  }
  console.log(`PASS document metadata: ${subjects.size} current pages`);
}

export function repositoryFileUri(uri, files) {
  const url = new URL(uri);
  if (url.protocol !== "file:") return;
  if (url.hostname && url.hostname !== "localhost") {
    throw new Error(`nonlocal file link is not portable: ${uri}`);
  }
  const target = fileURLToPath(url);
  const resolved = existsSync(target)
    ? realpathSync(target)
    : path.resolve(target);
  const relatives = [
    path.relative(root, target),
    path.relative(realpathSync(root), resolved),
  ];
  if (
    relatives.some(
      (relative) =>
        relative === ".." ||
        relative.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relative),
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

export function linkCheckArguments(list, { online = false } = {}) {
  return [
    "--config",
    filePath(".config/checks/links/lychee.toml"),
    ...(online ? ["--offline=false"] : []),
    "--files-from",
    list,
  ];
}

export function checkLinks({ online = false } = {}) {
  const source = gitFiles();
  const files = currentMarkdown(source);
  const directory = mkdtempSync(temporaryRoot());
  try {
    const list = path.join(directory, "files.txt");
    writeFileSync(list, `${files.map(filePath).join("\n")}\n`, "utf8");
    const lychee = nativeToolBinary("lychee");
    const links = run(lychee, [...linkCheckArguments(list), "--dump"], {
      capture: true,
      timeout: 60_000,
    });
    for (const uri of links.split(/\r?\n/u).filter(Boolean))
      repositoryFileUri(uri.trim(), source);
    run(lychee, linkCheckArguments(list, { online }), { timeout: 90_000 });
    console.log(
      `PASS ${online ? "online" : "offline"} links and repository confinement`,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

export function blankLineError(relative, source) {
  const lines = source.split(/\r?\n/u);
  for (let index = 1; index < lines.length; index += 1) {
    if (
      !lines[index].trim() &&
      !lines[index - 1].trim() &&
      index < lines.length - 1
    ) {
      return `${relative}:${index + 1}: consecutive blank lines are not allowed`;
    }
  }
  return "";
}

export function textViolations(relative, source) {
  const errors = [];
  if (relative.endsWith(".toml")) {
    try {
      parseToml(source);
    } catch (error) {
      errors.push(`${relative}: invalid TOML: ${error.message}`);
    }
  }
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (cjk.test(line))
      errors.push(`${relative}:${index + 1}: CJK text is not allowed`);
  }
  const error = blankLineError(relative, source);
  if (error) errors.push(error);
  return errors;
}

export function checkTextLayout() {
  const errors = [];
  for (const relative of gitFiles()) {
    const absolute = filePath(relative);
    if (!existsSync(absolute) || lstatSync(absolute).isSymbolicLink()) continue;
    const bytes = readFileSync(absolute);
    if (bytes.includes(0)) continue;
    let source;
    try {
      source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      continue;
    }
    errors.push(...textViolations(relative, source));
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS English text and one-blank-line layout");
}
