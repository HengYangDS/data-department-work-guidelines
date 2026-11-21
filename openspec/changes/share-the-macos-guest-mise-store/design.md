## Context

See [proposal.md](proposal.md). ETHOS's CI model (`verification.cue`) unifies the pipeline-wide
`[gitlab.variables]` with each runner's own `variables`, so a variable declared for one runner
reaches only that runner's jobs; the model accepts a runner's `variables` since 0.2.0-beta.10. The
macOS runner is a shell executor on a persistent guest; the Linux runner starts a new container for
each job; the Windows runner is a shell executor whose shared profile refused the Mise shim copy (os
error 5), the reason for the job-local store.

## Goals / Non-Goals

**Goals:**

- Remove the repeated tool download from the macOS GitLab job without changing what it installs or
  verifies.

**Non-Goals:**

- The Linux job's install time, which needs a cache keyed by the lock and the platform (ETHOS's
  candidate `hosted-download-caches`).
- Changing `MISE_CONFIG_DIR`, `MISE_CEILING_PATHS` or `MISE_TRUSTED_CONFIG_PATHS`, which isolate
  every job from the runner account's own Mise configuration.
- Any gate, check, tool version or lock.

## Decisions

- Move only the three Windows-specific variables into the Windows runner's `variables`; keep the
  isolation variables pipeline-wide. A locked install verifies each artifact's checksum, so a tool
  already in the guest's store is used only when it matches the lock.

## Risks / Trade-offs

- [Two jobs on the macOS guest install into its store at once] → The film repositories share that
  store today without a failure in their read runs; a conflict shows in the proposal's hosted runs
  before landing.
- [The guest's store fills] → It holds the locked tools of the governed repositories; the guest
  owner prunes it with the other guest stores.

## Migration Plan

Measure the macOS job three times before the change, move the variables, generate the pipelines,
prove the archived head, measure the macOS job three times after, and land. To roll back, restore
the variables to `[gitlab.variables]`.
