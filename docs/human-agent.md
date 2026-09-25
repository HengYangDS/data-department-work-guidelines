---
subject: data-department-work-guidelines:human-agent
role: policy
state: canonical
relations:
  canonical_for: human agent delegation verification and responsibility
---

# Human–AI Collaboration

**When to use:** When a member delegates search, analysis, drafting, changes,
tests, or review to an Agent. People set direction and authority; intelligence
extends capacity. Verify the facts. Decisions and consequences remain human
responsibilities. An Agent is an executing or reasoning entity, not a source of
organizational authorization.

## Delegate a Boundary, Not a Pile of Context

A consequential delegation states the goal and decision it supports, current
authorities and fact sources, subject and scope, non-goals, deliverable and
audience, permissions and forbidden actions, acceptance method, checkpoints,
stop conditions, and interruption handoff. A low-risk task can be stated
briefly. A high-risk one names the owner, recovery path, and who approves
irreversible actions.

If missing context does not affect direction or safety, the Agent may continue
with stated assumptions. If the target, fact source, authority, or irreversible
consequence cannot be established, stop and ask. “Finish this for me” is not an
authorization boundary.

| Role                 | May do                                                       | Responsibility that remains                                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Task owner           | Set the goal, authorize, provide resources, and decide.      | Goal, boundary, risk, and result.                                   |
| Executing member     | Decompose, delegate, integrate, and verify.                  | Understand and accept delegated output.                             |
| Agent                | Search, reason, draft, implement, test, and present options. | Must not grant itself authority or promise consequences for people. |
| Reviewer or acceptor | Independently check facts, changes, and evidence.            | Must not replace acceptance with an author's or Agent's account.    |

**The person who calls an Agent owns its context, permissions, verification, and
result.**

Submitting Agent-assisted work means the member has understood and checked the
result and accepts responsibility for its consequences. Delegation transfers
work, not that duty.

## Execute and Verify

An Agent first confirms the task, target root, current state, and applicable
local rules. It distinguishes fact, hypothesis, inference, judgment, decision,
and action; loads only relevant material; and advances in reversible, verifiable
steps within its authority. Before writing, it checks the target, concurrent
work, and recovery path. Its output leads with the conclusion and evidence, then
limits and next steps.

Agent memory, summaries, guesses, and generated content are candidate material.
Check a source against the original, version, time, and applicable scope. Check
a command result against its target, exit status, and decisive output. Test or
review code, analysis, and documents in proportion to risk. A person must not
rely solely on an Agent's prose summary: inspect the actual change, missing
counterexamples, present environment, uncovered cases, and high-risk
authorization.

Use multiple Agents in parallel only when independent questions, paths, or
review angles can be separated. Name an integration owner and avoid
uncoordinated edits to the same source of truth or worktree. A majority opinion
is not evidence; resolve disagreement against facts and criteria. Do not
overwrite or clean up work of unknown ownership.

## Stop and Handoff

Stop the affected action and escalate when instructions materially conflict; the
target or fact source cannot be identified; authority is insufficient; an action
is irreversible without authorization or recovery; someone else's unrecognized
work appears; verification contradicts expectation; or evidence has expired.
Stopping is not failure. Continuing with a guess presented as fact is loss of
control.

A completion report states what was actually done, to which subject and version,
with what current verification; what the evidence does not show; who must still
accept; what remains; and the next step. On interruption, preserve state,
uncommitted work, attempts and failures, the recovery entry, and retries known
to be ineffective. Repository Agents also start at the
[Agent entry](../AGENTS.md); a method pack is not governance authority.
