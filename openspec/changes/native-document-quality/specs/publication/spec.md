# Spec Delta

## Purpose

Define signed versioned publication, protected platform qualification, native
release navigation, and bounded download retirement on both independent Forges.

## ADDED Requirements

### Requirement: Hosted documentation verification begins from a Git checkout

Each hosted job SHALL run the same shell-independent verifier from a Git
checkout. GitHub SHALL check out first on a managed runner, then select the
locked Node major. GitLab SHALL supply Git and the declared Node line in its
Linux container and project-locked macOS and Windows runners. Provider setup
MAY differ; the command and repository-relative inputs SHALL NOT. Actions
SHALL pin immutable maintained releases. Workflow YAML alone SHALL NOT count
as hosted execution.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job has no job-level container
- **AND THEN** checkout precedes runtime commands and explicit Node setup
- **AND THEN** the shared portable verifier remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates the GitLab Linux documentation job
- **THEN** Git and the declared Node line are available from the pinned image
  without requiring a browser package installation
- **AND THEN** its verifier command is identical to the GitHub projection.

#### Scenario: GitLab native runtimes are configured

- **WHEN** the repository validates the GitLab macOS and Windows jobs
- **THEN** each selects its project-locked operating-system capability and
  requires the declared Node line before the common verifier
- **AND THEN** neither job relies on the Linux container image or a host path.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Per-project dual-Forge runner isolation

Both Forges SHALL run the full verifier on Linux, macOS, and Windows. GitHub
SHALL use hosted runners; GitLab SHALL use project-locked ARM64 Runners. On
every GitLab OS route, including Linux containers, review and protected jobs
SHALL have distinct Runner identities, accounts, execution roots, caches, and
credential reachability. Runners SHALL be tagged-only: review
`not_protected`, protected `ref_protected`. GitLab SHALL protect `dev`,
`main`, and `v*`.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its three-OS hosted matrix, checks out first, and
  configures the declared Node line
- **AND THEN** GitHub admits `dev`, `main`, `proposal/**`, and `v*` push events
  and pull requests targeting `dev` or `main`
- **AND THEN** GitLab selects review or protected project capabilities according
  to the source trust boundary, and every job invokes the same full verifier.

#### Scenario: A declared hosted check is skipped

- **WHEN** a GitHub source or offline job excludes a matrix host, skips a job or
  step, or tolerates a required failure
- **THEN** the repository CI contract rejects the workflow before claiming
  that its declared host matrix ran.

#### Scenario: Global setup alters GitLab offline supply

- **WHEN** GitLab adds global setup, an extra default, or a remote CI include
- **THEN** the repository CI contract rejects it rather than treating the
  offline job's local script as proof of isolated supply.

#### Scenario: Native source routes are trust-separated

- **WHEN** GitLab evaluates a proposal push or merge request
- **THEN** only the Linux, macOS, and Windows review jobs are eligible
- **AND WHEN** GitLab evaluates `dev`, `main`, or a version tag
- **THEN** only the Linux, macOS, and Windows protected source jobs are eligible
- **AND THEN** release offline jobs use protected runners after publication.

#### Scenario: Linux selectors cannot cross the trust boundary

- **WHEN** the repository validates its GitLab Linux source and offline jobs
- **THEN** proposal and merge-request source jobs select the review capability
- **AND THEN** protected branch and tag source jobs and tag offline jobs select
  a distinct protected capability
- **AND THEN** a missing job, shared tag, or review-tagged offline job fails the
  repository CI contract before hosted execution is claimed.

#### Scenario: An open proposal has one review pipeline

- **WHEN** a `proposal/*` branch has an open merge request
- **THEN** its branch-push pipeline is suppressed and its merge-request
  pipeline remains eligible for the review runners
- **AND WHEN** the proposal has no open merge request
- **THEN** its branch push may run the review jobs without admitting an
  arbitrary work branch or a protected Runner.

#### Scenario: Runner labels hide a shared native account

- **WHEN** review and protected selectors resolve to the same Runner identity,
  account, container daemon or socket, workspace, cache, or credential
  reachability
- **THEN** fleet admission refuses the setup even if CI lint and local tests pass
- **AND THEN** GitLab platform proof remains incomplete.

#### Scenario: Untrusted YAML requests a protected native Runner

- **WHEN** a safe job on an unprotected proposal ref asks for a protected
  Runner's tag, regardless of the repository's normal job rules
- **THEN** GitLab's `ref_protected` Runner refuses to schedule that job
- **AND WHEN** a job at a protected `dev`, `main`, or `v*` ref asks for the same
  Runner after its project binding and account isolation are verified
- **THEN** the job can be scheduled and execute the declared verifier.

#### Scenario: Registration tunneling leaves other credential paths exposed

