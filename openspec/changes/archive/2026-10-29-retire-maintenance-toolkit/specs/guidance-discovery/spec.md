# Spec Delta

## MODIFIED Requirements

### Requirement: Governance and decision reading follow the reader's task

Repository governance SHALL route contributors to change authority, publication,
quality, supply, and runner boundaries without duplicating the executable
contributor procedure. Its revised presentation SHALL preserve authority,
obligation strength, permissions, and evidence limits. Decision records SHALL
retain durable choices and meaningful alternatives, with a reviewable basis and
revisit condition; transient implementation work SHALL NOT require a DR.

#### Scenario: A contributor needs one governance boundary

- **WHEN** a contributor needs to edit, publish, prepare ETHOS, or admit a
  runner
- **THEN** the governance entry leads to that boundary and its existing
  procedure
- **AND** the contributor does not need unrelated implementation detail before
  identifying the responsible owner and required evidence.

#### Scenario: A review proposes another decision record

- **WHEN** the existing choice or its official Change already explains the
  rationale, or the proposed record contains a command, task, or release result
- **THEN** the decision register routes to that owner instead of adding a DR
- **AND** existing accepted records preserve identity and choice while
  clarifying their alternatives, consequences, evidence, and revisit conditions.

## ADDED Requirements

### Requirement: Reading guidance is independent of tool installation

Members and Agents SHALL read and apply the guidelines without installing software.
Maintenance SHALL need only installed ETHOS, a separate governance prerequisite. The
repository SHALL ship no package, maintenance toolkit, or offline bundle of its own.

#### Scenario: A reader needs a work rule rather than maintenance tools

- **WHEN** a member or Agent follows a work-guidance route
- **THEN** current documentation is available without any installation
- **AND** Contributing names installed ETHOS as the only maintenance prerequisite.

#### Scenario: A maintenance duty is proposed as repository code

- **WHEN** a candidate adds authored code, a package manifest, or a repository
  proof gate
- **THEN** its official Change names the duty that no installed ETHOS check owns
- **AND** review rejects a duty that an installed check already owns.
