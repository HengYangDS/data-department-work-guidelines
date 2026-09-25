# quality

## ADDED Requirements

### Requirement: Retained repository text uses English

The repository SHALL present retained tracked reader guidance, operational
instructions, decisions, changelog entries, OpenSpec artifacts, code comments,
and test prose in English. Documentation validation SHALL reject CJK characters
in tracked or unignored candidate text files and SHALL report the file and line.
The automated check SHALL complement, not replace, editorial review for clear
English and faithful translation. Git history SHALL remain intact; translating a
currently tracked archived artifact SHALL NOT imply that its earlier form was
English or that earlier work passed a later governance lifecycle.

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
