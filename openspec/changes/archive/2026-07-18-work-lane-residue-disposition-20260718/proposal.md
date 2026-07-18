# Proposal

## Why

The accepted DDWG tree has three clean current roots, but an owned historical
Work Lane still contains a divergent implementation carrier. Its path overlap
does not prove that its 48 non-identical file objects were absorbed. Leaving it
in place misrepresents unfinished work as harmless history; deleting it as a
normal landed lane would falsely state that it was absorbed.

## What Changes

- Add one narrowly scoped lifecycle for the observed owned residue:
  `work/adoption-lifecycle-repair-finalize-20260717` at
  `c69c3763563e25c3ebb5a62875e897c93a0839c0`.
- Require a current Change, an exact semantic audit, and a
  preservation-first resolution before a clean but divergent owned Work Lane is
  destructively retired.
- Record the decision foundation in a Chronicle and active claim without
  merging, cherry-picking, or certifying the stale carrier as current work.
- **BREAKING** Remove the obsolete Work Lane only after the accepted decision
  foundation exists and ETHOS has created and verified its preservation package.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=owned divergent Work Lane residue;
  reuse=extend; change=modify; facet:lifecycle=validation,archive,release;
  facet:surface=openspec,evidence,docs; facet:authority=openspec,claim,evidence
  Destructive cleanup requires a separate accepted decision and preservation
  rather than an absorption assertion.

## Out of Scope

- Treating the target as absorbed, landed, or historically lifecycle-compliant.
- Merging, rebasing, cherry-picking, or otherwise replaying the old carrier as
  a whole branch.
- Mutating another holder's Work Lane, changing the released governance repair,
  or treating local cleanup as remote publication evidence.

## Impact

This Change affects only its OpenSpec carrier, the repository-governance
specification, and bounded claim/Chronicle evidence. It does not alter
`guidelines.md`, merge any stale branch, revise prior archives, change the
dual-remote publication topology, or mutate another holder's Work Lane.
