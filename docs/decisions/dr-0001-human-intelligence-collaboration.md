<!--
---
subject: data-department-work-guidelines:DR-0001-human-intelligence-collaboration
role: decision
state: canonical
decision_id: DR-0001
decision_status: accepted
decision_date: 2026-07-12
relations:
  canonical_for: human-intelligence collaboration terminology
---
-->

# DR-0001: Human–AI Collaboration (Accepted)

## Context

The name must cover the working relationship without making a technical entity a
peer in organizational authority. “Human–Agent collaboration” names one
executing or reasoning entity; “human–machine collaboration” emphasizes the
mechanical carrier. The broader relationship must keep human intent,
authorization, judgment, and accountability for consequences clear.

## Decision

Use **human–AI collaboration** for the overall relationship and Agent for a
specific executing or reasoning entity. People set direction; intelligence
extends capacity; accountability stays with people. Use intelligence to
accomplish the task, judge against reality, and keep accountability human. The
name does not change authorization or verification duties.

## Alternatives Rejected

- “Human–Agent collaboration” is useful for a specific technical interaction,
  but gives a particular entity the name of the wider relationship.
- “Human–machine collaboration” identifies the carrier without sufficiently
  distinguishing callable intelligence from the accountable person.

## Consequences and Boundary

The [human–AI collaboration](../human-agent.md) rule defines permitted behavior.
An Agent can take on work, but cannot become the organizational authorizer, fact
authority, or person accountable for consequences. The broader name still needs
an explicit delegation boundary; consistent terminology does not prove correct
delegation or acceptance.

## Evidence and Revisit

The original choice is recorded in Git commit
`fad08e7379fd8454d9f92775477e0dc98edcb6c0`. The current definition is in the
[charter](../charter.md) and [human–AI collaboration](../human-agent.md); later
normalization preserves its scope without certifying the original work under the
later OpenSpec lifecycle. Revisit the name if actual use weakens human
accountability or projects cannot apply it accurately.
