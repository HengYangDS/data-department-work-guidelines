# Design

## Context

See [the proposal](proposal.md) for the defect. Locked npm dependencies already
include the official OpenSpec CLI, and `npm run verify` invokes that package
without a shell wrapper. The contributor-facing direct command is the only
platform-specific path in the current entry.

## Goals / Non-Goals

Provide one offline direct invocation that lets npm select the installed
launcher on each supported host. Do not add a script alias, vendor wrapper,
private lifecycle, dependency, or new requirement.

## Decisions

Use `npm exec --offline --no --package=@fission-ai/openspec -- openspec validate
--all --strict --json` after `npm ci --ignore-scripts`. The package selector
binds the declared dependency; `--no` rejects a missing local installation;
`--offline` prevents a registry fetch. This was tested in both states: without
`node_modules`, npm refused the command despite a global `openspec`; after
locked offline installation, it ran version 1.13.2 and validated all current
specs and this Change. Calling the POSIX shim directly fails the platform
boundary. Naming `openspec.cmd` would repair only Windows. A package script
would duplicate the existing verification entry for one direct command.

## Risks / Trade-offs

- **A global executable or local cache masks a missing dependency** → Require
  the explicit package selector and `--no`; exercise the missing-installation
  counterexample as well as the locked-installation success path.
- **Documentation is mistaken for host qualification** → Keep the existing
  full offline platform matrix as the release evidence; do not claim that a
  prose edit alone reran it.

## Migration Plan

Change the current entry and Unreleased note in this leased lane. Validate the
official CLI and repository checks, commit and prove the exact HEAD, then
archive officially. Verify the resulting source and both Forge refs separately.
The signed `v5.0.5` tag and its assets remain immutable; this correction is not
retroactively included in that release.
