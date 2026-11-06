## Why

The repository declares and runs ETHOS 0.2.0-beta.2. The owner asked that every governed
repository run the latest ETHOS release, and that every supply chain move to its latest stable
release without a separate confirmation. The repository did not move to 0.2.0-beta.3, because that
release published no Windows runtimes and this repository's Windows jobs install ETHOS from its Mise
declaration. 0.2.0-beta.4 publishes Windows runtimes again, with its own Mise declaration, whose
platform checksums equal the release's `SHA256SUMS` and the published asset digests. Its hosted
journey upgrades from 0.2.0-beta.2, and rolls back to it, on macOS and Linux.

Its adopter-facing changes since 0.2.0-beta.2 are these:

- Commit and tag admission refuse a message that names a private-class network address, and
  publication judges every commit and tag that it introduces.
- A gate that timed out, a command that is absent and a prerequisite whose state is unknown report
  `unknown` instead of `block`.
- `ethos status` names the Lease's generation, expiry and remaining seconds. `ethos lane lease
  renew` and `resume` preview without coordinates.
- A gate child's Mise no longer reads the operator's own configuration.
- A release tag that an earlier ETHOS released publishes on the proof that its own release effect
  bound.

The common CI model is unchanged, so this repository's pipelines stay as they are. This repository
declares no Mise tool besides ETHOS.

## What Changes

- Replace the 0.2.0-beta.2 declaration in `.config/mise/config.toml` with the declaration published
  with 0.2.0-beta.4, unchanged, and lock it again with native `mise lock` for the five declared
  platforms.
- Bind the repository family to the 0.2.0-beta.4 runtime through the locked console's
  `hook install`, keeping the 0.2.0-beta.2 runtime as the rollback.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. The CI projection, the hosted jobs' Mise 2026.10.25, the Mise floor and
GitLab's Linux image stay as they are. `tasks.md` is the sole progress ledger.
