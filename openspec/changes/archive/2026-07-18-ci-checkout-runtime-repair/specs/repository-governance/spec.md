# Spec

## ADDED Requirements

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
