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
