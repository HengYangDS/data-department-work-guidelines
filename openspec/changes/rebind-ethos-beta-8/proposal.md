## Why

The repository declares and runs ETHOS 0.2.0-beta.7. The owner asked that every governed repository
run the latest ETHOS release, and that every supply chain move to its latest stable release without
a separate confirmation. 0.2.0-beta.8 publishes its own Mise declaration, whose platform checksums
equal the release's `SHA256SUMS` and the published asset digests.

Its adopter-facing changes since 0.2.0-beta.7 are these:

- The protected-peer feed reads the host, port and namespace path of a remote's `forgeRepository`,
  as its documentation states, instead of only its whole value as a path. In this repository's
  records, `ethos lane redact private-addresses` then reports each peer URL as one occurrence
  instead of the URL and the project path inside it; `redact-peer-addresses` uses it after this
  Change.
- A governed repository may keep at its root the Markdown community health files that GitHub reads
  there, beside `CONTRIBUTING.md`: `ACCESSIBILITY.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and
  `SUPPORT.md`. This repository keeps none of them; its root documents stay `AGENTS.md`,
  `CHANGELOG.md`, `CONTRIBUTING.md` and `README.md`.
- `ethos lane repair-paradigm --apply` and the profile that `ethos adopt` writes indent TOML arrays
  by two spaces, as the shipped Taplo policy does, instead of four.
- It upgrades directly from 0.2.0-beta.7 and keeps result schema 3.
- Among its known open defects, Go's GO-2026-6859 affects the bundled `cue`, `vale` and `shfmt`,
  which ETHOS runs only as local commands over repository files without starting an HTTP server.

## What Changes

- Replace the 0.2.0-beta.7 declaration in `.config/mise/config.toml` with the declaration published
  with 0.2.0-beta.8, unchanged, and lock it again with native `mise lock`; the lock stays at
  version 3.
- Bind the repository family to the 0.2.0-beta.8 runtime through the locked console's
  `hook install`, keeping the 0.2.0-beta.7 runtime as the rollback.
- Check both pipelines against the 0.2.0-beta.8 common model, which 0.2.0-beta.8 does not change.
- Record the move in the Changelog, and correct the same bullet's `jdx/mise-action` version to
  v5.2.7, which the 0.2.0-beta.7 move generated while the bullet kept v5.2.6.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. The generated pipelines, the hosted jobs' Mise, GitLab's Linux image and the
declared peers stay as they are. `tasks.md` is the sole progress ledger.
