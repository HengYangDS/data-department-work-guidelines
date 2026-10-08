# Spec Delta

## ADDED Requirements

### Requirement: Contributor exclusions travel with source

Tracked native Git ignore policy SHALL exclude untracked editor state and Finder
metadata in a fresh clone without ambient or Git-common exclusions. Tracked
guidance SHALL remain selected; local exclusions SHALL NOT establish portability.

#### Scenario: A contributor opens a fresh clone in an editor

- **WHEN** editor state or Finder metadata appears in a fresh repository using
  its tracked ignore policy and no personal exclusions
- **THEN** native Git excludes those untracked files and retains tracked guidance
- **AND** the repository adds no controller or quality gate for that selection.

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

## MODIFIED Requirements

### Requirement: Changelog navigation offers both declared Forges

Version headings SHALL stay neutral and locally linkable. One unchanged
Changelog SHALL show explicit GitLab and GitHub history links per section.
Both SHALL identify the same refs at their official
`publication.peers[].forge_repository` coordinates with native provider routes.
Credential-free HTTP or HTTPS SHALL match the deployment. Missing, duplicate,
unused, mislabeled, wrong-repository, or divergent-ref links SHALL fail offline
validation; no redirect or per-Forge rewrite is allowed. Every release comparison
except the oldest SHALL start at its immediately preceding release tag. Native
Git SHALL resolve every history tag to a commit. Selected-tag validation SHALL
bind each evaluated Changelog, version, charter, npm metadata and publication
declaration input to its exact committed bytes, while untagged development
validation remains available.

#### Scenario: A reader chooses either Forge

- **WHEN** the same Changelog source is rendered on GitLab, GitHub, or locally
- **THEN** version headings locate sections in that document without choosing
  an external Forge
- **AND** each section exposes clearly labeled native history links to both
  declared repository identities with identical refs.

#### Scenario: A peer link misdirects the reader

- **WHEN** a peer link is missing, duplicated, mislabeled, unused, points to
  another repository or provider route, includes credentials, or disagrees
  with the other peer's refs
- **THEN** the offline repository check rejects the source
- **AND** an accessible login page or a successful other-peer link does not
  establish that the intended private comparison exists.

#### Scenario: A release comparison skips its predecessor

- **WHEN** a non-oldest section compares its release tag with any base other
  than the immediately preceding versioned release
- **THEN** the Changelog check rejects that incomplete interval
- **AND** both peer links comparing the adjacent release tags remain valid.

#### Scenario: Selected release metadata differs from the commit

- **WHEN** a selected tag identifies HEAD but an evaluated input differs from
  that commit's blob
- **THEN** validation rejects the input with its exact path
- **AND** native Git owns commit and blob identity; valid committed inputs and
  untagged development validation remain available.
