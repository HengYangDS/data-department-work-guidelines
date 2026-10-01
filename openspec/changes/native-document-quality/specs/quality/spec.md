# Spec Delta

## MODIFIED Requirements

### Requirement: Decision records exclude execution logs

A DR SHALL use stable `DR-####`, lowercase `dr-####-*.md`, one matching root
title, and only five ordered root sections: Context, Decision, Alternatives
Rejected, Consequences and Boundary, Evidence and Revisit. It SHALL keep
rationale, not tasks, readiness, execution, or acceptance reports. Native
Markdown parsing SHALL reject additional or nested headings, code blocks,
commands, task markers, and HTML except the validated leading registry comment,
under any wrapper or language label.

#### Scenario: Prose mentions an evidence asset

- **WHEN** a DR contains a fenced, prompted, or inline invocation of a current
  ETHOS or OpenSpec command
- **THEN** the validator rejects the execution content
- **AND WHEN** a DR uses natural-language lifecycle terms or a bare evidence
  link
- **THEN** the validator accepts that prose.
- **AND** inline terms, ordinary decision lists/tables and quoted rationale
  remain valid; code and executable examples stay linked at their producer.

#### Scenario: Decision rationale is checked

- **WHEN** a DR contains a transient delivery-state sentence instead of durable
  rationale
- **THEN** repository review moves that state to its owning Change or current
  status surface
- **AND THEN** the DR retains only the enduring choice and revisit trigger.
- **AND** source syntax checks do not replace that editorial judgment or
  ETHOS/OpenSpec lifecycle authority.

#### Scenario: Markdown wrappers cannot hide execution or task progress

- **WHEN** any code block or task marker appears inside a quote, list, long
  fence or indented structure, regardless of a code language label
- **THEN** the existing boundary fails with the source location
- **AND THEN** ordinary decision lists, tables and meaningful links remain
  valid.

#### Scenario: Parsed headings define the actual decision sections

- **WHEN** heading-like code or a quoted heading stands in for a required
  top-level DR section, or the title contradicts the stable identity
- **THEN** the validator rejects the malformed record
- **AND THEN** command content and task status stay outside the decision
  carrier.

#### Scenario: A decision has additional or nested sections

- **WHEN** a record includes a heading beyond its matching title and five
  ordered root sections, including a deeper or nested heading
- **THEN** the native structural boundary rejects the record
- **AND** emphasized or entity-encoded headings with the correct reader text,
  ordinary rationale lists, and meaningful evidence links remain valid.

### Requirement: One portable documentation verifier measures source properties

One locked, shell-independent verifier SHALL check formatting of Markdown, code,
JSON and YAML; TOML syntax; Markdown lint; native Vale prose; pinned offline
lychee links and fragments; metadata, English, spacing, decisions and navigation.
The same repository-relative entry SHALL run locally and on both CI planes.
Diagram, card, topic and evidence counts SHALL NOT determine validity.

#### Scenario: A diagram is removed without losing meaning

- **WHEN** a redundant diagram is deleted and the remaining document preserves
  its unique explanation and valid links
- **THEN** documentation validation passes without a diagram-count waiver or
  browser installation.

#### Scenario: A public check is invoked without a POSIX shell

- **WHEN** a supported host invokes `npm run verify` without a POSIX shell
- **THEN** the check uses the same repository-relative Node entrypoint
- **AND THEN** no repository-authored shell wrapper or browser is needed.

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

### Requirement: Tool supply and portability require executed checks

CI SHALL verify pinned Vale and lychee digests and audit locked dependencies
online, separately from offline source checks. Public checks SHALL avoid POSIX
shells and host paths; each claimed OS SHALL execute the full graph. Current
command examples SHALL be checked against the installed CLI. GitLab jobs SHALL
name purpose and platform; hidden phase templates SHALL own common steps.

#### Scenario: Verification job names omit the platform

- **WHEN** a GitLab source or offline verification job has a platform-less name,
  a duplicated old alias, or an incorrect shared parent
- **THEN** the existing CI validator rejects the configuration
- **AND** all declared jobs inherit their hidden phase owner without changing
  runner capabilities, rules, or verification commands.
