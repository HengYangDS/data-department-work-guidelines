# Proposal

## Why

Formal DDWG publication requires a trusted signed source commit, but the
repository has no tracked commit policy. The official archive transition
therefore created an unsigned commit under a host-derived identity; that
particular object had to be corrected before acceptance. A source policy and
clone-local signing prerequisites must agree before the next archive.

## What Changes

- Declare SSH signing as required for new repository commits without freezing
  any person's name, email, credential, or host path in tracked files.
- Require each working clone to configure its own Git identity, public signing
  key, and protected external trust anchor before an official generated commit
  or formal publication.
- Validate the declaration in the existing repository contract test and verify
  the next official archive produces a signed commit under the configured
  identity, without a manual amend.
- Keep ETHOS as the owner of archive, proof, and publication. The repository
  does not introduce another lifecycle or authorize a raw push.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: generated repository commits and formal
  publication must use the declared signed-commit contract and an
  operator-owned clone-local identity.

## Impact

The Change affects the ETHOS workspace declaration, contributor and governance
instructions, the existing profile contract test, and this Change's official
archive. It does not change historical commits, make one operator's identity
portable, fix ETHOS peer selection or invocation-local trust-overlay parity,
or claim that an unconfigured clone is safe. Those product gaps remain with
ETHOS and require their own acceptance.
