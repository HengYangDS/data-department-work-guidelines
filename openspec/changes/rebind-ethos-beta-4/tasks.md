## 1. Runtime

- [x] 1.1 Replace the 0.2.0-beta.2 declaration in `.config/mise/config.toml` with the one published with 0.2.0-beta.4, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-beta.4 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-beta.2 entry remains, and the lock names only ETHOS. The declaration equals the release's `ethos-0.2.0-beta.4.mise.toml` table for table, and each of its five platform checksums equals `SHA256SUMS` and the GitHub asset digest. `mise lock` checked 5 targets and pruned the 0.2.0-beta.2 entry; the lock holds only `http:ethos` 0.2.0-beta.4, and every platform checksum equals `SHA256SUMS`.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.4 runtime with the locked console's `hook install`, keeping 0.2.0-beta.2 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-beta.4 runtime. The locked console reports 0.2.0-beta.4 (`987674f3ab39`, OpenSpec 1.16.0), and `hook install` binds the family to runtime `188a01e193d0` with rollback `a46f9233d5db` (0.2.0-beta.2). `ethos status` reports the lane under 0.2.0-beta.4, and `ethos lane project --check --json` reports it `conforming`.
- [x] 1.3 Record the move under Changed in the Changelog; done when the repository check passes. The Changelog names 0.2.0-beta.4 under Changed. The ETHOS format, projection, Markdown, prose, OpenSpec, configuration and documentation checks pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
