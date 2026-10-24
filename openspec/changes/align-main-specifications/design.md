## Context

The main specifications are the current contract for members, maintainers and
Agents. After `native-document-quality` closed on its delivered scope, some
requirements stayed unchanged because the work that would retire them waits on
withdrawn tasks. Parts of their text already describe checks, files and
commands that no longer exist, and two work-practice scenarios disagree with
the guidance.

## Goals / Non-Goals

**Goals:**

- Every corrected sentence states what the repository or the installed product
  does now, with the evidence recorded in this Change's review.
- Department duties follow the current reviewed guidance.

**Non-Goals:**

- Retiring requirements whose successor still waits on withdrawn tasks.
- Adding, strengthening or weakening a duty.

## Decisions

### Follow the later deliberate guidance for department duties

The meeting-decision scenario follows the 2026-10-21 guidance edit that
separated decision records from action deadlines, because that edit was a
deliberate decision about the duty. The local-metric scenario returns to its
meaning before the 2026-10-06 specification-only rewrite, because no guidance
has ever required the triple that the rewrite turned into a duty.

### Correct in place, keep scenario identities

Official OpenSpec replaces a modified requirement as a whole and refuses a
modified block that drops or renames a scenario. Each correction therefore
keeps every scenario title and rewrites only its false sentences.

### Replace the retired verifier requirements

Two verification requirements describe the retired repository verifier almost
throughout. Rewriting them in place would restate product rules or invent new
ones, so they leave, and one added requirement keeps their still-true
scenarios about retained repository commands.

### Claim only current enforcement

The retired repository CI validator refused defects that the installed common
model and the projection check do not all refuse. Corrected statements name
the check that refuses each defect today and drop claims that no check makes.
Restoring a lost refusal is new behavior for the common model's owner, not an
alignment of this repository's text.

### Edit Purpose directly

The official archive ignores a Purpose section in a delta for an existing
specification. The two Purpose paragraphs are edited directly in this Change's
admitted lane, alongside the deltas.

## Risks / Trade-offs

- [A corrected sentence could still be wrong] → Each correction cites current
  source or commits, and strict validation plus the repository proof run before
  archive.
- [Some requirements will later leave entirely] → Interim accuracy matters
  because their retirement waits on unavailable environments.
- [Some CI defects now compile without refusal] → The specifications stop
  claiming those refusals; the gap is reported to the installed model's owner.
