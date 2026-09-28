# Design

## Context

See [the proposal](proposal.md) for the defect. The former accepted guideline is
the Git blob `ce3d090be258e65534781769e3e2fd5ab7439ef8` (`guidelines.md`,
1,240 lines). The prior 34-range review is in the archived
`guidance-fidelity-repair` Change. Its disposition is an input, not proof that
the present topics cannot contradict one another. The current
`guidance-discovery` specification already requires a unique owner for each
duty and editorial review of counterexamples.

## Goals / Non-Goals

**Goal:** A reader can apply each retained duty from the current topic route
without a missing qualifier or a contradiction elsewhere in the seven topics.

**Non-goals:** Restore the unified document, its fixed forms or meeting length,
introduce a machine claim of semantic equivalence, or certify team adoption.

## Decisions

### Repair only the normative owner

The audit compares the former source's authority, actor, action, stop condition,
and evidence requirement against the current topic. It revisits all 34 ranges
in the previous review and tests concrete counterexamples, not word count. A
missing qualifier is repaired at its topic owner; overlapping topic text is
made consistent rather than copied into a new checklist. The alternative of
creating a second rule tree would make the same duty independently editable in
two places and is rejected.

| Former source                                      | Current defect                                                                                                                    | Counterexample the repair must reject                                                                      |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Lines 632–640, one lead for cross-domain data work | `docs/charter.md` says the lead may be shared without the data-specific boundary; `docs/data.md` requires one lead.               | Two teams each claim a joint data-work lead by citing the charter, but neither owns the end-to-end result. |
| Lines 303–324, distinct action and fact authority  | `docs/charter.md` states the distinction but not the duty to expose a conflict.                                                   | An authorized request contradicts a verified record; the executor silently edits the record or proceeds.   |
| Lines 598–603, separate fact layers                | `docs/data.md` omits platform-derived views as a distinct layer and does not name catalogs and Agent summaries among projections. | A derived platform view or catalog is treated as a new primary source.                                     |
| Lines 642–654, production-change controls          | `docs/data.md` names security and sensitive information but not the access-permission check.                                      | A production change keeps its former access rights without confirming they still fit the intended use.     |
| Lines 865–884, consequential Agent delegation      | `docs/human-agent.md` omits time, security, compatibility, and cost constraints from the point-of-use contract.                   | An Agent changes a compatible interface or exceeds a cost limit because only file scope was specified.     |
| Lines 923–938, Agent completion and handoff        | `docs/human-agent.md` names method, result, and version but not verification time at the point of reporting.                      | A stale check is presented as current because the report omits when it ran.                                |
| Lines 1076–1091, quality signals                   | `docs/evolve.md` reduces returned, corrected, or over-bound Agent output to “misuse.”                                             | Corrected low-quality output is excluded from review because no permission boundary was crossed.           |

The role wording has another cross-topic conflict: the original problem
definition and Agent responsibility model (lines 400–419 and 845–855) distinguish
the task lead, decision maker, reviewer, and acceptor. Charter metadata instead
has one “authorized owner” decide and accept every task, and the Agent role
table calls member verification “acceptance.” A member must not treat a task
lead's own review as the formal L2 acceptance without the required authority.

Two further point-of-use qualifiers emerged in the full-source comparison:

- Lines 859–863 require Agent output to be verified **and incorporated into an
  authoritative carrier** before it becomes a team fact source. The current
  collaboration page calls it candidate material but leaves the incorporation
  boundary implicit. A plausible Agent summary must not become an enduring
  source of truth merely because someone checked it once.
- Lines 1159–1170 require an important status update to name the next action,
  owner, due time, and acceptance condition. The communication page names a
  requested decision but not the case where no decision is needed. A report
  saying only “work continues” must not count as an actionable update.

The ownership, authority, data, and delegation cases are safety boundaries.
The remaining cases prevent weak evidence and recurring quality defects from
disappearing in compression. The source-to-owner comparison may reveal another
unique gap; if so, amend this
Change before editing that topic. An apparent absence is not a defect when an
explicit later owner decision retired the prescription, such as the universal
weekly 30-minute meeting.

The 34 prior source ranges were reread against the current topic owners and
their adverse cases. The ten discrepancies above were found and repaired at
their current owners. No further distinct duty was identified in this pass.
This is a bounded editorial judgment, not a claim of machine-proved equivalence:
the retired eleven-heading form and universal weekly meeting remain deliberate
changes, while the monthly and quarterly feedback floor remains current.

### Keep the OpenSpec delta empty

This corrects topic prose against the already accepted
`guidance-discovery` requirement; it does not change the requirement's behavior.
The official `.openspec.yaml` therefore uses `skip_specs: true`. OpenSpec owns
the Change lifecycle and ETHOS owns path admission and proof. Neither a local
script nor this table is a substitute command plane.

### Show one realistic decision, not seven abstract summaries

The former guideline names information acquisition, historical quant research,
data production, platform work, governance, and delivery as real department
interfaces. Use a **clearly illustrative** revised-market-history case in the
existing data topic. Its point-in-time research question, promotion gate,
production checks, permission decision, and feedback path should make a reader
see what to do and when to stop. A short communication example can show how to
escalate the same issue without inventing a team incident or performance result.
Link from the task map to the case only if the route remains task-first.

Humans and Agents consume the same seven normative topics. The human entry
starts with the work question; the Agent entry adds delegated scope, source,
write-admission, and stop conditions, then points to those same topics. Do not
make an Agent-only restatement of policy. Use a table where a comparison matters,
a small callout where a stop condition matters, and prose for the reasoning;
avoid a decorative diagram or another inventory.

### Use role and lifecycle terms without a glossary detour

At first relevant use, distinguish the **task lead** (coordinates the result),
the **decision owner** (has authority to choose), the **reviewer** (checks
independently), and the **acceptor** (confirms the agreed completion). One person
may fill multiple roles where the risk policy permits; the words do not make
roles automatically identical. In data work, **admission** permits a defined
use, while **adoption** is observed use after admission. **Verification** checks
evidence; **acceptance** is an authorized judgment; **publication** or
**effectiveness** is the actual target state. Correct ambiguous point-of-use
wording, including “lead” where it means a data signal rather than a person.
Do not add a glossary file or repeat these definitions on every page.

### Release as a compatible correction

Prepare `v5.0.3` as a patch. The role, evidence, and data boundaries restore
the former accepted contract and resolve contradictions inside v5.0.2; they do
not impose a new general one-lead rule outside data work. The worked case is
explicitly illustrative and adds no permission or required form. This edition
keeps the same reader entry, command surface, and Node toolchain. If final
review finds a new incompatible obligation, reclassify before signing a tag.

## Risks / Trade-offs

- **A short sentence remains open to two readings** → Test it against the
  adverse case and compare the neighboring topic before accepting the edit.
- **Editorial review is mistaken for mechanical proof** → Report the source,
  comparison method, and remaining limits; repository checks establish only
  their declared syntactic and link boundaries.
- **A correction silently changes the public contract** → Compare the rule
  with the former accepted source and current specification; classify release
  compatibility before publication.
- **A plausible example is read as an observed event** → Label it illustrative,
  use no invented dates, metrics, people, or outcomes, and keep current facts
  separate from the hypothetical decision.

## Migration Plan

Finish the source comparison and repair in this leased Work Lane. Run the
repository verifier, strict official OpenSpec validation, changed-path planning,
and exact-HEAD ETHOS proof. Accept through the native candidate and archive
transitions, then publish and verify each eligible remote separately. Until the
new source is accepted, the earlier signed release remains the public edition.
