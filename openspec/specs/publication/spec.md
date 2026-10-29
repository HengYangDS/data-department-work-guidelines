# publication Specification

## Purpose

Define signed versioned publication, protected platform qualification, native
release navigation, and bounded download retirement on both independent Forges.

## Requirements

### Requirement: Hosted documentation verification begins from a Git checkout

Each hosted job SHALL run the installed ETHOS full host graph from a Git checkout. GitHub SHALL
check out first on a managed runner; GitLab SHALL supply Git in its Linux container and
project-locked macOS and Windows runners. Both SHALL install the locked ETHOS release through
Mise, and the command and repository-relative inputs SHALL NOT differ by provider. Actions SHALL
pin immutable maintained releases; workflow YAML alone SHALL NOT count as hosted execution.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job has no job-level container
- **AND THEN** checkout precedes runtime commands and the locked ETHOS installation
- **AND THEN** the installed full host graph remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates the GitLab Linux documentation job
- **THEN** Git and the Mise bootstrap prerequisites are available from the pinned
  image without a browser package installation
- **AND THEN** its verifier command is identical to the GitHub projection.

#### Scenario: GitLab native runtimes are configured

- **WHEN** the repository validates the GitLab macOS and Windows jobs
- **THEN** each selects its project-locked operating-system capability and
  installs the locked ETHOS release before the common verifier
- **AND THEN** neither job relies on the Linux container image or a host path.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Version identity follows SemVer compatibility

`VERSION` SHALL hold one strict SemVer 2.0.0 value, and no other manifest SHALL
declare a competing version. The public surface is normative duties, stable
member and Agent routes, and contributor commands. Incompatible changes SHALL
increment major, compatible additions or deprecations minor, and compatible
fixes patch. The official Change SHALL review compatibility rather than infer it
from formatting.

#### Scenario: A breaking contributor command is retired

- **WHEN** documented shell commands are replaced by one portable entrypoint
- **THEN** the official Change identifies the compatibility break and the next
  release takes a major increment
- **AND THEN** migration guidance names the new command without keeping a
  permanent shell compatibility facade.

### Requirement: Changelog structure follows Keep a Changelog

`CHANGELOG.md` SHALL follow Keep a Changelog 1.1.0: `Unreleased` first; only
applicable Added, Changed, Deprecated, Removed, Fixed, and Security categories,
once per section in any order; strict SemVer headings; real ISO dates; and
newest-first versions. Installed ETHOS SHALL reject uncategorized prose,
malformed headings, duplicate versions, and out-of-order versions or dates.

#### Scenario: Version, changelog, or tag identities diverge

- **WHEN** a heading has a nonstandard or repeated category, an invalid date or
  SemVer, or duplicates another version, or a section is out of order
- **THEN** installed ETHOS rejects the source
- **AND WHEN** a release tag disagrees with `VERSION` or lacks its Changelog entry
- **THEN** tag admission refuses it, and native publication cannot substitute a
  different version or treat an untagged earlier edition as a release.

#### Scenario: Official changelog forms are accepted

- **WHEN** standard categories appear once each in an order other than their
  explanatory list
- **THEN** installed ETHOS accepts that structure
- **AND THEN** human review still judges whether the change descriptions are
  useful.

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

### Requirement: Release operations are reproducible from the contributor route

The contributor guide SHALL name the inputs, commands, order, and separate
checks needed to sign a SemVer edition, publish it on GitLab and GitHub, and
qualify each peer's source jobs. It SHALL distinguish local source proof, each
remote ref and Release, and hosted CI. It SHALL embed no operator credential,
private host path, cache location, or competing lifecycle command.

#### Scenario: A maintainer prepares and publishes a release

- **WHEN** an authorized maintainer starts from the accepted source
- **THEN** the contributor route identifies the exact checks without relying on
  an earlier chat or this host's directories
- **AND THEN** the signed tag, the selected Forge's Release, and its source jobs
  at the release-cut commit are observed before that peer's completion
- **AND THEN** unobserved other-peer delivery remains an open obligation.

#### Scenario: One publication or host qualification is missing

- **WHEN** a Forge Release or a declared host's source job has not been
  observed at the selected source
- **THEN** the release guidance keeps that peer's claim open while reporting the
  checks that actually passed
- **AND THEN** an earlier tag job, local source check, or peer Forge result does
  not substitute for the missing observation
- **AND THEN** an unavailable unselected Forge does not prevent independently
  qualified publication on the selected Forge.

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

### Requirement: Per-Forge runner isolation protects source verification

Both Forges SHALL run the full verifier on Linux, macOS, and Windows. GitHub
SHALL use hosted runners; GitLab SHALL use project-locked ARM64 Runners. On
every GitLab OS route, including Linux containers, review and protected jobs
SHALL have distinct Runner identities, accounts, execution roots, caches, and
credential reachability. Runners SHALL be tagged-only: review `not_protected`,
protected `ref_protected`. GitLab SHALL protect `dev`, `main`, and `v*`.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its declared hosted matrix, checks out first, and
  installs the locked ETHOS release
