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

Entry and seven topics SHALL retain hard boundaries, risk-scaled minimums,
six task boundaries, work states, evidence limits, and learning triggers.
Problem resolution, tested bounded judgment, and system improvement SHALL stay
distinct. Topics SHALL expose start, stop, and verification cues without
duplicate cards or a monolith. Practice admission SHALL remain distinct
from mandatory prevention. Verified facts outrank prior commitments; Blocked
reports SHALL name gap, impact, and escalation.

#### Scenario: A current topic inherits an obsolete rule

- **WHEN** a rule, model, form, review schedule, or writing technique remains in
  a current topic from an earlier draft
- **THEN** the review SHALL assess its applicable authority, current work
  purpose, actionable conditions, and cognitive and maintenance cost against
  current instructions, verified facts, and department needs
- **AND** the rule SHALL be kept, clarified, merged, replaced, or retired with a
  justified disposition at the existing review owner
- **AND** neither its earlier presence nor the current topic layout SHALL
  establish that it is valid or mandatory
- **AND** binding applicable duties and hard boundaries SHALL remain intact;
  immutable historical text and evidence SHALL not be rewritten.

#### Scenario: Numbered clauses omit an original chapter introduction

- **WHEN** the retired guidelines are used to check the seven current topics
- **THEN** the review SHALL cover the complete original text, including chapter
  introductions, diagrams, action cards, templates, and final checks outside
  numbered subsections
- **AND** actor, action, obligation strength, permission, condition, authority,
  evidence, escalation, and revisit limits SHALL be compared at the topic owner
- **AND** each replacement, change, or removal SHALL have an explicit disposition
  grounded in current instructions, verified facts, and department needs
- **AND** retired text SHALL NOT become current authority or a restoration target
  merely because it appeared in the earlier source
- **AND** a heading count, byte-matched excerpt, refreshed hash, or passing
  source check cannot by itself establish semantic fidelity.

#### Scenario: A useful practice has an alternative

- **WHEN** a concept, role, process, tool, or document serves a current duty or
  produces evidenced net benefit, but another approach could also serve it
- **THEN** the charter SHALL assess purpose, applicable authority, and total
  cost rather than require the practice to be unique
- **AND** a clearer, lower-cost existing owner SHOULD carry the duty when
  consolidation provides that benefit.

#### Scenario: A compact reading form preserves the work

- **WHEN** a topic summarizes the working loop, data-use decisions, or human–AI
  collaboration
- **THEN** it SHALL use the clearest reading form for the question: ordered steps,
  a decision table, or a diagram that makes relationships easier to understand
- **AND** every stage, actor, directed relation, return condition, and authority
  limit SHALL remain explicit at the topic owner without relying on rendering
- **AND** any diagram SHALL keep its editable source and a complete same-section
  text equivalent beside the authoritative rules
- **AND** native accessible SVG titles and descriptions SHALL be retained where
  the grammar supplies them; text alternatives do not establish missing SVG
  labeling or screen-reader acceptance
- **AND** the complete rendered section SHALL be inspected at the actual desktop
  reading width
- **AND** a reading form, available route, or Agent report cannot establish
  permission, acceptance, adoption, or improved team outcomes.

#### Scenario: A project rule conflicts with department guidance

- **WHEN** a member authors, applies, or reviews a local project rule
- **THEN** local rules SHOULD reference shared guidelines rather than restate them
- **AND** a conflict with these guidelines or a higher constraint requires
  exposing the conflict and its impact for an authorized decision before acting,
  even when the person considers the difference minor
- **AND** guessing or choosing the convenient rule does not resolve the conflict.

#### Scenario: An authorized task has no accountable person

- **WHEN** standing read-only permission and verified datasets establish a safe
  task, but its request identifies no responsible person and no foreign work is
  encountered
- **THEN** Agents SHALL stop the affected action and escalate to identify the
  accountable task owner; the collaboration topic requires seeking that person
- **AND** general permission does not establish task accountability; no new
  role, approval gate, or report is required.

#### Scenario: A long-running or uncertain task crosses the L1 boundary

