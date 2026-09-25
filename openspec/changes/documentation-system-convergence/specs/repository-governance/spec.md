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
