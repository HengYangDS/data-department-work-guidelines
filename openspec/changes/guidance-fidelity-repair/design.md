# Design

## Context

See [the proposal](proposal.md) for the problem. The original 1,240-line
unified guideline is the `guidelines.md` blob
`ce3d090be258e65534781769e3e2fd5ab7439ef8`, reachable at commit
`fb636e8a47354ebdeb07b869ea60102fd61f2a43`. Its length is not a quality
criterion; its distinct commitments are comparison inputs. The prior
`guidance-semantic-convergence` Change mapped headings to topic pages, not every
unique duty or counterexample. That historical Change stays unchanged. Its
mentioned `rules/` plus `playbooks/` draft has no recoverable tracked content
in the current refs, unreachable commits, or preserved lane artifacts; do not
claim an exact comparison with absent bytes.

This Work Lane starts from `candidate/dev` at `921f9cdd04b661b90bcea62f6305f16c4c38b11a`
while the independent offline-tooling Work Lane has prepared a later source.
Their seven topic pages differ only at the charter edition line. Before land or
release, refresh this lane onto the accepted candidate and recheck that fact;
neither branch name nor this observation guarantees a conflict-free future.

## Goals / Non-Goals

- Restore unique work duties and point-of-use stop and verification cues without
  restoring duplicate normative carriers.
- Keep every tracked word in English and the existing seven semantic owners.
- Make the temporal feedback floor observable without creating mandatory
  meetings, a new reporting calendar, or a second progress ledger.
- Do not claim real team adoption, rewrite the archived Change, or use an
  automated keyword count as proof of semantic equivalence.

## Decisions

### Reconcile duties at their existing owners

The disposition below is a review map, not a second current rule book. “Keep”
means the current topic expresses the duty sufficiently; “repair” requires an
edit and a fresh comparison; “retire” removes a carrier or prescription, not a
safety boundary. Line ranges refer to the original blob. The final editorial
pass must revisit each row and its counterexamples after the edits; a checked
row alone is not acceptance.

- **1–16 — Title, edition, scope, and accountable owner.** Retire the old
  effective date and edition as current metadata; keep the audience,
  accountable owner, and truth-first orientation in `docs/charter.md`.
  `VERSION` owns the current edition.
- **17–35 — Four failure modes and the three values of a task.** Repair the
  purpose and outcome test in `docs/charter.md`; do not turn it into a slogan.
- **36–94 — Progressive task entry, risk-scaled use, and trust kernel.** Keep
  the risk rule in `docs/charter.md`; repair the shortest start/stop/verify
  route in `docs/README.md`.
- **95–195 — Six action cards with input, output, stop, and verification.**
  Retire the duplicated card inventory and diagram; repair point-of-use cues in
  the corresponding topic openings.
- **196–223 — Modal verbs, human and Agent scope, L0/L1/L2, project
  conflicts.** Keep in `docs/charter.md`; check that a local rule conflict
  still reaches an authorized decision.
- **224–277 — Way-seeking orientation and seven principles.** Repair the
  reasoning thread in `docs/charter.md`, `docs/decide.md`, and
  `docs/evolve.md`; do not recreate a poetic taxonomy or fake translation.
- **278–302 — Four hard boundaries and form following risk.** Keep in
  `docs/charter.md`.
- **303–325 — Action-authority ordering and fact-authority ordering.** Repair
  the lower-priority plan, temporary agreement, and preference boundary in
  `docs/charter.md`; retain the two-authority distinction.
- **326–352 — Six semantic kinds and six task boundaries.** Keep in
  `docs/decide.md`; verify all six remain findable from the task route.
- **354–399 — Authority-to-record trust chain and six-step work loop.** Repair
  the existing-carrier record/learning endpoint in `docs/deliver.md`; keep the
  chain as obligations, not seven files.
- **400–419 — Problem definition before information gathering.** Keep in
  `docs/decide.md`.
- **420–449 — Concepts, relationships, falsifiable alternatives, complete
  decomposition, and logic checks.** Repair non-overlap, whole-problem
  coverage, return to the governing decision, and the warning against long
  prose replacing a model in `docs/decide.md`.
- **450–469 — Comparable options, decision authority, ready/blocked/deferred
  states.** Keep in `docs/decide.md`.
- **470–484 — Critical path, dependencies, recovery, and state-change
  reports.** Keep in `docs/deliver.md`.
- **485–512 — Subject-bound evidence and limits of completion claims.** Keep in
  `docs/deliver.md`; compare each original false-equivalence case.
- **513–528 — Reuse triggers and lightest prevention asset.** Keep in
  `docs/evolve.md`; no new evidence root.
- **529–569 — Causal diagnosis, containment/repair/prevention, and option
  criteria.** Keep in `docs/decide.md` and `docs/evolve.md`; check the
  adjacent-path regression duty.
- **570–604 — Data six questions and distinct fact layers.** Repair the
  explicit exploratory-code and temporary-data promotion gate in
  `docs/data.md`; keep the six questions.
- **605–663 — Point-in-time discipline, admission stages, owners, and
  production controls.** Keep in `docs/data.md`; no source view becomes an
  implicit fact authority.
- **664–738 — Communication purpose, concise answer, meeting decisions, and
  risk escalation.** Keep in `docs/communicate.md`; make participation depend
  on decision authority, necessary facts, or action ownership.
- **739–799 — Fidelity, clarity, elegance, reader checks, and eleven-part
  template.** Keep the writing duties in `docs/communicate.md`; retire the
  fixed eleven-part form and examples that merely repeat a rule.
- **800–864 — Human responsibility, Agent truth limits, and source/command
  verification.** Keep in `docs/human-agent.md`.
