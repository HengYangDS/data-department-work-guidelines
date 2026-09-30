# Proposal

## Why

GitLab Runner #52 has executed both untrusted proposal/MR jobs and protected
`dev`, `main`, and release jobs. A passing job proves the verifier ran, but not
the repository's declared separation of review and release execution. The
Linux capability must be divided before another release is called fully
qualified against that boundary.

## What Changes

- Give Linux review and protected/release jobs distinct GitLab capabilities,
  Runner identities, execution roots, caches, and credential boundaries.
- Make the repository CI contract reject a shared Linux selector, a missing
  review route, or a protected offline job routed to review capacity.
- Verify positive scheduling on both sides and refusal of an untrusted job that
  requests the protected capability. Do not infer isolation from YAML alone.
- Publish a corrected release only after the exact source, Runner behavior,
  both Forge CI planes, and both offline assets have been observed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: Linux container jobs must obey the same review versus
  protected trust separation already required of native macOS and Windows jobs.

## Impact

The GitLab pipeline, CI validator and negative tests, repository governance
guidance, release metadata, and project 458 Runner deployment are affected.
Fleet owns Runner configuration and its operational record; this Change owns
repository source and its acceptance. GitHub's hosted execution model and the
portable documentation verifier remain unchanged.
