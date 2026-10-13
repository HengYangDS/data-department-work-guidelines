import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import {
  headingLevel,
  headingText,
  markdownLinkDestinations,
  markdownText,
  markdownTokens,
  walkMarkdown,
} from "../../tools/docs/markdown.mjs";
import { root } from "../../tools/runtime.mjs";
import { contentUnderHeading } from "../governance/fixtures.mjs";

test("L1 and L2 work records use the full charter boundary at both task routes", () => {
  for (const [relative, opening] of [
    ["docs/decide.md", "A low-risk matter"],
    ["docs/deliver.md", "These duties can share"],
  ]) {
    const source = readFileSync(path.join(root, relative), "utf8");
    const paragraph = [...walkMarkdown(markdownTokens(source, relative))].find(
      (token) => token.type === "paragraph" && markdownText(token).startsWith(opening),
    );
    assert.ok(paragraph, relative);
    assert.match(markdownText(paragraph), /\bL1 and L2\b/u, relative);
    assert.ok(
      markdownLinkDestinations(paragraph.text).includes("charter.md#form-follows-risk"),
      relative,
    );
  }
});

test("collaboration keeps member checks before the Agent execution section", () => {
  const relative = "docs/human-agent.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertReaderOrder = (text) => {
    const headings = markdownTokens(text, relative).filter((token) => headingLevel(token) > 0);
    const locate = (title) => headings.findIndex((token) => headingText(token) === title);
    const shared = locate("Execute and Verify");
    const check = locate("Check Agent Output");
    const agent = locate("Agent Execution");
    const parallel = locate("Parallel Work");
    assert.ok(
      shared >= 0 && shared < check && check < agent && agent < parallel,
      "member acceptance must not be interrupted by the Agent procedure",
    );
    assert.equal(headingLevel(headings[check]), 3);
    assert.equal(headingLevel(headings[agent]), 2, "Agent execution needs a distinct peer section");
    assert.equal(headingLevel(headings[parallel]), 3);
  };
  assertReaderOrder(source);
  assert.throws(
    () => assertReaderOrder(source.replace("## Agent Execution", "### Agent Execution")),
    /distinct peer section/u,
  );
  const checkStart = source.indexOf("### Check Agent Output\n");
  const agentStart = source.indexOf("## Agent Execution\n");
  const parallelStart = source.indexOf("### Parallel Work\n");
  assert.throws(
    () =>
      assertReaderOrder(
        source.slice(0, checkStart) +
          source.slice(agentStart, parallelStart) +
          source.slice(checkStart, agentStart) +
          source.slice(parallelStart),
      ),
    /member acceptance/u,
  );
});

test("collaboration preserves both acceptance outcomes without the diagram", () => {
  const relative = "docs/human-agent.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const section = contentUnderHeading(source, relative, "Execute and Verify");
  const diagram = section.find(
    (token) => token.type === "codeFenced" && token.text.startsWith("```mermaid"),
  );
  assert.ok(diagram, "the delegation example must retain its diagram");
  const descriptions = [
    diagram.text.split("\n").find((line) => line.trimStart().startsWith("accDescr:")),
    [...walkMarkdown(section)]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token))
      .join(" "),
  ];
  const assertOutcomes = (description) => {
    const text = description?.replace(/\s+/gu, " ") ?? "";
    assert.match(
      text,
      /conditions are unmet[^.]*returns for review within the delegation boundary/u,
    );
    assert.match(text, /conditions are met[^.]*accepts[^.]*records acceptance[^.]*hands off/u);
  };
  for (const description of descriptions) {
    const text = description.replace(/\s+/gu, " ");
    assertOutcomes(text);
    assert.throws(
      () => assertOutcomes(text.replace("records acceptance", "announces completion")),
      /records acceptance/u,
    );
    assert.throws(
      () =>
        assertOutcomes(text.replace("within the delegation boundary", "under a new delegation")),
      /delegation boundary/u,
    );
  }
});

