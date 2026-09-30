# Spec Delta

## MODIFIED Requirements

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
SHALL use managed runners; GitLab SHALL use project-locked ARM64 capabilities.
Native review and protected jobs SHALL have separate Runner identities,
accounts, roots, and caches. Native Runners SHALL be tagged-only, with
`not_protected` review and `ref_protected` release access. GitLab SHALL protect
`dev`, `main`, and `v*`. YAML SHALL NOT prove execution; emulation SHALL NOT
prove native x86_64 behavior.

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
- **THEN** only the native review jobs are eligible, not protected-source jobs
- **AND WHEN** GitLab evaluates `dev`, `main`, or a version tag
- **THEN** only protected native source jobs are eligible
- **AND THEN** release offline jobs use protected runners after publication.

#### Scenario: An open proposal has one review pipeline

- **WHEN** a `proposal/*` branch has an open merge request
- **THEN** its branch-push pipeline is suppressed and its merge-request
  pipeline remains eligible for the review runners
- **AND WHEN** the proposal has no open merge request
- **THEN** its branch push may run the review jobs without admitting an
  arbitrary work branch or a protected Runner.

#### Scenario: Runner labels hide a shared native account

- **WHEN** review and protected selectors resolve to the same persistent
  account, workspace, cache, or Runner identity
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

### Requirement: Offline verification supply is a separately observed release asset

An offline release SHALL publish one source-bound bundle with the same verified
SHA-256 on both Forges. The bundle SHALL derive from locked package and lychee
manifests and exclude credentials, host paths, `node_modules/`, and ETHOS state.
Each Forge SHALL acquire its own asset and run the full offline install and
verifier on Linux, macOS, and Windows at the exact tag. Source, assets, refs,
jobs, and Releases SHALL be observed separately. After acquisition, use SHALL
NOT require either Forge.

#### Scenario: Both Forges publish the release bundle

- **WHEN** a versioned source tag and bundle are prepared
- **THEN** each Forge Release exposes an asset whose retrieved bytes match the
  committed or independently supplied release digest
- **AND THEN** both assets have the same SHA-256 and are bound to the same
  source version and lockfile.

#### Scenario: Each Forge runs its own offline platform check

- **WHEN** both Forge Releases expose the same verified bundle
- **THEN** each Forge's post-publication Linux, macOS, and Windows jobs acquire
  the bundle from that Forge and run its full offline installer and verifier
- **AND THEN** each result identifies its own source tag, bundle digest, and
  execution platform rather than borrowing a peer's result.

#### Scenario: One Forge is unavailable after acquisition

- **WHEN** a user has the verified bundle locally or can retrieve it from the
  available Forge while the other Forge is unavailable
- **THEN** installation and verification proceed without consulting the
  unavailable Forge
- **AND THEN** an asset listing, a prior job, or one Forge's release is not
  presented as proof of the other Forge's current asset.

#### Scenario: Source exists without a qualified bundle

- **WHEN** a source tag or hosted documentation job passes but the bundle is
  missing, mismatched, or untested on a claimed host
- **THEN** source and hosted verification facts remain reportable
- **AND THEN** cold offline distribution remains unqualified.
