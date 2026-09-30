# Tasks

## 1. Native source contract

- [x] 1.1 Add negative tests proving npm mismatch rejects install, `ci`, and
      run without effects; add positive tests with the declared npm.
      Actual bundled npm 11.19.1 rejects the new source declaration before
      install, `ci`, and run effects; npm 12.1.0 passes native admission.
      Split-prefix Windows selection, early Node-cache access, public acquisition,
      dependency-policy drift, and positive native effects have regression tests.
- [x] 1.2 Declare exact npm through native `devEngines`; update the existing
      ephemeral CI supply, maintained-host guidance, and offline build copies.
- [x] 1.3 Verify native source format, lint, prose, links, negative cases,
      official OpenSpec, dependency signature/audit, and full ETHOS proof.
      Implementation source `e553ecb8` passes 104 tests, 241 registry signatures,
      110 attestations, zero vulnerabilities, 91 live links, and both installed
      ETHOS gates. Its GitHub source matrix `36746037514` passes all three hosts;
      fresh offline installation has 246 equal tracked-file hashes.

## 2. Destination and delivery

- [x] 2.1 Qualify actual npm selection on maintained macOS and Windows accounts
      through the existing fleet owner; run both full source host matrices.
      Destination service identities select npm 12.1.0. Release-cut source
      `fbe42fa3` passes GitLab `9013` and `9014` and GitHub `36746872318`
      and `36746872963` on all declared source hosts.
- [x] 2.2 Prepare v6.0.0, its Changelog, and a matching offline bundle; verify
      a fresh offline install and exact release-cut source before signing.
      Its fresh offline install verifies 246 equal tracked-file hashes and
      104 tests; installed ETHOS proof passes before native tag admission.
- [x] 2.3 Publish identical signed tags and assets on both Forges, compare real
      downloads, and execute all declared offline host jobs.
      Both Forges expose signed tag object `38076837` at release-cut source
      `fbe42fa3`. Actual downloaded assets are 47,446,683 bytes with SHA-256
      `ddf7d0617819250ada2bbd342cbf56290096ee6f47338d1f0fa76eef8cc20a91`.
      GitHub four-host offline run `36747569420` and GitLab three-OS pipeline
      `9016` pass. These results qualify the declared tools, not unrestricted
      upgrades of upstream-constrained transitive dependencies.

Official archive, current proof and publication of the archive commit, and
exact proposal and Work Lane retirement remain required lifecycle closeout.
They are not claimed complete by the implementation task checkboxes.
