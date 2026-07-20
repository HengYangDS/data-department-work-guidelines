# Design

## Context

ETHOS distinguishes a historical logical Change ID from the date prefix that
records an archive transition. A valid archive name has exactly one archive date
prefix and a date-free logical identifier. DDWG's six July 18 archive paths have
an additional date suffix inherited from their former active Change names. The
repository audit correctly fails those paths even though their content remains
historical.

## Goals / Non-Goals

**Goals:**

- Make each affected directory satisfy the canonical archive identity rule.
- Retain every historical document and payload byte-for-byte except a factual
  repository path that names its archive carrier.
- Keep the active repair Change narrowly scoped and verifiable before it is
  itself archived.

**Non-Goals:**

- Rewrite historical commitments, task results, external run identifiers, or
  source-history timestamps.
- Treat a path rename as proof of current acceptance, remote publication, or
  hosted CI execution.

## Decisions

### Canonicalize the carrier path, not the historical record

Each directory is moved from
`2026-07-18-<logical-id>-YYYYMMDD` to
`2026-07-18-<logical-id>`. The recorded July 18 archive date remains the first
prefix. The pre-existing logical IDs remain in claims, Chronicle prose, evidence
IDs, and historical test strings because they identify what was observed then;
they are not redefined as new current identifiers.

### Limit edits to location references

Only `carriers.openspec` and Chronicle sentences that state the moved archive
location are updated. Evidence digests are refreshed only for those precise
Chronicle path-reference edits. The migration uses `git mv`, maintaining file
history and preventing duplicate archive carriers.

### Test the fixed invariant

The material-scope regression validates the exact six canonical archive paths,
confirms their former noncanonical paths are absent, and verifies that the active
repair Change covers its relevant material surfaces. This turns the specific
repository-wide blocker into a local, repeatable contract.

### Restore the typed profile as one controlled prerequisite

The current typed profile is restored verbatim from the already accepted DDWG
adopter contract. It does not alter repository rules; it makes the existing
normative `guidelines.md` file and material-path declaration legible to the
current ETHOS runner so the archive repair can be verified through the ordinary
command plane.

## Risks / Trade-offs

- **Path-only changes may be mistaken for fresh archive proof** -> the proposal,
  claim, and Chronicle distinguish identity normalization from re-archive or
  current proof.
- **A broad textual replacement could corrupt historical facts** -> edits are
  constrained to known carrier-location strings and a list of six paths.
- **Duplicate archive paths could create ambiguity** -> old paths are moved, not
  copied; the regression requires their absence.

## Migration Plan

1. Bootstrap and validate this Change-local ETHOS scope companion.
2. Apply the typed profile and `git mv` the six archive carriers.
3. Update only factual carrier-location references and add the identity test.
4. Run strict OpenSpec, lifecycle, claims, documentation, and exact-HEAD proof.
5. Archive this completed repair through the official command, rerun proof on
   the archive result, and only then resume the separately scoped runner Change.
