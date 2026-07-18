# Proposal

## Why

The published GitHub documentation run for `e753998` selects the canonical
hosted Puppeteer configuration for the first documentation validation, but the
rollout-readiness step invokes the validator again without forwarding that
selection. The second render therefore starts Chrome without the CI-only
compatibility argument and fails in the hosted runner sandbox.

## What Changes

- Keep the existing CI-only configuration and provider-neutral verifier.
- Make rollout-readiness accept and forward the same validator arguments it
  receives, so every nested documentation validation uses the same explicit
  hosted selection.
- Add a regression test that demonstrates the forwarding contract without
  asserting hosted CI success.
- Update the repository-governance specification, Chronicle, claim, and
  changelog with separate local and hosted evidence boundaries.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=hosted Mermaid validation propagation;
  reuse=extend; change=modify; facet:lifecycle=validation; facet:surface=ci,
  scripts,tests; facet:authority=openspec,workflow,test. Nested documentation
  validation initiated by the shared hosted verifier must preserve the canonical
  hosted renderer selection.

## Out of Scope

- Adding a global Chrome flag or weakening local default rendering.
- Changing the canonical hosted configuration payload.
- Claiming that GitLab or GitHub has passed before its fresh run reports a
  successful result.

## Impact

This changes the rollout wrapper, the shared verifier regression test, the
repository-governance specification, and bounded lifecycle evidence.
