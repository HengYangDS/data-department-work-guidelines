# Spec Delta

## Purpose

Define point-of-use decision, data, collaboration, coaching, and feedback duties
for department work without adding authority or certifying team adoption.

## MODIFIED Requirements

### Requirement: Point-of-use analysis, data, and Agent boundaries

Analysis SHALL use a consistent classification basis at each level, cover the
governing decision's needs, and expose material gaps, relationships and
cross-cutting constraints. Shared, production or decision use SHALL require
meaning, quality, permission and reproducibility. Agents SHALL review complete
current claim-matched results and report evidence, limits and delivery state;
people SHALL retain responsibility. Delivery coordination SHALL NOT replace
other owners' professional judgments.

#### Scenario: A verification summary omits a finding

- **WHEN** a batch check exits successfully but a finding elsewhere in its
  native result reports that an input source was skipped
- **THEN** the collaboration topic requires the Agent to inspect the complete
  selected result before summarizing or retaining decisive excerpts
- **AND** a successful summary or exit status does not replace that inspection,
  and no new report store or approval step is required.

#### Scenario: A current state has no comparison baseline

- **WHEN** a member frames material work or an Agent plans its execution
- **THEN** problem framing names the comparison baseline as well as the current
  state, target, scope, constraints, and completion condition
- **AND** the Agent builds the smallest sufficient model before expanding
  details; neither collected material nor a long list replaces that model.

#### Scenario: An analysis is split into parts

- **WHEN** a member decomposes a material problem before proposing options
- **THEN** the decision topic requires a consistent classification basis at each
  level, coverage of every part needed for the decision, a link from each part
  back to that decision, and explicit material gaps, shared causes, and
  cross-cutting constraints without double-counting an effect
- **AND** the charter's limit against forcing reality into a single model
  applies
- **AND THEN** a longer list or polished prose does not substitute for the
  missing model.

#### Scenario: A change targets an unverified environment

- **WHEN** a member or Agent is about to make a change
- **THEN** members and Agents SHALL verify the actual target
  location, version, environment, current state, concurrent work, and recovery
  path before the change
- **AND** the collaboration topic links to that execution contract; a familiar
  name or successful check elsewhere does not verify the intended target.

#### Scenario: Decision readiness is mistaken for approval

- **WHEN** a proposal has sufficient evidence and options for a decision
- **THEN** its readiness SHALL NOT establish approval or acceptance
- **AND** the authorized decision owner SHALL decide separately before an action
  that requires that approval proceeds.

#### Scenario: Exploratory work enters a shared path

- **WHEN** exploratory code or temporary data is proposed for shared,
  production, or decision use
- **THEN** the data topic requires qualified meaning, quality, permission, and
  reproducibility before that promotion
- **AND THEN** exploration remains available without being mislabeled as an
  admitted asset.

#### Scenario: Exploratory data is acquired, processed, or used

- **WHEN** a member or Agent proposes acquiring, processing, or using exploratory
  data
- **THEN** exploration SHALL require permission for acquisition, processing, and
  intended use; Agents SHALL also stay within their delegated scope
- **AND** missing or unclear permission SHALL stop the affected action and be
  escalated to its authorized decision owner through existing authority
- **AND** unknown meaning, quality, or historical availability cannot supply that
  permission or extend an Agent's delegation.

#### Scenario: An authorized study lacks meaning, quality, or historical evidence

- **WHEN** acquisition, processing, and intended use are permitted, an Agent stays
  within its delegation, and meaning, quality, or historical availability remains
  unresolved
- **THEN** unknown meaning, quality, or historical availability MAY limit
  exploratory claims without stopping otherwise permitted exploration
- **AND** exploration may continue with matching limits on its conclusions,
  without requiring full durable-asset admission or a new approval procedure
- **AND** later promotion into shared, production, or decision use still requires
  qualification and authorization for that use.

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

#### Scenario: Delegated work reaches review and acceptance

- **WHEN** an Agent returns delegated work
- **THEN** the member SHALL examine the actual work and evidence before presenting
  them to the authorized acceptor
- **AND** acceptance SHALL compare the agreed conditions: unmet work returns for
  revision within the delegation; met work is accepted, recorded and handed off
- **AND** those roles MAY belong to the same person unless current authority
  requires a separate reviewer; no extra person or team is added for a label
- **AND** delegation and acceptance SHALL NOT expand permission or transfer
  responsibility; the complete decision remains readable without a diagram.

#### Scenario: A task lead delegates the final judgment

- **WHEN** a task lead delegates analysis or execution and sends the result to
  another authorized decision owner
- **THEN** the collaboration topic keeps the goal, boundary, risk, final
  judgment, end-to-end result, and escalation with the task lead
- **AND** the lead's judgment of delegated work does not replace other owners'
  professional judgments or decisions about permitted use
- **AND** that responsibility does not itself grant decision or acceptance
  authority.

#### Scenario: Parallel Agents inspect one task

- **WHEN** independent Agent subtasks are assigned in parallel
- **THEN** parallel Agents SHALL default to read-only work with explicit scope
  and stop conditions
