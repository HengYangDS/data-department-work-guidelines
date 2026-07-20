# Proposal

## Why

The repository currently contains conflicting governance carriers: dated work
reports presented as DRs, a live Superpowers document tree, and multiple archive
and reconciliation chains for what is one material repair. That topology hides
which Change owns the work and creates a false impression that historic work was
already lifecycle-compliant.

## What Changes

- **BREAKING** Remove date-named DR files, the live `docs/superpowers/` tree,
  and obsolete reconciliation claims, Chronicle entries, and archive carriers.
- Carry the correction through this one active official OpenSpec Change, with an
  active claim, a dated Chronicle observation, and the accepted ETHOS
  material-path scope companion.
- Establish stable `DR-0001` through `DR-0004` records with only the five
  decision sections; move tasks, commands, and verification outcomes out of DRs.
- Keep the repository-local boundary validator as a topology guard only; ETHOS
  owns lifecycle, scope admission, plan, proof, archive, and closeout.
- Make local verification independent of remotes; define GitLab as the primary
  organization release plane and GitHub as an independent full repository and
  CI/CD plane. Both reject `work/*` and `candidate/dev` publication.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `repository-governance`: subject=DDWG governance carrier correction;
  reuse=extend; change=modify; facet:lifecycle=authoring,validation,archive;
  facet:surface=docs,openspec,evidence,ci; facet:authority=docs,openspec,claim,evidence.
- `quality`: subject=DDWG topology and portable proof checks; reuse=extend;
  change=modify; facet:lifecycle=validation; facet:surface=docs,tests,ci;
  facet:authority=docs,test,openspec.

## Out of Scope

- Certifying that the July 12, 2026 work passed OpenSpec at the time.
- Treating a method pack, DR, claim, or Chronicle as a substitute
  lifecycle carrier.
- Claiming remote ref, hosted CI, or publication success without fresh
  external evidence.

## Impact

This alters repository governance metadata, document routes, decision records,
claims, Chronicle entries, validation scripts, portable hooks, and equivalent
GitLab/GitHub CI definitions. It does not change `guidelines.md`, claim remote
success, or certify the July 12, 2026 work retroactively.
