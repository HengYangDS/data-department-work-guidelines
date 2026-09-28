# quality Delta

## ADDED Requirements

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
