## 1. Runtime

- [ ] 1.1 Replace the 0.2.0-beta.11 declaration in `.config/mise/config.toml` with the one published
      with 0.2.0-beta.12, keeping the linux-arm64, linux-x64 and macos-arm64 platforms, checked
      against the release's `SHA256SUMS` and asset digests, and lock it again with native
      `mise lock`; done when the lock holds 0.2.0-beta.12 for those three platforms, no
      0.2.0-beta.11 entry remains, the lock names only ETHOS and it keeps `lockfile_version = 3`.
- [ ] 1.2 Bind the repository family to the 0.2.0-beta.12 runtime with the locked console's
      `hook install`, keeping 0.2.0-beta.11 as the rollback; done when `ethos status` reports the
      lane ready under the 0.2.0-beta.12 runtime.
- [ ] 1.3 Check both pipelines with `ethos lane project --check --json` under the 0.2.0-beta.12
      runtime, applying the previewed projection only if it reports drift; done when the check
      reports both projections conforming.
- [ ] 1.4 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the proposal, wait for both forges' review jobs, land, publish `dev` and `main`, and read
  the protected jobs back; then retire the lane.
