# Spec Delta

## MODIFIED Requirements

### Requirement: DDWG selects native source and branch parameters

DDWG SHALL inherit ETHOS's fixed branch roles and mandatory SSH signatures
without restating them. Its release declaration SHALL bind the accepted
fast-forward mirror and publication peers. Published branches SHALL be limited
to `dev`, `main`, and `proposal/*`; release tags SHALL follow the native signed
release contract. Official OpenSpec SHALL own material intent and task progress;
native contracts SHALL own admission, proof, history repair, and closure.

#### Scenario: A contributor changes tracked source

- **WHEN** the contributor selects an active Change and its owned leased lane
- **THEN** native admission binds the exact source, paths, actor, and current state
- **AND** reader guidance and local checks do not grant additional authority.

#### Scenario: A local working branch is offered for publication

- **WHEN** the publication route selects `work/*` or `candidate/dev`
- **THEN** the accepted native branch policy refuses that remote effect
- **AND** a declared proposal may proceed only under its actual admission.

#### Scenario: A document version tag is selected

- **WHEN** publication selects a declared document version tag rather than a branch
- **THEN** the native signed release contract governs its admission and source
  version; the branch allowlist does not exclude it
- **AND** a matching tag name alone does not prove its signature, source acceptance,
  publication, or any peer's release checks.

#### Scenario: The completed Change is archived

- **WHEN** the official lifecycle creates a later archive object
- **THEN** its actual native proof, signature, publication, and lane retirement
  are separately observed at their new source binding
- **AND** earlier checks and historical task state do not certify those effects.
