# Proposal: Final Dual-Forge Release

## Why

The accepted source now contains the canonical GitLab Runner selector and a
portable, locked OpenSpec command, but the immutable `v5.0.5` tag and offline
bundle predate both fixes. Reusing that release as evidence for the current
source would misstate what teams can actually obtain and verify. The remaining
ETHOS common quality floor must also be consumed by real adopter repositories
before this source is frozen for a final release.

## What Changes

- Reconcile the exact post-`v5.0.5` diff under SemVer and Keep a Changelog;
  prepare the next compatible edition only after the final source is known.
- Qualify the common quality floor through the accepted ETHOS product's public
  commands in this repository, AI Gateway CLI, and Codex Responses Proxy. This
  Change modifies neither ETHOS nor the other adopters.
- Keep the standalone repository verifier complete while leaving Node test
  execution to ETHOS's native behavior provider during proof, not duplicating
  it inside the document gate command.
- Rebuild the source-pinned offline tool bundle, qualify the same signed source
  and asset on the declared local and hosted platforms, and publish them to
  GitLab and GitHub independently. Retain the older signed release unchanged.

## Capabilities

No new or modified requirement for this repository. The existing `quality` and
`repository-governance` specifications already require truthful versioning,
portable offline qualification, independent Forge delivery, and product-owned
proof. This is release fulfillment under those contracts, so `skip_specs: true`
is intentional.

## Impact

Expected tracked release inputs are `VERSION`, the charter edition,
`CHANGELOG.md`, and the source-pinned offline bundle record. The official
Change owns pending work. Package supply, native ETHOS Attestations, Forge
objects, and temporary Work Lanes remain with their existing owners; no
credential or host-specific path enters the repository.
