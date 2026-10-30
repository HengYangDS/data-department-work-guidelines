## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.20 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.21, checked against the release's `SHA256SUMS`, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.21 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.20 entry remains, and the lock names only ETHOS.
- [x] 1.2 Bind the repository family to the 0.2.0-alpha.21 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.20 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.21 runtime.
- [x] 1.3 State in `docs/governance/README.md` that GitLab's Windows ARM64 runners install the release's Windows ARM64 archive; done when the prose, Markdown lint and link gates pass.
- [x] 1.4 Record the move under Changed in the Changelog; done when the repository check passes.

## 2. Hosted qualification

- [ ] 2.1 Publish the implementation head as a proposal to both Forges; done when GitHub's `verify` jobs pass on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest, and GitLab's review jobs pass on Linux, macOS and Windows ARM64, for that exact commit.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as the proposal again and wait for both Forges' proposal jobs on that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected Linux, macOS and Windows ARM64 jobs on the landed head, and retire the proposal refs and the lane.
