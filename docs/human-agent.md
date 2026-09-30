<!--
---
subject: data-department-work-guidelines:human-agent
role: policy
state: canonical
relations:
  canonical_for: human agent delegation verification and responsibility
---
-->

# Human–AI Collaboration

**When to use:** When a member delegates search, analysis, drafting, changes,
tests, or review to an Agent. People set direction and authority; intelligence
extends capacity. Verify the facts. Decisions and consequences remain human
responsibilities. An Agent is an executing or reasoning entity, not a source of
organizational authorization. Stop when the target, fact source, or permission
cannot be established; a person checks the actual work and evidence before
accepting an Agent's result.

## Delegate a Boundary, Not a Pile of Context

A consequential delegation states the goal and decision it supports, current
authorities and fact sources, subject and scope, non-goals, deliverable and
audience, time, security, compatibility, and cost constraints, permissions and
forbidden actions, acceptance method, checkpoints, stop conditions, and
interruption handoff. A low-risk task can be stated
briefly. A high-risk one names the owner, recovery path, and who approves
irreversible actions.

If missing context does not affect direction or safety, the Agent may continue
with stated assumptions. If the target, fact source, authority, or irreversible
consequence cannot be established, stop and ask. “Finish this for me” is not an
authorization boundary.

> **Illustrative delegation:** “Compare the vendor's earlier and revised price
> snapshots for the stated research cutoff. Work read-only. Report the source
> and observation time of each value, the differences, and what cannot be
> verified. Stop if the earlier snapshot is missing or a production write would
> be needed; do not approve the data for use.”

| Role             | May do                                                        | Responsibility that remains                                         |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| Task lead        | Clarify the goal and boundary; coordinate work and decisions. | End-to-end result, risk, and escalation.                            |
| Executing member | Decompose, delegate, integrate, and verify.                   | Understand and check Agent output before submission.                |
| Agent            | Search, reason, draft, implement, test, and present options.  | Must not grant itself authority or promise consequences for people. |
| Reviewer         | Independently check facts, changes, and evidence.             | State findings and limits; review alone does not authorize action.  |
| Acceptor         | Confirm agreed completion when authorized.                    | Make the acceptance decision; do not rely on the Agent's account.   |

A task lead may also decide or accept when authorized. The lead's title alone
grants neither power.

**The person who calls an Agent owns its context, permissions, verification, and
result.**

Submitting Agent-assisted work means the member has understood and checked the
result and accepts responsibility for its consequences. Delegation transfers
work, not that duty.

## Execute and Verify

An Agent first confirms the task, target root, current state, and applicable
local rules, then restates the goal, scope, non-goals, and completion condition.
It distinguishes fact, hypothesis, inference, judgment, decision,
and action; loads only relevant material; and advances in reversible, verifiable
steps within its authority. Before writing, it checks the target, concurrent
work, and recovery path. Its output leads with the conclusion and evidence, then
limits and next steps.

Agent memory, summaries, guesses, and generated content are candidate material.
Check a source against the original, version, time, and applicable scope, and
check whether the inputs are complete enough for the decision. Keep the command,
target, exit status, and decisive output with the producing task;
inspect them before relying on the result. Test or review code, analysis, and
documents in proportion to risk. A person must not
rely solely on an Agent's prose summary: compare changed paths and content
with the reported scope; inspect missing counterexamples, the current
environment, uncovered cases, and high-risk authorization.
Even checked Agent output becomes a durable team fact only when its underlying
source and limits are recorded in the relevant authoritative carrier.

Use multiple Agents in parallel only when independent questions, paths, or
review angles can be separated. Default parallel work to independent read-only
research, review, or cross-checking. Give each subtask explicit inputs, outputs,
scope, stop conditions, and ownership. Name an integration owner and avoid
uncoordinated edits to the same source of truth or worktree. A majority opinion
is not evidence; resolve disagreement against facts and criteria. Do not
overwrite or clean up work of unknown ownership.

## Stop and Handoff

Stop the affected action and escalate when instructions materially conflict; the
target or fact source cannot be identified; authority is insufficient; an action
is irreversible without authorization or recovery; someone else's unrecognized
work appears; verification contradicts expectation; evidence has expired; or
continuing would hide a failure, pollute a source of truth, or enlarge harm.
Stopping is not failure. Continuing with a guess presented as fact is loss of
control.

A completion report states the outcome (complete, partial, blocked, or
deferred), target and version, actual changes, verification method, result,
execution time and environment, and where the evidence can be inspected. Name
risks, limits, assumptions, unresolved questions, and any acceptance still
needed. State what remains incomplete and why; distinguish a missing dependency
from work that has not been attempted. End with
the next responsible person, action, and due time; do not write only “follow
up.” On interruption, preserve state, uncommitted work, attempts and failures,
the recovery entry, and retries known to be ineffective. Repository Agents also
start at the
[Agent entry](../AGENTS.md); a method pack is not governance authority.
