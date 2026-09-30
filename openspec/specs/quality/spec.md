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

### Requirement: Product-owned code evidence accompanies document proof

`docs-integrity` and `markdown-format` SHALL bind ETHOS-owned behavior or
static-analysis providers to repository-relative Node commands. ETHOS SHALL
conjoin each command with native Node tests, coverage, and JavaScript syntax
checks from its accepted runtime on the same committed tree. Neither command
output nor a repository-authored report SHALL prove code correctness. Profile
validation SHALL reject missing or misdirected providers without adding a
third gate.

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
- **THEN** the two existing gate IDs satisfy their mapped quality obligations
- **AND THEN** no additional default gate or private lifecycle is required.

### Requirement: A supplied offline bundle can install the complete verification toolchain

On each declared platform, a release-bound bundle SHALL supply every
package needed by `npm ci --offline --ignore-scripts` and the pinned lychee
asset. Supported Node/npm and Git SHALL complete actual installation and full
verification from an empty application cache without network. Before
extraction, the installer SHALL match committed source identities and an
external or source-pinned digest. ETHOS remains separate; the bundle SHALL NOT
impersonate its authority.

#### Scenario: Cold local verification succeeds without network access

- **WHEN** a user supplies a complete bundle for the checked-out release on a
  declared host with supported Node/npm and Git
- **AND** the application has no pre-existing npm cache, `node_modules/`, or
  lychee cache
- **THEN** the actual offline install and full repository verifier pass while
  outbound network access is unavailable
- **AND THEN** a successful `npm ci --offline --dry-run` alone is not accepted
  as installation evidence.

#### Scenario: Offline supply is incomplete or altered

- **WHEN** a bundle is missing a required npm entry or lychee asset, contains an
  unsafe member, or disagrees with the checked-out lockfile, tool manifest,
  version, or trusted bundle digest
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

### Requirement: Retained source receives format and spacing checks

Prettier and Markdown lint SHALL cover every tracked or unignored Markdown
candidate, including archived OpenSpec records. The one-blank-line rule SHALL
cover every decodable tracked or unignored text candidate, including archives
and files without extensions; binary files and symlinks are excluded. Spelling,
links, and document metadata SHALL remain scoped to current reader material;
archived records SHALL NOT become current guidance.

#### Scenario: An archived Markdown file breaks source hygiene

- **WHEN** a tracked or unignored candidate Markdown file under an official
  Change archive violates Prettier, Markdown lint, or the one-blank-line rule
- **THEN** the repository verifier fails with the offending file
- **AND THEN** the archive remains a historical record, not a current reader
  route or a substitute lifecycle authority.

#### Scenario: Text without a filename extension contains visual padding

- **WHEN** a tracked or unignored candidate UTF-8 text file without a filename
  extension has consecutive blank lines
- **THEN** the repository verifier fails with the file and line
- **AND THEN** binary files and symlinks are not interpreted as prose.

### Requirement: Reader guidance separates visible content from registry metadata

Current guidance SHALL present its title and task-facing content before any
machine-only registry fields in ordinary GitLab and GitHub Markdown rendering.
ETHOS SHALL still be able to identify each document's subject, role, state, and
relations through its accepted product contract. The repository SHALL NOT
introduce a private metadata schema, duplicate page, or second governance
command to achieve this presentation.

#### Scenario: A reader opens a current guidance page

- **WHEN** a member or Agent opens a current topic or task map in either Forge
- **THEN** the visible page begins with its title and reader-facing route
- **AND THEN** internal metadata does not appear as a table or preamble before
  the title.

#### Scenario: Metadata is removed without a product replacement

- **WHEN** a proposed edit hides or removes metadata from a current document
  before ETHOS accepts its replacement representation
- **THEN** installed-product registry validation or repository admission rejects
  the edit
- **AND THEN** a local rendering improvement alone cannot authorize the change.

### Requirement: Live links qualify the published edition

