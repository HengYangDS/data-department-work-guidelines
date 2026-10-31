## Why

The repository declares and runs ETHOS 0.2.0-alpha.24. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.25, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.25 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the
published asset digests. It decodes process text and reads its own files as UTF-8 and runs its
Python in UTF-8 mode. Under 0.2.0-alpha.24, GitLab's Windows ARM64 jobs started ETHOS, but its proof
stopped on a host-locale decode in code page 936 (job 62963).

## What Changes

- Replace the 0.2.0-alpha.24 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.25, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.25 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.24 runtime as the rollback.
- Record the move in the Changelog.
- Qualify the archived head on GitHub and on GitLab's Linux and macOS jobs, and observe GitLab's
  Windows ARM64 jobs. Their acceptance, withdrawn under DR-0005 by `rebind-ethos-alpha-21`, returns
  through its own Change once these jobs run the verifier.

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
