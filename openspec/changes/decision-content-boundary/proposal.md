# Proposal

## Why

The current DR validator scans Markdown lines rather than parsed content. A
quoted shell fence, a PowerShell block, and a task checkbox list all pass despite
the existing decision-only contract. A green boundary check must not let a
command log or task report return as a decision record.

## What Changes

- Inspect actual Markdown headings, task lists, code blocks, and inline code
  through the already locked native Markdown parser.
- Reject code blocks, nested execution and task progress without rejecting
  concept prose, inline technical terms, alternatives or evidence links.
- Keep exactly the five decision sections, stable identity, and clear errors.
- Treat opaque raw HTML as unsupported DR content; keep the required leading
  registry comment. Do not let a wrapper hide material the parser cannot check.
- Deliver the compatible validator correction as v6.1.1 with the existing
  toolchain, offline bundle, and independent Forge release routes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: parsed decision content cannot bypass the existing decision-only
  boundary through Markdown nesting or a terminal language label.

## Impact

The existing boundary implementation, its tests, contributor-facing governance,
and release identity change. Department obligations, reader routes, dependency
versions, proof gates, and ETHOS/OpenSpec authority stay unchanged. No new DR,
private scope list, command plane, or runtime dependency is added.
