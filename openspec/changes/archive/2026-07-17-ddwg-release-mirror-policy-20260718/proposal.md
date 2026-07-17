# DDWG accepted-to-release mirror policy

## Why

The documentation adopter closes proven candidate work into `dev`, but its
release-facing `main` branch currently remains independent. This leaves the
local branch topology inconsistent with the intended release mirror and makes
the final `main = dev = candidate/dev` claim untrue.

## What Changes

- Configure the repository branch policy with `release_mirror = "accepted_ff"`.
- Define `main` as the local fast-forward mirror of accepted `dev`, updated only
  by governed accepted-root closeout.
- Preserve `candidate/dev` as a local-only candidate train; it SHALL NOT be
  published to GitLab or GitHub.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: require governed accepted-to-release fast-forward
  mirroring and prohibit direct or remote candidate-branch promotion;
  subject=ddwg-local-release-mirror; reuse=extend; change=add;
  facet:lifecycle=land,closeout; facet:surface=workspace,docs,openspec,claim;
  facet:authority=ethos,openspec,claim.

## Out of Scope

- GitLab/GitHub pushes, provider branch-protection changes, hosted CI, or hosted
  rendering.
- Direct `main`, `dev`, or `candidate/dev` ref movement outside ETHOS closeout.
- Any change to `guidelines.md` or organizational-adoption claim.

## Impact

This changes `.ethos/workspace.toml`, repository governance documentation, and
the repository-governance lifecycle specification. It does not publish to any
remote or modify `guidelines.md`.
