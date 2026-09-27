# Tasks

## 1. Contract and regression

- [x] 1.1 Add positive cases for `[YANKED]`, category reordering, and an
      oldest-release tag link, plus negative cases; verify the old parser fails.
- [x] 1.2 Repair the parser without weakening version, tag, or ancestry
      checks; verify the focused changelog test passes.
- [x] 1.3 Update the Change spec delta, contributor explanation, and
      `Unreleased` note; verify source and Change text agree.

## 2. Local acceptance

- [x] 2.1 Verify locally: `npm run verify` passed 71 tests; official
      `openspec validate --all --strict --json` passed 4 items; ETHOS
      `plan --changed` passed with two gates; `git diff --check` passed.
- [ ] 2.2 Commit signed source, run exact-HEAD ETHOS proof, and land the
      accepted change into `dev`; verify `dev` contains the repair.

## 3. Publication and closeout

- [ ] 3.1 Decide and document SemVer impact, then prepare and sign a patch
      release if this public fix is released; verify all version identities agree.
- [ ] 3.2 If released, publish and retrieve identical offline assets on
      GitLab and GitHub; run platform CI and offline checks for the exact tag.
- [ ] 3.3 Archive officially, refresh exact-HEAD proof and remote
      observations, then retire only this landed lane; verify owned cleanup.
