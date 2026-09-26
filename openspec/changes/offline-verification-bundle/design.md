# Design

## Context

See [the proposal](proposal.md) for the observed cold-cache failure. The current
verifier runs through locked npm packages plus lychee 0.24.2. The original
feasibility probe used a 252-package lock without platform-specific or
install-script packages: an isolated 11.6 MB cache then supported a real
`npm ci --offline --ignore-scripts` on macOS. That historical probe does not
qualify the refreshed lock or other hosts. The existing lychee
installer already checks each declared platform archive's SHA-256 and version
from `.config/tools/lychee.json`.

## Goals / Non-Goals

- Make offline installation and verification possible from one previously
  acquired, version-bound bundle on all declared host platforms, with exact
  source and asset checks and no dependency on either Forge during execution.
- Keep npm packages and binary archives out of Git; publish the same immutable
  bundle bytes on both Forges and identify them in the release source.
- Do not package Node, Git, or ETHOS. They remain separately installed
  host/product prerequisites; this bundle cannot certify ETHOS plan, proof, or
  adoption.
- Do not rewrite existing tags or treat a source-only release as proof of
  offline distribution.

## Decisions

### One universal release bundle, not a tracked vendor tree

The bundle contains a clean npm cache plus the five pinned lychee archives
already declared for macOS, Linux, and Windows. A single bundle avoids an
implicit platform-selection download and lets either Forge distribute the same
bytes. It is not committed: a large binary vendor tree would make every guidance
edit carry toolchain payload and duplicate the lockfile's dependency ownership.
Platform-specific binary selection remains in the existing lychee manifest and
installer. The archive also includes lychee's Apache-2.0 and MIT license texts,
whose tagged-release digests are pinned in that manifest. Every currently locked
npm package contains a license file in its cached tarball; the builder checks
this before distribution. The repository's MIT license does not relicense
bundled third-party bytes.

### Declare the runtime once

The npm manifest declares the supported Node 26/npm 11 major lines. Repository
checks, CI validation, the bundle builder, and bundle installation derive their
major checks from that declaration. The release bundle records the same majors
so a consumer can reject incompatible cache readers before installation. The
CI source pins an immutable official Node 26 image index on GitLab and selects
Node 26 on GitHub-hosted runners. Node 22 is not a guideline requirement and
receives no compatibility facade. Raising the contributor prerequisite is a
SemVer major change, not a patch release.

### Bind bytes before extraction

A small tracked source record under `.config/tools/` names the bundle file, its
SHA-256, the release version, and the SHA-256 of `package-lock.json` and
`.config/tools/lychee.json`. It is prepared before the signed source commit and
tag. The bundle itself excludes source files and commit IDs, avoiding a
self-referential digest; the tag binds the tracked record to the source object.
The offline installer checks the whole archive digest before listing or
extracting members, then checks the manifest and selected lychee archive again.
The builder only admits regular files from an isolated npm cache and explicitly
supplied pinned lychee archives; no symlinks, npm logs, user configuration,
credentials, or absolute host paths enter the archive.

A plain `tar.gz` is chosen because the existing repository toolchain already
uses `tar` on declared hosts. The installer uses the same repository-relative
Node runtime utilities and rejects unexpected member names, traversal, symlinks,
and duplicates before extraction. It does not create a second package manager or
custom archive format. The builder creates one asset and records its exact
digest; byte-for-byte reproducibility across independent builders is desirable
but not required for the release claim, which verifies and publishes that one
immutable object to both Forges.

### Separate acquisition from execution

Release preparation may contact the npm registry and asset sources once to prime
an isolated cache and acquire pinned lychee archives. The offline consumer takes
an explicit local bundle path. It runs the actual
`npm ci --offline --ignore-scripts` against the extracted cache with an empty
application dependency state, then delegates lychee installation to the existing
`--asset` path. It never falls back to a registry or Forge. The full
`npm run verify` is an independent acceptance step, not a hidden installer side
effect. `npm ci --offline --dry-run` is excluded from acceptance because it
returned success with an empty cache while actual installation failed.

GitLab acquires the bundle from its own generic package registry with the
current project's job token. The request is bound to the checked-out release
tag, rejects redirects, and verifies the committed digest before installation.
The offline job runs in an explicitly started tag pipeline after the package
and Release exist; the initial tag-push pipeline cannot depend on an asset that
has not yet been published. GitHub's published-Release event starts its hosted
matrix. These are two delivery routes for the same source-bound bytes, not two
bundle formats or a second release authority.

