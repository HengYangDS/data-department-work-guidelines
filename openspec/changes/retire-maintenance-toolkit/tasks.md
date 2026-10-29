# Tasks

## 1. Toolkit retirement

- [x] 1.1 Remove `tools/`, `tests/`, `package.json`, `package-lock.json`, `.config/npm/`, `.config/checks/dependencies/` and `.github/workflows/offline-verify.yml`. Done when `git ls-files` lists none of them and no current guide or configuration names a removed path.
- [x] 1.2 Remove the profile's gates, declare `mise install --locked` as the local installation command, and drop Node and npm from the Mise configuration and lock. Done when `ethos status --json` passes and the lock names only ETHOS.
- [x] 1.3 Remove the supply checks, dependency evidence and GitLab offline jobs from the CI parameters and source, and regenerate both projections. Done when `ethos lane project --check --json` reports no drift.

## 2. Guidance and specifications

- [x] 2.1 Rewrite Contributing, repository governance and the configuration map for the toolkit-free route. Done when no current guide names a removed command, file or check, and the prose, Markdown lint and link gates pass.
- [x] 2.2 State `Unreleased` as the net change since 7.0.12. Done when no entry announces a toolkit part that this Change removes and installed ETHOS accepts the Changelog.
- [x] 2.3 Write the spec deltas: retire `tool-supply` and move its three remaining duties. Done when `openspec validate retire-maintenance-toolkit --strict` passes and a simulated archive validates every remaining spec strictly.

## 3. Hosted qualification

- [ ] 3.1 Publish the implementation head as a proposal to GitHub. Done when its `verify` job passes on ubuntu-latest, ubuntu-24.04-arm, macos-latest and windows-latest for that exact commit.
- [ ] 3.2 Publish the same head as a proposal to GitLab. Done when its Linux, macOS and Windows review jobs are observed for that exact commit, or the unavailable observation is recorded under DR-0005.

## Workflow follow-up

- After 3.1 and 3.2, archive this Change, prove the archived head once, then land, close out and publish `dev` and `main` to both peers.
