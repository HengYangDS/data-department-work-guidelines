# Design

## Context

See `proposal.md`. The current `guidelines.md` has 1,240 lines and combines a
constitution, a work method, data-domain requirements, communication guidance,
Agent operating instructions, management cadence, templates, and a reader map.
The root README and AGENTS entrypoint route back into sections of that single
file. Seven canonical OpenSpec specs are copied ETHOS product-family stubs, so
strict syntax validation does not test DDWG's own guidance. The repository also
tracks twelve historical claims, dated repository Chronicles, and an empty
parity directory under `evidence/`; no current ETHOS or repository command was
found to consume those tracked claims as proof. The installed ETHOS runtime and
both Forge job results remain independent acceptance surfaces.

## Goals / Non-Goals

**Goals:**

- Give every active normative proposition one semantic owner and a direct route
  from a representative member or Agent task.
- Preserve the substance of necessary data-department rules while removing
  duplicate, time-bound, unproven, or repository-product language from them.
- Keep official OpenSpec intent, ETHOS proof and effects, Git history, and Forge
  observations in their native owners rather than materializing a generic
  tracked `evidence/` tree.
- Make command examples, document links, task retrieval, and CI behavior
  testable against the current installed contract.
- Finish the accepted source and independent GitLab/GitHub publication before
  making a whole-delivery completion claim.

**Non-Goals:**

- Asserting actual team adoption or improvement without real-work samples.
- Rewriting immutable historical Change content, Git objects, or Forge runs.
- Moving or retiring foreign dirty Work Lanes as a side effect of source edits.
- Forking OpenSpec or ETHOS lifecycle validation into repository-local scripts.

## Decisions

### Select semantic owners before selecting files

The team's one irreducible purpose is to turn observed signals into justified,
usable judgments and data assets. A valid claim names its source, meaning, time,
authorized decision owner, use boundary, and supporting observation. Rules
constrain that judgment; methods help apply rules; records describe actual work.
The reader's task and the proposition's reason to change determine placement.

| Meaning                                                             | Current owner after migration               | Boundary                                                      |
| ------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| Foundational purpose, authority, and non-negotiable limits          | `docs/charter.md`                           | No workflow or template catalogue.                            |
| Analysis and decision                                               | `docs/decide.md`                            | A decision's work record is not a durable repository DR.      |
| Execution, verification, completion, and handoff                    | `docs/deliver.md`                           | A local result cannot imply deployment or use.                |
| Data provenance, semantics, time, quality, adoption, and production | `docs/data.md`                              | Domain facts remain in their producing systems.               |
| Spoken and written communication                                    | `docs/communicate.md`                       | Expression cannot increase evidence strength.                 |
| Human-Agent delegation and accountability                           | `docs/human-agent.md`                       | Agent output is a candidate input, not authorization.         |
| Learning, rule entry, and rule exit                                 | `docs/evolve.md`                            | No standing cadence or score is imposed without use evidence. |
| Irreducible cross-Change rationale                                  | `docs/decisions/dr-*.md`                    | A DR has no task state, command log, or acceptance report.    |
| Repository change intent and progress                               | Official `openspec/changes/`                | No method-pack or local companion lifecycle.                  |
| Verified repository effects                                         | ETHOS Attestations, Git objects, Forge jobs | Each proof is bound to its actual source and plane.           |

`README.md` is a short human entry, `AGENTS.md` is a minimal Agent route, and
`docs/README.md` is the sole documentation directory index. None owns a second
copy of a rule. The root `guidelines.md` is removed after all inbound links,
release metadata, and normative-source declarations are migrated. A permanent
redirect file would preserve a second apparent rule entry without a proven
consumer; Git history retains the old bytes. The documentation root is flat
while the number of active topics is small. A deeper folder is added only when
one reader question needs genuine subtopics.

Alternative rejected: a thin root `guidelines.md` plus topic files. It keeps two
root human entrypoints and a legacy version binding for path convenience, not a
separate semantic responsibility. The earlier `rules/` plus `playbooks/` draft
is useful historical input but would add another prescribed taxonomy and a
second navigation system before actual readers justify it.

### Evidence is a relationship, not a repository directory

A result needs evidence if someone relies on it. Its producer, consumer,
source object, validity period, and retention rule decide the carrier. Source
proof stays in ETHOS's native Attestation set; code and document history stay
in Git and archived OpenSpec; hosted execution stays in each Forge; data-work
observations stay in the domain system that produced them. A curated teaching
case may later enter `docs/` after rights, context, and review are established.

The current `evidence/claims/*.toml` files are all historical and have no
current nonhistorical consumer outside their own dated Chronicle links. They
are not a product requirement of the installed ETHOS command plane. Before
retirement, review each record for a unique fact that is absent from its
archived Change, Git commit, or native Attestation. Preserve only such a fact
in one concise historical topic with exact references. Remove the duplicate
`docs/evidence/` index, empty parity marker, unsupported tracked claim schema,
and any repository rule that falsely declares `evidence/` mandatory. Deletion
is a new Git commit; old bytes remain recoverable without rewriting history.

