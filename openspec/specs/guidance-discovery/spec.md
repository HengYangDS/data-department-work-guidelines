# guidance-discovery Specification

## Purpose

Help a member or Agent find the current rule and its limits for a real data-
department task without mistaking navigation, methods, or historical records for
another source of authority.

## Requirements

### Requirement: Task-oriented guidance discovery

The repository SHALL provide one concise human entry and one bounded Agent
entry. The human entry SHALL link to a task map, not repeat its topic inventory.
For data qualification, analysis, delivery, communication, delegation, or rule
revision, the route SHALL identify the applicable normative topic, scope,
decision owner, and next action without unrelated reading. The map MAY
summarize history only as non-normative context, never as a current rule or
proof.

#### Scenario: Member qualifies data for use

- **WHEN** a member asks whether a dataset may support a decision
- **THEN** the repository entry leads through the map to the data qualification
  requirements, the use boundary, and the actor who can accept the result
- **AND THEN** the route does not present repository proof as data-quality
  evidence.

#### Scenario: Agent prepares a bounded task

- **WHEN** an Agent receives a task to analyze an anomaly
- **THEN** the Agent entry routes to the relevant decision and evidence rules
- **AND THEN** the Agent can state the missing facts and stop conditions before
  proposing an action.

#### Scenario: Repository entry is revised

- **WHEN** a maintainer updates the set of topic routes
- **THEN** the task map owns that inventory, and the repository home page links
  to the map without carrying a second topic table
- **AND THEN** any historical note remains explicitly non-normative.

### Requirement: Unique normative owner

Each current general obligation SHALL have one editable normative owner.
Navigation, examples, methods, decision records, and repository governance MAY
cite that owner but SHALL NOT independently redefine it. The normative source
declaration SHALL resolve to those current owners.

#### Scenario: One rule is revised

- **WHEN** a maintainer changes an accepted general obligation
- **THEN** one normative topic is edited and its consumers are updated by link
  or reference
- **AND THEN** no second live paragraph must be independently synchronized to
  preserve the same obligation.

### Requirement: Evidence-bounded use claim

Guidance and repository checks SHALL distinguish the ability to read a rule, the
completion of a source change, the observed result of real work, and the
publication of a repository revision. A team-adoption or quality-improvement
claim SHALL require actual use observations with source, time, subject, and
reviewer; format, link, local proof, or CI success alone SHALL NOT establish it.

#### Scenario: Documentation checks pass without a real trial

- **WHEN** the repository validates and publishes guidance but has no accepted
  observation from a real team task
- **THEN** it may report the source and delivery checks that passed
- **AND THEN** it does not report team adoption or improved work quality.

### Requirement: Task routes preserve the work-quality contract

The entry and seven topics SHALL preserve the unified guideline's duties without
a root monolith. Readers SHALL find hard boundaries, risk-scaled minimums, six
task boundaries, work states, evidence limits, and learning triggers. Resolving
the matter, testing judgment within its limits, and improving the system for the
next occurrence SHALL remain distinct outcomes. Each topic SHALL expose start,
stop, and verification cues without a second card inventory.

#### Scenario: A high-risk task enters the route

- **WHEN** a member starts a production, sensitive-data, destructive, or
  externally binding task
- **THEN** the charter exposes the L2 authorization, recovery, independent
  review, and human acceptance floor
- **AND THEN** the task's six boundaries can be found without reading unrelated
  topics.

#### Scenario: A result is called complete

- **WHEN** a member or Agent reports a deliverable
- **THEN** the delivery topic distinguishes executing, verified, accepted, and
  published or effective states
- **AND THEN** the claim does not outrun its current subject-bound evidence.

#### Scenario: Repeated weak signals appear

- **WHEN** small failures, drift, or human rescue recur before the next review
- **THEN** the evolution topic requires immediate pattern and impact review and
  the lightest effective prevention mechanism
- **AND THEN** the periodic floor does not postpone risk escalation.

#### Scenario: A delivery plan omits cost or intermediate commitments

- **WHEN** a plan identifies dependencies and people but omits costs,
  milestones, constraints, or observable checkpoints
- **THEN** the delivery topic identifies those missing execution commitments
- **AND** adding a longer plan or more people does not satisfy that duty.

