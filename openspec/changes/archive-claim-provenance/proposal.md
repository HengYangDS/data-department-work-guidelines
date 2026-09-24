# Proposal

## Why

The official archive committed the original Change at `8fd58106`, but its
author-owned dated Claim still names the former active directory. Archive and
Claim state are separate concerns. A recently added repository test incorrectly
inferred Claim state from an archive path.

## What Changes

- Point the existing dated Claim to its observed archive, preserving its original
  Change ID, Chronicle, and evidence digest.
- Describe that dated intent record as historical without generalizing this
  disposition to other Claims.
- Remove the speculative Claim-state rule from the material-attribution test.

## Capabilities

### Modified Capabilities

- `repository-governance`: separate provenance annotation from Change lifecycle.

## Impact

Only the existing Claim, the incorrect test block, and the specification change.
No new Claim, parser, state machine, worktree, runner, or runtime is introduced.
