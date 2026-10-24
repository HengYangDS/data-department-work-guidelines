---
subject: data-department-work-guidelines:DR-0005-change-closure-scope
role: decision
state: canonical
decision_id: DR-0005
decision_status: accepted
decision_date: 2026-10-24
relations:
  canonical_for: closing an OpenSpec Change on its delivered scope
---

# DR-0005: Close a Change on Its Delivered Scope (Accepted)

## Context

The `native-document-quality` Change delivered the English guidance, the
original-duty review and most of the move to shared ETHOS maintenance, but 18
of its tasks could not finish. Seventeen wait on capabilities and places that
this repository cannot provide: public ETHOS supply for every declared
platform, including Windows ARM64; the shared release-history coverage that
release validation needs; hosted jobs and publication on both Forges while the
GitLab peer is unreachable; and acceptance by the AIGW and Proxy owners. The
remaining one is a local qualification that current work does not need. A
Change that cannot archive turns into a standing queue beside the work. On
2026-10-24 the user directed that every open Change close and that tasks
waiting on an unavailable environment leave through a recorded decision that
says why and when they return.

## Decision

Close a Change on its delivered scope. Before its archive, judge each open task
on current evidence:

- **Delivered:** current evidence meets its done condition, and the task is
  checked with that evidence.
- **Environment:** it waits on something that this repository cannot provide
  now. It leaves the Change and returns when that environment can be observed.
- **In-repo:** its remaining work lies in this repository, but current work
  does not need it. It leaves the Change and returns as a new Change when the
  work is taken up.
- **Superseded:** later work or a decision replaced it. It leaves the Change
  with that evidence and does not return.

A withdrawn task keeps its line, identity and hierarchy in `tasks.md` without a
checkbox, marked `Withdrawn by DR-0005 (environment).`, `(in-repo)` or
`(superseded)`, so the archived Change still shows its whole plan while its
progress counts only the tasks it kept. A specification delta merges only the
requirements that the repository implements; a requirement whose
implementation or retirement was withdrawn leaves the delta and returns with
its new Change.

## Alternatives Rejected

- Keeping the Change open until every environment exists would block its
  archive indefinitely and leave the task list as a second queue.
- Checking an unfinished task would claim delivery that did not happen.
- Deleting unfinished tasks would hide the plan and break the stable identities
  that history and evidence refer to.
- Merging every delta requirement would make the main specifications describe
  behavior or retirements that the repository has not delivered.

## Consequences and Boundary

The Change archives without publishing v8.0.0, without qualifying public ETHOS
supply and without hosted or peer acceptance. Those obligations return through
new Changes when their environments exist, and the prepared edition remains a
prepared edition. A withdrawal neither certifies nor revokes delivered work;
its evidence stays with its native owner. This decision covers this
repository's Changes; the shared product keeps its own closure decision.

## Evidence and Revisit

The archived Change records each withdrawn task with its reason beside its
original text. On 2026-10-24 the ETHOS owner withdrew public supply for every
declared platform from ETHOS 0.2.0, which tasks 2.38 and 2.45.2 depend on, and
the GitLab peer was unreachable. Revisit when a new Change takes up
publication, when the shared product ships public supply for every declared
platform, or when a withdrawn task proves necessary for current work.
