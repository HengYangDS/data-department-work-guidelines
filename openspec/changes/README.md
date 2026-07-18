# OpenSpec Changes

Active Changes are the only carrier for a material repository change. They
record intended change and review state; they do not supersede source, tests,
schemas, rules, DRs, claims, or evidence until archive promotes the accepted
specification.

Every material Change must have `proposal.md`, `design.md`, `tasks.md`, at
least one delta specification, and a bound active claim. Validate with:

```bash
openspec validate --all --strict --json
./scripts/ethos-repo.sh openspec --lifecycle --json
bash ./scripts/validate-governance-boundary.sh
```

After implementation and proof, archive the Change. Do not leave a completed
Change active, and do not replace this lifecycle with a method-pack plan,
checklist, or decision record. The boundary script is supplementary only; the
official OpenSpec and ETHOS lifecycle remains the mechanism for Change shape,
claim binding, admission, and archive readiness.
