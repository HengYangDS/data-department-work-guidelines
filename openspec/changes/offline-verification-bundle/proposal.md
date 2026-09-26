# Proposal

## Why

At Change opening, a fresh copy could not install its locked verification tools
from an empty npm cache without contacting the npm registry. A live cold-cache
probe failed with a cache-miss error, while `npm ci --offline --dry-run`
misleadingly exited successfully. The then-current release supplied source and
a pinned lychee route, but not the complete dependency input needed to verify
it when both Forges or the registry were unavailable. The previous Node 22/npm 10
pin is a tooling choice, not a department-guideline requirement; retaining it
would ship an obsolete verification prerequisite.

## What Changes

- Define a release-bound, portable offline verification bundle containing the
  exact npm cache entries required by `package-lock.json` and the pinned lychee
  archives for every declared host platform. The bundle is a release asset, not
  a tracked `node_modules/` tree or a permanent vendored dependency directory.
  Retain upstream license texts for redistributed tools; the repository MIT
  grant does not relicense them.
- Add one Node-based bundle builder and installer under the existing `tools/ci/`
  owner. The builder accepts explicit, previously acquired inputs, verifies
  lockfile and archive digests, excludes npm logs and credentials, and produces
  a deterministic manifest and one digest-verified archive. The installer
  rejects unsafe members, mismatched source identity, incomplete cache, altered
  assets, and implicit network fallback before invoking the locked offline
  install and existing lychee installer.
- Exercise the complete offline install and `npm run verify` path from an empty
  application cache on the declared macOS, Linux, and Windows hosts. A dry-run
  exit code alone is not acceptance. The repository check and both hosted CI
  planes enforce the asset contract without conflating acquisition with offline
  execution.
- Publish identical bundle bytes with an explicit SHA-256 on GitLab and GitHub
  for the next release. A pre-supplied local copy remains usable without either
  Forge. Keep source, bundle, hosted CI, Forge Release, and actual use as
  separate claims.
- Move the toolchain to the current stable Node 26/npm 11 line and update the
  locked OpenSpec and Prettier packages. Derive runtime checks from the npm
  manifest rather than duplicating a Node 22 constant in code and CI. The
  contributor prerequisite changes incompatibly, so prepare a SemVer major
  edition. Git and the installed ETHOS product remain separate prerequisites;
  do not claim bare-OS installation or bundle ETHOS as another command plane.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: a cold local verification installation with a supplied release
  bundle must run without network access on each claimed platform and reject
  incomplete or altered supply. Runtime and CI checks must follow the declared
  stable toolchain rather than an unrelated fixed major. The existing two
  document proof commands must be conjoined with ETHOS-owned native evidence
  for the tracked JavaScript tooling.
- `repository-governance`: each release's offline verification bundle must be
  bound to its source and observed independently on both Forge release planes
  before offline distribution is claimed.

## Impact

The Change may update the existing Node tooling, locked dependencies, quality
tests, CI declarations, contributor and governance guidance, release declaration,
`VERSION`, charter edition, and changelog. Canonical OpenSpec prose may be
restructured to satisfy native strict validation without changing its duties.
The generated bundle and npm cache remain untracked release inputs. This does
not change department work rules, the MIT grant, ETHOS authority, or historical
release objects. A release asset is not portable until each declared host
executes the full offline graph.
