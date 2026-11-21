## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted jobs' Mise release
and GitLab's Linux bootstrap from the project's package registry, and ETHOS's common model generates
both pipelines from it. GitLab's macOS and Windows runners use the Mise their guests provide.

Mise 2026.11.11's release notes add opt-in features (MacPorts and self-update in `mise bootstrap`,
`version_order = "published_at"`, `exclude-newer = false` per PyPI index, `if_pool` task locks) and
change no default that the hosted jobs use. Of its fixes, the one nearest these jobs verifies
`http:` tools that declare a `checksum_url` and records that checksum in `mise.lock`; the
`http:ethos` table declares an inline `checksum` for each platform instead, so the locked install
and the lock are not affected.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.11 in every hosted job that bootstraps Mise.
- Keep the Mise 2026.11.10 package available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.

## Decisions

- Stage Mise 2026.11.11 in the project's GitLab package registry before the hosted runs, as
  `move-hosted-mise-2026-11-10` staged 2026.11.10: upload only files whose digests equal the
  release's published asset digests and `SHASUMS256.txt`, and read both back. The pinned installer
  installs the staged archive, so no job reaches GitHub for Mise.
- Take this move in the repository's next lane, or in a lane of its own when none is open, so that
  one proof and one pair of hosted runs qualify it.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.11 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify
  it before landing, and the 2026.11.10 package stays available to roll back.

## Migration Plan

Stage the Mise package, move the Mise parameters, generate both pipelines, prove the archived head
and qualify it on GitHub and on GitLab's Linux, macOS and Windows ARM64 jobs. To roll back, restore
the 2026.11.10 parameters and the installer pin.
