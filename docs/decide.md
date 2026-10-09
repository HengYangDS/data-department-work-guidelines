<!--
---
subject: data-department-work-guidelines:decide
role: policy
state: canonical
relations:
  canonical_for: problem framing analysis and decisions
---
-->

# Analysis and Decisions

**When to use:** The task is unclear, an anomaly needs explanation, or a choice
must be made.

Identify the decision the analysis must support before choosing
its depth. Do not begin by filling a template or collecting material. If the
decision owner or subject is unknown, pause the affected action; test a proposed
answer against shared criteria, counterexamples, and stated limits.

## Frame the Right Problem

In the existing ticket, discussion, or proposal, answer:

- **Decision:** Who must decide what, and by when?
- **Problem:** What is the subject, who is affected, and what are the present
  state, comparison baseline, target, success criteria, non-goals, and
  constraints?
- **Knowledge:** Which facts are known, and which unknowns matter?
- **Ownership:** Who owns the work, who has authority to decide, and who
  accepts it?

A low-risk matter may need one conversation; L1 and L2 work needs a reviewable
record under the [charter's risk levels](charter.md#form-follows-risk).

Name the time, cost, compliance, technical, and resource constraints. A target
without those limits is not an executable commitment.

If the subject, authority, or irreversible consequences are unclear, stop the
affected action and ask an authorized person to decide. **Collecting information
is not the goal; explain which judgment it could change.**

For important work, make six boundaries explicit:

- **Subject:** The system, data, people, or decision.
- **Scope:** What is in and out.
- **Time:** Fact cutoff and period of validity.
- **Responsibility:** Task lead, decision owner, reviewer, acceptor, and those
  to inform.
- **Evidence:** What it does and does not establish.
- **Action:** What is authorized and what requires escalation.

An attractive solution to an unnamed subject is not yet a proposal.

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

1. Define the central concepts and subjects. Keep one meaning for each concept
   within the same discussion, then identify causal, dependency, constraint, and
   feedback relationships. Choose a useful way to divide the problem and explain
   how the parts connect to the decision. Show material gaps, shared causes, and
   cross-cutting constraints; do not force interacting parts into non-overlapping
   boxes or count the same effect twice. A long list or polished prose cannot
   substitute for that model.
2. Attach source and time to important facts; state how each unknown affects the
   decision. Separate observation from explanation.
3. Offer falsifiable hypotheses. Check counterexamples, the baseline, and the
   option of not acting. Prefer the smallest experiment that distinguishes
   plausible explanations. Rank candidates by explanatory power, likelihood
   under the known facts, and the cost of a decisive test. An easy test does not
   make a weak explanation more likely.
4. Give a bounded conclusion: what the evidence supports, your confidence and
   limits, what remains possible, the next verification action, and what later
   observation would change the judgment.

### Diagnose a Failure and Its Prevention Gap

For an incident, anomaly, delay, quality problem, or recurring dispute, preserve
the original symptom and timeline, including changes before it began;
distinguish affected from unaffected subjects,
and explain both the direct cause and **why the existing system did not prevent
or detect it in time**. Address immediate containment, direct repair, and
prevention of recurrence as distinct layers. Choose the lightest prevention
measure sufficient for the risk. Completing only the first two is not a systemic
fix.

Reproduce the original symptom with recorded inputs and conditions when it is
safe to do so. If reproduction is unsafe or unavailable, define an observation
or sampling plan that could distinguish the leading hypotheses. After a repair,
check the original symptom, adjacent paths, and unintended side effects; name
what was not exercised. In review, distinguish judgments that helped from those
that failed, and explain why; a fix without changed judgment invites recurrence.

### Check the Reasoning

Check the reasoning for correlation presented as causation, a case presented
as a population, a necessary condition treated as sufficient, a later outcome
used to infer a unique earlier cause, selective search for supporting
evidence, criteria changed midstream, and an appeal to common sense,
experience, or “best practice” without checking its applicable boundary.

## Make the Choice Comparable and Actionable

For one decision, include feasible options, including the status quo. Compare
them on the same basis: benefit, cost, risk, reversibility, and opportunity
cost. Prefer an option that solves the framed problem, removes the main
failure mode, and operates within current boundaries and resources. It should
be verifiable, observable, and recoverable, reduce total maintenance and
reliance on individual memory, repeated coordination, and manual rescue, and
have clear exit and replacement conditions. Novelty, completeness, or
popularity does not establish suitability. A recommendation states its
premises, strongest objection, first step if chosen, and revisit trigger. The
authorized person decides; a long analysis cannot stand in for authorization.

### Record the Choice and Next Action

Once a choice is made, use the [decision-document order](communicate.md#write-for-fidelity-clarity-and-elegance)
and record what was decided, by whom, on what date, and why, with its revisit
trigger in the existing work record. Record the first action,
its owner, and its completion condition there too. A deadline says when a
decision is needed; it does not establish when approval occurred.

When a proposal cannot yet proceed, distinguish its decision readiness from the
state of execution:

| State    | Say and do                                                                                |
| -------- | ----------------------------------------------------------------------------------------- |
| Ready    | Ready for the authorized owner's decision, not approved or accepted.                      |
| Blocked  | Name the unacceptable gap, owner, and condition for release.                              |
| Deferred | Name the missing information or timing condition, how to resolve it, and when to revisit. |

“Agreed in principle,” “keep looking,” and “continue progressing” are not
decisions. Correct a conclusion when new facts overturn it rather than
protecting sunk costs or earlier wording. Once action begins, use
[execution and delivery](deliver.md) for dependencies, verification, and
completion claims.
