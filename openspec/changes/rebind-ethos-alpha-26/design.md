## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.25 today. The common CI model of 0.2.0-alpha.26
selects `jdx/mise-action` v5.2.5, so the generated GitHub workflow moves with the bind.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.26.
- Keep the 0.2.0-alpha.25 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- Bind through the locked 0.2.0-alpha.26 console, so the selected runtime is the one the lock
  declares.
- Generate the pipelines again with `ethos lane project`, so the workflow takes the common model's
  action pin instead of a hand edit.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.25 fails under 0.2.0-alpha.26] → The lane runs the
  0.2.0-alpha.26 gates after the bind, and the full proof runs at the archived head before landing;
  a failure is repaired at its owner, or the family binds the retained 0.2.0-alpha.25 runtime again.
- [The release ships supply with advisories that no stable upstream release fixes yet] → The
  release notes record them, and the owner's standing direction accepts them until a fixed stable
  release exists.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, generate the pipelines,
run the gates, prove the archived head and qualify it on GitHub and GitLab. To roll back, restore the
0.2.0-alpha.25 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.25 runtime path>`.
