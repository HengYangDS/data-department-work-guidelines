# Spec Delta

## MODIFIED Requirements

### Requirement: Default proof and root binding are distinct

The profile SHALL list exactly `docs-integrity` and `markdown-format` as
default gates and descriptors. Both SHALL use repository-relative Node commands
without shell or executable-bit dependencies. Integrity SHALL omit formatting;
the format gate SHALL own it, while standalone verification runs it once.
The behavior and static-analysis mappings SHALL select their respective gates;
each descriptor SHALL retain its native kind, evidence class, offline network
policy, and trust-bearing status.
Product-native prerequisites and quality axes SHALL belong to the accepted
ETHOS dependency graph and verified owners, not additional profile descriptors.

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

### Requirement: Retained source receives format and spacing checks

Native format and Markdown checks SHALL cover Git-selected source, including
archives. Reader blocks SHALL have one blank line; single-paragraph list peers
stay adjacent and loose peers consistently separated. Code and data literals
SHALL retain meaningful spacing. Plain UTF-8 text SHALL receive spacing checks;
unowned code SHALL fail. Known plain-text identities, extensions and native
parsers SHALL define text ownership rather than treating every file without a
filename extension as plain text. Binaries SHALL use effective native Git
attributes; known text formats SHALL NOT evade checking through that declaration.
Text source SHALL reject NUL bytes and invalid UTF-8 with its path. Symlinks are
excluded. Effective native text attributes SHALL select LF on every host.
Native comment parsers SHALL reject operative formatter suppression without
rejecting literal examples. Spelling, links, and metadata SHALL cover
current readers, not promote archives to guidance.
Native tool inputs SHALL retain the exact selected filename identity, including
option-like names and names that a line-delimited list cannot represent.

#### Scenario: An archived Markdown file breaks source hygiene

- **WHEN** a tracked or unignored candidate Markdown file under an official
  Change archive violates Prettier, Markdown lint, or the one-blank-line rule
- **THEN** the repository verifier fails with the offending file
- **AND** the archive remains a historical record, not a current reader route
  or a substitute lifecycle authority.

#### Scenario: Text without a filename extension contains visual padding

- **WHEN** a tracked or unignored candidate UTF-8 text file without a filename
  extension has consecutive blank lines
- **THEN** the repository verifier fails with the file and line
- **AND THEN** binary files and symlinks are not interpreted as prose.

#### Scenario: Code requires literal blank lines

- **WHEN** fenced or indented Markdown code contains meaningful consecutive
  blank lines, including a nested or longer-fence example
- **THEN** the existing native spacing rule preserves that literal content
- **AND** the general text consumer does not reject it through a duplicate
  raw Markdown spacing scan.

#### Scenario: Structured source contains literal blank lines

- **WHEN** JavaScript strings, YAML scalars, or TOML strings contain meaningful
  consecutive blank lines
- **THEN** the native formatter preserves those literal bytes and rejects only
  structural format defects
- **AND** the general text consumer does not apply a duplicate raw spacing scan.

#### Scenario: TOML source is selected literally

- **WHEN** Git selects a TOML source path with spaces or glob-like characters
- **THEN** the formatter checks that exact file through its native public API
- **AND** ambient exclusion files cannot remove it or change its policy
- **AND** a syntax error, policy diagnostic, missing plugin, or meaningful-byte
  change fails qualification rather than silently skipping the source.

#### Scenario: Quoted paragraphs contain visual padding

- **WHEN** ordinary or nested quoted paragraphs contain repeated empty quote
  lines, or a quote lacks its separator from the preceding paragraph
- **THEN** the native source format check rejects that exact Git-selected file
- **AND** formatting restores one structural separator without changing nested
  code literals or treating the standalone lint command as the full verifier.

#### Scenario: A comment attempts to suppress formatting

- **WHEN** a real native Prettier ignore or range-control comment would exempt
  a source block from formatting
- **THEN** native Markdown parsing rejects the control in the existing check
- **AND** literal code examples and explanatory comments remain valid without
  a second parser or document-level formatting waiver.

