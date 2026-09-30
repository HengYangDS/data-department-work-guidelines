# Tasks

## 1. Audit and source

- [x] 1.1 Check official stable metadata for all 299 dependency and tool
      identities; verify current direct tools and document parent constraints.
- [x] 1.2 Resolve both npm locks without writing source or installing packages:
      This repository changes only `ignore` to 7.0.11; Proxy lock remains byte-identical.
      Temporary resolution roots are removed; original source hashes are unchanged.
- [x] 1.3 Refresh the repository lock natively, verify a byte-clean second resolution,
      prepare v5.2.4 and its matching Changelog, and rebuild the offline bundle.
      Both native resolutions produce lock SHA-256
      `25d6b431458340e233ec25b848fadb6133184947811e36b29d9a58cab9f78248`.
      The bundle contains 241 packages with all 241 license inventories verified;
      its SHA-256 is
      `05fac29149d4accbbfc073f07072dfca43b8f1d4789c984274bcf8d6bc27abb2`.
      Native npm 12.1.0 verifies 241 registry signatures and 110 attestations;
      its audit reports zero vulnerabilities.
- [x] 1.4 Run signature and vulnerability audits, the full source verifier,
      official OpenSpec, fresh offline installation, and exact-HEAD ETHOS proof.
      Signed source `6e2d0838f764bba7904dd7c54c4cca0b7b615d72` passes all 97
      tests, offline links, format, lint, spelling, and four official OpenSpec items.
      A fresh detached checkout matches all 241 tracked files by SHA-256, installs
      the new bundle offline, and passes the same full verifier. Its exact temporary
      checkout is removed. Installed ETHOS full proof passes at that HEAD; later
      release-cut and archive commits still require their own current proof.

## 2. Delivery and closeout

- [ ] 2.1 Accept and publish the signed source through ETHOS; verify exact refs
      and all declared source jobs on GitLab and GitHub before signing the tag.
- [ ] 2.2 Publish the same signed v5.2.4 tag and immutable offline bundle to both
      Forges, retrieve their assets, and independently compare the actual hashes.
- [ ] 2.3 Execute both offline host matrices at the exact release identity.
- [ ] 2.4 Complete and officially archive this Change, prove and synchronize the
      archive commit, then retire merged proposals and the absorbed Work Lane.
