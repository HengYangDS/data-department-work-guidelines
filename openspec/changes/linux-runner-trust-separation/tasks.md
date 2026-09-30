# Tasks

- [x] Confirm the live Linux trust-boundary defect against Runner metadata,
      actual proposal/MR and protected job assignments, and the current CI source.
- [ ] Fleet supplies and verifies separate Linux review and protected Runner
      capabilities, including protected access, separate accounts, roots, caches,
      and a reversible switch. This is an external prerequisite, not repository
      proof.
- [x] Amend the repository-governance requirement and GitLab job graph so Linux
      review, protected source, and protected offline routes cannot share a Runner
      selector. Add static positive and negative regression tests.
- [ ] Update reader guidance and release identity without creating a second CI
      implementation. Run format, lint, prose, links, the full repository verifier,
      official OpenSpec strict validation, and installed ETHOS plan/proof on the
      exact committed source.
- [ ] Observe real GitLab review and protected jobs on the proposed source and
      a negative untrusted request for the protected capability. Recheck the Runner
      IDs, roots, caches, and protected-ref policy; local YAML tests are not this
      evidence.
- [ ] Land through ETHOS, verify both Forge source matrices at the release-cut
      commit, publish one signed SemVer tag and matching offline asset on each
      Forge, and observe each declared post-publication matrix and asset digest.
- [ ] Complete official Change archive, refresh exact-HEAD proof and remote
      observations, retire the owned Work Lane and merged proposal refs, and verify
      no temporary Runner or repository residue remains.
