# Configuration

Configuration lives with the responsibility it serves, not in a catch-all tools
directory. Executable checks stay in `tools/`; caches, work state, and evidence
stay outside this directory. The existing repository verifier requires the
declared native files and rejects unowned entries, linked configuration, and
duplicate formatting policy in `package.json`.

| Responsibility            | Owner                                                                   | Native consumer                                                                         |
| ------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Source formatting         | [Prettier policy](checks/format/prettier.toml)                          | Markdown, code, JSON, and YAML; literal content keeps its spacing.                      |
| TOML formatting           | [dprint policy](checks/format/toml.toml)                                | Official dprint Wasm formatter; parsed TOML options enter its public configuration API. |
| Markdown policy           | [Non-spacing Markdown rules](checks/markdown/markdownlint.toml)         | Markdownlint over Git-selected source; Prettier alone owns Markdown spacing.            |
| Prose and terms           | [Vale configuration](checks/prose/vale.ini), its styles, and vocabulary | Vale; the INI file selects its adjacent native YAML styles.                             |
| Link checking             | [Lychee TOML](checks/links/lychee.toml)                                 | Lychee; only the explicit online operation changes offline mode.                        |
| Dependency findings       | [Native OSV policy](checks/dependencies/policy.toml)                    | OSV Scanner; complete raw findings and one exact, expiring development disposition.     |
| Native tool supply        | [Supply manifest](supply/native.json)                                   | The existing installer and offline-bundle builder.                                      |
| Release artifact identity | [Bundle record](release/offline-bundle.json)                            | Offline inspection, installation, and release verification.                             |

Prefer TOML when the consumer reads it directly or accepts its parsed values
through a public configuration API. Vale requires INI for its main
configuration, YAML for rules, and text for vocabulary. The supply manifest
and generated release record remain JSON so the offline installer can validate
them before npm dependencies exist. Do not add converters, duplicate records,
or old-path fallbacks.

## Source layout and rule changes

Git selects tracked and non-ignored candidate inputs; native formatters select
supported formats. Commands bind the declared configuration explicitly. Ambient
editor settings and ignore files cannot remove owned source from checks. Use
native ignore controls only for byte-exact examples, not ordinary hygiene.
Checks never rewrite source; `npm run format` is the explicit writing operation.

Prettier owns Markdown spacing on identical fix/check inputs. Its second pass
must be unchanged. Markdownlint owns non-spacing checks and cannot veto
formatter-accepted containers or native ignore controls.

| Structure                                              | Canonical layout                                                                                |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Adjacent document-level blocks, including front matter | One blank line; no edge padding; one final newline.                                             |
| Soft-wrapped paragraphs, table rows, metadata fields   | Contiguous lines within the same group.                                                         |
| Lists and nested blocks                                | Keep tight containers tight; preserve one semantic separator in loose or multi-paragraph items. |
| Quotes                                                 | Keep separators at their quote depth; one ordinary blank line between independent quotes.       |
| Code and embedded languages                            | Native syntax and formatter; byte-exact examples use native ignore.                             |

Prettier formats supported code, JSON, and YAML. Native dprint TOML formatting
preserves parsed values, key/array order, comments, and multiline-string bytes;
raw blank-line checks do not apply to literal strings. Plain text without a
structural owner retains the one-blank-line ceiling. Unsupported code formats
fail rather than silently pass.

Text checks read complete UTF-8, including supplementary Han characters, and
reject invalid encoding or NUL. Effective Git attributes select LF regardless of
host defaults. `-text` declares binary assets, not an exemption for known text.

Vale checks reader text in paragraphs, headings, lists, quotes, link labels, and
table cells. Code spans, fences, and URL destinations retain syntax. Vocabulary
entries must name real terms; native rules target diagnosed needless phrases
without erasing authority, feasibility, uncertainty, or meaningful passive voice.
Keep each rule's cases beside it; the existing suite runs native Vale rule tests
and real-document checks. Actual Vale control comments fail Markdownlint even
when nested; literal examples, escaped controls, and ordinary comments remain
valid. These checks cannot judge factual accuracy, semantic fidelity, or
understanding.

The native OSV policy applies one exact, expiring development disposition to the
complete raw project scan. Artifact approval and online qualification follow the
[supply boundary](../docs/governance/ethos.md#tool-supply-and-offline-execution).

[Contributing](../CONTRIBUTING.md) owns setup, fix/check, and release commands.
[OpenSpec and ETHOS](../docs/governance/ethos.md) own change and proof admission.
This page explains the declared native configurations; it adds no separate
registry or policy.
