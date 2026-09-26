# Spec Delta

## ADDED Requirements

### Requirement: Each Forge supplies its pinned documentation tool independently

The GitLab documentation job SHALL fetch its pinned lychee asset from the same
GitLab project's generic package registry through the platform-provided CI API
URL, project ID, and job token. It SHALL NOT depend on GitHub Releases or
silently fall back to another Forge when the package is missing. The GitHub job
MAY use its pinned GitHub upstream asset path. Both SHALL check the same
committed SHA-256 and executable version before repository verification. The
job token SHALL be sent only as a request header, never stored in the URL,
repository, or logs. Local offline installation from an explicitly supplied
asset SHALL remain available without either Forge.

#### Scenario: GitLab runs while GitHub is unavailable

- **WHEN** the pinned asset exists in the same project's GitLab package
  registry and the GitLab CI job has its standard job token
- **THEN** GitLab installs that exact asset and reaches the common verifier
- **AND THEN** no GitHub asset endpoint is requested by the GitLab job.

#### Scenario: The GitLab package or identity is unavailable

- **WHEN** the package request fails or the standard CI URL, project ID, or job
  token is missing
- **THEN** the GitLab job fails without downloading from GitHub
- **AND THEN** it does not log the token or mark the verifier successful.

#### Scenario: A supplied asset is altered

- **WHEN** either Forge or a local installer receives bytes whose SHA-256 does
  not match the committed platform record
- **THEN** extraction and executable installation are rejected.

#### Scenario: A contributor verifies without a Forge

- **WHEN** a contributor supplies the pinned archive through the documented
  local asset option
- **THEN** the installer verifies and installs it without contacting GitLab or
  GitHub.
