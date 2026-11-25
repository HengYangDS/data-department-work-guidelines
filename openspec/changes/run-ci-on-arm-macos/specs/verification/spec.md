## MODIFIED Requirements

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

- **WHEN** the repository validates its GitLab jobs
- **THEN** it declares no Windows job and therefore no Windows resource group
- **AND** a Windows job or reservation that generated-pipeline drift introduces
  fails the installed projection check
- **AND** separate runner identities and ref admission remain unchanged.
