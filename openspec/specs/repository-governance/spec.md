# repository-governance

## Purpose

ETHOS SHALL keep the Repository Lifecycle Governance family cohesive and
separate from adopter-specific semantics.

## Requirements

### Requirement: Family Boundary

The repository-governance family SHALL describe one bounded product concern.

#### Scenario: Family remains bounded

- **WHEN** ETHOS validates repository governance
- **THEN** repository-governance requirements are checked without introducing private
  adopter semantics into the product core

### Requirement: Documentation archive closeout remains proof-bound

A documentation adopter SHALL keep the active Change carrier until the official
OpenSpec archive has completed. After that archive changes the repository tree,
the adopter SHALL run a fresh HEAD-bound local proof before candidate landing or
accepted closeout. Local proof SHALL NOT imply GitLab/GitHub publication,
hosted rendering, or organizational adoption.

#### Scenario: Official archive changes the proof target

- **WHEN** an active documentation-adopter Change is moved by official OpenSpec
  archive
- **THEN** its accepted specification and dated archive carrier SHALL be present
- **AND** only a proof executed at the resulting HEAD may support local land.

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

The documentation adopter SHALL treat `candidate/dev` as a local candidate
train. GitLab and GitHub publication projections SHALL NOT receive
`candidate/dev`; only `dev`, `main`, and `submit/*` are eligible for remote
projection. The repository-owned pre-push hook SHALL reject
`refs/heads/candidate/dev` as either a local source or remote destination before
generic ETHOS push admission. After official archive of a local boundary Change,
the dated archive SHALL remain unchanged; exact-HEAD local proof of the archived
resulting tree is sufficient for local candidate landing and SHALL NOT imply
remote publication, hosted rendering, or organizational adoption.

#### Scenario: Local candidate proof is not publication evidence

- **WHEN** candidate validation or accepted closeout completes locally
- **THEN** the result SHALL NOT assert a GitLab or GitHub push

#### Scenario: Candidate push is rejected locally

- **WHEN** Git supplies `refs/heads/candidate/dev` as either a local source or
  remote destination in a pre-push pair
- **THEN** the repository hook exits nonzero before delegation
- **AND** no remote connection or publication is implied

#### Scenario: Eligible branch remains delegated

- **WHEN** Git supplies `refs/heads/dev`, `refs/heads/main`, or
  `refs/heads/submit/*` as a pre-push destination
- **THEN** the repository hook delegates that ref to the repository-bound ETHOS
  admission adapter
- **AND** local delegation does not assert remote success

### Requirement: One material governance Change owns the repair

The repository SHALL carry the adoption governance correction through one active
official OpenSpec Change with proposal, design, delta specifications, tasks, and
an active claim. It SHALL NOT retain an additional active or archived
reconciliation carrier for the same correction as a substitute for completing
that Change.

#### Scenario: Material repair is prepared

- **WHEN** the repository changes governance carriers, claims, decision topology,
  proof boundaries, or publication boundaries
- **THEN** `adoption-lifecycle-repair-20260714` is the sole substantive Change
  carrier for that repair
- **AND THEN** its active claim binds the same Change path.

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

### Requirement: Historical claims remain honest

A historical claim with no real historic Change carrier SHALL remain historical
and digest-bound. It SHALL NOT receive a new `change_id` merely to make prior
work appear lifecycle-compliant.

#### Scenario: Pre-lifecycle record is retained

- **WHEN** a July 12 historical record is retained after this repair
- **THEN** it makes no current readiness, archive, or remote-publication claim
- **AND THEN** it is not rebound to the current Change.

### Requirement: Local and remote publication facts are separate

The repository SHALL keep local verification independent of remote publication.
GitLab SHALL be the organization primary release plane and GitHub SHALL be an
independent complete repository and CI/CD plane. Local hooks SHALL reject
`work/*` and `candidate/dev` as publication refs and permit only `dev`, `main`,
and `submit/*` to reach generic ETHOS push admission.

#### Scenario: Candidate publication is attempted

- **WHEN** Git supplies `candidate/dev` as a local source or remote destination
  to the pre-push hook
- **THEN** the hook rejects it before generic push admission
- **AND THEN** no remote publication result is asserted.

### Requirement: Divergent owned Work Lane residue is preserved before retirement

A documentation adopter SHALL NOT retire a clean owned Work Lane merely because
the accepted root contains similarly named paths. When the target has a
divergent changed-path tree, the repository SHALL carry a separate current
OpenSpec Change that records the exact branch/head observation, the
non-absorption finding, a recovery boundary, and the intended native resolution
disposition. After that Change becomes accepted, ETHOS SHALL re-observe the
target and create and verify a content-addressed preservation package before
the exact branch and linked worktree are removed.

#### Scenario: Clean owned residue is not structurally absorbed

- **WHEN** an owned Work Lane is clean but one or more objects for its
  changed paths differ from the current accepted head
- **THEN** ordinary landed or superseded retirement SHALL NOT be represented as
  an absorption outcome
- **AND THEN** the repository SHALL preserve the exact target through the
  accepted native resolution before destructive retirement.

#### Scenario: Recorded target becomes stale

- **WHEN** the target branch, head, lease observation, or worktree content
  changes after the decision is recorded
