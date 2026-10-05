<!--
---
subject: data-department-work-guidelines:deliver
role: policy
state: canonical
relations:
  canonical_for: execution validation and completion claims
---
-->

# Execution and Delivery

**When to use:** Before acting, reporting progress, accepting work, or claiming
completion. Make the commitment, owner, and completion condition visible first.
The form may shrink with risk; the chain of trust may not skip a link. Pause the
affected action and escalate when authority, the target, or critical facts are
missing.

> Authorized person and subject → commitment and boundary → bounded action →
> current evidence → bounded claim → acceptance and learning.

These duties can share one work record; each step does not need its own
document. Low-risk, local, reversible work may close in one exchange. For
L1 and L2 work, use a reviewable record in the existing ticket, review, or
project document under the [charter's risk levels](charter.md#form-follows-risk).
High-risk work also follows the charter's
[L2 minimum](charter.md#form-follows-risk):
a written decision, explicit authorization, a rollback or degradation path,
independent review, and human acceptance.

## Before Acting

| Question                         | Minimum answer                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------ |
| What is being done, and why now? | Deliverable, purpose, target, success criteria, scope, and non-goals.          |
| Who is responsible?              | Task lead, collaborators, authorized decision owner, and acceptor.             |
| How will it proceed?             | Critical path, dependencies, milestones, deadline, and observable checkpoints. |
| What will it take?               | Resources, costs, and constraints.                                             |
| What if it goes wrong?           | Triggers to pause, degrade, roll back, or hand control to a person.            |

Check the actual target location, current state, concurrent work, and recovery
path before making a change. Expose critical-path blockers when observed; do
not wait for dependent work to fail. Activity volume and “active progress” are
not state changes. If scope or risk materially changes, return to the authorized
decision owner. Record the change and the decision that resolves it in the
existing work record so collaborators work from the same commitment.

## Name the State, Not the Effort

| State                  | What it permits you to say                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Unframed               | The problem, scope, or completion condition is still missing.                                     |
| Planned                | A route and owner exist; execution has not happened.                                              |
| Executing              | Work is under way; the result has not passed verification.                                        |
| Blocked                | A prerequisite prevents the affected action; name the gap and escalation.                         |
| Awaiting verification  | The deliverable exists, but the agreed checks have not passed.                                    |
| Verified               | Checks passed for a stated subject, version, environment, and limit.                              |
| Accepted               | An authorized acceptor confirmed the agreed result.                                               |
| Published or effective | The result reached the target environment or entered use; verify this separately from acceptance. |

Do not rename “executing” as “almost done,” or infer publication from
verification. A blocked task can contain useful work; the blocked claim remains
blocked until its prerequisite changes.
Continue independent, authorized work that does not depend on that prerequisite.

## Evidence Sets the Limit of the Claim

Every completion claim must answer: **What is claimed, about which subject and
version, verified when, by whom, using what method, covering what, and leaving
what unproved?** Evidence must be current, reviewable, and matched to the
claim's scope. When evidence is missing, narrow the claim rather than enlarge
the language.

| What was observed                                | What it does not establish by itself                             |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| A draft exists, a command runs, or a test passes | Review, overall correctness, or acceptance.                      |
| A sample or rehearsal passes                     | Complete correctness or actual execution.                        |
| A dry-run succeeds                               | The actual action occurred.                                      |
| A content digest matches                         | The content is semantically correct or fit for its intended use. |
| A local environment passes                       | A remote, production, or hosted environment passes.              |
| A change is merged                               | It was published at the agreed destination.                      |
| A revision is published                          | It took effect, was adopted, or produced the intended outcome.   |
| An Agent reports completion                      | A member verified and accepted responsibility for the result.    |

Say “complete” only when all conditions hold: the deliverable is at the agreed
location; every completion criterion is satisfied; current verification
matching the claim has run and passed; risks, limits, uncovered cases, and
follow-up ownership are recorded; and the agreed lifecycle state is reached.
When human acceptance is required, an authorized person must have accepted
the result. A nearby state or a planned check does not satisfy this gate.

For L1 and L2 work, leave the material decision, actual result, limits, and
remaining owner in the existing work record. Without a reviewable record, do
not say the organization has learned from the work. Before calling high-impact
or repeated work complete, leave the necessary test, monitor, rule, or recovery
path in the existing system of responsibility so the next occurrence is found
earlier and judged more easily. Do not create an unconsumed evidence
directory or report to prove effort. For data delivery, see
[data quality and adoption](data.md); for this repository's source lifecycle,
see [repository governance](governance/ethos.md).
