## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.20 today. The GitLab jobs on the Windows ARM64
runners fail at ETHOS supply, because no earlier release declared that platform.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.21, including the GitLab Windows ARM64 jobs.
- Keep the 0.2.0-alpha.20 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, generated pipeline or runner declaration.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- The Windows ARM64 archive carries the x64 runtime that the release qualified on a Windows ARM64
  host, which runs it through emulation. The release declares that archive for the platform, so the
  GitLab runner gets it through the same lock as every other platform.
- Declare the five lock platforms in `lockfile_platforms`. The default set of native `mise lock`
  omits Windows ARM64, so without the setting a later lock would drop that platform again.
- 0.2.0-alpha.21 changes no contract this repository relies on. Its other notes widen which
  references prewrite treats as owned, report the semantic reference closure beside a proof's audit
  without changing its verdict, and let a first release be cut from a newly formed repository.
- Bind through the locked 0.2.0-alpha.21 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.20 fails under 0.2.0-alpha.21] → The full proof runs at the
  archived head before landing; a failure is repaired at its owner, or the rebind rolls back.
- [The Windows ARM64 runner cannot install or run the emulated runtime] → The proposal's GitLab
  review job runs it before the governance statement is accepted, and the landing waits for it.
- [The release ships `uv` 0.13.5, whose embedded `rustls` 0.23.45 carries four advisories, and npm
  12.2.1, whose bundled packages carry six, none with an upstream fix yet] → The release notes
  record them, as they did for 0.2.0-alpha.20.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, qualify the head on both
Forges and prove the archived head. To roll back, restore the 0.2.0-alpha.20 declaration and lock
and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.20 runtime path>`.