- **THEN** ETHOS SHALL reject the old resolution observation
- **AND THEN** a contributor SHALL re-audit the target instead of applying the
  prior destructive disposition.

#### Scenario: Residue cleanup is not publication evidence

- **WHEN** a preservation package and local retirement receipt are produced
- **THEN** they SHALL establish only the local Work Lane disposition
- **AND THEN** they SHALL NOT assert GitLab or GitHub publication, hosted CI,
  rendered documentation, or organizational adoption.

### Requirement: Hosted documentation verification begins from a Git checkout

Every hosted documentation verification projection SHALL invoke the same
repository-owned bound verifier from a real Git checkout. GitHub SHALL perform
`actions/checkout@v4` on the hosted runner before any runtime command and SHALL
select Node 22 explicitly afterward. GitLab SHALL install Git before the bound
verifier runs in its Docker runtime. A workflow declaration alone SHALL NOT be
reported as hosted-CI success.

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

### Requirement: Real adopter lifecycle validation remains carrier-bound

A documentation adopter SHALL be able to demonstrate material Change admission
in an owned Work Lane through the official OpenSpec lifecycle. The validation
Change SHALL bind a dated active claim and SHALL NOT represent a method package,
document correctness gate, or local test log as the Change carrier.

#### Scenario: Material lifecycle validation is exercised

- **WHEN** a leased Work Lane validates a declared material path
- **THEN** no active Change or an incomplete active Change is rejected by the
  ETHOS command plane
- **AND THEN** a valid single official Change owns matching fresh material paths
  without a repository-authored companion scope.

### Requirement: Archived Change carriers have canonical identity

A documentation adopter SHALL name every archived OpenSpec Change as
`YYYY-MM-DD-<date-free-logical-id>`. A historical Change's logical identifier
MAY remain in claims, Chronicles, evidence IDs, and historical command records,
but its archive directory SHALL NOT retain a second temporal suffix. A path-only
identity normalization SHALL preserve the historic record and SHALL NOT be
reported as a fresh archive, proof, accepted closeout, publication, or hosted
execution result.

#### Scenario: Historical archive path is normalized

- **WHEN** an archive directory has one archive-date prefix and a logical ID
  with a trailing temporal suffix
- **THEN** the repository moves that carrier to the canonical archive path
- **AND THEN** carrier-location references resolve to that one path
- **AND THEN** the historical Change ID, dated observation, and external-evidence
  boundary remain unchanged.

#### Scenario: Duplicate legacy carrier is forbidden

- **WHEN** a canonical archive path exists for a logical Change
- **THEN** the former noncanonical archive path is absent
- **AND THEN** the repository archive audit reports no identity ambiguity.

### Requirement: Per-project dual-Forge runner isolation

The documentation adopter SHALL use GitHub-hosted Ubuntu runners for GitHub
documentation verification and one distinct repository-specific GitLab runner
for GitLab documentation verification. GitHub SHALL select `ubuntu-latest`,
pin maintained Actions to immutable stable-release commits, explicitly set up
Node 22, and install stable Chrome through a maintained GitHub Action before the
shared repository verifier runs.
GitHub SHALL NOT select `self-hosted`, macOS, ARM64, a repository runner label,
or a host-local Chrome or Homebrew path. GitLab documentation work SHALL retain
the `ddwg-documentation-ci` tag; its remote runner SHALL remain locked, reject
untagged jobs, and expose only that tag. The GitHub-hosted workflow and GitLab
runner services, credentials, work areas, caches, and evidence records SHALL
remain separate.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub documentation workflow
- **THEN** the job selects `ubuntu-latest`, checks out first, configures Node 22,
  and binds Puppeteer to the Chrome Action output
- **AND THEN** no self-hosted label, runner variable, macOS path, Homebrew path,
  or local-host pull-request guard remains.

#### Scenario: Fork-origin code cannot run on the GitHub local host

- **WHEN** a pull request head repository differs from the GitHub repository
- **THEN** GitHub-hosted execution does not select or expose a local GitHub host
- **AND THEN** the workflow retains read-only contents permission and the shared
  verifier runs only in the managed hosted environment.

#### Scenario: Local configuration is not hosted evidence

- **WHEN** workflow lint or local proof passes
- **THEN** the repository does not assert that GitHub-hosted Actions or GitLab
  CI executed
- **AND THEN** each Forge requires a fresh run at the published revision for its
  own success claim.

### Requirement: Post-archive proof repair preserves archive history

When an official OpenSpec archive changes a repository tree and its resulting
HEAD fails an existing local proof, the documentation adopter SHALL correct the
new proof target through a separate active Change. That repair SHALL preserve
the archived carrier and its historical digest, and its fresh proof SHALL be
bound to the repaired exact HEAD before candidate landing or accepted closeout.
Local proof SHALL NOT imply runner registration, publication, or hosted
execution.

#### Scenario: Archive-result proof is repaired without rewriting history

- **WHEN** an archive-result HEAD fails an existing repository proof
- **THEN** a separate active Change scopes the correction
- **AND THEN** the archived carrier remains unchanged
- **AND THEN** only a fresh exact-HEAD proof may support a later local landing.
