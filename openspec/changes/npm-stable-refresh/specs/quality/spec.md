# quality

## MODIFIED Requirements

### Requirement: The actual package manager conforms before execution

The repository SHALL declare one exact npm version through
`package.json`'s native `devEngines.packageManager` contract with
`onFail: error`. npm SHALL reject a version mismatch before installation,
`ci`, or run effects. An installed executable, host version, or Node major
SHALL NOT substitute for observing the actual consuming npm command.

#### Scenario: A contributor selects Node's older bundled npm

- **WHEN** a contributor invokes install, `ci`, or run with npm 11.19.1 while
  the native repository declaration requires npm 12.2.0
- **THEN** native npm admission rejects the command before dependency or
  script effects occur
- **AND THEN** no repository-specific waiver or parser makes it green.

#### Scenario: A previous npm release is selected

- **WHEN** the destination selects npm 12.1.0 while source declares 12.2.0
- **THEN** native admission rejects installation or run effects
- **AND THEN** no waiver or private parser makes it green.

#### Scenario: The declared npm is selected

- **WHEN** the actual selected npm matches the exact native declaration
- **THEN** ordinary installation and repository checks run under that version
- **AND THEN** the version observation does not replace those checks.

#### Scenario: Windows has a separate global npm prefix

- **WHEN** npm's native launcher selects an upgraded global CLI rather than
  the Node-adjacent bundled CLI
- **THEN** programmatic calls resolve that same CLI through npm's native
  execution-path or prefix authority
- **AND THEN** failed native resolution stops execution instead of silently
  choosing a different package manager.
