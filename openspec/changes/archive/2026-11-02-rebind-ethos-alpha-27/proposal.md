## Why

The repository declares and runs ETHOS 0.2.0-alpha.26. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.27, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.27 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. Its adopter-facing changes are bounded waits: every gate without its own
`timeout_seconds` runs under `timeout.gate_seconds`, 600 s by default, which this repository's gates
stay well under, and Git and tool waits are bounded at 30 s and 60 s. A runner declaration now owns
its identities in the hosted template that the CI projection policy names. The common CI model is
unchanged. The paradigm also declares the branch role names and keys binding files by role, with the
values unchanged.

## What Changes

- Replace the 0.2.0-alpha.26 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.27, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.27 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.26 runtime as the rollback.
- Check the CI projection against the common model; it stays as it is.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`,
`CHANGELOG.md` and the repository-common runtime selection. Hosted jobs keep Mise 2026.10.25, the
Mise floor and GitLab's Linux image. `tasks.md` is the sole progress ledger.
