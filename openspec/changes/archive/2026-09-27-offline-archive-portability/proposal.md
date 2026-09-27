# Proposal

## Why

The `v5.0.1` offline bundle carries macOS provenance extended attributes on all
1,293 archive members. Its Linux installation succeeds but emits repeated tar
warnings, so the archive is not a clean platform-neutral release artifact.

## What Changes

- Build and verify the offline archive without host extended attributes or
  warning-bearing metadata while preserving declared file bytes.
- Make archive inspection and extraction reject warnings instead of silently
  treating them as successful verification.
- Add a regression using an extended-attribute-bearing input and qualify the
  patch release through both independent Forges and every declared offline host.
- Leave the signed `v5.0.1` tag and its historical assets unchanged. This
  corrects packaging, not the department's working rules.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: an offline release bundle must be free of
  host-specific extended attributes and install without archive warnings on
  each supported platform.

## Impact

The offline-bundle builder, archive verifier, tests, release digest, and patch
edition change. The quality graph, GitLab package, GitHub Release, and offline
platform matrix must validate the new signed bytes; neither Forge is an
installation dependency after acquisition.
