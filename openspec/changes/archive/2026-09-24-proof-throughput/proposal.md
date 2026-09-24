# Proposal

## Why

DDWG's accepted ETHOS runtime rejects its former workspace and profile shapes,
which prevented formal Work Lane admission. Its GitHub documentation workflow
also depends on a repository-specific macOS self-hosted runner even though the
desired publication topology uses GitHub-hosted verification and keeps GitLab
runner ownership separate.

## What Changes

- Complete the DDWG compatibility migration to the accepted ETHOS branch-role
  and typed-profile contracts without restoring a private lifecycle mechanism.
- Replace stale DDWG references to removed ETHOS commands with current public
  command-plane and official OpenSpec usage.
- Replace the GitHub self-hosted documentation workflow with an Ubuntu-hosted
  Node 22 and Chrome setup while retaining the shared repository verifier and
  the existing independent GitLab runner projection.
- Move repository-root binding from an obsolete optional profile descriptor to
  an ordinary repository-native validation; keep it outside the default proof
  floor.
- Remove the superseded Change-local `scope.toml` assumption and obsolete
  capability metadata; use the current ETHOS active-Change attribution contract
  and official OpenSpec directory shape.
- Update the structural boundary validator's command grammar and tests so it
  recognizes current executable syntax without rejecting prose or evidence
  links.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: revise the documentation adopter's ETHOS-compatible
  lifecycle and dual-Forge hosted-verification contract.
- `quality`: keep default proof and root binding distinct under the current
  typed profile contract, and keep DR command detection precise.

## Impact

Affected paths include ETHOS configuration and routing documents, the GitHub
workflow, CI and profile contract tests, the boundary validator, canonical
OpenSpec specifications, active Change and evidence carriers, and the CHANGELOG.
This Change does not change GitLab runner ownership, host services, Parallels,
publication eligibility, historical DRs, or archived adoption records.
