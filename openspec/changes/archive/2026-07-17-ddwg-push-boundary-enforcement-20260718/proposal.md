# DDWG remote candidate push boundary

## Why

The repository declares `candidate/dev` local-only, but the pre-push adapter
currently delegates it to generic protected-ref admission. That admission can
succeed, so a normal `git push` may project the candidate train to GitLab or
GitHub despite the declared boundary.

## What Changes

- Reject `refs/heads/candidate/dev` in the local pre-push hook before ETHOS
  protected-ref admission is invoked.
- Add a portable shell regression that supplies Git's stdin protocol and proves
  candidate rejection while preserving delegation for `dev`, `main`, and
  `submit/*`.
- Include the boundary regression in the documentation adopter's exact-HEAD
  proof floor.

## Capabilities

### Modified Capabilities

- `repository-governance`: make the local-only candidate branch a fail-closed
  remote-projection boundary; subject=ddwg-publication-boundary; reuse=extend;
  change=modify; facet:lifecycle=publish; facet:surface=hook,proof,openspec;
  facet:authority=repository,ethos.

## Out of Scope

- Remote provider branch protection, pushes, CI execution, or hosted evidence.
- Changes to `guidelines.md` or release-mirror semantics.
- Altering the ETHOS product implementation or concurrent ETHOS work lanes.
