## Why

`rebind-ethos-alpha-21` withdrew GitLab's Windows ARM64 acceptance under DR-0005. The jobs installed
the release's Windows ARM64 archive, but ETHOS did not run there: first its launcher exited with
status 6 because the installed interpreter's path was 253 characters long, and under
0.2.0-alpha.24 its proof stopped on a code page 936 decode (job 62963). 0.2.0-alpha.25 fixes both, and
`rebind-ethos-alpha-25`'s Windows ARM64 review job 62984 ran the complete verifier and passed: eight
checks, none failing. DR-0005 returns a withdrawn task through a new Change once its environment
exists. `docs/governance/README.md` still says that the launcher exits before ETHOS runs.

## What Changes

- State in `docs/governance/README.md`, in its supply table and under "Qualify Each Platform", that
  GitLab's Windows ARM64 runners run the locked release's complete verifier and qualify the
  platform.
- Record the change in the Changelog.
- Qualify the archived head on GitHub and on all of GitLab's review jobs, Windows ARM64 included.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`docs/governance/README.md` and `CHANGELOG.md`. GitLab's Windows ARM64 jobs become part of the
hosted acceptance again. `tasks.md` is the sole progress ledger.
