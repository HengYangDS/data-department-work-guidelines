## Why

The repository declares and runs ETHOS 0.2.0-alpha.21. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-alpha.22, and that every supply chain
move to its latest stable release without a separate confirmation. 0.2.0-alpha.22 is published with
its own Mise declaration, whose platform checksums equal the release's `SHA256SUMS`. It lowers the
per-file ceilings from 512 to 500 lines, which every current document here already meets.

The hosted jobs also lag their tools. GitHub's jobs install Mise 2026.10.19 and GitLab's Linux jobs
Mise 2026.10.17, while 2026.10.24 is the latest stable release. GitLab's Linux image digest predates
the current `node:26-trixie` image.

## What Changes

- Replace the 0.2.0-alpha.21 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-alpha.22, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-alpha.22 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.21 runtime as the rollback.
- Run every hosted job with Mise 2026.10.24. GitHub's jobs take it from `[supply] mise_version`.
  GitLab's Linux jobs read the release's installer and Linux ARM64 archive from the project's GitLab
  package registry, where both are staged after their release digests are checked, and
  `.config/mise/install.sha256` pins the new installer. Raise `min_version` and the floor that
  Contributing states to the same release.
- Move GitLab's Linux image to the current `node:26-trixie` digest.
- Generate both pipelines again from the common model.
- Record the moves in the Changelog.
- Qualify the archived head on GitHub and on GitLab's Linux and macOS jobs. GitLab's Windows ARM64
  jobs stay outside the acceptance, as `rebind-ethos-alpha-21` withdrew them under DR-0005, until
  the ETHOS follow-up for their launcher lands.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `.config/mise/install.sha256`,
`.config/ci/verification.toml`, the generated `.github/workflows/ci.yml` and `.gitlab-ci.yml`,
`CONTRIBUTING.md`, `CHANGELOG.md` and the repository-common runtime selection. The project's GitLab
package registry gains the `mise` 2026.10.24 package, and 2026.10.17 stays as the rollback. The
GitLab Windows ARM64 jobs keep failing at the launcher start until the ETHOS follow-up lands.
`tasks.md` is the sole progress ledger.
