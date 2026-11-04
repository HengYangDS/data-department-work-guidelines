## Why

The repository declares and runs ETHOS 0.2.0-alpha.28. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.29, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.29 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. Its adopter-facing changes are small. The shipped CI model pins
`jdx/mise-action` 5.2.6, which no longer hangs when a cache restore fails mid-download, so the
generated GitHub workflow moves with it. The managed Ruff policy selects `DOC102`, and pre-commit
now checks staged Python with the shipped Ruff settings; this repository holds no Python, so
neither applies. Archive readiness now refuses a Change that a decision record names but the
Change does not cite; no record in `docs/decisions/` names an active Change. The release's
archives and wheels carry GitHub artifact attestations. Its runtime bundles `uv` 0.13.7, whose
`rustls` 0.23.46 fixes the four advisories in the `uv` binary that ETHOS 0.2.0-alpha.18 recorded.

## What Changes

- Replace the 0.2.0-alpha.28 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.29, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.29 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.28 runtime as the rollback.
- Regenerate the GitHub workflow from the common model, whose Mise action pin moves to 5.2.6.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, the generated `.github/workflows/ci.yml`,
`CHANGELOG.md` and the repository-common runtime selection. Hosted jobs keep Mise 2026.10.25, the
Mise floor and GitLab's Linux image. `tasks.md` is the sole progress ledger.
