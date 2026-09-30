# Design

## Context

The baseline is released v5.2.3 at accepted source
`6a97ca2e17870906287d88bf29284ce50103149a`. The current official-source audit
covers every npm lock identity, all Proxy Python dependencies, standalone
tools, and pinned GitHub Actions: 299 unique identities, with no unresolved
metadata query. All seven direct repository tools and Node 26.10.0 match current
stable upstream. npm resolves one compatible change: `ignore` 7.0.10 to 7.0.11.
The last source-bound offline bundle must not be reused with a different lock.

## Goals / Non-Goals

**Goals:** update the supported closure, preserve document behavior and all
normative meaning, and deliver matching source and offline supply independently
to both Forges.

**Non-goals:** force upstream tools across their declared dependency contracts,
replace official OpenSpec, change the department rules, broaden host platform
claims, or change another repository or Runner service.

## Decisions

### Respect the current official dependency contracts

Use npm's native resolver with unchanged direct pins and no install scripts.
Direct tools are already current. Reject blanket `overrides`: a newer transitive
major does not prove compatibility with its parent. Replacing official OpenSpec
or forking a linter merely to flatten versions would create unsupported owners.

The remaining below-latest repository identities are constrained by current parents:

| Current parent                                         | Constrained dependencies                                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `@fission-ai/openspec`, `ora`, `chalk-template`        | `chalk`, `commander`, `mute-stream`, `onetime`                                                                    |
| `fast-glob`, `@nodelib/fs.walk`, `@nodelib/fs.scandir` | NodeLib filesystem packages, `glob-parent`                                                                        |
| `cross-spawn`, `which`, `shebang-command`              | `which`, `isexe`, `path-key`, `shebang-regex`                                                                     |
| `markdownlint-cli2`                                    | `js-yaml`, `markdown-it`, its own `smol-toml` copy                                                                |
| `markdownlint`                                         | `micromark`, `micromark-core-commonmark`, `micromark-extension-gfm-table`, `micromark-util-types`, `string-width` |
| `micromark-extension-math`                             | `katex` and its `commander` copy                                                                                  |
| `parse-entities`                                       | `@types/unist`                                                                                                    |
| `global-directory`                                     | `ini`                                                                                                             |
| `micromatch`                                           | `picomatch`                                                                                                       |

Some dependencies also have a current copy for another parent. Those copies
do not eliminate the older required copy. Report this as constrained upstream
state, not as an entirely latest transitive tree. A new upstream compatible
release may remove a constraint; source keeps no private compatibility schema.

### Release an internally compatible patch

Use v5.2.4: the normative rules, contributor commands, and reader routes are
unchanged. Rebuild one complete offline bundle from the resolved npm lock and
unchanged, hash-pinned lychee assets and licenses. Freeze its inspected bytes,
commit its real manifest, and publish those same bytes to both Forges. Keep
published v5.2.3 immutable.

### Keep local verification independent of publication

Source quality and exact-HEAD ETHOS proof run locally. Online audit, each Forge's
source CI, each release object, and offline host execution are separate claims.
No missing external check blocks independent implementation or local tests;
no local success substitutes for those external checks.

## Risks / Trade-offs

- A lock refresh changes rendered or parsed behavior: run the complete source
  verifier and negative tests, then both hosted source matrices.
- A reused bundle disagrees with source: rebuild and inspect the bundle against
  the new version and exact lock; execute install outside the source checkout.
- Latest metadata advances during delivery: bind the audit to its timestamp,
  preserve current evidence, and recheck affected identities before closeout.
- Dependency constraints remain upstream: disclose them and do not manufacture
  unsupported compatibility merely to claim a flat latest-version inventory.

## Migration Plan

1. Resolve the current lock in a temporary validation copy; verify its input
   hashes, exact package delta, and absence of `node_modules`.
2. Apply the native resolution in the owned Work Lane, prepare v5.2.4 and its
   source-bound offline bundle, and run source and package checks.
3. Commit and prove the exact source. Publish the reviewed source through ETHOS,
   observe both source matrices, then cut and publish the signed release.
4. Retrieve and compare both Forge assets, execute the offline matrices, finish
   this task ledger, archive officially, prove the archive commit, and retire
   the exact absorbed work lane and proposals.
