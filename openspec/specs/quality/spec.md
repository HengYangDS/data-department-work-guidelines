# quality

## Purpose

Define the documentation repository's quality boundary: checks establish source
properties, not Change authority, remote delivery, or team adoption.

## Requirements

### Requirement: Repository boundary validation remains structural

The repository SHALL reject a live `docs/superpowers/` execution-method tree, a
date-named decision record, or an accepted decision record with malformed
identity or sections. Its boundary validator SHALL NOT claim to perform OpenSpec
lifecycle, material-path admission, proof, archive, or publication. Decision
status SHALL come from record metadata rather than status directories.

#### Scenario: Method carrier or malformed DR appears

- **WHEN** a repository change adds `docs/superpowers/`, a date-named decision
  record, or an accepted DR without its required identity and sections
- **THEN** the repository boundary check rejects that structural violation
- **AND THEN** lifecycle authority remains with ETHOS and official OpenSpec.

### Requirement: Decision records exclude execution logs

A current DR SHALL use a stable `DR-####` identifier, a lowercase `dr-####-*.md`
filename, and exactly Context, Decision, Alternatives Rejected, Consequences and
Boundary, and Evidence and Revisit as level-two sections. A DR SHALL contain
only durable rationale, not task progress, readiness state, command logs, or
acceptance reports. The validator SHALL reject executable shell syntax while
accepting natural-language discussion and evidence links.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the validator rejects the execution content
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts that prose.

#### Scenario: Decision rationale is checked

- **WHEN** a DR contains a transient delivery-state sentence instead of durable
  rationale
- **THEN** repository review moves that state to its owning Change or current
  status surface
- **AND THEN** the DR retains only the enduring choice and revisit trigger.

### Requirement: Default proof and root binding are distinct

The profile SHALL list exactly `docs-integrity` and `markdown-format` as
default gates and descriptors. Both SHALL use a repository-relative Node
entrypoint without executable bits or a POSIX shell. The former SHALL omit
formatting; the latter owns it, while standalone verification runs it once.
Installed ETHOS and Git-common hooks SHALL bind the selected worktree and
enforce admission without a tracked adapter or optional gate.

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

### Requirement: One portable documentation verifier measures source properties

One shell-independent locked verifier SHALL check Prettier formatting of
Markdown, code, JSON, and YAML; TOML syntax; Markdown lint; CSpell spelling;
offline, version-checked lychee links and fragments; metadata; English,
spacing, decision records, and navigation. The same entrypoint SHALL run
locally and on both CI planes with repository-relative inputs. Diagram, card,
topic, and tracked evidence counts SHALL NOT determine validity.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver or
  browser installation.

#### Scenario: A public check is invoked without a POSIX shell

- **WHEN** a supported host invokes `npm run verify` without a POSIX shell
- **THEN** the check uses the same repository-relative Node entrypoint
- **AND THEN** no repository-authored shell wrapper or browser is needed.

### Requirement: Tool supply and portability require executed checks

CI SHALL verify the pinned lychee digest and audit locked dependencies online,
separately from offline source verification. Public checks SHALL not require a
POSIX shell or host-specific absolute paths. Banning `.sh` files alone SHALL
not prove portability: each claimed OS must execute the complete graph.
Current command examples SHALL be reviewed against the installed public CLI
before release; parsed prose alone is not proof.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** release review against the installed CLI reports the stale instruction
- **AND THEN** a valid link or formatted code block does not hide it.

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

### Requirement: Retained repository text uses English

Tracked reader guidance, operations, decisions, changelog, OpenSpec artifacts,
code comments, and test prose SHALL be English. The validator SHALL reject CJK
in tracked or unignored candidate text with file and line. Human review SHALL
assess clarity and faithful translation. Git history remains unchanged;
translating a tracked archive SHALL NOT certify its earlier language or
lifecycle retroactively.

#### Scenario: A candidate reintroduces Chinese prose

- **WHEN** a tracked or unignored candidate text file contains a CJK character
- **THEN** the documentation gate fails and identifies its file and line
- **AND THEN** the failure does not claim to have assessed translation quality.

#### Scenario: An archived artifact is translated

- **WHEN** an archived OpenSpec artifact's present tracked text is translated
- **THEN** the original Git object remains recoverable and its historical
  meaning and identifiers remain unchanged
- **AND THEN** the translated artifact is not treated as fresh proof or as
  retrospective certification of the original work.
