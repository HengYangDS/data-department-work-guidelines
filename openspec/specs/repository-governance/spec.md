# repository-governance Specification

## Purpose

Define Change authority, source acceptance, task form, signed identity, and
evidence boundaries without creating a second authority beside ETHOS and
official OpenSpec.

## Requirements

### Requirement: Accepted-to-release fast-forward mirror

The documentation adopter SHALL configure `main` as the fast-forward mirror of
accepted `dev`. Only a governed accepted-root closeout of a proved
`candidate/dev` SHA SHALL advance either protected branch; that closeout SHALL
leave `main` and `dev` at the same SHA.

#### Scenario: Proven candidate closes into accepted and release branches

- **WHEN** an exact-HEAD local proof has passed for `candidate/dev`
- **AND** `main` is not ahead of accepted `dev`
- **THEN** governed closeout SHALL fast-forward `dev` and `main` to that SHA

### Requirement: ETHOS material-path attribution remains product-owned

The repository SHALL set `[openspec].material_paths = ["**"]` so new tracked
paths are included. ETHOS prewrite, changed planning, and proof SHALL attribute
each fresh path to the same selected active official Change. `scope.toml`,
Commitment fields, archives, and local carriers SHALL NOT authorize work.
Obsolete companions SHALL leave the current tree; Git history preserves their
objects without retrospective certification.

#### Scenario: Material path is attributed

- **WHEN** the repository evaluates a declared material path with exactly one
  valid selected active Change
- **THEN** admission, planning, and proof report that Change as the path owner
- **AND THEN** no `scope.toml`, Commitment field, archive, or local validator
  participates in authorization.

#### Scenario: Material path has no unique active Change

- **WHEN** no active Change exists, an explicitly selected Change is missing,
  or more than one active Change could own the path
- **THEN** the ETHOS command plane rejects the operation with its current
  missing or ambiguous Change diagnostic
- **AND THEN** historical carriers and repository-local tests do not substitute
  for active intent.

#### Scenario: A newly introduced tracked path is material

- **WHEN** a candidate adds a tracked file outside the repository's former
  enumerated roots
- **THEN** ETHOS still requires attribution to one active official Change
- **AND THEN** no local path-list validator is needed to patch the omission.

#### Scenario: An obsolete companion is removed

- **WHEN** current tracked files are reviewed after source acceptance
- **THEN** no `scope.toml` remains in a present Change or archive directory
- **AND THEN** the earlier companion remains recoverable as a historical Git
  object rather than becoming a new authority or a falsified lifecycle claim.

### Requirement: Local and remote publication facts are separate

Local verification SHALL NOT imply publication. GitLab SHALL be the primary
release plane; GitHub an independent repository and CI/CD plane. Native hooks
SHALL reject `work/*`, `candidate/dev`, and `submit/*` publication; only
`dev`, `main`, and `proposal/*` may proceed to admission. Configured remotes,
local refs, and other-SHA jobs SHALL NOT prove publication. GitHub fallback
requires actual ETHOS-governed publication while GitLab is unavailable, not a
raw push after refusal.

#### Scenario: Candidate publication is attempted

- **WHEN** Git supplies `candidate/dev`, `work/*`, or `submit/*` as a remote
  destination to the installed ETHOS pre-push protocol
- **THEN** native admission rejects that destination
- **AND THEN** no remote publication result is asserted.

#### Scenario: A proposal ref is submitted

- **WHEN** Git supplies `proposal/*` as a publication destination
- **THEN** the installed ETHOS hook evaluates its remaining admission rules
- **AND THEN** ref eligibility alone does not assert remote acceptance.

#### Scenario: One Forge is unavailable

- **WHEN** GitLab is unavailable but GitHub remains reachable
- **THEN** a GitHub publication claim requires an observed product-governed
  publication and the exact GitHub ref at the claimed object
- **AND THEN** neither local proof nor a raw Git push substitutes for that
  observation.

### Requirement: Change completion follows declared obligations

An official material Change SHALL remain active while any declared source or
delivery task lacks evidence. Source MAY advance to candidate and accepted
refs before remote delivery. ETHOS SHALL archive only after declared tasks
complete; its new Git object requires fresh proof and publication observation.
A source-only Change MAY archive before integration when its obligations are
complete.

#### Scenario: Source is accepted before hosted delivery

- **WHEN** source proof and local accepted closeout pass but a declared Forge
  job has not run at that source object
- **THEN** the delivery task remains open and the official Change remains active
- **AND THEN** local acceptance does not imply whole-Change completion.

#### Scenario: Archive creates a new source object

- **WHEN** completed Change artifacts are officially archived
- **THEN** the resulting commit is treated as a new source identity for proof
  and publication
