---
name: ethos-adoption-profile-governance
description: Use when applying ETHOS profiles or adapter boundaries.
---

# ETHOS Adoption Profile Governance

## When to Use

Use this skill when ETHOS governs this repository through an adoption profile,
changes scaffolded governance, or checks product/adopter command isomorphism.

## Workflow

1. Treat the governed subject as a Git repository.
2. Use `./scripts/ethos-repo.sh status --json`, changed planning, and
   profile-appropriate proof to
   expose the current boundary.
3. Keep provider state in adapters and projections.
4. Promote durable truth into tracked source, docs, schemas, OpenSpec, claims,
   or evidence.
5. Follow native `required_gaps` and `next_action`; do not invent a local
   admission bypass when adoption is incomplete.

## Evidence

From the repository root, use the repository-bound adapter:

```bash
./scripts/ethos-repo.sh status --json
./scripts/ethos-repo.sh plan --changed --json
./scripts/ethos-repo.sh prove --json
```

## Trust Boundary

Repository truth remains the source of truth. This skill routes adoption work;
hosted forges, CI, MCP, editor state, and generated assistant surfaces are
adapters or projections.
