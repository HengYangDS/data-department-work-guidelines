## 1. Hosted supply

- [x] 1.1 Stage Mise 2026.11.10's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged. Package 408: `install.sh` `e25c67bc…` (17,379 bytes)
      and the archive `af305e1e…` (63,052,602 bytes), each equal to the release's API digest and the
      archive also to `SHASUMS256.txt`; the registry's digests and the read-back equal them.
- [x] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.10, and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming. Seven occurrences
      moved in `.config/ci/verification.toml`, `.config/mise/install.sha256` names `e25c67bc…`, and
      the check reports both projections conforming.
- [x] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes. The Unreleased bullet now names Mise 2026.11.10; the format check and
      the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates pass.

## 2. Lock compatibility

- [x] 2.1 Check the tracked version-3 lock with the official Mise 2026.11.10 before landing; done
      when `mise lock --check` passes and the lock's bytes are unchanged. The official macOS
      archive, whose digest equals the API's and `SHASUMS256.txt`, reports the lock up to date (one
      tool version, five platform entries) and exits 0; the lock's bytes are unchanged.

## Workflow follow-up

- Archive this Change with `rebind-ethos-beta-11` and prove the archived head once.
- Publish the proposal, wait for both forges' review jobs, land, publish `dev` and `main`, and read
  the protected jobs back; then retire the lane.
