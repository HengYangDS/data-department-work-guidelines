# Spec Delta

## MODIFIED Requirements

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
