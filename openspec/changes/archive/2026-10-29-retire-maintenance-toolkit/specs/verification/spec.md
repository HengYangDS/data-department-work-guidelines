# Spec Delta

## REMOVED Requirements

**Reason:** The repository keeps no code, package, or proof gate of its own. The two document
roots, their behavior prerequisite, and the retained repository commands checked only the
dependency policy of the toolkit and its Changelog rules, which installed ETHOS now owns or which
this Change drops.

**Migration:** The added requirement below binds proof to the installed shared checks. Changelog
structure stays in `publication`, checked by installed ETHOS; comparison-link verification is
dropped by the maintainer's decision. Command and CI-name currency moves here from the retired
`tool-supply` capability.

### Requirement: Default proof and root binding are distinct

### Requirement: Product-owned code evidence accompanies document proof

### Requirement: Proof prerequisites retain product ownership

### Requirement: Retained repository commands keep native diagnostics and history

## ADDED Requirements

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
