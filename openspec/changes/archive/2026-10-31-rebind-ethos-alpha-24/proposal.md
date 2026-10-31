## Why

The repository declares and runs ETHOS 0.2.0-alpha.23. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.24, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.24 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. It shortens the installed runtime's directory on Windows; ETHOS traced the
exit status 6 of GitLab's Windows ARM64 jobs to the length of the interpreter's path, 253
characters in job 62870.

## What Changes

- Replace the 0.2.0-alpha.23 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.24, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.24 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.23 runtime as the rollback.
- Record the move in the Changelog.
- Qualify the archived head on GitHub, and on GitLab's jobs once GitLab, unreachable since
  2026-10-31 at about 22:02, accepts the landed head. GitLab's Windows ARM64 acceptance, withdrawn
  under DR-0005 by `rebind-ethos-alpha-21`, returns through its own Change once those jobs run the
  verifier.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. Hosted jobs keep Mise 2026.10.24, the Mise floor and GitLab's Linux image.
`tasks.md` is the sole progress ledger.
