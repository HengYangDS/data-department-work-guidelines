## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted jobs' Mise release
and GitLab's Linux bootstrap from the project's package registry, and ETHOS's common model generates
both pipelines from it. GitLab's macOS and Windows runners use the Mise their guests provide.

Mise 2026.11.6 and 2026.11.7 add task pickers, bootstrap-package and dot-file features, and fix,
among others, long cache keys in the `http:` backend, the GitHub fallback on 5xx errors, and
`mise lock` sending the forge token when it downloads an asset to compute a checksum. None of these
changes the locked install of `http:ethos` that the hosted jobs run, and an existing lockfile keeps
its version until `mise lock --upgrade`.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.7 in every hosted job that bootstraps Mise.
- Keep the Mise 2026.11.5 package available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.

## Decisions

- Stage Mise 2026.11.7 in the project's GitLab package registry before the hosted runs, as
  `refresh-ci-mise-2026-11-5` staged 2026.11.5: upload only files whose digests equal the release's
  published asset digests and `SHASUMS256.txt`, and read both back. The pinned installer installs
  the staged archive, so no job reaches GitHub for Mise.
- Keep `min_version` at 2026.10.14, which GitLab's macOS runner needs.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.7 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify it
  before landing, and the 2026.11.5 package stays available to roll back.

## Migration Plan

Stage the Mise package, move the Mise parameters, generate both pipelines, prove the archived head
and qualify it on GitHub and on GitLab's Linux, macOS and Windows ARM64 jobs. To roll back, restore
the 2026.11.5 parameters and the installer pin.
