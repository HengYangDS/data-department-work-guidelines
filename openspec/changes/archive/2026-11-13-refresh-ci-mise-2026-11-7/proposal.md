## Why

The hosted jobs install Mise 2026.11.5, while 2026.11.7 has been the latest stable release since 12
November 2026. The owner's standing direction moves every supply chain to its latest stable release
that is at least a day old.

## What Changes

- Run every hosted job that installs Mise with Mise 2026.11.7. GitHub's jobs take it from
  `[supply] mise_version`. GitLab's Linux jobs read the release's installer and Linux ARM64 archive
  from the project's GitLab package registry, where both are staged after their release digests are
  checked, and `.config/mise/install.sha256` pins the new installer.
- Generate both pipelines again from the common model.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/ci/verification.toml`, `.config/mise/install.sha256`, the generated
`.github/workflows/ci.yml` and `.gitlab-ci.yml`, and `CHANGELOG.md`. The project's GitLab package
registry gains the `mise` 2026.11.7 package, and 2026.11.5 stays as the rollback. The lockfile stays
at version 3, and the Mise floor and GitLab's Linux image stay as they are. `tasks.md` is the sole
progress ledger.
