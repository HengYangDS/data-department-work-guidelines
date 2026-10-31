## 1. Runtime

- [ ] 1.1 Replace the 0.2.0-alpha.24 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.25, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.25 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.24 entry remains, and the lock names only ETHOS.
- [ ] 1.2 Bind the repository family to the 0.2.0-alpha.25 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.24 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.25 runtime.
- [ ] 1.3 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux and macOS review jobs for that exact commit. Observe GitLab's Windows ARM64 review job; its acceptance returns through its own Change.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
