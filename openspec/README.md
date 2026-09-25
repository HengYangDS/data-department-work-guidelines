# Official OpenSpec Workspace

One active Change under `openspec/changes/<change-id>/` carries a material
repository change's proposal, design, specification deltas, and `tasks.md`.
Task progress lives only there. Accepted requirements enter `openspec/specs/`
through official archival; do not hand-edit a current spec to imitate it.

Install locked tools with `npm ci --ignore-scripts`, then run the official
validator and ETHOS from the selected worktree:

```text
node_modules/.bin/openspec validate --all --strict --json
ethos status --json
ethos plan --changed --json
```

ETHOS owns material-path attribution, write admission, proof, and closeout.
`npm run verify` guards repository-specific document and decision topology; it
is not another lifecycle or scope authority. A method-pack plan, claim, dated
report, or private scope list cannot replace a Change. Official archives and
Git history preserve what happened, not proof for the current HEAD or today's
execution order. Editing an archived text later does not certify its original
language or lifecycle.