test("writing aims do not absorb document-order and sending-review procedures", () => {
  const relative = "docs/communicate.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const aims = contentUnderHeading(text, relative, "Write for Fidelity, Clarity, and Elegance");
    assert.deepEqual(
      aims.filter((token) => headingLevel(token) > 0).map(headingText),
      ["Fidelity", "Clarity", "Elegance"],
      "the three writing aims must not absorb practical procedures",
    );
    const headings = markdownTokens(text, relative).filter((token) => headingLevel(token) > 0);
    for (const title of ["Structure a Decision Document", "Review Before Sending"]) {
      assert.equal(headingLevel(headings.find((token) => headingText(token) === title)), 2);
    }
    const order = contentUnderHeading(text, relative, "Structure a Decision Document")
      .map((token) => token.text)
      .join("\n");
    assert.match(order, /by default/u);
    assert.match(order, /Appendices hold only supporting detail/u);
    assert.match(order, /Combine or reorder these parts/u);
  };
  assertComposition(source);
  assert.throws(
    () =>
      assertComposition(
        source.replace("## Structure a Decision Document", "### Structure a Decision Document"),
      ),
    /three writing aims/u,
  );
});

test("general risk review and management duties are peers of coaching and cadence", () => {
  const relative = "docs/evolve.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const headings = markdownTokens(text, relative).filter((token) => headingLevel(token) > 0);
    for (const title of ["Review Critical Risks", "Management Responsibilities"]) {
      assert.equal(
        headingLevel(headings.find((token) => headingText(token) === title)),
        2,
        "general review and management duties must not be coaching or cadence subtopics",
      );
    }
    const riskReview = contentUnderHeading(text, relative, "Review Critical Risks");
    const riskParagraphs = [...walkMarkdown(riskReview)]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    const minimum = riskParagraphs.find((text) => text.startsWith("Every task must meet"));
    const exceptional = riskParagraphs.find((text) => text.startsWith("Call a result exceptional"));
    assert.ok(
      minimum && !minimum.includes("Call a result exceptional"),
      "the minimum duty must not absorb the exceptional-performance standard",
    );
    assert.ok(
      exceptional && exceptional.includes("Not every task needs an exceptional result"),
      "the higher standard must retain its applicability limit",
    );
    assert.ok(riskReview.some((token) => headingText(token) === "Use Scores with Care"));
    assert.ok(
      !contentUnderHeading(text, relative, "Grow Capability Through Real Work").some(
        (token) => headingText(token) === "Review Critical Risks",
      ),
    );
  };
  assertComposition(source);
  assert.throws(
    () =>
      assertComposition(source.replace("## Review Critical Risks", "### Review Critical Risks")),
    /coaching or cadence subtopics/u,
  );
  assert.throws(
    () => assertComposition(source.replace("reliably.\n\nCall", "reliably. Call")),
    /minimum duty/u,
  );
});

test("delivery entry reaches action and completion gates before the loop reference", () => {
  const relative = "docs/deliver.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertComposition = (text) => {
    const headings = markdownTokens(text, relative)
      .filter((token) => headingLevel(token) > 0)
      .map(headingText);
    const selected = headings.filter((title) =>
      [
        "Before Acting",
        "Close the Work",
        "The Working Loop",
        "Name the State, Not the Effort",
      ].includes(title),
    );
    assert.deepEqual(
      selected,
      ["Before Acting", "Close the Work", "The Working Loop", "Name the State, Not the Effort"],
      "action and completion gates precede the supporting loop reference",
    );
  };
  assertComposition(source);
  const loopStart = source.indexOf("## The Working Loop\n");
  const stateStart = source.indexOf("## Name the State, Not the Effort\n");
  const loop = source.slice(loopStart, stateStart);
  assert.throws(
    () =>
      assertComposition(
        source.replace(loop, "").replace("## Before Acting\n", loop + "## Before Acting\n"),
      ),
    /supporting loop reference/u,
  );
});

