## 1. Hosted supply

- [x] 1.1 Move `[supply] mise_version` to Mise 2026.11.14 and generate both pipelines again; done
      when `ethos lane project --check --json` reports both projections conforming. The parameter
      moved; the check reports the projections conforming, and the GitHub workflow's Mise line is
      the only generated change.
- [x] 1.2 Record the move under Changed in the Changelog's Unreleased section; done when the
      repository check passes. The Unreleased section names Mise 2026.11.14.

## 2. Lock compatibility

- [x] 2.1 Check the tracked version-3 lock with the official Mise 2026.11.14 before landing; done
      when `mise lock --check` passes and the lock's bytes are unchanged. Mise 2026.11.14 reports
      the lock up to date (one tool version, three platform entries) and exits 0; the lock's bytes are
      unchanged.