#### Scenario: Written data policy does not operate in the workflow

- **WHEN** admission, permission, review, veto, or exit controls exist only as
  written policy
- **THEN** the data topic requires the governance owner to make them operate in
  the actual workflow
- **AND** delivery coordination neither hides unresolved decisions nor grants
  authority over professional judgments.

#### Scenario: Repeated personal intervention becomes routine

- **WHEN** recurring work depends on one person's rescue
- **THEN** the evolution topic assigns managers responsibility to prevent that
  dependency from becoming the normal operating model
- **AND** monthly and quarterly review do not delay a necessary correction.
- **AND WHEN** a supervisor coaches a member through a consequential task
- **THEN** the coaching examines the member's reasoning rather than deciding the
  conclusion for them.

#### Scenario: Meaning or purpose changes without disclosure

- **WHEN** a central concept changes meaning within an analysis or an exchange
  hides whether it seeks information, discussion, or a decision
- **THEN** the analysis and communication topics require stable meanings and an
  explicit exchange purpose
- **AND** objective, measured language carries the reasoning without slogans or
  pretended depth.

#### Scenario: A time-valid sample hides selection bias

- **WHEN** historical research selects only instruments or periods with complete
  coverage, even though each selected value was knowable at the decision time
- **THEN** the data topic requires examining sample-selection bias
- **AND** it requires explaining how missingness, delay, conflict, and anomalies
  affect the conclusion, with confidence and unsupported conclusions stated.

#### Scenario: An Agent lacks a nonessential presentation preference

- **WHEN** the task, authoritative facts, permissions, and safe direction are
  established but a presentation preference is unspecified
- **THEN** the Agent should continue with reasonable stated assumptions
- **AND** missing facts or authority, material direction changes, and
  irreversible risk still stop the affected action for clarification.

### Requirement: Semantic coverage requires editorial review

Editorial review SHALL compare each unique duty and important counterexample
with the former accepted guideline. An unaccepted draft MAY inform this only
when exact bytes and provenance exist; it is not current authority. Each duty
SHALL have one current owner or an explicit authorized removal reason. Short
prose, matching headings, and prior checklist claims SHALL NOT prove coverage.
Redundant rule, playbook, evidence, and template stores SHALL NOT return by
default.

#### Scenario: Earlier prose contains a unique duty

- **WHEN** an editorial comparison finds a concrete counterexample or stop
  condition in the former unified guideline that the current topic does not
  express
- **THEN** the current topic is amended or a reasoned, authorized removal is
  recorded in the official Change
- **AND THEN** the retired draft is not promoted into a second live rule tree.

### Requirement: Point-of-use analysis, data, and Agent boundaries

Analysis SHALL divide the whole problem into non-overlapping parts tied to
the governing decision. Exploratory data or code SHALL NOT enter a shared,
production, or decision path until meaning, quality, permission, and
reproducibility are qualified. Parallel Agent work SHALL default to independent
read-only review with one integrator; reports SHALL expose evidence, limits,
and human responsibility.

#### Scenario: An analysis is split into parts

- **WHEN** a member decomposes a material problem before proposing options
- **THEN** the decision topic requires one classification axis, non-overlapping
  parts that together cover the problem, and a link from each part back to the
  decision the analysis supports
- **AND THEN** a longer list or polished prose does not substitute for the
  missing model.

#### Scenario: Exploratory work enters a shared path

- **WHEN** exploratory code or temporary data is proposed for shared,
  production, or decision use
- **THEN** the data topic requires qualified meaning, quality, permission, and
  reproducibility before that promotion
- **AND THEN** exploration remains available without being mislabeled as an
  admitted asset.

#### Scenario: An Agent completes delegated work

- **WHEN** an Agent reports completion or hands work back to a person
- **THEN** the collaboration topic makes the subject, actual changes, current
  verification, evidence location, risks, assumptions, unresolved matters, and
  next responsible actor and time explicit
- **AND THEN** a human still verifies and accepts the consequential result.

#### Scenario: Parallel Agents inspect one task

- **WHEN** independent Agent subtasks are assigned in parallel
- **THEN** research and review default to read-only work with explicit scope
  and stop conditions
- **AND THEN** one integrator owns the combined result, and a person remains
  responsible for consequential acceptance.

