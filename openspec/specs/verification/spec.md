# verification Specification

## Purpose

Define complete source verification, native proof prerequisites, execution
evidence, and shared CI admission without replacing OpenSpec or ETHOS authority.

## Requirements

### Requirement: Default proof and root binding are distinct

The profile SHALL declare only `docs-integrity` and `markdown-format` as
default gates and descriptors. Both SHALL use repository-relative Node commands
without shell or executable-bit dependencies. Integrity SHALL omit formatting;
the format gate SHALL own it and standalone verification SHALL run it once.
Behavior and static mappings SHALL select those gates with their native kinds,
evidence classes, offline policies, and trust status.

#### Scenario: Root-binding contract is audited

- **WHEN** the repository validates `.ethos/profile.toml`
- **THEN** its accepted typed profile has exactly the two default proof gates
  and descriptors
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

- **WHEN** a contributor invokes the standalone full verifier
- **THEN** formatting runs once before the remaining checks
- **AND WHEN** ETHOS executes the two default proof gates
- **THEN** `docs-integrity` omits formatting and `markdown-format` owns it.

#### Scenario: A supporting check is disconnected or lacks verification

- **WHEN** a descriptor is outside the default dependency closure or a quality
  axis names a missing, disconnected, or unverified owner
- **THEN** the installed product rejects that policy before execution
- **AND** repository checks do not create a competing graph authority.

#### Scenario: A default gate changes its proof meaning

- **WHEN** the profile swaps a default dimension mapping or changes a gate's
  native kind, evidence class, offline policy, or trust-bearing status
- **THEN** the existing profile check rejects that exact contract mismatch
- **AND** the unchanged two-gate profile remains valid without another gate
  or a duplicate lifecycle implementation.

### Requirement: One portable documentation verifier measures source properties

One locked, shell-independent verifier SHALL check all Git-selected source
formats supported by pinned native Prettier, including Markdown, code, JSON and
YAML; native TOML formatting; Markdown lint; native Vale prose; pinned offline
lychee links and fragments; metadata, English, spacing, decisions and navigation.
The same repository-relative entry SHALL run locally and on both CI planes.
Diagram, card, topic and evidence counts SHALL NOT determine validity.

#### Scenario: Official OpenSpec reports success with findings

- **WHEN** the official CLI exits successfully but its complete report contains
  an INFO, WARNING, or ERROR finding, or the process emits standard error
- **THEN** the existing verifier rejects the result and preserves the native
  item, location, severity, and message
- **AND** findings remain visible when standard error accompanies the report,
  whether the process succeeds or fails
- **AND** passing summary totals do not establish a clean source check.

#### Scenario: Native prose has already rejected the source

- **WHEN** native prose reports a source defect through the public integrity
  command
- **THEN** the command preserves that finding and fails before unrelated
  Changelog history or official OpenSpec execution
- **AND** valid prose still reaches every declared check, all distinct native
  ancestry checks, and the complete test inventory with unchanged deadlines;
  no cache, private history implementation, or weaker acceptance is added.

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

#### Scenario: Official validation evidence is incomplete or wrongly bound

- **WHEN** a native report names another root, omits items or issue arrays,
  repeats an item identity, omits a category selected by `--all` even when it
  has no items, or reports counts inconsistent with its items
- **THEN** the verifier rejects that evidence without a report waiver
- **AND** official OpenSpec retains responsibility for validation and lifecycle;
  the consumer does not replace its parser or admission.

#### Scenario: Verification fixtures do not borrow prior local state

- **WHEN** the complete verifier runs in a fresh checkout with the declared
  tools and locked dependencies but no prior build directory or native cache
- **THEN** source-link and concurrent-install tests create or model their own
  exact prerequisites and complete without an earlier verification run
- **AND** the public source-link test uses compact tracked and candidate source
  with real Git selection and lychee, not unrelated history or documents
- **AND** source confinement, exclusive copy, version, and mode-preservation
  assertions remain unchanged; fixture children are removed afterward.

#### Scenario: A public rejection regression carries only its native prerequisites

- **WHEN** the focused prose/integrity regression runs against a temporary
  repository
- **THEN** it uses actual native executables, policies, dependencies, and Git
  selection with compact positive source and complete local links
- **AND** both command refusals, unchanged source, ignored-untracked exclusion,
  force-tracked inclusion, each missing anchor, repair, and cleanup remain
  checked without cloning unrelated history or repeatedly checking other documents
- **AND** full source verification still selects every actual repository input
  and test with the same workers and deadlines; no native report is fabricated.

#### Scenario: Native format and lint fixtures select their complete relevant source

- **WHEN** a focused native format or lint regression runs in a temporary Git
  repository
