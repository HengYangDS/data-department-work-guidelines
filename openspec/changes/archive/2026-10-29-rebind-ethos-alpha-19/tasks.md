## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.18 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.19, checked against the release's `SHA256SUMS`, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.19 for linux-arm64, linux-x64, macos-arm64 and windows-x64, no 0.2.0-alpha.18 entry remains, and every other locked tool is unchanged.
- [x] 1.2 Bind the repository family to the 0.2.0-alpha.19 runtime with the locked console's `hook install --authorize`, keeping 0.2.0-alpha.18 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.19 runtime.
- [x] 1.3 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and wait for its `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, and retire the proposal ref and the lane.
