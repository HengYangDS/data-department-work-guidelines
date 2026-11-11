## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, publish the proposal from the lane, then land and publish from the
canonical root. Between 0.2.0-beta.7 and 0.2.0-beta.8 the ETHOS source changes in the protected-peer
feed, in the TOML indent of the repair and adoption writers, and in the paradigm's list of root
documents; the common CI model and the bundled supply are unchanged.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on 0.2.0-beta.8,
  Windows included.
- Keep the 0.2.0-beta.7 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration or image.
- Redacting the peer address in the decision records and the archived design, which
  `redact-peer-addresses` does in the same lane after this Change.
- Turning on `[peer_identity] mode = "required"`.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, after checking
  each platform checksum against the release's `SHA256SUMS` and the published asset digests; the
  lock stays at version 3 because locking an existing lock again keeps its version.
- Check the pipelines with `ethos lane project --check`; a difference would come only from the
  release's common model and is taken through `ethos lane project --apply`.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.7 fails under 0.2.0-beta.8] → The lane runs the gates after
  the bind, and the full proof runs at the archived head before landing. A failure is repaired at
  its owner, or the family restores the 0.2.0-beta.7 declaration in a new Change and binds the
  retained runtime.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, check the pipelines, run
the gates, prove the archived head and qualify it on GitHub and GitLab, Windows included. To roll
back, restore the 0.2.0-beta.7 declaration and lock in a new Change, then bind the retained runtime
with the current console's `hook install --runtime <0.2.0-beta.7 runtime>`.
