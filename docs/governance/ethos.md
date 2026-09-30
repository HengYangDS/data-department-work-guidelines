<!--
---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---
-->

# Repository Change and Release

This page governs **this repository**, not the department's data work. Start at
the [task map](../README.md) for the working rules. A
[decision record](../decisions/README.md) keeps only durable rationale; it
cannot authorize a change.

## One Change, one authority

A selected official OpenSpec Change owns material intent, deltas, design, and
`tasks.md`. ETHOS binds changed paths to that Change and governs the leased Work
Lane, write admission, proof, acceptance, and publication. The compiled
Commitment is transient; this repository adds no private `scope.toml`, tracked
claim ledger, or second lifecycle.

Run the installed `ethos` command in the intended worktree:

```text
ethos status --json
ethos lane prewrite --paths docs/decide.md --editor-root . --require-editor-root --json
ethos plan --changed --json
npm run verify
```

Use the current result, not this sequence as blanket permission. A passing
`lane prewrite` admits only the exact paths and state it observed. Commit the
source, take its OID from `git rev-parse HEAD`, and pass that exact OID to
`ethos prove --execute --full --scope repository --expect-head OID --json`.
The installed Git-common hooks, not tracked copies, enforce commit and push
admission. The [repository check](../../tools/docs/cli.mjs) guards DR shape,
reader routes, and document quality; it cannot replace OpenSpec or ETHOS.

## Source, two Forges, and actual use

| Plane           | It can establish                                              | It cannot establish alone        |
| --------------- | ------------------------------------------------------------- | -------------------------------- |
| Local source    | Change attribution, checks, exact-HEAD proof, and acceptance. | Delivery to either Forge.        |
| GitLab          | Its exact ref, hosted CI, and release object.                 | GitHub delivery or team use.     |
| GitHub          | Its independent ref, hosted CI, and release object.           | GitLab delivery or team use.     |
| Operational use | Naturally observed use in ordinary work, if available.        | Source or publication integrity. |

Local verification does not contact either Forge. Only `dev`, `main`, and
`proposal/*` may publish; `candidate/dev` and `work/*` are local resources.
GitLab is the organization's primary publication plane. GitHub is a complete
independent repository and CI/CD plane, intended as a distribution alternative
when GitLab is unavailable. A configured peer or older green job does not prove
that fallback. Claim it only after ETHOS actually publishes the selected object
to GitHub while GitLab is unavailable, then verify the exact remote ref.
Never use a raw push to disguise a native refusal.

A Change may reach `dev` while a declared delivery task remains open. Observe
each peer independently, complete the tasks, and only then archive officially.
Archive creates a new commit: refresh proof and final remote observations for
that identity. Do not reuse CI from an earlier SHA as archive-HEAD evidence.

## Versioned releases

[`VERSION`](../../VERSION) is the single intended release identity. The
[charter](../charter.md) shows that edition; the private npm manifest does not
repeat it. The public compatibility surface is the normative rules, stable
member and Agent routes, and documented contributor commands. Under
[SemVer 2.0.0](https://semver.org/spec/v2.0.0.html), incompatible changes to
that surface require a major increment, compatible additions or deprecations a
minor increment, and compatible fixes a patch increment. A reviewer must assess
meaning and migration in the official Change; no parser can infer compatibility
from a diff alone.

[`CHANGELOG.md`](../../CHANGELOG.md) follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). The default
`docs-integrity` proof gate and both CI jobs reject malformed headings,
categories, dates, links, version drift, and tag mismatch. The next edition's
notes stay under `Unreleased` until the release cut; its dated section uses the
actual release date. The validator permits one untagged dated heading only for
the release cut, when that source must be committed and proved before its tag
exists. A heading, branch, or CI result is not a versioned release. ETHOS
admits only an exact, signed annotated `vX.Y.Z` tag
matching the committed `VERSION`; each Forge Release and asset must then be
observed separately. Older untagged branch editions stay in Git history, not a
fabricated release sequence. Before signing a release tag, both Forges must
pass their declared source jobs at the exact release-cut commit. A green
proposal or earlier accepted SHA does not qualify a later Changelog commit.

New commits and official archive commits require trusted SSH signatures. Each
clone supplies its own local identity, public signing-key path, and protected
trust anchor outside this repository. Inspect attribution and signature before
acceptance. The [workspace policy](../../.ethos/workspace.toml) and
[release declaration](../../.ethos/release.toml) state the enforceable local
branch and tag boundaries; they contain no operator key or host path.

