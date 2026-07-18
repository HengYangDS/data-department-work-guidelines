# Repository Governance Delta

## MODIFIED Requirements

### Requirement: Divergent owned Work Lane residue is preserved before retirement

A documentation adopter SHALL NOT retire a clean owned Work Lane merely because
the accepted root contains similarly named paths. When the target has a
divergent changed-path tree, the repository SHALL carry a separate current
OpenSpec Change that records the exact branch/head observation, the
non-absorption finding, a recovery boundary, and the intended native resolution
disposition. After that Change becomes accepted, ETHOS SHALL re-observe the
target and create and verify a content-addressed preservation package before
the exact branch and linked worktree are removed.

#### Scenario: Clean owned residue is not structurally absorbed

- **WHEN** an owned Work Lane is clean but one or more objects for its
  changed paths differ from the current accepted head
- **THEN** ordinary landed or superseded retirement SHALL NOT be represented as
  an absorption outcome
- **AND THEN** the repository SHALL preserve the exact target through the
  accepted native resolution before destructive retirement.

#### Scenario: Recorded target becomes stale

- **WHEN** the target branch, head, lease observation, or worktree content
  changes after the decision is recorded
- **THEN** ETHOS SHALL reject the old resolution observation
- **AND THEN** a contributor SHALL re-audit the target instead of applying the
  prior destructive disposition.

#### Scenario: Residue cleanup is not publication evidence

- **WHEN** a preservation package and local retirement receipt are produced
- **THEN** they SHALL establish only the local Work Lane disposition
- **AND THEN** they SHALL NOT assert GitLab or GitHub publication, hosted CI,
  rendered documentation, or organizational adoption.
