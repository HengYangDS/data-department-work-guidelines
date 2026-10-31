## Why

The repository declares and runs ETHOS 0.2.0-alpha.22. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.23, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.23 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. It extends the 500-line code ceiling from Python to every registered code
language and renames the `[paradigm.size]` keys. This repository tracks no file in those languages
and declares no `[paradigm.size]` value.

## What Changes

- Replace the 0.2.0-alpha.22 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.23, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.23 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.22 runtime as the rollback.
- Record the move in the Changelog.
- Qualify the archived head on GitHub and on GitLab's Linux and macOS jobs. GitLab's Windows ARM64
  jobs stay outside the acceptance under DR-0005; the design explains why.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. Hosted jobs keep Mise 2026.10.24, the Mise floor and GitLab's Linux image.
`tasks.md` is the sole progress ledger.
