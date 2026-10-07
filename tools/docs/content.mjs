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
import { createFromBuffer } from "@dprint/formatter";
import tomlPlugin from "@dprint/toml";
import { isDeepStrictEqual } from "node:util";
import { parse as parseToml } from "smol-toml";
import YAML from "yaml";
import { lint, readConfig } from "markdownlint/sync";
import { noQualityControl } from "./markdown.mjs";
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
  sourceAttributes,
  temporaryRoot,
} from "./runtime.mjs";

const requiredMetadata = ["subject", "role", "state", "relations"];
const cjk =
  /[\p{Script=Han}\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/u;
const plainTextIdentities = new Set([
  "LICENSE",
  "VERSION",
  ".gitignore",
  ".gitattributes",
]);
export function nativeTomlFormatter(repository = root) {
  const formatter = createFromBuffer(readFileSync(tomlPlugin.getPath()));
  const policyPath = path.join(repository, ".config/checks/format/toml.toml");
  formatter.setConfig(
    {},
    structuredClone(parseToml(readFileSync(policyPath, "utf8"))),
  );
  const diagnostics = formatter.getConfigDiagnostics();
  if (diagnostics.length) {
    throw new Error(
      diagnostics
        .map(
          ({ propertyName, message }) =>
            `${policyPath}: ${propertyName}: ${message}`,
        )
        .join("\n"),
    );
  }
  const sourcePolicy = parseToml(
    readFileSync(
      path.join(repository, ".config/checks/format/prettier.toml"),
      "utf8",
    ),
  );
  const resolved = formatter.getResolvedConfig();
  const required = {
    lineWidth: sourcePolicy.printWidth,
    indentWidth: sourcePolicy.tabWidth,
    newLineKind: "lf",
    useTabs: false,
    quoteStyle: "maintain",
    sortKeys: false,
    sortArrays: false,
    sortInlineTables: false,
    commentForceLeadingSpace: false,
    cargoApplyConventions: false,
  };
  if (
    Object.entries(required).some(([key, value]) => resolved[key] !== value)
  ) {
    throw new Error(
      "native TOML formatting policy must preserve data, comments, and source layout",
    );
  }
  return formatter;
}

export async function formatTargets(
  files = gitFiles(),
  matching = nativeTomlFormatter().getFileMatchingInfo(),
) {
  const targets = { prettier: [], toml: [] };
  for (const relative of files) {
    const absolute = filePath(relative);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) continue;
    if (
      matching.fileExtensions.includes(path.extname(relative).slice(1)) ||
      matching.fileNames.includes(path.basename(relative))
    ) {
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
  const formatter = nativeTomlFormatter();
  const targets = await formatTargets(
    gitFiles(),
    formatter.getFileMatchingInfo(),
  );
  if (targets.prettier.length) {
    runNodeTool("prettier", "prettier", [
      "--config",
      ".config/checks/format/prettier.toml",
      "--no-editorconfig",
      "--ignore-path",
      os.devNull,
      "--with-node-modules",
      check ? "--check" : "--write",
      "--",
      ...targets.prettier.map(filePath),
    ]);
  }
  const findings = [];
  for (const relative of targets.toml) {
    const source = readText(relative);
    let formatted;
    try {
      formatted = formatter.formatText({
        filePath: relative,
        fileText: source,
      });
      if (!isDeepStrictEqual(parseToml(source), parseToml(formatted))) {
        throw new Error("native formatting changes TOML data");
      }
    } catch (error) {
      findings.push(`${relative}: ${error.message}`);
      continue;
    }
    if (formatted !== source) {
      if (check) findings.push(`${relative}: native TOML formatting differs`);
      else writeFileSync(filePath(relative), formatted);
    }
  }
  if (findings.length) throw new Error(findings.join("\n"));
  console.log(
    `PASS native TOML formatting: ${targets.toml.length} source files`,
  );
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
    customRules: [noQualityControl],
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
    config: { default: false, "no-quality-control": true },
    customRules: [noQualityControl],
  });
  const violations = Object.entries(controls).flatMap(([file, errors]) =>
    errors.map(
      ({ lineNumber, errorDetail }) =>
        `${file}:${lineNumber} [no-quality-control] ${errorDetail}`,
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
    { capture: true, rejectStderr: true },
  );
  let alerts;
  try {
    alerts = JSON.parse(output);
  } catch (cause) {
    throw new Error(`native Vale returned an invalid report: ${output}`, {
      cause,
    });
  }
  const validAlert = (alert) =>
    alert &&
    typeof alert === "object" &&
    !Array.isArray(alert) &&
    Number.isInteger(alert.Line) &&
    alert.Line > 0 &&
    Array.isArray(alert.Span) &&
    alert.Span.length === 2 &&
    alert.Span.every((column) => Number.isInteger(column) && column > 0) &&
    alert.Span[1] >= alert.Span[0] &&
    typeof alert.Check === "string" &&
    alert.Check.trim() &&
    typeof alert.Message === "string" &&
    alert.Message.trim();
  if (
    !alerts ||
    typeof alerts !== "object" ||
    Array.isArray(alerts) ||
    Object.values(alerts).some(
      (entries) => !Array.isArray(entries) || !entries.every(validAlert),
    )
  ) {
    throw new Error(`native Vale returned an invalid report: ${output}`);
  }
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

export function linkCheckArguments(
  list,
  { online = false, literalFiles = [] } = {},
) {
  return [
    "--config",
    filePath(".config/checks/links/lychee.toml"),
    ...(online ? ["--offline=false"] : []),
    "--files-from",
    list,
    ...(literalFiles.length ? ["--", ...literalFiles] : []),
  ];
}

export function checkLinks({ online = false } = {}) {
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
    const links = run(
      lychee,
      ["--dump", ...linkCheckArguments(list, { literalFiles })],
      {
        capture: true,
        rejectStderr: true,
        timeout: 60_000,
      },
    );
    for (const uri of links.split(/\r?\n/u).filter(Boolean))
      repositoryFileUri(uri.trim(), source);
    run(lychee, linkCheckArguments(list, { online, literalFiles }), {
      timeout: 90_000,
    });
    console.log(
      `PASS ${online ? "online" : "offline"} links and repository confinement`,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function blankLineError(relative, source) {
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

export async function textViolations(relative, source) {
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
  const { inferredParser } = await getFileInfo(filePath(relative), {
    ignorePath: [],
    withNodeModules: true,
    resolveConfig: false,
  });
  if (!inferredParser && !relative.endsWith(".toml")) {
    const extension = path.extname(relative);
    if (
      !plainTextIdentities.has(relative) &&
      ![".txt", ".ini"].includes(extension)
    ) {
      errors.push(
        `${relative}: no native formatting owner for this text format`,
      );
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
        errors.push(
          `${relative}: source with a native text owner cannot be declared binary`,
        );
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
      errors.push(
        `${relative}: text source is not valid UTF-8: ${error.message}`,
      );
      continue;
    }
    errors.push(...(await textViolations(relative, source)));
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS English source and native or plain-text spacing ownership");
}
