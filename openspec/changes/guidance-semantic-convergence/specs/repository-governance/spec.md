# Spec Delta

## REMOVED Requirements

### Requirement: Family Boundary

**Reason**: Copied ETHOS product-family shape is not an adopter requirement.

**Migration**: ETHOS retains its own specification; DDWG keeps only its own
observable obligations.

### Requirement: Documentation archive closeout remains proof-bound

**Reason**: It incorrectly requires archive before local integration even when
delivery obligations remain.

**Migration**: Use Change completion follows declared obligations; prove each
new source object at its actual stage.

### Requirement: One material governance Change owns the repair

**Reason**: The named July repair is complete historical work, not a permanent
requirement on every later Change.

**Migration**: Keep its official archive and use a new selected Change for new
material intent.

### Requirement: Historical claims remain honest

**Reason**: All retained tracked claim files are historical migration
annotations, not a required current proof system.

**Migration**: Preserve their original Git objects; current proof and historical
corrections use native Attestations and official Change history.

### Requirement: Divergent owned Work Lane residue is preserved before retirement

**Reason**: Generic retirement and preservation are owned by ETHOS; the
adopter-specific copy encodes one old cleanup campaign.

**Migration**: Use native lane status and exact retirement receipts; review
foreign or dirty content independently of this source Change.

### Requirement: Real adopter lifecycle validation remains carrier-bound

**Reason**: The one-off July validation campaign has finished and its
active-claim requirement is obsolete.

**Migration**: Official OpenSpec and ETHOS continue to govern each new material
Change without a tracked claim companion.

### Requirement: Archived Change carriers have canonical identity

**Reason**: This describes a completed path-only archive normalization, not an
ongoing DDWG behavior.

**Migration**: Preserve the historical Change and use the official archive
identity contract for future Changes.

### Requirement: Post-archive proof repair preserves archive history

**Reason**: This describes a completed repair incident rather than the normal
lifecycle.

**Migration**: Use the generic exact-source proof and new Change mechanism if a
future archive result fails.

## MODIFIED Requirements

### Requirement: Candidate branch remains local-only

The repository SHALL treat `candidate/dev` as a local integration resource.
GitLab and GitHub SHALL receive only `dev`, `main`, or `proposal/*` refs. The
repository-owned pre-push boundary SHALL reject `candidate/dev` as a local
source or remote destination before generic ETHOS admission. Local proof,
integration, and accepted closeout SHALL NOT imply either remote was updated.

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

## ADDED Requirements

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
