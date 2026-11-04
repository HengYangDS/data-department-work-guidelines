## Why

The repository declares and runs ETHOS 0.2.0-alpha.29. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.30, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.30 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. Its adopter-facing changes are small: every command reads each immutable
Git object once, an executable that a locked Mise tool provides must come from that tool's installed
locked version instead of falling back to another tool's copy, and the runtime inventory memo is
read only from a directory that the current user owns. Its common CI model is unchanged, so the
generated GitHub workflow stays as it is, and this repository declares no Mise tool besides ETHOS,
so the locked-tool check changes nothing here.

## What Changes

- Replace the 0.2.0-alpha.29 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.30, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.30 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.29 runtime as the rollback.
- Check the CI projection against the common model with `ethos lane project`; it stays as it is.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. Hosted jobs keep Mise 2026.10.25, the
Mise floor and GitLab's Linux image. `tasks.md` is the sole progress ledger.
