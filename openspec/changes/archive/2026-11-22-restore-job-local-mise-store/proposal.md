## Why

`share-the-macos-guest-mise-store` (archived 2026-11-21) let GitLab's macOS jobs install into the
macOS guest's shared Mise store. Its design held that a tool already in that store is used only when
it matches the lock. The Mise documentation says otherwise ([Restored caches and installed
tools](https://mise.jdx.dev/dev-tools/mise-lock.html), read 2026-11-22): "`mise.lock` verifies what
mise downloads, not what is already on disk", "A restored CI cache or a shared extraction store is
trusted as is", and "mise can't validate an installed tree against the lockfile". The change also
contradicted two governance statements it did not update: `docs/governance/checks-and-ci.md` ("Every
GitLab job keeps the Mise configuration, data, and cache under its own execution root, so no job ...
shares Mise state with another job") and `CONTRIBUTING.md`. A review of the landed change with
open-code-review found the unverified store and the contradiction. Tools that can be checked against
the lock come before a faster job, so the jobs return to job-local stores.

## What Changes

- Declare `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` again under
  `[gitlab.variables]` in `.config/ci/verification.toml`, for every GitLab runner, and remove the
  Windows runner's own `variables` table.
- Generate the pipelines again from the common model.
- Remove the Unreleased Changelog line that announced the shared store. The shared store was never
  released, so the restoration leaves nothing to record against the last release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml` and `CHANGELOG.md`. Each macOS job
installs every locked tool again: `mise install --locked` took 61 to 135 seconds in the last three
successful `dev` pipelines before the shared store (2026-11-13 and 11-14). With the shared store it
took 71 and 117 seconds in the first job on each runner after a new ETHOS release, and 0 seconds
after that. `checks-and-ci.md` and `CONTRIBUTING.md` are true again without edits. `tasks.md` is the
sole progress ledger.
