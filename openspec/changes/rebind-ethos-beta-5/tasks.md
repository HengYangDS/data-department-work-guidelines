## 1. Runtime

- [x] 1.1 Replace the 0.2.0-beta.4 declaration in `.config/mise/config.toml` with the one published with 0.2.0-beta.5, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-beta.5 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-beta.4 entry remains, and the lock names only ETHOS. The release read back with all five platforms, each declaration checksum equal to `SHA256SUMS` and to the asset digest. Native `mise lock` exited 0, and the lock holds only 0.2.0-beta.5, whose five platform checksums equal `SHA256SUMS`.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.5 runtime with the locked console's `hook install`, keeping 0.2.0-beta.4 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-beta.5 runtime. The locked console reports 0.2.0-beta.5 (`da5b278057c9`, OpenSpec 1.16.0), and `hook install` binds the family to runtime `a4492b26ceca` with rollback `188a01e193d0` (0.2.0-beta.4). `status` passes; the lane is dirty only with this Change's edits.
- [x] 1.3 Record the move under Changed in the Changelog; done when the repository check passes. The Changelog names 0.2.0-beta.5 under Changed. The ETHOS format, projection, Markdown, prose, OpenSpec, configuration and documentation checks pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe the protected jobs on the landed head, and retire the proposal refs and the lane.
