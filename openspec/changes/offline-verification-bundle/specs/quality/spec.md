# Spec Delta

## ADDED Requirements

### Requirement: A supplied offline bundle can install the complete verification toolchain

For each declared host platform, the repository SHALL accept a release-bound
offline bundle that contains every locked npm package required by
`npm ci --offline --ignore-scripts` and that platform's pinned lychee asset.
Given a supported Node/npm and Git installation, the complete repository
verification graph SHALL run from an empty application cache without contacting
npm, GitLab, GitHub, or another remote. The bundle SHALL be checked against
committed source identities and an externally supplied or source-pinned bundle
digest before its contents are trusted. ETHOS installation and governance remain
a separate product prerequisite; a repository bundle SHALL NOT impersonate ETHOS
authority.

#### Scenario: Cold local verification succeeds without network access

- **WHEN** a user supplies a complete bundle for the checked-out release on a
  declared host with supported Node/npm and Git
- **AND** the application has no pre-existing npm cache, `node_modules/`, or
  lychee cache
- **THEN** the actual offline install and full repository verifier pass while
  outbound network access is unavailable
- **AND THEN** a successful `npm ci --offline --dry-run` alone is not accepted
  as installation evidence.

#### Scenario: Offline supply is incomplete or altered

- **WHEN** a bundle is missing a required npm entry or lychee asset, contains an
  unsafe member, or disagrees with the checked-out lockfile, tool manifest,
  version, or trusted bundle digest
- **THEN** the installer fails before accepting the toolchain or running the
  verifier
- **AND THEN** it does not silently fetch a replacement or mark the release
  qualified.

#### Scenario: A different supported platform consumes the same release

- **WHEN** the release claims macOS, Linux, and Windows support
- **THEN** the complete offline installation and verification graph is executed
  on each declared platform using the release's bundle
- **AND THEN** one platform's successful install or a static matrix declaration
  does not qualify another platform.
