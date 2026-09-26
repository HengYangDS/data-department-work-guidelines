# Spec Delta

## ADDED Requirements

### Requirement: Offline verification supply is a separately observed release asset

A versioned release that claims offline verification SHALL publish a
source-bound bundle with identical verified SHA-256 bytes on GitLab and GitHub.
The bundle SHALL be generated from the release's locked dependency and lychee
manifests without embedding credentials, operator paths, a tracked
`node_modules/` tree, or ETHOS runtime state. The release's source, bundle,
Forge refs, hosted jobs, and Forge Release objects SHALL be observed separately.
Acquisition of the bundle MAY use either Forge before going offline; execution
after acquisition SHALL not depend on either Forge.

#### Scenario: Both Forges publish the release bundle

- **WHEN** a versioned source tag and bundle are prepared
- **THEN** each Forge Release exposes an asset whose retrieved bytes match the
  committed or independently supplied release digest
- **AND THEN** both assets have the same SHA-256 and are bound to the same
  source version and lockfile.

#### Scenario: One Forge is unavailable after acquisition

- **WHEN** a user has the verified bundle locally or can retrieve it from the
  available Forge while the other Forge is unavailable
- **THEN** installation and verification proceed without consulting the
  unavailable Forge
- **AND THEN** an asset listing, a prior job, or one Forge's release is not
  presented as proof of the other Forge's current asset.

#### Scenario: Source exists without a qualified bundle

- **WHEN** a source tag or hosted documentation job passes but the bundle is
  missing, mismatched, or untested on a claimed host
- **THEN** source and hosted verification facts remain reportable
- **AND THEN** cold offline distribution remains unqualified.

### Requirement: GitLab Runner image admission matches the source pin

The declared GitLab Linux ARM64 Runner SHALL allow only the exact OCI image
digest pinned by both repository CI jobs and SHALL use a local-only image pull
policy. Before unpausing that Runner, the deployment owner SHALL verify that
its Docker store resolves the same digest for Linux ARM64. A cached image under
a floating tag, an older successful job, or an available registry endpoint
SHALL NOT substitute for that check.

#### Scenario: Exact image is ready before a job

- **WHEN** the Runner policy allows the CI image digest and Docker resolves it
  locally for Linux ARM64
- **THEN** the Runner may be admitted for an exact-source job without fetching
  a replacement image at job start
- **AND THEN** hosted success is claimed only after that job actually passes.

#### Scenario: Cache or allowlist differs from source

- **WHEN** the pinned digest is absent from the Runner allowlist or local Docker
  store, even if the matching image tag exists
- **THEN** the Runner remains paused or the job fails closed under its local-only
  pull policy
- **AND THEN** the source pin is not weakened to obtain a passing CI result.