## Quality and local state

`npm run verify` invokes one [portable quality entry](../../tools/docs/cli.mjs).
It checks formatting for Markdown, code, JSON, and YAML; TOML syntax; Markdown
lint; CSpell spelling; offline, version-checked lychee links and fragments;
metadata; English and spacing; repository boundaries; official OpenSpec; version
identity; CI topology; and negative tests. The two default ETHOS gates retain
their repository-relative document commands. `docs-integrity` omits Node test
execution; the standalone verifier runs those tests once, while ETHOS obtains
their native evidence through its behavior provider. ETHOS also runs its own
static verifier for the tracked JavaScript tooling; each gate passes only when
its document command and product-owned verifier both pass for the committed
tree. Command output and repository-authored report files cannot supply that
native evidence. This is code-quality proof, not another lifecycle.

Git's native `.gitattributes` rule keeps tracked text at LF on every
host. The [supply manifest](../../.config/tools/lychee.json) pins lychee assets
by platform and SHA-256. GitLab CI fetches that asset from this project's
package registry with its own job token; GitHub CI uses the pinned upstream
GitHub release. Both verify the digest before extraction. Local validation
checks the executable version and never downloads an asset. Explicit
CI supply and an offline `--asset` path are different operations. The
source-pinned offline bundle adds a complete npm cache and all declared lychee
archives; its release identity lives in
[`.config/tools/offline-bundle.json`](../../.config/tools/offline-bundle.json).
A bundle file on disk is not offline qualification: the actual install and full
verifier must run with no remote supply on each claimed host, and both Forge
assets must be retrieved and compared by SHA-256. The
archive excludes host extended attributes; archive inspection and extraction
reject warning output even when the archive tool exits successfully. The
[contributor route](../../CONTRIBUTING.md) owns the commands. Bundled npm
packages and lychee retain their upstream licenses; the repository MIT grant
does not relicense them. Both hosted CI planes run
`npm audit --audit-level=moderate` during online tool supply; local source
verification does not require network access. The bundle binds the edition,
Node major, package lock, and pinned lychee supply, not a second npm-major
declaration. The installer exercises and records the available npm version
offline on each claimed host. The application audit does not qualify Node's
bundled npm; do not turn one into a claim about the other.

GitHub declares Linux, macOS, and Windows hosted jobs. GitLab declares
project-locked Linux ARM64 container, macOS ARM64 shell, and Windows ARM64 shell
capabilities for both source and post-publication offline verification. Native
proposal and merge-request jobs use separate review capabilities; protected
`dev`, `main`, and release jobs use separate trusted capabilities. Their Runner
accounts, workspaces, and caches must not cross that boundary. An open proposal
uses its merge-request pipeline instead of a duplicate branch-push pipeline.
Runner admission observes registration and polling, repository clone, and
`CI_JOB_TOKEN` package requests as separate credential-bearing paths. On an
HTTP-only GitLab, a tunnel for registration alone does not protect clone or
package traffic; each unencrypted path needs an authorized, bounded risk
decision for the isolated network. A tag in YAML does not prove that a runner
is registered or isolated. The native jobs require
runner-installed Node 26 and exact macOS and Windows lychee assets in this
project's package registry; they must not fall back to GitHub. On an ARM64
Windows host, an x64 Node and lychee process under emulation is functional
evidence, not a native x86_64 ABI claim. GitLab's offline jobs start at the
exact tag only after its release package exists; earlier tag-push document
jobs cannot qualify that asset. Before admitting the Linux runner, its owner
must verify that the exact OCI image digest in `.gitlab-ci.yml` is allowed and
cached locally. Neither a tag-only image nor an older green job satisfies any
of these checks. Workflow declarations alone are not hosted success.

Markdown and configuration use one blank line between blocks. Prettier and the
repository check enforce their supported parts. `build/`, `node_modules/`,
leases, and caches are local resources, not repository facts.
Evidence remains with its producer and specific claim; it needs no root folder.

This page makes no present-tense claim about remote state, team adoption, or
ETHOS product parity. Observe the exact revision in its actual environment
before reporting any of them. Do not stage a team task or recruit a reviewer
solely to certify adoption of these guidelines.
