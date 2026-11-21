## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted jobs' Mise release
and GitLab's Linux bootstrap from the project's package registry, and ETHOS's common model generates
both pipelines from it. GitLab's macOS and Windows runners use the Mise their guests provide.

Mise 2026.11.9 and 2026.11.10 add task lock pools, tag-based task dependencies, `mise lock --check`
and an `enable_backends` allowlist, and change two behaviours: `mise lock --dry-run` resolves every
tool, and a `[tool_config] locked = true` lockfile is left alone after installs. Neither touches the
locked install of `http:ethos` that the hosted jobs run, and an existing lockfile keeps its version
until `mise lock --upgrade`. The fixes include jdx/mise#15838: `mise x -- <cmd>` runs the pinned
tool's binary again when the inherited `PATH` already contains that tool.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.10 in every hosted job that bootstraps Mise.
- Keep the Mise 2026.11.8 package available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.

## Decisions

- Stage Mise 2026.11.10 in the project's GitLab package registry before the hosted runs, as
  `refresh-ci-mise-2026-11-7` staged 2026.11.7: upload only files whose digests equal the release's
  published asset digests and `SHASUMS256.txt`, and read both back. The pinned installer installs
  the staged archive, so no job reaches GitHub for Mise.
- Take this move as a second Change of the lane that binds ETHOS 0.2.0-beta.11, so that one proof
  and one pair of hosted runs qualify both.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.10 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify
  it before landing, and the 2026.11.8 package stays available to roll back.

## Migration Plan

Stage the Mise package, move the Mise parameters, generate both pipelines, prove the archived head
and qualify it on GitHub and on GitLab's Linux, macOS and Windows ARM64 jobs. To roll back, restore
the 2026.11.8 parameters and the installer pin.
