## Why

`share-the-macos-guest-mise-store` (archived 2026-11-21) let GitLab's macOS jobs install into the
macOS guest's shared Mise store. Its design held that a tool already in that store is used only when
it matches the lock. The documentation of Mise says that Mise cannot validate an installed tree
against the lockfile; the lock checks what Mise downloads, and a shared store is trusted as it is
(read 2026-11-22). The guest keeps no downloaded archive, so an installed tree cannot be compared
with the lock afterwards. The change also contradicted two governance statements it did not update:
`docs/governance/checks-and-ci.md` ("Every GitLab job keeps the Mise configuration, data, and cache
under its own execution root, so no job ... shares Mise state with another job") and
`CONTRIBUTING.md`. A review of the landed change with open-code-review found both. Fidelity comes
before speed: the jobs return to job-local stores.

## What Changes

- Declare `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` again under
  `[gitlab.variables]` in `.config/ci/verification.toml`, for every GitLab runner, and remove the
  Windows runner's own `variables` table.
- Generate the pipelines again from the common model.
- Record the restoration in the Changelog's Unreleased section, replacing the line that announced
  the shared store.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml` and `CHANGELOG.md`. The macOS job
installs every locked tool again in each job (61 to 135 seconds before the shared store, 0 to 16
seconds with it); `checks-and-ci.md` and `CONTRIBUTING.md` are true again without edits. `tasks.md`
is the sole progress ledger.
