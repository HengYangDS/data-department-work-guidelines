# Post-archive documentation-proof reconciliation design

## Context

The official archive is intentionally immutable historical evidence. The
reconciliation Change is the only active carrier allowed to bind the new tree
state to current local proof.

## Goals / Non-Goals

**Goals:** preserve the archive, record a distinct proof claim, execute the
configured local gates, and land only the proved resulting head.

**Non-Goals:** modify archive content, assert remote publication, or broaden
scope to team adoption.

## Decisions

- Keep archive and reconciliation carriers distinct.
- Use configured local gates plus `ethos prove --execute --scope docs`.
- Treat any unavailable visual host as a reported proof limitation, not a pass.

## Risks / Trade-offs

[Evidence becomes stale after later edits] -> execute proof after all commits
and before candidate landing.
