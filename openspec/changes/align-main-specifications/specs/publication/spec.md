# Spec Delta

## MODIFIED Requirements

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
- **THEN** the installed common model or its projection check rejects such a
  source workflow before claiming that its declared host matrix ran
- **AND** the separate offline workflow keeps no local structural check and
  relies on hosted release acceptance.

#### Scenario: Global setup alters GitLab offline supply

- **WHEN** GitLab adds global setup, an extra default, or a remote CI include
- **THEN** the installed projection check rejects it when generated-pipeline
  drift introduces it, rather than treating the offline job's local script as
  proof of isolated supply.

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
- **AND THEN** a missing job, shared tag, or review-tagged offline job that
  generated-pipeline drift introduces fails the installed projection check
  before hosted execution is claimed.

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
- **THEN** the selected Forge's declared source jobs run and pass at that exact
  commit before its signed version tag is first created
- **AND THEN** an earlier green job or another peer's result cannot qualify it
- **AND THEN** an unavailable unselected Forge does not block the selected release.

#### Scenario: A second Forge receives an already published edition

- **WHEN** the same edition is later published to another Forge
- **THEN** that Forge's own source jobs pass at the same release-cut commit
- **AND THEN** native admission publishes the existing signed tag object,
  unchanged notes, and identical asset bytes without recreating the edition.

### Requirement: Version identity follows SemVer compatibility

`VERSION` SHALL hold one strict SemVer 2.0.0 value; the
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

### Requirement: Prepared and published release states remain distinct

At most one untagged prepared release entry MAY match `VERSION`;
`Unreleased` SHALL be empty for it and for a selected release tag. A heading
alone SHALL NOT establish publication. ETHOS SHALL admit only signed annotated
`vX.Y.Z` tags at the exact source. Earlier untagged branch editions SHALL NOT
be retroactively called releases.

#### Scenario: A current release is prepared but not yet tagged

- **WHEN** `Unreleased` is empty and first, and one dated current-version
  section is prepared without a local tag
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
- **THEN** executable installation is rejected.

#### Scenario: A contributor verifies without a Forge

- **WHEN** a contributor supplies a pinned native-tool binary through the
  documented local asset option
- **THEN** the installer verifies and installs it without contacting GitLab or
  GitHub.

### Requirement: Changelog comparisons and selected inputs bind native history

Every release comparison except the oldest SHALL start at its immediately
preceding release tag. Native Git SHALL resolve history tags to commits.
Selected-tag validation SHALL bind each evaluated Changelog, version, npm
metadata, and publication input to exact committed bytes. Untagged
development validation SHALL remain available.

#### Scenario: Release metadata or its comparison interval is altered

- **WHEN** a selected release uses another predecessor or an evaluated input
  differs from the selected commit's blob
- **THEN** validation refuses the interval or exact input path
- **AND** adjacent native tag comparisons, complete committed inputs, and
  untagged development checks remain valid.
