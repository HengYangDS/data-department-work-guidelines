# quality

## ADDED Requirements

### Requirement: The actual package manager conforms before execution

The repository SHALL declare one exact npm version through
`package.json`'s native `devEngines.packageManager` contract with
`onFail: error`. npm SHALL reject a version mismatch before installation,
`ci`, or run effects. An installed executable, host version, or Node major
SHALL NOT substitute for observing the actual consuming npm command.

#### Scenario: A contributor selects Node's older bundled npm

- **WHEN** a contributor invokes install, `ci`, or run with npm 11.19.1 while
  the native repository declaration requires npm 12.1.0
- **THEN** native npm admission rejects the command before dependency or
  script effects occur
- **AND THEN** no repository-specific waiver or parser makes it green.

#### Scenario: The declared npm is selected

- **WHEN** the destination's actual npm matches the exact native declaration
- **THEN** installation and repository commands can execute their ordinary
  checks under that package manager
- **AND THEN** passing its version check does not replace those checks.

#### Scenario: Windows has a separate global npm prefix

- **WHEN** npm's native launcher selects an upgraded global CLI rather than
  the Node-adjacent bundled CLI
- **THEN** programmatic calls resolve that same CLI through npm's native
  execution-path or prefix authority
- **AND THEN** failed native resolution stops execution instead of silently
  choosing a different package manager.

### Requirement: Package-manager acquisition stays outside offline verification

Online ephemeral CI SHALL acquire the declared npm through its native
installer before repository dependency installation. Maintained native hosts
SHALL use their existing installation owner and qualify actual executable
selection. Local checks and offline bundle installation SHALL NOT download
or update a missing or mismatched package manager.

#### Scenario: An ephemeral hosted job starts with bundled npm

- **WHEN** online CI starts with a compatible Node and an older bundled npm
- **THEN** its explicit supply step derives the desired version from the one
  native declaration and installs it before the repository package command
- **AND THEN** the actual source and offline checks run under that version.

#### Scenario: Offline installation has the wrong package manager

- **WHEN** a host has the complete release bundle but selects a mismatched npm
- **THEN** installation fails under native package-manager admission without
  acquiring another package manager or installing repository dependencies
- **AND THEN** the failure is not reported as incomplete bundle supply.

### Requirement: Public bundle acquisition has no ambient CLI dependency

Public GitHub bundle acquisition SHALL use the declared Node runtime to download
the exact repository, tag, and asset without a Forge CLI or credential. GitLab
SHALL retain its project-scoped identity and refuse authenticated redirects.
Both SHALL bound download time and size and verify the pinned digest before
extraction; failed acquisition SHALL remove only its own failed output.

#### Scenario: A public release asset is acquired

- **WHEN** the public GitHub release has the exact declared tag and asset
- **THEN** Node downloads it without a CLI or credential and validates its digest
- **AND THEN** an existing verified file is not downloaded a second time.

#### Scenario: Public supply is missing or altered

- **WHEN** the requested asset is missing, oversized, unavailable, or altered
- **THEN** acquisition fails and removes only its own failed output
- **AND THEN** it does not fall back to another tag, origin, CLI, or credential.