- **THEN** executable, policy, and dependency carriers remain present and are
  consumed normally without becoming unrelated checked source
- **AND** native Git inventory retains every sample, literal, ambient-policy
  counterexample, archive input, and force-tracked source, including the observed
  Markdown TOML policy; original assertions and deadlines remain unchanged
- **AND** one formatting attempt uses one fresh native TOML formatter for matching
  and output, preserving diagnostics and data without a cross-attempt cache
- **AND** full repository verification still checks all selected source and tests;
  the temporary fixture is removed after success or failure.

#### Scenario: Navigation links are hidden in non-reader content

- **WHEN** code, a comment, an unlinked image, escaped syntax, an unused
  definition, or a shadowed reference replaces a required task route
- **THEN** native Markdown link resolution rejects the missing reader route
- **AND** those same examples cannot falsely count as repeated topic links.

#### Scenario: A navigation anchor has no readable label

- **WHEN** a required route has an empty label, only whitespace or invisible
  formatting characters, or a linked image without descriptive alt text
- **THEN** navigation rejects the missing reader route even if its destination
  or optional title names the expected file
- **AND** formatted text and descriptive linked-image alt text remain valid;
  the native engine still owns link and reference resolution.

#### Scenario: A reader uses a legitimate native Markdown route

- **WHEN** a required route uses a titled, full, collapsed, or shortcut link,
  a character reference, or a normalized repository-relative path
- **THEN** navigation resolves its actual destination and first definition
- **AND** real repeated topic routes remain rejected regardless of spelling;
  native lychee still checks source targets and fragments.

#### Scenario: A table source link is not visible in its rendered cell

- **WHEN** a cell separator without an escape splits a required navigation
  link, or places it beyond a GFM table's declared columns
- **THEN** the existing navigation owner rejects the missing rendered route
- **AND** ordinary links and escaped-pipe labels inside visible cells remain
  valid; the official native table extension owns the cell boundaries.

#### Scenario: A topic's reader cue is hidden or merely quoted as code

- **WHEN** the use cue appears only in code, a comment, or an image instead of
  the visible topic opening
- **THEN** navigation rejects the missing reader entry
- **AND** a visible cue with or without emphasis remains valid.

#### Scenario: Native formatting is not narrowed by source location

- **WHEN** Git selects a supported code or document file outside the usual code
  directories or beneath a normally ignored local-state path
- **THEN** the public formatter checks and writes that file through native
  Prettier parser detection, without a private language or directory list
- **AND** ambient ignore files cannot exempt already selected source.

#### Scenario: Ignored local state is not formatting input

- **WHEN** a defective supported file is untracked and ignored by Git
- **THEN** both public formatting modes leave it outside their source inventory
- **AND** unowned code formats fail explicitly rather than silently passing
  or acquiring an overlapping formatter.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver or
  browser installation.

#### Scenario: A public check is invoked without a POSIX shell

- **WHEN** a supported host invokes `npm run verify` without a POSIX shell
- **THEN** the check uses the same repository-relative Node entrypoint
- **AND THEN** no repository-authored shell wrapper or browser is needed.

#### Scenario: Multiple suites launch document-tool subprocesses

- **WHEN** the standalone verifier runs its discovered quality-test inventory
- **THEN** at most two test files execute concurrently on every platform
- **AND** every discovered file still runs with unchanged failure and deadline
  admission, without a CPU-dependent default or skipped boundary
- **AND** a narrow OpenSpec environment regression exercises its actual
  invocation owner while the canonical graph retains real tool execution.

#### Scenario: A link points to local state that is absent from a clean checkout

- **WHEN** a current source document links to an existing ignored cache file or
  Git metadata
- **THEN** the public link check rejects that reference as outside repository
  source even when the native existence check would pass
- **AND** tracked and non-ignored candidate references remain valid.

#### Scenario: A directory or alias links to source

- **WHEN** a local link names a source directory or a delivered internal alias
- **THEN** the boundary accepts it only when both requested and resolved paths
  belong to the source inventory
- **AND** an ignored alias to source, or a delivered alias to local or outside
  state, cannot borrow source ownership.

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

### Requirement: Product-owned code evidence accompanies document proof

`docs-integrity` SHALL depend on the product's verified native behavior
prerequisite; `markdown-format` SHALL conjoin its command with native static
diagnostics.
Behavior and static-analysis axes SHALL name those owners for one tree. Native
tests SHALL run the complete Git-selected inventory once.
Accepted installed ETHOS SHALL enforce semantics, diagnostics, and subject
applicability on each required repository, refusing missing or misdirected
evidence and authored substitutes.

#### Scenario: Document command passes but native code fails

- **WHEN** both repository document commands exit successfully but a tracked
  JavaScript test fails or production module is not exercised
