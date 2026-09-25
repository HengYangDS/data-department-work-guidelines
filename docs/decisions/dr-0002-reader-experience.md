---
subject: data-department-work-guidelines:DR-0002-reader-experience
role: decision
state: archived
decision_id: DR-0002
decision_status: superseded
decision_date: 2026-07-12
relations:
  superseded_by: guidance-semantic-convergence
---

# DR-0002: Reader Entries and the Former Monolith

## Context

The first guidelines were concentrated in a long root document. New readers
struggled to find their situation, boundaries, and next step; at the time,
multiple entries also seemed likely to duplicate rules.

## Decision

The earlier design used a member entry, an Agent entry, and one root text, with
action cards and diagrams to lower the cost of reading. **That physical monolith
has since been replaced by semantic topics and no longer governs the current
layout.**

## Alternatives Rejected

- Requiring every reader to study the whole document made entry too costly.
- Copying full rules into entry pages would have caused drift.

## Consequences and Boundary

“Enter through the reader's task; do not duplicate normative rules” remains a
valid concern. The former root text and fixed counts of cards and diagrams are
not durable requirements. The current routes and topic ownership live in the
[documentation map](../README.md); the archived official Change
`guidance-semantic-convergence` records the replacement. This ID explains a
historical choice, not current authority.

## Evidence and Revisit

The original record and former structure can be checked in Git history. The
replacement is recorded in the official Change `guidance-semantic-convergence`;
the present entry is described in the
[OpenSpec workspace](../../openspec/README.md). Neither this record nor the
archive proves team adoption or retroactively certifies the original decision
under a later lifecycle. Revisit current navigation if real readers still cannot
find a rule or entries begin copying the normative text.
