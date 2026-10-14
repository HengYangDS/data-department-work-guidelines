# Spec Delta

## ADDED Requirements

### Requirement: DDWG has two complete publication peers

DDWG SHALL declare GitLab as its organizational publication source and GitHub
as an independent complete repository, CI/CD, and distribution peer through
native ETHOS. Local validation and installation SHALL need neither peer.
Each peer SHALL qualify its own source and offline Linux, macOS, and Windows
execution, publication, and downloads. An unavailable unselected peer SHALL
NOT block a qualified release on the selected peer.

#### Scenario: Both peers accept the document source

- **WHEN** the final source is admitted through the declared proposal route
- **THEN** both protected accepted and release refs contain the same admitted graph
- **AND** each peer's own required jobs and published source are observed;
  local checks or another peer's success do not supply that acceptance.

#### Scenario: GitLab is unavailable

- **WHEN** GitLab is unavailable and GitHub meets its own release requirements
- **THEN** GitHub's native route publishes the signed edition independently
- **AND** local checks and supplied installation remain available
- **AND** unobserved GitLab source, CI, Release, downloads, and live links stay
  pending rather than block GitHub or be reported as completed.

#### Scenario: GitLab becomes available after a GitHub release

- **WHEN** the maintainer resumes the deferred GitLab delivery
- **THEN** GitLab qualifies the same source through its own required jobs
- **AND** its native route publishes the existing signed tag and exact asset bytes
- **AND** GitLab's Release, downloads, and navigation are verified without
  recreating the edition or borrowing GitHub acceptance.

#### Scenario: The selected peer fails a required check

- **WHEN** GitHub is selected but its source or offline matrix fails or is incomplete
- **THEN** GitHub release acceptance remains incomplete
- **AND** GitLab unavailability does not waive that defect or the common quality floor.

#### Scenario: A platform has not executed the final inputs

- **WHEN** a declared platform lacks actual source or offline qualification
- **THEN** the final matrix remains incomplete
- **AND** an online Runner, static YAML, container label, or another source's
  green job does not establish its runtime identity or acceptance.

### Requirement: Document editions consume shared release and history contracts

DDWG SHALL select its document edition and both Forge repositories through the
accepted native release contract. Shared SemVer, Keep a Changelog, signing,
history, comparison, release, and retirement standards SHALL remain at their
owners. DDWG SHALL keep useful English version notes and peer-native navigation,
while maintenance-tool supply remains a separate product artifact.

#### Scenario: A document edition is prepared

- **WHEN** version notes describe the proposed change against the effective edition
- **THEN** the shared release contract classifies and checks that edition
- **AND** prepared source is not reported as a signed tag, published Release,
  qualified download, or accepted future comparison link.

#### Scenario: A reader follows version history on either Forge

- **WHEN** the reader selects a version or comparison from the document Changelog
- **THEN** labeled links resolve through both declared Forge repositories and
  their native history contracts to the intended tags or commits
- **AND** unchanged notes remain readable without redirecting one peer's reader
  exclusively to the other peer or another repository.

#### Scenario: A release is published on the selected peer

- **WHEN** the selected native release route publishes the declared edition
- **THEN** source, signatures, tags, notes, shared supply identity, and independent
  download bytes match their admitted subjects
- **AND** selected-peer live links are checked after their targets exist;
  source verification does not silently accept a future or broken target
- **AND** an unselected peer's unavailable links remain pending without
  invalidating the selected peer's verified delivery.

#### Scenario: Downloads or a work lane are retired

- **WHEN** the native owner releases an exact replaced artifact or absorbed lane
- **THEN** its consumers, preserved evidence, retained hashes, and native inventory
  are checked before and after that bounded retirement
- **AND** absence and provider-reported reclamation are observed rather than
  inferred from age, a clean tree, an empty folder, or a deletion request.

## REMOVED Requirements

**Reason:** Common release, history, isolation, acquisition, and retirement
standards belong to ETHOS and their native execution owners. DDWG supplies
publication peers and platform requirements, not another release implementation.

**Migration:** Existing publication tasks qualify each migrated consumer before
removing its duplicate code, CI policy, procedures, and standard copies.
An unavailable peer holds only its own migration, not a qualified peer's release.
Original requirements, scenarios, and failures remain in native
captured source evidence
`640cc1a0f708b9b8411d714f07d084376a8b691469e8518181d213366ab753e6`.
Required actual platform, runner, transport, and release evidence stays separate.

### Requirement: Hosted documentation verification begins from a Git checkout

### Requirement: Per-project dual-Forge runner isolation

### Requirement: Version identity follows SemVer compatibility

### Requirement: Changelog structure follows Keep a Changelog

### Requirement: Release comparison links bind ancestry and tags

### Requirement: Prepared and published release states remain distinct

### Requirement: Each Forge supplies its pinned documentation tool independently

### Requirement: Offline verification supply is a separately observed release asset

### Requirement: GitLab Runner image admission matches the source pin

### Requirement: Offline release archives exclude host metadata

### Requirement: Release operations are reproducible from the contributor route

### Requirement: Remote download retention is bounded and truthful

### Requirement: Changelog navigation offers both declared Forges

### Requirement: Changelog comparisons and selected inputs bind native history
