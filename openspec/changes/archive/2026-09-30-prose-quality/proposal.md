# Proposal

## Why

The repository promises prose quality, but `npm run prose` checks only spelling.
It cannot catch repeated words, wordy phrases, clichés, or inconsistent technical
terms. These are concrete gaps in the user-approved English writing standard.

## What Changes

- Add locked textlint kernel, Markdown support, and maintained terminology and
  English style rules to the existing Node verification entrypoint.
- Check current authored Markdown with the same native parser and rules locally,
  in the default document proof path, and on both Forges; preserve code, link
  targets, and archived historical text.
- Keep exact semantics, intentional uncertainty, responsibility, and decision
  boundaries intact while correcting only diagnosed writing defects.
- Extend the source-bound offline bundle and prove actual complete offline use
  on every declared platform before a compatible v6.1.0 release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: prose checks include native English style and terminology, not only
  spelling, without claiming semantic equivalence or team adoption.

## Impact

The npm manifest and lock, native rule configuration under `.config/tools`,
existing document verifier and tests, contributor guidance, release identity,
and offline supply change. Department obligations and reader routes remain
unchanged. Existing published tags and assets are immutable. ETHOS retains
lifecycle, admission, native proof, and publication authority.
