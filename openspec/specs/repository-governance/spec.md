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

### Requirement: Archived documentation closeout requires a distinct current proof carrier

After official OpenSpec archive moves a documentation-adopter closeout, the
repository SHALL preserve the dated archive unchanged and SHALL use a distinct
active Change and claim to bind the resulting tree to local proof. The proof
SHALL be executed at the resulting exact HEAD before candidate land. It SHALL
NOT imply remote publication, hosted rendering, or organizational adoption.

#### Scenario: Archive is followed by local proof reconciliation

- **WHEN** an official archive has changed the documentation-adopter tree
- **THEN** a distinct active reconciliation carrier SHALL reference that archive
- **AND** only its current HEAD-bound proof may support local candidate land.

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
generic ETHOS push admission.

#### Scenario: Candidate projection is rejected locally

- **WHEN** Git supplies `refs/heads/candidate/dev` as either a local source or
  remote destination in a pre-push pair
- **THEN** the repository hook exits nonzero before delegation
- **AND** no remote connection or publication is implied

#### Scenario: Local candidate proof is not publication evidence

- **WHEN** candidate validation or accepted closeout completes locally
- **THEN** the result SHALL NOT assert a GitLab or GitHub push
