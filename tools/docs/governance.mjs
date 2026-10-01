import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { documentMetadata } from "./content.mjs";
import {
  headingLevel,
  headingText,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "./markdown.mjs";
import { readText, root } from "./runtime.mjs";

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

function shellTokens(source) {
  return source.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/gu) ?? [];
}

export function commandInvocation(source) {
  let candidate = source
    .trim()
    .replace(/^(?:[-*+] |\d+[.)] )/u, "")
    .trim();
  if (!candidate || candidate.startsWith("#")) return false;
  if (/^(?:\$\s+|[\w.-]+@[\w.-]+(?::[^$#\s]+)?\$\s+)/u.test(candidate))
    return true;
  const tokens = shellTokens(candidate);
  while (tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/u.test(tokens[0]))
    tokens.shift();
  while (
    tokens.length &&
    ["command", "env", "nice", "nohup", "sudo", "time"].includes(tokens[0])
  ) {
    const wrapper = tokens.shift();
    if (wrapper === "env") {
      while (
        tokens.length &&
        (tokens[0].startsWith("-") ||
          /^[A-Za-z_][A-Za-z0-9_]*=/u.test(tokens[0]))
      )
        tokens.shift();
    } else if (wrapper === "nice" || wrapper === "sudo") {
      while (tokens.length && tokens[0].startsWith("-")) tokens.shift();
    }
  }
  if (!tokens.length) return false;
  const [head, argument] = tokens;
  if (["bash", "fish", "sh", "zsh", "node", "python", "python3"].includes(head))
    return tokens.length > 1;
  if (head.startsWith("./scripts/") || head.startsWith("./tools/"))
    return tokens.length > 1;
  return (
    head in subcommands &&
    Boolean(argument) &&
    (argument.startsWith("-") || subcommands[head].has(argument))
  );
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
}

export function checkDecisions(repository = root) {
  if (existsSync(path.join(repository, "docs", "superpowers"))) {
    throw new Error("retired docs/superpowers execution-method tree remains");
  }
  const directory = path.join(repository, "docs", "decisions");
  const files = filesUnder(directory).filter((file) => file.endsWith(".md"));
  const records = files.filter((file) => path.basename(file) !== "README.md");
  if (!records.length) throw new Error("missing current decision records");
  for (const file of records) {
    const relative = path.relative(repository, file).split(path.sep).join("/");
    validateDecision(relative, readFileSync(file, "utf8"));
  }
  console.log(`PASS decision boundary: ${records.length} current records`);
}

function linksIn(source) {
  return new Set(
    [...source.matchAll(/\]\(([^)#]+)(?:#[^)]+)?\)/gu)].map(
      (match) => match[1],
    ),
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
    ["docs/README.md", normative.map((item) => path.posix.basename(item))],
  ]);
  for (const [source, targets] of routes) {
    const found = linksIn(read(source));
    const missing = targets.filter((target) => !found.has(target));
    if (missing.length)
      throw new Error(
        `missing task routes in ${source}: ${missing.join(", ")}`,
      );
  }
  const repeated = normative.filter((relative) =>
    linksIn(read("README.md")).has(relative),
  );
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
    if (!read(relative).includes("**When to use:**"))
      throw new Error(`missing reader entry in ${relative}`);
  }
  console.log("PASS task-oriented navigation; this is not adoption evidence");
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
  const commands = [
    ["node", "tools/docs/cli.mjs", "check"],
    ["node", "tools/docs/cli.mjs", "format", "--check"],
  ];
  const verificationProviders = [
    ["ethos.adapters.gates.code_quality:behavior_report"],
    ["ethos.adapters.gates.code_quality:static_report"],
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

export function checkLineEndingAttributes(source = readText(".gitattributes")) {
  if (source !== "* text=auto eol=lf\n") {
    throw new Error("Git must check out tracked text with LF on every host");
  }
  console.log("PASS Git text checkout: LF on every host");
}
