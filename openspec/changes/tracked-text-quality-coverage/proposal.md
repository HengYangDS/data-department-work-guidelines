# Proposal

## Why

The repository promises consistent formatting and one blank line between text
blocks, but its verifier exempts archived OpenSpec Markdown from formatting,
lint, and spacing, and exempts files without filename extensions, such as
`LICENSE`, from spacing.
A repeated blank line in either class currently passes the relevant check.
All 194 present tracked files satisfy the intended spacing rule, and all 138
tracked Markdown files already pass the locked formatter and linter. This is
an admission gap, not a reason to rewrite historical content.

## What Changes

- Apply the existing Prettier and Markdown lint commands to every tracked or
  unignored candidate Markdown file, including official Change archives.
- Apply the existing one-blank-line rule to every decodable repository text
  candidate, including archived files and those without filename extensions.
  Retain the existing
  binary and symlink exclusions.
- Keep spelling, link, and document-metadata checks on current reader material;
  archived records do not become current guidance or a second lifecycle.
- Add negative tests for the formerly exempt paths and prepare a compatible
  patch edition with its source-bound offline bundle and independent Forge
  qualification.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: Extend the existing portable documentation verifier's format,
  lint, and spacing admission across retained repository source without
  promoting archived records to current reader authority.

## Impact

The existing Markdown inventory, verifier, quality tests and specification,
edition identity, Changelog, and offline-bundle identity change. No team work
rule, ETHOS lifecycle contract, dependency version, or published tag is
rewritten. Passing source checks remain distinct from both Forge deliveries,
offline host qualification, and observed team adoption.
