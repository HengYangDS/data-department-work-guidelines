import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { parse as parseShell } from "shell-quote";
import { parse as parseToml } from "smol-toml";
import { documentMetadata, nativeTomlFormatter } from "./content.mjs";
import {
  dependencyPolicyPath,
  parseDependencyPolicy,
  validateDependencyInput,
} from "./ci.mjs";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "./markdown.mjs";
import {
  nativeSupplyPath,
  nativeToolBinary,
  offlineBundleRecordPath,
  readText,
  root,
  run,
  gitFiles,
  sourceAttributes,
} from "./runtime.mjs";

const requiredSections = [
  "Context",
  "Decision",
  "Alternatives Rejected",
  "Consequences and Boundary",
  "Evidence and Revisit",
];
const subcommands = {
  ethos: new Set([
    "adopt",
    "attestation",
    "hook",
    "land",
    "lane",
    "mcp",
    "plan",
    "prove",
    "publish",
    "status",
  ]),
  openspec: new Set([
    "archive",
    "change",
    "list",
    "new",
    "show",
    "status",
    "validate",
  ]),
  git: new Set([
    "add",
    "branch",
    "commit",
    "diff",
    "log",
    "merge",
    "push",
    "reset",
    "status",
    "worktree",
  ]),
  npm: new Set(["ci", "install", "run", "test"]),
};

