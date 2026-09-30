# Design

## Context

Accepted source `599904fa77e0b7581d49e6baa8471e1e5752458a` is v6.0.1. It has
seven normative topic owners and one portable Node quality entrypoint. Its
`prose` command invokes CSpell only. The original guideline's writing contract
requires precise terms, concrete expression, and removal of information-free
filler; spelling alone does not enforce those properties.

The existing semantic fidelity audits cover the exact former 1,240-line source
and its surviving duties. They are bounded editorial evidence, not machine
proof. Current `docs/evolve.md` retains the later-authorized monthly and
quarterly review floor. Earlier archived statements rejecting all calendar
reviews are historical context, not current instructions.

## Goals / Non-Goals

**Goals:** Enforce objective English writing defects with upstream tools; use one
configuration and the existing source inventory; keep facts, uncertainty, duties,
commands, and quoted examples intact; verify complete portable and offline use.

**Non-goals:** A grammar oracle, an AI detector, automatic prose rewriting, a new
rule tree, mandatory document lengths, artificial adoption, a browser or service
requirement, or an adopter-owned substitute for ETHOS. No mobile work is added.

## Decisions

### Use the native textlint kernel, not a second command plane

Use `@textlint/kernel` and its upstream Markdown plugin through their public API.
The full textlint CLI also installs an MCP server and configuration discovery;
neither is needed by the existing verifier. The kernel has no network or process
service requirement. Standard rule options live in one JSON configuration under
`.config/tools`; no parent config, host path, cache, or inline suppression changes
that selected policy. CSpell retains spelling. Prettier retains layout.

The upstream textlint `write-good` wrapper omits headings, emphasis, and quoted
paragraphs, as the distinguishing tests show. Do not keep that weak scope
or add a second implementation. Call the same upstream `write-good` analyzer
through one kernel rule and its maintained `StringSource` source map utility.
That rule reports native repeated-word findings for headings, paragraphs, and
individual table cells, including nested Markdown emphasis, and masks inline
code without changing
source. Native `stop-words` covers wordy expressions and clichés across prose.
No repository regular expression reimplements English or Markdown parsing.

Do not turn passive voice, adverbs, or expressions of uncertainty into blanket
errors: they can carry exact responsibility, scope, or
confidence in normative prose. Their presence is not proof of poor writing.
The terminology rule uses its maintained defaults plus project vocabulary.
Keep the standard Markdown term “blank line” instead of imposing the package
maintainer's “empty line” preference. The stop-word dictionary does not reject
“authority to,” “subject to,” or “feasible”: those terms carry permission,
subordination, and option viability here. These are explicit rule-wide semantic
boundaries, not per-file waivers; tests preserve their meaning.
Code spans, fenced code, URLs, and metadata are syntax, not editable prose.
Raw HTML and image attributes are outside the native prose scope; do not claim
that checking a Markdown file proves its embedded HTML text has been checked.
Distinct table cells remain distinct inputs, so adjacent columns cannot create
a false repeated-word finding.
Quoted reader examples remain checked where the native parser exposes prose.

### Fix the diagnosed sentence without changing its obligation

Read each native finding in its full paragraph and identify the intended meaning
before changing it. Do not globally replace words or rewrite archived Changes.
Compare any normative edit against the exact earlier duty and representative
counterexample; retain explicit uncertainty and must/may boundaries. A style
pass proves only the selected rules. Human review still owns fidelity, clarity,
judgment, and reader interpretation.

### Prove the actual entrypoint and the shipped supply

The first real bundle build rejected five upstream packages because their
license notices are in native readme License sections rather than separate
files. Preserve those package bytes and their declared license; use the same
native Markdown parser to recognize an explicit matching notice, not an
incidental token, code example, or empty section. Accept the npm package's
legacy `licenses` declaration when present. Do not invent a copyright holder,
relicense upstream code, waive the check, or make cold installation depend on
the parser before its locked packages exist. The original producer supplies
the notice; this repository validates its presence, not legal advice.

Tests invoke the actual kernel and rules on valid prose, jargon variants, filler,
repeated words, code, URLs, and quoted examples. Both `prose` and full verification
consume that same owner; the existing two default ETHOS gates remain unchanged.
Stage the related files together, verify signatures and audit, rebuild the
source-bound bundle, and run a cold offline install with tracked-file hash
equality. Publish v6.1.0 only after exact source checks pass on both Forges.
Then compare real release downloads and require every declared offline host job.

The first GitLab source matrix passed Linux and macOS but the Windows review
job failed at temporary-stage removal. Its exact `EPERM, Permission denied`
message matches Node 26's native recursive removal, not directory creation;
the pinned archive is writable and the path is below the classic Windows
limit. GitHub's Windows run passed on the same source. Use native `rmSync`
bounded retries on only the freshly owned stage; do not ignore persistent
errors, change permissions, or rerun the entire pipeline without a changed
cause. A regression proves the actual cleanup options and target confinement.
Fresh Windows execution must establish the repair; a local mock cannot prove
an operating-system lock has cleared.

## Risks / Trade-offs

- Native language rules can produce a false positive: test the reported syntax
  and revise the selected rule policy only for a demonstrable semantic conflict,
  never by hiding a document or adding a one-off suppression.
- New packages enlarge supply: use latest official stable versions, retain
  upstream compatibility constraints, verify signatures and vulnerabilities,
  and include all selected packages and licenses in the existing offline bundle.
- A compatible quality requirement adds contributor work: v6.1.0 is a minor
  release, not a new department obligation. The writing contract already exists.
- Shared ETHOS policy is still evolving: consume only its accepted installed
  contract. These native domain checks do not prove new ETHOS product parity.

## Migration Plan

Use this one official Change and its leased Work Lane. Add the native rule
configuration and tests before implementing the existing verifier integration.
Correct confirmed current prose findings, qualify source and actual offline use,
then publish one signed minor release independently to both Forges. Record
observed results in `tasks.md`. After delivery, archive officially, prove the new
archive identity, publish it, and retire this absorbed lane only after evidence
custody and exact cleanup checks. Do not rewrite v6.0.1.