- **WHEN** work involves multiple options, material uncertainty, or a
  long-running commitment without crossing a role boundary
- **THEN** the analysis and delivery routes still require a reviewable existing
  work record for L1 and L2 work
- **AND** both routes refer to the charter's complete risk levels instead of
  narrowing the duty to cross-person or high-risk work.

#### Scenario: A high-risk task enters the route

- **WHEN** a member starts a production, sensitive-data, destructive, or
  externally binding task
- **THEN** the charter exposes the L2 authorization, recovery, independent
  review, and human acceptance floor
- **AND THEN** the task's six boundaries can be found without reading unrelated
  topics.

#### Scenario: A reversible overwrite bypasses high-risk checks

- **WHEN** an overwrite can be rolled back but replaces existing source or data
  and is treated as L0 solely because it is reversible
- **THEN** the charter still includes overwrite in the L2 risk floor
- **AND** written decision, authorization, recovery, independent review, and
  human acceptance remain required; reversibility does not replace them.

#### Scenario: An Agent expands a task through incidental changes

- **WHEN** an Agent has permission to change a repository but adds edits outside
  the agreed task scope
- **THEN** the collaboration topic requires action within both authority and
  scope, without incidental changes
- **AND** the member checks actual changes against both the agreed and reported
  scope; general permission, an accurate report, and a small diff do not expand
  it.

#### Scenario: A delivery plan omits cost or intermediate commitments

- **WHEN** a plan identifies dependencies and people but omits costs,
  milestones, constraints, or observable checkpoints
- **THEN** the delivery topic identifies those missing execution commitments
- **AND** adding a longer plan or more people does not satisfy that duty.

#### Scenario: An Agent lacks a nonessential presentation preference

- **WHEN** the task, authoritative facts, permissions, and safe direction are
  established but a presentation preference is unspecified
- **THEN** the Agent should continue with reasonable stated assumptions
- **AND** missing facts or authority, material direction changes, and
  irreversible risk still stop the affected action for clarification.

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

#### Scenario: An unchecked citation accompanies fluent work

- **WHEN** an analyst presents an unchecked secondhand figure as a fact in an
  otherwise fluent and complete decision memo
- **THEN** the evolution topic treats the citation as a hard risk
- **AND** fluency, effort, and Agent efficiency do not offset it; neither can
  Agent output replace responsibility.

#### Scenario: A familiar approach conflicts with new facts

- **WHEN** new verified facts contradict a familiar approach, tool, identity,
  document, or prior investment
- **THEN** the charter requires correcting the judgment from those facts
- **AND** loyalty or sunk cost does not justify preserving the old position.

#### Scenario: A delay or recurring dispute escapes mechanism analysis

- **WHEN** a delay or recurring dispute is dismissed as coordination noise
  instead of investigated as a possible mechanism problem
- **THEN** the decision topic requires the original symptom, timeline, affected
  subjects, competing explanations, and why prevention or detection failed
- **AND** a safe reproducer or observation plan and claim-matched regression
  remain necessary without another form, rule store, or meeting.

#### Scenario: Continued work would cross a boundary or invent a fact

- **WHEN** an action would cross a permission, compliance, security, or data
  boundary, or continuing requires presenting a guess as fact
- **THEN** the Agent stops that affected action and escalates
- **AND** independent authorized work may continue without hiding the gap.

#### Scenario: Another person's unfinished work is recognized

- **WHEN** an Agent encounters another person's uncommitted work, even when its
  owner and purpose are known
- **THEN** Agents SHALL stop the affected action and escalate; recognizing
  another person's work does not bypass that requirement
- **AND** recognizing the work does not authorize overwriting, cleaning, or
  continuing the affected action.

#### Scenario: Work ownership cannot be established

- **WHEN** encountered work has unknown ownership
- **THEN** Agents SHALL stop the affected action and escalate for unknown
  ownership, while preserving that work
- **AND** the Agent does not infer disposal or editing authority from a clean
  accepted branch or its own task.

#### Scenario: A blocked report omits its impact

- **WHEN** a member or Agent reports a prerequisite that blocks the affected
  action
