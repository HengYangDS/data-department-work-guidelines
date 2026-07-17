# DDWG remote candidate push boundary specification delta

## MODIFIED Requirements

### Requirement: Candidate branch remains local-only

The documentation adopter SHALL treat `candidate/dev` as a local candidate
train. GitLab and GitHub publication projections SHALL NOT receive
`candidate/dev`; only `dev`, `main`, and `submit/*` are eligible for remote
projection. The repository-owned pre-push admission SHALL reject an attempted
`refs/heads/candidate/dev` projection before generic ETHOS push admission.

#### Scenario: Local candidate proof is not publication evidence

- **WHEN** candidate validation or accepted closeout completes locally
- **THEN** the result SHALL NOT assert a GitLab or GitHub push

#### Scenario: Candidate projection is rejected locally

- **WHEN** Git supplies `refs/heads/candidate/dev` as either a local source or
  remote destination in a pre-push pair
- **THEN** the repository hook exits nonzero before delegation
- **AND** no remote connection or publication is implied

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
