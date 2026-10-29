# Tasks

## 1. Toolkit retirement

- [ ] 1.1 Remove `tools/`, `tests/`, `package.json`, `package-lock.json`, `.config/npm/`, `.config/checks/dependencies/` and `.github/workflows/offline-verify.yml`. Done when `git ls-files` lists none of them and no current guide or configuration names a removed path.
- [ ] 1.2 Remove the profile's gates, declare `mise install --locked` as the local installation command, and drop Node and npm from the Mise configuration and lock. Done when `ethos status --json` passes and the lock names only ETHOS.
- [ ] 1.3 Remove the supply checks, dependency evidence and GitLab offline jobs from the CI parameters and source, and regenerate both projections. Done when `ethos lane project --check --json` reports no drift.

## 2. Guidance and specifications

- [ ] 2.1 Rewrite Contributing, repository governance and the configuration map for the toolkit-free route. Done when no current guide names a removed command, file or check, and the prose, Markdown lint and link gates pass.
- [ ] 2.2 State `Unreleased` as the net change since 7.0.12. Done when no entry announces a toolkit part that this Change removes and installed ETHOS accepts the Changelog.
- [ ] 2.3 Write the spec deltas: retire `tool-supply` and move its three remaining duties. Done when `openspec validate retire-maintenance-toolkit --strict` passes and a simulated archive validates every remaining spec strictly.

## 3. Verification

- [ ] 3.1 Prove the committed head with `ethos prove --execute --full --change retire-maintenance-toolkit`. Done when the proof passes.
- [ ] 3.2 Run GitHub's hosted `verify` jobs on the proposal ref. Done when all four platforms pass at the proved head.
- [ ] 3.3 Run GitLab's review jobs on the proposal ref. Done when the Linux, macOS and Windows review jobs are observed at the proved head, or the unavailable observation is recorded under DR-0005.
