## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.26 today. The common CI model of 0.2.0-alpha.27
is unchanged, so the generated GitHub workflow is expected to stay as it is.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.27.
- Keep the 0.2.0-alpha.26 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- Bind through the locked 0.2.0-alpha.27 console, so the selected runtime is the one the lock
  declares.
- Check the pipelines against the common model with `ethos lane project`, which reports them
  conforming, instead of editing them by hand.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.26 fails under 0.2.0-alpha.27] → The lane runs the
  0.2.0-alpha.27 gates after the bind, and the full proof runs at the archived head before landing;
  a failure is repaired at its owner, or the family binds the retained 0.2.0-alpha.26 runtime again.
- [The release ships supply with advisories that no stable upstream release fixes yet] → The
  release notes record them, and the owner's standing direction accepts them until a fixed stable
  release exists.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, check the pipelines,
run the gates, prove the archived head and qualify it on GitHub and GitLab. To roll back, restore the
0.2.0-alpha.26 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.26 runtime path>`.
