---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---

# Repository Change and Publication

This page governs **changes to this repository**, not the team's data work.
Start with the [documentation map](../README.md) for the working guidelines.
[Decision records](../decisions/README.md) retain durable trade-offs. Method
packs and historical reports grant no write authority.

## One Change, One Authoritative Carrier

One selected official OpenSpec Change carries a material change's intent,
design, specification deltas, and `tasks.md`. ETHOS attributes material paths to
that active Change and governs the Work Lane, write admission, proof, and
acceptance. A DR explains a choice that remains useful across Changes; its five
sections are not another Change or progress ledger.

Call ETHOS through the repository-bound adapter, not from an unknown working
directory:

```bash
bash scripts/ethos-repo.sh status --json
bash scripts/ethos-repo.sh lane prewrite --paths docs/decide.md \
  --editor-root "$PWD" --require-editor-root --json
bash scripts/ethos-repo.sh plan --changed --json
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh prove --execute --full --scope repository \
  --expect-head "$(git rev-parse HEAD)" --json
```

A `lane prewrite` result judges the exact paths against the current state once;
it is not reusable permission. Only the lease holder may edit its `work/*` lane.
The [repository boundary check](../../scripts/validate-governance-boundary.sh)
rejects malformed DRs, date-named decision files, and a revived
`docs/superpowers/` tree. It does not implement official lifecycle, scope
admission, or archival. Default document proof has only `docs-integrity` and
`markdown-format`; the adapter and hooks bind the root.

## Accept Source, Publish Refs, and Observe Use Separately

| Plane         | Evidence can establish                                                          | Evidence cannot establish by itself     |
| ------------- | ------------------------------------------------------------------------------- | --------------------------------------- |
| Local source  | Change attribution, tests, HEAD-bound proof, candidate landing, and acceptance. | That either remote received the source. |
| GitLab        | The organization's exact ref OID and its own CI result.                         | GitHub delivery or team use.            |
| GitHub        | The independent repository's exact ref OID and its own hosted CI result.        | GitLab delivery or team use.            |
| Team practice | Use in real tasks and its observed effect.                                      | Retrospective source or CI correctness. |

Local validation and installation do not depend on either remote. Only `dev`,
`main`, and `proposal/*` may be published; `candidate/dev` and `work/*` remain
local. GitLab is the organization's primary publication plane. GitHub is an
independent complete repository and CI/CD plane, intended to serve updates and
distribution when GitLab is unavailable. That fallback is a capability claim
only after a product-governed GitHub publication actually succeeds under that
condition. Configured remotes, local proof, and CI on an older SHA do not prove
delivery of a new SHA.

Formal publication also requires ETHOS to verify the source commit's signature
against the operator's own trusted public-key list. Neither private keys, that
list, nor its host path belong in this repository. A raw push must not disguise
a native publication refusal as success. GitLab's documentation job selects
`ci-linux-arm64-docker`; claim hosted success only after a matching runner
actually passes at the SHA in question. The
[release declaration](../../.ethos/release.toml) lists both peers.

A Change may reach `dev` while remote-delivery tasks remain open. Observe the
peers independently, complete the declared tasks, and only then archive through
the official tool. Archival changes HEAD; refresh applicable source proof and
final remote-ref observations rather than reusing pre-archive results. Do not
create a circular dependency by requiring future CI on the archival commit
before the tasks that permit archival can close. Report final remote
observations separately.

## Local Quality and State Boundaries

- The [ETHOS profile](../../.ethos/profile.toml) declares material paths and the
  two default document gates; it does not invent a second Change scope schema.
- The [repository-bound adapter](../../scripts/ethos-repo.sh) fixes the audit
  root, and Git hooks use the same entry. `bash scripts/test-ethos-repo.sh`
  explicitly tests root binding.
- [Document validation](../../scripts/validate-docs.sh) covers Prettier,
  Markdown lint, offline lychee links, metadata, current anchors, every present
  Mermaid diagram, and the English text boundary. Only the CI verifier selects
  the hosted-browser exception; local validation does not inherit it.
- `build/`, `node_modules/`, leases, and caches are not repository facts.
  Evidence belongs with its producer and specific claim; it does not need a root
  directory.
- Markdown and configuration blocks use one blank line. Python top-level
  definitions use two blank lines; methods use one. The
  [text-layout check](../../scripts/validate-text-layout.sh) guards this
  mechanical boundary, not semantic acceptance.

This page does not assert present remote state, team adoption, or ETHOS product
parity. Before reporting any of them, read a fresh observation of the exact
version in its actual environment.
