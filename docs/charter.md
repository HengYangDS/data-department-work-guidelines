<!--
---
subject: data-department-work-guidelines:charter
role: policy
state: canonical
relations:
  canonical_for: purpose authority and non-negotiable work boundaries
---
-->

# Data Department Work Guidelines: Charter

> **Guideline edition:** v7.1.0
>
> This label alone does not establish released content. Working branches may
> include [Unreleased changes](../CHANGELOG.md#unreleased); use the signed tag
> for the exact release.
>
> **Applies to:** Data Department members and Agents acting under their
> delegation.
>
> **Accountability:** The department head owns these guidelines and may appoint
> maintainers to organize calibration and revisions. A task lead, authorized
> decision owner, and acceptor may be the same person when policy permits;
> do not infer one role's authority from another.

## Purpose

Start here when the question is who may decide, which facts may be trusted, or
which boundary must hold. Pause when the subject, authority, or consequence is
unclear; use [execution and delivery](deliver.md) to verify a later result.

The value of data work is not a file acquired, a table produced, a report
written, or a process started. This guideline is a work-quality contract against
four failures: disordered reasoning that confuses facts with choices; quick
fixes that leave the underlying mechanism untouched; communication that leaves
no one able to decide or act; and AI that produces more material without making
judgment or outcomes more reliable.

A task should resolve the problem, test the judgment and its limits, and leave
the system better able to recognize or handle the next occurrence. These are
three distinct outcomes, not three required reports. Data work converts
real-world signals into reliable judgments, data assets, and actions. A result
belongs in a lasting work system only when its source and time can be
identified, its meaning explained, its conditions checked, its use bounded, and
its accountable owner found.

Understand the situation and reason from evidence. Use the minimum structure
needed for a sound decision and a reliable result, without forcing reality
into a single model. Revise it when the evidence changes. Names, tools, and
models do not define reality. Old approaches, documents, and sunk costs do not
outrank new facts.

## Two Kinds of Authority

**Authority to act** answers who may decide what to do. Law, regulation,
security requirements, and mandatory company policy come first. Within those
boundaries, use the explicit decision of the authorized owner for the current
matter, then effective contracts, policies, specifications, and decision
records, then work plans, provisional agreements, and personal preferences.
Projects may clarify this order. Clarifying it does not grant waiver authority;
establish the authority to waive an obligation and resolve any conflict before
acting.
An Agent, tool, or repository file cannot grant organizational authority to
itself.

**Authority about facts** answers what can establish what is true. Prefer
primary records and repeatable observations with a source, time, subject, and
scope. Analysis and formal records must trace back to their original basis.
Secondhand accounts, caches, generated views, Agent output, and memory are
leads, not verified facts. Authority to act cannot make a false fact true;
factual evidence does not itself grant permission to act.
If an authorized request conflicts with verified facts, report the conflict
and its impact. Do not alter the record or silently act as if either authority
had resolved the other.

Project rules may refine sources of truth, permissions, and acceptance. They
should link to these guidelines rather than restate shared rules. If they
conflict with these guidelines or a higher constraint, expose the conflict and
its impact for an authorized decision. Do not guess or silently choose the
convenient rule.

## Four Non-Negotiable Boundaries

| Boundary                      | What it means                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Tell the truth                | Do not fabricate, hide, or selectively present facts, or dress uncertainty as certainty.                                      |
| Stay in bounds                | Do not cross the applicable subject, time, professional competence, permission, data, security, compliance, or action limits. |
| Name the owner                | Important judgments, decisions, changes, and acceptances have an accountable person.                                          |
| Do not claim false completion | Do not claim a result is complete, correct, usable, or adopted without current evidence matching that claim.                  |

Within these boundaries, autonomy, exploration, and creative work are welcome.
When a boundary would be crossed, stop, make it visible, and escalate. If a
breach has occurred, stop the affected action, disclose it, correct it within
your authority, and escalate according to risk.

Professional judgment belongs with people who have relevant competence and
access to the facts. Bring in the appropriate domain owner when either is
missing; expertise does not itself grant authority to decide or act.

## Form Follows Risk

The same rule words bind members and their Agents unless a rule names a narrower
subject. **Must** and **must not** mark a hard boundary; **should** is the
default unless a reason for departure is given; **may** leaves a choice to the
responsible person. Risk determines the form, not whether the underlying duty
exists.

| Level         | When it applies                                                                                                               | Minimum response                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| L0: light     | Local, reversible work without an external commitment.                                                                        | State the conclusion, basis, and action in one clear exchange.                                                                  |
| L1: standard  | Cross-role or extended work, competing options, or material uncertainty.                                                      | Record the problem, options, execution path, and acceptance in the existing work record.                                        |
| L2: high risk | Production, funds, sensitive data, security or compliance, deletion or overwrite, irreversibility, or an external commitment. | Obtain a written decision and explicit authorization, a rollback or degradation path, independent review, and human acceptance. |

For urgent containment, follow [emergencies and exceptions](evolve.md#emergencies-and-exceptions).

Do not call a task L0 merely to avoid a necessary record. Within every level,
facts, scope, ownership, evidence, and acceptance must remain clear. For a
cross-domain task, name accountable ownership and the professional interfaces:
what each side needs and what evidence accompanies delivery. Interfaces may be
shared; end-to-end responsibility must not dissolve into “everyone.”
Accountability remains mandatory. The
[data topic](data.md#ownership-and-change-boundaries) owns the default lead
arrangement for cross-domain work.

Keep a concept, role, process, tool, or document only for an irreplaceable
obligation; otherwise merge it with its owner or remove it. Use the
[practice-admission test](evolve.md#start-with-a-real-failure-mode) before making
a method a department rule. Prefer one clear interface or automatic check to
recurring meetings and reminders when they control the same risk. Do not build
a large platform for a low-risk, occasional problem.

## From Principle to Action

- For a judgment, use [analysis and decisions](decide.md) to separate
  observation, interpretation, choice, and authorization.
- For a result, use [execution and delivery](deliver.md) to bind the completion
  claim to evidence.
- For data use or production, use [data quality and adoption](data.md) to
  examine source, meaning, time, quality, and permission.
- For conveying judgment, use [communication](communicate.md): first be
  faithful, then clear, then elegant.
- For intelligent tools, use [human–AI collaboration](human-agent.md) to extend
  capability without transferring human responsibility.
- For team practices, use [practice and evolution](evolve.md) to judge net
  benefit from real cases.

Rules serve judgment. Forms, diagrams, meeting counts, and tool runs do not
replace outcomes. An available reading path proves neither that members have
adopted these guidelines nor that department quality has improved.
