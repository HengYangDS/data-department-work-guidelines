# Design

## Context

DDWG's formal publication path verifies signatures, but its tracked
`.ethos/workspace.toml` does not declare a commit policy. ETHOS therefore
created the preceding official archive commit without signing it. Its
hermetic Git operation also ignored the operator's global identity and used a
host-derived address. The object was corrected while still confined to its
owned Work Lane; the original tree and parent were unchanged. That one
recovery does not make future generated commits safe by default.

## Goals and Non-Goals

- Make SSH signing a tracked requirement for every new repository commit,
  including official archive commits.
- Keep the author, committer, public key, private credential, and trust-anchor
  path clone-local and operator-owned.
- Validate the declaration in existing CI and observe an actual official
  archive commit before claiming this adopter's repair complete.
- Do not alter Git history, introduce a private archive command, or use a raw
  push to evade the product publication boundary.
- Do not claim this repository fixes ETHOS's peer-selection or invocation
  trust-overlay mismatch, or that an unconfigured clone cannot ever produce a
  host-derived identity. Those are separate product obligations.

## Decisions

### Declare only the policy, not the person

Add `[commit_policy]` with `signing_required = true`,
`signing_format = "ssh"`, and the schema-required nonempty subject pattern
`^.+$`. The pattern adds no new naming convention. Do not declare
`author` or `committer` values: this is a team repository, not a
single-person authorship contract. Per-clone `user.name`, `user.email`,
`user.signingkey`, and `gpg.ssh.allowedSignersFile` belong in Git's local
operator configuration. The signing key path names a public key; the private
key stays in its authoritative credential store. The trust anchor must be
external to the repository and protected from untrusted writes.

### Test the boundary at two levels

Extend the existing ETHOS profile contract test to assert that the workspace
policy requires SSH signing without a tracked person or path. First run it
against the current undeclared policy to show the expected failure, then make
the declaration and rerun. This static check prevents accidental removal but
does not prove generated commit behavior. The official archival transition of
this Change is the end-to-end acceptance: inspect its signature, author,
committer, parent, tree, exact-HEAD proof, and remote refs before any completion
claim. If it fails, keep the Change's effect blocked and repair the owning
boundary; do not silently normalize an untrusted commit into accepted truth.

## Risks and Trade-offs

- Contributors without a configured signer will be blocked at commit or
  archive time. Document the prerequisite and retain a noninteractive failure
  path; never load or log private keys through repository tooling.
- The current ETHOS implementation can still derive a host identity when
  clone-local identity is absent. The product owner has the broader fix; this
  adopter configures its own clone and does not claim that every clone is safe.
- Source acceptance and archive completion change HEAD. Run fresh proof and
  verify each peer's exact refs and CI after the final object is published.

## Migration Plan

1. Inventory the current policy, clone-local Git configuration, and last
   archive outcome. Configure this clone from its existing effective identity
   and public signer without changing tracked files or credentials.
2. Add a failing repository-contract assertion, then declare the signing
   policy and update contributor guidance. Use the existing quality gate.
3. Validate official OpenSpec, documentation, hooks, and ETHOS planning.
   Commit signed source, prove its exact HEAD, land and publish it, and
   independently observe both peers and their CI.
4. Complete the declared tasks, archive through ETHOS, and inspect the
   generated commit before landing. Reprove and publish that final object,
   then retire only the owned Work Lane after its disposable tools are removed.
