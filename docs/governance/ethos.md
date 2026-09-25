---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---

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

| Plane         | It can establish                                              | It cannot establish alone        |
| ------------- | ------------------------------------------------------------- | -------------------------------- |
| Local source  | Change attribution, checks, exact-HEAD proof, and acceptance. | Delivery to either Forge.        |
| GitLab        | Its exact ref, hosted CI, and release object.                 | GitHub delivery or team use.     |
| GitHub        | Its independent ref, hosted CI, and release object.           | GitLab delivery or team use.     |
| Team practice | An observed result in real work, with owner and reviewer.     | Source or publication integrity. |

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
categories, dates, links, version drift, and tag mismatch. At most one current
version may be prepared without a tag. A heading, branch, or CI result is not a
versioned release. ETHOS admits only an exact, signed annotated `vX.Y.Z` tag
matching the committed `VERSION`; each Forge Release and asset must then be
observed separately. Older untagged branch editions stay in Git history, not a
fabricated release sequence.

New commits and official archive commits require trusted SSH signatures. Each
clone supplies its own local identity, public signing-key path, and protected
trust anchor outside this repository. Inspect attribution and signature before
acceptance. The [workspace policy](../../.ethos/workspace.toml) and
[release declaration](../../.ethos/release.toml) state the enforceable local
branch and tag boundaries; they contain no operator key or host path.

## Quality and local state

`npm run verify` invokes one [portable quality entry](../../tools/docs/cli.mjs):
locked Prettier for Markdown, code, JSON, and YAML; TOML syntax; Markdown lint;
CSpell spelling; offline version-checked lychee
links and fragments, metadata, every present Mermaid diagram, English and
spacing, repository boundaries, official OpenSpec, version identity, CI
topology, and negative
tests. The [supply manifest](../../.config/tools/lychee.json) pins lychee assets
by platform and SHA-256; the CI installer verifies the downloaded digest. Local
validation checks the executable version and never downloads an asset. Explicit
CI supply and an offline `--asset` path are different operations. A cold offline
installation is not qualified until its full dependency bundle has been tested.
Both hosted CI planes run `npm audit --audit-level=moderate` during online tool
supply; local source verification does not require network access.

GitHub runs Linux, macOS, and Windows hosted jobs; GitLab selects the
`ci-linux-arm64-docker` runner. Workflow declarations alone are not hosted
success. Markdown and configuration use one blank line between blocks;
Prettier and the repository check enforce their supported parts. `build/`,
`node_modules/`, leases, and caches are local resources, not repository facts.
Evidence remains with its producer and specific claim; it needs no root folder.

This page makes no present-tense claim about remote state, team adoption, or
ETHOS product parity. Observe the exact revision in its actual environment
before reporting any of them.
