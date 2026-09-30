# Proposal

## Why

GitHub runs the documentation verifier on Linux, macOS, and Windows, but
GitLab currently runs it only on Linux ARM64. Its green pipeline therefore
cannot establish the same independent platform coverage. The same gap exists
in GitLab's post-publication offline-bundle check.

## What Changes

- Give GitLab separate review and protected/release macOS and Windows jobs
  that run the existing full verifier at the exact source revision; retain
  the isolated Linux container job and its digest-pinned tool supply.
- Run the existing GitLab offline-bundle acquisition, installation, and full
  verification on every declared GitLab operating system after publication.
- Make the repository CI contract reject missing, skipped, weak, or falsely
  labeled platform jobs, and correct the governance page's coverage claim.
- Supply GitLab's own package registry with the exact pinned macOS and Windows
  lychee archives; do not add a GitHub fallback to make a job green.
- Admit each project- and trust-boundary-specific runner and its Node 26
  toolchain before making the new graph required; observe real jobs on both
  Forges before claiming parity or publishing a replacement edition.

This does not add mobile support, assert native Windows x86_64 execution from
an ARM64 guest, or treat local lint and another Forge's success as hosted proof.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: Both selected Forges must independently execute
  the declared three-system source and offline-release verification outcomes.

## Impact

The existing GitLab workflow, CI contract and negative tests, repository
governance page, and project-specific runner admission are affected. The
repository's Node verifier and pinned offline bundle remain the single tool
and artifact owners; no new validation framework is introduced.
