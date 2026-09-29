# Spec Delta

## ADDED Requirements

### Requirement: Release operations are reproducible from the contributor route

The contributor guide SHALL name the inputs, commands, order, and separate
checks needed to sign a SemVer edition, build and inspect its source-pinned
offline bundle, publish identical bytes on GitLab and GitHub, and qualify every
declared host. It SHALL distinguish local source proof, each remote ref and
Release, retrieved asset bytes, hosted CI, and offline execution. It SHALL
embed no operator credential, private host path, cache location, or competing
lifecycle command.

#### Scenario: A maintainer prepares and publishes a release

- **WHEN** an authorized maintainer starts from the accepted source and the
  pinned package and tool-supply manifests
- **THEN** the contributor route identifies the exact build inputs and release
  checks without relying on an earlier chat or this host's directories
- **AND THEN** the signed tag, both Forge Releases, matching asset digests, and
  full offline host results are observed as separate facts before completion.

#### Scenario: One publication or host qualification is missing

- **WHEN** a Forge Release, retrieved asset digest, or declared host's complete
  offline run has not been observed at the selected source
- **THEN** the release guidance keeps that claim open while reporting the
  checks that actually passed
- **AND THEN** an earlier tag job, local source check, or peer Forge result does
  not substitute for the missing observation.
