## 1. Hosted supply

- [x] 1.1 Stage Mise 2026.11.5's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged. Package 377: `install.sh` `ac90f00d…` and the
      archive `146b114c…`.
- [x] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.5, and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming. The check reports
      both conforming.
- [x] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes. The Unreleased bullet now names Mise 2026.11.5; the format check and
      the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates pass.

## 2. Lock compatibility

- [x] 2.1 Read the tracked version-3 lock with the official Mise 2026.11.5 before landing; done when
      it lists the locked tools unchanged and the lock's bytes are unchanged. The macOS archive
      `f69c8a4f…` lists `http:ethos` 0.2.0-beta.6 under `MISE_LOCKED=1`; the lock's bytes are
      unchanged.