- **AND** jobs use `docs:verify:<os>` or `offline:verify:<os>` for `linux`,
  `macos`, and `windows`, with `:review` for source review; no runnable shared
  owner or platform-specific parent substitutes for the hidden phase template.

#### Scenario: A command was retired by its product

- **WHEN** a current instruction names a command absent from the installed
  public CLI
- **THEN** release review against the installed CLI reports the stale
  instruction
- **AND THEN** a valid link or formatted code block does not hide it.
- **AND** parsed prose alone cannot establish command validity.

#### Scenario: Prose or dependency supply fails

- **WHEN** a current Markdown file contains a misspelling
- **THEN** the locked spelling check rejects it without a local waiver.
- **WHEN** the locked dependency audit reports a moderate-or-higher advisory
- **THEN** each hosted job fails before running the repository verifier.

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

### Requirement: A supplied offline bundle can install the complete verification toolchain

Each declared platform's release-bound bundle SHALL supply every locked npm
package, pinned Vale and lychee asset, and upstream notice. Supported Node/npm
and Git SHALL install and run the full verifier from empty application caches
without network access. Before extraction, the installer SHALL match committed
source identities and a trusted external or source-pinned digest. ETHOS remains
separate; the bundle SHALL NOT impersonate its authority.

#### Scenario: Cold local verification succeeds without network access

- **WHEN** a user supplies a complete bundle for the checked-out release on a
  declared host with supported Node/npm and Git
- **AND** the application has no pre-existing npm cache, `node_modules/`, or
  native-tool cache
- **THEN** the actual offline install and full repository verifier pass while
  outbound network access is unavailable
- **AND THEN** a successful `npm ci --offline --dry-run` alone is not accepted
  as installation evidence.

#### Scenario: Offline supply is incomplete or altered

- **WHEN** a bundle is missing a required npm entry, native asset, or license
  notice, contains an unsafe member, or disagrees with the checked-out lockfile,
  tool manifest, version, or trusted bundle digest
- **THEN** the installer fails before accepting the toolchain or running the
  verifier
- **AND THEN** it does not silently fetch a replacement or mark the release
  qualified.

#### Scenario: A different supported platform consumes the same release

- **WHEN** the release claims macOS, Linux, and Windows support
- **THEN** the complete offline installation and verification graph is executed
  on each declared platform using the release's bundle
- **AND THEN** one platform's successful install or a static matrix declaration
  does not qualify another platform.

#### Scenario: GitLab qualifies its native Linux release asset

- **WHEN** the same-project GitLab package and Release are available for the
  checked-out signed tag
- **THEN** a post-publication pipeline on the declared Linux ARM64 runner
  obtains the package with its project job token and rejects redirects or
  altered bytes before installation
- **AND THEN** the complete offline install and full verifier run at the tag's
  exact source SHA; a successful tag-push documentation job is not a substitute.

### Requirement: Native English prose and terminology checks

The verifier SHALL use pinned Vale for spelling, repeated words, diagnosed wordy
or stock phrases, and selected technical terms in current authored Markdown. One
native configuration SHALL govern prose and full checks; replaced pipelines
SHALL retire. Native Markdown parsing SHALL reject actual Vale control comments
and preserve literal code. Host configuration, inline suppression, network
supply during verification, new services, and a second governance plane SHALL
NOT influence this check.

#### Scenario: Objective prose defects appear

- **WHEN** current Markdown contains a misspelling, repeated word, diagnosed
  needless phrase, or inconsistent selected term
- **THEN** the native rule reports the source location and reason
- **AND** standalone prose and full verification fail on that finding.

#### Scenario: Reader syntax carries prose

- **WHEN** a heading, quote, list, emphasized phrase, link label, or table cell
  contains a governed prose defect
- **THEN** the native owner checks the actual reader text
- **AND** distinct table cells are not joined into an artificial sentence.

#### Scenario: Syntax and meaningful uncertainty remain intact

- **WHEN** Markdown contains code spans, fenced commands, URL targets, explicit
  uncertainty, a meaningful passive construction, or a domain authority term
