## Context

See [proposal.md](proposal.md). ETHOS's CI model unifies `[gitlab.variables]` with each runner's own
`variables`; the shared-store Change moved the three store variables to the Windows runner alone.

## Goals / Non-Goals

**Goals:**

- Every GitLab job keeps its Mise data and cache under its own execution root again, as the
  governance pages state.

**Non-Goals:**

- A faster macOS job. A shared store with a verification step (an empty data directory per job, or a
  check of each installed tree against the lock) is a later choice for the owner, with its trade-off
  stated in the governance pages.

## Decisions

- Restore the variables exactly as they stood before `share-the-macos-guest-mise-store`, so the
  change is a revert of that one configuration move and nothing else.

## Risks / Trade-offs

- [The macOS job is slower again] → Accepted: the shared store was trusted without verification.

## Migration Plan

Move the variables back, generate the pipelines, prove the archived head, read the hosted jobs, and
land. To roll back, apply `share-the-macos-guest-mise-store`'s configuration again.
