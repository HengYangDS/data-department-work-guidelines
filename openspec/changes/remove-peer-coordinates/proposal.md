## Why

The owner requires that no tracked file or shipped artifact names a peer: no address, host, port,
project path or account namespace. A Changelog that links both GitLab and GitHub tells each peer
where the other lives, and the same file is published to every peer, GitHub's public one included.
Today the Changelog holds 38 History rows with 76 link definitions, 38 of them to the GitLab peer's
private address and port. `.ethos/release.toml` declares each peer's `forge_repository`; the GitLab
one is the same private address and port.

The installed ETHOS needs neither. Its Changelog check permits a History row but does not require
one, and it accepts this Changelog without them. Its review observation reads each peer's web
repository from the clone's own Git configuration when `forge_repository` is absent: the local
`remote.<name>.forgeRepository`, or the remote's own URL. ETHOS's planned `peer-resolution`
retires the tracked field, and its `peer-neutral-outputs` renders comparison links at release
time, so this Change already matches the end state.

## What Changes

- Remove the 38 History rows and their 76 link definitions from `CHANGELOG.md`. The bracketed
  headings, dates, categories and entries stay.
- Remove both `forge_repository` lines from `.ethos/release.toml`. Each peer keeps its id,
  provider, role, Git remote, capabilities and CI surface.
- Rewrite the Changelog and release rules in `docs/governance/README.md` and `CONTRIBUTING.md` to
  match.
- Record the change in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. No specification names the History rows or the forge field, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`CHANGELOG.md`, `.ethos/release.toml`, `docs/governance/README.md` and `CONTRIBUTING.md`. Five links
in immutable records (two decision records and one archived design) wait for ETHOS's
`peer-identity-records`, and the two local command fields wait for `peer-resolution`. Git history
keeps the earlier text. `tasks.md` is the sole progress ledger.
