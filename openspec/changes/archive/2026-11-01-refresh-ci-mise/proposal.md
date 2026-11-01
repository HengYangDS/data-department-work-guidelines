## Why

The hosted jobs on both Forges install Mise 2026.10.24, while 2026.10.25 has been the latest stable
release since 31 October 2026. The owner's standing direction moves every supply chain to its
latest stable release without a separate confirmation.

## What Changes

- Run every hosted job that installs Mise with Mise 2026.10.25. GitHub's jobs take it from
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
registry gains the `mise` 2026.10.25 package, and 2026.10.24 stays as the rollback. The Mise floor,
GitLab's Linux image, the declared ETHOS release and the runtime selection stay as they are. The
Change lands after the 8.0.0 release is tagged, so its entry opens the next Unreleased section.
`tasks.md` is the sole progress ledger.
