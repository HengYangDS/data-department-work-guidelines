# verification Specification

## Purpose

Define complete source verification, native proof prerequisites, execution
evidence, and shared CI admission without replacing OpenSpec or ETHOS authority.

## Requirements

### Requirement: Reader interpretation is reviewed without staged adoption theater

Representative member and Agent tasks SHALL be walked through the task routes
for correct rule selection and interpretation limits. A staged team-use trial
SHALL NOT be a release gate or substitute for naturally observed use.

#### Scenario: A member or Agent follows a task route

- **WHEN** a representative task requires a decision, data qualification, or
  delivery boundary
- **THEN** editorial review verifies that the task route selects the relevant
  rule and states its interpretation limit
- **AND THEN** this review is not reported as actual team adoption.

### Requirement: Common CI semantics have one CUE owner

Common CI topology, platform intent, admission, quality actions, and release
qualification SHALL have one CUE owner. Forge YAML SHALL be generated
projections; peer adapters SHALL own only necessary platform and transport
differences. Shared actions SHALL use existing native executors. Both peers
SHALL enforce the same non-writing drift check before effects. Local verification
and single-peer execution SHALL remain independent of an unavailable peer.

#### Scenario: Peer adapters preserve the common contract

- **WHEN** GitLab and GitHub projections are generated from the declared CUE source
- **THEN** both use the same task graph, platform intent, admission, quality
  actions, and release qualification
- **AND** peer adapters carry only necessary event mapping, permissions, runner
  selection, credentials, and asset transport
- **AND** equivalent shared action lists are not authored separately per peer.

#### Scenario: An authored YAML projection drifts

- **WHEN** a projected task, platform, trigger, or command is edited without its
  declared CUE source
- **THEN** generation check refuses before shared quality or release effects on
  either peer
- **AND** the check leaves the source and every projection unchanged.

#### Scenario: Only one publication peer is selected

- **WHEN** native execution selects one declared peer while the other is absent
  or unavailable
- **THEN** the common task and quality contract remains the same
- **AND** local and installed offline checks do not acquire an undeclared remote
- **AND** execution preserves exact signed source identity and claims only the
  observed peer's acceptance.

### Requirement: Proof uses only installed shared checks

The profile SHALL declare no proof gates. Installed ETHOS SHALL derive the applicable shared
checks from the authored Markdown, configuration, and OpenSpec artifacts, and its full host
graph SHALL be the one verification command, locally and on both Forges.

#### Scenario: A contributor runs the full source check

- **WHEN** a contributor runs the installed full host graph on committed source
- **THEN** installed ETHOS runs the shared checks applicable to that source
- **AND** no repository command, package, or authored test participates.

#### Scenario: A repository gate reappears

- **WHEN** a candidate adds a proof gate or a quality descriptor to the profile
- **THEN** review requires the duty it owns and refuses one that an installed
  check already owns
- **AND** passing repository commands do not replace a shared check's result.

### Requirement: Current commands and CI names remain executable

Current command examples SHALL be checked against the installed CLI. GitLab jobs SHALL name
purpose and platform symmetrically, and the installed common model SHALL own common source
steps without changing deadlines or review and protected isolation.

#### Scenario: A platform-less job or absent command is documented

- **WHEN** a runnable verification job lacks its platform or a current procedure
  names a command absent from its installed public owner
- **THEN** configuration validation or release review rejects that defect
- **AND** valid links, formatting, or an earlier successful job do not make the
  missing command or incorrect job identity acceptable.

#### Scenario: Windows verification events share a finite executor

- **WHEN** Windows review and protected-source jobs become eligible for the same
  project's finite executor
- **THEN** they declare one stable native project-scoped resource group,
  independent of the event and ref
- **AND** the installed projection check rejects missing or divergent
  reservations that generated-pipeline drift introduces
- **AND** separate runner identities and ref admission remain unchanged; the
  reservation does not prove isolation from another project.
