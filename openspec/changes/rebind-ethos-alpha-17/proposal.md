## Why

The repository declares and runs ETHOS 0.2.0-alpha.15. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.17. It is published with its own
Mise declaration, whose four platform checksums equal the release's `SHA256SUMS`, and its
adopter-path acceptance ran on a clone of this repository at `2209f8c4`.

## What Changes

- Replace the 0.2.0-alpha.15 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.17, unchanged, and lock it again with native `mise lock`. The other
  locked tools keep their versions and checksums.
- Bind the repository family to the 0.2.0-alpha.17 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.15 runtime as the rollback.
- Record the move under Changed in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. Hosted jobs install the declared supply, so the landed head's jobs run
0.2.0-alpha.17 on every platform they cover. `tasks.md` is the sole progress ledger.
