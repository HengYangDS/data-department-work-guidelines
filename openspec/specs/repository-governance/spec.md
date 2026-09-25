# repository-governance

## Purpose

ETHOS SHALL keep the Repository Lifecycle Governance family cohesive and
separate from adopter-specific semantics.

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

### Requirement: Candidate branch remains local-only

The repository SHALL treat `candidate/dev` as a local integration resource.
GitLab and GitHub SHALL receive only `dev`, `main`, or `proposal/*` refs. The
repository-owned pre-push boundary SHALL reject `candidate/dev` as a local
source or remote destination before generic ETHOS admission. Local proof,
integration, and accepted closeout SHALL NOT imply either remote was updated.
Formal publication SHALL require a source commit whose signature is verified
against an operator-owned external trust anchor; the repository SHALL NOT store
signing credentials or a host-specific trust path.

#### Scenario: Local candidate proof is not publication evidence

- **WHEN** candidate validation or accepted closeout completes locally
- **THEN** the result SHALL NOT assert a GitLab or GitHub push.

#### Scenario: Candidate push is rejected locally

- **WHEN** Git supplies `refs/heads/candidate/dev` as either a local source or
  remote destination in a pre-push pair
- **THEN** the repository hook exits nonzero before delegation
- **AND THEN** no remote connection or publication is implied.

#### Scenario: Eligible branch remains delegated

- **WHEN** Git supplies `refs/heads/dev`, `refs/heads/main`, or
  `refs/heads/proposal/*` as a pre-push destination
- **THEN** the repository hook delegates that ref to the repository-bound ETHOS
  admission adapter
- **AND THEN** local delegation does not assert remote success.

#### Scenario: Retired submit prefix is rejected

- **WHEN** Git supplies `refs/heads/submit/*` as a pre-push destination
- **THEN** the repository hook rejects it before ETHOS delegation
- **AND THEN** no second proposal branch namespace remains active.

#### Scenario: Source trust is missing

- **WHEN** an accepted source commit lacks a verifiable signature or the
  operator's external trust anchor is unavailable
- **THEN** formal publication remains blocked before either peer is updated
- **AND THEN** a hook-admitted raw Git push is not treated as equivalent proof.

### Requirement: ETHOS material-path attribution remains product-owned

The repository SHALL declare a non-empty `[openspec].material_paths` list.
Prewrite, changed planning, and proof SHALL attribute each matching fresh path
to the same single selected active official OpenSpec Change. The repository
SHALL NOT use `scope.toml`, a Commitment field, an archive, or another local
carrier as a second authorization mechanism.

#### Scenario: Material path is attributed

- **WHEN** the repository evaluates a declared material path with exactly one
  valid selected active Change
- **THEN** admission, planning, and proof report that Change as the path owner
- **AND THEN** no `scope.toml`, Commitment field, archive, or local validator
  participates in authorization.

#### Scenario: Material path has no unique active Change

- **WHEN** no active Change exists, an explicitly selected Change is missing, or
  more than one active Change could own the path
- **THEN** the ETHOS command plane rejects the operation with its current
  missing or ambiguous Change diagnostic
- **AND THEN** historical carriers and repository-local tests do not substitute
  for active intent.

### Requirement: Local and remote publication facts are separate

The repository SHALL keep local verification independent of remote publication.
GitLab SHALL be the organization primary release plane and GitHub SHALL be an
independent complete repository and CI/CD plane. Local hooks SHALL reject
`work/*` and `candidate/dev` as publication refs and permit only `dev`, `main`,
and `proposal/*` to reach generic ETHOS push admission. A configured remote, a
local accepted ref, or a passing job on a different object SHALL NOT establish
publication at a particular object. A GitHub fallback claim SHALL require a
successful product-governed GitHub publication when GitLab is unavailable; the
repository SHALL NOT substitute a raw push for a product refusal.

#### Scenario: Candidate publication is attempted

- **WHEN** Git supplies `candidate/dev` as a local source or remote destination
  to the pre-push hook
- **THEN** the hook rejects it before generic push admission
- **AND THEN** no remote publication result is asserted.

#### Scenario: A proposal ref is submitted

- **WHEN** Git supplies `proposal/*` as a publication destination
- **THEN** the repository hook delegates that ref to generic ETHOS admission
- **AND THEN** delegation alone does not assert remote acceptance.

#### Scenario: One Forge is unavailable

- **WHEN** GitLab is unavailable but GitHub remains reachable
- **THEN** a GitHub publication claim requires an observed product-governed
  publication and the exact GitHub ref at the claimed object
- **AND THEN** neither local proof nor a raw Git push substitutes for that
  observation.

### Requirement: Hosted documentation verification begins from a Git checkout

Each hosted documentation job SHALL invoke the same repository-owned verifier
from a real Git checkout. GitHub SHALL check out on its managed Ubuntu runner
before runtime setup and explicitly select Node 22. GitLab SHALL install Git
before the verifier runs in its Docker runtime. Action references SHALL bind
immutable maintained releases. A workflow declaration alone SHALL NOT count as
hosted-CI success.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job has no job-level container
- **AND THEN** checkout precedes runtime commands and explicit Node 22 setup
- **AND THEN** the shared bound verifier remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates the GitLab documentation workflow
- **THEN** its prerequisite package installation includes Git before the shared
  bound verifier runs
