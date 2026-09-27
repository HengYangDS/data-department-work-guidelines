# Spec Delta

## ADDED Requirements

### Requirement: Offline release archives exclude host metadata

An offline release archive SHALL contain only the declared portable file tree
and payload bytes. Host extended attributes and other
platform-specific archive metadata SHALL NOT be published. Archive inspection
and extraction SHALL reject nonempty tool warnings rather than treating a zero
exit status as clean verification.

#### Scenario: Build inputs carry host extended attributes

- **WHEN** a builder stages otherwise valid files carrying host extended
  attributes
- **THEN** the release archive omits those attributes while preserving the
  declared file tree and bytes
- **AND THEN** no platform-specific archive header remains in the published
  bundle.

#### Scenario: Archive tooling warns without failing

- **WHEN** inspection or extraction emits a warning while returning exit zero
- **THEN** the offline verifier rejects the archive before claiming a clean
  install or release qualification
- **AND THEN** a digest match alone cannot override that refusal.

#### Scenario: The same archive is used on each supported host

- **WHEN** the exact signed release bundle is independently acquired for macOS,
  Linux, and Windows offline verification
- **THEN** each host verifies the same digest and completes the full offline
  install and repository check without archive warnings or network fallback.