- **865–912 — Delegation contract, execution, and stop conditions.** Keep in
  `docs/human-agent.md`; do not make a task form mandatory for L0 work.
- **913–921 — Independent parallelism, default read-only review, and one
  integrator.** Repair the read-only default in `docs/human-agent.md`; keep
  lane and source ownership.
- **923–956 — Completion report, interruption handoff, and human acceptance.**
  Repair explicit evidence location, risks, assumptions, unresolved issues, and
  next owner/action/time in `docs/human-agent.md`.
- **958–987 — Distinct work states and minimum completion.** Keep in
  `docs/deliver.md`.
- **989–1028 — Five-level review, eight dimensions, and hard risks.** Keep in
  `docs/evolve.md`; retain behavior and evidence rather than person labels.
- **1029–1064 — Autonomy, management responsibility, and real-work coaching.**
  Keep in `docs/evolve.md`; no ceremonial adoption trial.
- **1065–1075 — Per-task, weekly, monthly, and quarterly management rhythm.**
  Repair in `docs/evolve.md`: event checks plus monthly calibration and
  quarterly rule review; retire the universal weekly 30-minute meeting
  prescription, not the feedback duty.
- **1076–1092 — Quality signals and metric boundaries.** Keep in
  `docs/evolve.md`.
- **1093–1123 — Observe, test, keep/revise/retire a rule by net benefit.** Keep
  in `docs/evolve.md`; repair a findable review trigger if needed.
- **1124–1158 — Manager, member, maintainer, and emergency responsibilities.**
  Keep in `docs/evolve.md`; confirm emergency action does not erase later
  verification.
- **1159–1214 — Four universal form templates.** Retire the duplicate forms;
  keep their decision, risk, status, and retrospective information at
  `docs/decide.md`, `docs/communicate.md`, `docs/deliver.md`, and
  `docs/evolve.md`.
- **1215–1240 — Final self-check and fidelity/clarity/elegance synthesis.**
  Repair task-entry retrieval in `docs/README.md`; keep one normative owner for
  each underlying duty.

This map is intentionally more granular than the former heading map. The
original examples may reveal a counterexample that changes a row's
disposition. If an unaccepted draft is later recovered with exact provenance,
review its distinct counterexamples but do not promote it into a second rule
tree. Amend this Change before claiming fidelity.

### Let the task carry its own feedback, with a periodic backstop

Event checks do the primary work: frame an L1/L2 task at the start; reconsider
facts, options, and authority at a material decision or changed risk; verify
at delivery; preserve a handoff on interruption; escalate high-impact signals
immediately. A calendar must not delay those decisions.

Event checks alone miss quiet drift. Once each month, use at least one real
work sample and accumulated weak signals to ask which judgment, handoff, or
control failed and whether a small correction is warranted. Once each quarter,
review the net benefit of current rules, templates, tools, and Agent practices;
keep, revise, or retire them. The manager owns the work calibration and
cross-domain decision boundary; the guideline maintainer owns the rule review.
L2 work may set a shorter task-specific interval at authorization. Use the
existing ticket, review, or decision carrier; record a material decision and
its owner, not a meeting transcript or a “nothing happened” activity report.
This retains a temporal floor without restoring universal weekly meeting time.

### Accept the two Changes in dependency order

The offline-tooling Change owns its source, bundle, and release tasks. This
Change owns only guidance fidelity. The two must not be merged into one task
list or retroactively certified by the older Change. Finish and accept the
offline source locally when ETHOS proof permits; keep its delivery tasks open.
Then use ETHOS `lane refresh-base` to place this Change on that accepted
candidate, resolve the charter edition line, and amend the prepared `v5.0.0`
Changelog entry to name the restored duties and feedback floor. Older entries
remain historical; do not rewrite them as if the restored rule had applied then.
Rerun every check on the resulting exact HEAD. Only the final accepted
source may be tagged. The
existing offline bundle bytes may be reused only if its declared inputs still
match; rerun a true cold offline install and full verification for the final
source revision before claiming host qualification. Neither prior CI nor the
old macOS probe transfers automatically to that revision.

## Risks / Trade-offs

- **More words recreate a monolith** → Add only unique duties at the semantic
  owner and verify the first-screen route; delete repeated explanation.
- **A clause map appears to prove itself** → Inspect original counterexamples
  and final rendered pages; distinguish editorial judgment
  from machine checks.
- **Periodic review becomes theater** → Reuse existing carriers and require a
  decision only when evidence changes a judgment; no new meeting duration or
  department-wide activity report.
- **Base drift alters the release** → Refresh through ETHOS, inspect the full
  diff, and qualify source, proof, bundle, and hosted jobs again by exact SHA.
- **Historical evidence is rewritten** → Leave the archived Change and original
  Git object untouched; this Change records the correction prospectively.

## Migration Plan

1. Complete the original-clause and counterexample comparison. Review any
   unaccepted draft only if its exact content and provenance become available.
   Correct this disposition before editing a topic if needed.
2. Amend only the existing task map and topic owners with the missing duties and
   the hybrid feedback floor. Review the reader's start, stop, and verification
   path for each affected task.
3. Run formatting, spelling, lint, links, rendering, official OpenSpec strict
   validation, repository tests, and ETHOS admission and proof on the changed
   source. Refresh onto the accepted candidate before any land decision.
4. Accept source through ETHOS, then coordinate the final version tag, both
   Forge publications, offline matrix, Change archive, and Work Lane retirement
   with the separate offline-tooling Change. A failed final host or Forge keeps
   only its own claim open; no raw push or false checkbox substitutes for it.