- **AND THEN** one integrator SHALL own the combined result, and a person SHALL
  remain responsible for consequential acceptance.

#### Scenario: Shared Agent work lacks coordination or known ownership

- **WHEN** multiple Agents may change one shared source or worktree, or another
  Agent's session has unknown ownership
- **THEN** the collaboration topic prohibits uncoordinated edits and closing,
  overwriting, or cleaning up owner-unknown work
- **AND** deadline pressure or an integration role does not grant that authority.

#### Scenario: A later query is presented as historical availability

- **WHEN** a researcher analyzes historical data
- **THEN** historical analysis SHALL distinguish first availability to the
  relevant user or system from a later query time
- **AND** a query of a revised value cannot alone establish point-in-time
  validity; when first availability is unknown, exploratory work may continue
  within that stated evidence limit.

#### Scenario: A value became available after a simulated decision

- **WHEN** evidence establishes that a value first became available after the
  decision time simulated in historical research
- **THEN** the data topic identifies use of that value as information available
  at that earlier decision as invalid, rather than merely unproved
- **AND** it requires replacement or exclusion of the affected values and a new
  run of the affected analysis before the result can support use admission
- **AND** it distinguishes that demonstrated defect from missing availability
  evidence without granting the Agent permission or certifying adoption.

#### Scenario: A data-state label hides an unmet completion condition

- **WHEN** a member or Agent assigns or reports the state of a dataset
- **THEN** data states SHALL reflect every completion condition
- **AND** the data topic requires an exploratory, temporary, limited-use, or
  awaiting-verification label, not a fully qualified asset label, when
  operational observation, identifiable ownership, or another condition is missing
- **AND** a limited use needs its own evidence and permission; deployment or
  permission for that use does not satisfy the missing condition.

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

### Requirement: Review cadence remains purpose-bound

Weekly calibration, monthly mechanism review, and quarterly practice/capability
review SHALL be the active-work defaults. The department head or appointed
maintainer MAY adjust an interval from work volume, risk, change, and feedback
quality, recording a reason and next review time in existing work. All three
purposes SHALL remain covered without another mandatory meeting or report.

#### Scenario: An owner changes the review interval

- **WHEN** work volume, risk, change, or feedback quality justifies another
  interval
- **THEN** the responsible owner records the reason and next review time in the
  existing work record while preserving judgment, mechanism, and net-benefit
  and capability review
- **AND** urgent signals do not wait for the schedule, and trials or high-risk
  work are reviewed before evidence or authority expires.

### Requirement: Writing serves fidelity, clarity, and elegance

Writing SHALL preserve intended meaning without distortion, start from accurate
understanding, convey it clearly and fluently, and pursue expressive beauty
through aesthetic judgment, taste, and artistic and cultural refinement suited
to its subject and audience. Techniques SHALL serve these aims, not replace
their meanings. An editing fraction or fixed document shape SHALL NOT become
a writing standard.

#### Scenario: Editing removes necessary meaning or expressive quality

- **WHEN** an author revises a draft before sending it
- **THEN** wording that serves neither understanding, judgment, nor action is
  removed while facts, reasoning, limits, responsibilities, and expressive
  quality remain
- **AND** sentence rhythm, transitions, and form serve the audience; a shorter
  draft or source check does not prove semantic equivalence or aesthetic quality.

### Requirement: Delegation and coaching retain member judgment

Responsible members SHALL confirm subject, boundary, and success criteria with
the existing task owner. Supervisors SHALL coach that reasoning in
capability-building work without deciding for members. Routine work within an
established mandate SHALL NOT require extra supervisor approval. Agent
delegation SHALL name output format, destination, audience, and detail.

#### Scenario: Clear routine work needs no additional approval

- **WHEN** a member or Agent receives an already clear task within an established
  mandate
- **THEN** the applicable boundary is confirmed without another recital, work
  record, or supervisor approval merely to demonstrate compliance
- **AND** capability-building work retains joint task-start understanding, while
  extended or interrupted work keeps its continuation state at its existing owner.

### Requirement: Data roles retain operational responsibility

Domain owners SHALL define meaning, quality, suitable use and judgment.
Production owners SHALL ensure reliable long-term operation. Platform owners
SHALL abstract repeated cross-domain capability. Governance owners SHALL operate
admission, permissions, lineage, review, veto and exit in the workflow. Delivery
owners SHALL expose priorities, resources, dependencies, risks and open decisions.
Shared interfaces SHALL NOT transfer responsibility or authority. Owners SHALL
remain accountable.

#### Scenario: Research does not need a production feed

- **WHEN** a proposed use is a bounded research study rather than an operational
  feed
- **THEN** the data topic SHALL qualify meaning, quality, permission,
  reproducibility, and the research claim without requiring production operation
- **AND** any later promotion into production SHALL require matching operational
  safeguards and authorization before that use begins
- **AND** the data-use questions SHALL NOT impose a mandatory linear pipeline.

#### Scenario: Work is performed outside data production

