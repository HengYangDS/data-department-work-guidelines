# Design

## Context

See [the proposal](proposal.md) for the gaps. `v5.0.6` is a signed release. The
accepted semantic review of the original 1,240-line `guidelines.md` blob
`ce3d090be258e65534781769e3e2fd5ab7439ef8` recorded 34 source ranges in
the archived `guidance-fidelity-repair` Change. A later adverse-case review
repaired ten discrepancies in `v5.0.3`. This Change rechecks that accepted
source against concrete tasks and records the newly found communication loss
below; editorial judgment is not mechanical proof.

The current verifier already checks formatting, Markdown lint, spelling,
offline links, English text, OpenSpec, decisions, and CI declarations. Its green
result proves those declared properties, not the usability of a release
handoff. `CONTRIBUTING.md` documents offline installation but not complete
bundle preparation or independent publication. Read-only GitHub and GitLab
Markdown render probes exposed plain first-line YAML before the title; a
leading HTML comment containing the same YAML made the title the first visible
content in both. The installed ETHOS `front_matter()` parser returned the four
fields for plain YAML but no fields for the comment. Presentation alone is
therefore insufficient: the representation belongs to ETHOS, not a local
sidecar or a repository-only parser.

## Goals / Non-Goals

**Goals:** Preserve the accepted topic semantics; give a new maintainer one
portable, source-bound release route; remove machine metadata from the first
visible reading position only through an installed ETHOS contract; qualify the
actual release and clean owned residue.

**Non-goals:** Recreate the former monolith, forms, fixed weekly meeting, or
another evidence ledger; add a private metadata or lifecycle schema; perform
responsive-design work; stage a team-adoption trial; or weaken a proof gate to
obtain a green result.

## Decisions

### Reuse the semantic review, then challenge it at point of use

The 34-range disposition and ten adverse cases are a bounded comparison input.
Review the exact current topic bytes and representative decision, data-use,
delivery, and Agent tasks. If a new missing qualifier is found, change only its
current owner and record the source range and rejected counterexample in this
Change. Do not add another tracked mapping table or copy obligations into the
task map. The alternative, treating shorter text as loss or the old checklist
as authority, would confuse form with retained duties.

The initial recheck read the 34-range disposition and ten later adverse cases.
Before this Change's communication correction, the seven normative topic bodies
still matched `v5.0.3` byte-for-byte; only the charter's edition label differed.
No additional unique duty or contradiction emerged from these four point-of-use
probes:

- **Anomaly requiring a choice:** The task map leads to `docs/decide.md`, where
  an unknown subject or decision owner stops the affected action. Facts and
  hypotheses remain distinct; `docs/deliver.md` limits the completion claim.
- **Revised market history:** The map leads to `docs/data.md` and its worked
  decision. Missing earlier observations prevent a point-in-time claim;
  admission requires permission and limits, while adoption requires actual use.
- **Production pipeline delivery:** `docs/deliver.md` asks for the target state,
  dependencies, recovery, and acceptor before action. Verification, acceptance,
  and publication are separate outcomes.
- **Delegated analysis:** `AGENTS.md` and `docs/human-agent.md` require a bounded
  read-only task when appropriate. Missing fact source or permission causes a
  stop; the Agent reports verification time and limits, and a person accepts
  consequential work.

A later challenge against original line 697 found one point-of-use loss:
`docs/communicate.md` mentioned changed evaluation criteria only in its meeting
section, not the subject and definitions of a follow-up answer. An Agent could
silently switch the question or a term's meaning after being challenged, then
claim its new answer was consistent with the first. The communication owner now
requires a stable frame or an explicit, justified change for any follow-up;
the narrower meeting-only sentence was removed rather than duplicated.

This is a bounded editorial review of present text, not a claim that line
counts or automated checks prove semantic equivalence or team adoption.

### Put the release route in its existing owner

