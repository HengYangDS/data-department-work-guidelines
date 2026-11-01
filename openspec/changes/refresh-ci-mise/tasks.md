## 1. Hosted supply

- [ ] 1.1 Stage Mise 2026.10.25's installer and Linux ARM64 archive in the project's GitLab package registry; done when both files equal the release's published asset digests and `SHASUMS256.txt` and read back unchanged.
- [ ] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256` to Mise 2026.10.25, and generate both pipelines again; done when `ethos lane project --check --json` reports no drift.
- [ ] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- After the 8.0.0 release is tagged, publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs for that exact commit.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
