# Spec Delta

## MODIFIED Requirements

### Requirement: Each Forge supplies its pinned documentation tool independently

GitLab SHALL fetch pinned Vale and lychee from its own project package registry
with its CI API URL, project ID and job token, never a GitHub fallback. GitHub
MAY use pinned upstream assets. Both SHALL verify committed digests and executable
versions. Tokens SHALL appear only in request headers, never URLs or logs.
Local supplied archives SHALL work without either Forge. One native manifest
SHALL own versions, platform assets and notices.

#### Scenario: GitLab runs while GitHub is unavailable

- **WHEN** the pinned assets exist in the same project's GitLab package registry
  and the GitLab CI job has its standard job token
- **THEN** GitLab installs those exact assets and reaches the common verifier
- **AND** no GitHub asset endpoint is requested by the GitLab job.

#### Scenario: The GitLab package or identity is unavailable

- **WHEN** a package request fails or the standard CI URL, project ID, or job
  token is missing
- **THEN** the GitLab job fails without downloading from GitHub
- **AND** it does not log the token or mark the verifier successful.

#### Scenario: A supplied asset is altered

- **WHEN** either Forge or a local installer receives bytes whose SHA-256 does
  not match the committed platform record
- **THEN** extraction and executable installation are rejected.

#### Scenario: A contributor verifies without a Forge

- **WHEN** a contributor supplies a pinned native-tool archive through the
  documented local asset option
- **THEN** the installer verifies and installs it without contacting GitLab or
  GitHub.

### Requirement: Offline verification supply is a separately observed release asset

Each release SHALL publish one source-bound bundle with the same verified
SHA-256 on both Forges. Its identity SHALL bind the package manifest, lockfile
and native supply manifest. It SHALL exclude credentials, host paths,
`node_modules/` and ETHOS state. Each Forge SHALL acquire its own asset and run
full offline installation and verification on Linux, macOS and Windows at the
exact tag. After acquisition, use SHALL require neither Forge.

#### Scenario: Both Forges publish the release bundle

- **WHEN** a versioned source tag and bundle are prepared
- **THEN** each Forge Release exposes an asset whose retrieved bytes match the
  committed or independently supplied release digest
- **AND** both assets have the same SHA-256 and are bound to the same source
  version, package manifest, lockfile, and native supply manifest.
- **AND** refs, Release objects, downloaded bytes and hosted execution are
  observed separately; one does not establish another.

#### Scenario: Each Forge runs its own offline platform check

- **WHEN** both Forge Releases expose the same verified bundle
- **THEN** each Forge's post-publication Linux, macOS, and Windows jobs acquire
  the bundle from that Forge and run its full offline installer and verifier
- **AND** each result identifies its own source tag, bundle digest, and
  execution platform rather than borrowing a peer's result.

#### Scenario: One Forge is unavailable after acquisition

- **WHEN** a user has the verified bundle locally or can retrieve it from the
  available Forge while the other Forge is unavailable
- **THEN** installation and verification proceed without consulting the
  unavailable Forge
- **AND** an asset listing, a prior job, or one Forge's release is not presented
  as proof of the other Forge's current asset.

#### Scenario: Source exists without a qualified bundle

- **WHEN** a source tag or hosted documentation job passes but the bundle is
  missing, mismatched, or untested on a claimed host
- **THEN** source and hosted verification facts remain reportable
- **AND** cold offline distribution remains unqualified.

#### Scenario: A later release supersedes an attached download

- **WHEN** a qualified edition moves outside the retained current and rollback
  set
- **THEN** its asset may retire only through the explicit retention boundary
- **AND** withdrawal does not invalidate earlier publication evidence or imply
  that the old offline download remains available.

## ADDED Requirements

### Requirement: Remote download retention is bounded and truthful

Each Forge SHALL retain attached distribution assets for the latest qualified
release and one preceding qualified rollback. Native tool packages consumed by
retained source or current CI SHALL remain available. Superseded downloads SHALL
be inventoried and retired through native provider operations after their
consumers are checked. Signed tags, source revisions, original release notes,
and historical acceptance evidence SHALL NOT be rewritten or deleted by this
asset cleanup.

#### Scenario: A superseded release asset is retired

- **WHEN** a qualified newer release and rollback make an older attached
  download unnecessary, and no active declared consumer requires it
- **THEN** the maintainer removes that exact asset and its obsolete download
  link
- **AND** the Release preserves its original notes and gains an explicit dated
  withdrawal notice without claiming continued offline distribution.

#### Scenario: An asset is still consumed or its ownership is unknown

- **WHEN** current CI, retained source, an active job, or an unresolved owner
  could require a package
- **THEN** the package is preserved until its consumer or ownership is resolved
- **AND** age or size alone does not justify deletion.

#### Scenario: Cleanup is reported complete

- **WHEN** native provider deletion has finished
- **THEN** fresh inventories prove the selected assets absent and retained file
  identities and digests unchanged on each Forge
- **AND** storage reclamation is reported only when provider statistics confirm
  it; deletion acceptance alone does not prove released physical space.
