# Spec Delta

## MODIFIED Requirements

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

#### Scenario: Native prose emits a warning beside a valid report

- **WHEN** the selected Vale process exits successfully with a valid report but
  also emits standard error
- **THEN** the existing prose owner refuses the result without hiding the
  original report or warning
- **AND** one warning-free native attempt may pass without another attempt or a
  waiver.

#### Scenario: A native style rule stops matching its examples

- **WHEN** a configured style rule loads but no longer diagnoses its declared
  defect
- **THEN** that shipped rule and its embedded cases remain with installed ETHOS;
  DDWG keeps no rule-test suite of its own
- **AND** the installed prose check still verifies real documents and
  configuration; rule cases do not replace it.

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
- **THEN** the installed prose check rejects it
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

- **WHEN** the pinned tool installer removes its own fresh temporary stage
- **THEN** native removal retries are bounded and confined to that stage
- **AND** the installer awaits one asynchronous native removal with at most ten
  retries with linearly increasing 200-millisecond waits before reporting
  success
- **AND** a persistent removal error fails rather than silently leaving residue.

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

#### Scenario: Native link extraction emits a warning

- **WHEN** the selected lychee extraction process exits successfully with
  links but also emits standard error
- **THEN** the existing link owner preserves those diagnostics and refuses
  acceptance before checking targets
- **AND** no other attempt is made.

### Requirement: Configuration placement follows native ownership

Configuration SHALL separate check policy, native tool supply, and release
identity under their semantic homes. Executable rules SHALL remain with their
implementation owner. A supported native TOML format SHALL be preferred for
hand-authored policy. Required native formats and dependency-free bootstrap
records SHALL NOT gain converters, duplicate copies, or old-path fallback.

#### Scenario: Native Markdown policy is selected

- **WHEN** source verification selects Markdownlint policy
- **THEN** installed `markdown-lint` reads its shipped policy through the
  official configuration API and checks the Git-selected authored Markdown;
  DDWG keeps no Markdownlint configuration
- **AND** inline configuration comments cannot disable its rules while literal
  examples remain valid.

#### Scenario: Markdown source does not need a glob wrapper

- **WHEN** Git selects current Markdown with literal braces, spaces, or leading
  punctuation in a filename
- **THEN** installed `markdown-lint` checks those exact files with one
  configured policy
- **AND** no glob expansion, ambient per-directory policy, or retired CLI2
  dependency selects, excludes, or reinterprets that source.

#### Scenario: Native configuration objects retain rule options

- **WHEN** the shipped policy permits repeated categories under separate
  releases
- **THEN** installed `markdown-lint` preserves that option without adding
  exceptions
- **AND** duplicate categories within one release and document-level
  suppression of required rules still fail with native location and rule
  diagnostics.

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

- **WHEN** Vale requires INI and text vocabulary or the offline installer reads
  machine records before npm dependencies exist
- **THEN** each consumer uses its single required native record directly
- **AND** no TOML converter, duplicate manifest, or bootstrap parser is added.
