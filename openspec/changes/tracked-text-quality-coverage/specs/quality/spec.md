# quality Delta

## MODIFIED Requirements

### Requirement: One portable documentation verifier measures source properties

One shell-independent locked verifier SHALL check Prettier formatting of
Markdown, code, JSON, and YAML; TOML syntax; Markdown lint; CSpell spelling;
offline, version-checked lychee links and fragments; metadata; English,
spacing, decision records, and navigation. Prettier and Markdown lint SHALL
cover every tracked or unignored candidate Markdown file, including archived
OpenSpec records. The one-blank-line rule SHALL cover every decodable tracked
or unignored candidate text file, including archives and files without
filename extensions;
binary files and symlinks remain outside that text rule. Spelling, links, and
document metadata SHALL continue to target current reader material rather
than treating archives as current guidance. The same entrypoint SHALL run
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
