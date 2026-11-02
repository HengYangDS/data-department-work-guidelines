## Why

The repository declares and runs ETHOS 0.2.0-alpha.27. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.28, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.28 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. Its adopter-facing changes are small. `ethos publish` of `dev` names the
proposals that the accepted branch absorbed, so their retirement is no longer left to memory. `ethos
land` takes its authority from the Change that the admitted proof carries. `ethos lane
archive-change` previews the archive it would apply, so an over-long merged requirement blocks the
preview. Pushes run without Git's sparse pack walk. Its bundled supply moves Vale to 3.26.0, and the
common CI model is unchanged.

## What Changes

- Replace the 0.2.0-alpha.27 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.28, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.28 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.27 runtime as the rollback.
- Check the CI projection against the common model; it stays as it is.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`,
`CHANGELOG.md` and the repository-common runtime selection. Hosted jobs keep Mise 2026.10.25, the
Mise floor and GitLab's Linux image. `tasks.md` is the sole progress ledger.
