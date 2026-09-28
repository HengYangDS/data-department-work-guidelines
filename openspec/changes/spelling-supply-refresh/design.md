# Design

## Context

See the [proposal](proposal.md) for the defect. The accepted
[quality specification](../../specs/quality/spec.md) already requires a locked
spelling check that rejects a real typo without a local waiver. At the source
base, CSpell 10.3.4 exits zero with `Files checked: 0` for an explicit
`--force-check --file` input also matched by `ignorePaths`. A temporary
hostile fixture reproduced that result without changing tracked source.
Upstream's stable 10.3.5 release fixes the same command contract.

The repository publishes a source-pinned offline tool bundle, so a lock update
also changes release inputs. The published `v5.0.3` tag and both Forge assets
remain immutable.

## Goals / Non-Goals

**Goal:** The declared CSpell command checks its explicitly named file, and the
updated locked toolchain can be installed and verified from the exact next
release bundle on every claimed host.

**Non-goals:** Change the spelling dictionary, rewrite team rules, add a
repository-specific spell checker, repair unrelated supply, or claim team use
from a CI result.

## Decisions

### Prove the skipped-file failure before replacing the pin

Extend the existing documentation-quality test with a temporary misspelled
Markdown file and a temporary CSpell config that ignores it. Invoke the locked
CLI using the same `--force-check --file` shape as the repository entrypoint.
The test must require a spelling finding for that file, not merely a nonzero
exit caused by bad syntax. This makes the old version fail and the new version
pass without maintaining a duplicate parser. A plain typo test already exists;
it is not evidence for the ignored-file edge.

Alternative rejected: remove `--force-check` or narrow the current file set.
Either would let tool configuration silently reduce the check's admitted
scope.

### Refresh the smallest supply owner

Change only the direct CSpell pin and resolve its required transitive changes
through npm. Inspect the lock diff and run the real CLI, repository verifier,
and online dependency audit. Do not copy a host cache or commit
`node_modules/`. The package lock remains the source of dependency identity.

Alternative rejected: patch the repository's CSpell invocation to work around
upstream filtering. It would add a second glob/ignore policy owner.

### Qualify a new patch edition, not the old tag

Use `v5.0.4` if final review confirms that the fix restores the existing
verification promise without changing the public guideline or contributor
command surface. Update the sole `VERSION` owner, its charter projection,
Changelog, and offline-bundle identity together. If a changed public
obligation is discovered, reclassify compatibility before tagging.

The bundle builder must consume only the new lock and already pinned lychee
assets. Inspect it, perform a cold offline install and full verification, then
bind the digest to committed source. This Change's task list owns source and
local bundle readiness; remote publication is a separately observed effect, not
an archive prerequisite or a retroactive source claim. Obtain exact-HEAD ETHOS
proof and official archive before publishing a signed annotated tag. Download
and hash each Forge's asset separately; hosted macOS, Linux, Windows, and the
GitLab VM must execute the complete offline graph for that same tag.

Alternative rejected: replacing `v5.0.3` assets or citing its host matrix for
the changed lock. A passing local check does not transfer across release
inputs.

## Risks / Trade-offs

- **The resolver changes unrelated packages** → inspect the full lock diff and
  keep only CSpell's required closure.
- **The hostile test passes for the wrong reason** → assert the misspelled word
  and checked-file identity in the CLI result.
- **A source-only pass is mistaken for distribution** → keep local proof,
  per-Forge publication, and each offline host run as separate observations.
- **A late tool release restarts the release repeatedly** → freeze the selected
  stable supply at this Change's candidate and admit a later update only as a
  separately justified Change.

## Migration Plan

Reproduce RED under the old lock, update the direct pin and lock, and verify
GREEN. Prepare the patch edition and bundle, validate repository and official
OpenSpec checks, then prove the signed source through ETHOS. Archive this
source-only Change through the native command; refresh proof for the archive
HEAD before local landing and publication. Publish the same signed commit,
tag, and bundle bytes to GitLab and GitHub. Verify both Releases, downloads,
CI graphs, and clean owned-lane retirement before claiming the wider delivery
goal. A failed host or Forge remains an open delivery gap; it cannot be
converted into a local success claim.
