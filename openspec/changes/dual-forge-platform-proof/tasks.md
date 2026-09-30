# Tasks

## 1. Source Contract

- [x] 1.1 Add negative tests for missing GitLab native jobs, wrong capabilities,
      overlapping review/protected routes, Docker defaults, script overrides,
      and bypassed failures; run the Node suite against both old and new graphs.
- [x] 1.2 Add separate native review and protected source jobs that reuse the
      Linux command without its image; suppress duplicate proposal pushes and
      check the allowed graph through GitLab lint and `npm run verify`.
- [x] 1.3 Add native post-publication offline jobs using the same bundle and
      script; cover missing hosts and supply fallback with negative tests, tag
      lint, and the full local verifier.
- [x] 1.4 Correct the governance and contributor claims about runners, supply,
      and evidence; check format, prose, links, and English with `npm run verify`.

## 2. Fleet and Accepted Source

- [x] 2.1 Mirror the pinned macOS ARM64 and Windows x64 lychee archives into
      this GitLab project's registry; retrieve and hash each against the manifest
      without a GitHub fallback.
- [ ] 2.2 Admit project-specific review and protected native runners with
      separate accounts, roots, and caches, the declared Node line, and bounded
      credential transport; verify ARM64 hosts, Windows x64 compatibility, and
      protected-runner readiness with a bounded existing-ref canary.
- [ ] 2.3 Prove the exact Change HEAD with official OpenSpec and installed
      ETHOS, publish a governed proposal, and verify review jobs; then close
      out and verify both Forges' source jobs at the accepted SHA, including
      protected-check refusal on omissions.

## 3. Release and Retirement

- [ ] 3.1 Prepare the appropriate SemVer edition and changelog entry; verify
      source identity and release links before signing the tag.
- [ ] 3.2 Publish one signed tag and digest-matched offline bundle on both
      Forges; check each Forge's Linux, macOS, and Windows post-publication jobs
      against that tag and retrieved asset.
- [ ] 3.3 Archive the Change officially, refresh exact-archive-HEAD proof and
      remote observations, then retire the Work Lane and verify owned residue is
      absent.
