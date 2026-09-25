# Design

## Context

The accepted source already has a short repository entry and a seven-question
reader map. It also has a locked Node toolchain, twenty tracked shell files, two
redundant OpenSpec placeholders, nine archived non-official scope companions,
and current quality checks whose orchestration is split between `scripts/` and
`tools/ci/scripts/`. The active ETHOS runtime at this repository's common Git
directory is built from the current ETHOS `dev` source. Its material attribution
uses the selected official Change and fresh changed paths; it does not read a
Change-local `scope.toml`.

## Goals and Non-Goals

- A maintainer can run one documented local verification command on macOS,
  Linux, and Windows from a clean clone with locked tools and no host path.
- Each quality property has one executable owner; provider-specific CI setup
  stops at runtime supply and invokes that same command.
- Current rule owners, decision rationale, and navigation are concise and
  non-duplicative. Historical Git objects remain truthful without keeping
  non-official companions in the current tree.
- ETHOS and official OpenSpec retain admission, proof, archive, and publication
  authority. Repository checks enforce only repository-specific semantics.
- This Change does not promise ETHOS product fixes, issue a credential, or infer
  team adoption from repository checks.

## Decisions

### Keep one official Change carrier, not a scope companion

Remove obsolete `scope.toml` files from the present archive tree, but leave the
official OpenSpec artifacts and Git history intact. Earlier design and task text
may truthfully describe a mechanism that existed then; it is not a current
instruction. The current specification and tests reject a revived active
companion. Rewriting old proposals to sound as if they used today's contract
would be false, while retaining unused companions in the current tree would
invite accidental reuse.

### Use the existing locked Node runtime for the portable interface

The repository already locks Node-based document tools. A single Node entry
under `tools/` will orchestrate them with argument arrays and explicit working
directories. It will fail with a named missing dependency rather than silently
install from the network. Platform-specific tool acquisition remains an
installation concern and is tested on each supported host. A shell wrapper is
not a portability layer; merely moving it from `scripts/` to `tools/` would
preserve the defect. Provider YAML can supply the runtime and browser, then call
the same entrypoint. The exact tool versions and browser inputs remain locked or
explicitly checked.

### Call ETHOS natively; do not keep a second hook plane

Run the installed `ethos` command from the selected worktree, as the current
ETHOS Agent entry requires. Its Git-common hook runtime owns commit and push
admission. The repository-bound shell adapter and tracked `.githooks/` scripts
are older projections, not another authority or a portability layer. Remove
them only after native negative cases and every current consumer are reconciled.
Repository-specific document topology belongs in the default document-quality
check, so deleting a stale hook does not silently drop that boundary.

### Organize by responsibility, not visual symmetry

`docs/` owns reader guidance; `openspec/` owns change intent and current
specifications; `.ethos/` owns adopter policy; `tools/` owns executable checks;
configuration lives at native discovery roots or under `.config/` only where a
real shared setting warrants it. An extra directory, index, template, or record
must have a consumer. The root remains a small entry and tool manifest, not a
second guideline book. Existing decision records are kept only when their
cross-Change rationale cannot be recovered from current rules and Git history.

### Separate source, delivery, and use evidence

Local format, lint, render, OpenSpec, and ETHOS proof qualify source at an exact
revision. GitLab and GitHub each need an observed ref and CI result at that
revision. A real team task needs its own named subject, time, reviewer, and
outcome. These observations are not copied into a new repository evidence
ledger. The Change stays active while a declared delivery obligation remains
open.

## Risks and Trade-offs

- Deleting a historical companion could remove the easiest visible example of
  an old mechanism. Git preserves the exact pre-deletion blob; official archive
  prose remains the historical explanation. Check inbound references first.
- A single entrypoint can become a monolith. Keep orchestration thin and give
  each irreducible property a focused test rather than building a generic
  validation framework.
- Host browsers and link checkers differ. Pin the actual tool input, run the
  complete graph on each claimed platform, and report an untested platform as
  unqualified rather than calling the design portable by inspection.
- Removing old hooks or wrappers can expose an unguarded command path. Compare
  the installed native hook graph and run negative cases before deletion.

## Migration Plan

1. Establish this official Change and confirm its ETHOS attribution without a
   companion file.
2. Inventory each current rule, executable, configuration, archive companion,
   and inbound consumer. Remove only proved duplicate or obsolete carriers.
3. Replace shell-required repository checks with the locked entrypoint and
   focused tests. Update both CI projections and current instructions together.
4. Run the complete local matrix and hosted jobs at exact source objects.
   Accept source through ETHOS; keep any unobserved delivery obligation open.
5. Archive only after the declared tasks have current evidence. Refresh proof
   and remote observations for the archive commit. Retire this owned Work Lane
   through ETHOS after acceptance, preserving all foreign lanes.
