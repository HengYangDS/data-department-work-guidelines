# Spec

## ADDED Requirements

### Requirement: Archived Change carriers have canonical identity

A documentation adopter SHALL name every archived OpenSpec Change as
`YYYY-MM-DD-<date-free-logical-id>`. A historical Change's logical identifier
MAY remain in claims, Chronicles, evidence IDs, and historical command records,
but its archive directory SHALL NOT retain a second temporal suffix. A path-only
identity normalization SHALL preserve the historic record and SHALL NOT be
reported as a fresh archive, proof, accepted closeout, publication, or hosted
execution result.

#### Scenario: Historical archive path is normalized

- **WHEN** an archive directory has one archive-date prefix and a logical ID
  with a trailing temporal suffix
- **THEN** the repository moves that carrier to the canonical archive path
- **AND THEN** carrier-location references resolve to that one path
- **AND THEN** the historical Change ID, dated observation, and external-evidence
  boundary remain unchanged.

#### Scenario: Duplicate legacy carrier is forbidden

- **WHEN** a canonical archive path exists for a logical Change
- **THEN** the former noncanonical archive path is absent
- **AND THEN** the repository archive audit reports no identity ambiguity.
