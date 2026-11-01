## Context

See proposal.md for why the records change. The publication requirement,
governance's "Retained Downloads" and the contributor procedure "Retire
superseded downloads" each describe keeping a rollback download. Since
2026-11-01 none remains on either Forge.

## Goals / Non-Goals

**Goals:**

- The specification, governance, the procedure and the Changelog state what the
  Forges hold.
- The retirement procedure can no longer delete another lane's evidence.

**Non-Goals:**

- Restoring any withdrawn download.
- Rewriting published release notes; the owner-approved dated notices are
  appended after the unchanged notes.

## Decisions

- **Modify the requirement rather than remove it.** Packages consumed by current
  CI still need bounded retirement, and withdrawn downloads still need a
  truthful Release. Only the rollback clause stops applying, because editions
  from 8.0.0 ship no download.
- **Freeze exact identifiers, bounded by commit ancestry.** A rule such as "all
  but the newest", or any cutoff by age, deletes records created after the
  inventory. Such records include a concurrent lane's proposal check run, whose
  deletion also removes the commit's required checks on GitHub. GitHub also
  returned check timestamps an hour ahead of real time on 2026-11-01, so a
  cutoff by time is unreliable. Ancestry of the release commit is stable, and
  other lanes' commits are not proper ancestors of it.

- **Keep one rollback package for CI.** The Mise bootstrap package of the
  preceding version stays until the next bump qualifies, so a failing CI supply
  can return to it without a new upload; older packages retire.

## Risks / Trade-offs

- [The requirement now states a past withdrawal] → It names a rule, editions
  from 8.0.0 attach no download, and the Changelog keeps the dated fact.
