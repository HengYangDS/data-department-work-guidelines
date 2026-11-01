## MODIFIED Requirements

### Requirement: Remote download retention is bounded and truthful

Editions from 8.0.0 SHALL attach no download, and downloads withdrawn from
earlier editions SHALL stay withdrawn. Each Forge SHALL keep the native tool
packages that retained source or current CI consume, plus the preceding version
for a CI rollback. Other packages, downloads and CI records without a current
consumer SHALL be retired through native provider operations; signed tags,
source, original release notes and historical acceptance evidence SHALL NOT be
rewritten or deleted.

#### Scenario: A superseded release asset is retired

- **WHEN** an attached download is retired
- **THEN** the maintainer removes that exact asset and its download link
- **AND** the Release preserves its original notes and gains an explicit dated
  withdrawal notice without claiming continued offline distribution
- **AND** the next edition's Changelog records the withdrawal.

#### Scenario: An asset is still consumed or its ownership is unknown

- **WHEN** current CI, retained source, an active job, or an unresolved owner
  could require a package
- **THEN** the package is preserved until its consumer or ownership is resolved
- **AND** age or size alone does not justify deletion.

#### Scenario: A deletion set is chosen by recency

- **WHEN** CI records are selected as everything except the newest, or by age
  alone
- **THEN** the selection is refused, because records created after the inventory
  or owned by another lane fall into it
- **AND** the deletion set is frozen instead as exact identifiers whose commits
  are proper ancestors of the release commit, after each Forge's open proposal
  refs are checked
- **AND** every record that belongs to another active lane stays.

#### Scenario: Cleanup is reported complete

- **WHEN** native provider deletion has finished
- **THEN** fresh inventories prove the selected assets absent and retained file
  identities and digests unchanged on each Forge
- **AND** storage reclamation is reported only when provider statistics confirm
  it; deletion acceptance alone does not prove released physical space.
