# Design

## Context

See the [proposal](proposal.md). GitLab project 458 currently has one online,
project-locked Linux ARM64 Docker Runner, #52. Its two admitted tags are the
former `ci-linux-arm64-docker` and canonical
`ci-linux-arm64-container`. The repository's two GitLab jobs, CI validator,
test, governance page, and current specification still select the former tag.
The signed `v5.0.5` tag and its release assets identify an earlier, already
qualified source object; they are not migration targets.

## Goals / Non-Goals

**Goal:** Both GitLab jobs select the canonical project capability and pass on
one exact new commit without changing their verification behavior.

**Non-goals:** Rename the VM or Runner, alter project registration, change the
Docker image or supply, add another CI configuration owner, rewrite the
`v5.0.5` release, or claim that static YAML validation proves hosted execution.

## Decisions

### Change the route, not the job

Replace the two tag values and the existing validator's expected value. Keep
the pinned image, Node line, commands, post-publication offline rules, and
GitHub workflows byte-for-byte unchanged. The validator still requires one
exact tag on the offline job; the documentation job must select the same
capability. A regression shall reject the former tag, a missing tag, and a
second tag rather than accepting an accidental fallback.

The Runner tag is an execution capability, not a VM name or a cross-project
identity. Its actual registration remains outside this repository. The
repository-governance specification names the admitted capability; YAML and
the validator are its execution projection and local guard. No standalone
runner-config file is justified for one value.

### Cut over without a scheduling gap

The platform owner keeps both tags during source migration. After a signed
source commit passes local checks and exact-HEAD ETHOS proof, publish it through
the native eligible-ref path and observe the GitLab job on that same SHA and
Runner #52. Only then may the platform owner retire the former tag. A passed
job at `v5.0.5`, a dry-run, or a different SHA cannot qualify the new selector.
If the new job cannot schedule, leave the former tag in place and correct the
source or Runner binding through its owner; do not delete or weaken a gate to
make the pipeline green.

### Keep the release identity honest

This changes only CI routing and its checks. It does not change normative work
guidance, public commands, or the release payload. Keep `VERSION`, the
Changelog, and signed `v5.0.5` tag unchanged; the later branch commit is not a
new release. If repository checks or release policy contradict that
classification, settle the contradiction before publishing rather than
inventing a patch version for a Runner rename.

## Risks / Trade-offs

- **Jobs become stranded during transition** → Keep the old tag until the exact
  new GitLab job passes; never change both Runner and source at once.
- **Local YAML is mistaken for registration** → Inspect Runner #52 through the
  GitLab API and bind hosted success to the new SHA and tag.
- **A fallback tag hides a bad route** → Require exactly one canonical tag in
  the CI validator and exercise old, missing, and duplicate tags negatively.
- **A CI-only commit is mislabeled a new release** → Preserve the signed tag
  and package bytes; distinguish accepted branch source from versioned release.

## Migration Plan

Finish the official specification and tasks, then write failing selector tests
before the minimal source edit. Run the full repository verifier, strict
OpenSpec validation, `git diff --check`, changed-path planning, a signed commit,
and exact-HEAD ETHOS proof. Use native land and publish; observe both Forge
refs and hosted jobs on the new SHA. Archive the completed Change officially,
refresh proof for its archive commit, and publish that exact accepted object.
Tell the platform owner only after the new GitLab route is proven; retire this
owned Work Lane and any temporary proposal ref without touching the Runner.
