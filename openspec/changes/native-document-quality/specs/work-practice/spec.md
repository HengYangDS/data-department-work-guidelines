# Spec Delta

## Purpose

Define point-of-use decision, data, collaboration, coaching, and feedback duties
for department work without adding authority or certifying team adoption.

## ADDED Requirements

### Requirement: Point-of-use analysis, data, and Agent boundaries

Analysis SHALL choose a useful decomposition tied to the governing decision and
make material gaps, relationships, and cross-cutting constraints explicit.
Promotion into shared, production, or decision use SHALL require meaning,
quality, permission and reproducibility. Agents SHALL review complete current
claim-matched results, then report evidence, limits, and the delivery state;
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
- **THEN** the decision topic requires a useful decomposition, a link from each
  part back to the decision, and explicit material gaps, shared causes, and
  cross-cutting constraints without double-counting an effect
- **AND** the charter's limit against forcing reality into a single model
  applies
- **AND THEN** a longer list or polished prose does not substitute for the
  missing model.

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

#### Scenario: A data-state label hides an unmet completion condition

- **WHEN** a member or Agent assigns or reports the state of a dataset
- **THEN** data states SHALL reflect every completion condition
- **AND** the data topic requires an exploratory, temporary, limited-use, or
  awaiting-verification label, not a fully qualified asset label, when
  operational observation, identifiable ownership, or another condition is missing
- **AND** a limited use needs its own evidence and permission; deployment or
  permission for that use does not satisfy the missing condition.

### Requirement: Feedback combines events and periodic review

Material task transitions SHALL be checked and high-risk signals escalated.
The department head or appointed maintainer SHALL review judgment, mechanisms,
and the net benefit of practices and capability development. Reviews SHALL
reuse sufficient existing carriers, assess mechanisms rather than rank people,
and respect metric limits. Managers SHALL resolve cross-domain conflicts and
long-standing open decisions in time for work to proceed.

#### Scenario: Weak signals accumulate without an incident

- **WHEN** periodic review is due or observed gaps require it
- **THEN** the responsible owner SHALL inspect real work samples and accumulated
  weak signals with the people who use the practices
- **AND** the review SHALL distinguish judgment calibration, mechanism
  correction, and net-benefit and capability assessment, with an actionable result
- **AND** any adjusted interval SHALL preserve those purposes and be revisited
  when work volume, risk, change, or feedback quality changes
- **AND** a trial or high-risk task SHALL be reviewed before its evidence or
  authorization expires; an urgent signal SHALL NOT wait for that review
- **AND** sufficient existing carriers SHALL be reused without a fixed sample
  count, meeting duration, or additional all-member meeting or report
- **AND** stricter applicable review requirements SHALL remain in force.

#### Scenario: A routine metric is used to rank people

- **WHEN** a manager uses a metric in individual feedback or review, including
  Agent-correction counts
- **THEN** the evolution topic keeps the review focused on mechanism problems
  rather than ranking people
- **AND** a single metric SHALL NOT represent personal worth, while
  case-based feedback and coaching remain available.

#### Scenario: A local data metric stands for whole-system value

- **WHEN** a local metric is used to assess work or system value, including a
  pipeline's record count
- **THEN** local metrics SHALL NOT represent overall work or system value; the
  evolution topic requires the use, quality, and cost boundaries of that judgment
- **AND** the metric remains available for its stated decision, source, period,
  and boundary; no new evaluator or ranking is required.

#### Scenario: Prevention is needed before the first failure

- **WHEN** a key judgment depends on tacit knowledge held by one or a few people,
  or forgetting or repeated Agent work creates material error, loss, repeated
  rescue, or coordination risk without a recorded failure
- **THEN** the evolution topic requires the lightest effective prevention in its
  existing owner, without waiting for an incident
- **AND** improving or linking sufficient existing prevention SHALL be preferred
  to creating another asset; repetition alone SHALL NOT require another file
- **AND** admission as department practice remains subject to its observed
  failure mode, bounded trial, ownership, and net-benefit checks.

#### Scenario: A data incident needs immediate containment

- **WHEN** a data error, production failure, or permission or compliance breach
  threatens data, production, downstream use, or compliance, and completing a
  record first would delay containment
- **THEN** whoever discovers it takes containment steps within existing authority
  and notifies the responsible data or production owner
- **AND** the person responsible for the affected work, usually the task lead,
  owns the response and follow-through
- **AND** inputs and versions needed to establish impact and verify a correction
  remain available
- **AND** a response beyond current authority is escalated to the decision owner;
  urgency does not grant permission or make an uncertain result reliable
- **AND** truth, accountable responsibility, and permission and compliance limits
  remain binding throughout the response
- **AND** the temporary decision records its maker, facts, authority, expiry,
  takeover owner, and rollback condition once the immediate risk is controlled
- **AND** verification covers affected data and dependent uses, and records and
  cause review are completed; repeated exceptions of the same kind become a
  mechanism problem
- **AND** organizational safeguards for members who expose problems remain
  distinct from data-incident containment; no ungrounded physical-safety scenario
  is introduced.

#### Scenario: Cross-domain owners cannot resolve a conflict

- **WHEN** a cross-domain conflict or long-standing open decision prevents
  affected work from proceeding
- **THEN** managers SHALL resolve it in time for work to proceed
- **AND** clarifying the participants or scheduling a later review alone does
  not discharge that responsibility.

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

### Requirement: Data roles retain operational responsibility

