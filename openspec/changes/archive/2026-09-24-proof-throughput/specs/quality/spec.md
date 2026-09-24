# Spec Delta

## MODIFIED Requirements

### Requirement: Default proof and root binding are distinct

The profile default `code_correctness_gates` SHALL be exactly `docs-integrity`
and `markdown-format`, and its profile-native descriptors SHALL be exactly that
same default floor. Repository-root binding SHALL remain mandatory at the
repository adapter and hook boundary and SHALL be exercised by an ordinary
repository-native validation, not by an extra profile descriptor. Repository
validation commands that invoke scripts SHALL use `bash` and SHALL not depend
on executable bits.

#### Scenario: Root-binding contract is audited

- **WHEN** the repository validates `.ethos/profile.toml`
- **THEN** its accepted typed profile parses with exactly the two default gate
  descriptors
- **AND THEN** no optional `repository-root-binding` descriptor is present.

#### Scenario: Root binding is independently exercised

- **WHEN** a contributor runs the repository root-binding validation
- **THEN** it verifies that the adapter audits its own repository root and
  rejects a caller-provided replacement root
- **AND THEN** default proof selection remains unchanged.

### Requirement: Decision records exclude execution logs

Every accepted DR SHALL use a stable `DR-####` identifier and contain exactly
Context, Decision, Alternatives Rejected, Consequences and Boundary, and
Evidence and Revisit. A DR SHALL NOT contain fenced shell execution, prompt
commands, or inline command invocation; ordinary prose and evidence links
remain allowed. The boundary validator SHALL recognize current public ETHOS
command forms and SHALL not classify a conceptual mention or bare evidence path
as an execution command.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the boundary validator rejects the DR
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts the DR.
