---
name: ethos-skill-portfolio-governance
description: Use when governing repo-local ETHOS skills.
---

# ETHOS Skill Portfolio Governance

## When to Use

Use this skill when changing repo-local skills, activation routing, package
manifests, or provider projections. It is a meta-skill over skill procedures,
not a replacement for repository truth.

## Workflow

1. Read `AGENTS.md` and `.agents/skills/README.md`.
2. Add or update a skill only when a repeated repository-specific procedure would
   otherwise be missed.
3. Keep `SKILL.md` narrow: trigger, workflow, evidence, and trust boundary.
4. Update activation and package manifest metadata together.
5. Run strict playbook checks before claiming readiness.

## Evidence

From the repository root, use the repository-bound adapter:

```bash
./scripts/ethos-repo.sh playbooks check --mode v2-strict --json
./scripts/ethos-repo.sh playbooks route --changed --json
./scripts/ethos-repo.sh report --json
```

## Trust Boundary

Repository truth remains the source of truth. Skills are workflow projections
over tracked source, tests, schemas, docs, OpenSpec records, claims, evidence,
and ETHOS command JSON.
