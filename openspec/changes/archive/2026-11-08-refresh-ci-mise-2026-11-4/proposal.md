## Why

The hosted jobs install Mise 2026.11.3, while 2026.11.4 has been the latest stable release since
7 November 2026. The owner's standing direction moves every supply chain to its latest stable
release that is at least a day old.

## What Changes

- Run every hosted job that installs Mise with Mise 2026.11.4. GitHub's jobs take it from
  `[supply] mise_version`. GitLab's Linux jobs read the release's installer and Linux ARM64 archive
  from the project's GitLab package registry, where both are staged after their release digests
  are checked, and `.config/mise/install.sha256` pins the new installer.
- Generate both pipelines again from the common model.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/ci/verification.toml`, `.config/mise/install.sha256`, the generated
`.github/workflows/ci.yml` and `.gitlab-ci.yml`, and `CHANGELOG.md`. The project's GitLab package
registry gains the `mise` 2026.11.4 package, and 2026.11.3 stays as the rollback. The lockfile
stays at version 3, and the Mise floor, GitLab's Linux image, the declared ETHOS release and the
runtime selection stay as they are. `tasks.md` is the sole progress ledger.
