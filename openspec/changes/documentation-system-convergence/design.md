# Design

## Context

At the start of this Change, the accepted source had a short repository entry
and a seven-question reader map. It also had a locked Node toolchain, twenty
tracked shell files, two redundant OpenSpec placeholders, nine archived
non-official scope companions,
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
  not duplicated. Historical Git objects remain truthful without keeping
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
preserve the defect. Provider YAML supplies the Node runtime and pinned link
checker, then calls the same entrypoint. The exact tool versions remain locked
or explicitly checked.

### Remove the browser chain without weakening the reader rule

The only Mermaid diagram restated the surrounding learning loop. It did not
carry a unique decision, condition, or exception. Removing it also removes
Mermaid CLI, Puppeteer, browser installation, and two renderer configurations
from the required verification path. This is not a ban on visual explanation:
a later visual needs a demonstrated reader benefit and an appropriate check
before its rendered form is claimed as verified. The two default proof gates
also split work cleanly: `docs-integrity` checks document behavior and
`markdown-format` owns formatting; the standalone verifier runs both once.

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

### Preserve the former guideline's obligations, not its length

The last unified `guidelines.md` had 1,240 lines. The new route is not accepted
merely because it has seven topics or passes Markdown checks. Compare its
obligations and counterexamples with the current owners:

| Former subject                          | Current owner         | Resolution                                                                 |
| --------------------------------------- | --------------------- | -------------------------------------------------------------------------- |
| Authority, hard boundaries, L0–L2 floor | `docs/charter.md`     | Keep the risk-scaled minimum and rule-word meaning.                        |
| Six task boundaries and reasoning       | `docs/decide.md`      | Name all six; plan observation and check regressions after repair.         |
| Work states and completion              | `docs/deliver.md`     | Separate executing, verification, acceptance, and effect.                  |
| Data qualification                      | `docs/data.md`        | Retain source, time, meaning, quality, permission, and exit.               |
| Speaking and writing                    | `docs/communicate.md` | Retain purpose, conclusion, basis, request, and restraint.                 |
| Human–AI delegation                     | `docs/human-agent.md` | State that submission retains human responsibility.                        |
| Weak signals, review, and retirement    | `docs/evolve.md`      | Retain the learning trigger and review scale, not a fixed meeting cadence. |

This is an editorial coverage argument, not proof that a text linter understands
the original meaning. Review representative member and Agent scenarios against
the route itself; do not stage a team-use trial as a release gate.

### Give releases one version identity and a checked changelog

`VERSION` becomes the sole product-release target because native ETHOS tag
admission reads that committed file. The private npm tool manifest stops carrying
a second version. The charter's visible edition must agree with `VERSION`.
The public compatibility surface is the normative guidance, stable reader and
Agent routes, and documented contributor commands. Removing those shell commands
is incompatible, so this train targets 4.0.0 rather than silently changing the
already distributed 3.0.0 branch edition.

`CHANGELOG.md` uses the official Keep a Changelog introduction, `Unreleased`
first, only its six standard categories, strict SemVer headings, real ISO dates,
and version links. A repository check rejects uncategorized entries, malformed
sections, version drift, missing or extra local tags, a released comparison to
a moving branch, and a selected tag that does not identify the exact source.
`Unreleased` starts at a prepared current version when one exists, otherwise at
the latest local release tag. A prepared release moves its changes out of
`Unreleased` and names the prospective `vVERSION` tag in both comparison
links. Only that exact future tag is allowed to be unresolved before creation;
the same source then validates after the signed tag exists. One current
version may be prepared before its tag; that heading is not
publication evidence. The older 2.x and 3.0.0 branch editions have no local or
Forge release tags, so their former prose stays in Git history instead of being
relabeled as formal releases. Human review of compatibility impact remains
necessary: a parser cannot infer whether a changed obligation is breaking.
ETHOS owns signed-tag authority and publication, not this parser.

New commits use scoped Conventional Commit subjects under the ETHOS workspace
policy. This does not authorize changing old messages. The operator's historical
author identity has obsolete email forms in accepted history. Once the worktree
is clean, use native ETHOS identity repair for the exact selected commits only.
Readiness must identify admitted refs and worktree registrations. Application
needs a self-contained verified Git bundle and an exact correction digest. Repair
preserves trees, messages, timestamps, and unselected identities; re-signing
descendants changes object IDs, so proof, accepted refs, both Forge projections,
and hosted CI must be re-established before a release tag is created.

### Separate source, delivery, and use evidence

Local format, lint, OpenSpec, and ETHOS proof qualify source at an exact
revision. GitLab and GitHub each need an observed ref and CI result at that
revision. Natural use in ordinary team work may later show adoption, but is not
a manufactured release gate or an inference from CI. These observations are
not copied into a new repository evidence ledger. The Change stays active
while a declared delivery obligation remains open.

## Risks and Trade-offs

- Deleting a historical companion could remove the easiest visible example of
  an old mechanism. Git preserves the exact pre-deletion blob; official archive
  prose remains the historical explanation. Check inbound references first.
- A single entrypoint can become a monolith. Keep orchestration thin and give
  each irreducible property a focused test rather than building a generic
  validation framework.
- Local lychee validation checks the executable version, not its binary digest.
  CI supply verifies the declared asset digest; do not call an arbitrary local
  installation checksum-pinned.
- Host link checkers may differ. Pin the actual tool input, run the
  complete graph on each claimed platform, and report an untested platform as
  unqualified rather than calling the design portable by inspection.
- Windows may check out every text file with CRLF under its host default;
  `.gitattributes` gives Git the repository's LF rule. Hosted runs must still
  prove that repair on the selected source.
- Removing old hooks or wrappers can expose an unguarded command path. Compare
  the installed native hook graph and run negative cases before deletion.
- A historical branch edition could be mistaken for a formal release. Do not
  backdate or create a tag to make the record look complete; publish the first
  genuine versioned release only after its exact source and tag pass admission.
- Historical identity repair can make remote updates non-fast-forward. Keep the
  recovery bundle outside the repository, inspect every selected header and
  affected ref, and stop if native admission cannot preserve unrelated work.

## Migration Plan

The task checklist ends at release-source readiness. Exact-HEAD proof, local
acceptance, tag creation, dual-Forge publication, official archive, archive-HEAD
proof and owned-lane retirement are later ETHOS effects. Their evidence is
observed at each boundary; no task checkbox certifies a future effect or a
source commit that has not yet been made.

1. Establish this official Change and confirm its ETHOS attribution without a
   companion file.
2. Inventory each current rule, executable, configuration, archive companion,
   and inbound consumer. Remove only proved duplicate or obsolete carriers.
3. Replace shell-required repository checks with the locked entrypoint and
   focused tests. Remove browser supply when no current visual requires it;
   update both CI projections and current instructions together.
4. Bind `VERSION`, the charter, and the curated changelog. Test invalid
   categories, versions, dates, links, tag drift, and the pending-release case.
5. Finish source checks and read-only remote preflight, then commit the exact
   candidate. Preserve the already verified native identity-repair bundle and
   re-establish proof for every later source commit.
6. Accept the proved source and create the signed `v4.0.0` tag through ETHOS.
   Publish to GitLab and GitHub as independent exact-CAS effects; require each
   hosted job and Forge Release to be observed at the claimed object.
7. Archive only after the declared tasks and publication effects have current
   evidence. Refresh proof and remote observations for the archive commit.
   Retire this owned Work Lane through ETHOS after acceptance, preserving all
   foreign lanes.
