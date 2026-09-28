# Proposal

## Why

The project-locked GitLab Runner now exposes the canonical
`ci-linux-arm64-container` capability tag alongside its former
`ci-linux-arm64-docker` tag. Both repository jobs still select the former name;
the repository verifier and current specification require it. Removing the old
tag before the source moves would strand both jobs; changing only the YAML
would make the verifier reject the new route.

## What Changes

- Move both GitLab jobs to the canonical capability tag without changing their
  image, commands, permissions, or post-release offline trigger.
- Align the existing CI validator, negative tests, current governance text,
  and repository-governance requirement with the new route.
- Keep the old Runner tag active until the exact new commit has passed its
  GitLab job. Runner metadata and later old-tag retirement belong to the
  separate platform owner.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: Select the canonical project-locked Linux ARM64
  container capability without treating YAML as proof that a Runner exists.

## Impact

This is a CI routing correction. It changes `.gitlab-ci.yml`, its existing
validator and tests, the current repository governance page, and one official
specification requirement. It does not change guideline duties, public
commands, tool supply, `VERSION`, the Changelog, or the signed `v5.0.5` release.
The new source requires fresh local proof and hosted GitLab evidence; neither
the old tag nor a passing static check transfers that evidence.
