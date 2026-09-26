# Spec Delta

## ADDED Requirements

### Requirement: Repository reuse rights have one MIT grant

The repository SHALL include one standard MIT license granting reuse of its
source and associated documentation, with the repository copyright holder
identified. Its public entry and private tooling metadata SHALL agree with that
grant. A stale Apache or other competing license declaration SHALL NOT be
published. Source verification SHALL detect a missing or inconsistent license
statement; it SHALL NOT infer rights merely from repository visibility.

#### Scenario: A reader checks reuse rights

- **WHEN** a reader opens the repository's public entry
- **THEN** the entry leads to the standard MIT license and the same SPDX
  identifier is present in the tooling metadata
- **AND THEN** no unaccepted draft license is presented as current.

#### Scenario: License metadata diverges

- **WHEN** the license file, public entry, or tooling metadata disagrees about
  the grant
- **THEN** repository verification rejects the source
- **AND THEN** a public Git remote alone does not override the discrepancy.
