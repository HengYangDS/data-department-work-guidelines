# Spec Delta

## Purpose

Define complete, source-bound maintenance-tool supply and portable offline
execution while keeping guidance directly readable and each Forge independent.

## ADDED Requirements

### Requirement: Tool supply and portability require executed checks

CI SHALL verify native-tool digests and audit all locked dependencies online with
OSV Scanner, separately from offline source checks. One complete raw report
SHALL retain all findings before exact development approval; unapproved findings
and expired approvals SHALL fail. Project locks, CI images, and native binaries
SHALL remain separate risk subjects. Each claimed OS SHALL execute the full
portable graph without host paths or POSIX shells.

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

#### Scenario: Temporary diagnosis cannot replace verification

- **WHEN** a temporary Windows profiling job is explicitly started on a proposal
- **THEN** it uses the existing review identity, native profiling, locked supply,
  and shared Windows resource group, and retains original profiles on failure
- **AND** mandatory source verification keeps its full discovered test set and
  existing deadline; diagnostic results do not authorize acceptance
- **AND** its optional CI wiring is removed before final release qualification.

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

#### Scenario: Prose or dependency supply fails

- **WHEN** a current Markdown file contains a misspelling
- **THEN** the locked spelling check rejects it without a local waiver.
- **WHEN** the native dependency audit reports an unapproved advisory, fails,
  provides malformed or incomplete evidence, emits warnings, or observes drift
- **THEN** each hosted job fails before running the repository verifier
- **AND** both Forges preserve complete raw findings and execution output.

#### Scenario: The approved native disposition is scoped and expires

- **WHEN** the exact human-approved native OSV entry is active
- **THEN** the existing input owner admits only npm `braces` 3.0.3 with its
  approved integrity in development paths, before 2026-10-18 00:00 UTC
- **AND** one unfiltered raw scan retains approved and unapproved findings;
  any unrelated finding remains blocking
- **AND** online qualification observes the public npm stable release through
  isolated native configuration and a fresh cache with explicit online freshness;
  its original command, configuration, output, and status remain with the raw scan
- **WHEN** input bytes, finding subjects, or the stable release change, the
  finding disappears, is withdrawn, has an official fix, or the entry expires
- **THEN** qualification fails until the stale disposition is retired and the
  changed inputs are qualified again
- **AND** no package-wide ignore, private schema, filtered second scan, or
  cross-repository waiver replaces that boundary.

#### Scenario: Native tools and the CI image need their own approval

- **WHEN** a supplied native tool, npm runtime, or CI image has a known finding
- **THEN** qualification requires its actual component report and exact human
  approval for the artifact, use, and period
- **AND** the project-lock approval cannot authorize another subject; accepted
  ETHOS risk admission must qualify the actual consumer before the bounded
  repository compatibility is removed.

#### Scenario: Clean source checks do not renew an expired approval

- **WHEN** local source checks run after an earlier approval date
- **THEN** they remain network-independent and do not grant artifact use or
  distribution authority
- **AND** a clean native audit with no stale disposition remains valid; retained
  approval evidence is not relabeled as a fix.

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
package, declared native asset, and upstream notice. Supported Node/npm
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

#### Scenario: An archive carries another machine's file ownership

- **WHEN** a verified bundle or native-tool archive names the packaging
  machine's owners and the destination cannot change file ownership
- **THEN** native extraction retains the current executor's ownership without
  adding privileges, altering the source-pinned archive, or skipping validation
- **AND** digest, confinement, license, and required executable-mode checks
  remain intact; full verification still runs in the constrained consumer.

#### Scenario: A concurrent acquisition fails after another call succeeds

- **WHEN** a caller acquires the source-bound bundle
- **THEN** it verifies an exclusively owned temporary output before exclusive
  publication
- **WHEN** two calls acquire the same bundle and one completes before the
  other's download or verification fails
- **THEN** the completed target and its digest remain unchanged
- **AND** the failed call neither overwrites nor removes that target and removes
  only its own temporary stage.

#### Scenario: A managed cache path is linked or already installed

- **WHEN** a managed binary, downloaded archive, or repository-local parent is
  linked or has a type other than its required regular file or directory
- **THEN** installation and verification fail before remote access, staging, or
  execution through that path
- **WHEN** installation or verification reuses a regular binary with the pinned
  version, including an ordinary cache hit or a concurrent supplied install
- **THEN** its permissions and bytes remain unchanged.

#### Scenario: A bundle download parent points outside the repository

- **WHEN** either Forge acquisition encounters a symbolic link or Windows
  junction at any repository-local parent of its download target
- **THEN** it fails before a network request or temporary stage is created
- **AND** the foreign directory's existing files and bytes remain unchanged.

#### Scenario: Offline validation inherits enabled telemetry

- **WHEN** the verifier invokes official OpenSpec during offline validation
- **THEN** the child-process environment supplies one official opt-out value
- **AND** inherited telemetry settings, including enabled values and
  case-variant Windows keys, cannot override it
- **AND** the child makes no telemetry or update request
- **AND** the parent environment and global configuration remain unchanged.

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

