# Configuration

Configuration lives with the responsibility it serves, not in a catch-all tools
directory. Executable checks stay in `tools/`; caches, work state, and evidence
stay outside this directory. The existing repository verifier rejects missing,
misplaced, duplicated, executable, or linked configuration.

| Responsibility            | Owner                                                                   | Native consumer                                                                      |
| ------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Source formatting         | [Prettier policy](checks/format/prettier.toml)                          | Markdown, code, JSON, and YAML; literal content keeps its spacing.                   |
| TOML formatting           | [Native TOML policy](checks/format/toml.toml)                           | Official dprint Wasm formatter; values, order, comments, and literals are preserved. |
| Markdown policy           | [Markdownlint TOML](checks/markdown/markdownlint.toml)                  | Markdownlint core and the native list-spacing rule over Git-selected source.         |
| Prose and terms           | [Vale configuration](checks/prose/vale.ini), its styles, and vocabulary | Vale; the INI file selects its adjacent native YAML styles.                          |
| Link checking             | [Lychee TOML](checks/links/lychee.toml)                                 | Lychee; only the explicit online operation changes offline mode.                     |
| Native tool supply        | [Supply manifest](supply/native.json)                                   | The existing installer and offline-bundle builder.                                   |
| Release artifact identity | [Bundle record](release/offline-bundle.json)                            | Offline inspection, installation, and release verification.                          |

Prefer TOML when a native policy consumer supports it. Vale requires INI for its
main configuration, YAML for rules, and text for vocabulary. The supply manifest
and generated release record remain JSON so the offline installer can validate
them before npm dependencies exist. Do not add converters, duplicate records,
or old-path fallbacks.

Git selects formatting input; the pinned native formatters identify supported
formats. Ambient editor and formatter ignore files cannot remove selected source
from the check. Plain text keeps its one-blank-line ceiling; code or structured
formats without a native owner fail rather than silently passing.

The [contributor route](../CONTRIBUTING.md) owns setup and release commands.
[OpenSpec and ETHOS](../docs/governance/ethos.md) own change and proof admission;
this directory is not another governance registry.
