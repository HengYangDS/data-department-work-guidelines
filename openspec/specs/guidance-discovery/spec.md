# guidance-discovery Specification

## Purpose

Help a member or Agent find the current rule and its limits for a real data-
department task without mistaking navigation, methods, or historical records for
another source of authority.

## Requirements

### Requirement: Task-oriented guidance discovery

The repository SHALL provide one concise human entry and one bounded Agent
entry. The human entry SHALL hand off to one task-oriented documentation map
rather than repeat its topic inventory. For a data qualification, analysis,
delivery, communication, Agent delegation, or rule-revision task, the map or
Agent entry SHALL lead to the applicable normative topic, its scope and
responsible decision owner, and the next action without requiring unrelated
topics to be read first. Historical context MAY be summarized at the map but
SHALL NOT appear as another current rule or proof source.

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