### Requirement: Feedback combines events and periodic review

Evolution SHALL check material task transitions, calibrate real work and
weak signals at least monthly, and review rules and tools for net benefit at
least quarterly. High-risk signals SHALL be escalated when observed, not held
for a calendar. Reviews SHALL reuse existing carriers and SHALL NOT require a
new meeting, fixed duration, or department-wide activity report.

#### Scenario: Weak signals accumulate without an incident

- **WHEN** a month passes without a single event that forces a systemic review
- **THEN** responsible people inspect real work and recurring weak signals in
  an existing carrier and decide whether a mechanism needs correction
- **AND THEN** a quarterly review tests whether current rules and tools still
  return more value than they cost, without staging a ceremonial new meeting.

### Requirement: Decision framing preserves operational constraints

Problem framing SHALL name time, cost, compliance, technical, and resource
constraints. A central concept SHALL retain one meaning within a discussion.
Execution plans SHALL expose resources, costs, milestones, and checkpoints.
Once a decision is made, its choice, authorized decision owner, actual date, and
basis SHALL be recorded in the existing work carrier.

#### Scenario: A proposed plan hides a limiting constraint

- **WHEN** a proposal omits a cost, compliance, technical, or resource limit
  that could change the decision
- **THEN** the analysis topic requires that limit in the problem frame
- **AND** the delivery plan makes its cost and intermediate commitments visible.

#### Scenario: A deadline is presented as a decision record

- **WHEN** a record names a future decision deadline or a fact cutoff but omits
  when the authorized person actually made the choice
- **THEN** the analysis topic requires the actual decision owner, date, and basis
- **AND** the deadline does not establish approval or authorize execution.

### Requirement: Data roles retain operational responsibility

Domain owners SHALL make professional judgments. Production owners SHALL
ensure reliable long-term operation. Governance owners SHALL make admission,
permission, lineage, review, veto, and exit controls operate in the workflow.
Delivery owners SHALL expose priorities and unresolved decisions without
assuming authority over the other owners' judgments.

#### Scenario: Coordination substitutes for a domain or governance decision

- **WHEN** delivery coordination proposes a use without domain judgment or
  operative governance review and controls
- **THEN** the data topic identifies the responsible owners and missing decision
- **AND** a coordination role cannot grant itself the missing authority.

### Requirement: Communication and coaching preserve judgment

Communication SHALL state its purpose and keep an objective, measured tone.
Meetings SHALL return to the decision question when discussion drifts. Deadline
risks SHALL name the escalation owner and trigger before harm grows.
Coaching SHALL examine a member's reasoning without making the judgment for
them. Managers SHALL NOT normalize recurring individual rescue. Agent
delegation SHALL name the deliverable's format, destination, audience, and
level of detail.

#### Scenario: Fluent delivery hides the purpose or the judgment owner

- **WHEN** an exchange leaves its purpose unstated, uses slogans instead of
  reasoning, substitutes the supervisor's conclusion for the member's, or
  leaves an Agent's deliverable ambiguous
- **THEN** the communication and evolution topics require a clear purpose,
  measured expression, and preserved member judgment
- **AND** recurring intervention requires a management-system correction.

### Requirement: Governance and decision reading follow the reader's task

Repository governance SHALL route contributors to change authority, publication,
quality, supply, and runner boundaries without duplicating the executable
contributor procedure. Its revised presentation SHALL preserve authority,
obligation strength, permissions, and evidence limits. Decision records SHALL
retain durable choices and meaningful alternatives, with a reviewable basis and
revisit condition; transient implementation work SHALL NOT require a DR.

#### Scenario: A contributor needs one governance boundary

- **WHEN** a contributor needs to edit, publish, install offline, or admit a
  runner
- **THEN** the governance entry leads to that boundary and its existing
  procedure
- **AND** the contributor does not need unrelated implementation detail before
  identifying the responsible owner and required evidence.

#### Scenario: A review proposes another decision record

- **WHEN** the existing choice or its official Change already explains the
  rationale, or the proposed record contains a command, task, or release result
- **THEN** the decision register routes to that owner instead of adding a DR
- **AND** existing accepted records preserve identity and choice while
  clarifying their alternatives, consequences, evidence, and revisit conditions.
