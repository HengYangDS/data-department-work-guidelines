## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted jobs' Mise release
and GitLab's Linux bootstrap from the project's package registry, and ETHOS's common model generates
both pipelines from it. GitLab's macOS and Windows runners use the Mise their guests provide.

Mise 2026.11.5 adds `mise dot files` and `status.show_env_ignore`, and fixes relative paths in
`mise dot` commands, a missing note when dot files are saved by hand, and 401 errors caused by stale
`~/.netrc` credentials. None of these reaches the bootstrap, the lock or the tools this repository
declares. An existing lockfile keeps its version until `mise lock --upgrade`.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.5 in every hosted job that bootstraps Mise.
- Keep the Mise 2026.11.4 package available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.

## Decisions

- Stage Mise 2026.11.5 in the project's GitLab package registry before the hosted runs, as
  `refresh-ci-mise-2026-11-4` staged 2026.11.4: upload only files whose digests equal the release's
  published asset digests and `SHASUMS256.txt`, and read both back. The pinned installer installs
  the staged archive, so no job reaches GitHub for Mise.
- Keep `min_version` at 2026.10.14. A higher floor stopped GitLab's macOS runner, whose guest
  provides an older Mise, in pipeline 13500.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.5 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify it
  before landing, and the 2026.11.4 package stays available to roll back.

## Migration Plan

Stage the Mise package, move the Mise parameters, generate both pipelines, prove the archived head
and qualify it on GitHub and on GitLab's Linux, macOS and Windows ARM64 jobs. To roll back, restore
the 2026.11.4 parameters and the installer pin.
