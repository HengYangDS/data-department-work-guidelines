## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.17 today.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.18.
- Keep the 0.2.0-alpha.17 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any other locked tool, gate, check or guideline.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` first, so the
  URLs and checksums keep one published source.
- 0.2.0-alpha.18 lists fixes, the removal of commands and documents this repository does not use,
  and one proof per Change; it changes no contract this repository relies on. Its reference
  admission now accepts the executables that the local publication commands in
  `.ethos/release.toml` invoke, which this repository declares.
- Bind through the locked 0.2.0-alpha.18 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.17 fails under 0.2.0-alpha.18] → The full proof runs at the
  archived head before landing; a failure is repaired at its owner, or the rebind rolls back.
- [A hosted platform cannot install or run the new release] → The proposal's jobs run on the
  archived head before the landing, and the landing waits for them on that exact commit.
- [The release ships uv 0.13.5, whose embedded rustls 0.23.45 carries four advisories without a
  uv fix yet] → The release notes record them; this repository's own audit covers its own locks.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime and prove the archived
head. To roll back, restore the 0.2.0-alpha.17 declaration and lock and bind the retained runtime
with `hook install --runtime <0.2.0-alpha.17 runtime path> --authorize`.
