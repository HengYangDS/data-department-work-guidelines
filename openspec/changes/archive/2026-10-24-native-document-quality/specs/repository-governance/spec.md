# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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

## REMOVED Requirements

**Reason:** Installed ETHOS and official OpenSpec own branch mirroring,
material-path attribution, publication refusal, Change completion, evidence
retention, commit signing, and commit-message policy; DDWG keeps no code for
them. No installed check rejects progress narration in `tasks.md`, so that
sub-rule leaves without a new owner. The MIT reuse grant remains a repository
choice at its existing owner.

**Migration:** `.ethos/release.toml` and `.ethos/profile.toml` bind the shared
owner, as the branch-parameter requirement above declares. Contributor
exclusions stay in the main specification because the repository's own
`.gitignore` owns them. Publication-peer graph protection stays until the withdrawn publication
tasks return through a new Change. Original requirement and scenario bytes
remain in captured source evidence `640cc1a0f708b9b8411d714f07d084376a8b691469e8518181d213366ab753e6`.

### Requirement: Accepted-to-release fast-forward mirror

### Requirement: ETHOS material-path attribution remains product-owned

### Requirement: Local and remote publication facts are separate

### Requirement: Change completion follows declared obligations

### Requirement: Evidence remains with its producing owner

### Requirement: Repository-generated commits follow the signed source contract

### Requirement: New commit identity and message policy is native

### Requirement: Active task artifacts remain implementation checklists
