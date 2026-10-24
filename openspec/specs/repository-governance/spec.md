# repository-governance Specification

## Purpose

Define Change authority, source acceptance, task form, signed identity, and
evidence boundaries without creating a second authority beside ETHOS and
official OpenSpec.

## Requirements

### Requirement: Repository reuse rights have one MIT grant

The repository SHALL include one standard MIT license granting reuse of its
source and documentation and naming its copyright holder. Its public entry
SHALL link to that grant. Any retained package metadata SHALL declare MIT
consistently. Verification SHALL reject missing or inconsistent license
declarations and SHALL NOT infer rights from visibility. A documentation-only
repository SHALL NOT retain a package solely to carry license metadata.

#### Scenario: A reader checks reuse rights

- **WHEN** a reader opens the repository's public entry
- **THEN** the entry leads to the standard MIT license
- **AND** any retained package metadata declares the same SPDX identifier
- **AND THEN** no unaccepted draft license is presented as current.

#### Scenario: License metadata diverges

- **WHEN** the license file, public entry, or retained package metadata disagrees
  about the grant
- **THEN** repository verification rejects the source
- **AND THEN** a public Git remote alone does not override the discrepancy.

#### Scenario: Shared maintenance replaces the private package

- **WHEN** accepted installed ETHOS consumers replace the private maintenance
  package and its metadata is retired in the same migration
- **THEN** the repository retains its standard MIT license and public license link
- **AND** verification checks those actual declarations without requiring a dummy
  package or treating the absent package metadata as a conflicting grant.

### Requirement: Contributor exclusions travel with source

Tracked native Git ignore policy SHALL exclude untracked editor state and Finder
metadata in a fresh clone without ambient or Git-common exclusions. Tracked
guidance SHALL remain selected; local exclusions SHALL NOT establish portability.

#### Scenario: A contributor opens a fresh clone in an editor

- **WHEN** editor state or Finder metadata appears in a fresh repository using
  its tracked ignore policy and no personal exclusions
- **THEN** native Git excludes those untracked files and retains tracked guidance
- **AND** the repository adds no controller or quality gate for that selection.

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

### Requirement: DDWG selects native source and branch parameters

DDWG SHALL inherit ETHOS's fixed branch roles and mandatory SSH signatures
without restating them. Its release declaration SHALL bind the accepted
fast-forward mirror and publication peers. Published branches SHALL be limited
to `dev`, `main`, and `proposal/*`; release tags SHALL follow the native signed
release contract. Official OpenSpec SHALL own material intent and task progress;
native contracts SHALL own admission, proof, history repair, and closure.

#### Scenario: A contributor changes tracked source

- **WHEN** the contributor selects this active Change and its owned leased lane
- **THEN** native admission binds the exact source, paths, actor, and current state
- **AND** reader guidance and local checks do not grant additional authority.

#### Scenario: A local working branch is offered for publication

- **WHEN** the publication route selects `work/*` or `candidate/dev`
- **THEN** the accepted native branch policy refuses that remote effect
- **AND** a declared proposal may proceed only under its actual admission.

#### Scenario: A document version tag is selected

- **WHEN** publication selects a declared document version tag rather than a branch
- **THEN** the native signed release contract governs its admission and source
  version; the branch allowlist does not exclude it
- **AND** a matching tag name alone does not prove its signature, source acceptance,
  publication, or any peer's release checks.

#### Scenario: The completed Change is archived

- **WHEN** the official lifecycle creates a later archive object
- **THEN** its actual native proof, signature, publication, and lane retirement
  are separately observed at their new source binding
- **AND** earlier checks and historical task state do not certify those effects.
