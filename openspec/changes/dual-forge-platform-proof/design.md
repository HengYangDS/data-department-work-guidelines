# Design

## Context

The source verifier is already one portable Node command. GitHub runs it on
three hosted operating systems; GitLab's Linux-only jobs use a pinned Node
container and GitLab-local lychee supply. The release bundle already contains
the locked npm cache and declared lychee archives for every supported host.
The missing fact is execution on GitLab's macOS and Windows runners, not a
second verifier or another bundle format.

## Goals and Non-Goals

The goal is independent, exact-revision three-system source and offline-release
evidence on each selected Forge. Native GitLab runners must be project-locked,
identify their actual architecture, and enter only after their toolchain,
transport, and credential boundary is admitted. This Change does not provision
the fleet, add mobile hosts, or infer native x86_64 Windows behavior from an
ARM64 guest.

## Decisions

### Extend the existing GitLab jobs, not the verifier

Keep `docs:verify` and `offline:verify` as the Linux command owners. For each
native operating system, add a source-review child, a protected-source child,
and a post-publication child through GitLab `extends`. The source children
inherit the same scripts but use mutually exclusive rules: merge requests and
proposal pushes select review runners; `dev`, `main`, and tags select protected
runners. Post-publication jobs use only protected runners. Every child disables
Docker defaults. This keeps the full verifier as the sole quality owner
without allowing untrusted proposal code and release code to share a persistent
Shell account, workspace, or cache. A single matrix was rejected because its
container, native-shell, and trust setup would vary by row.
The top-level GitLab workflow admits only `dev`, `main`, version tags, merge
requests, and proposal pushes. Once a proposal has an open merge request, it
suppresses the duplicate branch-push pipeline and keeps the review route.
GitHub source admission requires pushes on `dev`, `main`, `proposal/**`, and
`v*` tags, plus pull requests targeting `dev` or `main`; a three-system matrix
without one of those event routes is not source coverage.

### Treat runtime selection as runner admission

The Linux image stays digest-pinned. Native runners must supply Git and the
repository-declared stable Node major through their own installation owner;
the verifier rejects the wrong major at execution. CI does not install a
second Node distribution, embed a host path, or store registration credentials.
The GitLab package registry must contain the committed macOS ARM64 and Windows
x64 lychee archives with their exact manifest hashes before those jobs run;
the source does not fall back to GitHub. On the current Windows ARM64 fleet,
the declared Windows asset requires an x64 Node process under emulation.
Fleet evidence must distinguish that process architecture from the ARM64 host.
The runner fleet owner must prove project binding, distinct review/protected
accounts and working roots, and credential transport before the jobs become
required. A tag in YAML is a selector, not evidence that a runner exists or
that two selectors are operationally isolated.
Each native Runner must be project-locked and tagged-only. Protected Runners
also require GitLab's `ref_protected` access level; review Runners use
`not_protected` access with separate unprivileged accounts. The project protects
`dev`, `main`, and `v*` tags; fleet admission must verify those rules still hold.
An untrusted merge request can request any tag in its own YAML, so a safe
unprotected-ref canary must fail to schedule a protected Runner even when it
asks for that tag; a protected-ref canary must schedule it successfully.
Transport admission covers three separate paths: Runner registration and
polling, repository clone, and package downloads carrying `CI_JOB_TOKEN`.
The package helper uses GitLab's `CI_API_V4_URL`; a tunnel for registration
alone does not protect an HTTP clone or package request. Prove the actual job
endpoints and an encrypted path for credential-bearing traffic, or record an
authorized, bounded host-only-network risk decision. Never present one
protected path as proof that the other two are protected.

### Check the semantic graph, then observe actual jobs

Extend the existing YAML-parsing CI contract to reject a missing native job,
wrong capability, trust-route overlap, Docker inheritance, script override,
`allow_failure`, manual-only bypass, or a missing workflow boundary. Reject
GitHub job and step conditions, tolerated failures, and matrix exclusions that
can hide a declared host. Reject extra GitLab defaults, global setup, or
includes that can silently alter offline supply.
GitHub source and offline hosted matrices remain independent peers. GitLab lint
confirms only that the submitted YAML resolves
into the intended jobs; it cannot prove runner scheduling, toolchain, or
execution. Final evidence requires real source jobs on each Forge at the same
signed commit, then each Forge's post-publication offline jobs using the same
digest-verified release bundle. No synthetic human-use trial is added.

### Prepare a compatible edition from frozen supply

The public guideline duties, reader routes, and contributor commands remain
available. GitLab gains additional platform qualification rather than losing
an existing route, so the next edition is a compatible minor increment to
5.2.0 under the repository's SemVer contract. On 2026-09-30 the latest stable
CSpell release was 10.3.6; refresh the exact npm pin and lock before building the
version-bound offline bundle. Record the builder's actual digest, not a guessed
value. Keep the edition notes under `Unreleased` while runner and hosted proof
remain pending. At the actual release cut, move those notes to a dated version
section, refresh its comparison links, sign and prove that new source commit,
then create the tag. A date chosen for a long-lived prepared branch would
misstate the release history.

## Risks and Trade-offs

- **Native runner unavailable or untrusted:** Hold source integration and
  release; do not drop the operating-system job or borrow GitHub's result.
- **Review code reaches a release account:** Require separate project-locked
  native Runner identities, accounts, roots, and caches for review and
  protected/release jobs; static rules alone do not prove that separation.
- **Windows ARM64 runs x64 tools under emulation:** Report host and process
  architecture separately; do not claim a native x86_64 ABI.
- **Linux and native runners have different supply paths:** Require the same
  locked repository inputs and full verifier output, mirror exact pinned
  assets into the GitLab project, and test each provider-specific acquisition
  path with real jobs.
- **A new required job can strand protected branches:** Admit runner identities
  and execute a bounded dry-run pipeline before enabling or landing the
  stricter graph. Do not weaken branch protection to force acceptance.

## Migration Plan

1. Add negative CI-contract tests, native GitLab job projections, and reader
   guidance in this Work Lane; run local quality and GitLab lint.
2. Verify the missing lychee archives in GitLab's project registry, then
   obtain fleet-side project- and trust-specific runner and Node admission,
   including transport and credential proof. A bounded canary on an existing
   protected ref may prove its Runner route; the new protected source job
   cannot execute until the new YAML reaches `dev`.
3. Prove the exact Change HEAD through installed ETHOS, publish its proposal
   through the governed route, and observe real review jobs. After governed
   source acceptance, observe new protected GitLab jobs and GitHub source jobs
   at the accepted SHA. At release cut, repeat source proof and both Forge source
   matrices on the final Changelog commit before signing its tag. Publish one
   signed tag and identical offline bytes, then run each Forge's
   post-publication jobs.
4. Keep the Change open until all declared jobs and assets are observed;
   archive, refresh proof for the archive commit, and retire the Work Lane.
