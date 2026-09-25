# repository-governance Specification

## MODIFIED Requirements

### Requirement: ETHOS material-path attribution remains product-owned

The repository SHALL declare a non-empty `[openspec].material_paths` list.
Prewrite, changed planning, and proof SHALL attribute each matching fresh path
to the same single selected active official OpenSpec Change. The repository
SHALL NOT use `scope.toml`, a Commitment field, an archive, or another local
carrier as a second authorization mechanism. Non-official scope companions
from retired practice SHALL NOT remain in the present tracked archive tree;
Git history retains their original objects without certifying them under the
current contract.

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

#### Scenario: An obsolete companion is removed

- **WHEN** current tracked files are reviewed after source acceptance
- **THEN** no `scope.toml` remains in a present Change or archive directory
- **AND THEN** the earlier companion remains recoverable as a historical Git
  object rather than becoming a new authority or a falsified lifecycle claim.

### Requirement: Local and remote publication facts are separate

The repository SHALL keep local verification independent of remote
publication. GitLab SHALL be the organization primary release plane and GitHub
SHALL be an independent complete repository and CI/CD plane. The installed
ETHOS Git-common pre-push hook SHALL reject `work/*`, `candidate/dev`, and
`submit/*` publication destinations. Only `dev`, `main`, and `proposal/*`
destinations are eligible for further product admission. A configured remote,
a local accepted ref, or a passing job on a different object SHALL NOT
establish publication at a particular object. A GitHub fallback claim SHALL
require a successful product-governed GitHub publication when GitLab is
unavailable; a raw push SHALL NOT substitute for a product refusal.

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

Each hosted documentation job SHALL invoke the same shell-independent
repository-owned verifier from a real Git checkout. GitHub SHALL check out on
its managed runner before runtime setup and explicitly select the locked Node
major version. GitLab SHALL supply Git and the same declared toolchain before
verification. Provider setup MAY differ; the document-quality command and its
repository-relative inputs SHALL not. Action references SHALL bind immutable
maintained releases. A workflow declaration alone SHALL NOT count as hosted-CI
success.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job has no job-level container
- **AND THEN** checkout precedes runtime commands and explicit Node setup
- **AND THEN** the shared portable verifier remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates the GitLab documentation workflow
- **THEN** its prerequisite package installation includes Git before the shared
  verifier runs
- **AND THEN** its verifier command is identical to the GitHub projection.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Per-project dual-Forge runner isolation

GitHub documentation verification SHALL run the same complete verifier on
GitHub-hosted Linux, macOS, and Windows runners with immutable maintained
Actions, Node 22, and managed stable Chrome. It SHALL NOT use a local
self-hosted runner or host path. GitLab SHALL select the canonical
`ci-linux-arm64-docker` capability tag; a separately owned runner must actually
expose that tag before hosted success is claimed. The two providers' runtime
services, credentials, work areas, caches, and job observations SHALL remain
independent. Repository YAML SHALL NOT claim runner registration.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its three-OS hosted matrix, checks out first,
  configures Node 22, and binds Puppeteer to managed Chrome
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

## ADDED Requirements

### Requirement: Hosted rendering uses one validated launch configuration

The documentation adopter SHALL retain sandboxed Mermaid rendering by default.
Hosted verification SHALL select the same repository-owned Puppeteer launch
configuration through a repository-relative environment input. That
configuration SHALL be checked in, portable, and limited to the hosted Chrome
compatibility argument. Provider workflow YAML SHALL NOT inline a no-sandbox
command. The single verifier SHALL validate the selection before rendering
every present Mermaid diagram. Local configuration checks SHALL NOT be reported
as hosted-CI success.

#### Scenario: Local rendering has no hosted override

- **WHEN** the portable verifier runs without a hosted renderer selection
- **THEN** it does not select the no-sandbox hosted configuration
- **AND THEN** local Chrome sandbox behavior remains unchanged.

#### Scenario: A hosted provider selects the common verifier

- **WHEN** GitHub or GitLab runs documentation verification
- **THEN** its job provides the same repository-relative hosted configuration
  before invoking `npm run verify`
- **AND THEN** every diagram in that invocation uses that validated selection.

#### Scenario: A hosted selection is unsupported

- **WHEN** a provider names a different configuration or inlines a no-sandbox
  command in workflow YAML
- **THEN** the repository quality check rejects the projection
- **AND THEN** no hosted success is inferred from that rejection.

### Requirement: Versioned guideline releases have one checked identity

The repository SHALL declare its intended guideline release in `VERSION` as a
strict SemVer 2.0.0 value. The charter SHALL show the same edition and the
private npm tool manifest SHALL not declare a competing version. The public
compatibility surface comprises normative obligations, stable reader and Agent
routes, and documented contributor commands. An incompatible change to that
surface SHALL take a major increment; backward-compatible additions or
deprecations SHALL take a minor increment; compatible fixes SHALL take a patch
increment. Compatibility classification SHALL be reviewed in the official
Change rather than inferred from a formatted file.

`CHANGELOG.md` SHALL follow Keep a Changelog 1.1.0: `Unreleased` first, only
applicable Added, Changed, Deprecated, Removed, Fixed, and Security categories,
strict SemVer release headings with real ISO dates, newest first, and links to
version history. The repository quality gate SHALL reject uncategorized prose,
malformed structure, version disagreement, missing local tag coverage, or a
comparison for a tagged release that ends at a moving branch instead of its
tag. `Unreleased` SHALL compare from the latest local release tag when one
exists. A selected release tag SHALL identify the exact source. At most one
untagged prepared release entry MAY identify the current `VERSION`; a heading
alone is not publication.
Native ETHOS SHALL admit signed annotated `vX.Y.Z` tags and publication. Older
untagged branch editions SHALL NOT be retroactively labeled as formal releases.

#### Scenario: A current release is prepared but not yet tagged

- **WHEN** `VERSION` and the charter agree, `Unreleased` is first, and at most
  one dated current-version section is prepared without a local tag
- **THEN** repository source validation may pass for preparation
- **AND THEN** no Forge Release or signed tag is claimed from that heading.

#### Scenario: Version, changelog, or tag identities diverge

- **WHEN** a heading has a noncanonical category, invalid date or SemVer,
  duplicates another version, lacks a real history link, omits a local tag,
  or disagrees with `VERSION` or the selected tag's exact source
- **THEN** the repository quality gate rejects the release candidate
- **AND THEN** native ETHOS publication cannot substitute a different version
  or silently treat an untagged earlier edition as a release.

#### Scenario: A breaking contributor command is retired

- **WHEN** documented shell commands are replaced by one portable entrypoint
- **THEN** the official Change identifies the compatibility break and the next
  release takes a major increment
- **AND THEN** migration guidance names the new command without keeping a
  permanent shell compatibility facade.

## REMOVED Requirements

### Requirement: Hosted Mermaid rendering uses an explicit CI-only launch configuration

**Reason:** Its required scenarios describe a nested shell rollout validator
that no longer exists in the portable single-verifier design.

**Migration:** The added hosted-rendering requirement retains the sandbox
boundary while applying one validated configuration to every diagram.

### Requirement: Candidate branch remains local-only

**Reason:** Its branch rule duplicates the local/remote publication requirement
and still assigns pre-push authority to a retired repository shell hook.

**Migration:** The modified publication requirement keeps the local-only branch
boundary while assigning admission to the installed ETHOS Git-common hook.
