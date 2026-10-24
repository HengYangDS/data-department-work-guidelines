## 1. Hosted ETHOS Supply

- [ ] 1.1 Declare the latest published ETHOS release in `.config/mise/config.toml` from its own Mise declaration and lock it with `mise lock`; done when `mise install --locked` installs it on macOS ARM64, its locked console reports that release when run outside a repository, and the lock carries its linux-arm64, linux-x64, macos-arm64 and windows-x64 archives.
- [x] 1.2 Record the restored hosted verification under Fixed in the Changelog; the repository check passes.

## 2. Hosted Qualification

- [ ] 2.1 Publish the head that declares the latest release as a `proposal/*` branch on GitHub; done when its `verify` job passes on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit.

## Workflow follow-up

- Prove the exact head, archive this Change and prove the archived head. Publish the archived head as the proposal, wait for its four `verify` jobs to pass, then land, close out and publish `dev` and `main` to GitHub.
