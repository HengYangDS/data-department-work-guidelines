# Spec Delta

## MODIFIED Requirements

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
