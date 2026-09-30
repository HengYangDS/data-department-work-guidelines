# Spec Delta

## MODIFIED Requirements

### Requirement: Per-project dual-Forge runner isolation

Both Forges SHALL run the full verifier on Linux, macOS, and Windows. GitHub
SHALL use managed runners; GitLab SHALL use project-locked ARM64 capabilities.
Every GitLab operating-system route, including Linux containers, SHALL
separate review and protected Runner identities, accounts, execution roots,
caches, and credential reachability. All Runners SHALL be tagged-only; review
Runners SHALL be `not_protected` and protected Runners SHALL be
`ref_protected`. A container or different tag on a shared Runner is not this
separation. GitLab SHALL protect `dev`, `main`, and `v*`. YAML SHALL
NOT prove execution; emulation SHALL NOT prove native x86_64 behavior.

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

#### Scenario: Release-cut source differs from an earlier accepted source

- **WHEN** a release-cut commit is selected as the version tag's source
- **THEN** both Forges' declared source jobs run and pass at that exact commit
  before its signed version tag is created
- **AND THEN** an earlier green job or a peer's result cannot qualify the tag.

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

Change admission SHALL NOT require a tracked `evidence/` root or claim/Chronicle
pair. Source proof SHALL use current ETHOS Attestations, Git objects, official
OpenSpec artifacts, and Forge observations. Adoption claims SHALL name a real
task, evidence source, time, scope, and reviewer, not repository validation.
Historical tracked evidence MAY be retired in a new commit only after reviewing
unique facts and inbound consumers; Git history remains unchanged.

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

### Requirement: Each Forge supplies its pinned documentation tool independently

GitLab SHALL fetch pinned lychee from its own project's generic package
registry using
its CI API URL, project ID, and job token, never a GitHub fallback. GitHub MAY
use its pinned upstream asset. Both SHALL verify committed SHA-256 and
executable version before checks. The token SHALL appear only in a request
header, never in a URL, source, or log. A local supplied-asset install SHALL
work without either Forge.

#### Scenario: GitLab runs while GitHub is unavailable

- **WHEN** the pinned asset exists in the same project's GitLab package
  registry and the GitLab CI job has its standard job token
- **THEN** GitLab installs that exact asset and reaches the common verifier
- **AND THEN** no GitHub asset endpoint is requested by the GitLab job.

#### Scenario: The GitLab package or identity is unavailable

- **WHEN** the package request fails or the standard CI URL, project ID, or job
  token is missing
- **THEN** the GitLab job fails without downloading from GitHub
- **AND THEN** it does not log the token or mark the verifier successful.

#### Scenario: A supplied asset is altered

- **WHEN** either Forge or a local installer receives bytes whose SHA-256 does
  not match the committed platform record
- **THEN** extraction and executable installation are rejected.

#### Scenario: A contributor verifies without a Forge

- **WHEN** a contributor supplies the pinned archive through the documented
  local asset option
- **THEN** the installer verifies and installs it without contacting GitLab or
  GitHub.
