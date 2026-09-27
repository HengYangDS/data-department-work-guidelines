# Spec Delta

## MODIFIED Requirements

### Requirement: Changelog structure follows Keep a Changelog

`CHANGELOG.md` SHALL follow Keep a Changelog 1.1.0: `Unreleased` first, only
applicable Added, Changed, Deprecated, Removed, Fixed, and Security categories
in any order without repetition within a section; strict SemVer headings,
optional official `[YANKED]` suffixes, real ISO dates, newest-first order, and
version-history links. The quality gate SHALL reject uncategorized prose,
malformed headings, duplicate versions, version disagreement, missing local tag
coverage, and invalid links. It SHALL NOT reject an otherwise valid entry
solely for using an official category order or yanked-release marker.

#### Scenario: Version, changelog, or tag identities diverge

- **WHEN** a heading has a nonstandard or repeated category, invalid date or
  SemVer, duplicates another version, lacks a real history link, omits a local
  tag, or disagrees with `VERSION` or the selected tag's exact source
- **THEN** the repository quality gate rejects the release candidate
- **AND THEN** native ETHOS publication cannot substitute a different version
  or silently treat an untagged earlier edition as a release.

#### Scenario: Official changelog forms are accepted

- **WHEN** a valid dated release heading ends with `[YANKED]`, or standard
  categories appear once each in an order other than their explanatory list
- **THEN** the repository quality gate accepts that structure
- **AND THEN** human review still judges whether the change descriptions are
  useful and whether a yanked release is explained.

### Requirement: Release comparison links bind ancestry and tags

A release comparison base SHALL be an ancestor of its tag or prepared source;
local object presence is insufficient. Tagged comparisons SHALL end at the
tag, not a moving branch. The oldest tagged release MAY instead link directly
to its exact `vVERSION` tag; a prepared or later release SHALL NOT use this
exception. `Unreleased` SHALL compare from a prepared current version or,
otherwise, the latest local release tag. A prepared version section SHALL
compare to prospective `vVERSION`; only that exact missing tag MAY be
unresolved. The same links SHALL remain valid after tagging.

#### Scenario: A prepared link would fail after tagging

- **WHEN** a prepared release leaves changes in `Unreleased`, compares from an
  older tag, or ends its release comparison at a moving branch
- **THEN** the quality gate rejects the source before creating the tag
- **AND THEN** no arbitrary missing ref is treated as a prospective tag.

#### Scenario: A local commit is absent from the published ancestry

- **WHEN** a comparison base resolves in the local object store but is not an
  ancestor of its release tag or prepared source
- **THEN** the repository quality gate rejects that comparison before tagging
- **AND THEN** historical identity repair cannot leave an old object ID in a
  link merely because it resolves on the maintainer's machine.

#### Scenario: The first tagged version has no predecessor

- **WHEN** the oldest tagged release links to its exact annotated tag instead
  of inventing an earlier comparison base
- **THEN** the quality gate accepts the direct tag link
- **AND THEN** a wrong tag, untagged prepared version, or non-oldest release
  cannot use that exception.
