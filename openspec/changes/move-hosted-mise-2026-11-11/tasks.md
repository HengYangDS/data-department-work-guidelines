## 1. Hosted supply

- [x] 1.1 Stage Mise 2026.11.11's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged. Package 409: `install.sh` `1c8f71e3…` (17,379 bytes)
      and the archive `638faf3b…` (61,919,516 bytes), each equal to the release's API digest and the
      archive also to `SHASUMS256.txt`; the registry's digests and the read-back equal them.
- [x] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.11, and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming. Seven occurrences
      moved in `.config/ci/verification.toml`, `.config/mise/install.sha256` names `1c8f71e3…`, and
      the check reports both projections conforming.
- [x] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes. The Unreleased bullet now names Mise 2026.11.11.

## 2. Lock compatibility

- [x] 2.1 Check the tracked version-3 lock with the official Mise 2026.11.11 before landing; done
      when `mise lock --check` passes and the lock's bytes are unchanged. Mise 2026.11.11 reports
      the lock up to date (one tool version, five platform entries) and exits 0; the lock's bytes
      are unchanged.
