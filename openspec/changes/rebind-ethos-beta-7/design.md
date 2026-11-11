## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, publish the proposal from the lane, then land and publish from the
canonical root. Before the release, a disposable-clone pre-check of the candidate ran this
repository's status, paradigm-repair preview, bootstrap and full host proof under the candidate's
runtime, and classified the root command forms the repository's documents and the operator kit use.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on 0.2.0-beta.7,
  Windows included.
- Keep the 0.2.0-beta.6 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration or image.
- Redacting the peer address in the decision records and the archived design, which
  `redact-peer-addresses` does in the same lane after this Change.
- Moving the hosted jobs' Mise, which `refresh-ci-mise-2026-11-5` already did in its own lane
  (landed `269769b5` on 10 November 2026).
- Turning on `[peer_identity] mode = "required"`.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, after checking
  each platform checksum against the release's `SHA256SUMS` and the published asset digests; the
  lock stays at version 3 because locking an existing lock again keeps its version.
- Take the regenerated workflows only through `ethos lane project --apply`, so the `jdx/mise-action`
  pin and any other model change come from the release's common model.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.6 fails under 0.2.0-beta.7] → The lane runs the gates after
  the bind, and the full proof runs at the archived head before landing. A failure is repaired at
  its owner, or the family restores the 0.2.0-beta.6 declaration in a new Change and binds the
  retained runtime.
- [The stricter root command surface refuses a form this repository's documents name] → The
  pre-check classified the documented forms against the candidate's catalog; a refused form is
  rewritten in the same lane.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, generate the pipelines,
run the gates, prove the archived head and qualify it on GitHub and GitLab, Windows included. To
roll back, restore the 0.2.0-beta.6 declaration and lock in a new Change, then bind the retained
runtime with the current console's `hook install --runtime <0.2.0-beta.6 runtime>`.
