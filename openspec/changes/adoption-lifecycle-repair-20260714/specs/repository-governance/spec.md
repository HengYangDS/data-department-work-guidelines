# Spec

## ADDED Requirements

### Requirement: One material governance Change owns the repair

The repository SHALL carry the adoption governance correction through one active
official OpenSpec Change with proposal, design, delta specifications, tasks, and
an active claim. It SHALL NOT retain an additional active or archived
reconciliation carrier for the same correction as a substitute for completing
that Change.

#### Scenario: Material repair is prepared

- **WHEN** the repository changes governance carriers, claims, decision topology,
  proof boundaries, or publication boundaries
- **THEN** `adoption-lifecycle-repair-20260714` is the sole substantive Change
  carrier for that repair
- **AND THEN** its active claim binds the same Change path.

### Requirement: ETHOS material scope remains product-owned

The repository SHALL declare material path families in `[openspec].material_paths`.
The active Change SHALL include an ETHOS-owned `scope.toml` companion containing
only `schema_version` and `paths`. The companion SHALL be described as adjacent
to OpenSpec, not as an official OpenSpec workflow-schema extension.

#### Scenario: Material path is covered

- **WHEN** ETHOS evaluates a changed declared material path through prewrite,
  changed planning, or proof
- **THEN** the path is admitted only when the active Change companion covers it
- **AND THEN** an uncovered declared path is rejected by the ETHOS command plane.

### Requirement: Historical claims remain honest

A historical claim with no real historic Change carrier SHALL remain historical
and digest-bound. It SHALL NOT receive a new `change_id` merely to make prior
work appear lifecycle-compliant.

#### Scenario: Pre-lifecycle record is retained

- **WHEN** a July 12 historical record is retained after this repair
- **THEN** it makes no current readiness, archive, or remote-publication claim
- **AND THEN** it is not rebound to the current Change.

### Requirement: Local and remote publication facts are separate

The repository SHALL keep local verification independent of remote publication.
GitLab SHALL be the organization primary release plane and GitHub SHALL be an
independent complete repository and CI/CD plane. Local hooks SHALL reject
`work/*` and `candidate/dev` as publication refs and permit only `dev`, `main`,
and `submit/*` to reach generic ETHOS push admission.

#### Scenario: Candidate publication is attempted

- **WHEN** Git supplies `candidate/dev` as a local source or remote destination
  to the pre-push hook
- **THEN** the hook rejects it before generic push admission
- **AND THEN** no remote publication result is asserted.
