---
subject: data-department-work-guidelines:decide
role: policy
state: canonical
relations:
  canonical_for: problem framing analysis and decisions
---

# Analysis and Decisions

**When to use:** The task is unclear, an anomaly needs explanation, or a choice
must be made.

You should identify the decision the analysis must support before choosing its
depth. If the decision owner or subject is unknown, you must follow the [stop
rule](charter.md#purpose); you should test a proposed answer against shared
criteria, counterexamples, and stated limits.

For an unclear task, [frame the problem](#frame-the-right-problem). For an
anomaly or failed result, [diagnose the cause and prevention
gap](#diagnose-a-failure-and-its-prevention-gap). For a clear choice,
[compare options](#make-the-choice-comparable-and-actionable).
[Record the choice and next action](#record-the-choice-and-next-action) after
an authorized decision.

## Frame the Right Problem

In the existing ticket, discussion, or proposal, you must answer:

- **Decision:** Who must decide what, and by when?
- **Problem:** What is the subject, who is affected, and what are the present
  state, comparison baseline, target, success criteria, non-goals, and
  constraints?
- **Knowledge:** Which facts are known, and which unknowns matter?
- **Ownership:** Who owns the work, who has authority to decide, and who
  accepts it?

A low-risk matter may need one conversation; L1 and L2 work needs a reviewable
record under the [charter's risk levels](charter.md#form-follows-risk).

You must name the time, cost, compliance, technical, and resource constraints.

If the subject, authority, or consequences are unclear, you must follow the
[stop rule](charter.md#purpose). **Collecting information is not the goal; you
should explain which judgment it could change.**

For [L1 and L2 work](charter.md#form-follows-risk), you should make six
boundaries explicit:

- **Subject:** The system, data, people, or decision.
- **Scope:** What is in and out.
- **Time:** Fact cutoff and period of validity.
- **Responsibility:** Task lead, decision owner, reviewer, acceptor, and those
  to inform.
- **Evidence:** What it does and does not establish.
- **Action:** What is authorized and what requires escalation.

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
definition, comparison criterion, or time cutoff changes during discussion, you
must say so explicitly.

For example, a pipeline log records 4 timeouts in 12 runs of the same revision
in one test environment. This is an illustrative observation about those runs,
not the production failure rate. Upstream throttling is a hypothesis; compare
request and rate-limit timestamps before naming it as the cause. Judge release
readiness against the agreed completion conditions. Preserve the failed runs
when checking a repair; a later success does not erase them.

## Use the Smallest Sufficient Model

1. **Model the relationships.** You should define the central concepts and
   subjects. You must keep one meaning for each concept within the same
   discussion, then identify causal, dependency, constraint, and feedback
   relationships.

   You must use one consistent basis to divide the problem at each level. You
   must cover every part needed for the decision and explain how it connects to
   that decision. You must show material gaps, shared causes, and cross-cutting
   constraints; you must not force interacting parts into non-overlapping boxes
   or count the same effect twice. A long list or polished prose cannot
   substitute for that model.

2. **Bind the observations.** You should attach source and time to important
   facts; you should state how each unknown affects the decision. You should
   separate observation from explanation.
3. **Test the hypotheses.** You should offer falsifiable hypotheses. You should
   check counterexamples, the baseline, and the option of not acting. You should
   prefer the smallest experiment that distinguishes plausible explanations.

   You should rank candidates by explanatory power, likelihood under the known
   facts, and the cost of a decisive test.

4. **Bound the conclusion.** You must give a bounded conclusion: what the
   evidence supports, your confidence and limits, what remains possible, the
   next verification action, and what later observation would change the
   judgment.

### Diagnose a Failure and Its Prevention Gap

For an incident, anomaly, delay, quality problem, or recurring dispute, you must
preserve the original symptom and timeline, including changes before it began;
you must distinguish affected from unaffected subjects, and explain both the
direct cause and **why the existing system did not prevent or detect it in
time**. You should address immediate containment, direct repair, and prevention
of recurrence as distinct layers. You must choose the lightest prevention
measure sufficient for the risk. Completing only the first two is not a systemic
fix.

You must reproduce the original symptom with recorded inputs and conditions when
it is safe to do so. If reproduction is unsafe or unavailable, you must define
an observation or sampling plan that could distinguish the leading hypotheses.
After a repair, you must check the original symptom, and should check adjacent
paths and unintended side effects; you must name what was not exercised. In
review, you should distinguish judgments that helped from those that failed, and
explain why; a fix without changed judgment invites recurrence.

### Check the Reasoning

You should check the reasoning for:

- Correlation presented as causation.
- A case presented as a population.
- A necessary condition treated as sufficient.
- A later outcome used to infer a unique earlier cause.
- Selective search for supporting evidence.
- Criteria changed midstream.
- An appeal to common sense, experience, or “best practice” without checking its
  applicable boundary.

## Make the Choice Comparable and Actionable

- **Compare options:** You should include feasible options, including the status
  quo. You should compare them on the same basis: benefit, cost, risk,
  reversibility, and opportunity cost.
- **Test the fit:** You should prefer an option that solves the framed problem,
  removes the main failure mode, and operates within current boundaries and
  resources. It should be verifiable, observable, and recoverable, reduce total
  maintenance and reliance on individual memory, repeated coordination, and
  manual rescue, and have clear exit and replacement conditions.
- **Recommend:** You should state the premises, strongest objection, first step
  if chosen, and revisit trigger.

The authorized person decides; a long analysis cannot stand in for authorization.

### Record the Choice and Next Action

Once a choice is made, you should use the [decision-document
order](communicate.md#structure-a-decision-document) and must record what was
decided, by whom, on what date, and why, with its revisit trigger in the
existing work record. You must record the first action, its owner, and its
completion condition there too. A deadline says when a decision is needed; it
does not establish when approval occurred.

### Decision Readiness

When a proposal cannot yet proceed, you should distinguish its decision
readiness from the state of execution:

| State    | Say and do                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------- |
| Ready    | Ready for the authorized owner's decision, not approved or accepted.                               |
| Blocked  | You must name the unacceptable gap, owner, and condition for release.                              |
| Deferred | You must name the missing information or timing condition, how to resolve it, and when to revisit. |

“Agreed in principle,” “keep looking,” and “continue progressing” are not
decisions. You must correct a conclusion when new facts overturn it rather than
protecting sunk costs or earlier wording. Once action begins, use [execution and
delivery](deliver.md) for dependencies, verification, and completion claims.
