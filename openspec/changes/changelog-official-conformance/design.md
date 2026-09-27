# Design

## Context

The existing parser already checks strict SemVer, dates, version order,
annotated local tags, prepared-release identity, and comparison ancestry. The
official Keep a Changelog 1.1.0 examples also show `[YANKED]`, varying
category order, and a direct tag link for the first release. See the
[proposal](proposal.md) for the user-facing failure.

## Goals / Non-Goals

- Admit only the demonstrated standard forms while preserving the repository's
  stricter release identity and ancestry guarantees.
- Keep human judgments about prose quality and release compatibility outside
  the parser.
- Do not make the current changelog use every admitted form merely to prove
  support, or rewrite existing signed tags and release history.

## Decisions

### Parse the yanked marker as a narrow optional heading suffix

Accept the exact uppercase bracketed marker after the date, matching the
official example. Treat other suffixes as malformed. The release's version
and date continue to drive ordering and tag checks; a marker does not create
a second version identity. A broad free-text suffix would hide misspelled or
unsupported status labels.

### Validate category membership and uniqueness, not list position

The official six-category list defines names, not a required sequence. Keep
the list as the allowed vocabulary and reject duplicate names within a
release. The previous position check added a private rule not present in the
declared standard.

### Make the first-release tag link an exact exception

For each release link, distinguish comparison and direct-tag paths. A direct
tag path is valid only for the oldest release section, only when its annotated
local tag exists, and only when the URL names that exact `vVERSION`. All
comparison links retain their two-ref syntax, tag endpoint, and ancestry
checks. This is narrower than accepting arbitrary release pages or dropping
the existing comparison contract.

## Risks / Trade-offs

- A parser can prove structure and local identity, not that a remote URL
  serves the expected page or that prose is useful. Offline lychee and human
  editorial review remain separate checks.
- A direct tag link for an old release is less informative than a comparison;
  it is allowed where no predecessor exists, not preferred for later releases.

## Migration Plan

Add failing regression cases, update the parser and spec, then run the focused
tests and full repository verifier. Keep the active Change open through local
landing and any separately chosen release. Revert the parser change if the
regressions or full proof fail; existing changelog entries need no migration.
