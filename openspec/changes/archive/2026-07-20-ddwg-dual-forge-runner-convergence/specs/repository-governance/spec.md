# Spec

## ADDED Requirements

### Requirement: Per-project dual-Forge runner isolation

The documentation adopter SHALL use one repository-specific GitHub self-hosted
runner and one distinct repository-specific GitLab runner. GitHub workflow
selection SHALL require `self-hosted`, `macOS`, `ARM64`, and the non-secret
`DDWG_GITHUB_RUNNER_LABEL` repository variable. GitLab documentation work SHALL
select `ddwg-documentation-ci`; its corresponding remote runner SHALL be locked,
accept no untagged jobs, and expose only that tag. The two runner services,
credentials, work areas, caches, and evidence records SHALL NOT be shared across
Forges or projects.

#### Scenario: Repository workflow bindings are statically valid

- **WHEN** the repository validates its GitHub and GitLab CI projections
- **THEN** GitHub requires its dedicated macOS/ARM64 labels and variable
- **AND THEN** GitLab explicitly selects `ddwg-documentation-ci`
- **AND THEN** both projections invoke the same repository-owned verifier.

#### Scenario: Fork-origin code cannot run on the GitHub local host

- **WHEN** a pull request head repository differs from the GitHub repository
- **THEN** the GitHub documentation job is skipped
- **AND THEN** the local GitHub runner does not execute the fork's code.

#### Scenario: Local configuration is not hosted evidence

- **WHEN** workflow lint, local proof, or runner-control-plane readback passes
- **THEN** the result SHALL NOT assert that GitHub Actions or GitLab CI executed
- **AND THEN** each Forge requires a fresh run at the published revision before
  its own success claim is made.
