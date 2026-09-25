# Official OpenSpec Workspace

One active Change under `openspec/changes/<change-id>/` carries each material
repository change. It contains the proposal, design, specification deltas, and
`tasks.md`; task progress lives only there. Accepted requirements enter
`openspec/specs/` through **official archival**, not by hand-editing a spec to
imitate that transition.

Install the locked tools with `npm ci --ignore-scripts`, then validate:

```bash
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh status --json
bash scripts/ethos-repo.sh plan --changed --json
```

ETHOS owns material-path attribution, write admission, proof, and closeout. The
repository boundary script checks only DRs and document topology. A method-pack
plan, claim, dated report, or private scope list cannot replace a Change.
Archived material preserves historical context; it is neither proof for the
current HEAD nor today's execution order. Editorial translations of a tracked
archive are later changes visible in Git, not evidence that the original
artifact was filed in English or passed a later lifecycle.