- **AND THEN** an earlier job result is not represented as CI success at the
  archive commit.

### Requirement: Evidence remains with its producing owner

Change admission SHALL NOT require tracked evidence or a claim/Chronicle pair.
Source proof SHALL use current ETHOS Attestations, Git objects, official
OpenSpec artifacts, and Forge observations. Adoption claims SHALL name a real
task, evidence source, time, scope, and reviewer, not validation. Historical
copies MAY retire only after reviewing unique facts, obligations, and inbound
consumers; cited artifacts SHALL be recoverable by full Git commit and path. Git
history SHALL remain unchanged.

#### Scenario: A material Change has no tracked evidence directory

- **WHEN** a complete official Change passes current ETHOS admission and proof
  without a repository-authored claim or Chronicle
- **THEN** the repository accepts the native lifecycle result
- **AND THEN** no local directory is invented to satisfy a historical shape.

#### Scenario: A team-adoption claim is requested

- **WHEN** only source checks and hosted CI are available
- **THEN** the repository reports only those source and delivery facts
- **AND THEN** team adoption remains unproved until actual work observations are
  reviewed at their producing owner.

#### Scenario: Completed historical copies are retired

- **WHEN** a new admitted Change removes completed historical copies after
  reviewing unique facts, obligations, incoming references, and exact Git recovery
- **THEN** the current source no longer ships those redundant copies
- **AND** cited artifacts remain retrievable by full ancestor commit and exact
  historical path; original Git objects, tags, and proof remain unchanged.

#### Scenario: A historical consumer or obligation remains unresolved

- **WHEN** a unique fact has not been reviewed, a cited artifact cannot be recovered,
  or an effective obligation has no current owner
- **THEN** that copy is not retired as absorbed
- **AND** deletion does not replace the required consumer migration or review.

### Requirement: Repository-generated commits follow the signed source contract

New commits, including official archive commits, SHALL have trusted SSH
signatures. Tracked policy SHALL NOT pin a person, key, or host path; the
operator supplies clone-local identity, a public signing-key path, and an
external trust anchor. An unsigned or unintended host-derived archive object
SHALL NOT be accepted or published as completed Change work.

#### Scenario: Configured clone archives a completed Change

- **WHEN** a clone has an explicit local Git identity and signer, its trust
  anchor is protected, and a completed Change is archived by ETHOS
- **THEN** the resulting exact archive commit has a valid SSH signature and the
  configured author and committer identity
- **AND THEN** proof and publication are refreshed for that new object.

#### Scenario: Generated commit does not meet the contract

- **WHEN** an archive output is unsigned or uses an unintended host-derived
  identity
- **THEN** it remains outside accepted and published refs until corrected or
  regenerated through an admitted transition
- **AND THEN** an earlier source proof or Forge job is not reused as proof of
  the archive object.

### Requirement: New commit identity and message policy is native

ETHOS SHALL require trusted SSH signatures and scoped Conventional Commit
subjects on new commits. Historical identity repair SHALL select exact author
or committer headers, preserve trees, messages, timestamps, and unselected
identities, and use admitted ETHOS repair with a verified recovery bundle.
Replacement IDs SHALL be proved and reconciled with both Forges before tagging;
`.mailmap`, raw rewrite, or rewritten messages SHALL NOT substitute.

#### Scenario: A new commit has an invalid subject

- **WHEN** an unscoped or malformed subject reaches native commit admission
- **THEN** ETHOS rejects it even if repository formatting checks pass.

#### Scenario: Selected historical identity is corrected

- **WHEN** native repair admits the exact headers, refs, and recovery bundle
- **THEN** selected identities are corrected and affected descendants re-signed
- **AND THEN** proof, remote refs, and hosted CI are refreshed for replacement
  object IDs before tagging.

### Requirement: Repository reuse rights have one MIT grant

The repository SHALL include one standard MIT license granting reuse of its
source and associated documentation, with the repository copyright holder
identified. Its public entry and private tooling metadata SHALL agree with that
grant. A stale Apache or other competing license declaration SHALL NOT be
published. Source verification SHALL detect a missing or inconsistent license
statement; it SHALL NOT infer rights merely from repository visibility.

#### Scenario: A reader checks reuse rights

- **WHEN** a reader opens the repository's public entry
- **THEN** the entry leads to the standard MIT license and the same SPDX
  identifier is present in the tooling metadata
- **AND THEN** no unaccepted draft license is presented as current.

#### Scenario: License metadata diverges

- **WHEN** the license file, public entry, or tooling metadata disagrees about
  the grant
- **THEN** repository verification rejects the source
- **AND THEN** a public Git remote alone does not override the discrepancy.

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