- **THEN** ETHOS blocks full proof for the behavior axis
- **AND THEN** a repository-authored test report cannot turn the result green.

#### Scenario: Native code passes but a document command fails

- **WHEN** ETHOS obtains valid native code evidence but the document command
  for either mapped gate fails
- **THEN** that gate and full proof remain blocked
- **AND THEN** native evidence does not excuse a broken document check.

#### Scenario: Both sides of each gate pass

- **WHEN** both document commands and their required native evidence owners pass
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

### Requirement: Public-command integration has a bounded native execution budget

Tests of the complete public prose and repository commands SHALL retain actual
current-source execution, defect rejection, corrected-source success, and
unchanged-source assertions. Their child deadline SHALL use the same finite
120-second budget as the existing runtime command owner, not a shorter implicit
performance requirement. A subprocess error SHALL be reported before an exit
status assertion; a timeout SHALL NOT be mistaken for a rejected source defect.

#### Scenario: A supported host completes a full current-source check

- **WHEN** a real public-command test needs more than 30 seconds but completes
  within the native 120-second budget
- **THEN** it may finish its actual selected rules without being canceled early
- **AND** the expected source defect and unchanged bytes are still asserted.

#### Scenario: A public-command child exceeds the admitted budget

- **WHEN** the child reaches its finite timeout or has an execution error
- **THEN** the test fails with that actual error before comparing its exit code
- **AND** it does not skip, retry, or count the timeout as defect rejection.

### Requirement: Verification reports its native workspace context

Both `check` and `verify` SHALL emit one complete JSON context before validation,
formatting, or inherited child output. It SHALL identify the real repository,
commit, tree, tracked changes, Node version, platform, process architecture,
observed host name, and exact mounted-filesystem byte counts. Read or write errors
SHALL fail with their native diagnosis. The context SHALL NOT qualify VM identity,
isolation, throughput, or capacity admission or add a controller or gate.

#### Scenario: A source check reports its actual workspace

- **WHEN** `check` or `verify` begins in a local or hosted workspace
- **THEN** one native observation identifies the source, runtime, and total,
  free, and available bytes of its mounted workspace filesystem
- **AND** decimal integer strings preserve values beyond floating-point precision
- **AND** runtime architecture identifies the Node process, not the host or guest
- **AND** its stated limit excludes VM identity, isolation, and throughput.

#### Scenario: A child inherits a pipe with a pending context record

- **WHEN** a context record exceeds the pipe buffer before a synchronous
  validation or formatter child starts
- **THEN** the complete context remains one valid JSON line before child output
- **AND** child output is not inserted into that line or merged with standard
  error.

#### Scenario: The context output consumer closes its pipe

- **WHEN** the context write fails because its output consumer is closed
- **THEN** both commands stop before validation or formatting with the native
  write error
- **AND** no unhandled stream error replaces the existing diagnosis.

#### Scenario: A native filesystem read fails

- **WHEN** the native workspace filesystem read fails
- **THEN** verification fails with the original error
- **AND** it does not fabricate a zero-capacity observation or claim runner
  qualification.

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

### Requirement: Shared source-size admission preserves semantic ownership

Code ELOC and Markdown non-blank physical lines SHALL each have an inclusive
512-line limit enforced through the accepted shared admission owner. Required
source, tests, specifications, and release notes SHALL remain discoverable and
semantically complete. Reorganization SHALL NOT minify, conceal inputs, copy the
shared checker, create a catch-all history carrier, or weaken the limit.

#### Scenario: A carrier reaches the admitted boundary

- **WHEN** selected code contains 512 ELOC or selected Markdown contains 512
  non-blank physical lines
- **THEN** the shared size gate admits that carrier without changing it
- **AND** each corresponding 513-line carrier is refused without mutation.

#### Scenario: An oversized carrier is reorganized

- **WHEN** source is divided by semantic responsibility to meet the limit
- **THEN** every prior requirement, test journey, and versioned release note
  remains reachable at its declared owner
- **AND** the complete native selection and actual shared admission are verified
  before the replaced carrier or implementation is retired.

### Requirement: Proof prerequisites retain product ownership

Product-native prerequisites and quality axes SHALL belong to the accepted
ETHOS dependency graph and verified owners, not additional profile descriptors.
Native behavior and static diagnostics SHALL conjoin the mapped document
commands for the same source without authored substitute evidence.

#### Scenario: A profile attempts to replace native proof evidence

- **WHEN** a repository adds a descriptor or authored report instead of its
  required product-native prerequisite
- **THEN** accepted ETHOS refuses proof without changing the repository's two
  default gate boundary
- **AND** passing document commands alone do not satisfy behavior, semantics,
  diagnostics, or subject applicability.
