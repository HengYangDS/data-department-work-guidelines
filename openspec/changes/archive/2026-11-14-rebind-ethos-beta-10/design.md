## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, publish the proposal from the lane, then land and publish from the
canonical root. Between 0.2.0-beta.9 and 0.2.0-beta.10 four Breaking rules start to block: Markdown
list spacing, the canonical text owner, package docstrings and README index roles; ETHOS's own Node
moves to 26.13.1. The governance README already declares `role: index`, and the repository authors
no Python package.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on 0.2.0-beta.10,
  Windows included.
- Keep the 0.2.0-beta.9 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration or image.
- Editing guideline content; a list-spacing repair, if the gates ask for one, only removes the blank
  lines that `ethos lane format --apply` removes.
- Turning on `[peer_identity] mode = "required"`.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, after checking
  each platform checksum against the release's `SHA256SUMS` and the published asset digests; the
  lock stays at version 3 because locking an existing lock again keeps its version.
- Declare `minimum_release_age = "0h"` under `[settings]`, the one home of the release age in a
  repository without Renovate. ETHOS is the only declared tool and is declared by exact archive and
  checksum, so the lane verifies only that the setting reads back and the locked install still
  succeeds.
- Move the hosted jobs' Mise from 2026.11.7 to 2026.11.8 in this lane, so that one proof and one
  hosted run cover both moves. Stage its installer and Linux ARM64 archive in the project's
  registry, checked against the release's published digests; move `[supply] mise_version`, GitLab's
  Linux bootstrap and `.config/mise/install.sha256`; and generate both pipelines with
  `ethos lane project --apply`. Any further difference comes from the release's common model and is
  taken the same way.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.9 fails under 0.2.0-beta.10] → The lane runs the gates after
  the bind, and the full proof runs at the archived head before landing. A failure is repaired at
  its owner, or the family restores the 0.2.0-beta.9 declaration in a new Change and binds the
  retained runtime.
- [A rollback after the declaration change is not qualified by 0.2.0-beta.10's journey] → A rollback
  restores the 0.2.0-beta.9 declaration and lock in a new Change and runs the full proof before it
  lands, so this repository proves its own rollback instead of assuming it.
- [Mise 2026.11.8 cannot read the tracked lock] → The lane reads the lock with the official Mise
  2026.11.8 before landing; a failure keeps the hosted jobs on 2026.11.7.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, move the hosted Mise,
generate the pipelines, run the gates, prove the archived head and qualify it on GitHub and GitLab,
Windows included. To roll back, restore the 0.2.0-beta.9 declaration and lock in a new Change, then
bind the retained runtime with the current console's
`hook install --runtime <0.2.0-beta.9 runtime>`.
