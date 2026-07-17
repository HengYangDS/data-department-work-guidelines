## Context

The candidate baseline is clean, while a legacy unleased work lane contains a
partially staged manual archive. The manual archive cannot be treated as
official lifecycle evidence. This leased successor therefore reconstructs the
admitted materials from the recorded lineage, archives through OpenSpec, and
proves the resulting exact HEAD.

## Goals / Non-Goals

**Goals:** preserve historical requirements and evidence, bind material writes
to an active Change, use official archive/spec fusion, and produce only local
proof and local branch-transition evidence.

**Non-Goals:** rewrite `guidelines.md`, fabricate practice or organizational
outcomes, alter foreign lanes, or assert GitLab/GitHub publication.

## Decisions

- Use a fresh leased successor rather than take ownership of the unleased lane.
- Restore the recorded closeout lineage as source material, then use official
  OpenSpec archive for the remaining reconciliation carrier.
- Treat a changed archive as a new semantic HEAD that requires a new proof.

## Risks / Trade-offs

[Historical carrier drift] -> compare restored content to recorded commit
`aa02e4a16e9f2317239078e3b649afc8bf891b5b` before archive.

[Host rendering limitation] -> retain static Markdown/Mermaid validation and
record any Chromium launch failure as an execution boundary, not a content pass.
