## Context

See proposal.md for why the edition is cut now. The release contract in
`docs/governance/change-and-release.md` keeps notes under `Unreleased` until the cut, allows one
untagged dated heading while the release-cut source is committed and proved, and requires the
selected Forge's source jobs at that exact commit before the annotated tag is signed. Installed
ETHOS admits the tag only when it matches committed `VERSION` and the Changelog has that version's
entry.

## Goals / Non-Goals

**Goals:**

- One dated `[10.1.4]` entry that a member can read as the edition's notes.

**Non-Goals:**

- Changing guidance, specifications or checks.
- Rewriting earlier editions' notes.

## Decisions

- **A patch edition.** The notes change how grades and tiers are told and move the hosted job to a
  newer ETHOS and Mise; no duty, route or contributor command changes meaning, so SemVer gives a
  patch.
- **Keep the notes as written.** The three entries under `Unreleased` were checked against the
  landed source on 2026-11-28 (ETHOS 0.2.0-beta.12 in the Mise declaration, Mise 2026.11.14 in the
  hosted job, and the growth page) and are true of the edition.

## Risks / Trade-offs

- [A note becomes stale between this cut and the tag] → The tag follows the landed source of this
  Change only; any later change opens a new `Unreleased`.
