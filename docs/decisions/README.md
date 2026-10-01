<!--
---
subject: data-department-work-guidelines:decisions
role: index
state: canonical
relations:
  canonical_for: durable decision register
---
-->

# Decision Records

Read a record when you need the reason for a lasting choice. The
[task map](../README.md) leads to current working rules; the
[official Change](../../openspec/README.md) carries change intent and progress.

| Decision                                                                       | Question it resolves                                                                    |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [DR-0001: Human–AI collaboration](dr-0001-human-intelligence-collaboration.md) | Why name the relationship separately from its executing Agent?                          |
| [DR-0004: Official Change lifecycle](dr-0004-official-lifecycle.md)            | Why do OpenSpec and ETHOS govern material changes rather than methods or local scripts? |

## Add Only a Decision Worth Keeping

Keep a record when a lasting choice has a meaningful alternative and a trade-off
that current rules alone cannot explain. Link to an existing choice if it
already answers the question. A changed command, tool version, task result, or
release does not by itself need a DR.

Use stable IDs and lowercase `dr-####-*.md` filenames. Never reuse an ID; a gap
in the sequence is not missing work. Retired records remain recoverable in Git,
without a second archive directory in this register.

| Required section          | Keep here                                                   |
| ------------------------- | ----------------------------------------------------------- |
| Context                   | The problem and constraints that required a choice.         |
| Decision                  | The chosen option and its reason.                           |
| Alternatives Rejected     | Feasible alternatives and why they lost.                    |
| Consequences and Boundary | Costs, limits, and authority that did not transfer.         |
| Evidence and Revisit      | The decision basis and an observation that could change it. |

These are the only five sections after the matching title. Each must contain
readable rationale. Keep task lists, commands, implementation status, acceptance
logs, and release operations with their producing Change or native record.
Evidence links support the reason for the decision; they do not prove current
delivery or retrospectively certify work under a later lifecycle.

The structural check rejects malformed sections, repeated IDs, and execution
content. It cannot decide whether the choice is sound or worth recording.