- **THEN** the selected rules preserve syntax, confidence, responsibility, and
  permission limits
- **AND** verification does not rewrite prose or require a semantic waiver.

#### Scenario: A document tries to disable quality

- **WHEN** a real HTML comment contains a native Vale control in a block,
  paragraph, quote, list, or table, including an entity-encoded control
- **THEN** the existing native Markdown linter rejects it
- **AND** code examples, explanatory comments, and evidence links remain valid.

#### Scenario: A table separates prose into cells

- **WHEN** a Markdown cell contains repeated words or an inconsistent term
- **THEN** the verifier checks that cell, including nested emphasis
- **AND** separate cells are not joined into one artificial sentence.

#### Scenario: Current and historical scopes differ

- **WHEN** the verifier discovers tracked and candidate current Markdown
- **THEN** it checks every current authored file, including an active Change
- **AND** official archived Changes remain historical inputs, not a second
  current style authority or an excuse to hide current files.

#### Scenario: Tracked source uses a local-state directory name

- **WHEN** native Git discovery selects a current Markdown file beneath a
  normally ignored local-state directory
- **THEN** prose and links check that file rather than silently excluding its
  directory name
- **AND** ignored untracked state remains outside source; only official archived
  Changes receive the historical prose and link scope.

#### Scenario: A supported host installs offline supply

- **WHEN** the source-bound release bundle is installed without remote supply on
  any declared verification host
- **THEN** the actual full verifier executes its native prose and terminology
  rules from the pinned tools and locked configuration
- **AND** a missing package or rule fails rather than falling back or skipping.

#### Scenario: An upstream package keeps its license notice in a readme

- **WHEN** the native npm package declares its license and includes an explicit
  matching License section instead of a separately named license file
- **THEN** the builder preserves that original package and accepts its notice
- **AND** incidental prose, fenced examples, empty sections, missing
  declarations, and mismatched identifiers cannot substitute for the notice
- **AND** cold installation still requires only the declared Node and npm.

#### Scenario: Native removal encounters a temporary platform lock

- **WHEN** the pinned tool installer removes its own fresh extraction stage
- **THEN** native removal retries are bounded and confined to that stage
- **AND** the installer awaits one asynchronous native removal with at most ten
  retries with linearly increasing 200-millisecond waits before reporting
  success
- **AND** a persistent removal error fails rather than silently leaving residue.

### Requirement: The actual package manager conforms before execution

The repository SHALL declare one exact npm version through `package.json`'s
native `devEngines.packageManager` contract with `onFail: error`. npm SHALL
reject a version mismatch before installation, `ci`, or run effects. An
installed executable, host version, or Node major SHALL NOT substitute for
observing the actual consuming npm command.

#### Scenario: A contributor selects Node's older bundled npm

- **WHEN** a contributor invokes install, `ci`, or run with npm 11.19.1 while
  the native repository declaration requires npm 12.2.0
- **THEN** native npm admission rejects the command before dependency or script
  effects occur
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

- **WHEN** npm's native launcher selects an upgraded global CLI rather than the
  Node-adjacent bundled CLI
- **THEN** programmatic calls resolve that same CLI through npm's native
  execution-path or prefix authority
- **AND THEN** failed native resolution stops execution instead of silently
  choosing a different package manager.

#### Scenario: Offline execution reports the selected package manager

- **WHEN** the source-bound bundle is installed on a declared host
- **THEN** native npm admission requires the single exact source declaration
- **AND** the installer reports the actual npm version and runs full
  verification; a label or second npm-major field cannot qualify the host
- **AND** the package audit does not certify Node's bundled npm executable.

### Requirement: Product-owned code evidence accompanies document proof

`docs-integrity` SHALL conjoin its Node command with ETHOS-owned tests and
coverage; `markdown-format` SHALL conjoin its command with ETHOS-owned JavaScript
syntax checks. Both SHALL use the same committed tree. Profile validation SHALL
reject missing or misdirected providers without a third gate. Command output or
repository-authored reports SHALL NOT prove code correctness. Runtime success
SHALL NOT close shared semantic, diagnostic, or subject-applicability acceptance.

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

