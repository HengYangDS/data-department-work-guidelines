## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.22 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.23, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.23 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.22 entry remains, and the lock names only ETHOS. The declaration equals the release's `ethos-0.2.0-alpha.23.mise.toml` byte for byte, and each platform checksum equals `SHA256SUMS` and the GitHub asset digest. `mise lock` checked the five targets and pruned 0.2.0-alpha.22.
- [x] 1.2 Bind the repository family to the 0.2.0-alpha.23 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.22 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.23 runtime. The locked console reports 0.2.0-alpha.23 (`22657d5019ef`, OpenSpec 1.16.0), and the family selects runtime `28e994e41a38` with rollback `ee171bb07513`.
- [x] 1.3 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux and macOS review jobs for that exact commit. GitLab's Windows ARM64 review job stays outside the acceptance under DR-0005.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected Linux and macOS jobs on the landed head, and retire the proposal refs and the lane.
