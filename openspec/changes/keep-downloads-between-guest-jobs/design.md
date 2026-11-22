## Context

See proposal.md. On 2026-11-22 DDWG reverted a shared guest Mise store for macOS
(`restore-job-local-mise-store`) because Mise does not check installed tools against the lock. Its
design named this option as the faster one that stays verifiable.

## Goals / Non-Goals

**Goals:**

- A guest job downloads the locked ETHOS release at most once per runner and release.
- Every job still installs from a download checked against the lockfile.

**Non-Goals:**

- Sharing installed tools, or any store between the review and protected runners.
- A change to ETHOS's common CI model.

## Decisions

- **Only the download cache moves.** The Mise CI documentation: "mise hashes each stored file against
  the checksum in the lockfile before it uses it", while "a restored tool cache is trusted as is".
- **Per-runner locations, read from the runners themselves.** The Linux jobs run in a fresh Docker
  container whose builds directory is new each time ("Initialized empty Git repository"); each
  Linux runner has its own persistent `/cache` volume. The macOS and Windows runners are shell
  executors whose builds directory persists ("Reinitialized existing Git repository") under a
  user per runner; `$CI_BUILDS_DIR/mise-cache` sits outside the cloned project, so Git's clean step
  does not remove it. Review and protected runners keep separate stores.

## Acceptance after landing

- The proposal pipeline shows each review runner type writing its store; the dev and main
  pipelines of one head show the protected runners downloading once and reusing it.

## Risks / Trade-offs

- [The stores grow by one ETHOS release (263 to 362 MB) per platform and release] → Acceptable on
  the guests' 256 GiB disks; prune a runner's store when it nears a release's size times ten.
- [A runner cannot write its location] → The first pipeline on each runner type shows it; the
  download then fails loudly instead of silently skipping the check.
