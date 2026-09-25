---
subject: data-department-work-guidelines:decide
role: policy
state: canonical
relations:
  canonical_for: problem framing analysis and decisions
---

# Analysis and Decisions

**When to use:** The task is unclear, an anomaly needs explanation, or a choice
must be made. Decide which decision the analysis must support before choosing
its depth. Do not begin by filling a template or collecting material.

## Frame the Right Problem

In the existing ticket, discussion, or proposal, answer: Who must decide what,
and by when? What is the subject, who is affected, and what are the present
state, target, non-goals, and constraints? Which facts are known, and which
unknowns matter? Who owns the work, who has authority to decide, and who accepts
it? A low-risk matter may need one conversation; cross-person or high-risk work
needs a reviewable record.

If the subject, authority, or irreversible consequences are unclear, stop the
affected action and ask an authorized person to decide. **Collecting information
is not the goal; explain which judgment it could change.**

Make six boundaries explicit when they matter: **object** (the system, data,
people, or decision), **scope** (in and out), **time** (fact cutoff and period
of validity), **responsibility** (lead, decision maker, reviewer, and those to
inform), **evidence** (what it does and does not establish), and **action**
(what is authorized and what requires escalation). An attractive solution to
an unnamed subject is not yet a proposal.

## Keep Six Meanings Distinct

| Statement  | Question it answers                         | State with it                                     |
| ---------- | ------------------------------------------- | ------------------------------------------------- |
| Fact       | What was observed?                          | Source, subject, time, and scope.                 |
| Hypothesis | What explanation remains untested?          | What observation could refute it.                 |
| Inference  | What follows from which facts and premises? | Reasoning and alternative explanations.           |
| Judgment   | How is the result evaluated?                | Criterion, confidence, and limits.                |
| Decision   | What did the authorized person choose?      | Decision owner, trade-off, and revisit condition. |
| Action     | Who will do what?                           | Owner, deadline, and completion condition.        |

A retelling, cache, Agent analysis, or “this is usually true” may provide a
lead; it does not become a fact without verification. If the subject,
definition, comparison criterion, or time cutoff changes during discussion, say
so explicitly.

## Use the Smallest Sufficient Model

1. Define the central concepts and subjects, then their causal, dependency,
   constraint, and feedback relationships. Divide along one consistent axis, not
   for visual neatness.
2. Attach source and time to important facts; state how each unknown affects the
   decision. Separate observation from explanation.
3. Offer falsifiable hypotheses. Check counterexamples, the baseline, and the
   option of not acting. Prefer the smallest experiment that distinguishes
   plausible explanations.
4. Give a bounded conclusion: what the evidence supports, what remains possible,
   and what later observation would change the judgment.

For an anomaly or repeated failure, preserve the original symptom and timeline,
distinguish affected from unaffected subjects, and explain both the direct cause
and **why the existing system did not prevent or detect it in time**. Separate
immediate containment, direct repair, and prevention of recurrence. Completing
only the first two is not a systemic fix.

Reproduce the original symptom with recorded inputs and conditions when it is
safe to do so. If reproduction is unsafe or unavailable, define an observation
or sampling plan that could distinguish the leading hypotheses. After a repair,
check the original symptom, adjacent paths, and unintended side effects; name
what was not exercised.

Watch for correlation presented as causation, a case presented as a population,
a necessary condition treated as sufficient, a later outcome used to infer a
unique earlier cause, selective search for supporting evidence, and criteria
changed midstream.

## Make the Choice Comparable and Actionable

For one decision, include feasible options, including the status quo. Compare
them on the same basis: benefit, cost, risk, reversibility, and opportunity
cost. A recommendation states its premises, strongest objection, first step if
chosen, and revisit trigger. The authorized person decides; a long analysis
cannot stand in for authorization.

| State    | Say and do                                                           |
| -------- | -------------------------------------------------------------------- |
| Ready    | Premises hold; record the decision and first step.                   |
| Blocked  | Name the unacceptable gap, owner, and condition for release.         |
| Deferred | Name the missing information, how to obtain it, and when to revisit. |

“Agreed in principle,” “keep looking,” and “continue progressing” are not
decisions. Correct a conclusion when new facts overturn it rather than
protecting sunk costs or earlier wording. Once action begins, use
[execution and delivery](deliver.md) for dependencies, verification, and
completion claims.
