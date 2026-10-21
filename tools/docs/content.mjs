import { existsSync, lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { getFileInfo } from "prettier";
import { filePath, gitFiles, sourceAttributes } from "../runtime.mjs";

const plainTextIdentities = new Set([
  "LICENSE",
  "VERSION",
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
]);
export async function checkSourceBytes() {
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
        !inferredParser &&
        path.extname(relative) !== ".toml" &&
        !plainTextIdentities.has(relative) &&
        ![".txt", ".ini"].includes(path.extname(relative))
      )
        continue;
    }
    if (bytes.includes(0)) {
      errors.push(`${relative}: text source contains a NUL byte`);
      continue;
    }
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (error) {
      errors.push(`${relative}: text source is not valid UTF-8: ${error.message}`);
      continue;
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("PASS retained source-byte checks; installed ETHOS owns formatting");
}