- **WHEN** a GitLab Runner registers or polls through an encrypted tunnel
  while its source clone or job-token package request still uses HTTP
- **THEN** fleet admission separately observes the effective endpoint of each
  credential-bearing path in an actual job
- **AND THEN** transport is not called complete without encryption for those
  paths or an authorized, scoped host-only-network risk decision.

#### Scenario: Fork-origin code cannot run on the GitHub local host

- **WHEN** a pull request head repository differs from the GitHub repository
- **THEN** the three-OS GitHub job remains on managed hosted runners with
  read-only contents permission
- **AND THEN** the workflow does not select or expose a local GitHub host.

#### Scenario: A GitLab operating-system runner is missing

- **WHEN** a required GitLab job cannot run on its declared project-specific
  operating-system capability
- **THEN** GitLab platform proof remains incomplete
- **AND THEN** local lint, another GitLab platform, or GitHub success does not
  substitute for the missing job.

#### Scenario: Local configuration is not hosted evidence

- **WHEN** workflow lint or local proof passes
- **THEN** the repository does not assert that GitHub Actions or GitLab CI
  executed
- **AND THEN** each Forge requires a fresh run at the published revision for
  its own success claim
- **AND THEN** provider credentials and job observations remain independent.

#### Scenario: Emulation is not native architecture proof

- **WHEN** a declared host runs x86_64 tools under emulation
- **THEN** a passing job MAY establish functional execution on that host
- **AND THEN** it SHALL NOT be represented as native x86_64 behavior.

#### Scenario: Release-cut source differs from an earlier accepted source

- **WHEN** a release-cut commit is selected as the version tag's source
- **THEN** both Forges' declared source jobs run and pass at that exact commit
  before its signed version tag is created
- **AND THEN** an earlier green job or a peer's result cannot qualify the tag.

### Requirement: Version identity follows SemVer compatibility

`VERSION` SHALL hold one strict SemVer 2.0.0 value matching the charter; the
private npm manifest SHALL NOT declare a competing version. The public surface
is normative duties, stable member and Agent routes, and contributor commands.
Incompatible changes SHALL increment major, compatible additions or
deprecations minor, and compatible fixes patch. The official Change SHALL
review compatibility rather than infer it from formatting.

#### Scenario: A breaking contributor command is retired

- **WHEN** documented shell commands are replaced by one portable entrypoint
- **THEN** the official Change identifies the compatibility break and the next
  release takes a major increment
- **AND THEN** migration guidance names the new command without keeping a
  permanent shell compatibility facade.

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

### Requirement: Release comparison links bind ancestry and tags

Comparison bases SHALL be ancestors of tagged or prepared source; mere local
object presence is insufficient. Tagged comparisons SHALL end at their tag,
not a branch. Only the oldest tagged release MAY link directly to its exact
`vVERSION` tag. `Unreleased` SHALL compare from the prepared current version
or latest local tag. A prepared release SHALL compare to prospective
`vVERSION`; no other missing ref is allowed. Links SHALL remain valid after
tagging.

#### Scenario: A prepared link would fail after tagging

- **WHEN** a prepared release leaves changes in `Unreleased`, compares from an
  older tag, or ends its release comparison at a moving branch
- **THEN** the quality gate rejects the source before creating the tag
- **AND THEN** no arbitrary missing ref is treated as a prospective tag.

#### Scenario: A local commit is absent from the published ancestry

- **WHEN** a comparison base resolves in the local object store but is not an
  ancestor of its release tag or prepared source
- **THEN** the repository quality gate rejects that comparison before tagging
- **AND THEN** historical identity repair cannot leave an old object ID in a
  link merely because it resolves on the maintainer's machine.

#### Scenario: The first tagged version has no predecessor

- **WHEN** the oldest tagged release links to its exact annotated tag instead
  of inventing an earlier comparison base
- **THEN** the quality gate accepts the direct tag link
- **AND THEN** a wrong tag, untagged prepared version, or non-oldest release
  cannot use that exception.

### Requirement: Prepared and published release states remain distinct

At most one untagged prepared release entry MAY match `VERSION`;
`Unreleased` SHALL be empty for it and for a selected release tag. A heading
alone SHALL NOT establish publication. ETHOS SHALL admit only signed annotated
`vX.Y.Z` tags at the exact source. Earlier untagged branch editions SHALL NOT
be retroactively called releases.

#### Scenario: A current release is prepared but not yet tagged

- **WHEN** `VERSION` and the charter agree, `Unreleased` is empty and first,
  and one dated current-version section is prepared without a local tag
- **THEN** repository source validation may pass for preparation
- **AND THEN** `Unreleased` compares from the prospective `vVERSION` tag to
  `main`, and the prepared section compares to that same prospective tag
- **AND THEN** no Forge Release or signed tag is claimed from that heading.

#### Scenario: A prepared changelog survives the tag transition

