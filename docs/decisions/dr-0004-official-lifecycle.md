<!--
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
-->

# DR-0004: Official Change Lifecycle (Accepted)

## Context

Document checks and manual branch operations establish separate facts. They
cannot alone bind material intent, change ownership, authorization, proof, and
publication. Giving a method pack, dated report, or local script lifecycle
authority leaves competing answers to who may change what and when it is done.

## Decision

Use one selected official OpenSpec Change for material intent, specifications,
and task progress. ETHOS governs Work Lanes, write admission, proof, acceptance,
and publication. Repository checks guard document quality and decision shape
within that boundary. Department working rules retain their own authority.

## Alternatives Rejected

- A repository-private lifecycle could combine local checks and Git operations,
  but would duplicate the product's ownership, proof, and transition contracts.
- A method-pack plan, dated DR, claim, or private scope list can describe work;
  treating it as the Change would give that description competing authority.
- A mirror-only publication model would simplify delivery, but could not
  establish each Forge's independent source, CI, Release, and distribution.

## Consequences and Boundary

The repository depends on the installed product for admission and must repair
product or adopter defects at their actual owner. Local check success cannot
substitute for a missing authorization or lifecycle result.

Source acceptance and delivery to the two Forges require separate observations.
GitLab remains the organization release plane; GitHub has an independent
complete repository and CI/CD plane. Candidate and work branches remain local.
The [current governance contract](../governance/ethos.md) owns publishable refs;
it also owns runner boundaries and default gates. The
[contributor route](../../CONTRIBUTING.md) owns procedures; the native
[profile](../../.ethos/profile.toml) owns its actual fields. Completed Changes
explain earlier decisions, not current configuration.

## Evidence and Revisit

The adoption repair ([GitLab][adoption-gitlab] · [GitHub][adoption-github])
records the separation of decision rationale, methods, and Change authority. The
English and release-truth correction
([GitLab][english-gitlab] · [GitHub][english-github])
reaffirms that boundary without claiming the original adoption followed a later
lifecycle. Both designs are cited at Git commit
`c8599ce9c91ed5f988abd6b3f3011ac94430283d`, at the exact historical paths linked
below. The commit and paths identify the durable sources; Forge links are
convenience routes at the declared repository coordinates.
These records explain the choice, not current product behavior or
remote delivery. [Repository governance](../governance/ethos.md) and the
[official OpenSpec workspace](../../openspec/README.md) own the current rules.

Revisit the product and adopter boundary if the official mechanism cannot bind
material changes or completion claims. A defect needs an explicit authorized
repair, not a permanent private lifecycle.

[adoption-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-07-18-adoption-lifecycle-repair/design.md
[adoption-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-07-18-adoption-lifecycle-repair/design.md
[english-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-25-ddwg-english-release-truth/design.md
[english-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-25-ddwg-english-release-truth/design.md