One native manifest SHALL bind Vale, lychee, and OSV Scanner versions,
platform archives or raw binaries, asset and executable digests, raw sizes, and
original notices. Archive and executable digests SHALL remain distinct; raw
executables SHALL reuse the asset digest. Installer and source-bound bundle
SHALL consume this manifest without duplicated supply. Every declared platform
SHALL supply the complete tool graph; missing local tools SHALL NOT be downloaded.

#### Scenario: Reading guidelines needs no maintenance-tool installation

- **WHEN** a member or Agent needs to read or apply the guidelines
- **THEN** the repository entry directs them to current documentation without
  requiring tool installation
- **AND** the contributor route distinguishes optional offline maintenance tools
  from the document edition and separately installed ETHOS.

#### Scenario: Source and offline verification cover the declared hosted platforms

- **WHEN** GitHub verifies source or installs the frozen offline bundle
- **THEN** both workflows use the same declared Linux x64, Linux ARM64, macOS,
  and Windows hosted selectors and execute the complete repository verifier
- **AND** an omitted, duplicated, extra, or skipped host fails CI configuration
  validation; matrix membership alone does not qualify platform execution
- **AND** each actual job retains its own source, runtime, and result evidence.

#### Scenario: Node setup consumes one explicit runtime input

- **WHEN** source or offline CI configures the project Node runtime
- **THEN** the existing CI owner requires the declared major, latest-release
  resolution, and disabled automatic package-manager caching as its only inputs
- **AND** an alternative version-file input or undeclared setup option fails
  configuration validation before hosted execution
- **AND** the action commit and subsequent native npm declaration remain separate
  supply inputs; a new action version does not establish an advisory-free artifact.

#### Scenario: Windows ARM64 runs native Node and compatible x64 tools

- **WHEN** Node runs natively on Windows ARM64 and a tool has no pinned ARM64
  asset
- **THEN** the existing installer, managed-cache verifier, and offline bundle
  select the same pinned Windows x64 asset without copying its manifest entry
- **AND** a declared ARM64 tool asset takes precedence; absent compatible supply
  fails before package-manager or tool execution
- **AND** asset and executable digests, exact versions, ownership, and complete
  verification remain required; selection tests alone do not prove platform
  execution or timeout recovery.

#### Scenario: Native supply is incomplete or changed

- **WHEN** the requested ABI, archive, digest, or source-bound manifest is missing
  or changed
- **THEN** installation and verification fail without fetching a substitute,
  borrowing another Forge's identity, or reusing an earlier bundle
- **AND** only the exact operation's disposable temporary stage is removed.

#### Scenario: A native tool is supplied offline

- **WHEN** a supported host receives the exact source-bound bundle or a pinned
  local archive
- **THEN** the installer verifies source binding, asset digests, and safe archive
  members before extraction, then the executable digest before running its exact
  version check
- **AND** tool admission requires that version check to pass
- **AND** a replaced manifest or installer retires after verified consumer migration
- **AND** it preserves the destination's host installation and credentials.

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

#### Scenario: A managed executable changes after installation

- **WHEN** a managed native executable is selected through its default cache,
  explicit path, or a PATH name that resolves to that cache
- **THEN** its bytes SHALL match the selected platform's pinned executable
  digest before any version or other tool command starts
- **AND** changed bytes or missing byte identity SHALL fail without execution
  or fallback; a matching version string SHALL not override that failure
- **AND** a different path within managed tool storage SHALL not impersonate
  the selected tool, version, and platform
- **AND** PATH names and direct selectors SHALL identify the actual native file
  before admission, including quoted Windows paths and native executable
  suffixes; an unresolved selector SHALL fail without execution or fallback
- **AND** unchanged cache bytes SHALL remain usable with native version
  admission, while independently owned host tools retain their own byte
  authority and the repository's locked version requirement.

#### Scenario: Standalone tests avoid unrelated quality startup

- **WHEN** the public test command selects the complete Git-discovered test inventory
- **THEN** the CLI loads only its invocation dependencies before native test execution
- **AND** it preserves two workers, the 180-second outer deadline, every selected
  test, and original process failures
- **AND** full verification still executes all declared repository checks; this
  dependency change does not qualify runner capacity or isolation.

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

### Requirement: Current commands and CI names remain executable

Current command examples SHALL be checked against the installed CLI. GitLab
jobs SHALL name purpose and platform symmetrically; hidden phase templates
SHALL own common source and offline steps without changing full test selection,
deadlines, or review/protected isolation.

#### Scenario: A platform-less job or absent command is documented

- **WHEN** a runnable verification job lacks its platform or a current procedure
  names a command absent from its installed public owner
- **THEN** configuration validation or release review rejects that defect
- **AND** valid links, formatting, or an earlier successful job do not make the
  missing command or incorrect job identity acceptable.

### Requirement: Reading guidance is independent of tool installation

Members and Agents SHALL read and apply the guidelines without installing a
repository package. Native tools and the optional offline bundle SHALL serve
maintenance and CI, not be described as installing guidelines. ETHOS SHALL
remain a separate governance prerequisite. GitLab and GitHub SHALL supply and
qualify frozen release bytes independently.

#### Scenario: A reader needs a work rule rather than maintenance tools

- **WHEN** a member or Agent follows a work-guidance route
- **THEN** current documentation is available without a tooling installation
- **AND** Contributing separates optional maintenance supply from the document
  edition and the independently installed governance product.
