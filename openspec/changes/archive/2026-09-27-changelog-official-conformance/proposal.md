# Proposal

## Why

The changelog gate rejects forms shown by Keep a Changelog 1.1.0 itself: a
`[YANKED]` release marker, valid category orderings, and a first release linked
directly to its tag. A quality gate that rejects its declared standard gives
contributors false failures and makes the standard claim unreliable.

## What Changes

- Admit the official optional `[YANKED]` suffix on dated release headings.
- Accept the six standard change categories in any order while rejecting an
  unknown or repeated category within a section.
- Accept a direct tag link for the oldest tagged release, with the same exact
  tag identity checks as a comparison link. Keep ancestry checks for all
  comparison links and the existing prepared-release rules.
- Add positive and negative regressions and explain the supported grammar in
  the existing governance spec and contributor guidance.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: the quality gate accepts officially valid changelog
  forms without relaxing version identity, release ordering, link identity, or
  tag coverage.

## Impact

This patch release affects the existing changelog parser, its tests, the
`repository-governance` spec, and the contributor route. It does not alter
department work rules, existing tags or Forge assets, or ETHOS authority.
Human editorial review still owns whether entries are useful and complete.
