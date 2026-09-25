import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { documentMetadata } from "./content.mjs";
import { filePath, gitFiles, readText, root } from "./runtime.mjs";

const requiredSections = [
  "Context",
  "Decision",
  "Alternatives Rejected",
  "Consequences and Boundary",
  "Evidence and Revisit",
];
const shellLanguages = new Set([
  "bash",
  "console",
  "fish",
  "sh",
  "shell",
  "shell-session",
  "terminal",
  "zsh",
]);
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

export function commandInvocation(source, { shellContext = false } = {}) {
  let candidate = source
    .trim()
    .replace(/^(?:[-*+] |\d+[.)] )/u, "")
    .trim();
  if (!candidate || candidate.startsWith("#")) return false;
  if (/^(?:\$\s+|[\w.-]+@[\w.-]+(?::[^$#\s]+)?\$\s+)/u.test(candidate))
    return true;
  if (shellContext) return true;
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

export function executionViolation(source) {
  const lines = source.split(/\r?\n/u);
  const fencedBody = new Set();
  let opening = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!opening) {
      const match = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line);
      if (match)
        opening = {
          char: match[1][0],
          length: match[1].length,
          language: match[2].trim().split(/\s+/u)[0].toLowerCase(),
        };
      continue;
    }
    const closing = new RegExp(
      `^ {0,3}${opening.char}{${opening.length},}\\s*$`,
      "u",
    );
    if (closing.test(line)) {
      opening = null;
      continue;
    }
    fencedBody.add(index);
    if (
      commandInvocation(line, {
        shellContext: shellLanguages.has(opening.language),
      })
    ) {
      return `fenced execution content at line ${index + 1}`;
    }
  }
  for (let index = 0; index < lines.length; index += 1) {
    if (fencedBody.has(index)) continue;
    let visible = lines[index];
    for (const match of lines[index].matchAll(/`([^`\n]+)`/gu)) {
      if (commandInvocation(match[1]))
        return `inline command invocation at line ${index + 1}`;
      visible = visible.replace(match[0], "");
    }
    if (commandInvocation(visible))
      return `shell prompt or command invocation at line ${index + 1}`;
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
  const headings = [...source.matchAll(/^## ([^\n]+)$/gmu)].map((item) =>
    item[1].trim(),
  );
  if (JSON.stringify(headings) !== JSON.stringify(requiredSections)) {
    throw new Error(
      `DR sections must be exactly ${requiredSections.join(", ")}: ${relative}`,
    );
  }
  const violation = executionViolation(source);
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
  for (const [index, gate] of profile.proof.gates.entries()) {
    if (JSON.stringify(gate.command) !== JSON.stringify(commands[index])) {
      throw new Error(
        `profile ${gate.id} must invoke the portable repository entrypoint`,
      );
    }
  }
  const material = profile.openspec?.material_paths;
  if (
    !Array.isArray(material) ||
    !material.includes(".gitattributes") ||
    !material.includes("tools/**") ||
    !material.includes("docs/**") ||
    !material.includes("openspec/**") ||
    new Set(material).size !== material.length
  ) {
    throw new Error("profile material paths are missing or duplicated");
  }
  const retired = new Set([
    ".agents/**",
    ".githooks/**",
    "evidence/**",
    "evolution/**",
    "guidelines.md",
    "scripts/**",
  ]);
  if (material.some((pattern) => retired.has(pattern))) {
    throw new Error("profile contains retired material roots");
  }
  console.log(
    "PASS ETHOS profile: one Change authority and two portable proof gates",
  );
}

export function checkNoScope(repository = root) {
  const changes = path.join(repository, "openspec", "changes");
  const companions = filesUnder(changes).filter(
    (file) => path.basename(file) === "scope.toml",
  );
  if (companions.length)
    throw new Error(
      `obsolete scope companions remain: ${companions.join(", ")}`,
    );
  console.log("PASS official Change tree: no scope companion");
}

export function checkPortableEntrypoints(files = gitFiles()) {
  const obsolete = files.filter(
    (relative) =>
      relative.endsWith(".sh") ||
      relative.startsWith("scripts/") ||
      relative.startsWith(".githooks/") ||
      relative.startsWith("tools/ci/scripts/"),
  );
  if (obsolete.length) {
    throw new Error(`obsolete shell or hook carriers: ${obsolete.join(", ")}`);
  }
  console.log("PASS portable repository entrypoints: no legacy shell carriers");
}

export function checkConfigPlacement(files = gitFiles()) {
  const required = [
    ".config/tools/cspell.json",
    ".config/tools/lychee.json",
    ".config/tools/markdownlint-cli2.yaml",
    ".config/tools/mermaid-hosted.json",
    ".config/tools/mermaid-local.json",
  ];
  const old = files.filter(
    (relative) =>
      [".markdownlint-cli2.yaml", ".prettierignore"].includes(relative) ||
      relative.startsWith("tools/ci/config/"),
  );
  const missing = required.filter((relative) => !files.includes(relative));
  if (old.length || missing.length) {
    throw new Error(
      `redundant tool configuration or missing .config owner: ${[...old, ...missing].join(", ")}`,
    );
  }
  console.log("PASS tool configuration placement: one .config owner");
}

export function checkLineEndingAttributes(source = readText(".gitattributes")) {
  if (source !== "* text=auto eol=lf\n") {
    throw new Error("Git must check out tracked text with LF on every host");
  }
  console.log("PASS Git text checkout: LF on every host");
}
