# Proposal

## Why

The public prose integration test gives a complete repository check only 30
seconds, even though the native verifier permits bounded 120-second commands.
GitLab archive `dev` job 46610 exceeded that inner test limit after spelling
passed; the same source passed every `main` and published offline host job.
This is a test harness deadline, not evidence that the prose rule failed.

## What Changes

- Retain the real public commands, full current-file discovery, unchanged-source
  assertions, and positive and negative cases.
- Use the verifier's existing bounded command budget for those child processes
  and report their actual timeout error rather than comparing a null exit code.
- Leave department rules, native prose policy, packages, offline bundle, and
  the signed v6.1.0 release unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: public-command integration retains finite native execution bounds
  and distinguishes process errors from source-defect rejection.

## Impact

The existing quality test and this official Change change. No runtime, Runner,
credential, package, release identity, or second verification owner is added.
