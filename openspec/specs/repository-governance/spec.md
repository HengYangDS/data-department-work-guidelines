# repository-governance

## Purpose

ETHOS SHALL keep the Repository Lifecycle Governance family cohesive and
separate from adopter-specific semantics.

## Requirements

### Requirement: Family Boundary

The repository-governance family SHALL describe one bounded product concern.

#### Scenario: Family remains bounded

- **WHEN** ETHOS validates repository governance
- **THEN** repository-governance requirements are checked without introducing private
  adopter semantics into the product core

### Requirement: Documentation archive closeout remains proof-bound

A documentation adopter SHALL keep the active Change carrier until the official
OpenSpec archive has completed. After that archive changes the repository tree,
the adopter SHALL run a fresh HEAD-bound local proof before candidate landing or
accepted closeout. Local proof SHALL NOT imply GitLab/GitHub publication,
hosted rendering, or organizational adoption.

#### Scenario: Official archive changes the proof target

- **WHEN** an active documentation-adopter Change is moved by official OpenSpec
  archive
- **THEN** its accepted specification and dated archive carrier SHALL be present
- **AND** only a proof executed at the resulting HEAD may support local land.