#### Scenario: Wrapped simple list items contain unnecessary gaps

- **WHEN** a list has only single-paragraph items, including wrapped, ordered,
  task, nested, or quoted items, and a blank line separates peers
- **THEN** the native list-spacing rule rejects that gap with its source position
- **AND** document comments and ambient policy cannot waive that check.

#### Scenario: List structure requires separation

- **WHEN** a list item has internally separated paragraphs or blocks, or a
  fenced example contains literal blank lines
- **THEN** the native rule preserves literal content and requires one blank line
  between the genuinely loose list's peer items
- **AND** tight nested lists, separate lists, heading boundaries, and ordinary
  paragraph separation retain their structure.

#### Scenario: Reader padding follows a valid code example

- **WHEN** reader blocks have consecutive blank lines outside literal code
- **THEN** the native Markdown rule rejects the padding at its source location
- **AND** the valid code example does not hide the reader-layout defect.

#### Scenario: A source without a filename extension has no native owner

- **WHEN** an input without a filename extension is neither a declared plain-text
  identity nor recognized by its actual repository-relative native parser
- **THEN** the text check rejects the unowned input
- **AND** recognized shebang source, ordinary text and structured literals keep
  their native spacing rules regardless of the caller's working directory.

#### Scenario: Source bytes would bypass English checks

- **WHEN** text source contains NUL, invalid UTF-8, or a binary declaration for
  a known text format
- **THEN** the verifier rejects that source with its path
- **AND** declared binary assets remain reachable without being interpreted
  as prose, while effective text attributes require LF.

#### Scenario: Native formatting encounters a suppression comment

- **WHEN** a native source parser identifies an operative Prettier suppression
  comment
- **THEN** the verifier rejects the control and names its source location
- **AND** strings, YAML scalars, code examples and ordinary TOML comments remain
  data; pinned TOML formatting still formats source after those comments.

#### Scenario: Native tools receive literal selected filenames

- **WHEN** a selected source filename resembles a command option or contains
  a line break
- **THEN** the existing native tool invocation supplies that exact filename
  without interpreting it as an option or splitting it into multiple inputs
- **AND** a formatting defect or broken link still fails, while corrected source
  passes without restricting valid repository filenames.

### Requirement: Retained repository text uses English

Tracked reader guidance, operations, decisions, changelog, OpenSpec artifacts,
code comments, and test prose SHALL be English. The validator SHALL reject CJK,
including supplementary Han scripts, in tracked or unignored candidate text
with file and line. Human review SHALL assess clarity and faithful translation.
Git history remains unchanged; translating a tracked archive SHALL NOT certify
its earlier language or lifecycle retroactively.

#### Scenario: A candidate reintroduces Chinese prose

- **WHEN** a tracked or unignored candidate text contains a CJK character from
  either the basic or supplementary planes
- **THEN** the documentation gate fails and identifies its file and line
- **AND** that check does not claim to assess translation quality.

#### Scenario: An archived artifact is translated

- **WHEN** an archived OpenSpec artifact's present tracked text is translated
- **THEN** the original Git object remains recoverable and its historical
  meaning and identifiers remain unchanged
- **AND THEN** the translated artifact is not treated as fresh proof or as
  retrospective certification of the original work.

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

### Requirement: One source-bound native quality supply

One repository-native tool manifest SHALL bind Vale, lychee, and OSV Scanner
versions, platform archives or raw binaries, digests, raw-binary sizes, and
license notices. Every declared platform SHALL supply the complete tool graph.
The existing native installer and source-bound offline bundle SHALL consume that
manifest without
duplicated tool supply. Local verification SHALL never download a missing tool.
GitLab and GitHub SHALL supply and qualify the frozen release independently.

#### Scenario: Source and offline verification cover the declared hosted platforms

- **WHEN** GitHub verifies source or installs the frozen offline bundle
- **THEN** both workflows use the same declared Linux x64, Linux ARM64, macOS,
  and Windows hosted selectors and execute the complete repository verifier
