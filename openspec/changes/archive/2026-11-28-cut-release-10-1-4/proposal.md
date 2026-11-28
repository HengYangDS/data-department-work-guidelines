## Why

The narration landed on `dev` on 2026-11-28 retells grades and tiers purpose first without changing
a rule, and the book and the recruitment materials need a release to cite. The department head
decided on 2026-11-28 to release it as 10.1.4. `VERSION` still names 10.1.3 and the notes wait under
`Unreleased`.

## What Changes

- Set `VERSION` to 10.1.4.
- Date the `Unreleased` notes as `[10.1.4]` and open a new empty `Unreleased`.

The guidance itself does not change in this Change; the release then follows the release contract in
`docs/governance/change-and-release.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This Change edits the release identity and notes only and uses the official no-spec marker.

## Impact

`VERSION` and `CHANGELOG.md` only. The signed `v10.1.4` tag, the Forges' Releases and their
observation follow the landed source and are not tasks of this Change.
