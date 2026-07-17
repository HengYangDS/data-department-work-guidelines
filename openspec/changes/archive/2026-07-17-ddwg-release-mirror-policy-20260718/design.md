# DDWG accepted-to-release mirror policy design

## Context

`dev` is the accepted local root, `candidate/dev` receives proved work, and
`main` is release-facing. The current policy defaults to an independent release
branch, so accepted closeout advances only `dev`.

## Goals / Non-Goals

**Goals:** atomically fast-forward `dev` and `main` from a proved candidate
through the existing ETHOS closeout operation; retain a visible local-only
candidate boundary.

**Non-Goals:** direct protected-ref edits, remote publication, hosted CI, or
claiming that a local closeout has published either forge.

## Decisions

- Set `release_mirror = "accepted_ff"` in the tracked branch-role policy.
- Reuse ETHOS closeout's atomic ref update and proof carry rather than raw Git
  updates.
- Keep all provider policy separate: local policy permits only `dev`, `main`,
  and `submit/*` as publication candidates; `candidate/dev` remains local.

## Risks / Trade-offs

[A release ref may be ahead of accepted] -> closeout fails closed instead of
rewriting `main`.

[A remote may be unavailable] -> retain local closeout and record remote
projection as deferred; no local proof is presented as a remote publication.
