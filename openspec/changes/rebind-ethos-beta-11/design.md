## Context

See [proposal.md](proposal.md). The move follows ETHOS's successor-first adopter cutover: bind the
release in the lane, prove, publish for review, land, and publish the accepted head. Between
0.2.0-beta.10 and 0.2.0-beta.11, three Breaking entries change what an adopter meets: hosted CI
artifacts expire after 14 days, so the generated pipelines change; a release build's `ethos adopt`
plans its own pin, which this lane does not call; and the host contention gap no longer prints a
repository path. A gate declaration may now name its provider by a catalog ID, and the legacy names
keep resolving for one support window.

The entry also lists known open defects that a lane can meet. The one that bears on this lane: a
repository-declared command gate runs in the proof's launch environment in every release. A proof
launched from a shell whose Mise state was removed while its activated PATH stayed can run Node's
bundled npm (jdx/mise#15771). A proof launched from a bare environment misses whatever the hosted
job declares, such as a browser path or the declared npm. Re-read the tagged entry's list before the
lane starts; the head moves once more after the cut of 2026-11-19.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the guidelines, locally and in the hosted jobs, on
  0.2.0-beta.11.
- Carry the 14-day artifact retention into both generated pipelines.
- Keep the 0.2.0-beta.10 runtime as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any source, test, gate or declared command of the guidelines.
- Moving other supply. A supply move is its own Change, after its dependency check.

## Decisions

- Copy the release's own declaration unchanged into the `[tools."http:ethos"]` table, the form the
  repository holds, and lock it with native `mise lock`, after checking each platform checksum
  against the release's `SHA256SUMS` and the published asset digests. The lock keeps
  `lockfile_version = 3`.
- Write the repository's own release age, `minimum_release_age = "24h"` under `[settings]`, changing
  it from "0h" in the same lane. The owner directed on 19 November 2026 that every governed
  repository write its own age, and that a repository without one take the 24-hour default of
  ETHOS's common base. An age filters only a version that Mise has to resolve, not a locked or exact
  one, so the bind and the locked tools install as before, and it moves no supply.
- Regenerate both pipelines with `ethos lane project --apply` as a task of its own. Only
  `ethos lane project --check` reports the old files; neither a proof nor a commit refuses them, so
  the step is never skipped. The generated files are never edited by hand.
- Launch every local proof as the generated hosted job does: `mise exec --locked --` around the lane
  runtime's `ethos prove`, in the work tree, so a declared command gate finds the tools the
  repository declares. Never launch with the Mise activation state removed alone. Reason: a declared
  command gate's verdict follows the launch environment under 0.2.0-beta.10 and 0.2.0-beta.11 alike
  (measured 2026-11-16); on 2026-11-18 a copies-run proof launched without the tools that Mise
  installs met Homebrew's npm instead of the declared one.
- Record the move under Changed in the Changelog's Unreleased section.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.10 fails under 0.2.0-beta.11] → The copies run of 2026-11-18
  and 2026-11-19 proved this tree's dev of that day on the released head e4d9d04d3, with the
  candidate's projection applied: eleven trees of eleven passed, nine of them launched as the hosted
  jobs launch the proof. If the lane still meets a failure, it is repaired at its owner, or the
  family restores the 0.2.0-beta.10 declaration in a new Change and binds the retained runtime.
- [A local verdict depends on the launch environment] → Launch as the decision above says; the
  hosted jobs of the proposal decide, and they are read before landing.
- [A rollback after the bind is not qualified by 0.2.0-beta.11's journey] → A rollback restores the
  0.2.0-beta.10 declaration and lock in a new Change and runs the full proof before it lands.

## Migration Plan

Copy the declaration and lock it, install the locked supply, bind the runtime, generate the
pipelines, run the gates and prove the archived head; then propose, read both forges' review runs,
land and publish. To roll back, restore the 0.2.0-beta.10 declaration in a new Change, then bind the
retained runtime with the current console's `hook install --runtime <0.2.0-beta.10 runtime>`.
