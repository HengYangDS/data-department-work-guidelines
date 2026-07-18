# Tasks

## 1. Establish the material Change

- [x] 1.1 Create the official `ci-checkout-runtime-repair-20260718` Change.
- [x] 1.2 Add the ETHOS-owned `scope.toml` companion covering all actual Change
      surfaces.
- [x] 1.3 Add proposal, design, repository-governance delta, active claim, and
      Chronicle observation with explicit local and hosted-evidence boundaries.

## 2. Replace the broken CI topology

- [x] 2.1 Remove the GitHub job container; checkout on the hosted runner and
      select Node 22 explicitly afterward.
- [x] 2.2 Add Git to GitLab's explicit Docker runtime prerequisites.
- [x] 2.3 Extend the CI contract test for GitHub ordering/container removal,
      GitLab Git availability, shared verifier parity, and workflow syntax.
- [x] 2.4 Update the governance document and unreleased changelog without
      claiming hosted-CI success.

## 3. Verify and close out

- [x] 3.1 Run focused CI contract positive and negative checks plus local YAML
      validation.
- [ ] 3.2 Run docs format/link/render, rollout, topology, layout, scope, strict
      OpenSpec, ETHOS lifecycle, claims, freshness, and exact-HEAD proof.
- [ ] 3.3 Archive through official OpenSpec, rerun exact-HEAD proof, and land to
      the local candidate train and accepted roots.
- [ ] 3.4 Publish only `dev` and `main` to GitLab and GitHub; independently
      observe both hosted CI planes before closing the active claim and retiring
      this owned Work Lane.
