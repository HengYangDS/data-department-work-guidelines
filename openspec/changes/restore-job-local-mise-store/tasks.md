## 1. Restore the job-local store

- [x] 1.1 Move `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` back to
      `[gitlab.variables]` in `.config/ci/verification.toml` and remove
      `[gitlab.runners.windows.variables]`, then generate the pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming and every GitLab job
      carries the three variables. The check reports both projections conforming; all six GitLab
      jobs carry the three variables again, and only their order changes in the two Windows jobs.
- [x] 1.2 Replace the Unreleased Changelog line on the shared macOS store with one saying that every
      GitLab job keeps its tools in its own directory again; done when the Changelog's format check
      passes. The Unreleased section now says every GitLab job keeps its Mise tools in its own
      directory.
