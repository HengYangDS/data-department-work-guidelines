# Spec Delta

## MODIFIED Requirements

### Requirement: Default proof and root binding are distinct

The profile SHALL declare only `docs-integrity` and `markdown-format` as
default gates, plus the provider-only `code-behavior` prerequisite. Integrity
SHALL use a repository-relative Node command without shell or executable-bit
dependencies and SHALL omit formatting; installed `source-format` SHALL own it.
Behavior and static mappings SHALL select `code-behavior` and `markdown-format`
with their native kinds, evidence classes, offline policies, and trust status.

#### Scenario: Root-binding contract is audited

- **WHEN** installed ETHOS validates `.ethos/profile.toml`
- **THEN** its accepted typed profile has exactly the two default proof gates
  and the `code-behavior` prerequisite as its only other descriptor
- **AND** each required native prerequisite and quality axis names its verified
  owner in the accepted product graph, without another profile descriptor
- **AND THEN** no optional `repository-root-binding` descriptor is present.

#### Scenario: Root binding is independently exercised

- **WHEN** a contributor invokes installed ETHOS or its Git-common hook
  protocol evaluates work in a selected worktree
- **THEN** installed ETHOS and Git-common hooks SHALL bind the selected worktree
  and enforce current admission without a tracked adapter or optional root gate
- **AND THEN** no repository shell adapter or optional gate changes the default
  proof floor.

#### Scenario: Format is checked once per verification path

- **WHEN** a contributor invokes the installed full host graph
- **THEN** the installed `source-format` gate checks formatting without a
  second formatter provider in the default gates
- **AND WHEN** ETHOS executes the two default proof gates
- **THEN** `docs-integrity` omits formatting and `markdown-format` supplies
  static analysis only.

#### Scenario: A supporting check is disconnected or lacks verification

- **WHEN** a descriptor is outside the default dependency closure or a quality
  axis names a missing, disconnected, or unverified owner
- **THEN** the installed product rejects that policy before execution
- **AND** repository checks do not create a competing graph authority.

#### Scenario: A default gate changes its proof meaning

- **WHEN** the profile swaps a default dimension mapping or changes a gate's
  native kind, evidence class, offline policy, or trust-bearing status
- **THEN** the existing profile check rejects that exact contract mismatch
- **AND** the unchanged two-root profile remains valid with its `code-behavior`
  prerequisite, without another gate or a duplicate lifecycle implementation.

### Requirement: Product-owned code evidence accompanies document proof

`docs-integrity` SHALL depend on the product's verified native behavior
prerequisite; `markdown-format` SHALL supply native static diagnostics only.
Behavior and static-analysis axes SHALL name those owners for one tree. Native
tests SHALL run the complete Git-selected inventory once.
Accepted installed ETHOS SHALL enforce semantics, diagnostics, and subject
applicability on each required repository, refusing missing or misdirected
evidence and authored substitutes.

#### Scenario: Document command passes but native code fails

- **WHEN** the repository document command exits successfully but a tracked
  JavaScript test fails or production module is not exercised
- **THEN** ETHOS blocks full proof for the behavior axis
- **AND THEN** a repository-authored test report cannot turn the result green.

#### Scenario: Native code passes but a document command fails

- **WHEN** ETHOS obtains valid native code evidence but the `docs-integrity`
  document command fails
- **THEN** that gate and full proof remain blocked
- **AND THEN** native evidence does not excuse a broken document check.

#### Scenario: Both sides of each gate pass

- **WHEN** the document command and the required native evidence owners pass
  for the exact committed source
- **THEN** the two default gates and their necessary prerequisites satisfy the
  mapped runtime obligations
- **AND** shared semantic, diagnostic, and subject-applicability acceptance
  remains a separately verified ETHOS product obligation
- **AND THEN** no additional default gate or private lifecycle is required.

#### Scenario: Native syntax passes without semantic correctness

- **WHEN** a syntax-valid production function refers to an undefined identifier
  on a reachable but unexercised branch
- **THEN** source and proof descriptions distinguish syntax success from static
  semantic correctness
- **AND** shared acceptance remains open until the formally accepted installed
  product establishes the required property.

#### Scenario: Native reports omit an unapproved warning

- **WHEN** native tests emit an unapproved warning, whether or not their
  selected reports include it
- **THEN** native tests SHALL preserve the original warning
- **AND** documentation and completion claims identify any omission from the
  selected reports
- **AND** the passing report does not close the shared warning-handling
  obligation or authorize a repository-private replacement.

#### Scenario: Applicable scopes differ by subject

- **WHEN** the formal product contract permits different native scopes to
  jointly cover a required property
- **THEN** qualification checks each subject against its actual obligation
- **AND** it does not require every provider to cover every language or accept
  uncovered required subjects.

#### Scenario: One attempt supplies actual behavioral evidence

- **WHEN** the default document check selects its native behavior prerequisite
- **THEN** the actual native test executor runs the complete selected inventory
  once and its original reports cover each required production subject
