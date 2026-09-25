# Spec Delta

## REMOVED Requirements

### Requirement: Family Boundary

**Reason**: This is an ETHOS product-family assertion, not a DDWG quality
contract.

**Migration**: DDWG quality requirements below describe observable repository
behavior; ETHOS keeps its own product family boundary.

## MODIFIED Requirements

### Requirement: Repository boundary validation remains structural

The repository SHALL reject a live `docs/superpowers/` execution-method tree,
a date-named decision record, or an accepted decision record with malformed
identity or sections. Its boundary validator SHALL NOT claim to perform
OpenSpec lifecycle, material-path admission, proof, archive, or publication.
Decision status SHALL come from record metadata rather than status directories.

#### Scenario: Method carrier or malformed DR appears

- **WHEN** a repository change adds `docs/superpowers/`, a date-named decision
  record, or an accepted DR without its required identity and sections
- **THEN** the repository boundary check rejects that structural violation
- **AND THEN** lifecycle authority remains with ETHOS and official OpenSpec.

### Requirement: Decision records exclude execution logs

A current DR SHALL use a stable `DR-####` identifier, a lowercase
`dr-####-*.md` filename, and exactly Context, Decision, Alternatives Rejected,
Consequences and Boundary, and Evidence and Revisit as level-two sections.
A DR SHALL contain only durable rationale, not task progress, readiness state,
command logs, or acceptance reports. The validator SHALL reject executable
shell syntax while accepting natural-language discussion and evidence links.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the validator rejects the execution content
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts that prose.

#### Scenario: Decision rationale is checked

- **WHEN** a DR contains a transient delivery-state sentence instead of
  durable rationale
- **THEN** repository review moves that state to its owning Change or current
  status surface
- **AND THEN** the DR retains only the enduring choice and revisit trigger.

## ADDED Requirements

### Requirement: Documentation checks measure supported properties

Documentation validation SHALL check format, local links and fragments,
metadata, every present diagram, and current command examples against the
installed public CLI. It SHALL NOT require an arbitrary number of diagrams,
cards, topic pages, or tracked historical evidence files. Representative
member and Agent tasks SHALL be reviewed for correct rule selection and
interpretation limits before claiming reader readiness.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** the repository check or review reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.
