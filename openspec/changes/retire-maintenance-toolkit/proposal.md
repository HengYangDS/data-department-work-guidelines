# Proposal

## Why

Members and Agents read these guidelines without installing anything, yet the repository still
carries a private Node maintenance toolkit: 41 JavaScript files in `tools/` and `tests/`, a
private npm package with 54 locked packages, an OSV Scanner supply and an offline bundle. Its only
remaining duties are a Changelog check, which installed ETHOS already performs for every
repository, and an audit of the npm dependencies that the toolkit itself declares. Everything else
in it exists to
supply, audit, test or distribute the toolkit itself. Installed ETHOS ships its own Node and runs
the formatting, lint, prose, link, metadata and OpenSpec checks, so the toolkit is a second owner
of shared duties.

## What Changes

- **BREAKING** Retire the toolkit. Remove `tools/`, `tests/`, `package.json`, `package-lock.json`,
  `.config/npm/`, the dependency policy and the offline workflow. The contributor commands
  `node tools/docs/cli.mjs check` and `audit`, `node tools/ci/install-native.mjs` and
  `node tools/ci/offline-bundle.mjs` are removed without a replacement command.
- Remove the profile's three repository gates. Installed ETHOS derives proof from the authored
  Markdown, configuration and OpenSpec artifacts.
- Remove the supply checks, the dependency evidence and the GitLab offline jobs from the CI
  parameters and regenerate both projections. Hosted jobs install ETHOS through Mise and run its
  full host graph.
- Keep Mise for ETHOS alone. Remove Node and npm from its configuration and lock, and declare
  `mise install --locked` as the local installation command.
- Stop verifying Changelog comparison links and tag coverage. History rows remain reader
  navigation, written by the release procedure.
- Rewrite Contributing, repository governance and the configuration map for the toolkit-free
  route, and state the `Unreleased` notes as the net change since 7.0.12.
- Retire the `tool-supply` capability. Its three remaining duties move to `guidance-discovery`,
  `publication` and `verification`.

Out of scope: the attached bundles of v7.0.11 and v7.0.12 and the GitLab packages of the toolkit,
which
the existing retention procedure retires as maintainer aftercare; ETHOS supply for GitLab's
Windows ARM64 runners, which is ETHOS work; and a shared ETHOS check for duplicate owners, which
belongs to the ETHOS owner.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `tool-supply`: retired; every requirement is removed, and three move to other capabilities.
- `guidance-discovery`: governance routing names ETHOS preparation instead of offline installation;
  reading without installation joins it from `tool-supply`.
- `verification`: proof uses only installed shared checks; the code-evidence, retained-command
  and default-root requirements are removed; command and CI-name currency joins it.
- `publication`: hosted jobs install ETHOS through Mise; installed ETHOS owns Changelog structure;
  the comparison-link, Changelog-navigation, offline-bundle and native-tool requirements are
  removed; GitLab's Mise bootstrap and the tag routes are stated.
- `quality`: the prose requirement is restated without toolkit scenarios, and configuration
  placement no longer names bootstrap records.

## Impact

- Source: `tools/`, `tests/`, `package.json`, `package-lock.json`, `.config/npm/` and
  `.config/checks/dependencies/` are removed; `.ethos/profile.toml`, `.ethos/release.toml`,
  `.config/ci/`, `.config/mise/`, `.gitattributes`, `.gitignore`, `.github/workflows/` and
  `.gitlab-ci.yml` change.
- Guidance: `CONTRIBUTING.md`, `docs/governance/`, `CHANGELOG.md`, `openspec/specs/` and its
  index change. No department topic changes.
- Version: `VERSION` already prepares 8.0.0, whose major increment covers the removed contributor
  commands.
- Readers need nothing new. Contributors need only ETHOS, installed by `mise install --locked`.
- Published editions, signed tags and attached downloads stay unchanged.
