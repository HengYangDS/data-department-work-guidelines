# Proposal: DDWG OpenSpec archive identity normalization

## Why

Six July 18 historical OpenSpec archive directories embed a second date suffix
inside their logical Change identifiers. ETHOS now rejects that shape: an archive
must be `YYYY-MM-DD-<date-free-logical-id>`. The carried content and historical
observations are valid records, but their current directory identities prevent
all later lifecycle, proof, and runner work from passing a repository-wide
archive audit.

## What Changes

- Rename the six archived carrier directories to the canonical archive form.
- Update only carrier-location references in their historical claims and
  Chronicles.
- Restore the DDWG typed ETHOS profile required by the current runner and add a
  regression check for the six normalized identities.
- Preserve the existing Change IDs, dates, Chronicle text, task history, Git
  history, evidence digests, and all non-location artifact content.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=OpenSpec archive identifier normalization;
  reuse=extend; change=modify; facet:lifecycle=archive,validation;
  facet:surface=openspec,evidence,tests; facet:authority=openspec,claim,evidence.

## Out of Scope

- Replaying, re-archiving, or certifying the six historical Changes anew.
- Changing historical logical Change IDs, dates, Chronicle observation claims,
  evidence digests, provider-run records, or Git history.
- Deploying, publishing, or using either Forge runner; that remains the
  separately carried dual-Forge runner Change.

## Impact

The repair is constrained to current archive-directory identities, references
that locate those carriers, the typed adopter profile, and a repository-native
identity regression. It unblocks current lifecycle auditing without turning
historic archive observations into fresh proof or Forge evidence.
