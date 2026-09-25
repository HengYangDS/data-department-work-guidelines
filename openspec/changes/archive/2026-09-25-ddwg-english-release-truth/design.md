# Design

## Context

The repository is a small documentation product with separate semantic owners
for team rules, decisions, repository governance, OpenSpec change intent, and
quality checks. Twenty-three current tracked files contain Han characters; one
is an archived OpenSpec design. The current OpenSpec configuration and accepted
specs are already in English, but the workspace entry and much of the team
reading path are not. The accepted publication spec still contains a retired
`submit/*` ref, and a decision retains a stale active-Change sentence.

## Goals and Non-Goals

- Make the entire retained tracked snapshot readable in English without changing
  the meaning of historical decisions or policy requirements.
- Detect future CJK text in tracked and unignored candidate text through the
  existing documentation quality entrypoint.
- Keep the product-owned OpenSpec lifecycle, Work Lane admission, proof, and
  publication authority unchanged.
- Correct current status wording only from fresh local and Forge observations.
- Do not rewrite Git history, fabricate retrospective lifecycle evidence, create
  a separate history store, or treat a translated archive as current proof.
- Do not repair ETHOS product publication behavior inside this repository.

## Decisions

### Translate at the semantic owner

The root entry remains a task router; `docs/` remains the one current rule set.
Each DR retains its stable ID, metadata, five decision sections, and durable
rationale. Current OpenSpec specs stay normative; Change artifacts retain their
original scope and temporal meaning. Link targets, command names, paths, dates,
and version identifiers remain literal where they carry identity. Historical
Chinese prose in the current tracked archive is translated in place only as an
editorial update; its original Git object is still the record of what was filed
then. No prose will say the earlier artifact was originally English or was
certified by today's process.

### Add a narrow language regression to the existing gate

Extend the current text-layout validation rather than introduce another script
or framework. It will inspect tracked and unignored candidate text files, report
CJK characters by path and line, and exclude only actual binary files. Tests
will cover both a clean English fixture and representative Han/Kana/Hangul
violations. Editorial review remains necessary for meaning, tone, navigation,
and completeness; a character scan cannot prove good English.

### Separate release state from release policy

Keep the exact ref policy (`dev`, `main`, `proposal/*`) and the local/Forge/use
claim boundaries. Remove the obsolete `submit/*` assertion in the accepted spec
through an official delta. Determine the changelog's version heading from fresh
local and remote observations. If a Forge cannot be observed, say so; source
acceptance and a configured remote are not substitutes. ETHOS product fallback
and signing-preflight behavior require their own product Change and proof, not a
repository-local bypass.

## Risks and Trade-offs

- Translation may subtly change a rule. Review each topic against its prior text
  and preserve its decision owner, limits, and links.
- An edited archive loses byte equality with its first archived commit. The
  earlier Git object is retained, and the new commit records the translation;
  present-day proof must be tied to the new object.
- A CJK character check is intentionally narrower than natural-language
  detection. It catches the current mixed-language failure without rejecting
  normal English punctuation or claiming semantic proof.
- Tooling and remote state can drift. Pin the repository OpenSpec version for
  validation and refresh each external observation at acceptance.

## Migration Plan

1. Establish the leased Work Lane and active official Change. Inventory tracked
   text and baseline local and remote refs before editing.
2. Add a failing language fixture and the minimal existing-gate repair.
3. Translate the current reader path, governance, DRs, changelog, current and
   archived OpenSpec text, and script/test prose. Keep identifiers intact.
4. Run formatting, lint, offline links, Mermaid rendering, rollout, boundary,
   official OpenSpec, ETHOS planning, and exact-HEAD proof. Review the diff for
   changed policy meaning and remaining non-English text.
5. Complete governed local acceptance and independently observe each Forge
   at the accepted object. Once declared obligations are complete, archive the
   Change; then reprove and observe the new archive object separately. Keep
   team-use claims open until observations from real work exist.
