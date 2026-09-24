---
name: ethos-repository-governance
description: Use when governing a repository with ETHOS commands, evidence, and adoption profiles.
---

# ETHOS Repository Governance

## When to Use

Use this skill when governing an ETHOS-adopted repository, changing repository
governance files, planning proof, or validating adoption readiness.

## Workflow

1. Read `AGENTS.md` and the current governance docs for the target repository.
2. Run `./scripts/ethos-repo.sh status --json` to classify checkout role and
   required gaps.
3. Use `./scripts/ethos-repo.sh plan --changed --json` to select the focused
   governance path.
4. Run proof readiness, execute the selected gates at the exact HEAD, then
   inspect `status --json`. Readiness alone is not executed proof.

## Evidence

From the repository root, use `./scripts/ethos-repo.sh ...` for
machine-readable evidence. Do not call bare `ethos`: the adapter binds the
audited repository root.

```bash
./scripts/ethos-repo.sh status --json
./scripts/ethos-repo.sh plan --changed --json
./scripts/ethos-repo.sh prove --json
./scripts/ethos-repo.sh land --json
./scripts/ethos-repo.sh publish --json
```

## Trust Boundary

This skill is a workflow package projection. Repository truth remains in source,
tests, schemas, OpenSpec records, claims, evidence, and ETHOS command JSON.
