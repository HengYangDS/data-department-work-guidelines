# Design

## Context

Signed archive source `eca361c9b0fc325d81bbc79c159574159c5fcf17` passed local
proof, GitHub, GitLab `main`, and all seven v6.1.0 offline host jobs. The sibling
GitLab `dev` Windows job 46610 passed repository source checks, then the nested
public `check` test timed out at its 30-second child limit. Its last output was
successful CSpell validation, with no native prose rejection yet observed.

## Goals / Non-Goals

Keep genuine public-command coverage and current-file discovery. A slower
supported host must get the same finite command budget as the verifier. Do not
hide a file, skip the test, retry an unchanged pipeline, change Runner policy,
or infer a rule failure from observation expiry. No package upgrade or release
recreation is needed; the immutable v6.1.0 bundle remains qualified.

## Decisions

The native runtime command owner permits 120 seconds. Use that same bounded
budget in the public-command integration test rather than an unexplained
30-second performance assumption. Keep the source defect, file location,
nonzero exit, no-rewrite assertion, and positive corrected-source execution.
Check the actual subprocess error before its exit status so timeout diagnostics
name the operation instead of implying the expected defect was rejected.

The test is not a performance benchmark. Retain the outer suite and hosted job
deadlines; no unbounded child process or automatic retry is introduced. Verify
the exact new source locally and on both Forge platform matrices before retiring
the owned Work Lane. Changes to tests alone do not mutate the signed release.

## Validation

Exercise the public negative and corrected positive inputs, full source checks,
official OpenSpec, and installed exact-HEAD ETHOS proof. Complete source-only
implementation tasks before official archive; archive creates a new identity
that needs proof, accepted publication, and actual hosted source checks. These
later effects are not implementation task evidence until observed.
