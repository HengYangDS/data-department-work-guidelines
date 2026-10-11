import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { nativeTomlFormatter } from "./content.mjs";
import {
  dependencyPolicyPath,
  parseDependencyPolicy,
  validateDependencyInput,
} from "./dependencies.mjs";
import {
  headingLevel,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
} from "./markdown.mjs";
import {
  offlineBundleRecordPath,
  root,
  run,
  gitFiles,
  sourceAttributes,
  filesUnder,
} from "../runtime.mjs";
import { nativeSupplyPath, nativeToolBinary } from "../supply.mjs";

function linksIn(source, relative) {
  return new Set(
    markdownLinkDestinations(source).flatMap((href) => {
      let destination;
      try {
        destination = decodeURIComponent(href.split(/[?#]/u, 1)[0]);
      } catch {
        return [];
      }
      if (
        /^(?:[a-z][a-z0-9+.-]*:|\/)/iu.test(destination) ||
        destination.includes("\\")
      ) {
        return [];
      }
      const target = path.posix.normalize(
        path.posix.join(
          path.posix.dirname(relative),
          destination || path.posix.basename(relative),
        ),
      );
      return target === ".." || target.startsWith("../") ? [] : [target];
    }),
  );
}

function hasReaderOpening(source, relative) {
  const tokens = markdownTokens(source, relative);
  const title = tokens.findIndex((token) => headingLevel(token) === 1);
  const opening = tokens
    .slice(title + 1)
    .find(
      (token) =>
        !["lineEnding", "lineEndingBlank", "htmlFlow"].includes(token.type),
    );
  const paragraph = opening?.children.find(
    (token) => token.type === "paragraph",
  );
  return (
    title >= 0 &&
    opening?.type === "content" &&
    paragraph !== undefined &&
    markdownText(paragraph).trimStart().startsWith("When to use:")
  );
}

export function checkNavigation(repository = root) {
  const read = (relative) =>
    readFileSync(path.join(repository, relative), "utf8");
  const profile = parseToml(read(".ethos/profile.toml"));
  const normative = profile.normative_sources;
  if (!Array.isArray(normative) || !normative.length)
    throw new Error("missing normative source list");
  const routes = new Map([
    ["README.md", ["docs/README.md"]],
    [
      "AGENTS.md",
      ["docs/README.md", "docs/charter.md", "docs/governance/ethos.md"],
    ],
    ["docs/README.md", normative],
    [
      "docs/governance/ethos.md",
      ["openspec/README.md", "docs/decisions/README.md"],
    ],
    ["docs/decisions/README.md", ["docs/README.md", "openspec/README.md"]],
  ]);
  for (const [source, targets] of routes) {
    const found = linksIn(read(source), source);
    const missing = targets.filter((target) => !found.has(target));
    if (missing.length)
      throw new Error(
        `missing task routes in ${source}: ${missing.join(", ")}`,
      );
  }
  const pages = new Set(
    [...routes.keys(), ...normative].filter((page) => page.startsWith("docs/")),
  );
  for (const page of pages) {
    const source = read(page);
    if (!source.startsWith("<!--\n"))
      throw new Error(`reader metadata needs a leading HTML comment: ${page}`);
  }
  const rootRoutes = linksIn(read("README.md"), "README.md");
  const repeated = normative.filter((relative) => rootRoutes.has(relative));
  if (repeated.length)
    throw new Error(`root entry repeats topic routes: ${repeated.join(", ")}`);
  if (
    existsSync(path.join(repository, "docs/history/README.md")) ||
    existsSync(path.join(repository, "guidelines.md"))
  ) {
    throw new Error("retired root monolith or redundant history page remains");
  }
  for (const relative of normative.filter(
    (item) => item !== "docs/charter.md",
  )) {
    if (!hasReaderOpening(read(relative), relative))
      throw new Error(`missing reader entry in ${relative}`);
  }
  console.log("PASS task-oriented navigation; this is not adoption evidence");
}

export function checkConfigurationLayout(repository = root) {
  const expectedFiles = new Set([
    ".config/README.md",
    ".config/checks/format/prettier.toml",
    ".config/checks/format/toml.toml",
    ".config/checks/links/lychee.toml",
    dependencyPolicyPath,
    ".config/checks/prose/vale.ini",
    ".config/checks/prose/styles/Plain/Concise.yml",
    ".config/checks/prose/styles/Plain/StockPhrases.yml",
    ".config/checks/prose/styles/config/vocabularies/Department/accept.txt",
    nativeSupplyPath,
    ".config/mise/config.toml",
    ".config/mise/mise.lock",
    offlineBundleRecordPath,
  ]);
  const expectedDirectories = new Set([".config"]);
  for (const file of expectedFiles) {
    let directory = path.posix.dirname(file);
    while (directory !== ".") {
      expectedDirectories.add(directory);
      directory = path.posix.dirname(directory);
    }
  }
  const observed = new Set();
  const inspect = (relative) => {
    const absolute = path.join(repository, relative);
    const stat = lstatSync(absolute);
    if (stat.isSymbolicLink())
      throw new Error(
        `configuration ownership cannot follow a link: ${relative}`,
      );
    if (stat.isDirectory()) {
      if (!expectedDirectories.has(relative))
        throw new Error(`configuration layout has no owner: ${relative}`);
      for (const name of readdirSync(absolute)) inspect(`${relative}/${name}`);
    } else if (stat.isFile() && expectedFiles.has(relative)) {
      observed.add(relative);
    } else {
      throw new Error(`configuration ownership is not declared: ${relative}`);
    }
  };
  if (!existsSync(path.join(repository, ".config")))
    throw new Error("configuration layout is missing");
  inspect(".config");
  const missing = [...expectedFiles].filter((file) => !observed.has(file));
  if (missing.length)
    throw new Error(
      `configuration layout is missing owners: ${missing.join(", ")}`,
    );
  const packagePath = path.join(repository, "package.json");
  if (
    existsSync(packagePath) &&
    Object.hasOwn(JSON.parse(readFileSync(packagePath, "utf8")), "prettier")
  )
    throw new Error(
      "configuration ownership cannot duplicate policy in package.json",
    );
  nativeTomlFormatter(repository);
  const dependencyPolicy = parseDependencyPolicy(
    readFileSync(path.join(repository, dependencyPolicyPath), "utf8"),
  );
  if (existsSync(path.join(repository, "package-lock.json")))
    validateDependencyInput(
      JSON.parse(
        readFileSync(path.join(repository, "package-lock.json"), "utf8"),
      ),
      dependencyPolicy,
    );
  const vale = JSON.parse(
    run(
      nativeToolBinary("vale"),
      [
        "--no-global",
        `--config=${path.join(repository, ".config/checks/prose/vale.ini")}`,
        "ls-config",
      ],
      { cwd: repository, capture: true, rejectStderr: true, timeout: 10_000 },
    ),
  );
  if (
    !Array.isArray(vale.Paths) ||
    vale.Paths.length !== 1 ||
    path.resolve(vale.Paths[0]) !==
      path.resolve(repository, ".config/checks/prose/styles")
  )
    throw new Error(
      "configuration ownership must keep Vale styles concern-local",
    );
  console.log("PASS configuration ownership: checks, Mise, supply and release");
}

export function checkNoScope(repository = root) {
  const changes = path.join(repository, "openspec", "changes");
  const companions = filesUnder(changes).filter(
    (file) => path.basename(file) === "scope.toml",
  );
  if (companions.length) {
    throw new Error(
      `private scope companion remains: ${companions.join(", ")}`,
    );
  }
  console.log("PASS Change boundary: no private scope companion");
}

const mitBody = [
  'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
  "",
  "The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
  "",
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.',
  "",
].join("\n");

export function checkLicense(repository = root) {
  const read = (relative) =>
    readFileSync(path.join(repository, relative), "utf8");
  if (!existsSync(path.join(repository, "LICENSE")))
    throw new Error("missing MIT LICENSE");
  const license = read("LICENSE");
  const match =
    /^MIT License\n\nCopyright \(c\) (?:19|20)\d{2}(?:-(?:19|20)\d{2})? [^\n]+\n\n([\s\S]*)$/u.exec(
      license,
    );
  if (!match || match[1] !== mitBody)
    throw new Error("LICENSE must contain the standard MIT text");
  if (!/\[MIT License\]\(LICENSE\)/u.test(read("README.md")))
    throw new Error("README must provide the MIT license link");
  const manifest = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));
  if (manifest.license !== "MIT" || lock.packages?.[""]?.license !== "MIT")
    throw new Error("MIT package metadata must agree with LICENSE");
  console.log("PASS singular MIT license and metadata");
}

export function checkLineEndingAttributes(repository = root) {
  const files = gitFiles(repository);
  if (!files.includes(".gitattributes")) {
    throw new Error("Git must check out tracked text with LF on every host");
  }
  for (const [relative, { text, eol }] of sourceAttributes(files, repository)) {
    if (text !== "unset" && (!["auto", "set"].includes(text) || eol !== "lf")) {
      throw new Error(
        `${relative}: Git must check out tracked text with LF on every host`,
      );
    }
  }
  console.log("PASS Git text checkout: LF on every host");
}
