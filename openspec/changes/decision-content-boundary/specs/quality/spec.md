# Quality Delta

## MODIFIED Requirements

### Requirement: Decision records exclude execution logs

A DR SHALL use stable `DR-####`, lowercase `dr-####-*.md`, one matching title and
five ordered top-level sections: Context, Decision, Alternatives Rejected,
Consequences and Boundary, Evidence and Revisit. It SHALL retain rationale, not
tasks, readiness, execution or acceptance reports. The locked Markdown AST SHALL
require that title at top level and reject code blocks, commands, task markers
and HTML except the validated leading registry comment under any wrapper or
language label.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the validator rejects the execution content
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts that prose.
- **AND** inline terms, ordinary decision lists/tables and quoted rationale
  remain valid; code and executable examples stay linked at their producer.

#### Scenario: Decision rationale is checked

- **WHEN** a DR contains a transient delivery-state sentence instead of durable
  rationale
- **THEN** repository review moves that state to its owning Change or current
  status surface
- **AND THEN** the DR retains only the enduring choice and revisit trigger.
- **AND** source syntax checks do not replace that editorial judgment or
  ETHOS/OpenSpec lifecycle authority.

#### Scenario: Markdown wrappers cannot hide execution or task progress

- **WHEN** any code block or task marker appears inside a quote, list, long
  fence or indented structure, regardless of a code language label
- **THEN** the existing boundary fails with the source location
- **AND THEN** ordinary decision lists, tables and meaningful links remain valid.

#### Scenario: Parsed headings define the actual decision sections

- **WHEN** heading-like code or a quoted heading stands in for a required
  top-level DR section, or the title contradicts the stable identity
- **THEN** the validator rejects the malformed record
- **AND THEN** command content and task status stay outside the decision carrier.
