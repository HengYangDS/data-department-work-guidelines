# Official OpenSpec Workspace

One active Change under `openspec/changes/<change-id>/` carries a material
repository change's proposal, design, specification deltas, and `tasks.md`.
Task progress lives only there. [Accepted requirements](specs/README.md) enter
`openspec/specs/` through the official Change-bound sync workflow or archive.
Both require ETHOS write admission; an unbound direct edit cannot substitute for
the Change.

When a Change is active, read its proposal for intent, its design for choices,
and its `tasks.md` for actions and progress. Archived Changes keep those
artifacts under `openspec/changes/archive/`.

From the selected worktree, use installed ETHOS to check the official artifacts
and plan the changed source:

```text
ethos status --json
ethos prove --host --execute --gate openspec --json
ethos plan --changed --json
```

Status identifies the bound runtime and its official OpenSpec command. The
OpenSpec gate uses that runtime's supplied Node and CLI; this check needs no
repository npm installation. Keep the complete native result, including findings
and prerequisites. Host validation does not grant write permission or constitute
repository proof. Follow [source verification](../CONTRIBUTING.md#verify-the-source)
for the other document checks and their current prerequisites.

ETHOS owns material-path attribution, write admission, proof, and closeout.
The full installed host graph includes the retained repository checks.
Run `ethos prove --host --execute --full --json` directly. It is not another lifecycle or scope authority and does not grant
repository proof or source acceptance. A method-pack plan, claim, dated
report, or private scope list cannot replace a Change. Official archival closes
completed work; its result needs its own commit, proof, and publication.
Completed historical copies may later leave the current tree through a new
admitted Change after their unique facts, obligations, and consumers are reviewed.
Cited artifacts retain the full ancestor commit and exact historical path;
Git history preserves their original bytes without a second history directory.
Historical sources do not prove the current HEAD or retrospectively certify
their original language, lifecycle, or execution order.