Domain owners SHALL define meaning, quality, suitable use and judgment.
Production owners SHALL ensure reliable long-term operation. Platform owners
SHALL abstract repeated cross-domain capability. Governance owners SHALL operate
admission, permissions, lineage, review, veto and exit in the workflow. Delivery
owners SHALL expose priorities and open decisions. Shared interfaces SHALL NOT
transfer responsibility or authority; suitable use SHALL NOT grant permission.
Owners SHALL be accountable.

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
  or models data, performs data science, operates a platform or infrastructure,
  governs a product, or delivers operational work
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

### Requirement: Communication and coaching preserve judgment

Communication SHALL state its purpose in an objective, measured tone.
Meetings SHALL refocus on their decision; deadline risks SHALL name escalation
owners and triggers before harm grows. Managers SHALL demonstrate judgment and
communication with concrete work examples and SHALL NOT normalize recurring
rescue. Writing and coaching SHALL preserve factual meaning, expressive quality,
member reasoning, and the existing decision authority.

#### Scenario: A manager sets standards only through abstract requirements

- **WHEN** a manager explains work standards only through abstract requirements
- **THEN** the evolution topic requires concrete work examples showing how the
  manager judges and communicates
- **AND** abstract expectations alone do not discharge the demonstration duty.

#### Scenario: Task-start calibration omits its counterpart

- **WHEN** a responsible member begins capability-building work with an
  individual interpretation of its subject, boundary, and success criteria
- **THEN** the evolution topic requires the responsible member and supervisor
  to align jointly at task start
- **AND** later periodic review does not replace that shared understanding
- **AND** no new meeting or approval gate is required.

#### Scenario: A simple delegation is already clear

- **WHEN** a low-risk request already makes its goal, scope, and completion
  condition clear
- **THEN** an Agent SHALL confirm the applicable boundary without a separate
  recital or another work record solely to demonstrate compliance
- **AND** extended or interrupted work SHALL retain the state needed for
  continuation in its existing work record.

#### Scenario: Fluent delivery hides the purpose or the judgment owner

- **WHEN** an exchange leaves its purpose unstated, uses slogans instead of
  reasoning, substitutes the supervisor's conclusion for the member's, or
  leaves an Agent's deliverable ambiguous
- **THEN** the communication and evolution topics require a clear purpose,
  measured expression, and preserved member judgment
- **AND** recurring intervention requires a management-system correction.

#### Scenario: A discussion clarifies the problem without a decision

- **WHEN** a discussion improves the shared model but no option is approved
- **THEN** communication SHALL name what became clearer and the remaining
  question without treating that understanding as approval or resolution
- **AND** an important update SHALL provide the decisive facts needed for its
  conclusion, not a fixed count of facts.

#### Scenario: A decision waits for the right time rather than more evidence

- **WHEN** an option has sufficient information but a timing condition prevents
  action
- **THEN** the decision topic identifies that condition and the action or
  observation that will resolve it, with a revisit time
- **AND** deferred work does not imply that evidence is always missing.

#### Scenario: An editing technique is mistaken for the writing standard

- **WHEN** an author treats removing filler, using precise words, or keeping a
  measured tone as the complete meaning of elegance
- **THEN** the communication topic states fidelity as faithful meaning, clarity
  as accurate understanding conveyed clearly and fluently, and elegance as
  expressive beauty with aesthetic judgment, taste, and artistic and cultural
  refinement
- **AND** revision attends to sentence rhythm, transitions, and fitting form
  while preserving actors, conditions, responsibilities, evidence, and limits
- **AND** source checks or a shorter draft do not establish aesthetic quality
  or semantic equivalence.

#### Scenario: A draft decision could be mistaken for acceptance

- **WHEN** a member presents an analysis, proposal, or decision document
- **THEN** its title names the subject, purpose, and document status
- **AND** its content or work-state claims do not substitute for visible
  document status.

#### Scenario: A shorter draft removes information needed to act

- **WHEN** an author shortens or reorganizes a draft before sending it
- **THEN** the communication topic asks whether the shorter version is clearer
  and still preserves the facts, reasoning, limits, and responsibilities
- **AND** the author keeps necessary wording and a useful arrangement when
  further cuts or a fixed shape would lose meaning or expressive quality.

#### Scenario: A meeting decision has no execution commitment

- **WHEN** a meeting records a decision but names no owner, deadline, or
  completion criterion because no separate action item was created
- **THEN** the communication topic requires those commitments for the decision
  itself as well as for each action
- **AND** a transcript or collective agreement does not establish those duties.

#### Scenario: New facts disprove a stated judgment

- **WHEN** verified new evidence overturns a position already communicated
- **THEN** the communication topic requires immediate correction
- **AND** the author does not defer that correction to the next meeting or
  periodic review, or conceal the disproved position behind background detail.

#### Scenario: A routine task meets its agreed outcome

- **WHEN** a task meets its commitment and hard boundaries without producing a
  transferable method or system improvement
- **THEN** the evolution topic does not require an exceptional result from every
  task
- **AND** essential prevention and agreed completion conditions still apply.

#### Scenario: Published guidance has not entered use

- **WHEN** a revision reaches its agreed publication destination but actual use
  has not been observed
- **THEN** the delivery topic SHALL distinguish publication from effective or
  in-use state, and neither SHALL establish improved team outcomes.

#### Scenario: A member reports a failure or receives a review score

- **WHEN** a member exposes a problem honestly or receives scored feedback
- **THEN** managers protect honest disclosure and do not penalize honest
  uncertainty; scores describe delivery risk rather than label people
- **AND** exceptional practice requires evidenced net benefit, transferable
  methods, lower long-term complexity, and improved capacity for others.

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
