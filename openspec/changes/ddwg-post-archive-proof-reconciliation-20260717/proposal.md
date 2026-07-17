# Post-archive documentation-proof reconciliation

## Why

Official archive moved the local closeout carrier and fused its accepted
requirement into the repository specification. That changed the tracked tree,
so the final local proof must be governed by a distinct active reconciliation
Change rather than by the archived carrier.

## What Changes

- Bind the archived closeout carrier to a new active local-proof claim.
- Record the post-archive proof boundary and run all local documentation gates.
- Land only after the exact resulting HEAD has a successful proof record.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=ddwg-post-archive-local-proof;
  reuse=extend; change=add; facet:lifecycle=proof,land;
  facet:surface=openspec,claim,evidence; facet:authority=openspec,claim,evidence.

## Out of Scope

- Any rewrite of the dated closeout archive.
- `guidelines.md`, provider publication, hosted rendering, or organizational
  adoption.
- Ownership or mutation of foreign Work Lanes.

## Impact

This affects only the post-archive evidence carrier, the local proof receipt,
and candidate-lane promotion eligibility.
