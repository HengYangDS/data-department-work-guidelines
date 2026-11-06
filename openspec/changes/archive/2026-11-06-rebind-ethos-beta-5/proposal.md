## Why

The repository declares and runs ETHOS 0.2.0-beta.4. The owner asked that every governed
repository run the latest ETHOS release, and that every supply chain move to its latest stable
release without a separate confirmation. 0.2.0-beta.5 is a release without breaking changes: result
payloads, `.ethos/release.toml` and the adopter commands stay as they are. It publishes its own Mise
declaration, whose platform checksums equal the release's `SHA256SUMS` and the published asset
digests.

Its adopter-facing changes since 0.2.0-beta.4 are these:

- A gate's Mise supply resolution carries the `aube` lock sidecars that the Mise lock declares, so an
  npm tool with a sidecar resolves under Mise 2026.11.2's safe and locked mode. ETHOS follows that
  release's native trust policy and still carries no trust for an untrusted root.
- Loopback and link-local addresses leave the private-address class: commit and tag admission and
  the secret scan no longer refuse them. ETHOS's own product surfaces still refuse loopback and
  link-local URLs.
- `ethos prove --readiness --execute` runs the full plan's readiness tier alone. It writes no
  attestation and cannot satisfy landing.
- The bundled supply moves to releases at least a day old, among them coverage 7.17.2, `syft`
  1.57.0 and `grype` 0.121.2.

This repository declares no npm tool, so the first change does not alter its checks, and its
commit messages name no loopback or link-local literal. The move keeps the repository on the latest
release.

## What Changes

- Replace the 0.2.0-beta.4 declaration in `.config/mise/config.toml` with the declaration published
  with 0.2.0-beta.5, unchanged, and lock it again with native `mise lock` for the five declared
  platforms.
- Bind the repository family to the 0.2.0-beta.5 runtime through the locked console's
  `hook install`, keeping the 0.2.0-beta.4 runtime as the rollback.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md` and the repository-common
runtime selection. The CI projection, the hosted jobs' Mise, the Mise floor and GitLab's Linux image
stay as they are. `tasks.md` is the sole progress ledger.
