# Tasks

- [x] Confirm the live Linux trust-boundary defect against Runner metadata,
      actual proposal/MR and protected job assignments, and the current CI source.
- [x] Fleet supplies and verifies separate Linux review and protected Runner
      capabilities, including protected access, separate accounts, roots, caches,
      and a reversible switch. This is an external prerequisite, not repository
      proof.
- [x] Amend the repository-governance requirement and GitLab job graph so Linux
      review, protected source, and protected offline routes cannot share a Runner
      selector. Add static positive and negative regression tests.
- [x] Update reader guidance and prepare release identity without a second CI
      implementation. The source check passed 97/97, the bundle inspected, npm
      audit found no vulnerabilities, and official OpenSpec strict passed 4/4.
- [x] Observe GitLab proposal pipeline 8945 and GitHub run 36687928297 at
      source `16a3acc7`; all declared review jobs passed. GitLab negative canary
      8946/46257 stayed unassigned, was canceled, and its ref was deleted.
- [x] Observe protected `dev` pipeline 8948 at accepted source `fe8171d1`:
      Linux job 46262 passed the full verifier on Runner #110, with separate
      Fleet-owned account, daemon, workspace, and cache boundaries.
- [ ] Land through ETHOS, verify both Forge source matrices at the release-cut
      commit, publish one signed SemVer tag and matching offline asset on each
      Forge, and observe each declared post-publication matrix and asset digest.
- [ ] Recheck both Forge refs, source and offline jobs, Release objects, and
      asset digests at the final edition. Retire the absorbed proposal ref before
      requesting official archive; perform post-archive proof and Work Lane
      cleanup through ETHOS rather than making them archive prerequisites.
