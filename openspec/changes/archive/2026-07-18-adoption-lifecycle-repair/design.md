# Design

## Context

DDWG has one normative source, `guidelines.md`, plus OpenSpec, ETHOS adoption,
decisions, evidence, and documentation checks. The defect is carrier topology:
method-pack files and date-named work reports occupied governance roles, while
several later reconciliation archives fragmented a single correction.

## Goals / Non-Goals

**Goals:**

- Rebuild one current material Change using the accepted ETHOS scope contract.
- Keep DRs stable, decision-only, and separately identifiable from document state.
- Remove misleading carriers rather than preserving them as compatibility residue.
- Preserve historical truth without inventing historic OpenSpec compliance.
- Make local, GitLab, GitHub, and hosted-CI facts independently verifiable.

**Non-Goals:**

- Rewriting Git history or asserting that the July 12 work passed OpenSpec.
- Creating a DDWG-private lifecycle, schema, or scope-admission implementation.
- Publishing branches, treating remote configuration as publication, or changing
  a foreign Work Lane.

## Decisions

### One active carrier

`adoption-lifecycle-repair-20260714` is the sole substantive carrier. Old
archive/reconciliation chains are removed because they encode task/proof
succession rather than distinct governance decisions. The Change records this
normalization as a July 18, 2026 repair; its identifier names the repair subject,
not a false original approval date.

### Scope admission ownership

The profile declares material path families and this Change contains the
ETHOS-defined `scope.toml` companion with only `schema_version` and `paths`.
The companion is adjacent to OpenSpec, not an OpenSpec schema extension. ETHOS
uses it in prewrite, changed planning, and proof; the repository does not
reimplement that admission logic.

### Decision and method boundaries

Stable DRs contain exactly Context, Decision, Alternatives Rejected,
Consequences and Boundary, and Evidence and Revisit. They cannot contain task
lists, command logs, or acceptance output. Superpowers remains a method package
outside governance and has no live documentation carrier in this repository.

### Proof and release boundaries

The default profile floor remains only `docs-integrity` and `markdown-format`.
`repository-root-binding` is an explicit verification descriptor, not a default
proof floor; repository-native commands use `bash` for portability. Local proof
precedes remote actions. GitLab and GitHub have equal source/CI definitions but
remain separate external evidence planes.

## Risks / Trade-offs

- **Destructive cleanup can remove useful history** → retain only a minimal
  history note and immutable Git history; do not keep active false carriers.
- **Boundary validation may become a lifecycle duplicate** → constrain it to
  docs topology and test the distinction.
- **Remote CI may differ from local tools** → invoke one repository-owned
  provider-neutral verifier and keep remote success claims separate.

## Migration Plan

1. Create the official Change and admit profile/scope bootstrap using ETHOS.
2. Replace erroneous live carriers with stable DRs and one active claim.
3. Add structural and scope-admission positive/negative tests, then run local
   document, OpenSpec, lifecycle, claims, and proof gates.
4. Archive only after the active Change is complete; run fresh proof on the
   archive result before local candidate landing and accepted closeout.
5. Publish only accepted `dev`, `main`, or `submit/*` after independent GitLab
   and GitHub verification; retire only the clean owned reconstruction lane.
