## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted jobs' Mise
release and GitLab's Linux bootstrap from the project's package registry, and ETHOS's common model
generates both pipelines from it. GitLab's macOS and Windows runners use the Mise their guests
provide.

Mise 2026.11.1 introduced lockfile format 4 for new lockfiles only; an existing lockfile keeps its
revision until `mise lock --upgrade`. On 8 November, Mise 2026.10.25 and 2026.11.3 both read this
repository's version-3 lock unchanged. A `mise lock` of a version-3 lock for a `github:` tool also
kept version 3 under both, with byte-identical results.

Mise 2026.11.1 also verifies npm provenance by default. This repository declares no `npm:` tool, so
that change does not reach its jobs.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.4 in every hosted job that bootstraps Mise.
- Keep the Mise 2026.11.3 package available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration or the declared ETHOS release.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.
- GitLab's Linux image, which `refresh-gitlab-linux-image` refreshed on 8 November 2026.

## Decisions

- Stage Mise 2026.11.4 in the project's GitLab package registry before the hosted runs, as
  `refresh-ci-mise-2026-11-3` staged 2026.11.3: upload only files whose digests equal the
  release's published asset digests and `SHASUMS256.txt`, and read both back. The pinned
  installer installs the staged archive, so no job reaches GitHub for Mise.
- Keep `min_version` at 2026.10.14. A higher floor stopped GitLab's macOS runner, whose guest
  provides an older Mise, in pipeline 13500.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.4 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify
  it before landing, and the 2026.11.3 package stays available to roll back.

## Migration Plan

Stage the Mise package, move the Mise parameters, generate both pipelines, prove the archived head
and qualify it on GitHub and on GitLab's Linux, macOS and Windows ARM64 jobs. To roll back,
restore the 2026.11.3 parameters and the installer pin.
