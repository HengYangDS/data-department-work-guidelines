# Proposal: DDWG dual-Forge runner convergence

## Why

The repository has no GitHub Actions runner and its workflow uses the hosted
`ubuntu-latest` image. GitLab runner 48 is dedicated to this project, but it is
unlocked, accepts untagged jobs, and the pipeline does not select it explicitly.
Those facts violate the per-project, per-Forge runner isolation objective and
make current CI routing ambiguous. The existing profile also uses a retired
declaration shape and models a root-level file as a directory, which blocks the
repository-bound ETHOS lifecycle needed to prove the correction.

## What Changes

- Replace the profile with the current typed declaration and declare the
  root-level normative guideline as a file source.
- Route GitHub documentation verification only to this repository's dedicated
  macOS runner through a repository variable, while refusing fork-origin pull
  requests on that privileged host.
- Require GitLab documentation verification to select this project's dedicated
  tagged runner; tighten the runner's remote settings to locked and
  no-untagged-job operation.
- Record the runner adapter boundary, local proof, and separate Forge evidence
  requirements without treating configuration or local proof as hosted success.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: subject=per-project dual-Forge CI runner isolation;
  reuse=extend; change=modify; facet:lifecycle=validation,release;
  facet:surface=ci,docs,openspec,evidence; facet:authority=source,test,openspec,evidence.

## Impact

Affected surfaces are the ETHOS binding profile, GitHub workflow, GitLab
pipeline, CI routing contract test, governance documentation, and the
repository-governance specification. The project receives one independent
GitHub runner and keeps one independent GitLab runner; their credentials,
directories, labels, and services remain separate.

## Out of Scope

- Creating a missing GitLab repository for a GitHub-only project, or reusing a
  runner across projects or Forges.
- Altering AIGW, Codex, DMX, their credentials, historical sessions, or another
  project's runner configuration.
- Claiming GitHub or GitLab success before fresh provider-specific runs at the
  published revision have completed.
