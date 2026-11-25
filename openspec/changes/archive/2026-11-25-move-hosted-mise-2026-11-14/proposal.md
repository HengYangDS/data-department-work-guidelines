## Why

The hosted GitHub job installs Mise 2026.11.11. Mise 2026.11.14, published on 24 November 2026 at
11:00 UTC, is the latest stable release and passed the 24-hour release age on 25 November 2026. The
owner directed on 26 November 2026 that every Mise the project's work runs on is the latest stable
release.

## What Changes

- Run the hosted GitHub job with Mise 2026.11.14, taken from `[supply] mise_version`.
- Generate both pipelines again from the common model.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.github/workflows/ci.yml`, and `CHANGELOG.md`.
GitLab's jobs run on the macOS guest's runners with the Mise that guest provides, which moved to
2026.11.14 on 26 November 2026 outside this repository. The lockfile stays at version 3, and the
Mise floor stays as it is. `tasks.md` is the sole progress ledger.
