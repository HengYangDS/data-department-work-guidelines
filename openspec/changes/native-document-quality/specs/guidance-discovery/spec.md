# Spec Delta

## MODIFIED Requirements

### Requirement: Point-of-use analysis, data, and Agent boundaries

Analysis SHALL partition the whole problem along one axis. Promotion into shared,
production, or decision use SHALL require meaning, quality, permission and
reproducibility. Data states SHALL reflect every completion condition; timelines
SHALL distinguish availability from later queries. Parallel Agents SHALL default
to read-only work with one integrator. Human responsibility SHALL remain human.
Agents SHALL report the delivery state after reviewing complete claim-matched
results.

#### Scenario: A verification summary omits a finding

- **WHEN** a batch check exits successfully but a finding elsewhere in its
  native result reports that an input source was skipped
- **THEN** the collaboration topic requires the Agent to inspect the complete
  selected result before summarizing or retaining decisive excerpts
- **AND** a successful summary or exit status does not replace that inspection,
  and no new report store or approval step is required.

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
- **AND** the report names its goal, scope, and actual delivery state; partial
  or deferred work does not bypass completion conditions
- **AND THEN** a member checks the actual authority, inputs, changes, completed
  current-version verification, evidence limits, and follow-up ownership before
  accepting the consequential result; the author's or Agent's account cannot
  substitute for that inspection.

#### Scenario: A task lead delegates the final judgment

- **WHEN** a task lead delegates analysis or execution and sends the result to
  another authorized decision owner
- **THEN** the collaboration topic keeps the goal, boundary, risk, final
  judgment, end-to-end result, and escalation with the task lead
- **AND** that responsibility does not itself grant decision or acceptance
  authority.

#### Scenario: Parallel Agents inspect one task

- **WHEN** independent Agent subtasks are assigned in parallel
- **THEN** research and review default to read-only work with explicit scope
  and stop conditions
- **AND THEN** one integrator owns the combined result, and a person remains
  responsible for consequential acceptance.

#### Scenario: Shared Agent work lacks coordination or known ownership

- **WHEN** multiple Agents may change one shared source or worktree, or another
  Agent's session has unknown ownership
- **THEN** the collaboration topic prohibits uncoordinated edits and closing,
  overwriting, or cleaning up owner-unknown work
- **AND** deadline pressure or an integration role does not grant that authority.

#### Scenario: A later query is presented as historical availability

- **WHEN** a researcher can query a revised historical value now but cannot
  establish when the relevant user or system could first access it
- **THEN** the data topic separates availability from the later query time
- **AND** the researcher cannot use that query alone to establish point-in-time
  validity; exploratory work may continue within the stated evidence limit.

#### Scenario: A data-state label hides an unmet completion condition

- **WHEN** a dataset meets some completion conditions but lacks operational
  observation, identifiable ownership, or another required condition
- **THEN** the data topic requires an exploratory, temporary, limited-use, or
  awaiting-verification label rather than a fully qualified asset label
- **AND** a limited use needs its own evidence and permission; deployment or
  permission for that use does not satisfy the missing condition.

### Requirement: Task routes preserve the work-quality contract

Entry and seven topics SHALL retain hard boundaries, risk-scaled minimums, six
task boundaries, work states, evidence limits, and learning triggers. Problem
resolution, tested bounded judgment, and future system improvement SHALL remain
distinct. Topics SHALL expose start, stop, and verification cues without a root
monolith or duplicate cards. Agents SHALL stop affected actions and escalate for
an unidentified task owner, another person's unrecognized or uncommitted work,
or unknown ownership.

#### Scenario: An unchecked citation accompanies fluent work

- **WHEN** an analyst presents an unchecked secondhand figure as a fact in an
  otherwise fluent and complete decision memo
- **THEN** the evolution topic treats the citation as a hard risk
- **AND** fluency, effort, and Agent efficiency do not offset it; neither can
  Agent output replace responsibility.

#### Scenario: Continued work would cross a boundary or invent a fact

- **WHEN** an action would cross a permission, compliance, security, or data
  boundary, or continuing requires presenting a guess as fact
