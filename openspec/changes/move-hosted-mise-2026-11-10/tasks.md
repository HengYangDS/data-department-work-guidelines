## 1. Hosted supply

- [ ] 1.1 Stage Mise 2026.11.10's installer and Linux ARM64 archive in the project's GitLab package
      registry; done when both files equal the release's published asset digests and
      `SHASUMS256.txt` and read back unchanged.
- [ ] 1.2 Move `[supply] mise_version`, GitLab's Linux bootstrap and `.config/mise/install.sha256`
      to Mise 2026.11.10, and generate both pipelines again; done when
      `ethos lane project --check --json` reports both projections conforming.
- [ ] 1.3 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes.

## 2. Lock compatibility

- [ ] 2.1 Check the tracked version-3 lock with the official Mise 2026.11.10 before landing; done
      when `mise lock --check` passes and the lock's bytes are unchanged.

## Workflow follow-up

- Archive this Change with `rebind-ethos-beta-11` and prove the archived head once.
- Publish the proposal, wait for both forges' review jobs, land, publish `dev` and `main`, and read
  the protected jobs back; then retire the lane.
