import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { run } from "../../tools/docs/runtime.mjs";

export const sections = [
  "Context",
  "Decision",
  "Alternatives Rejected",
  "Consequences and Boundary",
  "Evidence and Revisit",
];

export function decision({
  headings = sections,
  body = "An evidence link can describe the ETHOS lifecycle.",
} = {}) {
  return [
    "<!--",
    "---",
    "subject: fixture:DR-0001",
    "role: decision",
    "state: canonical",
    "decision_id: DR-0001",
    "decision_status: accepted",
    "relations:",
    "  canonical_for: fixture choice",
    "---",
    "-->",
    "",
    "# DR-0001: Fixture choice",
    "",
    ...headings.flatMap((heading) => [`## ${heading}`, "", body, ""]),
  ].join("\n");
}

export function fixture(run) {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ddwg-quality-test-"));
  try {
    mkdirSync(path.join(directory, "docs", "decisions"), { recursive: true });
    writeFileSync(
      path.join(directory, "docs", "decisions", "dr-0001-fixture.md"),
      decision(),
      "utf8",
    );
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
