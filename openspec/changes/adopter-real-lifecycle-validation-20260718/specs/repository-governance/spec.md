# Repository Governance Delta

## ADDED Requirements

### Requirement: Real adopter lifecycle validation remains carrier-bound

A documentation adopter SHALL be able to demonstrate material Change admission
in an owned Work Lane through the official OpenSpec lifecycle. The validation
Change SHALL bind a dated active claim and SHALL NOT represent a method package,
document correctness gate, or local test log as the Change carrier.

#### Scenario: Material lifecycle validation is exercised

- **WHEN** a leased Work Lane validates a declared material path
- **THEN** no active Change or an incomplete active Change is rejected by the
  ETHOS command plane
- **AND THEN** a valid official Change with a matching ETHOS-owned companion
  scope admits only its declared material paths

### Requirement: Scope bootstrap remains narrowly controlled

The initial scope companion bootstrap SHALL admit only the exact untracked
`scope.toml` inside one official new Change directory. After that companion is
valid, all further material writes SHALL use ordinary matching scope coverage.

#### Scenario: New Change scope companion is created

- **WHEN** one official no-task Change exists and its exact untracked
  `scope.toml` is requested through prewrite
- **THEN** ETHOS admits that one file for bootstrap
- **AND THEN** an uncovered material path remains rejected until the written
  companion declares matching coverage
