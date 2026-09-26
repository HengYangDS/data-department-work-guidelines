# Design

## Context

The v4.1.0 tag is signed and present on both Forges. GitHub tag verification
passed on all three hosted operating systems. GitLab tag pipeline 8321 failed
after checkout, npm installation, and dependency audit: the existing installer
timed out after 90 seconds fetching lychee from GitHub Releases. The GitLab
project's generic registry now holds the pinned Linux ARM64 archive; its
registry-reported SHA-256 matches the committed platform record. That package
is an external supply input, not a binary to commit.

## Goals / Non-Goals

**Goals:** Make GitLab CI use its own project registry without weakening the
shared digest and version checks; preserve GitHub and local offline supply;
release the compatible fix as v4.1.1.

**Non-goals:** Changing the signed v4.1.0 tag, adding a global ETHOS
downloader, embedding assets or credentials in Git, replacing npm or Docker
supply, or claiming a cold offline bundle from a warm cache.

## Decisions

### One pinned payload, two provider-local retrieval routes

Keep the existing platform asset names and SHA-256 values in the single lychee
manifest. Add only the GitLab generic package name there; derive its version
from the manifest version. The GitHub route keeps its existing release URL.
The GitLab route derives the API base and project ID from standard CI variables,
not a workstation or repository-specific endpoint. It uses the standard job
token in a `JOB-TOKEN` request header and rejects redirects so that header
cannot be forwarded to another host. Missing inputs or package bytes fail
closed; there is no GitHub fallback. Both routes use the same bounded download,
digest, archive-safety, executable-version, and cache checks. The local
`--asset` option remains network-free.

An alternative would have GitLab retry GitHub or use a host-mounted cache. Both
would preserve the dependency or bind CI to one machine. Building lychee from
source in every Node job would add a second compiler toolchain and cost without
solving the ownership boundary as directly as a pinned same-project package.

### Make the CI declaration and tests reject the old topology

Change only GitLab's installer argument; GitHub retains `--download`. The
repository CI validator checks both commands exactly. Focused tests check
portable request construction, missing/invalid CI inputs, header placement,
redirect rejection, and absence of a cross-Forge fallback. The live GitLab tag
job is the final consumer test; local unit tests cannot prove its job token can
read the package.

### Patch the unreleased qualification failure

v4.1.1 changes CI supply, not normative guidance or reader routes, so it is a
SemVer patch. The v4.1.0 tag remains immutable. Its GitLab failure is neither
retried against the unchanged source nor described as a successful release.
The v4.1.1 signed tag and Forge Releases must point to the newly accepted
archive commit and have their own hosted observations.

## Risks / Trade-offs

- **Package is missing or access changes:** fail without another-provider
  fallback; inspect the exact GitLab job and package metadata before repair.
- **A redirect could leak a job token:** reject redirects for the authenticated
  GitLab request; never put the token in URL, output, or tracked source.
- **The self-hosted GitLab API may use HTTP:** this change inherits the
  platform's existing runner-to-GitLab transport. It does not claim that a
  repository script can provide TLS or that job-token confidentiality is
  independently qualified. Platform TLS remains a separate owner-level issue.
- **The package copy could differ from upstream:** validate the registry file
  SHA-256 against the same committed manifest, then check every download again
  before extraction.

## Migration Plan

Implement and test in this official leased Work Lane. This is a source-only
Change: complete its checklist before a signed source commit, exact-HEAD proof,
and official archive. Prove the archive commit, accept through candidate and
dev, publish `dev` and `main` to both Forges, and require hosted checks at the
new object before creating the v4.1.1 tag. Require tag checks and independent
Forge Release assets before claiming versioned delivery. Retire the Work Lane
only after its source is absorbed, leaving the project registry package as the
versioned GitLab CI dependency.
