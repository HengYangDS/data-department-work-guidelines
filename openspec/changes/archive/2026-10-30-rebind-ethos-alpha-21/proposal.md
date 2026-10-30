## Why

The repository declares and runs ETHOS 0.2.0-alpha.20. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.21. It is published with its own
Mise declaration, whose platform checksums equal the release's `SHA256SUMS`, and it is the first
release that declares Windows ARM64. With it, the GitLab jobs on the Windows ARM64 runners, which
have failed at ETHOS supply, can install ETHOS. There the launcher still exits before ETHOS runs,
which this Change records and ETHOS follows up.

The GitLab observation that `retire-maintenance-toolkit` withdrew as task 3.2 also returns here.
Its HTTP 401 came from a stray GitLab CLI host entry without a port, not from a missing credential;
the authenticated entry observes this project's pipelines.

## What Changes

- Replace the 0.2.0-alpha.20 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.21, unchanged, and lock it again with native `mise lock`. The lock
  keeps naming only ETHOS and gains the Windows ARM64 platform.
- Bind the repository family to the 0.2.0-alpha.21 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.20 runtime as the rollback.
- State in repository governance that GitLab's Windows ARM64 runners install the release's Windows
  ARM64 archive, and that its launcher still exits before ETHOS runs.
- Keep each GitLab job's Mise data and cache under its own execution root, as
  `architecture-publisher` does, write Windows shims as files, and generate both pipelines again.
  On the Windows ARM64 review runner the installed archive was refused when Mise copied its
  executable shim.
- Record the move under Changed in the Changelog.
- Qualify the head on GitHub and on GitLab's Linux and macOS review jobs, and record the Windows
  ARM64 review job as withdrawn under DR-0005 with its evidence.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `.config/ci/verification.toml`, the
generated `.gitlab-ci.yml`, `CHANGELOG.md`, `CONTRIBUTING.md`, `docs/governance/README.md` and the
repository-common runtime selection. Hosted jobs on both Forges install the declared supply,
including the GitLab Windows ARM64 jobs, and each GitLab job downloads ETHOS into its own
execution root. The GitLab Windows ARM64 jobs keep failing at the launcher start until the ETHOS
follow-up lands. `tasks.md` is the sole progress ledger.
