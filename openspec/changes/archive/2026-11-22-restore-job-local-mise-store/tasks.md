## 1. Restore the job-local store

- [x] 1.1 Move `MISE_DATA_DIR`, `MISE_CACHE_DIR` and `MISE_WINDOWS_SHIM_MODE` back to
      `[gitlab.variables]` in `.config/ci/verification.toml` and remove
      `[gitlab.runners.windows.variables]`, then generate the pipelines again; done when
      `ethos lane project --check --json` reports both projections (`.github/workflows/ci.yml` and
      `.gitlab-ci.yml`) conforming and every GitLab job carries the three variables. The check
      reported both conforming (2026-11-22 07:45); all six GitLab jobs carry the three variables,
      and in the two Windows jobs only the order of the variables changes, back to the order before
      `share-the-macos-guest-mise-store`.
- [x] 1.2 Remove the Unreleased Changelog line that announced the shared macOS store, which was
      never released; done when the Changelog's format check passes. The line is removed and the
      format check passes (2026-11-22 08:00).
