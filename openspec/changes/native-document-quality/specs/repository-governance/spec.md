# Spec Delta

## ADDED Requirements

### Requirement: Active task artifacts remain implementation checklists

Active `tasks.md` SHALL follow the official template: numbered groups of bounded
checkbox actions with completion checks. Tasks SHALL own state; specifications
and design SHALL own requirements and choices. Execution results, review
coverage, logs, checkpoints, debugging narratives and acceptance reports SHALL
stay with their producer, referenced but not copied into tasks. Accepted
installed ETHOS SHALL enforce this boundary, not parsing alone, without a private
schema or default gate.

#### Scenario: A parsed checklist contains execution narration

- **WHEN** an active task artifact contains copied execution results or progress
  narration outside a checkbox or indented beneath one
- **THEN** the shared installed ETHOS task-authoring diagnostic rejects that
  artifact through the existing document-quality admission
- **AND** official checkbox counts cannot override that diagnostic.

#### Scenario: A task records an action and its completion check

- **WHEN** an active task follows the selected official template with a bounded
  action, a completion check, and any necessary reference to producer evidence
- **THEN** the shared diagnostic accepts meaningful links, inline verification
  commands, and wrapped action text
- **AND** the official parser remains the owner of task identity and completion.