- **WHEN** the signed annotated `vVERSION` tag is created on the exact
  prepared source
- **THEN** the same `Unreleased` and release comparison links remain valid
- **AND THEN** the selected tag check binds the tag to that source without a
  post-tag source edit.

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

### Requirement: GitLab Runner image admission matches the source pin

The declared GitLab Linux ARM64 Runner SHALL allow only the exact OCI image
digest pinned by both repository CI jobs and SHALL use a local-only image pull
policy. Before unpausing that Runner, the deployment owner SHALL verify that
its Docker store resolves the same digest for Linux ARM64. A cached image under
a floating tag, an older successful job, or an available registry endpoint
SHALL NOT substitute for that check.

#### Scenario: Exact image is ready before a job

- **WHEN** the Runner policy allows the CI image digest and Docker resolves it
  locally for Linux ARM64
- **THEN** the Runner may be admitted for an exact-source job without fetching
  a replacement image at job start
- **AND THEN** hosted success is claimed only after that job actually passes.

#### Scenario: Cache or allowlist differs from source

- **WHEN** the pinned digest is absent from the Runner allowlist or local Docker
  store, even if the matching image tag exists
- **THEN** the Runner remains paused or the job fails closed under its local-only
  pull policy
- **AND THEN** the source pin is not weakened to obtain a passing CI result.

### Requirement: Offline release archives exclude host metadata

An offline release archive SHALL contain only the declared portable file tree
and payload bytes. Host extended attributes and other
platform-specific archive metadata SHALL NOT be published. Archive inspection
and extraction SHALL reject nonempty tool warnings rather than treating a zero
exit status as clean verification.

#### Scenario: Build inputs carry host extended attributes

- **WHEN** a builder stages otherwise valid files carrying host extended
  attributes
- **THEN** the release archive omits those attributes while preserving the
  declared file tree and bytes
- **AND THEN** no platform-specific archive header remains in the published
  bundle.

#### Scenario: Archive tooling warns without failing

- **WHEN** inspection or extraction emits a warning while returning exit zero
- **THEN** the offline verifier rejects the archive before claiming a clean
  install or release qualification
- **AND THEN** a digest match alone cannot override that refusal.

#### Scenario: The same archive is used on each supported host

- **WHEN** the exact signed release bundle is independently acquired for macOS,
  Linux, and Windows offline verification
- **THEN** each host verifies the same digest and completes the full offline
  install and repository check without archive warnings or network fallback.

### Requirement: Release operations are reproducible from the contributor route

The contributor guide SHALL name the inputs, commands, order, and separate
checks needed to sign a SemVer edition, build and inspect its source-pinned
offline bundle, publish identical bytes on GitLab and GitHub, and qualify every
declared host. It SHALL distinguish local source proof, each remote ref and
Release, retrieved asset bytes, hosted CI, and offline execution. It SHALL
embed no operator credential, private host path, cache location, or competing
lifecycle command.

#### Scenario: A maintainer prepares and publishes a release

- **WHEN** an authorized maintainer starts from the accepted source and the
  pinned package and tool-supply manifests
- **THEN** the contributor route identifies the exact build inputs and release
  checks without relying on an earlier chat or this host's directories
- **AND THEN** the signed tag, both Forge Releases, matching asset digests, and
  full offline host results are observed as separate facts before completion.

#### Scenario: One publication or host qualification is missing

- **WHEN** a Forge Release, retrieved asset digest, or declared host's complete
  offline run has not been observed at the selected source
- **THEN** the release guidance keeps that claim open while reporting the
  checks that actually passed
- **AND THEN** an earlier tag job, local source check, or peer Forge result does
  not substitute for the missing observation.

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

### Requirement: Changelog navigation offers both declared Forges

Neutral version headings SHALL remain locally linkable. Every section of one
unchanged Changelog SHALL show labeled native GitLab/GitHub links using declared
`publication.peers[].forge_repository` coordinates and identical refs.
Credential-free HTTP/HTTPS SHALL match the deployment. Missing, duplicate,
unused, mislabeled, wrong-repository, or divergent links SHALL fail offline
validation without redirects or per-Forge rewrites.

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

### Requirement: Changelog comparisons and selected inputs bind native history

Every release comparison except the oldest SHALL start at its immediately
preceding release tag. Native Git SHALL resolve history tags to commits.
Selected-tag validation SHALL bind each evaluated Changelog, version, charter,
npm metadata, and publication input to exact committed bytes. Untagged
development validation SHALL remain available.

#### Scenario: Release metadata or its comparison interval is altered

- **WHEN** a selected release uses another predecessor or an evaluated input
  differs from the selected commit's blob
- **THEN** validation refuses the interval or exact input path
- **AND** adjacent native tag comparisons, complete committed inputs, and
  untagged development checks remain valid.
