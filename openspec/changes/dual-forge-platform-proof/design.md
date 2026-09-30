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

Keep `docs:verify` and `offline:verify` as the Linux command owners. Add one
macOS and one Windows child for each through GitLab `extends`. Each child
inherits the same scripts and release trigger, replaces only the runner
capability, and disables inherited Docker defaults. This avoids six copied
command sequences and keeps the full verifier as the sole document-quality
implementation. A single matrix job was rejected because its container and
native-shell setup would have to vary by row, hiding the execution boundary.

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
The runner fleet owner must prove the project binding and transport before
the jobs become required. A tag in YAML is a selector, not evidence that a
runner exists.

### Check the semantic graph, then observe actual jobs

Extend the existing YAML-parsing CI contract to reject a missing native job,
wrong capability, Docker inheritance, script override, `allow_failure`, or
manual-only bypass. Keep the current GitHub hosted and offline matrices as
independent peers. GitLab lint confirms only that the submitted YAML resolves
into the intended jobs; it cannot prove runner scheduling, toolchain, or
execution. Final evidence requires real source jobs on each Forge at the same
signed commit, then each Forge's post-publication offline jobs using the same
digest-verified release bundle. No synthetic human-use trial is added.

## Risks and Trade-offs

- **Native runner unavailable or untrusted:** Hold source integration and
  release; do not drop the operating-system job or borrow GitHub's result.
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
   obtain fleet-side project-specific runner and Node admission, including
   transport and credential proof. Execute each native job on the candidate
   revision before integration.
3. After exact-HEAD ETHOS proof and governed closeout, observe GitLab and
   GitHub source jobs independently. Prepare a SemVer-compatible release,
   publish one signed tag and identical offline bytes, then run each Forge's
   post-publication platform jobs.
4. Keep the Change open until all declared jobs and assets are observed;
   archive, refresh proof for the archive commit, and retire the Work Lane.
