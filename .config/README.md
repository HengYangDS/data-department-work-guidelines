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
| Markdown policy           | [Markdown and remark options](checks/markdown/markdownlint.toml)        | Markdownlint core and remark list-spacing options over Git-selected source.             |
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

The dependency policy uses native OSV fields for one exact, expiring development
approval. The audit retains the complete unfiltered report and rejects
unapproved findings, expired approvals, and stale dispositions. Image and
native-tool approvals have separate subjects and qualification. Replace the
current compatibility check when accepted ETHOS covers those native subjects;
do not keep a second policy implementation.

Git selects formatting input; the pinned native formatters identify supported
formats. Ambient editor and formatter ignore files cannot remove selected source
from the check. Plain text keeps its one-blank-line ceiling; code or structured
formats without a native owner fail rather than silently passing.
Native comment parsers distinguish executable Prettier suppression comments
from literal examples. Pinned TOML formatting retains ordinary comments and
formats their following source; no separate comment blacklist is needed.
The source text boundary checks complete UTF-8 bytes, including supplementary
Han characters, rather than silently skipping NUL or invalid encoding.
Git attributes declare binary assets with `-text`; a known text format cannot
use that declaration to evade its owner. Effective native attributes select LF
for every text input, independent of host defaults.

The [contributor route](../CONTRIBUTING.md) owns setup and release commands.
[OpenSpec and ETHOS](../docs/governance/ethos.md) own change and proof admission;
this directory is not another governance registry.
