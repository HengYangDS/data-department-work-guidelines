# Spec

## ADDED Requirements

### Requirement: Repository boundary validation remains structural

The repository SHALL use its boundary validator only for current document
topology: no live `docs/superpowers/`, no date-named decision records, and
accepted DRs with exactly the five required sections. It SHALL NOT claim to
perform OpenSpec lifecycle, scope admission, claim binding, archive, or proof.

#### Scenario: Method carrier or malformed DR appears

- **WHEN** a staged repository restores `docs/superpowers/`, adds a date-named
  decision record, or changes an accepted DR section set
- **THEN** the boundary validator rejects the structural violation
- **AND THEN** lifecycle authority remains with ETHOS and official OpenSpec.

### Requirement: Decision records exclude execution logs

Every accepted DR SHALL use a stable `DR-####` identifier and contain exactly
Context, Decision, Alternatives Rejected, Consequences and Boundary, and
Evidence and Revisit. A DR SHALL NOT contain fenced shell execution, prompt
commands, or inline command invocation; ordinary prose and evidence links remain
allowed.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR refers to OpenSpec, ETHOS, a script path, or an evidence link in
  natural language
- **THEN** the boundary validator accepts it
- **AND WHEN** it contains a structured command invocation
- **THEN** the validator rejects it.

### Requirement: Default proof and root binding are distinct

The profile default `code_correctness_gates` SHALL be exactly `docs-integrity`
and `markdown-format`. `repository-root-binding` MAY exist as an explicit
repository-native descriptor, but it SHALL not enter the default floor. All
repository-native gate commands SHALL invoke scripts through `bash`.

#### Scenario: Root-binding contract is audited

- **WHEN** a contributor explicitly selects `repository-root-binding`
- **THEN** the descriptor verifies the adapter contract
- **AND THEN** the default proof selection remains unchanged.
