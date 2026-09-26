# repository-governance

## Purpose

Define this repository's Change, source-acceptance, and publication
boundaries without creating a second authority beside ETHOS and official OpenSpec.

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

### Requirement: Hosted documentation verification begins from a Git checkout

Each hosted job SHALL run the same shell-independent verifier from a Git
checkout. GitHub SHALL check out first on a managed runner, then select the
locked Node major; GitLab SHALL supply Git and the same toolchain. Provider
setup MAY differ; the command and repository-relative inputs SHALL NOT.
Actions SHALL pin immutable maintained releases. Workflow YAML alone SHALL
NOT count as hosted execution.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job has no job-level container
- **AND THEN** checkout precedes runtime commands and explicit Node setup
- **AND THEN** the shared portable verifier remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates the GitLab documentation workflow
- **THEN** Git is available to the shared verifier without requiring a browser
  package installation
- **AND THEN** its verifier command is identical to the GitHub projection.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Per-project dual-Forge runner isolation

GitHub SHALL run the full verifier on hosted Linux, macOS, and Windows with
pinned Actions and the declared Node line, never a local runner or host path.
GitLab SHALL select `ci-linux-arm64-docker`; a real runner must expose
that tag before success is claimed. Provider services, credentials,
workspaces, caches, and job observations SHALL remain independent.
YAML SHALL NOT claim runner registration.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its three-OS hosted matrix, checks out first, and
  configures the declared Node line
- **AND THEN** GitLab selects `ci-linux-arm64-docker` and both jobs invoke the
  same verifier.

#### Scenario: Fork-origin code cannot run on the GitHub local host

- **WHEN** a pull request head repository differs from the GitHub repository
- **THEN** the three-OS GitHub job remains on managed hosted runners with
  read-only contents permission
- **AND THEN** the workflow does not select or expose a local GitHub host.

#### Scenario: Local configuration is not hosted evidence

- **WHEN** workflow lint or local proof passes
- **THEN** the repository does not assert that GitHub Actions or GitLab CI
  executed
- **AND THEN** each Forge requires a fresh run at the published revision for
  its own success claim.

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

`CHANGELOG.md` SHALL follow Keep a Changelog 1.1.0: `Unreleased` first, only
applicable Added, Changed, Deprecated, Removed, Fixed, and Security categories;
strict SemVer headings, real ISO dates, newest-first order, and version-history
links. The quality gate SHALL reject uncategorized prose, malformed headings,
duplicate versions, version disagreement, missing local tag coverage, and
invalid links.

#### Scenario: Version, changelog, or tag identities diverge

- **WHEN** a heading has a nonstandard category, invalid date or SemVer,
  duplicates another version, lacks a real history link, omits a local tag,
  or disagrees with `VERSION` or the selected tag's exact source
- **THEN** the repository quality gate rejects the release candidate
- **AND THEN** native ETHOS publication cannot substitute a different version
  or silently treat an untagged earlier edition as a release.

### Requirement: Release comparison links bind ancestry and tags

A release comparison base SHALL be an ancestor of its tag or prepared source;
local object presence is insufficient. Tagged comparisons SHALL end at the
tag, not a moving branch. `Unreleased` SHALL compare from a prepared current
version or, otherwise, the latest local release tag. A prepared version section
SHALL compare to prospective `vVERSION`; only that exact missing tag MAY be
unresolved. The same links SHALL remain valid after tagging.

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
