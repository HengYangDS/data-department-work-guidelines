---
subject: data-department-work-guidelines:decisions
role: index
state: canonical
relations:
  canonical_for: durable decision register
---

# Decision Records

A DR preserves a trade-off and revisit condition that future readers still need
to understand. The current rules live in the [guidelines](../README.md); change
execution lives in an [official Change](../../openspec/README.md). Task state,
command output, and acceptance logs do not belong in a DR. IDs are stable and
never reused; filenames use lowercase `dr-NNNN-meaning.md`.

| Record                                                 | Status     | Durable choice or historical position                                                    |
| ------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------- |
| [DR-0001](dr-0001-human-intelligence-collaboration.md) | Accepted   | Human–AI collaboration and final human accountability.                                   |
| [DR-0002](dr-0002-reader-experience.md)                | Superseded | A former root monolith, replaced by the semantic topic structure.                        |
| DR-0003                                                | Retired    | Local trial readiness was not a durable decision; the old record remains in Git history. |
| [DR-0004](dr-0004-official-lifecycle.md)               | Accepted   | Official OpenSpec and ETHOS govern material repository changes.                          |

Each DR body has only five sections: `Context`, `Decision`,
`Alternatives Rejected`, `Consequences and Boundary`, and
`Evidence and Revisit`. Metadata carries status and ID. The evidence section
points to a reviewable basis or outcome and states when to reconsider. It does
not paste command logs or retroactively claim an earlier decision followed a
later lifecycle.
