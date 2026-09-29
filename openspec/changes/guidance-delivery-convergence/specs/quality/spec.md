# Spec Delta

## ADDED Requirements

### Requirement: Reader guidance separates visible content from registry metadata

Current guidance SHALL present its title and task-facing content before any
machine-only registry fields in ordinary GitLab and GitHub Markdown rendering.
ETHOS SHALL still be able to identify each document's subject, role, state, and
relations through its accepted product contract. The repository SHALL NOT
introduce a private metadata schema, duplicate page, or second governance
command to achieve this presentation.

#### Scenario: A reader opens a current guidance page

- **WHEN** a member or Agent opens a current topic or task map in either Forge
- **THEN** the visible page begins with its title and reader-facing route
- **AND THEN** internal metadata does not appear as a table or preamble before
  the title.

#### Scenario: Metadata is removed without a product replacement

- **WHEN** a proposed edit hides or removes metadata from a current document
  before ETHOS accepts its replacement representation
- **THEN** installed-product registry validation or repository admission rejects
  the edit
- **AND THEN** a local rendering improvement alone cannot authorize the change.
