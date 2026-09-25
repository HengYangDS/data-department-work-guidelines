---
subject: data-department-work-guidelines:deliver
role: policy
state: canonical
relations:
  canonical_for: execution validation and completion claims
---

# Execution and Delivery

**When to use:** Before acting, reporting progress, accepting work, or claiming
completion. Make the commitment, owner, and completion condition visible first.
The form may shrink with risk; the chain of trust may not skip a link.

> Authorized person and subject → commitment and boundary → bounded action →
> current evidence → bounded claim → acceptance and learning.

This is a chain of judgment, not six mandatory documents. Low-risk, local,
reversible work may close in one exchange. Cross-role or uncertain work uses an
existing work carrier. Production, sensitive data, destructive changes, security
or compliance, and external commitments require explicit authorization, a
recovery path, independent review, and human acceptance.

## Before Acting

| Question                         | Minimum answer                                                                |
| -------------------------------- | ----------------------------------------------------------------------------- |
| What is being done, and why now? | Target, success criteria, scope, and non-goals.                               |
| Who is responsible?              | Lead, collaborators, authorized decision owner, and acceptor.                 |
| How will it proceed?             | Critical path, dependencies, resources, deadline, and observable checkpoints. |
| What if it goes wrong?           | Triggers to pause, degrade, roll back, or hand control to a person.           |

Check the actual target location, current state, concurrent work, and recovery
path before making a change. Surface critical-path blockers promptly; activity
volume and “active progress” are not state changes. If scope or risk materially
changes, return to the authorized decision owner.

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

## Evidence Sets the Limit of the Claim

Every completion claim must answer: **What is claimed, about which subject and
version, verified when, by whom, using what method, covering what, and leaving
what unproved?** Evidence must be current, reviewable, and matched to the
claim's scope. When evidence is missing, narrow the claim rather than enlarge
the language.

| What was observed                                | What it does not establish by itself                           |
| ------------------------------------------------ | -------------------------------------------------------------- |
| A draft exists, a command runs, or a test passes | Review, overall correctness, or acceptance.                    |
| A sample or rehearsal passes                     | Complete correctness or actual execution.                      |
| A local environment passes                       | A remote, production, or hosted environment passes.            |
| A change is merged or published                  | It took effect, was adopted, or produced the intended outcome. |
| An Agent reports completion                      | A member verified and accepted responsibility for the result.  |

Put the deliverable at the agreed location; satisfy each completion criterion;
name risks, limits, uncovered cases, and follow-up ownership. Work requiring
human acceptance is accepted by an authorized person. **Verified, accepted, and
published or effective are distinct states.** Do not call “in progress” “mostly
complete,” or promote verification to publication.

For high-impact or repeated work, leave the necessary decision, test, monitor,
rule, or recovery path in the existing system of responsibility so the next
occurrence is found earlier and judged more easily. Do not create an unconsumed
evidence directory or report to prove effort. For data delivery, see
[data quality and adoption](data.md); for this repository's source lifecycle,
see [repository governance](governance/ethos.md).
