## 1. Restore the job-local store

- [ ] 1.1 Move `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` back to
      `[gitlab.variables]` in `.config/ci/verification.toml` and remove
      `[gitlab.runners.windows.variables]`, then generate the pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming and every GitLab job
      carries the three variables.
- [ ] 1.2 Replace the Unreleased Changelog line on the shared macOS store with one saying that every
      GitLab job keeps its tools in its own directory again; done when the Changelog's format check
      passes.
