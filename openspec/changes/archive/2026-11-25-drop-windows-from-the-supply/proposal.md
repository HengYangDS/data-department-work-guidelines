## Why

The owner decided on 2026-11-25 that no ETHOS-governed repository supports Windows, in CI or in any other respect. Since
10.1.0 this repository's CI runs only on ARM macOS, but its Mise configuration still pins ETHOS's two Windows archives
and locks them, and the verification specification still names a Windows scenario.

## What Changes

- Remove the `windows-arm64` and `windows-x64` rows of the ETHOS pin and the matching lock tables, and drop them from
  `lockfile_platforms`; the macOS and Linux rows stay, since the lock also serves contributors' local installs.
- Reword the verification scenario that kept a Windows title, without naming Windows as a platform.
- Cut 10.1.1.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `verification`: the scenario "Windows verification events share a finite executor" of "Current commands and CI names
  remain executable" says that no job of another platform exists.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock` (through `mise lock`), the verification specification (through
the delta), `VERSION` and `CHANGELOG.md`.
