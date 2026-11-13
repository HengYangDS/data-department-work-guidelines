## 1. Hosted supply

- [x] 1.1 Stage Mise 2026.11.7's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged. Package 382: `install.sh` `7ea6b46c…` (17,361 bytes)
      and the archive `b8de6c8e…` (62,131,616 bytes), each equal to the release's API digest and the
      archive also to `SHASUMS256.txt`; the registry's digests and the read-back equal them.
- [x] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.7, and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming. Seven occurrences
      moved in `.config/ci/verification.toml`, `.config/mise/install.sha256` names `7ea6b46c…`, and
      the check reports both projections conforming.
- [x] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes. The Unreleased bullet now names Mise 2026.11.7; the format check and
      the `markdown-lint`, `prose`, `openspec`, `config-quality` and `docs-registry` gates pass.

## 2. Lock compatibility

- [x] 2.1 Read the tracked version-3 lock with the official Mise 2026.11.7 before landing; done when
      it lists the locked tools unchanged and the lock's bytes are unchanged. The official macOS
      archive, whose digest equals the API's and `SHASUMS256.txt`, lists `http:ethos` 0.2.0-beta.9
      under `MISE_LOCKED=1`; the lock's bytes are unchanged.

## Workflow follow-up

- Archive this Change and prove the archived head once.
- Publish the archived head as a proposal to GitHub and GitLab, and wait for GitHub's `verify` jobs
  and GitLab's Linux, macOS and Windows review jobs on that head.
- Then land, close out, publish `dev` and `main` to GitHub and GitLab, observe GitLab's protected
  jobs on the landed head, and retire the proposal refs and the lane.