- **THEN** the delivery topic requires the gap, its impact, and the escalation
- **AND** naming a blocker alone is not a complete work-state report.

#### Scenario: An unsupported completion claim has already been sent

- **WHEN** a member or Agent discovers an actual hard-boundary breach, including
  a completion claim without matching evidence
- **THEN** the charter requires stopping the affected action, disclosing and
  correcting the breach within existing authority, and escalation according
  to risk
- **AND** stopping future work alone does not correct the prior breach.

#### Scenario: Written data policy does not operate in the workflow

- **WHEN** admission, permission, review, veto, or exit controls exist only as
  written policy
- **THEN** the data topic requires the governance owner to make them operate in
  the actual workflow
- **AND** delivery coordination neither hides unresolved decisions nor grants
  authority over professional judgments.

#### Scenario: High-impact work lacks necessary prevention

- **WHEN** a rule, template, tool, Agent workflow, or platform mechanism is
  proposed for department-practice admission, or a task triggers mandatory prevention
- **THEN** department-practice admission of a rule, template, tool, Agent
  workflow, or platform mechanism SHALL require an observed failure mode, a
  bounded trial, a responsible owner, and evidence of net benefit
- **AND** mandatory task-specific prevention SHALL NOT wait for an incident;
  producing its asset SHALL NOT automatically standardize it as department practice
- **AND** high-impact or repeated work cannot be called complete while its
  necessary test, monitor, rule, or recovery path is missing from its existing owner
- **AND** an extra report or evidence directory does not satisfy that condition.

#### Scenario: Repeated weak signals appear

- **WHEN** small failures, drift, or human rescue recur before the next review
- **THEN** the evolution topic requires immediate pattern and impact review and
  the lightest effective prevention mechanism
- **AND THEN** the periodic floor does not postpone risk escalation.

#### Scenario: One issue spans work cycles

- **WHEN** one unresolved issue affects successive work cycles under the same
  owner and project and creates material error, loss, repeated rescue, or
  coordination risk, without meeting another prevention trigger
- **THEN** the evolution topic still requires reusable prevention through the
  lightest effective existing owner
- **AND** a work record alone does not satisfy that duty, and no new report,
  template, or meeting is required.

#### Scenario: Repeated personal intervention becomes routine

- **WHEN** recurring work depends on one person's rescue
- **THEN** the evolution topic assigns managers responsibility to prevent that
  dependency from becoming the normal operating model
- **AND** a scheduled review does not delay a necessary correction.
- **AND WHEN** a supervisor coaches a member through a consequential task
- **THEN** the coaching examines the member's reasoning rather than deciding the
  conclusion for them.

#### Scenario: A result is called complete

- **WHEN** a member or Agent gives an important update, reports a deliverable,
  or requests a work decision
- **THEN** every important update SHALL name current risks or blockers and its
  next action, responsible actor, deadline, and completion condition, including
  when it requests a decision
- **AND** the delivery topic distinguishes executing, verified, accepted,
  published, and effective or in-use states for reported deliverables
- **AND THEN** the claim does not outrun its current subject-bound evidence.

#### Scenario: A completion claim meets only some conditions

- **WHEN** a deliverable exists but a required check has not run and passed,
  required acceptance is missing, or another completion condition is unmet
- **THEN** the delivery topic refuses the complete claim until every condition
  holds for the actual subject, scope, version, and environment
- **AND** a nearby lifecycle state or planned check cannot fill the gap;
  independent authorized work may continue.

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

### Requirement: New verified facts govern current work

Current topics SHALL prefer verified facts to loyalty to earlier approaches,
tools, identities, documents, or sunk costs. Practice admission SHALL require
evidence and remain distinct from mandatory task-specific prevention. Blocked
reports SHALL state the prerequisite gap, its impact, and escalation.

#### Scenario: A familiar approach conflicts with verified facts

- **WHEN** new verified facts contradict a current approach or reveal a missing
  prerequisite
- **THEN** the responsible actor revises the judgment or reports the precise
  gap, impact, and escalation without concealing uncertainty
- **AND** necessary prevention remains binding without automatically admitting
  another department practice.
