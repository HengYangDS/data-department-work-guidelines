## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.25 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.26, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.26 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.25 entry remains, and the lock names only ETHOS. The declaration equals the release's `ethos-0.2.0-alpha.26.mise.toml`, and each platform checksum equals `SHA256SUMS` and the GitHub asset digest. The lock records the five platforms and no 0.2.0-alpha.25 entry.
- [x] 1.2 Bind the repository family to the 0.2.0-alpha.26 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.25 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.26 runtime. The locked console reports 0.2.0-alpha.26 (`e5f2f1942b25`, OpenSpec 1.16.0), and the family selects runtime `6e38309cd558` with rollback `d69329d72608`.
- [x] 1.3 Generate the pipelines again from the common model; done when `ethos lane project --check --json` reports them conforming and only the `jdx/mise-action` pin moves. The patch changes one line: `jdx/mise-action` `6be3c7ed` to `6612f0ef` (v5.2.5).
- [x] 1.4 Record the move under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
