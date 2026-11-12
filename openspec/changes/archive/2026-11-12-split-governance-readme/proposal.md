## Why

`docs/governance/README.md` is the entrance to the governance directory, but it is a 332-line policy
page (`role: policy`), not navigation. ETHOS's documentation contract gives a directory's
orientation to its README and the detailed meaning to topic pages, split by reader task. The page
became the README on 15 October 2026, when `configuration.md` joined the directory and the policy
page `ethos.md` was renamed, and later Changes added their rules to it. It also restates installed
ETHOS behavior and parts of the contributor procedure, although it says that it adds no second
contract.

## What Changes

- Move the policy into two pages by reader task: `docs/governance/change-and-release.md` for change
  authority, the two Forges, releases and retirement, and `docs/governance/checks-and-ci.md` for
  source checks, tool supply and runners. Every live obligation and every anchor that another file
  links to move with their section.
- Remove from the policy the descriptions of installed ETHOS behavior and of contributor procedure
  that their owners already hold, and state the archive rule once instead of twice.
- Rewrite `docs/governance/README.md` as a `role: index` page that routes each reader task to one of
  the two pages, the configuration map or `CONTRIBUTING.md`.
- Point the links that name a rule at the page that holds it, in `CONTRIBUTING.md`, `CHANGELOG.md`
  and `docs/governance/configuration.md`, whose owner relation moves to `checks-and-ci.md`. General
  links to repository governance keep the index.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. Each rule keeps its meaning and owner; only the page that carries it changes, so
`.openspec.yaml` sets `skip_specs: true`.

## Impact

`docs/governance/README.md`, the new `docs/governance/change-and-release.md` and
`docs/governance/checks-and-ci.md`, `docs/governance/configuration.md`, `CONTRIBUTING.md` and
`CHANGELOG.md`. Decision records, archived Changes and the general links in `AGENTS.md`,
`CONTRIBUTING.md` and the docs keep their text; their links to the governance README resolve to the
index. `tasks.md` is the sole progress ledger.
