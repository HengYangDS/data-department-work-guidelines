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

- [x] 2.1 Accept and publish the signed source through ETHOS; verify exact refs
      and all declared source jobs on GitLab and GitHub before signing the tag.
      Release-cut source `7dc92dc065a5af1b2804a0169f4ec3221e93e272` has a
      fresh passing full ETHOS proof and identical local and peer `dev`/`main`.
      GitLab pipelines 9003 and 9004 and GitHub run 36734913376 pass all three
      operating systems; the exact GitHub proposal supplies required checks
      before protected publication. Branch protection is unchanged.
- [x] 2.2 Publish the same signed v5.2.4 tag and immutable offline bundle to both
      Forges, retrieve their assets, and independently compare the actual hashes.
      Official release admission creates signed annotated tag object
      `43fbcefebc1f2500b6653279a0a9cb8a0b29db60` at the release-cut source.
      Both remote tag objects match. Each persisted Release exposes the same
      47,446,770-byte bundle; actual independent downloads both hash to
      `05fac29149d4accbbfc073f07072dfca43b8f1d4789c984274bcf8d6bc27abb2`.
      Exact download files are removed after hash comparison.
- [x] 2.3 Execute both offline host matrices at the exact release identity.

All implementation and delivery tasks above are complete. GitHub offline run
36735614969 passes all four hosts; GitLab pipeline 9007 passes all three offline
jobs at the exact release source. Online links pass all 89 checks. One initial
GitHub Linux acquisition failed without useful transport detail; after actual
asset downloads were independently verified, its single bounded rerun passed.
That failure is not presented as a proved source bug or silently erased.

Official archive, proof and publication of the archive commit, and exact
proposal and Work Lane retirement are subsequent lifecycle operations. They
remain required and are verified by their native ETHOS results, not marked
as already performed here.