- **AND** an omitted, duplicated, extra, or skipped host fails CI configuration
  validation; matrix membership alone does not qualify platform execution
- **AND** each actual job retains its own source, runtime, and result evidence.

#### Scenario: A native tool is supplied offline

- **WHEN** a supported host receives the exact source-bound bundle or a pinned
  local archive, or consumers migrate to a replacement manifest or installer
- **THEN** the installer verifies its digest, safe archive members, executable
  version, and source binding before admitting the tool
- **AND** the old manifest and installer SHALL retire when their consumers are replaced
- **AND** it preserves the destination's host installation and credentials.

#### Scenario: A frozen bundle is qualified before release

- **WHEN** an authorized explicit API or web pipeline selects protected `dev`
  or `main` and supplies its tracked bundle's SHA-256
- **THEN** only the existing offline platform jobs execute, using the same
  project's temporary content-addressed qualification package
- **AND** acquisition verifies the source-bound record, complete bundle, and
  exact digest before offline installation and full repository verification
- **AND** source jobs do not replay, proposal jobs cannot enter this route,
  and this result does not qualify a signed tag, Release, or network isolation
- **AND** the caller preserves raw results and deletes the exact temporary
  package after every selected job has reached a terminal state.

#### Scenario: An accepted native candidate is copied once

- **WHEN** pinned supply and the candidate's native version pass before
  exclusive installation
- **THEN** the existing installer publishes the complete verified candidate
  atomically within the destination directory, without a partial final entry
- **AND** it verifies complete published-byte equality and
  its owned POSIX mode without repeating the same version startup
- **AND** a pre-existing or concurrent target retains independent verification
  and its existing mode; changed published bytes fail
- **AND** actual installed consumers still run with unchanged deadlines, while
  the installer's own temporary stage is removed before completion.

#### Scenario: Native supply is incomplete or changed

- **WHEN** the requested ABI, archive, digest, or source-bound manifest is missing
  or changed
- **THEN** installation and verification fail without fetching a substitute,
  borrowing another Forge's identity, or reusing an earlier bundle
- **AND** only the exact operation's disposable temporary stage is removed.

## REMOVED Requirements

### Requirement: Tool supply and portability require executed checks

**Reason**: The latest human direction retires advisory-based delivery holds,
private exemptions, expiry gates, and duplicate filtering. The old requirement
includes those acceptance rules and is replaced deliberately rather than
silently dropping scenarios from a MODIFIED block.

**Migration**: Use the added native-tool supply requirement below. Preserve
complete original evidence, actual execution, artifact integrity, platform
qualification, and maintenance ownership. Historical approvals remain historical;
they are not retroactively certified as fixes.

## ADDED Requirements

### Requirement: Native tool supply is verified across platforms

CI SHALL verify native-tool digests and audit all locked dependencies online
with OSV Scanner, separately from offline source checks. One complete raw
report SHALL retain all findings as non-blocking delivery evidence. Public checks
SHALL avoid POSIX shells and host paths; each claimed OS SHALL execute the full
graph. Current command
examples SHALL be checked against the installed CLI. GitLab jobs SHALL name
purpose and platform; hidden phase templates SHALL own common steps.

#### Scenario: An upstream download returns a rejected response

- **WHEN** a native-tool or either Forge's release download returns a rejected
  HTTP response with an unread body
- **THEN** its existing owner awaits native body cancellation before returning
  failure and retains the HTTP status and any original cleanup error
- **AND** it performs no automatic retry or fallback and publishes no unverified
  output; a concurrent verified target remains unchanged.

#### Scenario: A native audit times out before or after output

- **WHEN** the audit's native process exceeds its unchanged deadline, whether
  or not it emits output first
- **THEN** the original attempt's command, streams, status, signal, and error
  remain in its own evidence and execution reports failure
- **AND** validation does not assume startup latency, synthesize progress,
  replay the attempt, or extend the deadline.

