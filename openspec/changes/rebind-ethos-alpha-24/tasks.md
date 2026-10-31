## 1. Runtime

- [ ] 1.1 Replace the 0.2.0-alpha.23 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.24, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.24 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.23 entry remains, and the lock names only ETHOS.
- [ ] 1.2 Bind the repository family to the 0.2.0-alpha.24 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.23 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.24 runtime.
- [ ] 1.3 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit; then land, close out, publish `dev` and `main` to GitHub, and retire the proposal ref and the lane.
- GitLab catch-up, because GitLab has been unreachable since 2026-10-31 at about 22:02: publish `dev` and `main` to GitLab once it is reachable again, and observe its protected Linux, macOS and Windows ARM64 jobs on the landed head. The Windows ARM64 acceptance returns through its own Change.
