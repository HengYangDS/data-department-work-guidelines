## MODIFIED Requirements

### Requirement: DDWG source selects one English reader corpus

DDWG SHALL select its current entrypoints, department topics, decisions,
maintenance guidance, and retained source text through the accepted native
content contract. English and Department terminology SHALL be declared
parameters. Shared tools SHALL enforce their applicable checks; human review
SHALL assess faithful meaning, clarity, and reading quality.

#### Scenario: A member or Agent reads a current topic

- **WHEN** the reader follows the task map to a department work question
- **THEN** one English topic owns its duties, authority, conditions, and limits
- **AND** machine metadata is declared as native YAML front matter for the
  accepted registry, and an H1 identifies the reader-facing title.

#### Scenario: A candidate changes the language or meaning

- **WHEN** a candidate introduces new authored prose outside the declared English
  language or changes a duty
- **THEN** editorial review requires English prose and the existing original-duty
  review assesses the meaning change
- **AND** quoted originals, captured historical text, and meaningful code or data
  literals retain their bytes; a whole-file character blacklist cannot replace
  contextual language review
- **AND** a passing language or style report does not certify translation,
  complete equivalence, or team use.

#### Scenario: Historical source is consulted

- **WHEN** a retained original or earlier commit supports a clause review
- **THEN** it remains a historical input rather than current authority
- **AND** present translation or normalization does not certify its earlier
  language, execution, or lifecycle retrospectively.
