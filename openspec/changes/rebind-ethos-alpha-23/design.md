## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.22 today.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.23.
- Keep the 0.2.0-alpha.22 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image.
- Qualifying GitLab's Windows ARM64 jobs. ETHOS traced their exit status 6 to the length of the
  installed interpreter's path, 253 characters in job 62870, and plans the shorter path for
  0.2.0-alpha.24. Until then the jobs stay withdrawn under DR-0005.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- 0.2.0-alpha.23 bounds every authored file in a registered code language at 500 effective lines,
  not only Python, and renames the `[paradigm.size]` keys to `code_effective_lines` and
  `document_nonblank_lines`. This repository tracks no file in a registered code language and
  declares no `[paradigm.size]` value, so neither change needs an edit here.
- Bind through the locked 0.2.0-alpha.23 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.22 fails under 0.2.0-alpha.23] → The lane runs the
  0.2.0-alpha.23 gates after the bind, and the full proof runs at the archived head before landing;
  a failure is repaired at its owner, or the family binds the retained 0.2.0-alpha.22 runtime again.
- [The release ships supply with advisories that no stable upstream release fixes yet] → The
  release notes record them, and the owner's standing direction accepts them until a fixed stable
  release exists.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, run the gates, prove the
archived head and qualify it on GitHub and GitLab's Linux and macOS jobs. To roll back, restore the
0.2.0-alpha.22 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.22 runtime path>`.