- **AND THEN** its verifier command is identical to the GitHub projection.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Hosted Mermaid rendering uses an explicit CI-only launch configuration

The documentation adopter SHALL retain sandboxed Mermaid rendering by default.
When the shared hosted documentation verifier runs under a provider projection,
it SHALL select the same repository-owned Puppeteer launch configuration through
a repository-relative input. That configuration SHALL be checked in, portable,
and limited to the hosted Chrome compatibility argument. Provider workflow YAML
SHALL NOT contain an inline no-sandbox command. Every nested documentation
validation initiated by that shared verifier SHALL receive the same already
validated selection. Local workflow validation or rendering SHALL NOT be
reported as hosted-CI success.

#### Scenario: Local documentation validation has no hosted override

- **WHEN** `scripts/validate-docs.sh` runs without its hosted-renderer option
- **THEN** Mermaid CLI receives no Puppeteer configuration file
- **AND THEN** local Chrome sandbox behavior remains unchanged.

#### Scenario: Hosted provider invokes the common verifier

- **WHEN** GitHub or GitLab documentation verification runs
- **THEN** the projection exports the same repository-relative hosted renderer
  configuration before the shared bound verifier starts
- **AND THEN** the verifier selects that configuration through the repository
  validator rather than a provider-local render command.

#### Scenario: Hosted selection reaches nested rollout validation

- **WHEN** GitHub or GitLab documentation verification selects the canonical
  hosted renderer configuration
- **THEN** the shared verifier passes the same validated repository-relative
  option to both direct documentation validation and rollout-readiness
  validation
- **AND THEN** every Mermaid render in that invocation receives the canonical
  Puppeteer configuration.

#### Scenario: CI override is malformed or inlined

- **WHEN** a projection omits the canonical config, names a different config, or
  includes an inline no-sandbox string
- **THEN** the repository CI contract test rejects the projection
- **AND THEN** no hosted success is inferred from that rejection.

#### Scenario: Unsupported hosted selection stops before validation

- **WHEN** the shared verifier receives an unsupported hosted renderer value
- **THEN** it fails before invoking direct or rollout validation
- **AND THEN** no hosted success is inferred from that rejection.

### Requirement: Per-project dual-Forge runner isolation

GitHub documentation verification SHALL use a GitHub-hosted Ubuntu runner with
immutable maintained Actions, Node 22, and managed stable Chrome before the
shared verifier runs. It SHALL NOT use a local self-hosted runner or host path.
GitLab documentation verification SHALL select the canonical
`ci-linux-arm64-docker` capability tag, while a separately owned runner must
actually expose that tag before a hosted success claim. The two providers'
runtime services, credentials, work areas, caches, and job observations SHALL
remain independent. Repository YAML SHALL NOT claim runner registration.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects `ubuntu-latest`, checks out first, configures Node 22,
  and binds Puppeteer to managed Chrome
- **AND THEN** GitLab selects `ci-linux-arm64-docker` and both jobs invoke the
  same repository verifier.

#### Scenario: Fork-origin code cannot run on the GitHub local host

- **WHEN** a pull request head repository differs from the GitHub repository
- **THEN** GitHub-hosted execution does not select or expose a local GitHub host
- **AND THEN** the workflow retains read-only contents permission and the shared
  verifier runs only in the managed hosted environment.

#### Scenario: Local configuration is not hosted evidence

- **WHEN** workflow lint or local proof passes
- **THEN** the repository does not assert that GitHub Actions or GitLab CI
  executed
- **AND THEN** each Forge requires a fresh run at the published revision for its
  own success claim.

### Requirement: Change completion follows declared obligations

The repository SHALL keep an official material Change active while any of its
declared source or delivery tasks remain unverified. Source acceptance MAY
advance candidate and accepted refs while remote delivery is pending. Archive
SHALL follow completion of the tasks actually declared, and its resulting Git
object SHALL receive a fresh applicable proof and publication observation.
Source-only Changes MAY archive before integration when their obligations are
already complete.

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

The repository SHALL not require a tracked `evidence/` root or a new
claim/Chronicle pair as a condition of material Change admission. Source proof
SHALL resolve from current ETHOS Attestations, Git objects, official OpenSpec
artifacts, and selected Forge observations. A real-work quality or adoption
claim SHALL name the underlying task and evidence source, its time, scope, and
reviewer instead of treating repository validation as proof of organizational
use. Historical tracked evidence MAY be retired in a new commit after unique
facts and inbound consumers are reviewed; Git history remains unchanged.

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

The repository SHALL declare an SSH commit policy requiring signatures on new
commits, including commits generated by the official archive transition. It
SHALL not pin a person's author, committer, key, or host path in tracked policy.
An operator SHALL supply clone-local Git identity, a public signing-key path,
and an external protected trust anchor before generating such a commit. An
unsigned archive object or an object carrying an unintended host-derived
identity SHALL NOT be accepted or published as the completed Change.

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