#### Scenario: Verification job names omit the platform

- **WHEN** a GitLab source or offline verification job has a platform-less name,
  a duplicated old alias, or an incorrect shared parent
- **THEN** the existing CI validator rejects the configuration
- **AND** all declared jobs inherit their hidden phase owner without changing
  runner capabilities, rules, or verification commands.
- **AND** jobs use `docs:verify:<os>` or `offline:verify:<os>` for `linux`,
  `macos`, and `windows`, with `:review` for source review; no runnable shared
  owner or platform-specific parent substitutes for the hidden phase template.

#### Scenario: Windows verification events share a finite executor

- **WHEN** Windows review, protected-source, and offline verification jobs
  become eligible for the same project's finite executor
- **THEN** they declare one stable native project-scoped resource group,
  independent of the event and ref
- **AND** the existing CI contract rejects missing or divergent reservations
- **AND** separate runner identities and ref admission remain unchanged
- **AND** all discovered tests and existing deadlines remain mandatory;
  the reservation does not prove isolation from another project.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** release review against the installed CLI reports the stale
  instruction
- **AND THEN** a valid link or formatted code block does not hide it.
- **AND** parsed prose alone cannot establish command validity.

#### Scenario: Prose or native dependency execution fails

- **WHEN** a current Markdown file contains a misspelling
- **THEN** the locked spelling check rejects it without a local waiver.
- **WHEN** the native dependency scanner fails or provides incomplete or
  inconsistent evidence
- **THEN** the audit reports failure without claiming a clean scan
- **AND** both Forges preserve complete raw reports and execution output.

#### Scenario: Advisory findings remain non-blocking evidence

- **WHEN** one native scanner report covers the complete declared input and
  agrees with its native exit status
- **THEN** the audit retains all findings without blocking delivery
- **AND** no advisory ignore, filtered second scan, private waiver, or expiry
  gate changes source verification or installation
- **AND** artifact authenticity, checksums, functionality, and actual platform
  acceptance remain required.

#### Scenario: Offline checks run after a former advisory expiry

- **WHEN** the declared tools and source pass their actual integrity and
  functionality checks
- **THEN** a historical advisory-expiry date does not block offline verification
- **AND** scanner coverage and runtime acceptance remain separate claims.

#### Scenario: A fresh supported host runs the full graph

- **WHEN** a maintainer installs the declared locked dependencies on a claimed
  host OS and invokes the single repository check
- **THEN** format, lint, links, and repository-specific validations run without
  a POSIX shell or a host-specific absolute path
- **AND THEN** missing tools fail visibly rather than being downloaded or
  silently skipped.
- **AND** banning `.sh` files alone does not establish portability.

#### Scenario: Windows checks out the same text bytes

- **WHEN** Git checks out tracked text on a host with CRLF defaults
- **THEN** the repository's native `.gitattributes` rule selects LF
- **AND THEN** the same formatting check evaluates the same text bytes.

### Requirement: Verification reports its native workspace context

The existing source check SHALL report its real repository, commit and tree,
tracked-change state, native runtime, and mounted workspace filesystem capacity
once. Runtime architecture SHALL identify the Node process, not infer the host
or guest architecture. Byte counts SHALL use exact integers. Native read failures
SHALL propagate.
This observation SHALL NOT establish VM identity, isolation, throughput, or
capacity admission, and SHALL require no additional controller or proof gate.

#### Scenario: A source check reports its actual workspace

- **WHEN** the existing source check begins in a local or hosted workspace
- **THEN** one native observation identifies the source, runtime, and total,
  free, and available bytes of its mounted workspace filesystem
- **AND** decimal integer strings preserve values beyond floating-point precision
- **AND** its stated limit excludes VM identity, isolation, and throughput.

#### Scenario: A native filesystem read fails

- **WHEN** the native workspace filesystem read fails
- **THEN** verification fails with the original error
- **AND** it does not fabricate a zero-capacity observation or claim runner
  qualification.
