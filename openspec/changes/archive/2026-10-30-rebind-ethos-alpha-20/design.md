## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.19 today.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.20.
- Keep the 0.2.0-alpha.19 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, generated pipeline or runner declaration.
- Working around the missing Windows ARM64 archive in this repository.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` first, so the
  URLs and checksums keep one published source.
- 0.2.0-alpha.20 changes no contract this repository relies on. Its notes fix how prewrite decides
  which references a repository owns: authored command names, terms in prose, package-relative
  imports, first-party modules and `pixi` environments, with every refused reference reported at
  once. The acceptance's full host proof on this repository's clone passed with no non-passing gate.
- Bind through the locked 0.2.0-alpha.20 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.19 fails under 0.2.0-alpha.20] → The full proof runs at the
  archived head before landing; a failure is repaired at its owner, or the rebind rolls back.
- [A hosted platform cannot install or run the new release] → The proposal's jobs run on the
  archived head before the landing, and the landing waits for them on that exact commit.
- [The GitLab Windows ARM64 job keeps failing at ETHOS supply] → The release publishes no archive
  for that platform. The job and its runner declaration stay unchanged, and ETHOS delivers the
  platform in a later release.
- [The release ships `uv` 0.13.5, whose embedded `rustls` 0.23.45 carries four advisories, and npm
  12.2.1, whose bundled packages carry six, none with an upstream fix yet] → Its supply equals
  0.2.0-alpha.19's, and the release notes record them.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime and prove the archived
head. To roll back, restore the 0.2.0-alpha.19 declaration and lock and bind the retained runtime
with its own console's `hook install --runtime <0.2.0-alpha.19 runtime path>`.
