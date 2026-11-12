---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---

# Repository Change and Release

Material changes need one official OpenSpec Change and an owned ETHOS Work Lane. Publish through
native admission and verify each Forge independently. This page owns permission, acceptance, and
retirement boundaries. [Source checks and CI](checks-and-ci.md) owns the boundaries of checks, tool
supply, and runners, and [Contributing](../../CONTRIBUTING.md) owns the executable procedures.

## Change Authority

| Owner                                                | Responsibility                                                                       | Limit                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [Official OpenSpec Change](../../openspec/README.md) | Material intent, requirements, design, and progress in `tasks.md`.                   | Does not authorize a write or publication.                 |
| Installed ETHOS                                      | Changed-path attribution, lane lease, admission, proof, acceptance, and publication. | Acts on current source and policy, not remembered results. |
| [Decision record](../decisions/README.md)            | Durable rationale and rejected alternatives.                                         | Does not hold tasks, command output, or acceptance logs.   |

Use the [official workspace](../../openspec/README.md) for artifact roles and the
[contributor procedure](../../CONTRIBUTING.md) for exact write, check, and publication steps. The
installed `ethos status --json` result identifies the current product contracts in
`governance_context.agent_guidance.sources`. Those version-matched references own the shared
admission, proof, and retirement rules; this page adds no second contract.

## Source, Two Forges, and Actual Use

| Plane         | Required observation                                   | Does not establish                   |
| ------------- | ------------------------------------------------------ | ------------------------------------ |
| Local source  | Attribution, checks, exact-HEAD proof, and acceptance. | Delivery to either Forge.            |
| GitLab        | Its exact ref, hosted jobs, and Release.               | GitHub delivery or team use.         |
| GitHub        | Its independent ref, hosted jobs, and Release.         | GitLab delivery or team use.         |
| Ordinary work | Actual use with subject, source, time, and limits.     | Repository or publication integrity. |

Local verification contacts neither Forge. GitLab is the organization's primary publication plane.
GitHub independently provides the complete repository, CI/CD, updates, and distribution, including
during a GitLab outage.

Release acceptance is per peer, not a two-Forge transaction. GitLab's absence does not block a
GitHub release that meets the [release checks](#versioned-releases); an outage release requires
native ETHOS admission and GitHub's own release evidence. Select that peer explicitly; do not
raw-push around a native refusal. Keep GitLab publication, CI, downloads, and live links pending in
the existing Change. When it returns, publish the same signed objects and verify its own results; do
not create a different edition or rewrite the published tag.

Publish only `dev`, `main`, `proposal/*`, and ETHOS-admitted signed release tags. `candidate/dev`
and `work/*` stay local. The installed ETHOS repository paradigm owns branch roles, commit grammar,
and mandatory SSH signatures. The [release declaration](../../.ethos/release.toml) binds the
accepted fast-forward mirror and publication peers without operator keys or host paths.

Publish the same signed commit graph to each Forge when available, including governed merge commits.
Fast-forward acceptance advances a ref to a descendant; it does not require single-parent history.
Do not squash or rewrite accepted history to satisfy a peer's configuration. Keep `dev` and `main`
protected, require the declared source checks and trusted signatures, and forbid force pushes and
deletions. Remote rules must admit the governed graph; GitHub's linear-history requirement conflicts
with that contract.

## Versioned Releases

[`VERSION`](../../VERSION) holds the released identity between release cuts and the next edition
during preparation. The charter links to this single value, and no other manifest carries a second
release version. Working source may contain [Unreleased changes](../../CHANGELOG.md#unreleased);
only the signed tag identifies exact release content.

The public surface includes normative duties, stable member and Agent routes, and documented
contributor commands. Apply [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html) to their actual
meaning and migration: incompatible changes increment major; compatible additions or deprecations,
minor; compatible corrections, patch. A parser or commit label cannot decide compatibility.

[`CHANGELOG.md`](../../CHANGELOG.md) follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/). Use the six standard categories
without duplicates; their order may vary. Use bracketed headings, including `[Unreleased]`. The
Changelog names no peer: it carries no History row or other link to a Forge, because every peer
receives the same file. ETHOS reads each peer's web repository from the clone's own Git
configuration, the remote's URL or `remote.<name>.forgeRepository`, never from a tracked file.

- Keep upcoming notes under `Unreleased` and assign the actual date at release cut. One untagged
  dated heading is allowed only while that exact release-cut source is committed and proved before
  tagging. Do not fabricate a sequence from older untagged editions; they remain in Git history.
- Require the selected Forge's declared source jobs at the exact release-cut commit before first
  signing its annotated `vX.Y.Z` tag. Installed ETHOS admits the tag only when it matches committed
  `VERSION` and the Changelog has that version's entry. An earlier proposal or later Changelog edit
  has a different identity. A later peer must qualify that same source before receiving the existing
  tag; do not sign another object for it.
- Observe the selected Forge's tag, Release, and source jobs at the tagged commit. A heading,
  branch, or CI result is not a release. New commits, including archive commits, require a trusted
  SSH signature and correct attribution; each clone supplies its own identity, public signing-key
  path, and protected external trust anchor.

## Evidence and Retirement

Acceptance into `dev` does not close outstanding delivery. Complete the Change's declared
obligations before official archive. Archive creates a new commit: qualify its signature, proof, and
publication before retiring its lane, because earlier-HEAD evidence cannot establish those later
effects.

Before retiring completed-Change copies, resolve their unique facts, obligations, and consumers.
Bind historical links to the full ancestor commit and exact path, and verify original bytes. Git
retains source history. Deletion cannot absorb an unresolved obligation or close a Change.

### Retained Downloads

Editions from 8.0.0 attach no download. On 2026-11-01 the owner withdrew the downloads attached to
earlier editions from both Forges, with the packages of the retired toolkit and the CI history
before 8.0.0; each affected Release keeps its tag and notes and states the withdrawal. Keep native
packages consumed by source or CI, such as the Mise bootstrap package, and the preceding version for
a rollback of current CI. Preserve signed tags, source, original release notes, historical evidence,
and every record of another active lane.
[Contributing](../../CONTRIBUTING.md#retire-superseded-downloads) owns the retirement procedure,
from its exact inventory to the provider's confirmation of reclaimed space.

### Local Evidence and Workspaces

Keep evidence with its producer and claim. Local `build/`, leases, and caches do not establish
repository truth, and no root evidence folder is required. Required failures and job results need a
named consumer, exact source binding, and release condition. Later success does not release them.

Before retiring a workspace, transfer unique evidence to its existing durable owner and verify
complete bytes. `build/` is not a permanent archive. Separate active state, durable evidence,
foreign work, and disposable residue; remove only proved owned residue, then verify its absence and
preserved content.

Claims of remote delivery, ETHOS parity, or team use need the selected revision observed in its
actual environment. Do not stage a human task or recruit a reviewer just to certify guideline
adoption.
