import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseShell } from "shell-quote";
import { documentMetadata } from "./content.mjs";
import {
  headingLevel,
  headingText,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "./markdown.mjs";
import { root, filesUnder } from "./runtime.mjs";

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
