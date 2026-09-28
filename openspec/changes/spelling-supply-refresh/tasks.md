# Tasks

## 1. Repair the locked spelling check

- [x] 1.1 Add an ignored-file `--force-check --file` regression to the existing
      documentation tests; run it with CSpell 10.3.4 and verify that its
      zero-file exit fails the test.
- [x] 1.2 Pin stable CSpell 10.3.5 and regenerate only its required lock
      closure; verify `npm ci --ignore-scripts`, the focused regression,
      `npm run prose`, and an online `npm audit --audit-level=moderate`.

## 2. Bind the patch edition and offline supply

- [x] 2.1 Prepare `v5.0.4` in `VERSION`, the charter, Changelog, and bundle
      identity; verify the repository version/Changelog and bundle-input
      contract tests agree without altering older tags.
- [x] 2.2 Build and inspect one bundle from the new lock and pinned lychee
      archives; verify its SHA-256 and perform a fresh macOS offline install
      followed by the full repository verifier with no remote tool supply.

## 3. Accept the source

- [x] 3.1 Run the full repository verifier, strict official OpenSpec validation,
      and `git diff --check`; verify no check skips the hostile spelling case
      or depends on `node_modules/` being tracked.
- [ ] 3.2 Commit the exact source with the required signature; verify ETHOS
      changed-path attribution and full proof against that HEAD before asking
      the native archive transition to close this source-only Change.
