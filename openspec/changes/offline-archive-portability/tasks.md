# Tasks

## 1. Portable archive behavior

- [x] 1.1 Add a macOS archive-metadata regression and a zero-exit warning
      regression; confirm each rejects the old behavior before repair.
- [x] 1.2 Exclude extended attributes at bundle creation and make bundle tar
      operations reject warning output; pass the focused tests and inspect the
      built archive for absent host metadata with unchanged file bytes.
- [x] 1.3 State the warning-free archive contract in the existing contributor
      or governance route; pass Markdown format, links, and repository checks.

## 2. Patch release qualification

- [x] 2.1 Classify and prepare the compatible patch edition in `VERSION`,
      charter, Changelog, and the existing bundle record; pass version, SemVer,
      Changelog, and source-identity tests without changing `v5.0.1`.
- [ ] 2.2 Build the patch archive from its declared inputs and run a clean,
      no-network macOS installation plus the full verifier; match the committed
      digest and observe no archive warning or host metadata.
- [ ] 2.3 Pass `npm run verify`, official OpenSpec strict validation, ETHOS
      changed plan, and exact-HEAD full proof; sign and admit the source commit
      through the governed Work Lane.

## 3. Independent delivery and retirement

- [ ] 3.1 Create the signed patch tag, publish the identical archive through
      GitLab and GitHub, retrieve each Release asset, and verify exact tag objects,
      size, and SHA-256 on both peers.
- [ ] 3.2 Pass the complete no-network offline install and verifier on GitHub
      macOS, Linux x86/ARM, Windows, and the GitLab Linux ARM64 VM for the
      exact tag; inspect each job for archive warnings and the runner identity.
- [ ] 3.3 Officially archive the completed Change, prove the archive commit,
      synchronize accepted `dev` and mirrored `main` on both peers, and retire the
      clean Work Lane after exact housekeeping checks.
