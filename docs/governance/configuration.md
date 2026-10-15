---
subject: data-department-work-guidelines:configuration
role: reference
state: canonical
relations:
  current_owner: README.md
---

# Configuration

Use this map to find the native input for a check. [Contributing](../../CONTRIBUTING.md)
owns the commands; [repository governance](../governance/README.md) owns
change and acceptance boundaries. Common rules come from the installed ETHOS
product, not this directory index.

| Check or operation                        | Current native input                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Markdown, code, JSON, and YAML formatting | [Prettier](../../.config/checks/prettier/prettier.toml)                                       |
| Configuration syntax and formatting       | [Installed ETHOS](../governance/README.md#proof-and-configuration)                            |
| TOML formatting                           | [Taplo](../../.config/checks/taplo/taplo.toml)                                                |
| Non-spacing Markdown checks               | [Installed ETHOS policy](../governance/README.md#proof-and-configuration)                     |
| English prose and department terms        | [Vale](../../.config/checks/vale/vale.ini), its adjacent styles, and Department vocabulary    |
| Local links and fragments                 | [Lychee](../../.config/checks/lychee/lychee.toml)                                             |
| Project dependency findings               | [OSV dispositions](../../.config/checks/dependencies/policy.toml)                             |
| Native tool acquisition                   | [Supply manifest](../../.config/supply/native.json)                                           |
| CI Node and npm selection                 | [Mise configuration](../../.config/mise/config.toml) and [lock](../../.config/mise/mise.lock) |
| Offline artifact inspection               | [Bundle identity](../../.config/release/offline-bundle.json)                                  |

## Change a native input

Use the consumer's supported format. Vale requires INI for its main
configuration, YAML for styles, and text for vocabulary. The installer reads
its supply and bundle JSON before npm dependencies are available. Do not add
format converters or duplicate declarations.

`package.json` owns the Node line and exact npm version/checksum. Mise discovers
the project configuration and adjacent lock, then scopes the selected runtime
to its child command. [Runtime preparation](../../CONTRIBUTING.md#prepare-the-runtime-and-dependencies)
owns setup and CI isolation.

Run the declared fix and check commands on the same Git-selected inputs. Native
formatting preserves literal examples and prose wrapping; a style check does
not establish factual accuracy or semantic fidelity. For wording and reader
judgment, use the [communication guidance](../communicate.md).

Review an input change with its consumers and current findings. Keep each
native check until its accepted replacement qualifies the same source and
execution boundaries, then retire the replaced input and its references in
that migration. [Tool supply](../governance/README.md#tool-supply-and-offline-execution)
owns artifact approvals and their limits. This map adds no second rule or
exception policy.
