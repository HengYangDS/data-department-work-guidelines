# Tasks

## 1. Correct the repository route

- [x] 1.1 Add a regression that accepts one canonical tag on both GitLab jobs
      and rejects the former, missing, or duplicate tag. Confirm the former
      source fails the new assertion before editing the validator.
- [x] 1.2 Change the two CI selectors and align the existing CI validator,
      test expectation, governance page, and official specification. Leave the
      image, commands, GitHub workflows, version, Changelog, and release assets
      unchanged.
- [x] 1.3 Run the complete repository verifier, strict official OpenSpec
      validation, and `git diff --check`; inspect the changed paths and prove
      no unsupported release-identity change was introduced.

## 2. Prove and observe the exact source

- [x] 2.1 Commit with a trusted signature, run changed-path ETHOS planning
      and full proof for that exact HEAD, and confirm both default gates bind
      the same committed source.
- [x] 2.2 Publish the source HEAD only to eligible proposal refs through
      ETHOS. Observe GitHub's three-OS checks, the GitLab documentation job,
      and both proposal refs at that SHA; do not call this accepted-branch
      evidence.
- [x] 2.3 Confirm Runner #52 still exposes the canonical tag and that the new
      GitLab job selected it. Tell the platform owner the old tag remains in
      use by 12 signed releases; do not edit Runner metadata here.
