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
less manual rescue—not to increase the file count. Do not adopt a new rule
without an observed failure, a bounded trial, a responsible owner, and evidence
of net benefit.

## Start with a Real Failure Mode

Before adding a mechanism, answer: What failure was observed? Why were the
existing boundary and feedback insufficient? What risk would the new method
reduce, and what cognitive and maintenance cost would it add? How can it be
tried on a small scale? What observation would justify keeping it? Who maintains
it, when is it reviewed, and what signal triggers revision or retirement? An
untested preference is not a department rule. Retire a rule that has lost its
subject, has no user, duplicates a source of truth, or costs more than it
returns.

Watch small changes without treating one anomaly as a trend: drifting
definitions, recurring questions, temporary human rescue, expired evidence,
ambiguous ownership, intermittent failures, and slight delays can be early
signals of a system defect. Check their pattern, impact, and direction before
building a remedy. A problem that recurs, crosses people or projects, spans work
cycles, depends on one person's tacit knowledge, could cause material loss if
forgotten, or will be repeated by Agents needs a reusable prevention mechanism.
Choose its lightest effective owner rather than another report.

A reusable asset may be a test, monitor, checklist, decision record, example,
rule, platform capability, or clearer ownership interface. Choose the lightest
option that can be found, used, and maintained. Link to an existing authority
rather than copying it. For repeated or high-impact failures, distinguish
containment, direct correction, and prevention of recurrence.

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

If scoring is used, define its levels, observable behavior, and purpose. A score
expresses delivery risk; it must not label a person or stand for their overall
worth.

Every task must meet the hard boundaries. Critical responsibilities should be
performed independently and reliably. Call a result exceptional only when it
produces evidenced net benefit, transfers a method, reduces long-term
complexity, and improves others' capacity.

If a five-level review is used, keep its meaning stable:

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

For every L1 or L2 task, align the subject and success condition at the start,
recheck facts, options, and authority at material decisions or changed risk,
verify at the end, and preserve a handoff when interrupted. Escalate high-risk
signals when observed; a calendar must not delay containment or a decision.

At least monthly, the department head or an appointed guideline maintainer
examines a real work sample and accumulated weak signals: recurring failures,
escaped quality issues, Agent output corrections or misuse, and needless
coordination. This review must not rank individuals. Use it to calibrate how the
team judges evidence, find mechanism problems, and
decide whether a small correction is needed.
At least quarterly, the guideline maintainer and users review the net benefit
of current rules, templates, tools, and Agent practices, and assess capability
gaps. Keep, revise, or retire practices accordingly. L2 work may set a shorter
task-specific interval at authorization.

Use existing meetings, tickets, and reviews; record each material decision and
its owner there. Do not create a form or meeting unless existing carriers cannot
hold the necessary review. No routine “nothing happened” activity report is
required.

Managers clarify direction, priorities, resources, and cross-domain decisions,
resolve long-standing open decisions in time for the work to proceed, and show
their reasoning with concrete work examples. They protect people who honestly
expose problems and must not penalize honest uncertainty or make one person's
repeated rescue the department's normal way of operating. They must not use
these guidelines for retrospective fault-finding, ceremonial review, or
micromanagement. When goals conflict,
priorities drift, resources are short, decisions stall, or interfaces mislead,
repair the management system before blaming a member's capability. Within those
boundaries, the person closest to the facts chooses the method; management
should not dictate every step.

Members own end-to-end results in their remit and disclose unknowns, risks,
dependencies, and failures without waiting to be asked. Guideline maintainers
gather conflicts and signs of obsolescence, and state the reason, evidence,
effective time, and scope for each addition or deletion.

In an emergency, protect people, data, production, and compliance first. Contain
harm before filling in the record if needed; truth, authority, and
responsibility remain binding. Record the temporary decision, who made it,
on which facts and authority, its expiry, takeover owner, and rollback condition.
Complete verification and review once risk is controlled. Repeated “emergency
exceptions” are a system problem.

Specific rule changes still follow
[repository governance](governance/ethos.md). Team adoption must be shown
through real work, not inferred from publication.
