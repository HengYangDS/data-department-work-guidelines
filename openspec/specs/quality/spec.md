# quality

## Purpose

ETHOS SHALL keep the Quality And Determinism family cohesive and separate from adopter-specific
semantics.

## Requirements

### Requirement: Repository boundary validation remains structural

The repository SHALL reject a live `docs/superpowers/` execution-method tree, a
date-named decision record, or an accepted decision record with malformed
identity or sections. Its boundary validator SHALL NOT claim to perform OpenSpec
lifecycle, material-path admission, proof, archive, or publication. Decision
status SHALL come from record metadata rather than status directories.

#### Scenario: Method carrier or malformed DR appears

- **WHEN** a repository change adds `docs/superpowers/`, a date-named decision
  record, or an accepted DR without its required identity and sections
- **THEN** the repository boundary check rejects that structural violation
- **AND THEN** lifecycle authority remains with ETHOS and official OpenSpec.

### Requirement: Decision records exclude execution logs

A current DR SHALL use a stable `DR-####` identifier, a lowercase `dr-####-*.md`
filename, and exactly Context, Decision, Alternatives Rejected, Consequences and
Boundary, and Evidence and Revisit as level-two sections. A DR SHALL contain
only durable rationale, not task progress, readiness state, command logs, or
acceptance reports. The validator SHALL reject executable shell syntax while
accepting natural-language discussion and evidence links.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the validator rejects the execution content
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts that prose.

#### Scenario: Decision rationale is checked

- **WHEN** a DR contains a transient delivery-state sentence instead of durable
  rationale
- **THEN** repository review moves that state to its owning Change or current
  status surface
- **AND THEN** the DR retains only the enduring choice and revisit trigger.

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

### Requirement: Documentation checks measure supported properties

Documentation validation SHALL check locked Prettier formatting, Markdown lint,
local links and fragments through an offline pinned lychee invocation,
metadata, every present diagram, and current command examples against the
installed public CLI. It SHALL NOT require an arbitrary number of diagrams,
cards, topic pages, or tracked historical evidence files. Representative member
and Agent tasks SHALL be reviewed for correct rule selection and interpretation
limits before claiming reader readiness.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** the repository check or review reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.

### Requirement: Retained repository text uses English

The repository SHALL present retained tracked reader guidance, operational
instructions, decisions, changelog entries, OpenSpec artifacts, code comments,
and test prose in English. Documentation validation SHALL reject CJK characters
in tracked or unignored candidate text files and SHALL report the file and line.
The automated check SHALL complement, not replace, editorial review for clear
English and faithful translation. Git history SHALL remain intact; translating a
currently tracked archived artifact SHALL NOT imply that its earlier form was
English or that earlier work passed a later governance lifecycle.

#### Scenario: A candidate reintroduces Chinese prose

- **WHEN** a tracked or unignored candidate text file contains a CJK character
- **THEN** the documentation gate fails and identifies its file and line
- **AND THEN** the failure does not claim to have assessed translation quality.

#### Scenario: An archived artifact is translated

- **WHEN** an archived OpenSpec artifact's present tracked text is translated
- **THEN** the original Git object remains recoverable and its historical
  meaning and identifiers remain unchanged
- **AND THEN** the translated artifact is not treated as fresh proof or as
  retrospective certification of the original work.
