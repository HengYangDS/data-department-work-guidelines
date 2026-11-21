## 1. Runtime

- [x] 1.1 Replace the 0.2.0-beta.10 declaration in `.config/mise/config.toml` with the one published
      with 0.2.0-beta.11, checked against the release's `SHA256SUMS` and asset digests, and lock it
      again with native `mise lock`; done when the lock holds 0.2.0-beta.11 for linux-arm64,
      linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-beta.10 entry remains, the
      lock names only ETHOS and it keeps `lockfile_version = 3`. The release's declaration (sha256
      `af619718…`, equal to its API digest) replaced the table unchanged; its five platform
      checksums equal `SHA256SUMS` and the API digests; `mise lock` keeps `lockfile_version = 3` and
      the lock holds only `http:ethos` 0.2.0-beta.11 for the five platforms. The macOS archive's
      GitHub attestation verifies (SLSA provenance v1, `refs/heads/main` at e4d9d04d3).
- [x] 1.2 Bind the repository family to the 0.2.0-beta.11 runtime with the locked console's
      `hook install`, keeping 0.2.0-beta.10 as the rollback; done when `ethos status` reports the
      lane ready under the 0.2.0-beta.11 runtime. CURRENT names the 0.2.0-beta.11 runtime
      `8c663b10…` and ROLLBACK the 0.2.0-beta.10 runtime `526c2eba…`; the locked console reports
      `ethos 0.2.0-beta.11 (0.2.0b11; e4d9d04d36a0; OpenSpec 2.0.0)`.
- [x] 1.3 Regenerate both pipelines from the 0.2.0-beta.11 common model with
      `ethos lane project --apply` after the bind, since no proof or commit refuses the old files;
      done when `ethos lane project --check --json` reports both projections conforming and the
      change adds only the 14-day retention lines. Under the 0.2.0-beta.11 runtime the check first
      reported `generated_projection_drift` for both pipelines; the applied preview added one
      `retention-days: 14` line to the GitHub workflow and six `expire_in: 14 days` lines to the
      GitLab pipeline, and the check now reports both conforming.
- [x] 1.4 Record the move under Changed in the Changelog; done when the repository check passes. The
      Unreleased bullet names ETHOS 0.2.0-beta.11 and the 14-day artifact retention; the format
      check and the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates
      pass.

## 2. Release age

- [x] 2.1 Change `minimum_release_age` from "0h" to "24h" under `[settings]` in
      `.config/mise/config.toml`; done when `mise settings get minimum_release_age` prints `24h` in
      the lane and `mise install --locked` installs the locked tools unchanged. Read in the lane:
      `24h`; the locked install changed no tool.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the proposal, wait for both forges' review jobs, land, publish `dev` and `main`, and read
  the protected jobs back; then retire the lane.
