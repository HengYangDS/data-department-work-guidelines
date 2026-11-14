## 1. Runtime

- [x] 1.1 Replace the 0.2.0-beta.9 declaration in `.config/mise/config.toml` with the one published
      with 0.2.0-beta.10, checked against the release's `SHA256SUMS` and asset digests, and lock it
      again with native `mise lock`; done when the lock holds 0.2.0-beta.10 for linux-arm64,
      linux-x64, macos-arm64, windows-arm64 and windows-x64, no 0.2.0-beta.9 entry remains, the lock
      names only ETHOS and it keeps `lockfile_version = 3`. The declaration is the release's own
      file (`sha256:2163ceaa…`), read back against `SHA256SUMS` and the five asset digests; the lock
      holds 0.2.0-beta.10 for the five platforms, names only ETHOS and keeps `lockfile_version = 3`.
- [x] 1.2 Bind the repository family to the 0.2.0-beta.10 runtime with the locked console's
      `hook install`, keeping 0.2.0-beta.9 as the rollback; done when `ethos status` reports the
      lane ready under the 0.2.0-beta.10 runtime. CURRENT names the 0.2.0-beta.10 runtime
      `526c2ebafeba` and ROLLBACK the 0.2.0-beta.9 runtime `9427601ab2b1`; `ethos status` reports
      pass in the lane.
- [x] 1.3 Check both pipelines against the 0.2.0-beta.10 common model; done when
      `ethos lane project --check --json` reports both projections conforming. Under the
      0.2.0-beta.10 runtime `ethos lane project --check --json` reports both projections conforming.
- [x] 1.4 Record the move and the declared release age under Changed in the Changelog; done when the
      repository check passes. The Unreleased section names ETHOS 0.2.0-beta.10, the declared
      release age and Mise 2026.11.8; the format check and the `markdown-lint`, `prose`, `openspec`,
      `config-quality` and `docs-registry` gates pass.

## 2. Release age

- [x] 2.1 Declare `minimum_release_age = "0h"` under `[settings]` in `.config/mise/config.toml`;
      done when `mise settings get minimum_release_age` reports `0h` in the repository and
      `mise install --locked` still installs the locked ETHOS release.
      `mise settings get minimum_release_age` reports `0h` in the lane, and `mise install --locked`
      installed the locked ETHOS release during the bind.

## 3. Hosted Mise

- [x] 3.1 Stage Mise 2026.11.8's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged. Package 385: `install.sh` `2c36cbf7…` (17,361 bytes)
      and the archive `b36da3c4…` (62,483,971 bytes), each equal to the release's API digest and the
      archive also to `SHASUMS256.txt`; the registry's digests and the read-back equal them.
- [x] 3.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.8, generate both pipelines again and name the version in the Changelog; done
      when `ethos lane project --check --json` reports both projections conforming. Seven
      occurrences moved in `.config/ci/verification.toml`, `.config/mise/install.sha256` names
      `2c36cbf7…`, both pipelines came from `ethos lane project --apply`, and the check reports both
      projections conforming. GitLab's macOS and Windows jobs use the Mise on their runners, which
      this Change does not move.
- [x] 3.3 Read the tracked lock with the official Mise 2026.11.8 before landing; done when it lists
      the locked tools unchanged and the lock's bytes are unchanged. The official macOS archive,
      whose digest equals the API's and `SHASUMS256.txt`, lists `http:ethos` 0.2.0-beta.10 under
      `MISE_LOCKED=1`; the lock's bytes are unchanged.
