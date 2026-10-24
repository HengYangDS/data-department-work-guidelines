## Why

GitHub's hosted verification of this repository has failed on every platform since
2026-10-14. The generated jobs run `mise exec --locked -- ethos prove`, but the repository
declares no ETHOS supply that a clean runner can install. Task 2.45.2 of
`native-document-quality` would have bound public per-platform `http:ethos` locks; DR-0005
withdrew it because ETHOS then published no per-platform supply. ETHOS now publishes runtime
archives and a Mise declaration for Linux x64 and ARM64, macOS ARM64 and Windows x64, which are
the four platforms that GitHub's jobs use. GitHub's branch protection admits `dev` and `main`
only after the `verify` job passes on all four, so the repository cannot publish until the jobs
can install ETHOS.

## What Changes

- Declare ETHOS in `.config/mise/config.toml` from the Mise declaration of its latest
  published release, and lock its four platform archives in `.config/mise/mise.lock`.
- Qualify GitHub's generated `verify` jobs on the exact head before it lands.
- Record the restored hosted verification under Fixed in the Changelog.

Out of scope: GitLab's jobs and their Windows ARM64 runners, which wait for the GitLab peer
and for ETHOS supply on Windows ARM64 under DR-0005; the offline bundle; and any change to the
generated pipelines.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The tool-supply and publication requirements already require locked product supply and
hosted verification; this Change supplies the product that they assume.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock` and `CHANGELOG.md`. A contributor's
`mise install --locked` now installs ETHOS from its release archive as well; reading the
guidelines still needs no installation.
