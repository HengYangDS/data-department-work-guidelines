# Design

## Context

See `proposal.md` for motivation. DDWG must resume the accepted ETHOS command
plane after a small, signed local compatibility bootstrap and replace only the
GitHub self-hosted projection. GitLab retains its independently owned runner.

## Goals / Non-Goals

**Goals:**

- Keep official OpenSpec and ETHOS plan, proof, admission, archive, and closeout
  as the only lifecycle authority.
- Use the accepted typed profile and branch-role contracts without a permanent
  compatibility alias.
- Move GitHub documentation verification to a portable hosted environment while
  preserving one shared repository verifier.
- Keep root binding enforced and independently tested without making it a
  default-proof descriptor.

**Non-Goals:**

- Changing GitLab runner ownership, host services, Parallels, or foreign lanes.
- Rewriting historical claims, archived Changes, DRs, or publication evidence.
- Treating workflow syntax, local validation, or local closeout as hosted-CI
  success.

## Decisions

### One signed compatibility bootstrap precedes the formal lane

The old field and profile shape prevented the current ETHOS runtime from
starting any lane. The recovery is limited to exact signed local metadata
commits and documented external receipts. The formal `proof-throughput` Change
begins immediately afterward and records the boundary without claiming that the
bootstrap itself was retrospectively lifecycle-admitted.

Alternative rejected: retaining legacy aliases or inventing a repository-local
migration command would create a second compatibility and lifecycle mechanism.

### The active Change uses the requested `proof-throughput` identity

`ETHOS_CHANGE=proof-throughput` selects the active carrier in the current
runtime. The official OpenSpec Change therefore uses that exact identity, while
the Work Lane retains the descriptive GitHub-hosted CI name.

Alternative rejected: using a second Change name would make runtime selection
ambiguous and block current admission.

### Root binding becomes a normal validation, not a profile gate descriptor

The accepted typed profile requires profile gate descriptors to equal the
default floor. The adapter and generated hooks still force repository-root
binding; `scripts/test-ethos-repo.sh` remains a separate explicit validation.

Alternative rejected: adding root binding to the default floor changes proof
semantics; retaining an extra descriptor makes the profile invalid.

### Material paths use active-Change attribution, not a private scope carrier

The current ETHOS contract reads repository material families from
`[openspec].material_paths` and attributes fresh changed paths to one selected
active official Change. It explicitly rejects `scope.toml`, Commitment fields,
archives, and unrelated Changes as alternate authorization carriers. DDWG
therefore removes the superseded companion and validates positive and missing-
Change cases through the repository-bound command plane.

Alternative rejected: retaining the July companion schema would create a stale
second admission model and make the repository disagree with the installed
authoritative runtime.

### GitHub uses managed runtime setup; GitLab remains isolated

GitHub uses `ubuntu-latest`, immutable stable-release Action commits, Node 22,
and Chrome Action output. Both providers retain the shared verifier. GitLab
keeps its tagged Docker runner and its existing package provisioning.

Alternative rejected: modifying the host runner or copying GitLab's Docker
setup into GitHub would violate the independent-plane boundary.

### Local rendering reuses the installed browser

Ruling: use Puppeteer's native `chrome` channel only when no executable was
selected. Explicit `PUPPETEER_EXECUTABLE_PATH` remains authoritative. Hosted
rendering retains its separate, exact CI compatibility configuration; local
rendering does not disable the sandbox. This avoids a redundant browser cache
download without embedding host paths or changing package ownership.

Ruling: keep the canonical material-attribution requirement identity in the
OpenSpec MODIFIED delta. A new heading is not an implicit rename. Pin the local
OpenSpec tool to 1.13.1 so local validation and native archive use the same
grammar; generate the lockfile through npm and preserve unrelated tool versions.

Ruling: npm 12 rejects the old mirror tarball URLs under its default remote-fetch
policy. Normalize them to the official registry, retaining every locked version
and integrity hash. Resolve newly introduced entries through npm metadata, then
let npm regenerate and install the resulting lock. Do not weaken `allow-remote`
or change host npm configuration. Omitting resolved URLs was rejected: it
prevented reuse of verified cached content and triggered slow redundant
downloads. npm 11 exhibited the same transport delay, so no global downgrade is
justified.

### Current commands replace retired routing

The three existing skill packages route to native status, planning, and proof
readiness instead of removed `report` and `playbooks` commands. Package content
digests remain verified. The unused historical registry digest is removed, not
replaced by a new local registry mechanism. The repository adapter test checks
each declared capability against the installed public CLI and preserves root
binding. It does not claim that every running agent has loaded these skills.

An archived Change's claim is historical; its dated body, evidence digest, and
past commands remain unchanged. The current material-attribution test rejects
an archived carrier that still claims active intent.

## Risks / Trade-offs

- [GitHub action output mismatch] → The CI contract test checks the setup action
  and Puppeteer binding, then a fresh GitHub run verifies the published SHA.
- [Validation differs from archive admission] → Local tooling and official
  lifecycle use OpenSpec 1.13.1. Document tools are installed through
  `npm ci --ignore-scripts`; installed dependencies are not committed.
- [Foreign lanes observe the refreshed common hook runtime] → The official hook
  install checked linked worktrees without changing their tracked content; no
  foreign lane is merged, reset, or retired.

## Migration Plan

1. Record the compatibility bootstrap and start a leased formal Work Lane.
2. Build this Change, its active claim, and dated Chronicles; remove the
   superseded private scope carrier and nonstandard capability metadata.
3. Apply workflow, adapter-document, profile-test, and boundary-validator changes.
4. Run local validation, official OpenSpec validation, ETHOS admission and proof.
5. Land and close out locally, then publish only eligible refs and verify each
   Forge independently.

Rollback before closeout is a lane-local revert or Work Lane retirement through
ETHOS. No remote or runner rollback is required until a Forge publication has
actually occurred.
