# Proposal

## Why

The declared documentation tools are current, but the release-bound npm lock
still contains compatible older transitive packages. Refreshing only the
manifest names would leave the actual installed supply behind.

## What Changes

- Refresh the lock through npm's resolver without overriding upstream version
  constraints or introducing another dependency owner.
- Rebind the offline bundle to the new lock and prepare a compatible patch
  edition. Qualify source, installation, and publication separately.
- Keep current tool commands and guideline obligations unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The accepted quality requirements already cover locked supply, offline
installation, and per-platform verification. This is a supply refresh, not a
new repository contract.

## Impact

The npm lock, edition projection, Changelog, offline bundle record, and release
asset change. Direct npm tool pins, lychee, GitHub Actions, Node major, CI
image, normative guidance, and historical tags do not change unless a fresh
official-source check identifies a newer stable compatible release. No
unverified Forge or host result is inherited from the previous edition.
