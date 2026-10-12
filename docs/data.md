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
a production pipeline, or allowing a business use.

A readable file, attractive chart, or promising model signal does not by itself
establish that the data may be admitted for a specific use. Keep a proposed use
exploratory within its authorized scope until evidence of its meaning, quality,
permission, and reproducibility supports that decision.

Before relying on a result, recheck key findings, reproducibility, and permission
against [the intended use](#move-from-a-signal-to-controlled-use). Stop a proposed
controlled use and escalate if its meaning or quality is unverified or permission
is insufficient. For a shared or production change, also require the
[operational checks and recovery path](#change-shared-or-production-data).

For a lasting data asset, [all eight admission conditions](#admit-a-durable-data-asset)
must hold. For historical research, preserve
[what was knowable at the time](#preserve-the-historical-point-of-view).

## Answer Six Questions First

| Question                | What must be known                                                              |
| ----------------------- | ------------------------------------------------------------------------------- |
| Where did it come from? | Original source, acquisition method, source of truth, and authorization.        |
| When was it knowable?   | Event, publication, collection, ingestion, and availability times.              |
| What does it mean?      | Subject, fields, metric, granularity, units, states, and business meaning.      |
| What changed it?        | Cleaning, mapping, revision, backfill, aggregation, and derivation.             |
| How good is it?         | Completeness, accuracy, consistency, timeliness, stability, and anomaly limits. |
| How may it be used?     | Use cases, permissions, limits, misuse risks, owner, and exit conditions.       |

Data with unknown meaning, quality, or historical availability may be explored
within an authorized scope, but must not be presented as a durable trusted asset.
Exploration still requires permission for acquisition, processing, and the
intended use. Agents must also stay within their delegated scope. If permission is
missing or unclear, stop the affected action and escalate to the authorized
decision owner.

Exploratory code and temporary data may move quickly inside that boundary.
Neither may enter a shared, production, or decision path until its meaning,
quality, permissions, and reproducibility are
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
missingness, delay, conflict, and anomalies affect the conclusion.

Distinguish a missing fact from an established timing defect. If evidence shows
that a value first became available after a simulated decision, it cannot be
used as information available at that decision. Replace or exclude the affected
values and rerun the analysis. If availability is unknown, point-in-time
validity remains unproved; authorized exploratory analysis may continue within
that stated limit. Do not make research or business commitments that exceed the
evidence.
State confidence, alternative explanations, and conclusions the data cannot
support.

## Admit a Durable Data Asset

Before data enters a lasting work system, **all eight conditions must hold**:

- Its meaning is explainable.
- Its source is traceable.
- Its time is identifiable.
- Its process is reproducible.
- Its quality is verifiable.
- Its operation is observable.
- Its owner is identifiable.
- Its use is bounded.

If any condition is unmet, label the data exploratory, temporary, limited-use,
or awaiting verification. A limited use requires its own evidence and
permission; it does not make the data a fully qualified asset. Close the
specific completion claim through [execution and delivery](deliver.md).

## Move from a Signal to Controlled Use

Use the questions below for the intended use, not as a mandatory pipeline.
Research need not become production; production needs its operational
safeguards. Admission precedes use that requires permission, even when
production evidence is gathered earlier. Revisit the affected value, meaning,
or quality judgment when facts or use change. Neither deployment nor feedback
authorizes a new use.

- **Opportunity:** Is evaluation worthwhile? Establish the business question,
  value hypothesis, source, and information boundary.
- **Exploration:** What is the data? Examine samples, meaning, timeline, quality
  profile, and alternative sources.
- **Reproduction:** Can key findings be reproduced? Use a replayable method,
  controls, anomalies, and failure explanation.
- **Production:** Can it run reliably? Require tests, release, backfill,
  monitoring, ownership, and recovery.
- **Admission:** May it serve this use? Establish acceptance, permissions,
  lineage, limits, veto, and exit conditions.
- **Feedback:** Do results support continued use? Review use feedback, quality
  trends, cost, and incidents.

“Technically possible” is not “worth doing”; “a signal exists” is not
“production-ready”; “deployed” is not “admitted for every use.” Label exploratory,
temporary, limited-use, awaiting verification, and admitted states separately.
“Let's use it and see” does not erase risk.

Admission permits a specified use under stated conditions. Adoption is observed
use within those conditions, not a label inferred from deployment.

### Worked decision: revised market history

**Illustrative case, not a recorded incident.** A vendor republishes historical
prices after a correction. A researcher wants to backtest a strategy by
simulating decisions made before that correction. The test needs the values
available to the researcher at each decision time. Qualifying an operational
feed is a separate decision; the feed checks apply only if that feed is proposed.

- **Research claim:** Obtain the earlier snapshot, availability time, and
  correction history. Without them, do not call the backtest point-in-time valid.
- **Production feed:** Require replayable inputs and outputs, tests, monitoring,
  access review, and recovery. Without them, do not promote the data to an
  operational feed.
- **Use admission:** Establish domain meaning, permissions and veto, the
  authorized decision, and acceptance. Deployment cannot supply missing
  permission.

For historical validity, the finding determines the next action:

- **First availability is unknown.** Point-in-time validity remains unproved;
  today's corrected series cannot establish what was knowable then. Obtain the
  earlier snapshot and correction history; recheck availability before requesting
  admission.
- **First availability is later than the simulated decision.** Using that
  value as information available then is invalid for that earlier decision.
  Replace or exclude that value and rerun affected results before requesting
  admission.

An accurate operational feed does not settle either historical claim. Keep the
proposed historical use exploratory until its evidence supports that use and
the authorized owner has made the admission decision.

An Agent may locate snapshots, compare revisions, or run replay checks within
its delegation. It cannot decide that the dataset is admitted. The task lead
brings the evidence and open risks to the decision owner and acceptor; later
observed use, not these checks, establishes adoption.

## Ownership and Change Boundaries

Apply this contract to information acquisition, analysis and modeling, data
science, software development, data production, platforms and infrastructure,
product and technical management, governance, and operational delivery.

Assign responsibility for the actual work. Distinguish its output, the
activities that produce or support it, and who decides and accepts it. The
following responsibilities may overlap in one person or team. Assign them
through the department's current role and authority arrangements; this page
defines data-work obligations, not seats or reporting lines.

| Responsibility | Work that must be owned                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Domain         | Define meaning, quality requirements, suitable use cases, and professional judgments.                                                   |
| Production     | Ensure deployability, backfill, monitoring, recovery, and reliable long-term operation.                                                 |
| Platform       | Abstract repeated, cross-domain capabilities needed for durable operation without replacing domain judgment.                            |
| Governance     | Define admission, permissions, lineage, review, veto, and exit, and make those controls work in the actual workflow.                    |
| Delivery       | Make priorities, resources, dependencies, risks, and open decisions visible without replacing the other owners' professional judgments. |

Cross-domain work should have one accountable task lead and clear professional
interfaces. Explain any different arrangement; accountability remains mandatory.
For each important result or decision, name its accountable owner, decision
mandate, and acceptor in the existing work or product record. These assignments
may be held by the same person where authority and risk permit. A shared
interface does not transfer responsibility or grant authority over another
owner's judgment. Use the [charter's interface contract](charter.md#form-follows-risk)
to make each side's needs and delivery evidence explicit.

### Assign Modeling and Lifecycle Decisions

Business modeling settles the entities, relationships, rules, and metric
meanings that the work represents. Data modeling settles grain, identifiers and
keys, constraints, time and version rules, and how the agreed meaning is
represented. Name an owner for shared definitions across domains and bring
conflicting meanings to the authorized domain owners; choosing a convenient
schema does not resolve that conflict.

Development must preserve the agreed model in implementation, tests, and
interfaces. Technical choices need an owner for architecture, compatibility,
reliability and capacity limits, shared standards, and dependencies within the
existing mandate. Those decisions do not grant business or use permission.

For a data service or asset, product management must settle intended consumers,
use, value, acceptance, and evolution. Its owner must address consumer impact,
versioning, migration or deprecation notice, and evidence before retirement.
Asset governance retains permission and exit controls; production retains
release and recovery. The task lead coordinates these decisions without taking
over their owners' authority.

#### Worked change: a shared issuer identifier

**Illustrative case, not a recorded incident.** A shared dataset changes its
issuer identifier. Local tests pass, but a dependent report still joins on the
old identifier. The new schema may be valid even if the report now matches the
wrong entities or loses matches. Apply the
[modeling and lifecycle responsibilities](#assign-modeling-and-lifecycle-decisions)
to this change.

Business and data-model owners resolve identity and its time rules, including
any conflict between domain definitions. Development checks affected joins
against the agreed meaning; technical owners check compatibility. The product
owner identifies dependent consumers and their migration. Production plans
release and recovery, and governance confirms permission and exit conditions.
The task lead coordinates the unresolved decisions.

Before retiring the old interface, establish that each affected consumer has
migrated or that the authorized owner has ended its use. A deprecation notice
alone does not establish completed migration. Identify failed and unverified
joins in the existing work evidence, with their inputs, version, environment,
impact, responsible owner, and next action.

If the report's migration or approved withdrawal is unverified, retirement
remains unfinished even when local tests pass. Retain only the old interface
and recovery material needed for that named dependency, with a resolution action
and revisit time. After acceptance and the required release and exit decisions,
retire the replaced live interface. Verify that the report uses the successor
or is no longer an active consumer under the authorized decision.
An Agent may trace dependencies, compare joins, and prepare migration evidence
within its delegation; it cannot supply the missing acceptance or permission.

### Own Implementation and Verification

Engineering owners carry responsibility from requirements and design through
implementation, verification, release, operational feedback, and improvement,
as applicable to the work. Development and verification are activities within
that responsibility, not separate teams or a transfer of quality to the next
stage. Professional owners verify the judgments and models within their remit.

Before handing over a result, its owner must identify:

- The agreed model and criteria tested, including affected interfaces and
  migrations.
- The actual inputs, version, environment, method, and results, with limits
  and uncovered cases.
- Each failure or discrepancy, its disposition, and the owner of any unresolved
  risk.

Keep these details with the
[existing work evidence](deliver.md#evidence-sets-the-limit-of-the-claim).
Risk may require specialist or independent review under the existing authority.
Review does not remove implementation quality responsibility or require a
new testing team. Verification supports acceptance, use admission, and release
decisions; passing checks cannot grant them.

### Change Shared or Production Data

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
