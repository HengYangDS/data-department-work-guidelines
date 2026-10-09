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

### Requirement: Publication peers preserve the governed commit graph

GitLab and GitHub SHALL retain the same signed commit graph, including governed
merge commits. Fast-forward acceptance SHALL advance refs without rewriting
accepted parent provenance. Both `dev` and `main` SHALL remain protected with
required source checks and trusted signatures; force pushes and deletions SHALL
remain prohibited. Provider-specific history rules SHALL admit that graph.

#### Scenario: A governed integration reaches both peers

- **WHEN** an exact signed integration contains a merge commit and passes the
  declared proof and source checks
- **THEN** both peers accept the same commit graph without squashing, rewriting
  accepted history, or bypassing the required checks
- **AND** publication is verified through each exact ref and actual source jobs.

## REMOVED Requirements

### Requirement: Hosted documentation verification begins from a Git checkout

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Per-project dual-Forge runner isolation

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Version identity follows SemVer compatibility

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Changelog structure follows Keep a Changelog

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Release comparison links bind ancestry and tags

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Prepared and published release states remain distinct

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Each Forge supplies its pinned documentation tool independently

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Offline verification supply is a separately observed release asset

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: GitLab Runner image admission matches the source pin

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Offline release archives exclude host metadata

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Release operations are reproducible from the contributor route

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Remote download retention is bounded and truthful

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.

### Requirement: Changelog navigation offers both declared Forges

**Reason**: This requirement belongs to the publication capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/publication/spec.md` through this Change.
