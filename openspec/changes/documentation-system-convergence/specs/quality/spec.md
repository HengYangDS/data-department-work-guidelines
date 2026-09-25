# quality Specification

## MODIFIED Requirements

### Requirement: Documentation checks measure supported properties

Documentation validation SHALL have one repository-owned, shell-independent
entrypoint using the locked toolchain. It SHALL check Prettier formatting of
Markdown, code, JSON, and YAML; TOML syntax; Markdown lint; CSpell spelling;
offline, version-checked lychee links and fragments; metadata; tracked English
text and spacing; and repository-specific decision and navigation boundaries.
CI tool supply SHALL verify the lychee asset digest and run
an online locked-dependency audit separately from the offline verifier.
Current command examples SHALL be reviewed against the installed public CLI
before release rather than treated as parsed proof. The same entrypoint SHALL
run locally and in both hosted CI planes with repository-relative inputs. It
SHALL NOT require an arbitrary number of diagrams, cards, topic pages, or
tracked historical evidence files. A public check SHALL run without a POSIX
shell or a host-specific absolute path; merely banning `.sh` files SHALL NOT
count as portability evidence. A portability claim SHALL require the complete
declared graph to execute on each claimed host OS. Representative member and
Agent tasks SHALL be reviewed for
correct rule selection and interpretation limits before claiming reader
readiness.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver or
  browser installation.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** release review against the installed CLI reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.

#### Scenario: A public check is invoked without a POSIX shell

- **WHEN** a supported host invokes `npm run verify` without a POSIX shell
- **THEN** the check uses the same repository-relative Node entrypoint
- **AND THEN** no repository-authored shell wrapper or browser is needed.

#### Scenario: Prose or dependency supply fails

- **WHEN** a current Markdown file contains a misspelling
- **THEN** the locked spelling check rejects it without a local waiver.
- **WHEN** the locked dependency audit reports a moderate-or-higher advisory
- **THEN** each hosted job fails before running the repository verifier.

#### Scenario: A fresh supported host runs the full graph

- **WHEN** a maintainer installs the declared locked dependencies on a claimed
  host OS and invokes the single repository check
- **THEN** format, lint, links, and repository-specific validations
  run without a POSIX shell or a host-specific absolute path
- **AND THEN** missing tools fail visibly rather than being downloaded or
  silently skipped.

#### Scenario: Windows checks out the same text bytes

- **WHEN** Git checks out tracked text on a host with CRLF defaults
- **THEN** the repository's native `.gitattributes` rule selects LF
- **AND THEN** the same formatting check evaluates the same text bytes.

### Requirement: Default proof and root binding are distinct

The profile default `code_correctness_gates` SHALL be exactly `docs-integrity`
and `markdown-format`, and its profile-native descriptors SHALL be exactly that
same default floor. The installed ETHOS command and Git-common hooks SHALL
resolve the selected worktree and enforce write admission directly; no tracked
repository adapter or extra profile descriptor SHALL act as another authority.
The default proof commands SHALL invoke the same portable,
repository-relative entrypoint and SHALL not depend on executable bits or
POSIX shell availability. The `docs-integrity` command SHALL not rerun the
formatter already owned by `markdown-format`; the standalone full verifier
SHALL run that formatter once.

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

#### Scenario: Format is checked once per verification path

- **WHEN** a contributor invokes the standalone full verifier
- **THEN** formatting runs once before the remaining checks
- **AND WHEN** ETHOS executes the two default proof gates
- **THEN** `docs-integrity` omits formatting and `markdown-format` owns it.