Source verification SHALL keep pinned lychee's local link and fragment checks
offline. The release route SHALL expose a separate, explicit live check of the
same current Markdown inventory after the version tag exists on both Forges.
Broken external links, including a 404 for a comparison URL, SHALL remain a
failure rather than an accepted status or an unreported exclusion.

#### Scenario: A version is prepared but not tagged

- **WHEN** the source has a prepared Changelog entry for an unpublished tag
- **THEN** offline source verification can pass without network access
- **AND THEN** a live 404 for a future comparison URL cannot be called a
  successful release-link check.

#### Scenario: The version tag is published

- **WHEN** both remote tags exist and release qualification runs
- **THEN** the explicit live link check uses the pinned lychee and current
  Markdown inventory
- **AND THEN** any broken external link prevents a complete release claim.

### Requirement: Offline tool supply is qualified by use, not an npm-major label

The source-pinned bundle SHALL bind the exact edition, package lock, Node
major, and lychee supply. It SHALL NOT add a second npm-major declaration as
an admission substitute for actual portability. A clean offline installation
and full repository verifier on each claimed host SHALL determine compatibility
with that host's available npm. The application dependency audit SHALL NOT be
presented as an audit of the Node distribution's bundled package manager.

#### Scenario: Two compatible npm versions use the same bundle

- **WHEN** a bundle built from one accepted source is installed in clean
  checkouts with different npm versions supported by the selected Node line
- **THEN** each installer consumes only the pinned local cache and reports its
  observed npm version
- **AND THEN** the complete verifier passes before either host is claimed
  qualified; a version label alone cannot make that claim.

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

### Requirement: Native English prose and terminology checks

The existing portable verifier SHALL use locked upstream textlint kernel and
Markdown rules to reject repeated words, wordy phrases, clichés, and inconsistent
selected technical terms in current authored Markdown. One rule configuration
SHALL govern standalone prose and full verification. Spelling and formatting
SHALL retain their existing owners. No host configuration, inline suppression,
new service, or second governance plane SHALL influence this check.

#### Scenario: Objective prose defects appear

- **WHEN** current authored Markdown repeats a word, uses a diagnosed wordy
  expression or cliché, or spells a selected technical term inconsistently
- **THEN** the actual upstream rule reports the source location and reason
- **AND** standalone prose and full verification fail on that same finding.

#### Scenario: A table separates prose into cells

- **WHEN** a Markdown cell contains repeated words or an inconsistent term
- **THEN** the verifier checks that cell, including nested emphasis
- **AND** separate cells are not joined into one artificial sentence.

#### Scenario: Syntax and meaningful uncertainty remain intact

- **WHEN** Markdown contains code spans, fenced commands, URL targets, or an
  explicit statement of uncertainty or a meaningful passive construction
- **THEN** the native parser preserves syntax and the selected rule policy does
  not require changing confidence, responsibility, or command bytes
- **AND** no automated prose rewrite is a required verification step.

#### Scenario: Current and historical scopes differ

- **WHEN** the verifier discovers tracked and candidate current Markdown
- **THEN** it checks every current authored file, including an active Change
- **AND** official archived Changes remain historical inputs, not a second
  current style authority or an excuse to hide current files.

#### Scenario: A supported host installs offline supply

- **WHEN** the source-bound release bundle is installed without remote supply
  on any declared verification host
- **THEN** the actual full verifier executes its native prose and terminology
  rules from the locked packages
- **AND** a missing package or rule fails rather than falling back or skipping.

#### Scenario: An upstream package keeps its license notice in a readme

- **WHEN** the native npm package declares its license and includes an explicit
  matching License section instead of a separately named license file
- **THEN** the builder preserves that original package and accepts its notice
- **AND** incidental prose, fenced examples, empty sections, missing declarations,
  and mismatched identifiers cannot substitute for the notice
- **AND** cold installation still requires only the declared Node and npm.

#### Scenario: Native removal encounters a temporary platform lock

- **WHEN** the pinned tool installer removes its own fresh extraction stage
- **THEN** native removal retries are bounded and confined to that stage
- **AND** a persistent removal error fails rather than silently leaving residue.

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
