<!--
---
subject: data-department-work-guidelines:evolve
role: policy
state: canonical
relations:
  canonical_for: learning review and rule evolution
---
-->

# Practice and Evolution

**When to use:** A problem repeats, coaching or review is needed, a template,
tool, or rule is proposed, or an existing mechanism has become a burden. The aim
of learning is to find the next failure earlier, judge it more easily, and need
less manual rescue, not to increase the file count. Before admitting a rule,
template, tool, Agent workflow, or platform mechanism as department practice,
require an observed failure mode, a bounded trial, a responsible owner, and
evidence of net benefit.

## Admit Practices and Prevent Recurrence

Before admitting a practice, identify the observed failure it addresses.
Explain why the existing boundary, interface, and feedback are insufficient.
What risk and complexity would it reduce, and what cognitive and maintenance
cost would it add? How can it be tried on a small scale, and what
observation would justify keeping it? Who maintains it, when is it reviewed,
and what triggers revision or retirement?

An untested preference is not a department rule. Retire a rule that has lost its
subject, has no user, duplicates a source of truth, or costs more than it
returns.

Watch small changes without treating one anomaly as a trend: drifting
definitions, recurring questions, temporary human rescue, expired evidence,
ambiguous ownership, intermittent failures, and slight delays can be early
signals of a system defect. Check their pattern, impact, and direction before
building a remedy.

You must leave a reusable asset, even before a failure, whenever:

- A problem of the same kind recurs or affects more than one person, project, or
  work cycle.
- An important judgment depends on tacit knowledge held by one or a few people.
- Forgetting could cause material loss.
- Agents will repeat the work.

A reusable asset may be a test, monitor, checklist, decision record, example,
rule, platform capability, or clearer ownership interface. A task-specific
prevention asset need not become department practice; if it does, the admission
conditions above still apply. Choose the lightest form sufficient to prevent
the failure or its recurrence. Keep it findable, usable, and maintained
at its existing owner. Link to an existing authority rather than copying it.
For repeated or high-impact failures, distinguish containment, direct
correction, and prevention of recurrence.

## Grow Capability Through Real Work

At the start of a task, the responsible member and supervisor align on subject,
boundary, and success criteria. At important decisions, examine facts,
hypotheses, options, and risks. After delivery, choose the most consequential
gap in reasoning or expression and agree on an observable improvement for the
next task. Keep a few successful and failed examples with reasons. Move
gradually from guided execution to independent judgment, method-building, and
coaching. Coaching tests the member's reasoning without making the judgment for
them. Feedback names a proposition, evidence, behavior, and consequence; a
label such as “weak logic” gives no actionable direction.

