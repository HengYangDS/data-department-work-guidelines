## Why

On 2026-11-01 the owner withdrew every download attached to editions before
8.0.0 from both Forges: the 7.0.11 and 7.0.12 offline tools, the packages of the
retired toolkit and the CI history before 8.0.0. The records still describe the
earlier policy:

- The publication specification requires each Forge to keep the attached assets
  of the latest release and one rollback.
- Governance lists an asset among each Forge's required observations.
- The contributor procedure keeps a rollback download.
- The 8.0.0 notes say that earlier editions keep their attached downloads.

The cleanup also showed that choosing a deletion set by recency is unsafe. Its
first pass kept only tags and the newest dev and main records, and it deleted
another lane's completed proposal check run.

## What Changes

- Modify the publication requirement on remote download retention:
  - Editions from 8.0.0 attach no download, and earlier editions' downloads stay
    withdrawn.
  - Native tool packages consumed by retained source or current CI stay
    available, with the preceding version kept for a rollback of current CI.
  - A cleanup deletes only identifiers frozen from a fresh inventory, never a
    set chosen by recency, and leaves other lanes' records.
- Align governance and the contributor procedure with that requirement.
- Record the withdrawal in the Changelog under Unreleased.
- Record the cleanup's before and after inventories as evidence of this Change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `publication`: remote download retention.

## Impact

`openspec/specs/publication/spec.md` through this Change's delta,
`docs/governance/README.md`, `CONTRIBUTING.md` and `CHANGELOG.md`. No Forge
object changes in this Change. With the owner's approval, the four affected
Releases (7.0.11 and 7.0.12 on both Forges) already carry a dated withdrawal
notice appended to their unchanged notes, and the unreferenced GitHub Actions
variable `DDWG_GITHUB_RUNNER_LABEL` was deleted; this Change records both as
evidence.
