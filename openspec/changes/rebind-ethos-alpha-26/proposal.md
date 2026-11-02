## Why

The repository declares and runs ETHOS 0.2.0-alpha.25. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.26, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.26 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. Its adopter-facing changes are the paradigm root rules, which this
repository already meets (`CONTRIBUTING.md` beside `AGENTS.md` and `README.md`, and `LICENSE` where
releases are tagged), formatters that run on the settings ETHOS ships, and the `jdx/mise-action`
v5.2.5 pin of the common CI model.

## What Changes

- Replace the 0.2.0-alpha.25 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.26, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.26 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.25 runtime as the rollback.
- Generate the GitHub workflow again from 0.2.0-alpha.26's common model, which moves
  `jdx/mise-action` to v5.2.5.
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
