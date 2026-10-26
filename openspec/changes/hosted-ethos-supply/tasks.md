## 1. Hosted ETHOS Supply

- [x] 1.1 Declare the latest published ETHOS release in `.config/mise/config.toml` from its own Mise declaration and lock it with `mise lock`; done when `mise install --locked` installs it on macOS ARM64, its locked console reports that release when run outside a repository, and the lock carries its linux-arm64, linux-x64, macos-arm64 and windows-x64 archives.
- [x] 1.2 Record the restored hosted verification under Fixed in the Changelog; the repository check passes.
- [x] 1.3 Move the locked Node, npm and KaTeX supply and the Mise version of GitHub's hosted runners to their latest stable releases with native `mise lock --bump` and npm's lockfile update, and record it under Changed; done when the dependency audit passes and `check` reports no projection drift.

## 2. Hosted Qualification

- [x] 2.1 Publish the landed head that declares the latest release to GitHub `dev` and `main`; done when its `verify` job passes on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit.

## Workflow follow-up

- Prove the exact head and land it while this Change stays active. Publish `dev` and `main` through the one-time administrator bypass that the design records, then wait for the four `verify` jobs on that commit.
- After 2.1 passes, archive this Change and prove the archived head. Publish it as a proposal, wait for its four `verify` jobs, then land, close out and publish `dev` and `main` to GitHub.
