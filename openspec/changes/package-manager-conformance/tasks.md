# Tasks

## 1. Native source contract

- [x] 1.1 Add negative tests proving npm mismatch rejects install, `ci`, and
      run without effects; add positive tests with the declared npm.
      Actual bundled npm 11.19.1 rejects the new source declaration before
      install, `ci`, and run effects; npm 12.1.0 passes native admission.
      The 46 focused CI/offline contracts pass, including dependency-policy
      drift rejection and positive native install and run effects.
- [x] 1.2 Declare exact npm through native `devEngines`; update the existing
      ephemeral CI supply, maintained-host guidance, and offline build copies.
- [ ] 1.3 Verify native source format, lint, prose, links, negative cases,
      official OpenSpec, dependency signature/audit, and full ETHOS proof.

## 2. Destination and delivery

- [ ] 2.1 Qualify actual npm selection on maintained macOS and Windows accounts
      through the existing fleet owner; run both full source host matrices.
- [ ] 2.2 Prepare v6.0.0, its Changelog, and a matching offline bundle; verify
      a fresh offline install and exact release-cut source before signing.
- [ ] 2.3 Publish identical signed tags and assets on both Forges, compare real
      downloads, and execute all declared offline host jobs.

Official archive, current proof and publication of the archive commit, and
exact proposal and Work Lane retirement remain required lifecycle closeout.
They are not claimed complete by the implementation task checkboxes.
