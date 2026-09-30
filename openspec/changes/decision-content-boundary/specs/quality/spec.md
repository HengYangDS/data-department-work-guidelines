# Quality Delta

## MODIFIED Requirements

### Requirement: Decision records exclude execution logs

A current DR SHALL use a stable `DR-####` identifier, a lowercase `dr-####-*.md`
filename, one matching top-level title, and exactly Context, Decision,
Alternatives Rejected, Consequences and Boundary, and Evidence and Revisit as
ordered top-level level-two sections. A DR SHALL contain only durable rationale,
not task progress, readiness state, command logs, or acceptance reports. The
validator SHALL use the locked native Markdown syntax tree to reject terminal
execution and task markers regardless of quote, list, fence, or indentation
wrappers, while accepting natural-language discussion and evidence links.
Opaque raw HTML SHALL NOT bypass this boundary; only the validated leading
registry comment is admitted. These source properties SHALL NOT replace
editorial review of decision meaning or ETHOS/OpenSpec lifecycle authority.

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

#### Scenario: Markdown wrappers cannot hide execution or task progress

- **WHEN** shell or PowerShell execution appears inside a quote, list, long
  fence or indented code block, or a real Markdown task marker appears
- **THEN** the existing boundary fails with the source location
- **AND THEN** ordinary decision lists, tables and meaningful links remain valid.

#### Scenario: Parsed headings define the actual decision sections

- **WHEN** heading-like code or a quoted heading stands in for a required
  top-level DR section, or the title contradicts the stable identity
- **THEN** the validator rejects the malformed record
- **AND THEN** command content and task status stay outside the decision carrier.
