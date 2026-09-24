# Spec Delta

## MODIFIED Requirements

### Requirement: Historical claims remain honest

A historical claim with no real historic Change carrier SHALL remain historical
and digest-bound. It SHALL NOT receive a new `change_id` merely to make prior
work appear lifecycle-compliant.

Archiving a Change SHALL NOT by itself prescribe a Claim's state. A dated
provenance annotation MAY be corrected after its original carrier moves, while
preserving its original Change ID and evidence digest. Repository tests SHALL
NOT infer Claim state solely from an archive path.

#### Scenario: Pre-lifecycle record is retained

- **WHEN** a July 12 historical record is retained after this repair
- **THEN** it makes no current readiness, archive, or remote-publication claim
- **AND THEN** it is not rebound to the current Change.

#### Scenario: A real archived carrier receives a corrected annotation

- **WHEN** the original Change is observed in its official archive and its dated
  provenance annotation is corrected
- **THEN** the reference names that observed archive and retains the original
  Change ID, Chronicle body, and evidence digest
- **AND THEN** the Claim state follows the meaning of that record, not a rule
  inferred from directory placement.
