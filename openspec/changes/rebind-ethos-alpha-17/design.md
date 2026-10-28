## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.15 today; 0.2.0-alpha.16 was never declared
here.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.17.
- Keep the 0.2.0-alpha.15 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any other locked tool, gate, check or guideline.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` first, so the
  URLs and checksums keep one published source.
- Move directly from 0.2.0-alpha.15. Binding a release over a predecessor more than one release
  older works: on a clone of `ddwg-introduction-film`, 0.2.0-alpha.17 bound over
  0.2.0-alpha.13 with it as the rollback, then rolled back and bound again, each time with status
  ready. 0.2.0-alpha.16 and 0.2.0-alpha.17 list only fixes and a runtime that ships npm 12.2.1;
  neither changes a contract that this repository relies on.
- Bind through the locked 0.2.0-alpha.17 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.15 fails under 0.2.0-alpha.17] → The full proof runs at the
  lane head before archive and landing; a failure is repaired at its owner, or the rebind rolls
  back.
- [A hosted platform cannot install or run the new release] → The proposal's jobs run on the
  archived head before the landing, and the landing waits for them on that exact commit.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime and prove the lane head.
To roll back, restore the 0.2.0-alpha.15 declaration and lock and bind the retained runtime with
`hook install --runtime <0.2.0-alpha.15 runtime path> --authorize`.