- **AND THEN** GitHub admits `dev`, `main`, `proposal/**`, and `v*` push events
  and pull requests targeting `dev` or `main`
- **AND THEN** GitLab selects review or protected project capabilities according
  to the source trust boundary, and every job invokes the same full verifier.

#### Scenario: A declared hosted check is skipped

- **WHEN** a GitHub source job excludes a matrix host, skips a job or step, or
  tolerates a required failure
- **THEN** the installed common model or its projection check rejects such a
  source workflow before claiming that its declared host matrix ran.

#### Scenario: Global setup alters a GitLab job

- **WHEN** GitLab adds global setup, an extra default, or a remote CI include
- **THEN** the installed projection check rejects it when generated-pipeline
  drift introduces it.

#### Scenario: Native source routes are trust-separated

- **WHEN** GitLab evaluates a proposal push or merge request
- **THEN** only the Linux, macOS, and Windows review jobs are eligible
- **AND WHEN** GitLab evaluates `dev`, `main`, or a version tag
- **THEN** only the Linux, macOS, and Windows protected source jobs are eligible.

#### Scenario: Linux selectors cannot cross the trust boundary

- **WHEN** the repository validates its GitLab Linux source jobs
- **THEN** proposal and merge-request jobs select the review capability
- **AND THEN** protected branch and tag jobs select a distinct protected
  capability
- **AND THEN** a missing job or shared tag that generated-pipeline drift
  introduces fails the installed projection check before hosted execution is
  claimed.

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
- **THEN** fleet admission refuses the setup even if CI lint and local checks
  pass
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
- **THEN** the GitHub job remains on managed hosted runners with read-only
  contents permission
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
- **THEN** the selected Forge's declared source jobs run and pass at that exact
  commit before its signed version tag is first created
- **AND THEN** an earlier green job or another peer's result cannot qualify it
- **AND THEN** an unavailable unselected Forge does not block the selected release.

#### Scenario: A second Forge receives an already published edition

- **WHEN** the same edition is later published to another Forge
- **THEN** that Forge's own source jobs pass at the same release-cut commit
- **AND THEN** native admission publishes the existing signed tag object and
  unchanged notes without recreating the edition.

### Requirement: Release identity binds VERSION, the Changelog, and the signed tag

`VERSION` SHALL name the edition being prepared or released, and the release cut
SHALL move every `Unreleased` note into one dated section for that version.
Installed ETHOS SHALL admit only a signed annotated `vX.Y.Z` tag that matches
committed `VERSION` and has that version's Changelog entry. A heading, branch,
or CI result alone SHALL NOT establish publication.

#### Scenario: A release is prepared but not yet tagged

- **WHEN** a dated section for the current `VERSION` is committed without its tag
- **THEN** source verification may pass for preparation
- **AND THEN** no Forge Release or signed tag is claimed from that heading.

#### Scenario: A tag disagrees with its source

- **WHEN** a tag's name differs from committed `VERSION`, or the Changelog lacks
  that version's entry
- **THEN** installed ETHOS refuses the tag's admission
- **AND THEN** earlier untagged editions are not retroactively called releases.

### Requirement: GitLab bootstraps Mise from its own package registry

GitLab Linux jobs SHALL obtain the pinned Mise installer and archive from the
same project's package registry with the CI API URL, project ID, and job token,
check the installer's committed digest before running it, and SHALL NOT fall
back to another origin. Tokens SHALL appear only in request headers, never in
URLs or logs.

#### Scenario: The package or job identity is unavailable

- **WHEN** a package request fails or the standard CI URL, project ID, or job
  token is missing
- **THEN** the job fails without downloading Mise from another origin
- **AND** it does not log the token or mark verification successful.

#### Scenario: The supplied installer is altered

- **WHEN** the downloaded installer's SHA-256 differs from the committed record
- **THEN** the job stops before running it.

### Requirement: Source-event tag routes match the release family

Both source-event routes SHALL admit only `v*` tags without `/`, and the CI
contract SHALL reject broader tag rules. Native release checks SHALL retain
strict SemVer and signature admission.

#### Scenario: An unrelated tag would enter source verification

- **WHEN** a GitLab workflow or protected-source rule admits any nonempty tag
  without the declared family constraint
- **THEN** the installed common model rejects a broader rule, and the installed
  projection check rejects generated-pipeline drift that broadens it
- **AND** unrelated and slash-containing tags are excluded before GitLab tool
  preparation, while branch and review routes remain unchanged.

#### Scenario: A matching prefix does not establish a release

- **WHEN** a tag begins with `v` but is not a signed strict SemVer edition
- **THEN** native release checks still reject that identity
- **AND** an eligible source-event route does not prove a Release.