- **WHEN** both document commands and their ETHOS-owned native verifiers pass
  for the exact committed source
- **THEN** the two existing gate IDs satisfy their mapped runtime checks
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

- **WHEN** the native test stream emits an unapproved warning that its selected
  reports omit
- **THEN** documentation and completion claims identify the diagnostic gap
- **AND** the passing report does not close the shared warning-handling
  obligation or authorize a repository-private replacement.

#### Scenario: Applicable scopes differ by subject

- **WHEN** the formal product contract permits different native scopes to
  jointly cover a required property
- **THEN** qualification checks each subject against its actual obligation
- **AND** it does not require every provider to cover every language or accept
  uncovered required subjects.

## ADDED Requirements

### Requirement: Source-event tag routes match the release family

Both source-event routes SHALL admit only `v*` tags without `/`; GitLab offline
rules SHALL use the same family. The CI contract SHALL reject broader tag rules.
Native release checks SHALL retain strict SemVer and signature admission;
GitHub offline acquisition retains source/version checks.

#### Scenario: An unrelated tag would enter source supply

- **WHEN** a GitLab workflow, protected-source rule, or offline rule admits any
  nonempty tag without the declared family constraint
- **THEN** the existing CI contract rejects that broader route
- **AND** unrelated and slash-containing tags are excluded before GitLab tool
  supply, while branch and review routes remain unchanged.

#### Scenario: A matching prefix does not establish a release

- **WHEN** a tag begins with `v` but is not a signed strict SemVer edition
- **THEN** native release checks still reject that identity
- **AND** an eligible source-event route does not prove a Release or asset.

### Requirement: Local references resolve to delivered source

Local file links SHALL remain inside the repository and resolve to tracked or
non-ignored candidate source. Ignored state and undelivered aliases SHALL NOT
establish validity. A source directory SHALL contain source; both requested and
resolved alias paths SHALL belong to the source inventory. Native lychee retains
target existence and fragment checks.

#### Scenario: Existing local state would hide a broken source link

- **WHEN** a local link names ignored state, Git metadata, or an alias whose
  requested or resolved path is not source
- **THEN** the public link check rejects it even when the local target exists
- **AND** ordinary tracked and non-ignored candidate files, source directories,
  and delivered internal aliases remain valid.

### Requirement: Decision identity and section completeness remain explicit

Each current DR identifier SHALL be unique. Each of its five sections SHALL
contain readable Markdown content. Ordinary command-table property names in
prose SHALL NOT become shell commands or cause a classifier exception.
Structural validity SHALL NOT claim to establish the quality of the reasoning.

#### Scenario: A current record repeats a stable identity

- **WHEN** two records use the same stable DR ID, even with different subjects
- **THEN** the existing decision-tree boundary rejects the duplicate identity
- **AND** distinct correctly identified records remain valid.

#### Scenario: A required section has no readable content

- **WHEN** a section is empty or contains only spacing, thematic breaks, or
  reference definitions
- **THEN** native token inspection rejects that section
- **AND** readable links, lists, quotes, and table cells remain valid.

#### Scenario: Prose begins with a JavaScript property name

- **WHEN** ordinary rationale begins with `constructor`, `toString`,
  `hasOwnProperty`, or `__proto__`
- **THEN** command classification returns no invocation without an exception
- **AND** a real command invocation remains rejected.

#### Scenario: Shell inspection preserves execution and reader boundaries

- **WHEN** quoted, compound, wrapped, or absolute-path invocations appear in a DR
- **THEN** the native lexer supplies tokens and the existing boundary rejects
  the invocation without evaluating the text or reading ambient variables
- **AND** bare paths and ordinary interpreter prose remain valid.

#### Scenario: Native shell glob arguments remain command operands

- **WHEN** a selected removal or retrieval invocation contains a glob, one
  literal operand, a variable, or an end-of-options marker
- **THEN** native tokens remain in the current command argument group and the
  DR boundary rejects the invocation, including a compound command
- **AND** ordinary sentences describing a command and bare evidence paths
  remain valid; inspected variables are never evaluated.