- **THEN** the Agent stops that affected action and escalates
- **AND** independent authorized work may continue without hiding the gap.

#### Scenario: An unsupported completion claim has already been sent

- **WHEN** a member or Agent discovers an actual hard-boundary breach, including
  a completion claim without matching evidence
- **THEN** the charter requires stopping the affected action, disclosing and
  correcting the breach within existing authority, and escalation according
  to risk
- **AND** stopping future work alone does not correct the prior breach.

#### Scenario: A project rule conflicts with department guidance

- **WHEN** a project rule conflicts with these guidelines or a higher constraint,
  even if the person considers the difference minor
- **THEN** the charter requires exposing the conflict and its impact for an
  authorized decision before acting
- **AND** guessing or choosing the convenient rule does not resolve the conflict.

#### Scenario: A high-risk task enters the route

- **WHEN** a member starts a production, sensitive-data, destructive, or
  externally binding task
- **THEN** the charter exposes the L2 authorization, recovery, independent
  review, and human acceptance floor
- **AND THEN** the task's six boundaries can be found without reading unrelated
  topics.

#### Scenario: A long-running or uncertain task crosses the L1 boundary

- **WHEN** work involves multiple options, material uncertainty, or a
  long-running commitment without crossing a role boundary
- **THEN** the analysis and delivery routes still require a reviewable existing
  work record for L1 and L2 work
- **AND** both routes refer to the charter's complete risk levels instead of
  narrowing the duty to cross-person or high-risk work.

#### Scenario: A result is called complete

- **WHEN** a member or Agent reports a deliverable
- **THEN** the delivery topic distinguishes executing, verified, accepted, and
  published or effective states
- **AND THEN** the claim does not outrun its current subject-bound evidence.

#### Scenario: High-impact work lacks necessary prevention

- **WHEN** high-impact or repeated work passes its immediate checks but the
  necessary test, monitor, rule, or recovery path is still missing
- **THEN** the delivery topic prohibits calling the work complete before leaving
  that improvement with its existing owner
- **AND** an extra report or evidence directory does not satisfy that condition.

#### Scenario: Repeated weak signals appear

- **WHEN** small failures, drift, or human rescue recur before the next review
- **THEN** the evolution topic requires immediate pattern and impact review and
  the lightest effective prevention mechanism
- **AND THEN** the periodic floor does not postpone risk escalation.

#### Scenario: One issue spans work cycles

- **WHEN** one unresolved issue affects successive work cycles under the same
  owner and project, without recurring or meeting another prevention trigger
- **THEN** the evolution topic still requires reusable prevention through the
  lightest effective existing owner
- **AND** a work record alone does not satisfy that duty, and no new report,
  template, or meeting is required.

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

#### Scenario: An authorized task has no accountable person

- **WHEN** standing read-only permission and verified datasets establish a safe
  task, but its request identifies no responsible person and no foreign work is
  encountered
- **THEN** the collaboration topic requires stopping the affected action and
  seeking that person
- **AND** general permission does not establish task accountability; no new
  role, approval gate, or report is required.

#### Scenario: Another person's unfinished work is recognized

- **WHEN** an Agent encounters another person's uncommitted work, even when its
  owner and purpose are known
- **THEN** the collaboration topic requires stopping the affected action and
  escalation
- **AND** recognizing the work does not authorize overwriting, cleaning, or
  continuing the affected action.

#### Scenario: Work ownership cannot be established

- **WHEN** encountered work has unknown ownership
- **THEN** the collaboration topic requires stopping the affected action and
  escalation, while preserving that work
- **AND** the Agent does not infer disposal or editing authority from a clean
  accepted branch or its own task.

#### Scenario: A reversible overwrite bypasses high-risk checks

- **WHEN** an overwrite can be rolled back but replaces existing source or data
  and is treated as L0 solely because it is reversible
- **THEN** the charter still includes overwrite in the L2 risk floor
- **AND** written decision, authorization, recovery, independent review, and
  human acceptance remain required; reversibility does not replace them.

#### Scenario: A delay or recurring dispute escapes mechanism analysis

- **WHEN** a delay or recurring dispute is dismissed as coordination noise
  instead of investigated as a possible mechanism problem
