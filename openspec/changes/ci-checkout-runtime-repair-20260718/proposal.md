# Proposal

## Why

The GitHub documentation workflow places the job inside a minimal Node container
before `actions/checkout` runs. That image lacks Git, so checkout can fall back
to an archive and the repository-owned verifier correctly refuses the result:
it requires a real Git checkout. The defect is structural, not a documentation
failure, and it blocks an independent CI plane that the repository already
claims to support.

## What Changes

- **BREAKING** Remove the GitHub job-level container. GitHub verification will
  run on the GitHub-hosted runner, where checkout happens before repository
  tools execute, and will select the locked Node 22 runtime explicitly.
- Keep GitLab as an independent Docker CI plane, but install Git with its Python
  and Chromium prerequisites before the repository verifier runs.
- Add provider-projection regression checks that reject a GitHub job container,
  checkout ordered after runtime work, a GitLab runtime without Git, or a split
  verifier command.
- Record a bounded active claim and Chronicle observation. They describe the
  local repair and its verification boundary; they do not claim a remote ref,
  hosted run, publication, rendering, or organizational adoption.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=hosted documentation checkout/runtime
  contract; reuse=extend; change=modify; facet:lifecycle=validation;
  facet:surface=ci,tests; facet:authority=openspec,workflow,test. Require each
  hosted documentation projection to give the repository verifier a real Git
  checkout before it begins work.

## Out of Scope

- Replacing the repository-owned verification sequence with provider scripts.
- Treating local checks or workflow syntax validation as hosted-CI success.
- Altering the local-only `candidate/dev` or eligible-ref publication boundary.
- Changing a foreign Work Lane or inventing a provider-specific lifecycle.

## Impact

This changes the GitHub workflow, GitLab runtime packages, one repository-native
regression test, the repository-governance specification, and bounded Change
evidence. It removes the GitHub job-container deployment shape rather than
trying to patch its checkout failure after the fact.
