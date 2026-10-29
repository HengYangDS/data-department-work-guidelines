# quality Specification

## Purpose

Define the English reader corpus, native prose and terminology checks, local and
live links, literal input identity, and configuration ownership. These checks
establish source properties, not Change authority, remote delivery, or team
adoption; human review assesses meaning and reading quality.

## Requirements

### Requirement: Live links qualify the published edition

Source link checks SHALL remain offline. Release qualification SHALL use pinned
Lychee on current Markdown to check non-peer external links and the selected
peer after its targets exist. Broken in-scope links, including comparison
404s, SHALL fail. Unavailable unselected-peer links SHALL remain explicitly
scoped and pending, not block the selected release or be reported as passed.

#### Scenario: A version is prepared but not tagged

- **WHEN** the source has a prepared Changelog entry for an unpublished tag
- **THEN** offline source verification can pass without network access
- **AND THEN** a live 404 for a future comparison URL cannot be called a
  successful release-link check.

#### Scenario: The version tag is published

- **WHEN** the selected peer's tag exists and release qualification runs
- **THEN** the explicit live link check uses the pinned lychee and current
  Markdown inventory for non-peer external links and the selected peer
- **AND THEN** any broken in-scope link prevents that peer's complete release claim
- **AND THEN** unavailable unselected-peer links remain pending, not passed.

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

Configuration SHALL separate check policy, tool supply, and release identity
under their semantic homes. Executable rules SHALL remain with their
implementation owner. A supported native TOML format SHALL be preferred for
hand-authored policy. Required native formats SHALL NOT gain converters,
duplicate copies, or old-path fallback.

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
- **THEN** review rejects the invalid topology, and installed ETHOS refuses
  native policy outside its declared carriers
- **AND** adding another proof gate or a compatibility path cannot satisfy it.

#### Scenario: Native formats differ

- **WHEN** Vale requires INI and text vocabulary
- **THEN** its consumer uses its single required native record directly
- **AND** no TOML converter, duplicate manifest, or bootstrap parser is added.

### Requirement: Native selected inputs retain literal identity

Native tools SHALL receive each exact selected filename, including option-like
names and names a line-delimited list cannot represent. Native formatter ignore
controls MAY protect byte-exact examples without suppressing non-spacing lint.
Spelling, links, and metadata SHALL cover current readers rather than promote
archived source to guidance.

#### Scenario: A literal filename or preserved example reaches a check

- **WHEN** Git selects an option-like or line-break filename or a byte-exact
  example protected by native formatter control
- **THEN** the tool retains its exact input identity and the formatter preserves
  the example through fix, check, and unchanged second fix
- **AND** remaining source defects and non-spacing rules still fail without an
  ambient policy waiver or a duplicate spacing parser.

### Requirement: DDWG source selects one English reader corpus

DDWG SHALL select its current entrypoints, seven department topics, decisions,
maintenance guidance, and retained source text through the accepted native
content contract. English and Department terminology SHALL be declared
parameters. Shared tools SHALL enforce their applicable checks; human review
SHALL assess faithful meaning, clarity, and reading quality.

#### Scenario: A member or Agent reads a current topic

- **WHEN** the reader follows the task map to a department work question
- **THEN** one English topic owns its duties, authority, conditions, and limits
- **AND** machine metadata is declared as native YAML front matter for the
  accepted registry, and an H1 identifies the reader-facing title.

#### Scenario: A candidate changes the language or meaning

- **WHEN** a candidate introduces new authored prose outside the declared English
  language or changes a duty
- **THEN** editorial review requires English prose and the existing original-duty
  review assesses the meaning change
- **AND** quoted originals, captured historical text, and meaningful code or data
  literals retain their bytes; a whole-file character blacklist cannot replace
  contextual language review
- **AND** a passing language or style report does not certify translation,
  complete equivalence, or team use.

#### Scenario: Historical source is consulted

- **WHEN** a retained original or earlier commit supports a clause review
- **THEN** it remains a historical input rather than current authority
- **AND** present translation or normalization does not certify its earlier
  language, execution, or lifecycle retrospectively.

### Requirement: Installed prose checks govern English and department terms

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