- **AND** neither a wrapper nor a document gate replays tests or claims another
  owner's report as its own.

#### Scenario: Equivalent options cannot suppress native diagnostics

- **WHEN** a declared native command uses an equivalent warning-suppression or
  report-override option, including alternate separators or attached values
- **THEN** the product rejects the invocation before tests run
- **AND WHEN** ambient settings attempt to suppress an unapproved native warning
- **THEN** the original warning remains observable and blocks acceptance.

### Requirement: Proof prerequisites retain product ownership

Product-native prerequisites and quality axes SHALL belong to the accepted
ETHOS dependency graph and verified owners; beyond the provider-only
`code-behavior` prerequisite, the profile SHALL add no descriptors for them.
Native behavior evidence SHALL conjoin the `docs-integrity` command, and
`markdown-format` SHALL consist of native static diagnostics, for the same
source without authored substitute evidence.

#### Scenario: A profile attempts to replace native proof evidence

- **WHEN** a repository adds a descriptor or authored report instead of its
  required product-native prerequisite
- **THEN** accepted ETHOS refuses proof without changing the repository's two
  default gate boundary
- **AND** passing document commands alone do not satisfy behavior, semantics,
  diagnostics, or subject applicability.

## REMOVED Requirements

**Reason:** The repository verifier, its `npm run verify` entry, and its
public prose command are retired. Installed ETHOS's full host graph runs source
formatting, Markdown lint, prose, offline links, the document registry, and
official OpenSpec validation; the repository command checks only dependency
declarations and the Changelog. DDWG keeps no navigation, character, report,
prose, format, or lint regression of its own.

**Migration:** Scenarios that still describe retained repository commands move
to the added requirement below, two with corrected wording. The quality
requirement for local references keeps the local and candidate link boundary.
Formatting selection, lint, prose, links, and OpenSpec report handling follow
the installed product contracts named in the contributor guide; reader routes
stay with editorial review of actual journeys.

### Requirement: One portable documentation verifier measures source properties

### Requirement: Public-command integration has a bounded native execution budget

## ADDED Requirements

### Requirement: Retained repository commands keep native diagnostics and history

Retained repository commands SHALL run from repository-relative Node entries
without a shell wrapper or browser. Their process owner SHALL preserve native
errors, partial streams, and deadlines; Changelog validation SHALL resolve its
complete history selection natively. Their tests SHALL create their own
prerequisites and report a child error before an exit-status assertion.
Diagram, card, topic and evidence counts SHALL NOT determine validity.

#### Scenario: A strict native command fails with partial diagnostics

- **WHEN** a native archive or source command emits output before failure or
  timeout while its caller rejects standard error without requesting capture
- **THEN** the existing process owner preserves both partial output streams
  once and reports the failure or timeout
- **AND** a successful command with warning output still fails without losing
  its partial result; no extra executor or failure-suppression mode is added.

#### Scenario: A contextual error wraps a native refusal

- **WHEN** the process, bundle, or Changelog owner adds context to a native
  process, filesystem, plugin, or Git error
- **THEN** the contextual error retains the original error as its cause
- **AND** the existing refusal message and owned-resource cleanup remain
  observable; context must not erase native diagnosis.

#### Scenario: Native execution cannot start or reaches its deadline

- **WHEN** a command is missing or reaches its execution deadline
- **THEN** the existing process error retains the original native error object,
  including its code and command path
- **AND** successful output, nonzero exit status, warning refusal, and single
  replay of partial diagnostics keep their existing behavior.

#### Scenario: Native history resolves one complete selection

- **WHEN** Changelog validation selects its current comparison and tag refs
- **THEN** one native Git batch resolves every selected reference to a commit
  before native ancestry checks run for all distinct resolved pairs
- **AND** missing objects, non-commit observations, incomplete line-delimited
  output, or native warnings fail without accepting partial history
- **AND** exact tag/HEAD identity, full test selection, and process deadlines
  remain unchanged; native batch defaults add no Git version requirement,
  local ancestry implementation, or cache.

#### Scenario: Verification fixtures do not borrow prior local state

- **WHEN** the complete verifier runs in a fresh checkout with the declared
  tools and locked dependencies but no prior build directory or native cache
- **THEN** concurrent-install tests create or model their own exact
  prerequisites and complete without an earlier verification run
- **AND** source confinement, exclusive copy, version, and mode-preservation
  assertions remain unchanged; fixture children are removed afterward.

#### Scenario: A public check is invoked without a POSIX shell

- **WHEN** a supported host invokes `node tools/docs/cli.mjs check` without a
  POSIX shell
- **THEN** the check uses the same repository-relative Node entrypoint
- **AND THEN** no repository-authored shell wrapper or browser is needed.

#### Scenario: A public-command child exceeds the admitted budget

- **WHEN** the child reaches its finite timeout or has an execution error
- **THEN** the test fails with that actual error before comparing its exit code
- **AND** it does not skip, retry, or count the timeout as defect rejection.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver or
  browser installation.
