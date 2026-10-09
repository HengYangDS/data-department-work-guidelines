# quality Specification

## Purpose

Define English source, native formatting and prose, reader links, decision-record
form, and configuration ownership. These checks establish source properties,
not Change authority, remote delivery, or team adoption.

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

#### Scenario: Native shell operators do not hide an invocation

- **WHEN** a DR embeds a supported compound command, redirection, or process
  substitution around a recognized command
- **THEN** the existing native lexer preserves its operator and argument
  boundaries, and the public decision validator rejects the invocation
- **AND** quotation, literal glob operands, ordinary operator descriptions,
  and meaningful evidence links retain their existing boundaries
- **AND THEN** inspection evaluates neither the command nor host variables.

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

### Requirement: Retained source receives format and spacing checks

Native format and Markdown checks SHALL cover all Git-selected source,
including archives. Prettier alone SHALL own Markdown spacing for fix and check
on identical inputs with unchanged second-pass output. It SHALL preserve tight
lists and nested fences, one semantic separator in loose lists and between
document blocks, and meaningful code/data spacing. Other lint SHALL NOT reject
formatter-accepted structure or issue a duplicate spacing verdict.

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
- **THEN** the native formatter preserves that literal content
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

- **WHEN** a native formatter ignore comment exempts a byte-exact example
- **THEN** the native formatter preserves that example through fix, check,
  and a second fix pass
- **AND** non-spacing Markdown rules still apply without a suppression blacklist
  or second spacing parser; strings, YAML scalars, and ordinary TOML comments
  retain their data and native formatting behavior.

#### Scenario: Wrapped simple list items contain unnecessary gaps

- **WHEN** wrapped, ordered, task, nested, or quoted list items have repeated
  blank lines outside literal content
- **THEN** native format check rejects the source and formatting reconciles its
  container separators
- **AND** Markdown lint accepts the fixed point without a second spacing verdict
- **AND** ambient ignore files cannot remove Git-selected inputs from either
  formatter invocation.

#### Scenario: List structure requires separation

- **WHEN** a list item has internally separated paragraphs or blocks
- **THEN** the native formatter preserves literal content and reconciles
  semantic loose-item separators
- **AND** tight nested lists, separate lists, heading boundaries, and ordinary
  paragraph separation retain their structure.

#### Scenario: A tight list contains a fenced example

- **WHEN** a tight list item contains a fence without surrounding blank lines,
  including a nested, task, or quoted list
- **THEN** native formatting preserves that fixed point and native lint
  accepts it
- **AND** fences outside lists still require reader-block separation; a fence
  alone does not make a list loose.

#### Scenario: Reader padding follows a valid code example

- **WHEN** reader blocks have consecutive blank lines outside literal code
- **THEN** the native format check rejects the selected source file
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

#### Scenario: Native tools receive literal selected filenames

- **WHEN** a selected source filename resembles a command option or contains
  a line break
- **THEN** the existing native tool invocation supplies that exact filename
  without interpreting it as an option or splitting it into multiple inputs
- **AND** a formatting defect or broken link still fails, while corrected source
  passes without restricting valid repository filenames.

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
- **THEN** the official Vale rule-test runner rejects its embedded cases and
  uncovered rule through the existing test suite
- **AND** project-level positive and negative prose checks still verify real
  documents and configuration; rule cases do not replace them.

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
- **AND** its owned temporary input list is removed without another attempt.

### Requirement: Configuration placement follows native ownership

Configuration SHALL separate check policy, native tool supply, and release
identity under their semantic homes. Executable rules SHALL remain with their
implementation owner. A supported native TOML format SHALL be preferred for
hand-authored policy. Required native formats and dependency-free bootstrap
records SHALL NOT gain converters, duplicate copies, or old-path fallback.

#### Scenario: Native Markdown policy is selected

- **WHEN** source verification selects Markdownlint policy
- **THEN** the native core reads the concern-local TOML configuration through
  its official configuration API and checks the complete Git-selected files
- **AND** the existing Markdown rule implementation remains the comment owner
- **AND** actual disabling comments fail while literal examples remain valid.

#### Scenario: Markdown source does not need a glob wrapper

- **WHEN** Git selects current or official historical Markdown with literal
  braces, spaces, or leading punctuation in a filename
- **THEN** the native core checks those exact files with one configured policy
- **AND** no glob expansion, ambient per-directory policy, or retired CLI2
  dependency selects, excludes, or reinterprets that source.

#### Scenario: Native configuration objects retain rule options

- **WHEN** the TOML policy permits repeated categories under separate releases
  and excludes tables, headings, and code from prose-width checking
- **THEN** the native core preserves those options without adding exceptions
- **AND** duplicate categories within one release, over-width prose, and
  document-level suppression of required rules still fail with native location
  and rule diagnostics.

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

### Requirement: Source text and binary ownership remain explicit

Known plain-text identities, extensions, and native parsers SHALL define text
ownership; files without extensions SHALL NOT default to plain text. Unowned code,
invalid UTF-8, and NUL SHALL fail with a source path. Effective Git attributes
SHALL identify binaries and require LF for text; known text SHALL NOT evade
checks through a binary declaration. Symlinks SHALL remain excluded from text
interpretation. Plain UTF-8 text SHALL receive native spacing checks.

#### Scenario: An undeclared carrier would evade source checks

- **WHEN** an input without an extension has no native owner, or known text declares
  binary content or contains invalid UTF-8 or NUL
- **THEN** source validation refuses with its path rather than skipping it
- **AND** declared binary assets, source aliases, and native structured formats
  retain their own interpretation boundaries.

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
