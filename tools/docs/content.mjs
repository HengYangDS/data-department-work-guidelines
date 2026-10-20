import { existsSync, lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { getFileInfo } from "prettier";
import { lint } from "markdownlint/sync";
import { noQualityControl } from "./markdown.mjs";
import { currentMarkdown, filePath, gitFiles, root, run, sourceAttributes } from "../runtime.mjs";
import { nativeToolBinary } from "../supply.mjs";

const cjk = /[\p{Script=Han}\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/u;
const plainTextIdentities = new Set([
  "LICENSE",
  "VERSION",
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
]);
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

export function textViolations(relative, source) {
  const errors = [];
  for (const [index, line] of source.split(/\r?\n/u).entries()) {
    if (cjk.test(line)) errors.push(`${relative}:${index + 1}: CJK text is not allowed`);
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
    errors.push(...textViolations(relative, source));
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS retained English and text-byte checks; installed ETHOS owns formatting");
}
