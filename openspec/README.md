# OpenSpec Workspace

This workspace is the repository's sole change carrier for material work. A
Change under `openspec/changes/<change-id>/` carries proposal, design, tasks,
delta specifications, active-claim binding, and closeout intent. It is not a
second source of rules, decisions, evidence, or execution notes.

For material changes to rules, governance, proof, decision topology, claims,
or authority boundaries, use this lifecycle:

```text
proposal -> design + delta specs -> tasks + active claim -> implementation + proof -> archive
```

Run both `openspec validate --all --strict --json` and
`./scripts/ethos-repo.sh openspec --lifecycle --json`. The latter is the
repository-bound ETHOS projection of the official lifecycle; it is not replaced
by a repository script. Accepted requirements live under
`openspec/specs/<capability>/spec.md` only after archive.

`bash ./scripts/validate-governance-boundary.sh` is a supplemental structural
check for DR shape and retired execution-method documents. It neither validates
OpenSpec carriers nor admits material paths, claims, or archive transitions.
