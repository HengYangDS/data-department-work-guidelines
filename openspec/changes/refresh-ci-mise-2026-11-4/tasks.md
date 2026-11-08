## 1. Hosted supply

- [x] 1.1 Stage Mise 2026.11.4's installer and Linux ARM64 archive in the project's GitLab package registry; done when both files equal the release's published asset digests and `SHASUMS256.txt` and read back unchanged. Package 374 holds `install.sh` `958e0e92…` and `mise-v2026.11.4-linux-arm64.tar.gz` `e1682488…`; both equal the release's published asset digests and `SHASUMS256.txt` and read back unchanged.
- [x] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256` to Mise 2026.11.4, and generate both pipelines again; done when `ethos lane project --check --json` reports both projections conforming. The regenerated `.github/workflows/ci.yml` and `.gitlab-ci.yml` name Mise 2026.11.4, and the check reports both projections conforming.
- [x] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the repository check passes. The Unreleased bullet now names Mise 2026.11.4; the format check and the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates pass.

## 2. Lock compatibility

- [x] 2.1 Read the tracked version-3 lock with the official Mise 2026.11.4 before landing; done when it lists the locked tools unchanged and the lock's bytes are unchanged. Mise 2026.11.4, whose macOS archive `d37c0138…` equals its API digest and `SHASUMS256.txt`, lists `http:ethos` 0.2.0-beta.6 from the version-3 lock under `MISE_LOCKED=1` in an isolated environment, and the lock's bytes are unchanged.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux, macOS and Windows ARM64 review jobs.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected jobs on the landed head, and retire the proposal refs and the lane.
