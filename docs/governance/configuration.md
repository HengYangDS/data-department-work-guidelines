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

| Check or operation                        | Current native input                                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Markdown, code, JSON, and YAML formatting | [Prettier](../../.config/checks/prettier/prettier.toml)                                                     |
| Configuration syntax and formatting       | [Installed ETHOS](../governance/README.md#proof-and-configuration)                                          |
| TOML formatting                           | [Taplo](../../.config/checks/taplo/taplo.toml)                                                              |
| Non-spacing Markdown checks               | [Installed ETHOS](../governance/README.md#proof-and-configuration), using shared native policy              |
| English prose and department terms        | Installed `prose`, with a temporary [spelling increment](../../.config/checks/vale/vale.ini) and vocabulary |
| Committed local links and fragments       | Installed `markdown-links`, with [Lychee parameters](../../.config/checks/lychee/lychee.toml)               |
| Project dependency findings               | [OSV dispositions](../../.config/checks/dependencies/policy.toml)                                           |
| Native tool acquisition                   | [Supply manifest](../../.config/npm/native.json)                                                            |
| CI Node and npm selection                 | [Mise configuration](../../.config/mise/config.toml) and [lock](../../.config/mise/mise.lock)               |
| CI runner command prerequisites           | [Runner declarations](../../.config/ci/runners.toml)                                                        |
| Offline artifact inspection               | [Bundle identity](../../.config/npm/offline-bundle.json)                                                    |

## Change a native input

Use the consumer's supported format. Vale requires INI for its main
configuration and text for vocabulary. The shipped policy owns common styles;
the repository retains only a temporary spelling increment pending shared
corpus and vocabulary qualification. The installer reads
its supply and bundle JSON from `.config/npm/` before npm dependencies are available.
These records belong to the retained Node maintenance toolkit, not the document edition. Do not add
format converters or duplicate declarations.

`package.json` owns the Node line and exact npm version/checksum. Mise discovers
the project configuration and adjacent lock, then scopes the selected runtime
to its child command. [Runtime preparation](../../CONTRIBUTING.md#prepare-the-runtime-and-dependencies)
owns setup and CI isolation.

Run `mise run check` and `mise run fix --expect-head OID` on the same Git-selected
inputs, substituting the current commit OID. Both invoke installed ETHOS's native
formatter; preview uses `ethos lane format --json`. Fix requires exact Work Lane
admission before writing. Native formatting preserves literal examples and prose
wrapping; a style check does not establish factual accuracy or semantic fidelity.
For wording and reader judgment, use the [communication guidance](../communicate.md).

Review an input change with its consumers and current findings. Keep each
native check until its accepted replacement qualifies the same source and
execution boundaries, then retire the replaced input and its references in
that migration. [Tool supply](../governance/README.md#tool-supply-and-offline-execution)
owns artifact approvals and their limits. This map adds no second rule or
exception policy.