### Requirement: Complete retirement of replaced quality tools

The replacement SHALL migrate every textlint responsibility: English checks,
DR boundary parsing, and offline README license recognition. It SHALL remove
retired direct and unused transitive dependencies, configurations, adapters,
imports, command entries, test interfaces, and current operational guidance.
No alternate parser, compatibility facade, fallback, or optional retired checker
SHALL remain. Immutable historical source SHALL NOT become an executable
dependency or current authority.

#### Scenario: A replacement leaves a retired consumer

- **WHEN** an active consumer, declared or resolved dependency, configuration,
  command, or guidance still requires a replaced tool
- **THEN** transition acceptance fails even if the new prose command passes
- **AND** a complete current-consumer and dependency-graph audit is required
  before retirement can be claimed.

#### Scenario: All former responsibilities use their native owners

- **WHEN** all three consumers pass their retained positive and negative cases
  through the selected native English and Markdown owners
- **THEN** source verification and clean offline installation succeed without
  any retired package or fallback
- **AND** DR constraints, explicit matching license notices, upstream bytes,
  source locations, and meaningful uncertainty remain intact.

### Requirement: One source-bound native quality supply

One repository-native tool manifest SHALL bind the lychee and Vale versions,
platform assets, archive digests, and license notices. The existing native
installer and source-bound offline bundle SHALL consume that manifest without
duplicated tool supply. Local verification SHALL never download a missing tool.
GitLab and GitHub SHALL supply and qualify the frozen release independently.
The old manifest and installer SHALL retire when their consumers are replaced.

#### Scenario: A native tool is supplied offline

- **WHEN** a supported host receives the exact source-bound bundle or a pinned
  local archive
- **THEN** the installer verifies its digest, safe archive members, executable
  version, and source binding before admitting the tool
- **AND** it preserves the destination's host installation and credentials.

#### Scenario: Native supply is incomplete or changed

- **WHEN** the requested ABI, archive, digest, or source-bound manifest is missing
  or changed
- **THEN** installation and verification fail without fetching a substitute,
  borrowing another Forge's identity, or reusing an earlier bundle
- **AND** only the exact operation's disposable temporary stage is removed.

### Requirement: Configuration placement follows native ownership

Configuration SHALL separate check policy, native tool supply, and release
identity under their semantic homes. Executable rules SHALL remain with their
implementation owner. A supported native TOML format SHALL be preferred for
hand-authored policy. Required native formats and dependency-free bootstrap
records SHALL NOT gain converters, duplicate copies, or old-path fallback.

#### Scenario: Native Markdown policy is selected

- **WHEN** source verification selects Markdownlint policy
- **THEN** the native CLI reads the concern-local TOML configuration and invokes
  the existing Markdown rule implementation
- **AND** actual disabling comments fail while literal examples remain valid.

#### Scenario: Formatting and links consume native policy

- **WHEN** source verification formats files or checks links
- **THEN** Prettier and lychee read their concern-local TOML through native
  configuration arguments instead of duplicated package or command policy
- **AND** formatting ignores ambient editor policy; offline links remain the
  default, with online mode requiring the existing explicit operation.

#### Scenario: Configuration is mixed or duplicated

- **WHEN** a candidate restores the old mixed directory, places supply under
  checks, adds executable configuration, or leaves local state in `.config/`
- **THEN** the existing repository source check rejects the invalid topology
- **AND** adding another proof gate or a compatibility path cannot satisfy it.

#### Scenario: Native formats differ

- **WHEN** Vale requires INI and YAML or the offline installer reads machine
  records before npm dependencies exist
- **THEN** each consumer uses its single required native record directly
- **AND** no TOML converter, duplicate manifest, or bootstrap parser is added.

## REMOVED Requirements

### Requirement: Offline tool supply is qualified by use, not an npm-major label

**Reason:** Its multiple-npm scenario contradicts the later exact native
package-manager contract. A second current compatibility policy would make the
same release accept and reject the same command.

**Migration:** The single native package-manager declaration governs admission.
Source binding, actual version reporting, offline execution, and the audit limit
remain under the existing package-manager and complete-bundle requirements.
