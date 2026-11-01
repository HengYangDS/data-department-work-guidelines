## Why

`VERSION` has named 8.0.0 since 2026-10-10, and the Changelog has gathered the
edition's notes under `Unreleased`, but no release was cut: v7.0.12 is still
the latest tag on both Forges. The edition's incompatible review duties, reader
routes and the removed maintenance toolkit reach members only through a
release.

## What Changes

- Date the `Unreleased` notes as `[8.0.0]` with both Forges' history links, and
  open a new empty `Unreleased`.
- Consolidate the nine ETHOS supply steps from 0.2.0-alpha.15 to
  0.2.0-alpha.25 into one entry that keeps each step's effect, and correct two
  notes that later changes made stale: the Mise version of the hosted jobs, and
  the GitLab Windows ARM64 jobs that now run the complete verifier.

The guidance itself does not change in this Change; the release then follows
the release contract in `docs/governance/README.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This Change edits release notes only and uses the official no-spec
marker.

## Impact

`CHANGELOG.md` only. The signed `v8.0.0` tag, the Forges' Releases and their
observation follow the landed source and are not tasks of this Change.