Extend `CONTRIBUTING.md`, not a new runbook or shell wrapper. It will identify
the pinned supply files, supported Node/npm and Git, native CLI identities,
exact source inputs to the bundle builder, the build and inspect commands,
signed source and tag boundaries, each Forge's independent Release operation,
post-publication jobs, download and digest comparison, and cleanup. Use
`tools/ci/offline-bundle.mjs build|inspect|install`, GitHub's `gh release create
--verify-tag`, and GitLab's `glab release create --use-package-registry
--package-name release-assets` so the GitLab offline job consumes its own
package. Bind the tag and repository from the current checkout; no tracked
operator path, credential value, or GitLab HTTPS assumption is introduced.
The installed GitLab CLI was checked against this project's existing release:
the asset is in the `release-assets` generic package at the tag version. An
SSH remote alone selected the wrong API endpoint; setting `GITLAB_HOST` to the
configured API host and port made a read-only repository query succeed. The
contributor route therefore names that binding without embedding this host.

The published `v5.0.6` route was exercised in a disposable fresh checkout:
GitHub supplied the 47,155,466-byte bundle, its SHA-256 matched the committed
record, `inspect` and `install` passed without remote tool supply, and the full
verifier passed 77 tests. The checkout had no initial `node_modules/`, ended
with no tracked changes, and the temporary directory was removed. This proves
the documented tool path for that edition, not the future edition's publication
or host matrix.

The bundle record binds `VERSION`, `package-lock.json`, the lychee manifest,
and declared runtime majors, not an arbitrary chat or cache. Refresh its actual
SHA-256 whenever those inputs change. A fresh build with the same declared
inputs produced a valid archive with a different digest from the published
`v5.0.6` file. This is not a bit-reproducible archive claim: freeze one inspected
artifact and distribute its exact bytes on both Forges. A final official
archive commit changes HEAD; refresh proof and remote observations for that
object, but reuse bundle bytes only if their declared inputs still match. The
alternative, a new release orchestrator, duplicates existing native operations
without an observed gap.

### Keep metadata authority upstream and delivery independent

Do not strip YAML while the installed ETHOS registry requires it. Ask the ETHOS
owner for a product-supported representation that preserves `subject`, `role`,
`state`, and `relations` but lets a current page start visibly with its title
in ordinary Forge rendering. Integrate only an accepted and installed product
contract; test both registry failure and rendered reading. The alternative,
repository-only comments, a sidecar, or a second page, creates competing metadata.
This dependency can remain open while independent release guidance is improved.

### Prefer behavioral CI assertions over incidental topology

The current CI validator demands an exact five-step offline GitHub job and
literal commands. A focused positive and negative probe tests whether this is
incidental formatting or an intentional limit on executable steps. Any future
relaxation must preserve immutable Actions, read-only token scope, exact tag
checkout, the host matrix, offline acquisition before installation, and the
full verifier afterward. External link health remains a separately bounded
online observation; it must not make the offline verifier depend on a network
or be reported as checked when it was not run. A live check of the initially
prepared `v5.0.7` source returned two 404s, both at comparison links for the
unpublished tag. That is a release-stage dependency, not a reason to accept
404: the existing `links` command gains an explicit `--online` mode after both
tags exist, while its default and `verify` remain offline. Both modes use the
same pinned lychee and current Markdown inventory. No numeric coverage target
is invented from a single coverage value.

The focused check accepted a label-only step change and rejected a sixth
executable `node --version` step with the declared exact-topology error. An
extra executable step changes the release job's execution surface even when
that particular command is harmless; it is not a semantics-preserving edit to
the currently reviewed five-step projection. The existing negative suite also
rejects an unpinned action, wrong tag, leaked token scope, changed host, or
skipped acquisition, installation, or verifier. No validator change is made
without an accepted broader step policy; retaining this fail-closed projection
is more honest than admitting arbitrary extra commands as “equivalent.”

### Qualify the exact final source and each publication plane

The [accepted SemVer contract](../../specs/repository-governance/spec.md#requirement-version-identity-follows-semver-compatibility)
includes documented contributor commands in the public surface. The explicit
`links --online` mode is a compatible addition, not merely an internal bug fix;
the prepared edition therefore moves from the provisional `5.0.7` patch to
`5.1.0` minor. The communication correction and release guidance remain
compatible fixes. Reassess the final diff if the ETHOS metadata integration
changes another public boundary. Keep the Change
active while its source and metadata-integration tasks lack evidence. Use native
candidate and accepted-root transitions, then archive only after all declared
Change tasks are complete. Archive creates a new HEAD that needs fresh proof;
the final signed tag and both Forge releases follow it. Release and
cross-adopter observations live with ETHOS and their actual producers rather
than as post-archive checkboxes that would prevent the archive prerequisite.
Each Release object, retrieved asset, GitHub host, and GitLab post-asset ARM64
VM job remains a separate observation. Never rewrite `v5.0.6` or raw-push
around ETHOS admission.

The documented Forge commands were compared with installed `gh` and `glab`
help. In an adverse release walkthrough, a missing remote tag stops Release
creation, a missing GitLab package or post-asset job leaves GitLab offline
qualification open, and one downloaded digest or host result cannot satisfy
the other peer or host.

## Risks / Trade-offs

- **ETHOS metadata support is delayed** → Keep the metadata task and Change
  open; publish only the source states whose declared obligations are complete.
- **A release instruction is plausible but wrong** → Exercise its exact public
  command on the selected tag, and reject an omitted or mismatched input.
- **A CI simplification weakens isolation** → Preserve negative cases before
  changing the validator and run both hosted planes on the final source.
- **A remote or host is unavailable** → Report the verified subset, leave the
  missing task open, and use the native continuation rather than changing the
  claim or force-pushing.

## Migration Plan

1. Finish the semantic adverse-case review and document the current release
   route in the existing owner. Make any verifier correction from a failing
   positive case while preserving the unsafe counterexamples.
2. Integrate the ETHOS metadata contract only after its formal revision is
   accepted and installed; verify registry and ordinary rendered Markdown.
3. Prepare the compatible edition and actual pinned bundle, then run local
   format/lint/prose/links, negative tests, strict OpenSpec, and installed
   ETHOS planning and exact-HEAD proof.
4. Accept the proved source, check every declared Change task, and archive
   natively. Prove the new HEAD, then sign, publish, retrieve, and qualify each
   source and asset through native transitions. Check each Forge and host
   independently, then retire only owned temporary refs and the landed Work
   Lane.
