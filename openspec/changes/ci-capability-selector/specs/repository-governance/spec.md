# repository-governance Delta

## MODIFIED Requirements

### Requirement: Per-project dual-Forge runner isolation

GitHub SHALL run the full verifier on hosted Linux, macOS, and Windows with
pinned Actions and the declared Node line, never a local runner or host path.
GitLab SHALL select `ci-linux-arm64-container`; a real runner must expose
that tag before success is claimed. Provider services, credentials,
workspaces, caches, and job observations SHALL remain independent.
YAML SHALL NOT claim runner registration.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab documentation jobs
- **THEN** GitHub selects its three-OS hosted matrix, checks out first, and
  configures the declared Node line
- **AND THEN** GitLab selects `ci-linux-arm64-container` and both jobs invoke
  the same verifier.

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