test("authority priority exposes four ordered tiers and retains the waiver boundary", () => {
  const relative = "docs/charter.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertAuthorityOrder = (text) => {
    const section = contentUnderHeading(text, relative, "Two Kinds of Authority");
    const priority = section.find((token) => token.type === "listOrdered");
    assert.ok(priority, "authority priority must be individually readable");
    const tiers = priority.children
      .filter((token) => token.type === "content")
      .map((token) => markdownText(token));
    assert.equal(tiers.length, 4);
    for (const [index, phrase] of [
      "Law, regulation, security requirements, and mandatory company policy.",
      "Within those boundaries, the explicit decision of the authorized owner for the current matter.",
      "Effective contracts, policies, specifications, and decision records.",
      "Work plans, provisional agreements, and personal preferences.",
    ].entries()) {
      assert.equal(tiers[index].replace(/\s+/gu, " ").trim(), phrase);
    }
    const limits = section
      .slice(section.indexOf(priority) + 1)
      .map((token) => markdownText(token))
      .join("\n");
    assert.match(limits, /does not grant waiver authority/u);
    assert.match(limits, /factual evidence does not itself grant permission to act/u);
  };
  assertAuthorityOrder(source);
  assert.throws(
    () => assertAuthorityOrder(source.replace(/^([1-4])\. /gmu, "- ")),
    /individually readable/u,
  );
});

test("reasoning checks keep each distinction independently readable", () => {
  const relative = "docs/decide.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertChecks = (text) => {
    const tokens = markdownTokens(text, relative);
    const start = tokens.findIndex(
      (token) => headingLevel(token) === 3 && headingText(token) === "Check the Reasoning",
    );
    assert.notEqual(start, -1);
    const end = tokens.findIndex(
      (token, index) => index > start && headingLevel(token) > 0 && headingLevel(token) <= 3,
    );
    const list = tokens
      .slice(start + 1, end < 0 ? undefined : end)
      .find((token) => token.type === "listUnordered");
    assert.ok(list, "reasoning checks need separately readable items");
    assert.deepEqual(
      list.children
        .filter((token) => token.type === "content")
        .map((token) => markdownText(token).replace(/\s+/gu, " ").trim()),
      [
        "Correlation presented as causation.",
        "A case presented as a population.",
        "A necessary condition treated as sufficient.",
        "A later outcome used to infer a unique earlier cause.",
        "Selective search for supporting evidence.",
        "Criteria changed midstream.",
        "An appeal to common sense, experience, or “best practice” without checking its applicable boundary.",
      ],
    );
  };
  assertChecks(source);
  assert.throws(
    () => assertChecks(source.replace(/^-(?= )/gmu, " ")),
    /separately readable items/u,
  );
});

test("historical research distinguishes missing evidence from demonstrated late availability", () => {
  const relative = "docs/data.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertEvidenceStates = (text) => {
    const example = contentUnderHeading(text, relative, "Worked decision: revised market history");
    const statements = [...walkMarkdown(example)]
      .filter((token) => ["paragraph", "tableRow"].includes(token.type))
      .map((token) => markdownText(token).replace(/\s+/gu, " ").trim());
    const unknown = statements.find((statement) =>
      statement.includes("First availability is unknown"),
    );
    const late = statements.find((statement) => statement.includes("First availability is later"));
    assert.ok(unknown, "unknown availability must remain distinct");
    assert.match(unknown, /remains unproved/u);
    assert.match(unknown, /snapshot.*correction history/u);
    assert.ok(late, "demonstrated late availability must remain distinct");
    assert.match(late, /invalid for that earlier decision/u);
    assert.match(late, /Replace or exclude/u);
    assert.match(late, /rerun affected results before requesting admission/u);
    assert.notEqual(unknown, late, "evidence states need separate explanations");
  };
  assertEvidenceStates(source);
  assertEvidenceStates(`### Worked decision: revised market history

- **First availability is unknown.** Point-in-time validity remains unproved.
  Obtain the earlier snapshot and correction history before requesting admission.
- **First availability is later than the simulated decision.** That earlier
  use is invalid for that earlier decision. Replace or exclude affected values
  and rerun affected results before requesting admission.
`);
  assertEvidenceStates(`### Worked decision: revised market history

| Evidence | Claim | Action |
| --- | --- | --- |
| First availability is unknown. | Point-in-time validity remains unproved. | Obtain the earlier snapshot and correction history. |
| First availability is later than the simulated decision. | Using that value is invalid for that earlier decision. | Replace or exclude affected values and rerun affected results before requesting admission. |
`);
  assert.throws(
    () =>
      assertEvidenceStates(source.replace("invalid for that earlier decision", "remains unproved")),
    /invalid for that earlier decision/u,
  );
  assert.throws(
    () => assertEvidenceStates(source.replace("rerun affected results", "request use")),
    /rerun affected results before requesting admission/u,
  );
  assert.throws(
    () =>
      assertEvidenceStates(
        source.replace("First availability is unknown", "First availability is later"),
      ),
    /unknown availability/u,
  );
});