- **THEN** the decision topic requires the original symptom, timeline, affected
  subjects, competing explanations, and why prevention or detection failed
- **AND** a safe reproducer or observation plan and claim-matched regression
  remain necessary without another form, rule store, or meeting.

#### Scenario: A completion claim meets only some conditions

- **WHEN** a deliverable exists but a required check has not run and passed,
  required acceptance is missing, or another completion condition is unmet
- **THEN** the delivery topic refuses the complete claim until every condition
  holds for the actual subject, scope, version, and environment
- **AND** a nearby lifecycle state or planned check cannot fill the gap;
  independent authorized work may continue.

#### Scenario: An Agent expands a task through incidental changes

- **WHEN** an Agent has permission to change a repository but adds edits outside
  the agreed task scope
- **THEN** the collaboration topic requires action within both authority and
  scope, without incidental changes
- **AND** the member checks actual changes against both the agreed and reported
  scope; general permission, an accurate report, and a small diff do not expand
  it.

### Requirement: Feedback combines events and periodic review

Material task transitions SHALL be checked; observed high-risk signals SHALL be
escalated. The department head or appointed maintainer SHALL review work and
weak signals at least monthly; maintainers SHALL review rules, tools and
capability gaps at least quarterly. Reviews SHALL reuse sufficient existing
carriers and assess mechanisms, not rank people. A single metric SHALL NOT
represent personal worth; local metrics SHALL NOT represent overall work or
system value.

#### Scenario: Weak signals accumulate without an incident

- **WHEN** a month passes without a single event that forces a systemic review
- **THEN** the department head or an appointed guideline maintainer inspects
  real work and recurring weak signals in an existing carrier, calibrates how
  the team judges evidence, and decides
  whether a mechanism needs correction
- **AND THEN** a quarterly review tests whether current rules and tools still
  return more value than they cost, without staging a ceremonial new meeting.

#### Scenario: A routine metric is used to rank people

- **WHEN** a manager uses individual Agent-correction counts in monthly review
- **THEN** the evolution topic keeps the review focused on mechanism problems
  rather than ranking people
- **AND** a single metric cannot represent anyone's overall worth, while
  case-based feedback and coaching remain available.

#### Scenario: A local data metric stands for whole-system value

- **WHEN** a pipeline's record-count metric is presented as the overall value of
  a data asset or service without its use, quality, or cost boundaries
- **THEN** the evolution topic prohibits using the local metric for that overall
  judgment
- **AND** the metric remains available for its stated decision, source, period,
  and boundary; no new evaluator or ranking is required.

#### Scenario: Prevention is needed before the first failure

- **WHEN** a key judgment depends on tacit knowledge held by one or a few people,
  or material forgetting risk or repeated Agent work triggers a reusable
  prevention duty without a recorded failure
- **THEN** the evolution topic requires the lightest effective prevention in its
  existing owner, without waiting for an incident
- **AND** formal department-rule admission remains subject to its identifiable
  failure mode, bounded trial, ownership, and net-benefit checks.

#### Scenario: Downstream results do not reach their owner

- **WHEN** results, anomalies, or actual-use effects remain with a downstream
  consumer and the responsible owner cannot act on them
- **THEN** managers ensure that feedback returns promptly to that owner
- **AND** a later scheduled review does not substitute for the active feedback
  interface.

### Requirement: Decision framing preserves operational constraints

Problem framing SHALL name time, cost, compliance, technical, and resource
constraints. Each concept SHALL keep one meaning per discussion. Execution
plans SHALL name resources, costs, milestones, and checkpoints. Each decision
SHALL be recorded with its choice, authorized owner, actual date, and basis in
the existing work record. Analytical conclusions SHALL name confidence, limits,
and next verification; revision triggers or implementation steps SHALL NOT
replace that check.

#### Scenario: An analytical conclusion omits its next check

- **WHEN** a supplier-name matching analysis recommends keeping the current
  method, states confidence and sample limits, and names possible contrary evidence
  but no next verification action
- **THEN** the analysis topic requires that next check in the conclusion
- **AND** an implementation step or revision trigger does not satisfy that
  verification duty, and no new template or report is required.

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