Review evidence before judging delivery risk. At minimum, inspect problem
framing, the logical model, evidence and uncertainty, trade-offs, execution and
acceptance, oral and written communication, and delegation and verification of
Agents. Fluency, effort, or Agent efficiency cannot offset these hard risks:

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
boundaries](charter.md#four-non-negotiable-boundaries). Critical
responsibilities should be performed independently and reliably. Call a result
exceptional only when it produces evidenced net benefit, transfers a method,
reduces long-term complexity, and improves others' capacity. Exceptional
performance also shows the ability to detect weak structural signals. Not
every task needs an exceptional result; every task still owes its agreed
outcome and hard boundaries.

If scoring is used, define its levels, observable behavior, and purpose. A score
expresses delivery risk; it must not label a person or stand for their overall
worth. If a five-level review is used, keep its meaning stable:

| Level             | Observable delivery risk                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| 1: unacceptable   | The subject, facts, or responsibility are confused enough to invite a wrong action.              |
| 2: below standard | Useful fragments exist, but reasoning, evidence, or delivery has a material gap.                 |
| 3: borderline     | The work is usable with guidance, not yet reliable independently.                                |
| 4: meets standard | The work demonstrates independent bounded judgment, executable choices, and reliable acceptance. |
| 5: strong         | The result also leaves a transferable method or system improvement.                              |

## Observe the System Without Worshipping Numbers

Watch for rework from unclear goals or definitions, quality failures found
downstream, repeated incidents, late exposure of risk, reopened completion
claims, reasons decisions wait, handoff continuity, why Agent output was
returned, corrected, or out of bounds, growth from guided execution toward
independent judgment, and whether a new mechanism lowers total cost. For every
metric, first name the decision it supports, its fact source, period, boundary,
and how it could be gamed. No single metric may stand for a person's overall
worth, and no local metric may stand for the overall value of work or a system.
Investigate anomalies through cases and mechanisms; do not equate them directly
with individual performance.

## Cadence and Responsibilities

For every L1 or L2 task, align the subject and success condition at the start,
recheck facts, options, and authority at material decisions or changed risk,
verify at the end, and preserve a handoff when interrupted. Escalate high-risk
signals when observed; a calendar must not delay containment or a decision.

During active work, the department head or appointed guideline maintainer
should calibrate judgments against evidence weekly on one or two real work
samples, in about 30 minutes. Use an existing review or asynchronous exchange;
this adds no all-member meeting or report. A different interval needs a reason
and a time to revisit it.

At least monthly, the same owner examines accumulated weak signals: recurring
failures, escaped quality issues, Agent output corrections or misuse, and
needless coordination. Look for mechanism problems and decide which corrections
are needed; do not rank individuals. Sample calibration aligns judgment, while
this review examines how the working system succeeds or fails.

At least quarterly, the guideline maintainer and the people who use those
practices review the net benefit of current rules, templates, tools, and Agent
practices, and assess capability gaps. Keep, revise, or retire practices
accordingly. L2 work may set a shorter task-specific interval at authorization.

Use existing meetings, tickets, and reviews; record each material decision and
its owner there. Do not create a form or meeting unless existing carriers cannot
hold the necessary review. No routine “nothing happened” activity report is
required.

Managers clarify direction, priorities, decision boundaries, and resources. They
resolve cross-domain conflicts and long-standing open decisions in time for work
to proceed. They ensure that results, anomalies, and actual-use effects return
promptly to the responsible owner. They show how they judge and communicate
through concrete work examples, not only abstract requirements. They protect
people who honestly expose problems and must not penalize honest uncertainty or
make one person's repeated rescue the department's normal way of operating. They
must not use these guidelines for retrospective fault-finding, ceremonial
review, or micromanagement.

When goals conflict, priorities drift, resources are short, decisions stall, or
interfaces mislead, repair the management system before blaming a member's
capability. Within the stated decision boundaries, the responsible person
closest to the facts chooses the method, tools, and implementation path; the
charter's hard boundaries still apply.

Members own end-to-end results in their remit and disclose unknowns, risks,
dependencies, and failures without waiting to be asked. Guideline maintainers
gather real cases, conflicts, and signs of obsolescence, and state the reason,
evidence, effective time, and scope for each addition or deletion. Do not add
rules to mask goal, organizational, or system-design defects.

## Emergencies and Exceptions

When a data error, production failure, or permission or compliance breach
threatens data, production, downstream use, or compliance, whoever discovers it
takes containment steps within their existing authority and notifies the
responsible data or production owner.
The person responsible for the affected work, usually the task lead, owns the
response and follow-through. Preserve the inputs and versions needed to
establish the impact and verify a correction. If the response needs further
permission, escalate to the decision owner.
The [hard boundaries](charter.md#four-non-negotiable-boundaries) still apply:
report known facts and uncertainty honestly, keep responsibility explicit, and
observe permission and compliance limits. Urgency does not make an uncertain
result reliable or grant authority to act.

Contain the impact before completing the record when recording first would
delay the response. Record who decided what, the facts and authority they
used, the measure's expiry, takeover owner, and rollback condition. Once risk
is controlled, verify the correction on affected data and dependent uses,
complete the record, and review the cause. Repeated emergency exceptions of
the same kind must be handled as a mechanism problem.

Specific rule changes still follow
[repository governance](governance/ethos.md). Team adoption must be shown
through real work, not inferred from publication.
