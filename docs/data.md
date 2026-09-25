---
subject: data-department-work-guidelines:data
role: policy
state: canonical
relations:
  canonical_for: data qualification production and adoption
---

# Data Quality and Adoption

**When to use:** When acquiring data, defining a metric, studying history,
deploying a production pipeline, or allowing a business use. A readable file,
attractive chart, or promising model signal does not by itself establish that
the data may be adopted.

## Answer Six Questions First

| Question                | What must be known                                                              |
| ----------------------- | ------------------------------------------------------------------------------- |
| Where did it come from? | Original source, acquisition method, source of truth, and authorization.        |
| When was it knowable?   | Event, publication, collection, ingestion, and actual observation times.        |
| What does it mean?      | Subject, fields, metric, granularity, units, states, and business meaning.      |
| What changed it?        | Cleaning, mapping, revision, backfill, aggregation, and derivation.             |
| How good is it?         | Completeness, accuracy, consistency, timeliness, stability, and anomaly limits. |
| How may it be used?     | Use cases, permissions, limits, misuse risks, owner, and exit conditions.       |

Data with unanswered questions may support exploration, but must not be
presented as a durable trusted asset. Distinguish source data, production data,
experimental results, service views, caches, and reporting views; a downstream
view must not quietly become the source of truth. Preserve the source and
history of revisions and backfills so the current value can be explained.

## Preserve the Historical Point of View

For event analysis, model validation, or cross-source comparison, distinguish
what could have been observed then from what can be seen in hindsight. Check
historical revisions, backfills, restatements, survivor bias, entity changes,
market calendars, missingness, delay, and conflict. If point-in-time consistency
cannot be proved, do not automatically call the data wrong; lower the strength
of the conclusion and stop research or business commitments that exceed the
evidence. State confidence, alternative explanations, and conclusions the data
cannot support.

## Move from a Lead to Controlled Use

Stages may be combined; the judgments may not disappear.

| Stage        | Decision                        | Typical basis                                                          |
| ------------ | ------------------------------- | ---------------------------------------------------------------------- |
| Opportunity  | Is evaluation worthwhile?       | Business question, value hypothesis, source, and information boundary. |
| Exploration  | What is the data?               | Samples, meaning, timeline, quality profile, and alternative sources.  |
| Reproduction | Can key findings be reproduced? | Replayable method, controls, anomalies, and failure explanation.       |
| Production   | Can it run reliably?            | Tests, release, backfill, monitoring, ownership, and recovery.         |
| Admission    | May it serve this use?          | Acceptance, permissions, lineage, limits, veto, and exit conditions.   |
| Feedback     | Is continued use worthwhile?    | Actual use, quality trends, cost, incidents, and review.               |

“Technically possible” is not “worth doing”; “a signal exists” is not
“production-ready”; “deployed” is not “approved for any use.” Label exploratory,
temporary, limited-use, and admitted states separately. “Let's use it and see”
does not erase risk.

## Ownership and Change Boundaries

Domain owners define meaning, quality, and permitted use. Production owners
ensure deployability, backfill, monitoring, and recovery. Platform owners
abstract shared capabilities without replacing domain judgment. Governance
owners define admission, permissions, lineage, veto, and exit. Delivery owners
make resources, dependencies, and risks visible. Cross-domain work has one lead
and clear interfaces, not an undifferentiated “everyone is responsible.”

Changes to production, shared assets, or critical management chains need a
defined subject, impact, lead, and authority; replayable inputs, logic, version,
and outputs; testing, acceptance, and observation; a release window and rollback
or degradation path; security and sensitive-information checks; escalation,
human takeover, and stop conditions. Bind evidence to the current version and
environment. An authorized person confirms high-risk adoption, permission
changes, production releases, destructive changes, and irreversible actions; an
Agent does not approve them itself.

Before data enters a lasting work system, its **meaning must be explainable,
source traceable, time identifiable, process reproducible, quality verifiable,
operation observable, owner identifiable, and use bounded**. Close the specific
completion claim through [execution and delivery](deliver.md).
