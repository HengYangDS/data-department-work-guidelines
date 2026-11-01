## Context

See proposal.md for why the edition is cut now. The release contract in
`docs/governance/README.md` keeps notes under `Unreleased` until the cut, allows
one untagged dated heading while the release-cut source is committed and
proved, and requires the selected Forge's source jobs at that exact commit
before the annotated tag is signed.

## Goals / Non-Goals

**Goals:**

- One dated `[8.0.0]` entry that a member can read as the edition's notes.

**Non-Goals:**

- Changing guidance, specifications or checks.
- Rewriting earlier editions' notes.

## Decisions

- **One entry for the supply chain.** Nine entries each moved ETHOS one
  pre-release forward. For a reader of 8.0.0 only the result and the effects
  that reached this repository matter: the 500-line ceilings, Windows ARM64
  installation, the shorter Windows runtime path and UTF-8 text. One entry
  keeps those and drops the intermediate rollbacks, which no reader of the
  edition can select.
- **Correct stale notes before the cut.** The note that GitHub uses Mise
  2026.10.19 and GitLab 2026.10.17, and the note that GitLab's Windows ARM64 jobs
  still wait, were true when written; both Forges now run 2026.10.24 and those
  jobs run the complete verifier. Published notes should state the edition as
  released.

## Risks / Trade-offs

- [Consolidation hides an intermediate step] → Each step's commit and archived
  Change remain in history; the entry names the first and last supply.
