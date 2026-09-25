# repository-governance

## MODIFIED Requirements

### Requirement: Local and remote publication facts are separate

The repository SHALL keep local verification independent of remote publication.
GitLab SHALL be the organization primary release plane and GitHub SHALL be an
independent complete repository and CI/CD plane. Local hooks SHALL reject
`work/*` and `candidate/dev` as publication refs and permit only `dev`, `main`,
and `proposal/*` to reach generic ETHOS push admission. A configured remote, a
local accepted ref, or a passing job on a different object SHALL NOT establish
publication at a particular object. A GitHub fallback claim SHALL require a
successful product-governed GitHub publication when GitLab is unavailable; the
repository SHALL NOT substitute a raw push for a product refusal.

#### Scenario: Candidate publication is attempted

- **WHEN** Git supplies `candidate/dev` as a local source or remote destination
  to the pre-push hook
- **THEN** the hook rejects it before generic push admission
- **AND THEN** no remote publication result is asserted.

#### Scenario: A proposal ref is submitted

- **WHEN** Git supplies `proposal/*` as a publication destination
- **THEN** the repository hook delegates that ref to generic ETHOS admission
- **AND THEN** delegation alone does not assert remote acceptance.

#### Scenario: One Forge is unavailable

- **WHEN** GitLab is unavailable but GitHub remains reachable
- **THEN** a GitHub publication claim requires an observed product-governed
  publication and the exact GitHub ref at the claimed object
- **AND THEN** neither local proof nor a raw Git push substitutes for that
  observation.