### Requirement: Communication and coaching preserve judgment

Communication SHALL state its purpose in an objective, measured tone. Meetings
SHALL refocus discussion on its decision. Deadline risks SHALL name
escalation owners and triggers before harm grows. Responsible members and
supervisors SHALL jointly align on subject, boundary, and success criteria at
task start. Coaching
SHALL examine member reasoning, not decide for them. Managers SHALL NOT normalize
recurring rescue. Agent delegation SHALL name output format, destination,
audience, and detail.

#### Scenario: Fluent delivery hides the purpose or the judgment owner

- **WHEN** an exchange leaves its purpose unstated, uses slogans instead of
  reasoning, substitutes the supervisor's conclusion for the member's, or
  leaves an Agent's deliverable ambiguous
- **THEN** the communication and evolution topics require a clear purpose,
  measured expression, and preserved member judgment
- **AND** recurring intervention requires a management-system correction.

#### Scenario: A draft decision could be mistaken for acceptance

- **WHEN** a member presents an analysis, proposal, or decision document
- **THEN** its title names the subject, purpose, and document status
- **AND** its content or work-state claims do not substitute for visible
  document status.

#### Scenario: A member reports a failure or receives a review score

- **WHEN** a member exposes a problem honestly or receives scored feedback
- **THEN** managers protect honest disclosure and do not penalize honest
  uncertainty; scores describe delivery risk rather than label people
- **AND** exceptional practice requires evidenced net benefit, transferable
  methods, lower long-term complexity, and improved capacity for others.

#### Scenario: Task-start calibration omits its counterpart

- **WHEN** a responsible member begins capability-building work with an
  individual interpretation of its subject, boundary, and success criteria
- **THEN** the evolution topic requires the responsible member and supervisor
  to align jointly at task start
- **AND** later monthly sampling does not substitute for that calibration, and
  no new meeting or approval gate is required.

#### Scenario: New facts disprove a stated judgment

- **WHEN** verified new evidence overturns a position already communicated
- **THEN** the communication topic requires immediate correction
- **AND** the author does not defer that correction to the next meeting or
  periodic review, or conceal the disproved position behind background detail.

#### Scenario: A meeting decision has no execution commitment

- **WHEN** a meeting records a decision but names no owner, deadline, or
  completion criterion because no separate action item was created
- **THEN** the communication topic requires those commitments for the decision
  itself as well as for each action
- **AND** a transcript or collective agreement does not establish those duties.

### Requirement: Data roles retain operational responsibility

Domain owners SHALL define meaning, quality, suitable use and judgment.
Production owners SHALL ensure reliable long-term operation. Platform owners
SHALL abstract repeated cross-domain capability. Governance owners SHALL make
admission, permissions, lineage, review, veto and exit work in the workflow.
Delivery owners SHALL expose priorities and open decisions. Shared interfaces
SHALL NOT transfer responsibility or authority; suitable use SHALL NOT grant
permission.

#### Scenario: Coordination substitutes for a domain or governance decision

- **WHEN** delivery coordination proposes a use without domain judgment or
  operative governance review and controls
- **THEN** the data topic identifies the responsible owners and missing decision
- **AND** domain owners define meaning, quality requirements, suitable use
  cases, and professional judgments; governance owners make admission,
  permissions, lineage, review, veto, and exit operate in the workflow
- **AND** a coordination role cannot grant itself the missing authority.

#### Scenario: One data owner assumes another owner's authority

- **WHEN** a domain owner treats a suitable use case as permission, or a
  governance reviewer changes business meaning through an admission review
- **THEN** the data topic preserves professional judgment and permission as
  distinct responsibilities
- **AND** a shared interface or accountable task lead cannot grant the missing
  authority.

#### Scenario: Data-change criteria are defined but never accepted

- **WHEN** a production, shared-asset, or critical management-chain change
  defines acceptance criteria but has no actual acceptance against them
- **THEN** the data topic requires that acceptance before the result can be
  treated as an accepted change
- **AND** tests, a written checklist, or a deployment cannot substitute for it;
  acceptance follows the work's existing authority and does not add a ceremony.

## ADDED Requirements

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
