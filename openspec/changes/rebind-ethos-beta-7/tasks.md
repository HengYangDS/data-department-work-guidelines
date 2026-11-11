## 1. Runtime

- [x] 1.1 Replace the 0.2.0-beta.6 declaration in `.config/mise/config.toml` with the one published
      with 0.2.0-beta.7, checked against the release's `SHA256SUMS` and asset digests, and lock it
      again with native `mise lock`; done when the lock holds 0.2.0-beta.7 for linux-arm64,
      linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-beta.6 entry remains, the lock
      names only ETHOS and it keeps `lockfile_version = 3`. The release read back with all five
      platforms, the lock holds 0.2.0-beta.7 for all five, names only `http:ethos`, keeps
      `lockfile_version = 3` and has no 0.2.0-beta.6 entry.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.7 runtime with the locked console's
      `hook install`, keeping 0.2.0-beta.6 as the rollback; done when `ethos status` reports the
      lane ready under the 0.2.0-beta.7 runtime. The manifest of `CURRENT` names 0.2.0-beta.7
      and that of `ROLLBACK` 0.2.0-beta.6; status after the bind passes, dirty only by the
      lane's edits.
- [x] 1.3 Generate both pipelines again from the 0.2.0-beta.7 common model; done when
      `ethos lane project --check --json` reports both projections conforming. The regenerated
      GitHub workflow moves only `jdx/mise-action` to v5.2.7 (`b44d12e7`); the check reports
      `conforming`.
- [x] 1.4 Record the move under Changed in the Changelog; done when the repository check passes.
      The Changed bullet names 0.2.0-beta.7.
