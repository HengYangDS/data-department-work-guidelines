# Design

## Context

See [the proposal](proposal.md) for the release gap. `v5.0.5` is a signed,
immutable release, while accepted `dev` and `main` contain later fixes. The
same offline bundle can qualify a release only when its committed input record
matches the final source and both Forges distribute the exact verified bytes.
ETHOS remains the lifecycle and common-quality authority; its unfinished
product work cannot be certified by this repository's tests.

## Goals / Non-Goals

Ship one truthful edition from a frozen source and one source-pinned offline
bundle, with independent GitLab and GitHub evidence. Do not rewrite `v5.0.5`,
stage a human adoption trial, add a local ETHOS surrogate, or claim that a
Forge job proves another platform's result.

## Decisions

### Keep release proof and product acceptance separate

ETHOS owns the common quality floor and three-adopter positive and adverse
acceptance in its `proof-throughput` Change. That obligation remains open for
the overall program, but the other adopters' results are not release evidence
for this repository. They neither replace its exact-source proof nor
establish its bundle or Forge effects. This Change verifies the repository
under its accepted installed ETHOS runtime and its own native behavior and
static evidence. It does not claim common-floor parity or mutate another
adopter's Work Lane.

Before final source freeze, recheck the committed version, lockfile, lychee
manifest, and runtime majors against the prepared bundle record; rebuild and
rerun affected checks if any input changed. The dated Changelog section is a
prepared edition, not a release claim until the final signed tag exists.

Keep document checks and native behavior evidence separate:
`node tools/docs/cli.mjs check` validates repository source properties without
running Node tests; `npm run verify` still formats, checks, and runs all tests
once. ETHOS proof conjoins the document command with its own native test
evidence. Do not accept the document command's exit code or stdout as a
substitute for those native results.

### Classify before assigning the version

Compare the complete diff since `v5.0.5` with the normative rules, reader and
Agent routes, and contributor commands. The known CI selector and OpenSpec
invocation corrections are compatible fixes and form patch edition `v5.0.6`.
A later incompatible finding changes that classification before a tag is
finalized. `VERSION` and the dated Changelog may identify a prepared edition in
this Work Lane without making it a release; the signed tag and two Forge
Release objects remain separate effects to observe.

### Bind the asset to the final source

Use the locked Node/npm supply, pinned lychee archives, and upstream license
texts to build the bundle. Its committed record identifies the version, lock,
tool supply, file name, and actual SHA-256. Inspect the archive, then install
it from a fresh checkout and empty application cache without network and run
the complete verifier. A cache hit, manifest, or file on disk alone is not
offline qualification. If any tracked bundle input changes, rebuild rather
than editing the digest by assertion.

### Publish with separate evidence at each boundary

After signed source commit and exact-HEAD ETHOS proof, accept through the
candidate and protected roots. Use temporary `proposal/*` checks where GitHub
branch protection requires the new SHA to pass before `dev` and `main` can
advance. Archive officially, then prove and publish the archive HEAD; the
archive is a new Git object. Create a signed annotated tag only for that final
object. Observe each Forge Release and download each asset to verify its bytes.
GitHub's release-triggered Linux, ARM64 Linux, macOS, and Windows jobs must run
the full offline install and verifier. GitLab's separate post-asset tag
pipeline must run `offline:verify` on project Runner #52's local Linux ARM64
container capability. The old Runner selector remains for immutable historical
tags; it is not part of new source. Native effects and their observations are
not pre-checked task boxes.

## Risks / Trade-offs

- **Product or source drift after bundle build** → Re-freeze the exact inputs,
  rebuild the asset, and rerun affected proof and platform checks.
- **A Forge is unavailable or protected ref rejects the push** → Keep that
  plane unverified; use its exact native continuation and never raw-push around
  admission. Cross-Forge publication is not atomic.
- **GitLab's fixed HTTP endpoint remains a transport risk** → Use only the
  existing project-scoped CI identity under the user's instruction to proceed
  with this administrator-owned service; disclose the residual risk rather
  than describing job success as HTTPS or transport assurance.
- **CI is mistaken for team use** → Report natural adoption only if separately
  observed in ordinary work; do not manufacture a participant trial.

## Migration Plan

Reconcile the post-tag diff, revalidate the prepared bundle inputs, and finalize
the dated edition in this leased Work Lane. Run local and official checks on the
final source, then commit and prove that source. Keep ETHOS common-floor
and other-adopter acceptance with their product owner. Observe
the native land, archive, proof, two-Forge publication, signed tag, release
assets, full offline matrices, and digest comparison in dependency order.
Retire only this Change's temporary refs and owned Work Lane after all effects
are verified; preserve any foreign or historical Runner still in use.
