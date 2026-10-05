<!--
---
subject: data-department-work-guidelines:data
role: policy
state: canonical
relations:
  canonical_for: data qualification production and adoption
---
-->

# Data Quality and Adoption

**When to use:** Acquiring data, defining a metric, studying history, deploying
a production pipeline, or allowing a business use. A readable file, attractive
chart, or promising model signal does not by itself establish that the data may
be admitted for a specific use. Keep a proposed use exploratory until evidence
of its meaning, quality, permission, and reproducibility supports that decision.

## Answer Six Questions First

| Question                | What must be known                                                              |
| ----------------------- | ------------------------------------------------------------------------------- |
| Where did it come from? | Original source, acquisition method, source of truth, and authorization.        |
| When was it knowable?   | Event, publication, collection, ingestion, and availability times.              |
| What does it mean?      | Subject, fields, metric, granularity, units, states, and business meaning.      |
| What changed it?        | Cleaning, mapping, revision, backfill, aggregation, and derivation.             |
| How good is it?         | Completeness, accuracy, consistency, timeliness, stability, and anomaly limits. |
| How may it be used?     | Use cases, permissions, limits, misuse risks, owner, and exit conditions.       |

Data with unanswered questions may support exploration, but must not be
presented as a durable trusted asset. Exploratory code and temporary data may
move quickly inside that boundary. Neither may enter a shared, production, or
decision path until its meaning, quality, permissions, and reproducibility are
qualified for that use.

Keep source data, production data, experimental results, service views,
platform-derived views, and reporting views distinct. Reports,
catalogs, caches, and Agent summaries are projections; none may quietly become
the source of truth. Preserve the source and history of revisions, backfills,
and derivations so the current value can be explained.

## Preserve the Historical Point of View

For historical research, event analysis, model validation, or cross-source
comparison, distinguish what could have been known then from what can be seen
in hindsight. Availability time is when a value became accessible to the
relevant user or system, not when someone later queried it. Check historical
revisions, backfills, and restatements, and whether sample selection, entity
changes, market calendars, or survival status introduce bias. Explain how
missingness, delay, conflict, and anomalies affect the conclusion. If
point-in-time consistency cannot be proved, do not automatically call the data
wrong; lower the strength of the conclusion and stop making research or business
commitments that exceed the evidence. State confidence, alternative
explanations, and conclusions the data cannot support.

## Move from a Signal to Controlled Use

Stages may be combined; the judgments may not disappear.

| Stage        | Decision                          | Typical basis                                                          |
| ------------ | --------------------------------- | ---------------------------------------------------------------------- |
| Opportunity  | Is evaluation worthwhile?         | Business question, value hypothesis, source, and information boundary. |
| Exploration  | What is the data?                 | Samples, meaning, timeline, quality profile, and alternative sources.  |
| Reproduction | Can key findings be reproduced?   | Replayable method, controls, anomalies, and failure explanation.       |
| Production   | Can it run reliably?              | Tests, release, backfill, monitoring, ownership, and recovery.         |
| Admission    | May it serve this use?            | Acceptance, permissions, lineage, limits, veto, and exit conditions.   |
| Feedback     | Do results support continued use? | Use feedback, quality trends, cost, incidents, and review.             |

“Technically possible” is not “worth doing”; “a signal exists” is not
“production-ready”; “deployed” is not “admitted for every use.” Label exploratory,
temporary, limited-use, awaiting verification, and admitted states separately.
“Let's use it and see” does not erase risk.

Admission permits a specified use under stated conditions. Adoption is observed
use within those conditions, not a label inferred from deployment.

### Worked decision: revised market history

**Illustrative case, not a recorded incident.** A vendor republishes historical
prices after a correction. A researcher wants to backtest a strategy: simulate
decisions that would have been made before the correction. The question is not
only whether today's series is accurate, but what was knowable at each decision
time.

| Gate            | Evidence to obtain                                                             | Stop if missing                               |
| --------------- | ------------------------------------------------------------------------------ | --------------------------------------------- |
| Research claim  | Earlier snapshot, availability time, and correction history.                   | Do not call the backtest point-in-time valid. |
| Production feed | Replayable inputs and outputs, tests, monitoring, access review, and recovery. | Keep the file exploratory.                    |
| Use admission   | Domain meaning, permissions and veto, authorized decision, and acceptance.     | Do not infer permission from deployment.      |

An Agent may locate snapshots, compare revisions, or run replay checks within
its delegation. It cannot decide that the dataset is admitted. The task lead
brings the evidence and open risks to the decision owner and acceptor; later
observed use, not this table, establishes adoption.

## Ownership and Change Boundaries

| Owner      | Responsibility                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Domain     | Define meaning, quality requirements, suitable use cases, and professional judgments.                                                   |
| Production | Ensure deployability, backfill, monitoring, recovery, and reliable long-term operation.                                                 |
| Platform   | Abstract repeated, cross-domain capabilities needed for durable operation without replacing domain judgment.                            |
| Governance | Define admission, permissions, lineage, review, veto, and exit, and make those controls work in the actual workflow.                    |
| Delivery   | Make priorities, resources, dependencies, risks, and open decisions visible without replacing the other owners' professional judgments. |

Sharing an interface does not transfer responsibility or grant authority over
another owner's judgments. Cross-domain work should have one accountable task
lead and clear professional interfaces. Explain any different arrangement;
accountability remains mandatory. Use the
[charter's interface contract](charter.md#form-follows-risk) to make each side's
needs and delivery evidence explicit.

Changes to production, shared assets, or critical management chains require:

- A defined subject, impact, task lead, and authority.
- Replayable inputs, logic, version, and outputs.
- Tests, acceptance against agreed criteria, and operational observation.
- A release window and rollback or degradation path.
- Security, access-permission, and sensitive-information checks.
- Escalation, human takeover, and stop conditions.
- Evidence bound to the current version and environment.

The authorized decision owner must approve high-risk use admission, permission
changes, production releases, deletion or overwrite, and irreversible actions.
An Agent may implement or help verify them within its delegated scope, but
cannot approve them.

Before data enters a lasting work system, its **meaning must be explainable,
source traceable, time identifiable, process reproducible, quality verifiable,
operation observable, owner identifiable, and use bounded**. If any condition is
unmet, label the data exploratory, temporary, limited-use, or awaiting
verification. A limited use requires its own evidence and permission; it does
not make the data a fully qualified asset. Close the specific completion claim
through [execution and delivery](deliver.md).
