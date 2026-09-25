# quality Specification

## MODIFIED Requirements

### Requirement: Documentation checks measure supported properties

Documentation validation SHALL have one repository-owned, shell-independent
entrypoint using the locked toolchain. It SHALL check Prettier formatting of
Markdown, code, JSON, and YAML; TOML syntax; Markdown lint; CSpell spelling;
local links and fragments through an offline,
version-checked lychee invocation, metadata, every present diagram, tracked
English text and spacing, and repository-specific boundary and rollout
behavior. CI tool supply SHALL verify the lychee asset digest and run an online
locked-dependency audit separately from the offline repository verifier.
Current command examples SHALL be reviewed against the installed public CLI
before release rather than treated as parsed proof. The same entrypoint SHALL
run locally and in both hosted CI planes with explicit repository-relative
inputs. Tool configuration SHALL live at a required native discovery root or
one `.config/tools/` owner, not in redundant root copies. It SHALL NOT require
an arbitrary number of diagrams, cards, topic pages, or tracked historical
evidence files. It SHALL
reject a revived tracked shell wrapper or repository-owned hook. A portability
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
- **THEN** release review against the installed CLI reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.

#### Scenario: An obsolete shell carrier returns

- **WHEN** a candidate adds a `.sh` file, tracked `.githooks/` file, or old
  `scripts/` entrypoint
- **THEN** the portable repository check rejects it before source acceptance
- **AND THEN** native ETHOS hooks remain the only Git admission mechanism.

#### Scenario: Prose or dependency supply fails

- **WHEN** a current Markdown file contains a misspelling
- **THEN** the locked spelling check rejects it without a local waiver.
- **WHEN** the locked dependency audit reports a moderate-or-higher advisory
- **THEN** each hosted job fails before running the repository verifier.

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
