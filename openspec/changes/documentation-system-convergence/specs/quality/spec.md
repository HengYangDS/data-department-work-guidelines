# quality Specification

## MODIFIED Requirements

### Requirement: Documentation checks measure supported properties

Documentation validation SHALL have one repository-owned, shell-independent
entrypoint using the locked toolchain. It SHALL check Prettier formatting,
Markdown lint, local links and fragments through an offline pinned lychee
invocation, metadata, every present diagram, current command examples, tracked
English text, and repository-specific boundary and rollout behavior. The same
entrypoint SHALL run locally and in both hosted CI planes with explicit
repository-relative inputs. It SHALL NOT require an arbitrary number of
diagrams, cards, topic pages, or tracked historical evidence files. A portability
claim SHALL require the complete declared graph to execute on each claimed host
OS, not merely a parser test or a moved shell wrapper. Representative member
and Agent tasks SHALL be reviewed for correct rule selection and interpretation
limits before claiming reader readiness.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** the repository check or review reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.

#### Scenario: A fresh supported host runs the full graph

- **WHEN** a maintainer installs the declared locked dependencies on a claimed
  host OS and invokes the single repository check
- **THEN** format, lint, links, rendering, and repository-specific validations
  run without a POSIX shell or a host-specific absolute path
- **AND THEN** missing tools fail visibly rather than being downloaded or
  silently skipped.

### Requirement: Default proof and root binding are distinct

The profile default `code_correctness_gates` SHALL be exactly `docs-integrity`
and `markdown-format`, and its profile-native descriptors SHALL be exactly that
same default floor. The installed ETHOS command and Git-common hooks SHALL
resolve the selected worktree and enforce write admission directly; no tracked
repository adapter or extra profile descriptor SHALL act as another authority.
The default proof commands SHALL invoke the same portable,
repository-relative entrypoint and SHALL not depend on executable bits or
POSIX shell availability.

#### Scenario: Root-binding contract is audited

- **WHEN** the repository validates `.ethos/profile.toml`
- **THEN** its accepted typed profile parses with exactly the two default gate
  descriptors
- **AND THEN** no optional `repository-root-binding` descriptor is present.

#### Scenario: Root binding is independently exercised

- **WHEN** a contributor runs the installed ETHOS command from an owned
  worktree and its Git-common hook protocol evaluates a staged path
- **THEN** both resolve that selected worktree and apply current admission
- **AND THEN** no repository shell adapter or optional gate changes the default
  proof floor.
