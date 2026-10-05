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
organizational authorization. Stop when the target, fact source, responsible
person, or permission cannot be established; a person checks the actual work and
evidence before accepting an Agent's result.

## Delegate a Boundary, Not a Pile of Context

A consequential delegation states the goal and decision it supports, current
authorities and fact sources, subject and scope, non-goals, the deliverable's
format, destination, audience, and level of detail. It also names time,
security, compatibility, and cost constraints; permissions and forbidden
actions; acceptance, checkpoints, stop conditions, and interruption handoff. A
low-risk task can be stated briefly. A high-risk one names the owner, recovery
path, and who approves irreversible actions.

If missing context does not materially affect direction, safety, or authority,
the Agent should continue with reasonable stated assumptions. If the target,
fact source, responsible person, authority, or irreversible consequence cannot
be established, stop and ask. “Finish this for me” is not an authorization
boundary.

> **Illustrative delegation:** “Compare the vendor's earlier and revised price
> snapshots for the stated research cutoff. Work read-only. Report the source
> and observation time of each value, the differences, and what cannot be
> verified. Stop if the earlier snapshot is missing or a production write would
> be needed; do not approve the data for use.”

| Role             | May do                                                        | Responsibility that remains                                                            |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Task lead        | Clarify the goal and boundary; coordinate work and decisions. | Goal, boundary, risk, final judgment, end-to-end result, and escalation.               |
| Executing member | Decompose, delegate, integrate, and verify.                   | Understand and check Agent output before submission.                                   |
| Agent            | Search, reason, draft, implement, test, and present options.  | Must not grant itself organizational authority or make commitments on people's behalf. |
| Reviewer         | Independently check facts, changes, and evidence.             | State findings and limits; review alone does not authorize action.                     |
| Acceptor         | Confirm agreed completion when authorized.                    | Make the acceptance decision after examining the actual work.                          |

A task lead may also decide or accept when authorized. The lead's title alone
grants neither power.

Review and acceptance require examination of facts, reasoning, changes, and
evidence. The author's or Agent's own account must not substitute for that
examination; people retain responsibility for commitments and consequences.

**The person who calls an Agent owns its context, permissions, verification, and
result.**

Submitting Agent-assisted work means the member has understood and checked the
result and accepts responsibility for its consequences. Delegation transfers
work, not that duty.

## Execute and Verify

An Agent first confirms the task, target root, current state, responsible person,
and applicable local rules, then restates the goal, scope, non-goals, and
completion condition.
It distinguishes fact, hypothesis, inference, judgment, decision, and action;
loads only relevant material; and advances in reversible, verifiable steps
within its authority and agreed scope, without incidental changes. Before
writing, it checks the target, concurrent work, and
recovery path. Its output leads with the conclusion and evidence, then limits
and next steps.

Agent memory, summaries, guesses, and generated content are candidate material.
Check a source against the original, version, time, and applicable scope, and
check whether the inputs are complete enough for the decision. Run current checks
that match the claim and read their complete results before summarizing. Keep the
command, target, exit status, and decisive output with the producing task;
success excerpts do not replace inspection of warnings, omissions, or failures
elsewhere in the selected results. Test or review code, analysis, and documents
in proportion to risk. A member checks the actual work, not just the Agent's
prose summary:

- Confirm the correct authority and current state, true and complete current
  inputs, and clear separation of assumptions, inferences, and judgments.
- Compare actual changes with the agreed and reported scope; inspect
  counterexamples, risks, non-goals, and uncovered cases.
- Confirm that verification actually ran against the current version and
  correct environment, the completion claim stays within its evidence, and
  an authorized person explicitly approved high-risk actions.
- Preserve reviewable outputs, evidence, and follow-up ownership.

Even checked Agent output becomes a durable team fact only when
its underlying source and limits are recorded in the authoritative system for
that work.

Use multiple Agents in parallel only when independent questions, paths, or
review angles can be separated. Default parallel work to independent read-only
research, review, or cross-checking. Give each subtask explicit inputs, outputs,
scope, stop conditions, and ownership. Name an integration owner to resolve
conflicts, remove duplicates, verify the combined result, and make the final
judgment. Multiple Agents must not edit the same source of truth or worktree
without coordination.
A majority opinion is not evidence; resolve disagreement against facts and
criteria. Do not close, overwrite, or clean up work of unknown ownership.

## Stop and Handoff

Stop the affected action and escalate when instructions materially conflict; the
target, fact source, or responsible person cannot be identified; authority is
insufficient; an action would cross a permission, compliance, security, or data
boundary; an action is irreversible without authorization or recovery;
another person's unrecognized or uncommitted work, or work of unknown ownership,
appears; verification contradicts expectation; evidence has expired; or
continuing would hide a failure, pollute a source of truth, enlarge harm, or
require presenting a guess as fact. Stopping the affected action protects that
boundary; independent authorized work may continue.

A completion report names the [delivery state](deliver.md#name-the-state-not-the-effort)
reached and the goal, scope, target, version, actual changes, verification method,
result, execution time and environment, and where the evidence can be inspected.
Name risks, limits, assumptions, unresolved questions, and any acceptance still
needed. Partial or deferred work names its affected scope and the state reached;
neither label replaces a completion check. State what remains incomplete and
why; distinguish a missing dependency
from work that has not been attempted. End with the next responsible person,
action, and due time; do not write only “follow up.” On interruption, preserve
state, uncommitted work, attempts and failures, the recovery entry, and retries
known to be ineffective. Repository Agents also start at the
[Agent entry](../AGENTS.md); a method pack is not governance authority.
