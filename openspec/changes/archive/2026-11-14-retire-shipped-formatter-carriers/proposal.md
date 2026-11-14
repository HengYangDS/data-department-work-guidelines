## Why

The repository tracks two formatter carriers that repeat what installed ETHOS already ships.
`.config/checks/prettier/prettier.toml` is byte for byte the shipped Prettier policy, and every
setting of `.config/checks/taplo/taplo.toml` is in the shipped Taplo policy, which adds one more.
ETHOS always applies its shipped policy and reads a repository carrier only as an increment on top
of it, so these two files change nothing; they are a second copy that can drift. The owner asked on
14 November 2026 that a repeated mechanism in a governed repository give way to the common base,
and the approved common-base design names these carriers as this repository's first step.

`.config/checks/lychee/lychee.toml` stays: it adds `include_fragments`, a real increment.

## What Changes

- Remove `.config/checks/prettier/prettier.toml` and `.config/checks/taplo/taplo.toml`.
- Point the two rows of the configuration map at installed ETHOS, as its other shared rows do.
- Record the removal in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. Formatting is decided by the same settings as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/checks/prettier/prettier.toml`, `.config/checks/taplo/taplo.toml`,
`docs/governance/configuration.md` and `CHANGELOG.md`. No guideline, gate, pipeline or runner
declaration changes. `tasks.md` is the sole progress ledger.
