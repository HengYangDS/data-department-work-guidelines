# Proposal

## Why

The locked CSpell 10.3.4 can exit successfully after checking zero files when
`--force-check --file` names a file matched by `ignorePaths`. This contradicts
the repository's existing requirement that a misspelling cannot be silently
waived by tool configuration. The upstream stable 10.3.5 release repairs this
behavior.

## What Changes

- Pin CSpell 10.3.5 and regenerate the npm lock without changing the declared
  Node/npm support line or unrelated tools.
- Add a negative test that proves `--force-check` checks a misspelled file even
  when an ignore rule matches it.
- Prepare a compatible patch edition and rebuild the source-bound offline
  verification bundle. Qualify the exact package through local checks and both
  independent Forge release paths before claiming distribution.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The accepted quality specification already requires the locked spelling
check to reject real misspellings without a local waiver. This Change repairs
that implementation and supply; it does not change the requirement.

## Impact

The dependency manifest and lock, spelling regression, edition identity,
Changelog, charter edition, offline-bundle manifest, and release asset change.
No team working rule, ETHOS lifecycle contract, or historical release object
changes. A passing local source check does not establish hosted CI, offline
installation, or team adoption.