- **WHEN** a department member or delegated Agent acquires information, analyzes
  or models data, develops software, performs data science, operates a platform
  or infrastructure, manages products or technical direction, governs a product,
  or delivers operational work
- **THEN** the data-quality topic SHALL apply its shared requirements across
  those activities and data production
- **AND** each role's professional responsibility and action authority remain
  distinct under that common contract.

#### Scenario: Feedback challenges the reason for using data

- **WHEN** observed use challenges the value hypothesis, data meaning, or
  quality assessment
- **THEN** feedback SHALL revisit those judgments through exploration
- **AND** continued or changed use requires matching evidence and authorization;
  feedback does not grant a new use.

#### Scenario: Coordination substitutes for a domain or governance decision

- **WHEN** cross-domain work is coordinated or data owners share an interface
- **THEN** cross-domain work SHOULD have one task lead, with any departure explained
- **AND** the charter SHALL define shared interfaces by each side's needs and
  delivery evidence
- **AND** domain owners define meaning, quality requirements, suitable use
  cases, and professional judgments; governance owners make admission,
  permissions, lineage, review, veto, and exit operate in the workflow
- **AND** when coordination proposes a use without domain judgment or operative
  governance controls, the data topic identifies the owners and missing decision
- **AND** a coordination role cannot grant itself the missing authority.

#### Scenario: One data owner assumes another owner's authority

- **WHEN** a domain owner treats a suitable use case as permission, or a
  governance reviewer changes business meaning through an admission review
- **THEN** the data topic preserves professional judgment and permission as
  distinct responsibilities
- **AND** suitable use, technical approval and passing tests SHALL NOT grant
  permission
- **AND** a shared interface or accountable task lead cannot grant the missing
  authority.

#### Scenario: Data-change criteria are defined but never accepted

- **WHEN** a production, shared-asset, or critical management-chain change is
  proposed, executed, or reported
- **THEN** production, shared-asset, and critical management-chain changes SHALL
  have actual acceptance against agreed criteria before the result can be
  treated as an accepted change
- **AND** tests, a written checklist, or a deployment cannot substitute for it;
  acceptance follows the work's existing authority and does not add a ceremony.

#### Scenario: Data work assigns responsibilities

- **WHEN** department work assigns outputs, activities, ownership, decisions or
  acceptance
- **THEN** the data topic SHALL explain that they may overlap in one person or
  team and are not an exhaustive list of department jobs
- **AND** these responsibilities SHALL NOT be presented as mutually exclusive
  departments
- **AND** existing organizational role and authority assignments SHALL select
  actual owners without a second seat or reporting matrix in these guidelines
- **AND** each important result or decision SHALL have an accountable owner,
  decision mandate and acceptor in the existing work or product record
- **AND** work SHALL distinguish outputs, activities, accountable ownership,
  decision mandates and acceptance
- **AND** business and data modeling, development, product management and
  technical management SHALL retain explicit responsibility for their distinct
  decisions
- **AND** the assignments SHALL NOT require a new team, record or approval step.

#### Scenario: A cross-domain model change preserves syntax but changes meaning

- **WHEN** an issuer-identifier change keeps a schema valid but changes report
  joins or exposes conflicting domain definitions
- **THEN** business-model owners SHALL settle the intended entities, relations,
  rules and metric meanings within their mandates
- **AND** a named data-model owner SHALL reconcile grain, identity, keys,
  constraints, time and version rules with that meaning across domains
- **AND** development SHALL test the implementation and affected interfaces;
  technical management SHALL settle architecture and compatibility within its
  mandate
- **AND** a task lead SHALL retain unresolved decisions rather than infer one
  owner's approval from another owner's successful check.

#### Scenario: A shared product is retired while a consumer still depends on it

- **WHEN** a shared dataset or interface is changed or proposed for retirement
- **THEN** its product owner SHALL identify intended consumers, use, value and
  acceptance, and own consumer impact, versioning, migration or deprecation
  notice, and retirement evidence
- **AND** governance SHALL retain permission and exit controls, while production
  SHALL retain release and recovery responsibility
- **AND** no local passing test SHALL substitute for an unresolved consumer
  migration or the required permission.

#### Scenario: Engineering and professional work requires verification

- **WHEN** work includes engineering, professional judgment or a model
- **THEN** professional owners SHALL verify their judgments and models
- **AND** engineering owners SHALL retain implementation and verification
  responsibility rather than hand quality to a separate testing stage
- **AND** engineering owners SHALL retain responsibility from requirements and
  design through implementation, verification, release, operational feedback and
  improvement as applicable
- **AND** existing work evidence SHALL identify agreed criteria, affected interfaces and
  migrations, actual inputs, version, environment, method, results, failed and
  uncovered cases, their disposition and unresolved-risk owners
- **AND** risk-based specialist or independent review SHALL follow current
  authority without transferring implementation responsibility or requiring a
  separate testing team
- **AND** verification SHALL NOT grant acceptance, use admission or release
  authority; a passing local test SHALL NOT establish consumer acceptance,
  permission for use or release authority while an affected interface or
  migration remains failed or unverified.
