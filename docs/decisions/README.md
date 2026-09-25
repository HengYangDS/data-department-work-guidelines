---
subject: data-department-work-guidelines:decisions
role: index
state: canonical
relations:
  canonical_for: durable decision register
---

# Decision Records

A decision record keeps a trade-off that the current rule alone cannot explain.
The [guidelines](../README.md) own working rules; an
[official Change](../../openspec/README.md) owns change intent and progress.
Records do not own tasks, command output, or acceptance logs.

- [DR-0001: Human–AI collaboration](dr-0001-human-intelligence-collaboration.md)
  explains the chosen name and its accountability boundary.
- [DR-0004: Official Change lifecycle](dr-0004-official-lifecycle.md)
  explains why OpenSpec and ETHOS, rather than methods or local scripts, govern
  material repository changes.

IDs are stable and never reused. Retired records remain recoverable in Git
history, not in the current decision register. A current record has only
`Context`, `Decision`, `Alternatives Rejected`, `Consequences and Boundary`, and
`Evidence and Revisit` sections. Its evidence links explain the basis and
revisit condition; they do not retrospectively certify earlier work.
