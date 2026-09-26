# Proposal

## Why

A fresh copy of this repository cannot install its locked verification tools
from an empty npm cache without contacting the npm registry. A live cold-cache
probe failed with a cache-miss error, while `npm ci --offline --dry-run`
misleadingly exited successfully. The current release supplies source and a
pinned lychee route, but not the complete dependency input needed to verify it
when both Forges or the registry are unavailable.

## What Changes

- Define a release-bound, portable offline verification bundle containing the
  exact npm cache entries required by `package-lock.json` and the pinned lychee
  archives for every declared host platform. The bundle is a release asset, not
  a tracked `node_modules/` tree or a permanent vendored dependency directory.
- Add one Node-based bundle builder and installer under the existing `tools/ci/`
  owner. The builder accepts explicit, previously acquired inputs, verifies
  lockfile and archive digests, excludes npm logs and credentials, and produces
  a deterministic manifest and archive. The installer rejects unsafe members,
  mismatched source identity, incomplete cache, altered assets, and implicit
  network fallback before invoking the locked offline install and existing
  lychee installer.
- Exercise the complete offline install and `npm run verify` path from an empty
  application cache on the declared macOS, Linux, and Windows hosts. A dry-run
  exit code alone is not acceptance. The repository check and both hosted CI
  planes enforce the asset contract without conflating acquisition with offline
  execution.
- Publish identical bundle bytes with an explicit SHA-256 on GitLab and GitHub
  for the next release. A pre-supplied local copy remains usable without either
  Forge. Keep source, bundle, hosted CI, Forge Release, and actual use as
  separate claims.
- Add a backward-compatible offline contributor route and a minor guideline
  release. Keep Node 22/npm, Git, and the installed ETHOS product as explicit
  host prerequisites owned outside this repository; do not claim bare-OS
  installation or bundle ETHOS as a second command plane.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: a cold local verification installation with a supplied release
  bundle must run without network access on each claimed platform and reject
  incomplete or altered supply.
- `repository-governance`: each release's offline verification bundle must be
  bound to its source and observed independently on both Forge release planes
  before offline distribution is claimed.

## Impact

The Change may update the existing Node tooling, quality tests, CI declarations,
contributor and governance guidance, release declaration, `VERSION`, charter
edition, and changelog. Its generated bundle and npm cache remain untracked
release inputs. It does not change the normative department work rules, MIT
grant, ETHOS authority, or historical release objects. A release asset cannot be
called portable until each declared host executes the full offline graph.
