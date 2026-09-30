# Tasks

## 1. Resolve the current supply

- [x] 1.1 Check the exact direct npm pins, stable registry tags, Node release,
      lychee release, Action tags, and CI image digest. Distinguish installed
      `node_modules` from the tracked lock.
- [x] 1.2 Probe npm's compatible transitive refresh in an isolated temporary
      directory and inspect the proposed package graph before source writes.
- [x] 1.3 Refresh the tracked lock with npm, inspect the complete diff, run
      `npm ci --ignore-scripts`, `npm audit --audit-level=moderate`, and the full
      documentation verifier.

## 2. Bind and qualify the patch edition

- [x] 2.1 Align `VERSION`, charter edition, Changelog, and the source-bound
      offline bundle record; build and inspect one frozen bundle.
- [x] 2.2 Validate official OpenSpec and the complete repository check;
      exercise an empty-cache offline install and full verification, then
      commit and run exact-HEAD ETHOS proof.
- [ ] 2.3 Follow ETHOS candidate, accepted-root, and publication decisions.
      At the release cut, verify the same source CI on GitLab and GitHub,
      sign and publish `v5.2.2`, then verify both releases, downloaded asset
      hashes, and every declared offline host job.
- [ ] 2.4 Complete official Change archive and exact-HEAD aftercare, then
      retire only this landed Work Lane and verify no owned residue remains.
