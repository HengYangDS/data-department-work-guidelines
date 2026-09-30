# Proposal

## Why

The current official-source audit found a new compatible documentation-tool
patch after the last release. Update the supported dependency closure without
forcing versions outside the latest official tools' declared contracts.

## What Changes

- Refresh the documentation lock through npm, then prove that a second
  resolution is unchanged and every direct tool matches official stable.
- Publish a patch edition with a freshly source-bound offline bundle. Keep
  the normative guidance, reader routes, commands, and platform claims unchanged.
- Record constrained transitive packages honestly, with their actual parents;
  do not create unsupported overrides, duplicate tooling, or an upstream fork.
- Verify local source, installed ETHOS proof, both source CI planes, signed
  release assets, offline host matrices, and exact retirement of the work lane.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This implements the existing quality and repository-governance contracts;
no requirement changes. The official Change sets `skip_specs: true`.

## Impact

Implementation affects `package-lock.json`, the existing offline bundle record,
`VERSION`, the charter edition, and the Changelog. The existing spelling
dictionary registers the actual upstream package names used in this audit.
Official Change artifacts
carry intent and progress. There is no department-policy, mobile, ETHOS-product,
Runner-service, personal identity, or credential change.
