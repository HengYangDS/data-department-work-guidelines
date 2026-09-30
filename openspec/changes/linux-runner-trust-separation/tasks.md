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
- [x] Land through ETHOS and verify both Forges' `dev` and `main` matrices at
      release cut `0743a10e`. Publish signed tag `v5.2.1`; GitLab offline pipeline
      8959 and GitHub offline run 36691464690 passed their declared hosts.
- [x] Recheck both peer refs and Release objects. Independently downloaded
      assets matched SHA-256 `99980979e88f0ce5db238ebee70a5ac5abcc575d04c9d1fdc1ceaeb3813dfdcb`;
      the absorbed proposal ref is absent on both peers. Post-archive proof and
      Work Lane cleanup remain native continuations, not archive prerequisites.
