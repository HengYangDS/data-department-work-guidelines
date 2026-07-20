# Proposal: DDWG post-archive proof repair

## Why

The dual-Forge runner Change was archived on 2026-07-21. That archive moved its
OpenSpec carrier, but the canonical `repository-governance` specification now
violates the repository's Markdown blank-line contract. The resulting archive
HEAD cannot pass the exact-HEAD documentation proof required before candidate
landing. The archived carrier must remain historical evidence rather than being
rewritten to repair a later proof target.

## What Changes

- Restore canonical Markdown layout so the current archive-result HEAD can pass
  the repository's existing documentation proof.
- Add an explicit governance requirement that post-archive proof defects are
  corrected in a separate active Change, not by revising the archived carrier.
- Bind this repair to its own active claim and dated Chronicle; archive, landing,
  accepted closeout, runner registration, publication, and hosted execution
  remain separate transitions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-governance`: subject=post-archive proof-target repair;
  reuse=extend; change=modify; facet:lifecycle=validation,archive;
  facet:surface=docs,openspec,evidence; facet:authority=source,test,openspec,evidence.

## Impact

Affected surfaces are the canonical repository-governance specification, this
Change's carrier, its claim, and its Chronicle. No workflow, runner service,
credential, remote ref, or hosted job is changed.

## Out of Scope

- Revising the archived dual-Forge runner carrier or claiming that its historical
  evidence has become current-HEAD proof.
- Registering, reconfiguring, sharing, or operating any GitHub or GitLab runner.
- Publishing to GitHub or GitLab, or treating local proof as Forge execution.
- Altering AIGW, Codex, DMX credentials, session history, or any foreign lane.
