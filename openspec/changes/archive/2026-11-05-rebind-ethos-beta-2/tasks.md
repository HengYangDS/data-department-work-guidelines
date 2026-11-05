## 1. Runtime

- [x] 1.1 Replace the 0.2.0-alpha.30 declaration in `.config/mise/config.toml` with the one published with 0.2.0-beta.2, checked against the release's `SHA256SUMS` and asset digests, and lock it again with native `mise lock`; done when the lock holds 0.2.0-beta.2 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.30 entry remains, and the lock names only ETHOS. The declaration equals the release's `ethos-0.2.0-beta.2.mise.toml`, and each platform checksum equals `SHA256SUMS` and the GitHub asset digest. The lock holds no 0.2.0-alpha.30 entry and names only ETHOS.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.2 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.30 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-beta.2 runtime. The locked console reports 0.2.0-beta.2 (`e6010a872292`, OpenSpec 1.16.0), and the family selects runtime `a46f9233d5db` with rollback `8a1918bbdb18`.
- [x] 1.3 Regenerate the CI projection from the common model with `ethos lane project`; done when the two Windows jobs of `.gitlab-ci.yml` gain exactly `GET_SOURCES_ATTEMPTS: "3"` and `ethos lane project --check --json` reports it conforming. `ethos lane project` added exactly `GET_SOURCES_ATTEMPTS: "3"` to the two Windows jobs of `.gitlab-ci.yml`, and `ethos lane project --check --json` reports it `conforming`.
- [x] 1.4 Record the move under Changed in the Changelog; done when the repository check passes. The ETHOS format, projection, Markdown, prose, OpenSpec, configuration and documentation checks pass.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
