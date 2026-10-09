# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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

## REMOVED Requirements

### Requirement: Default proof and root binding are distinct

**Reason**: This requirement belongs to the verification capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/verification/spec.md` through this Change.

### Requirement: One portable documentation verifier measures source properties

**Reason**: This requirement belongs to the verification capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/verification/spec.md` through this Change.

### Requirement: Tool supply and portability require executed checks

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: Reader interpretation is reviewed without staged adoption theater

**Reason**: This requirement belongs to the verification capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/verification/spec.md` through this Change.

### Requirement: Product-owned code evidence accompanies document proof

**Reason**: This requirement belongs to the verification capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/verification/spec.md` through this Change.

### Requirement: A supplied offline bundle can install the complete verification toolchain

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: The actual package manager conforms before execution

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: Package-manager acquisition stays outside offline verification

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: Public bundle acquisition has no ambient CLI dependency

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: Public-command integration has a bounded native execution budget

**Reason**: This requirement belongs to the verification capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/verification/spec.md` through this Change.

### Requirement: Complete retirement of replaced quality tools

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: One source-bound native quality supply

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.

### Requirement: Source-event tag routes match the release family

**Reason**: This requirement belongs to the tool-supply capability.
**Migration**: Preserve its full obligation and scenarios at
`openspec/specs/tool-supply/spec.md` through this Change.
