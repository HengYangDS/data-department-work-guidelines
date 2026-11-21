## Why

Each GitLab job installs every locked tool again: `mise install --locked` takes 90 to 106 seconds in
each guest job, more than the proof itself (read 2026-11-19 from the jobs' traces). Since 319e0fa9
(2026-10-30) the pipeline keeps the Mise data and cache under each job's
`build/runtime/tool-cache/mise`, which the Windows runner needs because Mise could not copy its shim
into the shared runner profile there. The macOS guest has no such limit, and the film repositories
that leave the Mise data in the guest's own store bootstrap in 9 to 25 seconds. The owner asked for
the fleet's iteration and performance to go as far as it can, measured first and changed one thing
at a time.

## What Changes

- Declare `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` for the Windows GitLab
  runner only, under `[gitlab.runners.windows.variables]` in `.config/ci/verification.toml`, instead
  of for every runner.
- Generate the pipelines again from the common model.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml` and `CHANGELOG.md`. The macOS job
uses the guest's Mise store; the Windows job keeps its job-local store; the Linux job runs in a new
container each time, so its install time stays until a cache exists (ETHOS's candidate
`hosted-download-caches`).
`tasks.md` is the sole progress ledger.
