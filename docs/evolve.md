---
subject: data-department-work-guidelines:evolve
role: policy
state: canonical
relations:
  canonical_for: learning review and rule evolution
---

# Practice and Evolution

**When to use:** A problem repeats, coaching or review is needed, a template,
tool, or rule is proposed, or an existing mechanism has become a burden.

The aim of learning is to find the next failure earlier, judge it more easily,
and need less manual rescue. Before admitting a rule, template, tool, Agent
workflow, or platform mechanism as department practice, you must establish an
observed problem, substantiated material risk, or applicable obligation. You
must require a bounded trial, a responsible owner, and evidence of net benefit
from the proposed practice.

For an urgent failure or breach, go directly to
[emergencies and exceptions](#emergencies-and-exceptions). For routine work,
use [practice admission](#admit-practices-and-prevent-recurrence) or the
[review cadence](#cadence-and-responsibilities).

## Admit Practices and Prevent Recurrence

Before admitting a practice, you must establish:

- **Need and cost:** The observed problem, substantiated material risk, or
  applicable obligation it addresses; why the existing boundary, interface,
  and feedback are insufficient; the risk and complexity it would reduce;
  and the cognitive and maintenance cost it would add.
- **Trial and evidence:** How it can be tried on a small scale, and what
  observation would justify keeping it.
- **Ownership and exit:** Who maintains it, when it is reviewed, and what
  triggers revision or retirement.

Necessary safeguards must not wait for an incident or practice admission. You
must meet the applicable obligation within existing authority; you must use the
trial to choose and verify a proportionate implementation, not to decide whether
the obligation applies.

You should retire a rule that has lost its subject, has no user, duplicates a
source of truth, or costs more than it returns.

### Detect Drift Before Failure

You should watch small changes without treating one anomaly as a trend: drifting
definitions, recurring questions, temporary human rescue, expired evidence,
ambiguous ownership, intermittent failures, and slight delays can be early
signals of a system defect. You must check their pattern, impact, and direction
before building a remedy.

You must leave reusable prevention when any of these conditions creates a
material risk of error, loss, repeated rescue, or coordination cost, even before
a failure:

- A problem of the same kind recurs or affects more than one person, project, or
  work cycle.
- An important judgment depends on tacit knowledge held by one or a few people.
- Forgetting could cause material loss.
- Agents will perform the same work repeatedly.

### Improve the Existing Mechanism

A reusable asset may be a test, monitor, checklist, decision record, example,
rule, platform capability, or clearer ownership interface. You must improve or
link an existing asset before creating another. A task-specific prevention asset
need not become department practice; if it does, the admission conditions above
still apply. You must choose the lightest form sufficient to prevent the failure
or its recurrence. You should keep it findable, usable, and maintained at its
existing owner. You should link to an existing authority rather than copying it.
For repeated failures, or failures in [L1 or L2
work](charter.md#form-follows-risk), you should distinguish containment, direct
correction, and prevention of recurrence.

## Grow Capability Through Real Work

1. **Confirm the boundary.** The responsible member confirms the subject,
   boundary, and success criteria with the existing task owner. In
   capability-building work, a supervisor coaches that reasoning and checks the
   shared understanding. Routine work within an established mandate does not
   need another supervisor approval.
2. **Review the reasoning.** At important decisions, you should examine facts,
   hypotheses, options, and risks.
3. **Agree on the next improvement.** After delivery, you should choose the most
   consequential gap in reasoning or expression and agree on an observable
   improvement for the next task. You should keep a few successful and failed
   examples with reasons. You should move gradually from guided execution to
   independent judgment, method-building, and coaching.

Coaching tests the member's reasoning without making the judgment for them.
Feedback names a proposition, evidence, behavior, and consequence; a label such
as “weak logic” gives no actionable direction.

## Review Critical Risks

You should review evidence before judging delivery risk. At minimum, you should
inspect problem framing, the logical model, evidence and uncertainty,
trade-offs, execution and acceptance, oral and written communication, and
delegation and verification of Agents. Fluency, effort, or Agent efficiency
cannot offset these hard risks:

- Fabricated, selectively hidden, or unverified facts and evidence presented
  as established.
- Known uncertainty presented as certainty to drive a decision.
- Completion claimed without current verification.
- Agent output treated as fact, authorization, or a substitute for responsibility.
- High-risk or irreversible action beyond authorization.
- Concealed blockers, delays, failures, or scope changes.
- Rhetoric or activity counts in place of reasoning and results.
- Repeated manual rescue without a mechanism to prevent recurrence.

Every task must meet the [hard
boundaries](charter.md#four-non-negotiable-boundaries). A member should reliably
carry critical responsibilities within their competence and authority, without
depending on repeated rescue. Required review and acceptance still apply.

You must not call a result exceptional unless it produces evidenced net benefit,
transfers a method, reduces long-term complexity, and improves others' capacity.
Not every task needs an exceptional result; every task still owes its agreed
outcome and the [four non-negotiable
boundaries](charter.md#four-non-negotiable-boundaries).

### Use Scores with Care

If scoring is used, you should define its levels, observable behavior, and
purpose. A score expresses delivery risk. It judges one piece of work; a member's
work over a period is judged by a [tier at their
grade](grow.md#tiers-performance-at-ones-own-grade). If a five-level review is
used, you should keep its meaning stable:

| Level             | Observable delivery risk                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| 1: unacceptable   | The subject, facts, or responsibility are confused enough to invite a wrong action.              |
| 2: below standard | Useful fragments exist, but reasoning, evidence, or delivery has a material gap.                 |
| 3: borderline     | The work is usable with guidance, not yet reliable independently.                                |
| 4: meets standard | The work demonstrates independent bounded judgment, executable choices, and reliable acceptance. |
| 5: strong         | The result also leaves a transferable method or system improvement.                              |

## Observe the System Without Worshipping Numbers

You should watch the work from three angles:

- **Work and decisions:** Rework from unclear goals or definitions, reasons
  decisions wait, and handoff continuity.
- **Quality and risk:** Quality failures found downstream, repeated incidents,
  late exposure of risk, and reopened completion claims.
- **Agent use and capability:** Why Agent output was returned, corrected, or
  out of bounds; growth from guided execution toward independent judgment;
  and whether a new mechanism lowers total cost.

For every metric, you should first name the decision it supports, its fact
source, period, boundary, and how it could be gamed. No local metric may stand for
the overall value of work or a system. You must investigate anomalies through cases and
mechanisms; you must not equate them directly with individual performance.

## Cadence and Responsibilities

For every L1 or L2 task, you must align the subject and success condition at the
start, recheck facts, options, and authority at material decisions or changed
risk, verify at the end, and preserve a handoff when interrupted. You must
escalate high-risk signals when observed; a calendar must not delay containment
or a decision.

The department head or appointed guideline maintainer owns a regular review
rhythm and must maintain it. The owner should use these defaults during active
work:

| Review                          | Default interval | Required result                                                                                                                                                                      |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Calibrate judgment              | Weekly           | Must compare real work samples against evidence and criteria; must correct a misunderstanding or identify a coaching need.                                                           |
| Review mechanisms               | Monthly          | Must examine recurring failures, weak signals, escaped quality issues, Agent misuse, and needless coordination; must decide the correction, owner, and next action.                  |
| Review practices and capability | Quarterly        | With the people using the practices, must assess rules, templates, tools, and Agent workflows for net benefit; must keep, revise, or retire them and identify capability priorities. |

The owner may adjust an interval for work volume, risk, the speed of change, and
the quality of existing feedback. The owner must record the reason and next
review time in an existing work record and must revisit the choice when those
conditions change. The owner must preserve all three review purposes. A trial or
high-risk task needs a review point before its evidence or authorization
expires; an urgent signal must not wait for it.

The owner must use enough real samples and time to resolve the review question,
not a fixed sample count or meeting length. The owner may combine reviews when
useful, but must distinguish whether the decision concerns judgment, a failing
mechanism, or a practice that no longer earns its cost. A stricter applicable
review requirement still holds.

The owner must use existing meetings, tickets, and reviews and must record each
material decision and its owner there. The owner must not create a form or
meeting unless existing carriers cannot hold the necessary review. No routine
“nothing happened” activity report is required.

## Management Responsibilities

**Managers** clarify direction, priorities, decision boundaries, and resources.
They resolve cross-domain conflicts and long-standing open decisions in time
for work to proceed, and ensure that results, anomalies, and actual-use effects
return promptly to the responsible owner.

They show how they judge and communicate through concrete work examples. They
protect people who honestly expose problems and must not penalize honest
uncertainty or make one person's repeated rescue the department's normal way of
operating. They must not use these guidelines for retrospective fault-finding,
ceremonial review, or micromanagement.

When goals conflict, priorities drift, resources are short, decisions stall, or
interfaces mislead, you should repair the management system before blaming a
member's capability. Within the stated decision boundaries, the responsible
person closest to the facts chooses the method, tools, and implementation path;
the [four non-negotiable boundaries](charter.md#four-non-negotiable-boundaries)
still apply.

**Members** own end-to-end results in their remit; the end-to-end result of a
whole task stays with its
[task lead](human-agent.md#delegate-a-boundary-not-a-pile-of-context). Members
disclose unknowns, risks, dependencies, and failures without waiting to be
asked.

**Guideline maintainers** gather real cases, conflicts, and signs of
obsolescence, and state the reason, evidence, effective time, and scope for each
addition or deletion. They should not add rules to mask goal, organizational, or
system-design defects.

## Emergencies and Exceptions

When a data error, production failure, or permission or compliance breach
threatens data, production, downstream use, or compliance:

1. **Whoever discovers it** takes containment steps within their existing
   authority and notifies the responsible data or production owner.
2. **The person responsible for the affected work**, usually the task lead, owns
   the response and follow-through. They must preserve the inputs and versions
   needed to establish the impact and verify a correction. If the response needs
   further permission, they must escalate to the decision owner.

The [four non-negotiable boundaries](charter.md#four-non-negotiable-boundaries)
still apply: you must report known facts and uncertainty honestly, keep
responsibility explicit, and observe permission and compliance limits. Urgency
does not make an uncertain result reliable or grant authority to act.

You must contain the impact before completing the record when recording first
would delay the response. You must record who decided what, the facts and
authority they used, the measure's expiry, takeover owner, and rollback
condition. Once risk is controlled, you must verify the correction on affected
data and dependent uses, complete the record, and review the cause. Repeated
emergency exceptions of the same kind must be handled as a mechanism problem.

Specific rule changes still follow
[repository governance](governance/README.md). Team adoption must be shown
through real work, not inferred from publication.