The GitLab VM's Docker image is a separate prerequisite. The source pins one
OCI index digest, while the deployment-owned Runner policy must allow that
exact reference and its local Docker store must resolve it before the Runner
is unpaused. A tag-only image previously passed older jobs but could not run a
new digest; trying to fetch the new image at job start then depended on a slow
external layer route. Re-pin to an official OCI index already verified in the
VM cache for the Node 26 major edition. Keep the Runner's pull policy
local-only after preflight; do not weaken the source pin or call a prior Node 22
job proof of the new source.

### Keep three evidence layers distinct

Repository tests verify manifest, member, digest, no-fallback, and error
behavior. Hosted matrices consume the prepared bundle and execute the complete
offline install plus verifier on their declared platforms. A release operator
verifies the exact uploaded asset SHA-256 from both Forges separately. The
source tag and hosted jobs do not substitute for asset read-back; an asset
listing does not substitute for cross-platform execution. ETHOS remains the
authority for Change, Work Lane, proof, tag, and publication admission.

### Keep document checks and native code evidence in one proof floor

The profile retains the two existing gate IDs and their portable document
commands. For each mapped code axis, its gate also names an accepted ETHOS
verification provider. ETHOS executes that provider in its own runtime and
requires both the document command and native result to pass for the committed
tree. The behavior provider runs actual Node tests and verifies coverage of
tracked production modules; the static provider checks tracked JavaScript
syntax. Neither a successful command alone nor a repository-authored report can
qualify those code axes. The repository profile check rejects an absent or
misdirected provider. No third default gate or private lifecycle is added.

The document check still runs repository tests, so the behavior provider repeats
some tests for now. That cost is explicit: removing tests from the document
command requires a separate verified refactor that preserves all document
checks, not a weaker proof assertion during this release.

## Risks / Trade-offs

- **Third-party redistribution** → Preserve npm package license files and the
  exact lychee dual-license texts in the bundle; verify the manifest and avoid
  labeling third-party bytes as repository MIT content.
- **Large or unavailable upstream supply** → Keep the bundle outside Git, pin
  every binary digest, and build from explicit acquired inputs. A missing
  platform archive blocks the offline release claim rather than shrinking the
  declared platform set silently.
- **Npm cache format varies across npm majors** → Record the declared Node
  26/npm 11 lines in the bundle; exercise the exact release bundle on each
  hosted OS and reject incompatible cache readers. A later major requires a
  new source revision and bundle.
- **Archive extraction security** → Verify the trusted whole-file digest first,
  reject unsafe and non-regular members, extract only into an owned temporary
  directory, and test traversal, symlink, duplicate, and truncation cases.
- **Release asset publication after source acceptance** → Keep source
  acceptance, bundle qualification, and each Forge Release as distinct states.
  Do not archive an active Change with a false completed delivery task or
  rewrite a signed tag to repair an asset. If a tagged source lacks a required
  CI job, a new patch edition carries that source correction and its own
  version-bound bundle.
- **Host prerequisites remain external** → Document Node/npm, Git, and installed
  ETHOS explicitly. A cold bare OS is not claimed to be ready merely because the
  repository bundle exists.

## Migration Plan

1. Add the builder, installer, tracked bundle identity, and adversarial tests
   in the owned Work Lane. Move the tools to the declared Node 26/npm 11 line,
   refresh stable locked dependencies, and prepare the major edition without
   changing department guidance semantics.
2. Build the bundle from a clean cache and all five pinned lychee archives. Test
   actual offline installation and the full verifier on macOS, Linux, and
   Windows; keep source proof and artifact digest tied to the tested revision.
3. Accept the exact source while its delivery tasks remain open. Create the
   signed version tag only after that acceptance; publish the same bundle to
   both Forges, read back each SHA-256, and run the complete hosted matrix. Only
   then complete the delivery tasks and archive officially. Refresh proof and
   publication observation for the archive commit. A Forge outage leaves its
   own claim open rather than causing a raw push or silent substitution.
4. If a bundle is defective before tagging, rebuild and update the tracked
   digest in a new accepted source commit. After tagging, do not change its
   object; issue a new patch release for a source or artifact-contract repair.
   Existing releases remain unchanged.
