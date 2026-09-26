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

The concise entry and seven normative topics SHALL preserve the last accepted
unified guideline's distinct duties without a root monolith. For a relevant
task, members and Agents SHALL find hard boundaries, risk-scaled minimums, six
task boundaries, distinct work states, evidence-bounded completion, and learning
triggers. Rejected fixed cadence and redundant rule, playbook, or evidence
stores SHALL NOT return by default.

#### Scenario: A high-risk task enters the route

- **WHEN** a member starts a production, sensitive-data, destructive, or
  externally binding task
- **THEN** the charter exposes the L2 authorization, recovery, independent
  review, and human acceptance floor
- **AND THEN** the task's six boundaries can be found without reading unrelated
  topics.

#### Scenario: A result is called complete

- **WHEN** a member or Agent reports a deliverable
- **THEN** the delivery topic distinguishes executing, verified, accepted,
  and published or effective states
- **AND THEN** the claim does not outrun its current subject-bound evidence.

#### Scenario: Repeated weak signals appear

- **WHEN** small failures, drift, or human rescue recur
- **THEN** the evolution topic requires pattern and impact review and the
  lightest effective prevention mechanism
- **AND THEN** it does not require a fixed meeting calendar or new report.

### Requirement: Semantic coverage requires editorial review

Editorial review SHALL compare every unique obligation and important
counterexample with the former accepted edition and the unaccepted
criterion-system draft. Each substantive duty SHALL have one current owner or
an explicit authorized removal reason. Shorter prose, matching headings, or an
old checklist SHALL NOT establish semantic coverage.

#### Scenario: Earlier prose contains a unique duty

- **WHEN** an editorial comparison finds a concrete counterexample or stop
  condition in the former unified guideline that the current topic does not
  express
- **THEN** the current topic is amended or a reasoned, authorized removal is
  recorded in the official Change
- **AND THEN** the retired draft is not promoted into a second live rule tree.
