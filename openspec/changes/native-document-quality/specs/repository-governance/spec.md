# Spec Delta

## MODIFIED Requirements

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

### Requirement: Changelog structure follows Keep a Changelog

`CHANGELOG.md` SHALL follow Keep a Changelog 1.1.0: `Unreleased` first;
only applicable Added, Changed, Deprecated, Removed, Fixed, and Security
categories, once per section in any order; strict SemVer headings with
optional `[YANKED]`; real ISO dates; newest-first versions; and history
links. The gate SHALL reject uncategorized prose, malformed headings,
duplicate versions, version drift, missing local tag coverage, and invalid
links.

#### Scenario: Version, changelog, or tag identities diverge

- **WHEN** a heading has a nonstandard or repeated category, invalid date or
  SemVer, duplicates another version, lacks a real history link, omits a local
  tag, or disagrees with `VERSION` or the selected tag's exact source
- **THEN** the repository quality gate rejects the release candidate
- **AND THEN** native ETHOS publication cannot substitute a different version
  or silently treat an untagged earlier edition as a release.

#### Scenario: Official changelog forms are accepted

- **WHEN** a valid dated release heading ends with `[YANKED]`, or standard
  categories appear once each in an order other than their explanatory list
- **THEN** the repository quality gate accepts that structure
- **AND THEN** human review still judges whether the change descriptions are
  useful and whether a yanked release is explained.

### Requirement: Each Forge supplies its pinned documentation tool independently

GitLab SHALL fetch every declared pinned native tool from its own project
package registry
with its CI API URL, project ID and job token, never a GitHub fallback. GitHub
MAY use pinned upstream assets. Both SHALL verify committed digests and executable
versions. Tokens SHALL appear only in request headers, never URLs or logs.
Local supplied assets SHALL work without either Forge. One native manifest
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

### Requirement: Changelog navigation offers both declared Forges

Version headings SHALL stay neutral and locally linkable. One unchanged
Changelog SHALL show explicit GitLab and GitHub history links per section.
Both SHALL identify the same refs at their official
`publication.peers[].forge_repository` coordinates with native provider routes.
Credential-free HTTP or HTTPS SHALL match the deployment. Missing, duplicate,
unused, mislabeled, wrong-repository, or divergent-ref links SHALL fail offline
validation; no redirect or per-Forge rewrite is allowed.

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

### Requirement: Active task artifacts remain implementation checklists

Active `tasks.md` artifacts SHALL follow the selected official OpenSpec task
template: numbered groups, bounded checkbox actions, and completion checks in
their descriptions. Task state SHALL remain with that checklist; requirements
and implementation choices SHALL remain with specifications and design.
Original execution results and review coverage SHALL remain with their
producing evidence. Tasks MAY reference that evidence but SHALL NOT copy logs,
checkpoints, debugging narratives, or acceptance reports. Successful official
checkbox parsing SHALL NOT constitute template conformance. Shared installed
ETHOS document-quality diagnostics SHALL enforce this boundary through its
existing command plane without a private task schema or another default gate.

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
