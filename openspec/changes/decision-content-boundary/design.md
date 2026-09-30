# Design

## Context

The signed accepted baseline is `983c8c43`, with v6.1.0 already released on both
Forges. Its full source checks pass. Read-only adversarial probes nevertheless
show that the existing line scanner accepts a block-quoted Bash fence, a
PowerShell fence, and checked task items. A normal evidence link passes and an
inline ETHOS invocation fails; these positive and negative behaviors must remain.

## Goals / Non-Goals

**Goals:** reject actual execution and progress nodes regardless of Markdown
nesting; retain meaningful rationale and evidence links; bind heading and title
identity to the parsed document; use one existing parser and bounded tests.

**Non-goals:** infer whether every natural-language sentence is durable, parse a
second shell language, add dependencies, modify department rules or production,
replace lifecycle admission, or certify team adoption.

## Decisions

### Parse the carrier once, then inspect its meaning-bearing nodes

Use the installed `@textlint/textlint-plugin-markdown` processor already used by
prose checks. Its syntax tree recognizes quote/list nesting, fenced and indented
code, headings, inline code, and GFM task markers. The DR check visits those
nodes instead of reconstructing Markdown with regular expressions.

Require one matching top-level decision title and the five ordered top-level
level-two sections. Heading-like text inside a code block cannot supply a
section. Task markers are progress, not alternatives. Recognized terminal code
blocks and command invocations remain execution content, even under wrappers.
The existing bounded invocation classifier applies to parsed content, not link
targets. It is not a complete shell interpreter or semantic prose judge.

Opaque HTML nodes cannot be reliably inspected by this Markdown boundary. Reject
those nodes except the validated initial registry comment. Markdown links,
automatic links, emphasis, block quotes, ordinary lists and decision tables remain
available; these useful reader structures do not require an HTML escape hatch.

### Preserve the authority boundary and published history

The two default proof gates remain unchanged. This is repository-specific DR
content validation, not Change scope, lifecycle or proof authority. Natural
language still needs review against the enduring choice and revisit trigger.
The official Change owns implementation and delivery progress; no new DR is
needed for this compatible repair.

Patch v6.1.1 corrects acceptance of content already prohibited by the public
contract. It introduces no new department duty, dependency or contributor
command. Keep v6.1.0 immutable. Rebuild one source-pinned bundle for the new
edition from the unchanged native supply, prove the exact release cut, and
observe each source and offline platform matrix independently.

## Risks / Trade-offs

- A blanket syntax ban rejects useful rationale: keep explicit positive cases
  for links, terminology, decision lists/tables, and non-executable examples.
- A parser wrapper hides an invalid node: test quote/list combinations,
  longer fences, indentation, inline code and HTML at the actual public entry.
- A validator appears to judge prose: retain that editorial responsibility and
  disclose the machine boundary rather than classify sentences by keywords.
- A release changes existing bytes: preserve published objects; bind the patch
  bundle, tag, source and both Forge downloads to their actual identities.

## Migration Plan

1. Add genuine failing regressions to the current boundary owner.
2. Replace only the line-level Markdown reconstruction with the locked parser;
   preserve the decision identity and meaningful positive examples.
3. Run the full verifier and official OpenSpec, then prove the signed source.
4. Complete patch delivery, observed offline use and independent downloads.
5. Archive officially, prove its new source, observe final refs/CI, and retire
   only this absorbed owned Work Lane after producer custody is verified.
