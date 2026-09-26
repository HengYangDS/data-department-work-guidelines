# Proposal

## Why

The v4.1.0 GitLab tag job checked out the correct commit and passed locked npm
installation and dependency audit, then timed out downloading lychee from
GitHub Releases. A GitLab documentation job that depends on GitHub availability
cannot qualify this repository's independent GitLab CI plane. The signed
v4.1.0 tag remains immutable; repair requires a new source revision and release.

## What Changes

- Supply GitLab's pinned Linux ARM64 lychee archive from this project's GitLab
  generic package registry. The package file is verified against the existing
  SHA-256 manifest before installation; the initial registry copy has already
  been independently checked against that digest.
- Derive the package endpoint from GitLab's CI environment and use its bounded
  job token only for the same-project download. Do not embed a host, project ID,
  token, or workstation path in tracked source, and do not fall back to GitHub
  when the GitLab package is missing.
- Keep GitHub's pinned upstream asset path and the local offline `--asset` path.
  Add positive and negative tests for source selection, missing inputs, digest,
  and provider-specific CI wiring.
- Prepare v4.1.1 as a patch release. Treat v4.1.0's failed GitLab tag job as a
  historical fact, not a reason to rewrite its signed tag or fabricate a Forge
  Release.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: GitLab and GitHub CI must obtain the same pinned
  documentation tool without one Forge's job depending on the other Forge's
  asset endpoint.

## Impact

The Change affects the existing lychee manifest and installer, GitLab CI,
repository CI validation and tests, repository governance guidance, `VERSION`,
the charter edition, and `CHANGELOG.md`. It creates no new script, credential
store, root evidence directory, private lifecycle, or fixed host binding. The
same-project package is an operational input, not a tracked binary. Source
checks, hosted jobs, and release objects retain separate evidence boundaries.
