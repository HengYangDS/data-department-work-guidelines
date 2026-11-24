## MODIFIED Requirements

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

- **WHEN** a department member or delegated Agent works in a function other
  than development and production: information acquisition, analysis and
  modeling, data science, platform engineering, infrastructure, paradigm
  research, product governance, or operations and delivery
- **THEN** the data-quality topic SHALL apply its shared requirements to that
  work as to development and production
- **AND** each function's professional responsibility and each owner's action
  authority remain distinct under these shared requirements.

#### Scenario: The data topic names the department's functions

- **WHEN** the data topic states where its obligations apply
- **THEN** it SHALL name nine functions: six vertical functions along the data
  value chain (information acquisition, development and production, analysis
  and modeling, data science, platform engineering, infrastructure) and three
  horizontal functions across them (paradigm research, product governance,
  operations and delivery)
- **AND** it SHALL state the data that development and production, analysis
  and modeling, and data science each own professionally, and which four
  vertical functions also hold the production, semantic, capability, and
  resource centers for all data
- **AND** it SHALL state how a data item's domain, production, platform,
  governance, and delivery responsibilities fall to the functions by default,
  where they MAY be held together but none SHALL absorb another
- **AND** it SHALL present the functions as areas of responsibility, not
  departments or an organization chart, and keep platform engineering apart
  from infrastructure.

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
  cases, and professional judgments; governance owners make asset admission, use
  admission, permissions, lineage, review, veto, and exit operate in the
  workflow
- **AND** when coordination proposes a use without domain judgment or operative
  governance controls, the data topic identifies the owners and missing decision
- **AND** a coordination role cannot grant itself the missing authority.

#### Scenario: One data owner assumes another owner's authority

- **WHEN** a domain owner treats a suitable use case as permission, or a
  governance reviewer changes business meaning through an asset-admission or
  use-admission review
- **THEN** the data topic preserves professional judgment and permission as
  distinct responsibilities
- **AND** suitable use, technical approval and passing tests SHALL NOT grant
  permission
- **AND** a shared interface or accountable task lead cannot grant the missing
  authority.

#### Scenario: Data-change criteria are defined but never accepted

- **WHEN** a production, shared-asset, or critical management-chain change is
  proposed, executed, or reported; a critical management chain is a data chain
  that feeds key management decisions or reports
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
- **AND** each result or decision of L1 or L2 work SHALL have an accountable
  owner, decision mandate and acceptor in the existing work or product record
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
