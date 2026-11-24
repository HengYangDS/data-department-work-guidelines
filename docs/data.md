---
subject: data-department-work-guidelines:data
role: policy
state: canonical
relations:
  canonical_for: data qualification production and adoption
---

# Data Quality and Adoption

**When to use:** Acquiring data, defining a metric, studying history, deploying
a production pipeline, or allowing a business use.

You must qualify data for a specific use before treating it as trusted. A
readable file, attractive chart, or promising model signal does not by itself
establish its meaning, quality, permission, or reproducibility. You must keep
the proposed use exploratory within its authorized scope until the evidence
supports it.

Before relying on a result, you must recheck key findings, reproducibility, and
permission for the intended use. You must stop the proposed controlled use and
escalate if its meaning or quality is unverified or permission is insufficient.

| Your work question                                   | Read next                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Is the asset ready for lasting use?                  | [All eight asset-admission conditions](#admit-a-durable-data-asset) must hold.   |
| What was knowable at an earlier decision?            | Preserve the [historical point of view](#preserve-the-historical-point-of-view). |
| Who decides a shared definition or model change?     | [Modeling and lifecycle decisions](#assign-modeling-and-lifecycle-decisions).    |
| May the result serve this use?                       | [Evidence and use admission](#move-from-a-signal-to-controlled-use).             |
| What must hold before a shared or production change? | Require [operational checks and recovery](#change-shared-or-production-data).    |

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
within an authorized scope, but must not be presented as a durable trusted
asset. Exploration still requires permission for acquisition, processing, and
the intended use. Agents must also stay within their delegated scope. If
permission is missing or unclear, you must stop the affected action and escalate
to the authorized decision owner.

Exploratory code and temporary data may move quickly inside that boundary.
Neither may enter a shared, production, or decision path until its meaning,
quality, permissions, and reproducibility are qualified for that use.

You should keep source data, production data, experimental results, service
views, platform-derived views, and reporting views distinct. Reports, catalogs,
caches, and Agent summaries are projections; none may become the source of truth
without an explicit, authorized designation. You should preserve the source and
history of revisions, backfills, and derivations so the current value can be
explained.

## Preserve the Historical Point of View

For historical research, event analysis, model validation, or cross-source
comparison, you must distinguish what could have been known then from what can
be seen in hindsight. Availability time is when a value became accessible to the
relevant user or system, not when someone later queried it. You must check
historical revisions, backfills, and restatements, and whether sample selection,
entity changes, market calendars, or survival status introduce bias. You must
explain how missingness, delay, conflict, and anomalies affect the conclusion.

You must distinguish a missing fact from an established timing defect. If
evidence shows that a value first became available after a simulated decision,
it cannot be used as information available at that decision. You must replace or
exclude the affected values and rerun the analysis. If availability is unknown,
point-in-time validity remains unproved; authorized exploratory analysis may
continue within that stated limit. You must not make research or business
commitments that exceed the evidence. You must state confidence, alternative
explanations, and conclusions the data cannot support.

## Admit a Durable Data Asset

Before data enters a lasting work system, **all eight conditions must hold**:

| Condition                    | What to inspect                                                              |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Its meaning is explainable.  | The subject, fields, metric, grain, units, and business meaning.             |
| Its source is traceable.     | The original source, acquisition method, source of truth, and authorization. |
| Its time is identifiable.    | Event and availability times, revisions, and backfills for the intended use. |
| Its process is reproducible. | Replayable inputs, transformation logic, versions, and outputs.              |
| Its quality is verifiable.   | Agreed quality requirements, checks, anomalies, and limits.                  |
| Its operation is observable. | Monitoring, backfill, and recovery for its operational role.                 |
| Its owner is identifiable.   | The accountable owner, decision mandate, and acceptor.                       |
| Its use is bounded.          | Permitted consumers and uses, restrictions, and exit conditions.             |

If any condition is unmet, you must label the data exploratory, temporary,
limited-use, or awaiting verification. A limited use requires its own evidence
and permission; it does not make the data a fully qualified asset. You must
close the specific completion claim through [execution and
delivery](deliver.md). An admitted asset may serve the uses its last condition
lists; any other use needs its own use admission.

## Move from a Signal to Controlled Use

The questions below apply as the proposed use requires, and the duties under
each bind with the force they state. These are not mandatory stages; you may
combine them when useful. Research need not become production, but operational
deployment requires production qualification and safeguards. You must obtain
permission for the intended use before it begins, even if production evidence is
ready. You must revisit the affected value, meaning, or quality judgment when
facts or intended use change; deployment and feedback do not authorize another
use.

- **Opportunity:** Is evaluation worthwhile? You should establish the business
  question, value hypothesis, source, and information boundary.
- **Exploration:** What is the data? You should examine samples, meaning,
  timeline, quality profile, and alternative sources.
- **Reproduction:** Can key findings be reproduced? You must use a replayable
  method, and should use controls, anomalies, and failure explanation.
- **Production:** Can it run reliably? You must require tests, release,
  backfill, monitoring, ownership, and recovery.
- **Use admission:** May it serve this use? You must establish domain meaning,
  acceptance, permissions, lineage, limits, veto, and exit conditions; a
  high-risk use also needs the authorized decision owner's approval
  ([data changes](#change-shared-or-production-data)).
- **Feedback:** Do results support continued use? You should review use
  feedback, quality trends, cost, and incidents. You should keep the review
  result and any changed judgment with the [existing work
  evidence](deliver.md#evidence-sets-the-limit-of-the-claim).

You should assess technical feasibility and business value separately. You must
label data according to its evidence and permission: exploratory, temporary,
limited-use, awaiting verification, or admitted. Starting to use it does not
resolve an open risk. Use admission permits a specified use under stated
conditions; adoption is observed use within them, not inferred from deployment.

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
  earlier snapshot and correction history; recheck availability before
  requesting use admission.
- **First availability is later than the simulated decision.** Using that
  value as information available then is invalid for that earlier decision.
  Replace or exclude that value and rerun affected results before requesting
  use admission.

An accurate operational feed does not settle either historical claim. Keep the
proposed historical use exploratory until its evidence supports that use and
the authorized owner has made the use-admission decision.

An Agent may locate snapshots, compare revisions, or run replay checks within
its delegation. It cannot make the use-admission decision. The
task lead brings the evidence and open risks to the decision owner and acceptor;
later observed use, not these checks, establishes adoption.

## Ownership and Change Boundaries

The department's work falls into nine functions: six vertical functions that
carry professional judgment and produce lasting output along the data value
chain, and three horizontal functions that run across all six, lift local
experience into department-wide methods and governance, and settle trade-offs
across the chain. They are areas of responsibility, not departments or an
organization chart. Four vertical functions also hold a department-wide duty,
called a center, for all data; a center is a duty, not a unit. You must apply
this page's obligations to all nine.

| Function                   | 中文     | Axis       | What it owns                                                                                                                                                                                                       |
| -------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Information acquisition    | 信息采集 | Vertical   | Acquiring data from external sources: methods, stability, source authorization, and compliance.                                                                                                                    |
| Development and production | 开发生产 | Vertical   | Professional ownership of minute-level, tick, and snapshot data; and, as the production center, the development, release, scheduling, checks, backfill, and long-term operation of all data in production.         |
| Analysis and modeling      | 分析建模 | Vertical   | Daily and lower-frequency structured data other than alternative data: its meaning, metrics, and models; and, as the semantic center, the trading calendars, time zones, and corporate actions all data relies on. |
| Data science               | 数据科学 | Vertical   | Alternative data at any frequency: its value, research usability, isolation, and protection against look-ahead bias.                                                                                               |
| Platform engineering       | 平台工程 | Vertical   | The shared data platform, as the capability center: ingestion and landing, processing and warehousing, data-governance tooling, evaluation support for data science, and internal tools.                           |
| Infrastructure             | 基础设施 | Vertical   | The resource center: compute (including AI compute), storage, network, and cloud resources, with their capacity, reliability, and cost.                                                                            |
| Paradigm research          | 范式研究 | Horizontal | The department's technical direction, such as agents and big data.                                                                                                                                                 |
| Product governance         | 产品治理 | Horizontal | Data services and products: their value, admission, permissions, and exit.                                                                                                                                         |
| Operations and delivery    | 运营交付 | Horizontal | Department operations, priorities, resources and dependencies, and the delivery of projects.                                                                                                                       |

You must assign responsibility for the actual work. You must distinguish its
output, the activities that produce or support it, and who decides and accepts
it. The following responsibilities may overlap in one person or team. You must
assign them through the department's current role and authority arrangements;
this page defines data-work obligations, not seats or reporting lines.

| Responsibility | Work that must be owned                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Domain         | Define meaning, quality requirements, suitable use cases, and professional judgments.                                                   |
| Production     | Ensure deployability, backfill, monitoring, recovery, and reliable long-term operation.                                                 |
| Platform       | Abstract repeated, cross-domain capabilities needed for durable operation without replacing domain judgment.                            |
| Governance     | Define asset and use admission, permissions, lineage, review, veto, and exit, and make those controls work in the actual workflow.      |
| Delivery       | Make priorities, resources, dependencies, risks, and open decisions visible without replacing the other owners' professional judgments. |

Every data item must have a domain owner, a production owner once it enters
production, platform support, and governance and delivery interfaces. Unless
the department's role and authority arrangements say otherwise, they fall to
the functions this way. The domain owner is the function that knows the kind
and frequency of the data: development and production for minute-level, tick,
and snapshot data; analysis and modeling for daily and lower-frequency
structured data other than alternative data; and data science for alternative
data. Information acquisition owns the acquisition step, not the data's
meaning. Trading calendars, time zones, and corporate actions stay with
analysis and modeling for all data. Once the data enters production,
development and production owns its production; before that, research needs
no production operation. Platform engineering supplies shared capabilities and
infrastructure supplies resources. Product governance and operations and
delivery provide the governance and delivery interfaces. One function may hold
several of these responsibilities for an item, but no responsibility may
absorb another.

Cross-domain work should have one accountable task lead and clear professional
interfaces. You should explain any different arrangement; accountability remains
mandatory. For each result or decision of [L1 or L2
work](charter.md#form-follows-risk), you must name its accountable owner,
decision mandate, and acceptor in the existing work or product record. These
assignments may be held by the same person where authority and risk permit. A
shared interface does not transfer responsibility or grant authority over
another owner's judgment. You must use the [charter's interface
contract](charter.md#form-follows-risk) to make each side's needs and delivery
evidence explicit.

### Assign Modeling and Lifecycle Decisions

You must keep these decisions distinct when planning a data change:

| Decision           | What must be settled                                                                                                                                     | Accountable owner                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Business modeling  | Entities, relationships, rules, and metric meanings.                                                                                                     | Authorized domain owners.                                                 |
| Data modeling      | Grain, identifiers and keys, constraints, time and version rules, and representation of the agreed meaning.                                              | Named data-model owner; shared definitions need one owner across domains. |
| Development        | Preservation of the agreed model in implementation, tests, and interfaces.                                                                               | Development owner.                                                        |
| Technical choices  | Architecture, compatibility, reliability and capacity limits, shared standards, and dependencies.                                                        | Technical owner acting within the existing mandate.                       |
| Product management | Intended consumers, use, value, acceptance, and evolution; consumer impact, versioning, migration or deprecation notice, and evidence before retirement. | Product owner for the asset or service.                                   |

You must bring conflicting meanings to the authorized domain owners. Choosing a
convenient schema does not resolve that conflict, and a technical decision
cannot grant business or use permission.

Asset governance retains permission and exit controls; production retains
release and recovery. The task lead coordinates the decisions without taking
over their owners' authority. You must apply the department's existing
assignments; these responsibilities do not require separate people or teams.

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

Compare the old and proposed joins on the same source snapshot and reporting
cutoff. Agree on the expected entities, reporting grain, and valid time ranges
with the business and data-model owners before interpreting the differences:

- Compare old and proposed match status to identify lost and newly matched
  entities. Investigate unmatched rows, distinguishing intended coverage changes
  from missing or incorrect mappings.
- Inspect one-to-many matches for duplicate report rows and inflated aggregates.
  A valid identifier column does not establish the expected join cardinality.
- Inspect renamed, merged, or split entities at the affected dates. Confirm that
  the mapping preserves the agreed identity and time rules for historical uses.

Trace material differences through the dependent report to the underlying rows.
Matching row counts or totals alone cannot establish that the same entities
were matched. Keep the comparison, unexplained differences, and the report
owner's verification with the existing migration evidence.

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

You must keep these details with the [existing work
evidence](deliver.md#evidence-sets-the-limit-of-the-claim). You must apply the
[charter's risk-level safeguards](charter.md#form-follows-risk), including
independent review for L2 work. The existing authority may also require
specialist review. Neither removes implementation quality responsibility or
requires a new testing team. Verification supports acceptance, use admission,
and release decisions; passing checks cannot grant them.

### Change Shared or Production Data

Changes to production, shared assets, or critical management chains (data
chains that feed key management decisions or reports) require:

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
