## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, publish for review, land, and publish the accepted head. Between
0.2.0-beta.11 and 0.2.0-beta.12 the release's entry has no Breaking section. What this repository
meets: the commit grammar gains a type; the Vale policy that its `prose` gate runs ignores one more
front-matter field; staged admissions are judged by the staged tree, with one obligation entering as
reporting; and executed proofs keep gate records in the Git-common store. The Ruff and
format-selection policy changes apply to ETHOS's own source only. The release's known defects are
recorded one file each under its `defects/`; re-read them before the lane starts.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the guidelines, locally and in the hosted jobs, on
  0.2.0-beta.12.
- Keep the 0.2.0-beta.11 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any source, test, gate or declared command of the guidelines.
- Moving the decision records to the Docs Registry's new form: that is a Change of its own.
- Moving other supply, the hosted jobs' Mise or the `jdx/mise-action` pin; this Change touches
  none of them.

## Decisions

- Copy the release's own declaration into the `[tools."http:ethos"]` table, the form the repository
  holds, keeping only the three platforms of `lockfile_platforms` (linux-arm64, linux-x64,
  macos-arm64), and lock it with native `mise lock`, after checking each platform checksum against
  the release's `SHA256SUMS` and the published asset digests. Reason: the repository stopped
  pinning ETHOS's Windows archives before this release, and ETHOS now deprecates Windows. The lock
  keeps `lockfile_version = 3`.
- Run `ethos lane project --check` after the bind and apply the projection only on reported drift.
  The release's entry names no change to the common CI model, so no drift is expected; the check
  is the reading, not the entry.
- Launch every local proof as the generated hosted job does: `mise exec --locked --` around the lane
  runtime's `ethos prove`, in the work tree, so a declared command gate finds the tools the
  repository declares. Never launch with the Mise activation state removed alone.
- Record the move under Changed in the Changelog's Unreleased section.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.11 fails under 0.2.0-beta.12] → The release's proof on a
  disposable copy of this tree passed before the tag. If the lane still meets a failure, it is
  repaired at its owner, or the family restores the 0.2.0-beta.11 declaration in a new Change and
  binds the retained runtime.
- [A local verdict depends on the launch environment] → Launch as the decision above says; the
  hosted jobs of the proposal decide, and they are read before landing.
- [The release's journey reports a rollback after the declaration repair as not qualified] → A
  rollback restores the 0.2.0-beta.11 declaration and lock in a new Change and runs the full proof
  before it lands.

## Migration Plan

Copy the declaration and lock it, install the locked supply, bind the runtime, check the
pipelines, run the gates and prove the archived head; then propose, read both forges' review runs,
land and publish. To roll back, restore the 0.2.0-beta.11 declaration in a new Change, then bind the
retained runtime from a Work Lane with the current console's
`hook install --runtime <0.2.0-beta.11 runtime> --reason <text>`.
