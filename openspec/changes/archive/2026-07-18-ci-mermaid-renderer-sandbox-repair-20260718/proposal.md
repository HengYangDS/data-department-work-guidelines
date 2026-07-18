# Proposal

## Why

The published GitHub documentation jobs now reach Mermaid rendering but fail
because Chrome's sandbox is unavailable in the hosted runner. The repository
needs a narrow, testable CI-only launch configuration rather than a blanket
weakening of local rendering.

## What Changes

- Add a repository-owned Puppeteer launch configuration that passes
  `--no-sandbox` only when a hosted CI projection explicitly selects it.
- Keep local documentation validation sandboxed by default.
- Make GitHub and GitLab select the same checked-in hosted-renderer
  configuration before calling the existing repository-owned verifier.
- Extend the CI projection test to reject a missing config, an inline
  no-sandbox override, or a provider split.
- Record the active Change, claim, and Chronicle boundary without claiming a
  successful remote run.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=hosted Mermaid rendering contract;
  reuse=extend; change=modify; facet:lifecycle=validation; facet:surface=ci,
  scripts,tests; facet:authority=openspec,workflow,test. Hosted rendering must
  use one checked-in CI-only Puppeteer launch configuration while local
  rendering retains its default sandbox behavior.

## Out of Scope

- Disabling Chrome sandboxing for local developer validation.
- Replacing Mermaid, Puppeteer, Chrome, or the repository-owned verifier.
- Treating workflow syntax or local rendering as hosted-CI success.

## Impact

This changes the documentation validator, both CI projections, one small
portable JSON configuration, the provider contract test, the
repository-governance specification, and bounded lifecycle evidence.
