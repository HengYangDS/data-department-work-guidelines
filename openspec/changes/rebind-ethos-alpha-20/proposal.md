## Why

The repository declares and runs ETHOS 0.2.0-alpha.19. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.20. It is published with its own
Mise declaration, whose four platform checksums equal the release's `SHA256SUMS`, and its
adopter-path acceptance ran on a clone of this repository at `fca88926`, including a full host proof.

## What Changes

- Replace the 0.2.0-alpha.19 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.20, unchanged, and lock it again with native `mise lock`. The lock
  keeps naming only ETHOS.
- Bind the repository family to the 0.2.0-alpha.20 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.19 runtime as the rollback.
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
0.2.0-alpha.20 on every platform the release covers. The release has no Windows ARM64 archive, so
the GitLab job on the Windows ARM64 runner keeps failing at ETHOS supply, as it does today; ETHOS
delivers that platform in a later release. `tasks.md` is the sole progress ledger.
