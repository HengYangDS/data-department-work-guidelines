# Proposal

## Why

The current repository asks the team to read one coherent set of guidelines, yet
its tracked reader guidance, contributor instructions, decisions, history, and
parts of OpenSpec and validation fixtures still mix Chinese and English. Its
changelog and one decision also describe an earlier release state as current.
Readers should not have to translate the rule they are asked to follow or infer
publication from stale prose.

## What Changes

- Publish all retained tracked prose in English, including current OpenSpec
  artifacts, archived OpenSpec text, decision records, changelog entries, code
  comments, test fixtures, and Mermaid labels. Preserve identifiers, links,
  historical dates, and the meaning of past decisions.
- Treat translations of archived artifacts as new editorial changes to their
  present repository representation. Keep the original Git objects available; do
  not claim that earlier work used a later lifecycle or that translation creates
  new historical proof.
- Make the documentation quality check reject non-English CJK text in tracked
  and candidate text files. Keep the guard small and avoid a new language
  framework or a second OpenSpec lifecycle.
- Reconcile reader-facing version and publication wording with independently
  observed local and Forge state. Correct the accepted specification's obsolete
  `submit/*` reference without broadening the permitted remote ref set.
- Keep local verification, GitLab publication, GitHub publication, and actual
  team use as separate claims.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: require a single English language for tracked repository text and
  make the existing documentation gate detect residual CJK prose.
- `repository-governance`: align the published ref contract with the already
  adopted `proposal/*` namespace and keep release claims tied to observed refs.

## Impact

The Change touches the root and topic guidance, governance and decision pages,
current and archived OpenSpec prose, the changelog, and the existing quality
scripts and tests. It does not rewrite Git history, grant an archive current
proof, change a historical decision's outcome, or assert team adoption. ETHOS
product publication behavior, Forge account protection, credentials, foreign
Work Lanes, and real team tasks remain separately owned and separately verified.
