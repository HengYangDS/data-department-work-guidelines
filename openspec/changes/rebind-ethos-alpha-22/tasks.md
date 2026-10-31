## 1. Runtime

- [ ] 1.1 Replace the 0.2.0-alpha.21 declaration in `.config/mise/config.toml` with the one published with 0.2.0-alpha.22, checked against the release's `SHA256SUMS`, and lock it again with native `mise lock`; done when the lock holds 0.2.0-alpha.22 for linux-arm64, linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-alpha.21 entry remains, and the lock names only ETHOS.
- [ ] 1.2 Bind the repository family to the 0.2.0-alpha.22 runtime with the locked console's `hook install`, keeping 0.2.0-alpha.21 as the rollback; done when `ethos status` reports the lane ready under the 0.2.0-alpha.22 runtime.

## 2. Hosted supply

- [ ] 2.1 Stage Mise 2026.10.24's installer and Linux ARM64 archive in the project's GitLab package registry; done when both files equal the release's published asset digests and `SHASUMS256.txt` and read back unchanged.
- [ ] 2.2 Move `[supply] mise_version`, GitLab's Linux bootstrap, `.config/mise/install.sha256`, `min_version` and Contributing's floor to Mise 2026.10.24, and GitLab's Linux image to the current `node:26-trixie` digest, then generate both pipelines again; done when `ethos lane project --check --json` reports no drift.
- [ ] 2.3 Record the moves under Changed in the Changelog; done when the repository check passes.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest and GitLab's Linux and macOS review jobs for that exact commit. GitLab's Windows ARM64 review job stays outside the acceptance, as `rebind-ethos-alpha-21` recorded under DR-0005.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected Linux and macOS jobs on the landed head, and retire the proposal refs and the lane.
