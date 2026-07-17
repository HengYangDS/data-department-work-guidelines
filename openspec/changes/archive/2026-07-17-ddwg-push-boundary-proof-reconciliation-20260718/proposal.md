# DDWG push-boundary proof reconciliation

## Why

Official OpenSpec archive moved the completed push-boundary Change from its
active path. The historical claim must retain that archive, while a distinct
active carrier binds the resulting tree to fresh exact-HEAD local proof.

## What Changes

- Reclassify the archived boundary claim as historical and bind it to its dated
  archive path.
- Add an active reconciliation claim and Chronicle for the post-archive proof.
- Restore the canonical specification to one source-or-target rejection scenario
  and one eligible-ref delegation scenario.

## Capabilities

### Modified Capabilities

- `repository-governance`: preserve archived lifecycle evidence while requiring
  a distinct active post-archive proof carrier; subject=ddwg-push-boundary-proof;
  reuse=extend; change=modify; facet:lifecycle=proof,archive; facet:surface=claim,chronicle,openspec;
  facet:authority=repository,openspec.

## Out of Scope

- Hook behavior, `guidelines.md`, remote pushes, provider protection, hosted CI,
  and all foreign work lanes.
