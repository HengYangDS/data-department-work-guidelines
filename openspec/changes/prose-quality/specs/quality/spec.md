# Quality Delta

## ADDED Requirements

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