Alternative rejected: moving the entire root to `docs/history/evidence/`. That
would retain a second status and proof archive while merely changing its path.

### Let decisions carry only necessary rationale

Canonical filenames use lowercase `dr-NNNN-meaning.md`; the stable human ID may
remain uppercase `DR-NNNN`. One `docs/decisions/README.md` registers current and
superseded records. State is metadata, not an `accepted/` or `superseded/`
folder. `DR-0001` retains its durable terminology choice. `DR-0002` is
superseded because its one-large-file topology is deliberately replaced.
`DR-0003` is retired from current decision navigation because it records a
trial-readiness state. `DR-0004` retains the official OpenSpec/ETHOS boundary
but its old implementation details are amended explicitly. The old identifiers
are never reassigned. A new DR is created only if an enduring alternative's
rationale cannot be carried by the current contract or Change design.

Alternative rejected: automatically converting every prior DR into a new
numbered DR. Numbering and a five-section shape cannot make a task status into
an irreducible decision.

### Use DDWG-owned specifications and native validation

Official spec deltas remove the seven copied ETHOS family boundaries. The
remaining quality and repository-governance contracts are rewritten around
observable DDWG behavior; the new guidance-discovery capability tests reader
routing and unique rule ownership. Specs do not repeat each normative paragraph.
The old repository-governance spec contains many completed one-off repairs;
those requirements are retired after their current effects and preserved
history are identified. The official archive must apply the deltas; empty
placeholder capability directories are removed only after checking the native
archive result, under the same selected Change, without a private spec merger.

Documentation validation checks every present diagram, local link and anchor,
formatting, metadata, current command example, and repository-specific DR
boundary. It no longer requires six particular cards, five diagrams, a root
`guidelines.md`, or a tracked claim/Chronicle for every Change. ETHOS owns
admission, proof, archive, landing, and publication. Representative reader
journeys are evaluated separately against the rendered and raw documents:
identify the applicable rule, its limits, responsible actor, and next action
without reading unrelated topics. Baseline and after-results are recorded in
the Change, not promoted into an invented numeric universal length rule.

Alternative rejected: reducing the monolith by moving headings while leaving
shape-count validators and copied policy in place. That changes path names
without changing reader behavior or authority.

### Keep three evidence planes and two publication peers distinct

The local source can be accepted without either remote. GitLab remains the
organization's main publication peer and GitHub an independent full repository
and CI/CD peer. Both receive the same selected source object; neither peer is
used to reconstruct the other's source. Only `dev`, `main`, and `submit/*` may
be published. GitLab's job selects the canonical `ci-linux-arm64-docker`
capability after a matching runner is proven available. GitHub remains hosted
on Ubuntu with the shared verifier. Runner registration and credentials are
external to this source Change.

This Change includes delivery obligations. Its active task carrier may travel
through candidate and accepted refs while hosted delivery is pending. After
observed peer jobs and task completion, archive the Change; the archive commit
has a new source identity and receives fresh proof and publication observation.
No task may require its own archive commit's future CI result, which would make
the task ledger self-referential.

## Risks / Trade-offs

- [A moved rule loses an exception] -> map each old heading and unique obligation
  to one new owner, inspect the full diff, and test representative countercases.
- [An old tracked record is the sole historical source] -> compare its exact
  claim and Chronicle to Git, archived OpenSpec, and Attestations before removal.
- [A link outside the repository targets `guidelines.md`] -> inspect known
  external consumers, document the breaking path change, and preserve the old
  object in Git history; do not claim unknown external links were repaired.
- [The installed ETHOS runtime differs from the current ETHOS product] -> test
  the actual adopter lifecycle before relying on merge-then-archive. Repair the
  owning product if it forces a false completion order; do not check future
  delivery tasks early.
- [GitLab cannot schedule the new tag] -> establish a matching runner before
  publishing that selector. Keep the old tag until the new exact-SHA job passes.
- [Physical cleanup loses foreign work] -> separately inventory owners, index,
  tracked and untracked content, and use native exact retirement receipts only
  after the accepted source is stable.

## Migration Plan

1. Complete this official Change's specification, design, and task artifacts.
2. Record a source-to-owner map, then move and edit guidance in semantic slices.
3. Reconcile DRs, copied specs, obsolete evidence and navigation, profile and
   release metadata, scripts, tests, and CI as one reviewed source change.
4. Run focused regressions, reader journeys, cold setup, full local validation,
   official OpenSpec validation, and exact-source ETHOS proof.
5. Integrate and accept the source while retaining pending delivery tasks.
   Publish and observe each Forge independently.
6. Finish delivery tasks from observed facts, archive officially, and prove and
   publish the archive result as a new object. Then perform native lane and
   scratch-space housekeeping with exact ownership review.

Before source acceptance, rollback is a governed revert in the owned lane. A
remote failure leaves the local accepted object intact and the affected peer
unverified. Retirement failures recover from their native receipt; no broad
filesystem deletion is a rollback strategy.
