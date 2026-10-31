## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.21 today. `.config/ci/verification.toml` holds
the hosted jobs' Mise release, GitLab's Linux bootstrap from the project's package registry and
GitLab's Linux image, and ETHOS's common model generates both pipelines from it.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.22, installed by Mise 2026.10.24 in every hosted job that bootstraps Mise.
- Keep the 0.2.0-alpha.21 runtime and the Mise 2026.10.17 package available as rollbacks until the
  landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- The Mise that GitLab's macOS and Windows runners provide, which their guests own.
- Qualifying GitLab's Windows ARM64 jobs, which `rebind-ethos-alpha-21` withdrew under DR-0005
  until the ETHOS follow-up for their launcher lands.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- 0.2.0-alpha.22 lowers the per-file ceilings from 512 to 500: effective lines for each tracked
  Python file and lines that are not blank for each current authored Markdown document. This
  repository tracks no Python, and its largest current document, `CONTRIBUTING.md`, has 311 such
  lines, so the repository declares no `[paradigm.size]` value. The release requires no Mise floor
  of its adopters; Mise 2026.10.24 follows from the latest-stable direction.
- Stage Mise 2026.10.24 in the project's GitLab package registry before the hosted run, uploading
  only files whose digests equal the release's published asset digests and `SHASUMS256.txt`, and
  read both back. GitLab's Linux bootstrap keeps its shape: the pinned installer installs the staged
  archive, so no job reaches GitHub for Mise.
- Keep `min_version` at 2026.10.14. The floor states the oldest Mise that reads this
  configuration, not the release in use: the first proposal pipeline raised it to 2026.10.24, and
  GitLab's macOS runner, whose guest provides Mise 2026.10.15, refused to start (pipeline 13500).
  The guests' Mise moves to the latest release through their owner.
- Keep GitLab's Linux image at its reviewed digest. The runners admit only listed images, and the
  current `node:26-trixie` index digest was refused as a disallowed image in pipeline 13500. The
  image moves in a follow-up Change once the runners' owner admits the current digest.
- Bind through the locked 0.2.0-alpha.22 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.21 fails under 0.2.0-alpha.22] → The 0.2.0-alpha.22 gates
  run against the repository before the bind and the full proof runs at the archived head before
  landing; a failure is repaired at its owner, or the rebind rolls back.
- [Mise 2026.10.24 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify
  it before landing; the 2026.10.17 package stays available to roll back.
- [The GitLab Windows ARM64 runners still exit 6 at the launcher start] → The acceptance stays
  withdrawn, and GitLab keeps the job traces for the ETHOS follow-up.
- [The release ships supply with advisories that no stable upstream release fixes yet] → The
  release notes record them, and the owner's standing direction accepts them until a fixed stable
  release exists.

## Migration Plan

Stage the Mise package, copy the declaration, lock it, install the locked supply, bind the runtime,
move the Mise parameters, generate both pipelines, prove the archived head and qualify it on GitHub
and GitLab's Linux and macOS jobs. To roll back, restore the 0.2.0-alpha.21 declaration, lock and
CI parameters and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.21 runtime path>`.
