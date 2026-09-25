---
subject: data-department-work-guidelines:DR-0004-official-lifecycle
role: decision
state: canonical
decision_id: DR-0004
decision_status: accepted
decision_date: 2026-09-25
relations:
  canonical_for: official repository change lifecycle boundary
---

# DR-0004: Official Change Lifecycle

## Context

Document checks and manual branch operations see only parts of a result. They
cannot by themselves connect change ownership, authorization, proof, and
publication into a trustworthy lifecycle. Treating a method pack, dated report,
or local script as a governance carrier creates competing authority.

## Decision

One selected official OpenSpec Change carries the intent, specifications, and
task progress of one material change. ETHOS governs Work Lanes, write admission,
proof, acceptance, and publication boundaries. Repository checks add document
and decision-topology constraints; they do not replace the official lifecycle.
Team working rules and repository governance remain distinct.

## Alternatives Rejected

- Document scripts and manual branch operations alone cannot reliably bind
  subject, change, and proof.
- Superpowers documents, date-named DRs, claims, or private scope lists standing
  in for a Change would create a second lifecycle.
- Remote reachability, mirror configuration, or local validation cannot
  establish remote delivery or team adoption.

## Consequences and Boundary

Source acceptance, the GitLab organization release plane, and GitHub's
independent complete repository and CI/CD plane are different effects and
require separate verification. Candidate and work branches remain local; the
current repository governance contract controls publishable refs. Specific
commands, runner selection, and profile fields belong in the
[current governance contract](../governance/ethos.md) and relevant Changes, not
in a DR.

## Evidence and Revisit

The current rule is in [repository governance](../governance/ethos.md) and the
[official OpenSpec workspace](../../openspec/README.md); earlier decisions and
revisions remain in Git. The official lifecycle boundary of this record was
reaffirmed on 2026-09-25. It neither claims that the original ETHOS adoption
followed a lifecycle established later nor proves current remote delivery or
team use. If the official mechanism fails to bind material changes or completion
claims, revisit the product and adopter authority boundary rather than creating
a private process.
