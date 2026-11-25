## MODIFIED Requirements

### Requirement: Hosted documentation verification begins from a Git checkout

Each hosted job SHALL run the installed ETHOS full host graph from a Git checkout on ARM macOS.
GitHub SHALL check out first on its hosted `macos-latest` runner; GitLab SHALL run on its
project-locked ARM macOS guest, which supplies Git. Both SHALL install the locked ETHOS release
through Mise, and the command and repository-relative inputs SHALL NOT differ by provider. Actions
SHALL pin immutable maintained releases; workflow YAML alone SHALL NOT count as hosted execution.

#### Scenario: GitHub runner-native checkout is configured

- **WHEN** the repository validates the GitHub documentation workflow
- **THEN** the job runs on `macos-latest` and has no job-level container
- **AND THEN** checkout precedes runtime commands and the locked ETHOS installation
- **AND THEN** the installed full host graph remains the verification command.

#### Scenario: GitLab Docker runtime is configured

- **WHEN** the repository validates its GitLab documentation jobs
- **THEN** no job runs in a Docker container or on a Linux or Windows runner, and Git
  and Mise come from the ARM macOS guest without a browser package installation
- **AND THEN** each job's verifier command is identical to the GitHub projection.

#### Scenario: GitLab native runtimes are configured

- **WHEN** the repository validates the GitLab macOS jobs
- **THEN** each selects the project-locked ARM macOS guest by the tags
  `macos-latest` and `review`, or `macos-latest` and `protected`, and installs the
  locked ETHOS release before the common verifier
- **AND THEN** no job relies on a container image or a host path.

#### Scenario: Hosted evidence remains independent

- **WHEN** local workflow validation or repository proof passes
- **THEN** the result SHALL NOT assert that GitLab or GitHub hosted CI has run
  or passed.

### Requirement: Per-Forge runner isolation protects source verification

Both Forges SHALL run the full verifier only on ARM macOS, selected by the label `macos-latest`:
GitHub on its hosted runner, GitLab on project-locked Runners of its ARM macOS guest, whose tags
add `review` or `protected`. GitLab review and protected jobs SHALL have distinct Runner
identities, accounts, execution roots, caches, and credential reachability. Runners SHALL be tagged-only:
review `not_protected`, protected `ref_protected`. GitLab SHALL protect `dev`, `main`, and `v*`.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its declared hosted runner `macos-latest`, checks out
  first, and installs the locked ETHOS release
- **AND THEN** GitHub admits `dev`, `main`, `proposal/**`, and `v*` push events
  and pull requests targeting `dev` or `main`
- **AND THEN** GitLab selects review or protected project capabilities according
  to the source trust boundary, and every job invokes the same full verifier.

#### Scenario: A declared hosted check is skipped

- **WHEN** a GitHub source job drops its declared host (for example by a matrix
  `exclude`), skips a job or step, or tolerates a required failure
- **THEN** the installed common model or its projection check rejects such a
  source workflow before claiming that its declared host ran.

#### Scenario: Global setup alters a GitLab job

- **WHEN** GitLab adds global setup, an extra default, or a remote CI include
- **THEN** the installed projection check rejects it when generated-pipeline
  drift introduces it.

#### Scenario: Native source routes are trust-separated

- **WHEN** GitLab evaluates a proposal push or merge request
- **THEN** only the macOS review job is eligible
- **AND WHEN** GitLab evaluates `dev`, `main`, or a version tag
- **THEN** only the macOS protected source job is eligible.

#### Scenario: Linux selectors cannot cross the trust boundary

- **WHEN** the repository validates its GitLab source jobs
- **THEN** it declares no Linux source job
- **AND THEN** proposal and merge-request jobs select the review capability, and
  protected branch and tag jobs select a distinct protected capability
- **AND THEN** a Linux job, a missing job, or a job whose tags both a review and a
  protected Runner carry, such as `macos-latest` alone, fails the installed
  projection check before hosted execution is claimed.

#### Scenario: An open proposal has one review pipeline

- **WHEN** a `proposal/*` branch has an open merge request
- **THEN** its branch-push pipeline is suppressed and its merge-request
  pipeline remains eligible for the review runners
- **AND WHEN** the proposal has no open merge request
- **THEN** its branch push may run the review jobs without admitting an
  arbitrary work branch or a protected Runner.

#### Scenario: Runner labels hide a shared native account

- **WHEN** review and protected selectors resolve to the same Runner identity,
  account, workspace, cache, or credential reachability
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
  while its source clone still uses HTTP
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
- **AND THEN** local lint, a job on the other GitLab capability, or GitHub
  success does not substitute for the missing job.

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

## REMOVED Requirements

### Requirement: GitLab Runner image admission matches the source pin

**Reason**: From 10.1.0 DDWG runs no GitLab Linux job (the owner's decision of 2026-11-25), so no
job uses a CI image and no Runner admits one.

**Migration**: The GitLab jobs run on the ARM macOS guest's project-locked runners under
"Per-Forge runner isolation protects source verification"; no image is pinned.

### Requirement: GitLab bootstraps Mise from its own package registry

**Reason**: From 10.1.0 no GitLab job fetches Mise from the package registry (the owner's decision
of 2026-11-25); only the retired Linux job did, and the ARM macOS guest supplies its own Mise.

**Migration**: The GitLab macOS jobs install the locked ETHOS release with the guest's Mise under
"Hosted documentation verification begins from a Git checkout", and the project configuration's
Mise version floor rejects an older guest Mise. The registry's Mise packages are kept or retired
under "Remote download retention is bounded and truthful".
