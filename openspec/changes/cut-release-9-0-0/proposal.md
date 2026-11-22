## Why

The text repair landed on 2026-11-22 makes the next edition a major version: "important work",
"consequential delegation", "high-impact" work and "important result or decision" now mean L1 or L2
work, so L1 work gains duties, and every rule now states its force. The owner decided on 2026-11-22
to cut v9.0.0. `VERSION` still names 8.0.0 and the edition's notes wait under `Unreleased`; the
edition reaches members only through a release.

## What Changes

- Set `VERSION` to 9.0.0.
- Date the `Unreleased` notes as `[9.0.0]` and open a new empty `Unreleased`; rewrap the one line of
  those notes that runs past the file's 100-column width.

The guidance itself does not change in this Change; the release then follows the release contract in
`docs/governance/change-and-release.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This Change edits the release identity and notes only and uses the official no-spec marker.

## Impact

`VERSION` and `CHANGELOG.md` only. The signed `v9.0.0` tag, the Forges' Releases and their
observation follow the landed source and are not tasks of this Change.