function filesUnder(directory) {
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

const interpreters = new Set([
  "bash",
  "fish",
  "sh",
  "zsh",
  "node",
  "python",
  "python3",
  "pwsh",
]);
const wrappers = new Set(["command", "env", "nice", "nohup", "sudo", "time"]);
const assignment = /^[A-Za-z_][A-Za-z0-9_]*=/u;
const argumentSyntax =
  /^(?:--?[^-\s]|\.{1,2}[\\/]|[\\/]|https?:\/\/|\$)|[\\/]|\.(?:[cm]?js|py|sh)$|[*?]/u;

function commandName(word) {
  return path.posix
    .basename(word.replaceAll("\\", "/"))
    .replace(/\.exe$/iu, "");
}

function repositoryCommand(word) {
  const normalized = word.replaceAll("\\", "/");
  return (
    normalized.startsWith("./scripts/") || normalized.startsWith("./tools/")
  );
}

function knownCommand(word) {
  const name = commandName(word);
  return (
    Object.hasOwn(subcommands, name) ||
    interpreters.has(name) ||
    ["curl", "rm"].includes(name) ||
    wrappers.has(name) ||
    repositoryCommand(word)
  );
}

function invocationWords(words) {
  const tokens = [...words];
  while (tokens.length && assignment.test(tokens[0])) tokens.shift();
  while (tokens.length && wrappers.has(commandName(tokens[0]))) {
    tokens.shift();
    if (
      !tokens.length ||
      !(
        tokens[0].startsWith("-") ||
        assignment.test(tokens[0]) ||
        knownCommand(tokens[0])
      )
    )
      return false;
    while (tokens.length && !knownCommand(tokens[0])) tokens.shift();
  }
  if (tokens.length < 2) return false;
  const [executable, argument] = tokens;
  const name = commandName(executable);
  if (interpreters.has(name)) return argumentSyntax.test(argument);
  if (["curl", "rm"].includes(name))
    return (
      tokens.length === 2 || argumentSyntax.test(argument) || argument === "--"
    );
  if (repositoryCommand(executable)) return true;
  return (
    Object.hasOwn(subcommands, name) &&
    (argument.startsWith("-") || subcommands[name].has(argument))
  );
}

export function commandInvocation(source) {
  const candidate = source
    .trim()
    .replace(/^(?:[-*+] |\d+[.)] )/u, "")
    .trim();
  if (!candidate || candidate.startsWith("#")) return false;
  if (/^(?:\$\s+|[\w.-]+@[\w.-]+(?::[^$#\s]+)?\$\s+)/u.test(candidate))
    return true;
  const words = [];
  for (const token of parseShell(candidate, (name) => `$${name}`)) {
    if (typeof token === "string") words.push(token);
    else if (token.op === "glob") words.push(token.pattern);
    else {
      if (invocationWords(words)) return true;
      words.length = 0;
      if ("comment" in token) break;
    }
  }
  return invocationWords(words);
}

export function executionViolation(source, tokens = markdownTokens(source)) {
  for (const node of walkMarkdown(tokens)) {
    const line = node.startLine;
    if (node.type === "htmlFlow" || node.type === "htmlText") {
      const registry =
        node.startLine === 1 &&
        node.startColumn === 1 &&
        !node.parent &&
        node.text.startsWith("<!--\n---\n") &&
        node.text.endsWith("\n---\n-->");
      if (!registry) return `unsupported HTML at line ${line}`;
    }
    if (node.type === "paragraph" && /^\[[ xX]\](?:\s|$)/u.test(node.text)) {
      let parent = node.parent;
      while (parent) {
        if (parent.type === "listOrdered" || parent.type === "listUnordered")
          return `task progress at line ${line}`;
        parent = parent.parent;
      }
    }
    if (node.type === "codeFenced" || node.type === "codeIndented")
      return `unsupported code block; execution content belongs outside a DR at line ${line}`;
    if (
      node.type === "codeText" &&
      commandInvocation(markdownText(node, { code: true }))
    )
      return `inline command invocation at line ${line}`;
    if (
      (["paragraph", "tableContent"].includes(node.type) ||
        headingLevel(node) > 0) &&
      markdownText(node, { links: false })
        .split(/\r?\n/u)
        .some((value) => commandInvocation(value))
    )
      return `shell prompt or command invocation at line ${line}`;
  }
  return "";
}

export function validateDecision(relative, source) {
  const name = path.basename(relative);
  const match = /^dr-(\d{4})-[a-z0-9-]+\.md$/u.exec(name);
  if (!match) throw new Error(`noncanonical decision filename: ${relative}`);
  const metadata = documentMetadata(relative, source);
  const expected = `DR-${match[1]}`;
  if (
    metadata.decision_id !== expected ||
    metadata.decision_status !== "accepted" ||
    metadata.state !== "canonical"
  ) {
    throw new Error(`DR identity or status mismatch: ${relative}`);
  }
  const tokens = markdownTokens(source, relative);
  const headings = [...walkMarkdown(tokens)].filter(
    (node) => headingLevel(node) > 0,
  );
  const titles = headings.filter((node) => headingLevel(node) === 1);
  if (
    titles.length !== 1 ||
    titles[0].parent ||
    !headingText(titles[0]).startsWith(`${expected}: `)
  )
    throw new Error(`DR title must match ${expected}: ${relative}`);
  const sections = headings.filter((node) => node !== titles[0]);
  if (
    sections.some((node) => headingLevel(node) !== 2 || node.parent) ||
    JSON.stringify(sections.map(headingText)) !==
      JSON.stringify(requiredSections)
  ) {
    throw new Error(
      `DR sections must be exactly ${requiredSections.join(", ")}: ${relative}`,
    );
  }
  const violation = executionViolation(source, tokens);
  if (violation) throw new Error(`DR contains ${violation}: ${relative}`);
  const readable = [...walkMarkdown(tokens)].filter((node) =>
    ["paragraph", "tableContent"].includes(node.type),
  );
  for (const [index, section] of sections.entries()) {
    const nextLine = sections[index + 1]?.startLine ?? Number.POSITIVE_INFINITY;
    if (
      !readable.some(
        (node) =>
          node.startLine > section.endLine &&
          node.startLine < nextLine &&
          markdownText(node, { code: true }).trim(),
      )
    ) {
      throw new Error(
        `DR section ${headingText(section)} requires readable content: ${relative}`,
      );
    }
  }
  return expected;
}

export function checkDecisions(repository = root) {
  if (existsSync(path.join(repository, "docs", "superpowers"))) {
    throw new Error("retired docs/superpowers execution-method tree remains");
  }
  const directory = path.join(repository, "docs", "decisions");
  const files = filesUnder(directory).filter((file) => file.endsWith(".md"));
  const records = files.filter((file) => path.basename(file) !== "README.md");
  if (!records.length) throw new Error("missing current decision records");
  const identities = new Map();
  for (const file of records) {
    const relative = path.relative(repository, file).split(path.sep).join("/");
    const identity = validateDecision(relative, readFileSync(file, "utf8"));
    if (identities.has(identity)) {
      throw new Error(
        `duplicate decision ID ${identity}: ${identities.get(identity)} and ${relative}`,
      );
    }
    identities.set(identity, relative);
  }
  console.log(`PASS decision boundary: ${records.length} current records`);
}

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
  ]);
  for (const [source, targets] of routes) {
    const found = linksIn(read(source), source);
    const missing = targets.filter((target) => !found.has(target));
    if (missing.length)
      throw new Error(
        `missing task routes in ${source}: ${missing.join(", ")}`,
      );
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
    ".config/checks/markdown/markdownlint.toml",
    ".config/checks/prose/vale.ini",
    ".config/checks/prose/styles/Plain/Concise.yml",
    ".config/checks/prose/styles/Plain/StockPhrases.yml",
    ".config/checks/prose/styles/config/vocabularies/Department/accept.txt",
    nativeSupplyPath,
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
  const markdown = parseToml(
    readFileSync(
      path.join(repository, ".config/checks/markdown/markdownlint.toml"),
      "utf8",
    ),
  );
  if (
    Object.keys(markdown).some(
      (name) => !/^MD\d{3}$/u.test(name) && name !== "list-item-spacing",
    ) ||
    markdown.MD032 !== true ||
    markdown.MD058 !== true ||
    markdown.MD012?.maximum !== 1 ||
    markdown.MD022?.lines_above !== 1 ||
    markdown.MD022?.lines_below !== 1 ||
    markdown.MD031?.list_items !== true ||
    markdown["list-item-spacing"]?.checkBlanks !== true ||
    markdown.MD013?.line_length !== 80 ||
    markdown.MD013?.code_blocks !== false ||
    markdown.MD013?.tables !== false ||
    markdown.MD013?.headings !== false ||
    markdown.MD024?.siblings_only !== true
  ) {
    throw new Error(
      "configuration ownership must preserve native Markdown rule policy",
    );
  }
  nativeTomlFormatter(repository);
  parseDependencyPolicy(
    readFileSync(path.join(repository, dependencyPolicyPath), "utf8"),
  );
  if (existsSync(path.join(repository, "package-lock.json")))
    validateDependencyInput(
      JSON.parse(
        readFileSync(path.join(repository, "package-lock.json"), "utf8"),
      ),
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
  console.log("PASS configuration ownership: checks, supply and release");
}

export function checkProfile(repository = root) {
  const profile = parseToml(
    readFileSync(path.join(repository, ".ethos/profile.toml"), "utf8"),
  );
  const expected = ["docs-integrity", "markdown-format"];
  const actual = profile.proof?.code_correctness_gates;
  const ids = profile.proof?.gates?.map((gate) => gate.id);
  if (
    JSON.stringify(actual) !== JSON.stringify(expected) ||
    JSON.stringify(ids) !== JSON.stringify(expected)
  ) {
    throw new Error(
      "profile proof floor must have exactly docs-integrity and markdown-format",
    );
  }
  if (
    !isDeepStrictEqual(
      { ...profile.proof.code_correctness_map },
      {
        behavior: "docs-integrity",
        "static-analysis": "markdown-format",
      },
    )
  ) {
    throw new Error(
      "profile proof dimensions must select their native document gates",
    );
  }
  const commands = [
    ["node", "tools/docs/cli.mjs", "check"],
    ["node", "tools/docs/cli.mjs", "format", "--check"],
  ];
  const verificationProviders = [
    ["ethos.adapters.gates.code_quality:behavior_report"],
    ["ethos.adapters.gates.code_quality:static_report"],
  ];
  const evidence = [
    { kind: "test", evidence_class: "proof" },
    { kind: "lint", evidence_class: "contract" },
  ];
  for (const [index, gate] of profile.proof.gates.entries()) {
    if (JSON.stringify(gate.command) !== JSON.stringify(commands[index])) {
      throw new Error(
        `profile ${gate.id} must invoke the portable repository entrypoint`,
      );
    }
    if (
      JSON.stringify(gate.verification_providers) !==
        JSON.stringify(verificationProviders[index]) ||
      gate.execution_mode !== "verified-command" ||
      gate.tool_adapter !== "ethos"
    ) {
      throw new Error(
        `profile ${gate.id} lacks its native verification provider`,
      );
    }
    if (
      gate.kind !== evidence[index].kind ||
      gate.evidence_class !== evidence[index].evidence_class ||
      gate.network_policy !== "offline" ||
      gate.trust_bearing !== true
    ) {
      throw new Error(
        `profile ${gate.id} must preserve its native document gate contract`,
      );
    }
  }
  if (JSON.stringify(profile.openspec?.material_paths) !== '["**"]') {
    throw new Error("profile must admit all tracked candidates");
  }
  console.log(
    "PASS ETHOS profile: two document commands with product-owned code evidence",
  );
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
