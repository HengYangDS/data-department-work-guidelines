# Configuration

Configuration lives with the responsibility it serves, not in a catch-all tools
directory. Executable checks stay in `tools/`; caches, work state, and evidence
stay outside this directory. The existing repository verifier rejects missing,
misplaced, duplicated, executable, or linked configuration.

| Responsibility            | Owner                                                                   | Native consumer                                                     |
| ------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Formatting                | [Prettier TOML](checks/format/prettier.toml)                            | Prettier, with explicit policy and no ambient editor configuration. |
| Markdown policy           | [Markdownlint TOML](checks/markdown/markdownlint-cli2.toml)             | Markdownlint CLI2, including the existing Markdown rule module.     |
| Prose and terms           | [Vale configuration](checks/prose/vale.ini), its styles, and vocabulary | Vale; the INI file selects its adjacent native YAML styles.         |
| Link checking             | [Lychee TOML](checks/links/lychee.toml)                                 | Lychee; only the explicit online operation changes offline mode.    |
| Native tool supply        | [Supply manifest](supply/native.json)                                   | The existing installer and offline-bundle builder.                  |
| Release artifact identity | [Bundle record](release/offline-bundle.json)                            | Offline inspection, installation, and release verification.         |

Prefer TOML when a native policy consumer supports it. Vale requires INI for its
main configuration, YAML for rules, and text for vocabulary. The supply manifest
and generated release record remain JSON so the offline installer can validate
them before npm dependencies exist. Do not add converters, duplicate records,
or old-path fallbacks.

Git selects formatting input; pinned Prettier identifies its supported formats.
Ambient editor and formatter ignore files cannot remove selected source from
that check. Unsupported native formats keep their own validation.

The [contributor route](../CONTRIBUTING.md) owns setup and release commands.
[OpenSpec and ETHOS](../docs/governance/ethos.md) own change and proof admission;
this directory is not another governance registry.