test("bounded exploration requires permission even while meaning, quality, or timing remains unknown", () => {
  const relative = "docs/data.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertExplorationBoundary = (text) => {
    const section = contentUnderHeading(text, relative, "Answer Six Questions First");
    const guidance = [...walkMarkdown(section)]
      .filter((token) => token.type === "paragraph")
      .map((token) => markdownText(token))
      .join(" ")
      .replace(/\s+/gu, " ");
    assert.match(
      guidance,
      /unknown meaning, quality, or historical availability may be explored within an authorized scope/u,
    );
    assert.match(
      guidance,
      /requires permission for acquisition, processing, and the intended use/u,
    );
    assert.match(guidance, /Agents must also stay within their delegated scope/u);
    assert.match(
      guidance,
      /permission is missing or unclear, stop the affected action and escalate to the authorized decision owner/u,
    );
    assert.match(
      guidance,
      /Neither may enter a shared, production, or decision path until its meaning, quality, permissions, and reproducibility are qualified for that use/u,
    );
  };
  assertExplorationBoundary(source);
  const clausePattern = (text) =>
    new RegExp(text.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replaceAll(" ", "\\s+"), "u");
  for (const clause of [
    "Exploration still requires permission for acquisition, processing, and the intended use.",
    "Agents must also stay within their delegated scope.",
    "If permission is missing or unclear, stop the affected action and escalate to the authorized decision owner.",
  ]) {
    const missing = source.replace(clausePattern(clause), "");
    assert.notEqual(missing, source, "the refusal must exercise its missing duty");
    assert.throws(() => assertExplorationBoundary(missing));
  }
});

test("data use preserves applicable judgments and keeps feedback review with work evidence", () => {
  const relative = "docs/data.md";
  const source = readFileSync(path.join(root, relative), "utf8");
  const assertUseJudgments = (text) => {
    const section = contentUnderHeading(text, relative, "Move from a Signal to Controlled Use");
    const opening = [...walkMarkdown(section)].find((token) => token.type === "paragraph");
    assert.match(markdownText(opening), /preserve every applicable judgment/u);
    const list = section.find((token) => token.type === "listUnordered");
    assert.ok(list, "the six use judgments must remain separately readable");
    const items = list.children.filter((token) => token.type === "content");
    assert.deepEqual(
      items.map((token) => markdownText(token).split(":")[0]),
      ["Opportunity", "Exploration", "Reproduction", "Production", "Admission", "Feedback"],
    );
    const feedback = items.at(-1);
    assert.match(
      markdownText(feedback).replace(/\s+/gu, " "),
      /Keep the review result and any changed judgment/u,
    );
    assert.ok(
      markdownLinkDestinations(feedback.text).includes(
        "deliver.md#evidence-sets-the-limit-of-the-claim",
      ),
      "feedback review must use the existing work evidence, not a new record store",
    );
  };
  assertUseJudgments(source);
  assert.throws(
    () => assertUseJudgments(source.replace("preserve every applicable judgment", "move quickly")),
    /preserve every applicable judgment/u,
  );
  const withoutReview = source.replace(
    /Keep the review result and any changed judgment/u,
    "Continue",
  );
  assert.throws(
    () =>
      assertUseJudgments(`${withoutReview}\nKeep the review result and any changed judgment.\n`),
    /Keep the review result and any changed judgment/u,
  );
});
