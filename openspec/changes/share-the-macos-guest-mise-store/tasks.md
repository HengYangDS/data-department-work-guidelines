## 1. Measure before

- [ ] 1.1 Read the macOS GitLab job's `mise install --locked` seconds in the last three successful
      pipelines on `dev`; done when the three readings are recorded in
      `build/evidence/share-the-macos-guest-mise-store/install-seconds.md`.

## 2. Change

- [ ] 2.1 Move `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` from
      `[gitlab.variables]` to `[gitlab.runners.windows.variables]` in `.config/ci/verification.toml`
      and generate the pipelines again; done when `ethos lane project --check --json` reports both
      projections conforming and only the macOS and Linux jobs lose those three variables.
- [ ] 2.2 Add one line under `## [Unreleased]` / `### Changed` in `CHANGELOG.md` saying that
      GitLab's macOS jobs use the guest's own Mise store and the Windows jobs keep theirs in the
      job's directory; done when the Changelog's format check passes.

## 3. Measure after

- [ ] 3.1 Read the macOS job's `mise install --locked` seconds in the proposal's pipeline and two
      more runs; done when the three readings are recorded beside those of 1.1 and the Windows job
      still passes.
