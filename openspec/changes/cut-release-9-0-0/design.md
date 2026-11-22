## Context

See proposal.md for why the edition is cut now. The release contract in
`docs/governance/change-and-release.md` keeps notes under `Unreleased` until the cut, allows one
untagged dated heading while the release-cut source is committed and proved, and requires the
selected Forge's source jobs at that exact commit before the annotated tag is signed. Installed
ETHOS admits the tag only when it matches committed `VERSION` and the Changelog has that version's
entry.

## Goals / Non-Goals

**Goals:**

- One dated `[9.0.0]` entry that a member can read as the edition's notes, with its incompatible
  duties first.

**Non-Goals:**

- Changing guidance, specifications or checks.
- Rewriting earlier editions' notes.

## Decisions

- **Keep the notes as written.** Every entry under `Unreleased` was checked against the repository
  on 2026-11-22 (the CI image, Mise 2026.11.11, ETHOS 0.2.0-beta.11, the 24-hour release age, the
  pinned workflow action and 14-day artifacts) and is true of the edition; none is consolidated or
  corrected. - **Rewrap, not reword.** One line of the first entry runs to 141 columns; it is
  wrapped again at 100 columns with its words unchanged.

## Risks / Trade-offs

- [A note becomes stale between this cut and the tag] → The tag follows the landed source of this
  Change only; any later change opens a new `Unreleased`.
