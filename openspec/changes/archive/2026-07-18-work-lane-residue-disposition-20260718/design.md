# Design

## Context

The observed target is clean and owned by this thread, but it diverges from
accepted `dev`: its merge base is
`eb3e3d1ddfafa5ad8a5a1062f3901113ff5f38d2`, its head is
`c69c3763563e25c3ebb5a62875e897c93a0839c0`, and 48 of its 82 changed paths
do not match the current accepted tree. It is therefore neither a landed lane
nor a structurally absorbed superseded lane.

The target primarily contains older reconciliation carriers that the accepted
tree deliberately removed and replaced with the July 18 authoritative archive.
That conclusion is an audit finding, not a licence to erase the branch without
retaining its exact content.

## Goals / Non-Goals

**Goals:**

- Make the destructive-disposal decision explicit, portable, and bounded to one
  current branch/head observation.
- Preserve the exact divergent carrier before removal through ETHOS's native
  content-addressed resolution package.
- Ensure the accepted tree remains the only authoritative governance topology.

**Non-Goals:**

- Merging, rebasing, or cherry-picking the old implementation carrier.
- Rewriting a dated OpenSpec archive or claiming that historical work was
  originally lifecycle-compliant.
- Deleting any foreign, dirty, missing-lease, or otherwise unreviewed Work Lane.

## Decisions

### Treat non-absorption as a deletion constraint

The audit's object-level mismatch means `lane retire superseded` is correctly
unavailable. The final disposition is not "absorbed"; it is
`preserve-retire`, invoked only after this Change becomes an accepted decision
foundation.

**Alternative rejected:** forcing an "absorbed" conclusion by comparing only
file names or high-level purpose. That would erase distinct historical content
while recording a false lifecycle state.

### Keep evidence portable and separate from the preservation package

Tracked evidence names the branch, commit identifiers, semantic finding, and
resolution boundary. The resolver writes the binary patches, untracked archive,
manifest, and immutable receipt under its local disposable artifact root. The
repository never records a workstation path or treats that local package as an
OpenSpec or Chronicle substitute.

**Alternative rejected:** copying the old carrier into `docs/history/`.
Immutable Git history and the resolver package preserve it without keeping a
second live governance topology.

### Archive before irreversible effect

This Change is first completed, officially archived, proved at its archive
HEAD, and accepted through the normal local route. Only then may the native
resolver re-observe the target and perform the separate irreversible effect.

**Alternative rejected:** deleting the stale lane before the Change archive.
That would make the decision foundation and observed target non-reproducible.

## Risks / Trade-offs

- **The target changes before resolution** -> the resolver's recomputed
  observation becomes stale and blocks; start a new audit rather than reuse
  this decision.
- **The current target contains useful missing behavior** -> preserve it and
  admit the smallest missing behavior through a successor Change; do not merge
  the historical branch wholesale.
- **A local artifact is mistaken for publication evidence** -> the claim and
  Chronicle state that no remote publication, hosted CI, or organizational
  adoption conclusion follows.

## Migration Plan

1. Complete this Change and its active claim/Chronicle around the exact audit.
2. Validate, archive, prove, land, and close out this decision carrier through
   the existing local lifecycle.
3. Re-observe the exact target; have ETHOS write and verify the preservation
   package, then remove only that exact clean owned lane.
4. Re-observe all roots, refs, Work Lanes, and remotes. If any difference from
   the recorded target exists, stop rather than applying the old disposition.

## Open Questions

None. The applicable native resolver already supplies the required
preservation-first transition.
