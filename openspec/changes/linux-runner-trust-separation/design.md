# Design

## Context

At the start of this Change, GitLab project 458 reported Runner #52 as
project-locked and tagged-only but `not_protected`. Its recent jobs included
proposal/MR, `dev`, `main`, and `v5.2.0` refs. The macOS and Windows jobs already
select separate review and protected Runners; Linux still has one selector in
`.gitlab-ci.yml`. The existing static check accepts that mixed graph, so its
green result cannot establish the stated trust boundary.

## Decision

Keep one verifier and one Linux image pin. Route proposal pushes and merge
requests to a Linux review job, and route protected source and post-publication
offline jobs to a distinct protected Linux job and capability. The protected
Runner must have GitLab `ref_protected` access; the review Runner remains
`not_protected`. Fleet must prove distinct Runner identities, guest accounts,
daemon sockets, workspaces, caches, and credential reachability. A different
tag without a different execution boundary is insufficient.

The proposed deployment keeps Runner #52 for review and gives the protected
capability a separate ordinary guest account and rootless Docker daemon on the
existing Debian VM. The source labels are `ci-linux-arm64-container` for review
and `ci-linux-arm64-container-protected` for protected work. A shared guest
kernel remains a residual risk; this design does not claim VM-level isolation.
Fleet must verify that neither job mounts a Docker socket or a sensitive host
path. If separate daemon and account boundaries cannot be established, use a
separate protected VM rather than silently returning to one shared Runner.

The repository validator will check the complete job graph and disjoint tags,
not Runner existence. Fleet verification will separately check registered
Runner metadata, real job assignment, protected-ref access, and a safe negative
canary from an unprotected proposal. Both checks are required. The accepted
source selectors stay unchanged until Fleet supplies the exact new capability
and confirms it is ready; this Work Lane may prepare the replacement sooner.
The published source and Runner switch is one bounded operation, not a
prolonged dual implementation.

## Alternatives Rejected

- Change Runner #52's tag alone: a label does not separate its execution or
  credential state.
- Treat Docker job containers as a complete trust boundary while one Runner
  still handles both sides: the daemon, job token path, caches, and host remain
  shared.
- Remove Linux review jobs: this would avoid the conflict by dropping a
  declared platform check for proposals.
- Rebuild the entire pipeline or verifier: the defect is Runner selection, not
  the verified documentation command. Preserve working source and offline
  paths while repairing their admission boundary.

## Acceptance and Rollback

First verify Fleet's new Runner metadata, account, daemon, image admission, and
service readiness. Complete local positive and negative CI-contract tests,
official OpenSpec strict validation, and ETHOS exact-HEAD proof on the prepared
Work Lane. A proposal job must run on the review Runner, while a harmless
proposal request for the protected tag must remain unscheduled. Once the new
Runner is ready, switch the accepted source in a bounded operation and require
a real protected `dev` job on that Runner before publishing a release or
retiring the old route. If Fleet has an independently valid protected canary,
run it earlier; do not invent a version tag merely to obtain one. If the new
route fails, hold the release and use a signed, governed correction to restore
the previous source selector while Fleet restores its preserved configuration.
An earlier green `v5.2.0` matrix remains execution evidence, not retroactive
evidence of isolation.

The negative scheduling probe is deliberately outside the accepted CI contract.
It uses one separately signed, disposable GitLab-only proposal ref with a
harmless command and no source checkout. It is not a Change carrier or a
release candidate. Observe a pending job with no Runner or start time, cancel
it, delete the exact ref, and verify absence before treating the probe as done.
