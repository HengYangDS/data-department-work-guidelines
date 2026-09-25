import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import {
  currentMarkdown,
  filePath,
  gitFiles,
  lycheeBinary,
  readText,
  root,
  run,
  runNodeTool,
  temporaryRoot,
} from "./runtime.mjs";

const requiredMetadata = ["subject", "role", "state", "relations"];
const cjk = /[\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/u;
const textExtensions = new Set([
  ".md",
  ".toml",
  ".yaml",
  ".yml",
  ".json",
  ".mjs",
  ".js",
]);
const hostedConfig = "tools/ci/config/mermaid-puppeteer-hosted.json";
const systemConfig = "tools/ci/config/mermaid-puppeteer-system.json";

export function formatSource({ check = true } = {}) {
  runNodeTool("prettier", "prettier", [
    check ? "--check" : "--write",
    "--no-error-on-unmatched-pattern",
    "**/*.md",
    "tools/**/*.mjs",
    "tests/**/*.test.mjs",
  ]);
}

export function lintMarkdown() {
  runNodeTool("markdownlint-cli2", "markdownlint-cli2", [
    "**/*.md",
    "#.superpowers/**",
    "#.worktrees/**",
    "#build/**",
    "#node_modules/**",
  ]);
}

export function documentMetadata(relative, source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/u.exec(source);
  if (!match) {
    throw new Error(`missing document metadata: ${relative}`);
  }
  const document = YAML.parseDocument(match[1], { uniqueKeys: true });
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

export function mermaidFences(relative, source) {
  const diagrams = [];
  const lines = source.split(/\r?\n/u);
  let opening = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!opening) {
      const match = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
      if (match) {
        opening = {
          char: match[1][0],
          length: match[1].length,
          info: match[2].trim(),
          start: index + 1,
          body: [],
        };
      }
      continue;
    }
    const closing = new RegExp(
      `^ {0,3}${opening.char}{${opening.length},}\\s*$`,
      "u",
    );
    if (closing.test(line)) {
      if (opening.info.split(/\s+/u)[0] === "mermaid") {
        diagrams.push({
          relative,
          line: opening.start,
          source: `${opening.body.join("\n")}\n`,
        });
      }
      opening = null;
    } else {
      opening.body.push(line);
    }
  }
  if (opening) {
    throw new Error(`unbalanced fenced block: ${relative}:${opening.start}`);
  }
  return diagrams;
}

export function rendererConfig(selection) {
  if (selection && selection !== hostedConfig) {
    throw new Error(`unsupported hosted renderer config: ${selection}`);
  }
  if (selection) {
    const payload = JSON.parse(readText(selection));
    if (
      JSON.stringify(payload) !== JSON.stringify({ args: ["--no-sandbox"] })
    ) {
      throw new Error(
        "hosted renderer config must contain only the CI compatibility argument",
      );
    }
    return filePath(selection);
  }
  return process.env.PUPPETEER_EXECUTABLE_PATH ? "" : filePath(systemConfig);
}

export function checkDocuments({ renderDir, hostedRendererConfig = "" } = {}) {
  if (existsSync(filePath("guidelines.md"))) {
    throw new Error("retired root guidelines.md remains in current topology");
  }
  const files = currentMarkdown();
  const subjects = new Map();
  const diagrams = [];
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
    diagrams.push(...mermaidFences(relative, source));
  }
  const ownedDirectory = !renderDir;
  const output = renderDir
    ? path.resolve(renderDir)
    : mkdtempSync(temporaryRoot());
  mkdirSync(output, { recursive: true });
  try {
    const config = rendererConfig(hostedRendererConfig);
    for (const [index, diagram] of diagrams.entries()) {
      const stem = `${diagram.relative.replace(/[^a-zA-Z0-9-]/gu, "--")}-${index + 1}`;
      const input = path.join(output, `${stem}.mmd`);
      const target = path.join(output, `${stem}.svg`);
      writeFileSync(input, diagram.source, "utf8");
      const args = ["-i", input, "-o", target, "-b", "white"];
      if (config) args.push("--puppeteerConfigFile", config);
      runNodeTool("@mermaid-js/mermaid-cli", "mmdc", args, {
        timeout: 120_000,
      });
      if (!existsSync(target) || !readFileSync(target).length) {
        throw new Error(
          `Mermaid produced no SVG: ${diagram.relative}:${diagram.line}`,
        );
      }
    }
    console.log(
      `PASS documents: ${files.length} Markdown files, ${diagrams.length} rendered diagrams`,
    );
  } finally {
    if (ownedDirectory) rmSync(output, { recursive: true, force: true });
  }
}

export function repositoryFileUri(uri) {
  const url = new URL(uri);
  if (url.protocol !== "file:") return;
  if (url.hostname && url.hostname !== "localhost") {
    throw new Error(`nonlocal file link is not portable: ${uri}`);
  }
  const target = fileURLToPath(url);
  const resolved = existsSync(target)
    ? realpathSync(target)
    : path.resolve(target);
  const relative = path.relative(realpathSync(root), resolved);
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`local link escapes repository root: ${uri}`);
  }
}

export function checkLinks() {
  const files = currentMarkdown();
  const directory = mkdtempSync(temporaryRoot());
  try {
    const list = path.join(directory, "files.txt");
    writeFileSync(list, `${files.map(filePath).join("\n")}\n`, "utf8");
    const lychee = lycheeBinary();
    const links = run(lychee, ["--dump", "--files-from", list], {
      capture: true,
      timeout: 60_000,
    });
    for (const uri of links.split(/\r?\n/u).filter(Boolean))
      repositoryFileUri(uri.trim());
    run(
      lychee,
      [
        "--offline",
        "--include-fragments=anchor-only",
        "--no-progress",
        "--max-retries",
        "0",
        "--files-from",
        list,
      ],
      { timeout: 90_000 },
    );
    console.log("PASS offline links and repository confinement");
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
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (cjk.test(line))
      errors.push(`${relative}:${index + 1}: CJK text is not allowed`);
  }
  if (
    textExtensions.has(path.extname(relative)) &&
    !relative.startsWith("openspec/changes/archive/")
  ) {
    const error = blankLineError(relative, source);
    if (error) errors.push(error);
  }
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
