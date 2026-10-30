---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---

# Repository Change and Release

Material changes need one official OpenSpec Change and an owned ETHOS Work
Lane. Publish through native admission and verify each Forge independently.
For department work, start at the [task map](../README.md).

| Your task                  | Read next                                             |
| -------------------------- | ----------------------------------------------------- |
| Edit or accept source      | [Change authority](#change-authority)                 |
| Publish an edition         | [Versioned releases](#versioned-releases)             |
| Investigate a failed check | [Quality and local state](#quality-and-local-state)   |
| Prepare ETHOS              | [Tool supply](#tool-supply)                           |
| Operate CI                 | [Runner boundaries](#runner-and-transport-boundaries) |
| Retire replaced work       | [Evidence and retirement](#evidence-and-retirement)   |

[Contributing](../../CONTRIBUTING.md) owns executable procedures; this page owns
permission, acceptance, and retirement boundaries.

## Change Authority

| Owner                                                | Responsibility                                                                       | Limit                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [Official OpenSpec Change](../../openspec/README.md) | Material intent, requirements, design, and progress in `tasks.md`.                   | Does not authorize a write or publication.                 |
| Installed ETHOS                                      | Changed-path attribution, lane lease, admission, proof, acceptance, and publication. | Acts on current source and policy, not remembered results. |
| [Decision record](../decisions/README.md)            | Durable rationale and rejected alternatives.                                         | Does not hold tasks, command output, or acceptance logs.   |

Use the [official workspace](../../openspec/README.md) for artifact roles and
the [contributor procedure](../../CONTRIBUTING.md) for exact write, check, and
publication steps. The installed `ethos status --json` result identifies the
current product contracts in `governance_context.agent_guidance.sources`.
Read those version-matched references for shared admission, proof, and retirement
rules; this page adds no second contract.

Acceptance into `dev` does not close outstanding delivery. Complete this
Change's declared obligations before official archive, then qualify the new
archive commit's signature, proof, and publication before retiring its lane.
Earlier-HEAD evidence cannot establish those later effects.

## Source, Two Forges, and Actual Use

| Plane         | Required observation                                   | Does not establish                   |
| ------------- | ------------------------------------------------------ | ------------------------------------ |
| Local source  | Attribution, checks, exact-HEAD proof, and acceptance. | Delivery to either Forge.            |
| GitLab        | Its exact ref, hosted jobs, Release, and asset.        | GitHub delivery or team use.         |
| GitHub        | Its independent ref, hosted jobs, Release, and asset.  | GitLab delivery or team use.         |
| Ordinary work | Actual use with subject, source, time, and limits.     | Repository or publication integrity. |

Local verification contacts neither Forge. GitLab is the organization's primary
publication plane. GitHub independently provides the complete repository,
CI/CD, updates, and distribution, including during a GitLab outage. An outage
release requires native ETHOS admission and GitHub's own release evidence.
Select that peer explicitly; do not raw-push around a native refusal.

Release acceptance is per peer, not a two-Forge transaction. GitLab's absence
does not block a GitHub release that meets the [release checks](#versioned-releases).
Keep GitLab publication, CI, downloads, and live links pending in the existing
Change. When it returns, publish the same signed objects and verify its own
results; do not create a different edition or rewrite the published tag.

Publish only `dev`, `main`, `proposal/*`, and ETHOS-admitted signed release tags.
`candidate/dev` and `work/*` stay local. The installed ETHOS repository paradigm
owns branch roles, commit grammar, and mandatory SSH signatures. The
[release declaration](../../.ethos/release.toml) binds the accepted fast-forward
mirror and publication peers without operator keys or host paths.

Publish the same signed commit graph to each Forge when available, including
governed merge commits. Fast-forward acceptance advances a ref to a descendant;
it does not require single-parent history. Do not squash or rewrite accepted history to
satisfy a peer's configuration. Keep `dev` and `main` protected, require the
declared source checks and trusted signatures, and forbid force pushes and
deletions. Remote rules must admit the governed graph; GitHub's linear-history
requirement conflicts with that contract.

## Versioned Releases

[`VERSION`](../../VERSION) holds the released identity between release cuts and
the next edition during preparation. The charter links to this single value.
Working source may contain [Unreleased changes](../../CHANGELOG.md#unreleased).
Only the signed tag identifies exact release content. No other manifest carries a
second release version.

The public surface includes normative duties, stable member and Agent routes,
and documented contributor commands. Apply [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html)
to their actual meaning and migration: incompatible changes increment major;
compatible additions or deprecations, minor; compatible corrections, patch.
A parser or commit label cannot decide compatibility.

[`CHANGELOG.md`](../../CHANGELOG.md) follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
Use the six standard categories without duplicates; their order may vary. Use
bracketed headings, including `[Unreleased]`, and one History row offering
both GitLab and GitHub. The oldest tagged edition may link to its exact tag;
later editions compare adjacent tags. History rows are reader navigation; no
check verifies their targets. The [release declaration](../../.ethos/release.toml)
owns each Forge's web identity independently of Git transport. Use GitLab
`/-/compare/` or `/-/tags/` and GitHub `/compare/` or `/releases/tag/`, with the
same refs on both peers.

- Keep upcoming notes under `Unreleased` and assign the actual date at release
  cut. One untagged dated heading is allowed only while that exact release-cut
  source is committed and proved before tagging. Do not fabricate a sequence
  from older untagged editions; they remain in Git history.
- Require the selected Forge's declared source jobs at the exact release-cut
  commit before first signing its annotated `vX.Y.Z` tag, which must match
  committed `VERSION`. An earlier proposal or later Changelog edit has a
  different identity. A later peer must qualify that same source before
  receiving the existing tag; do not sign another object for it.
- Observe the selected Forge's tag, Release, and source jobs at the tagged
  commit. Its live links must resolve after their
  targets exist; another peer's unavailable links remain pending, not passed.
  A heading, branch, or CI result is not a release. New commits, including
  archive commits, require a trusted SSH signature and correct attribution;
  each clone supplies its own
  identity, public signing-key path, and protected external trust anchor.

Installed ETHOS rejects malformed Changelog structure, dates, and version order.
Its release tag admission requires the tag to match committed `VERSION` and the
Changelog to have that version's entry. The release's live link check reports a
broken comparison link for the selected peer. The same Changelog serves both
peers and local readers.

## Quality and Local State

Run the source checks in [Contributing](../../CONTRIBUTING.md#verify-the-source).
Working-edit checks and committed-source host verification are separate
observations; neither grants repository proof, source acceptance, or publication.
The [configuration map](configuration.md) locates native inputs.

### Observe the Execution Environment

Installed ETHOS binds execution to the selected source and records the command,
result, and complete diagnostics. DDWG keeps no separate environment reporter.
The runner owner verifies guest identity, host architecture, resources, isolation,
and throughput where claimed. A mounted workspace may differ from the guest root
volume; host-local observations belong in evidence, never portable configuration.

### Preserve Official OpenSpec Results

Installed ETHOS invokes its supplied official OpenSpec tool and retains the
complete native result under the product validation contract. Use the
[workspace procedure](../../openspec/README.md), not a repository report parser.
A summary or successful parse cannot replace clean validation or the lifecycle.

### Proof and Configuration

The [profile](../../.ethos/profile.toml) declares no gates. Installed ETHOS
selects the applicable shared checks from the authored Markdown, configuration,
and OpenSpec artifacts; `source-format` checks selected source once.

Installed `source-format` checks authored-source byte integrity before native
layout; `config-quality` owns configuration syntax. These checks do not establish
English prose quality or impose a second raw blank-line rule. Review new authored text for English and department terminology
without rewriting quoted originals, historical text, or meaningful literals.

| Concern                              | Current consumer                                                | Ownership boundary                                                              |
| ------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Metadata and decision structure      | Installed `docs-registry`.                                      | The shared contract owns identity, structure, and non-execution inspection.     |
| Source formatting and Markdown lint  | Installed `source-format` and `markdown-lint`.                  | Native formatters own layout; shared lint owns non-spacing checks.              |
| Official artifacts and configuration | Installed OpenSpec and configuration checks.                    | Use supplied validation and native inputs, without a repository parser.         |
| Local links and fragments            | Installed `markdown-links` in the shared floor.                 | The shared provider owns committed targets, headings, aliases, and diagnostics. |
| English prose and terms              | Installed `prose`, with a temporary spelling increment.         | Shared spelling still needs corpus and vocabulary qualification.                |
| Release history                      | Installed repository paradigm and release tag admission.        | History links are navigation, not verified facts.                               |
| ETHOS supply and CI                  | Mise installs the locked release; generated jobs run its graph. | GitLab's Windows ARM64 runners run the x64 runtime under emulation.             |

A repository adds code, a package, or a proof gate only for a duty that no
installed check owns; the selected Change names that duty. Shared rules or
source code alone do not qualify a replacement. Keep each current consumer
until the accepted installed successor covers its complete duty, then retire
the duplicate implementation, configuration, tests, and guidance in that same
migration. Unrelated product work does not hold an independently qualified
replacement.

Installed ETHOS owns checkout normalization. It checks each tracked file's
effective Git attributes, including later or nested overrides; text must use
LF, while `-text` preserves exact bytes. This rule has no separate DDWG checker.

Run the full applicable closure on the exact committed tree and keep its original
diagnostics. Structural checks cannot establish factual accuracy, semantic
fidelity, reader understanding, or team use.

The task map and topic owners retain reader navigation. Review actual member and
Agent journeys for scope, authority, next action, and stop conditions; do not use
a private route table, fixed opening phrase, or paragraph position as acceptance.
Installed link and registry checks verify their declared structures, not whether
a reader understands the guidance.

### Source Links and Decision Records

#### Source Link Selection

Installed `markdown-links` checks the exact committed delivery without network
access. Changed or uncommitted source is not a qualified delivery. Native Lychee
resolves link destinations and headings; ETHOS checks delivered membership, internal aliases,
source identity, warnings, and complete diagnostics. Missing headings, ignored
local state, escaping or dangling aliases, and changed bytes fail the check.
A delivered directory or internal alias is valid only when its target belongs
to that source. The [contributor procedure](../../CONTRIBUTING.md#run-the-full-source-check)
owns the command; DDWG keeps no duplicate link implementation.

Formatting and lint can examine working edits and non-ignored candidate files.
That selection does not establish committed-link acceptance. The [existing quality
requirement](../../openspec/specs/quality/spec.md#requirement-local-references-resolve-to-delivered-source)
also covers tracked working edits and non-ignored candidate links. Shared
qualification of those inputs remains pending; do not infer it from committed
checks or remove the requirement. External reachability
uses the installed `external-links` gate and the selected peer's actual endpoints.
A successful local check cannot establish remote availability or publication.

#### Decision Record Form

The [decision register](../decisions/README.md#add-only-a-decision-worth-keeping)
helps reviewers decide whether a lasting choice needs a record. Installed
`docs-registry` owns its identity, metadata, section structure, and command
inspection, without executing the input or requiring a second DDWG parser.
Reviewers assess the rationale and trade-offs; a structural pass cannot establish
a sound decision or current delivery.

## Tool Supply

Reading the guidelines requires no installation. Maintainers and CI need only
installed ETHOS: Mise installs the locked release from the
[project configuration](../../.config/mise/config.toml) and its
[lock](../../.config/mise/mise.lock). ETHOS supplies its own Node, formatters,
and prose and link tools; the repository ships no package, maintenance toolkit,
native binary, or offline bundle. [Contributing](../../CONTRIBUTING.md#make-ethos-available)
owns the commands. Those procedures preserve the destination's installation owner
and global configuration; local checks do not upgrade host tools or Runner services.

| Operation          | Supply boundary                                                                |
| ------------------ | ------------------------------------------------------------------------------ |
| Local verification | Mise installs the locked ETHOS release; the repository downloads nothing else. |
| GitHub source CI   | Mise from its pinned action, then the locked ETHOS release.                    |
| GitLab source CI   | Mise from the project's package registry, then the locked ETHOS release.       |

### Qualify Each Platform

Run the complete declared graph on each claimed platform. Observe host and tool
architectures separately; a declared asset or container name does not qualify
an ABI. GitLab's Windows ARM64 runners install the release's Windows ARM64
archive, which carries the x64 runtime that Windows runs through emulation.

### Audit Artifacts

ETHOS audits its own release supply and publishes its known findings with each
release. The pinned CI image and Mise keep their own owners' approvals. An
authorized risk decision must identify the exact artifact and finding, allowed
use and distribution, and expiry or withdrawal condition, with complete reports;
keep it with the producing Change and evidence. This page grants no approval,
and an approval for one artifact cannot cover another.

## Runner and Transport Boundaries

The [runner declarations](../../.config/ci/runners.toml) identify permitted
command prerequisites by Forge. They do not establish executable availability,
runner identity, isolation, capacity, or successful job execution.

Verify GitHub's hosted platform matrix and GitLab's admitted Linux, macOS, and
Windows runners through their jobs and native runner/guest observations. GitLab's
Linux container acquires the byte-exact official Mise installer and archive from
the project's package registry, verifies the installer checksum and the archive
through the original installer, then installs the locked ETHOS release. No
upstream fallback is configured for Mise. Every GitLab job keeps the Mise
configuration, data, and cache under its own execution root, so no job writes
the runner account's profile or shares Mise state with another job. Bootstrap
does not establish hosted acceptance.

### Review and Protected Execution

- Proposal and merge-request jobs use review runners. Protected `dev`, `main`,
  and release jobs use separate trusted runners. Accounts, identities,
  workspaces, caches, and credential reachability do not cross that boundary;
  another tag or container on the same runner does not provide separation.
- Require project locking and tagged-only scheduling on every GitLab runner;
  trusted runners also require native `ref_protected` access. Keep `dev`,
  `main`, and `v*` protected so proposal YAML cannot select a trusted runner.
- All eligible Windows jobs reserve one native project-scoped resource group,
  independent of ref and event. This schedules capacity, not trust or
  cross-project isolation. Preserve complete test discovery and deadlines.
- Once a proposal has an open MR, use its MR pipeline instead of a duplicate
  branch-push pipeline.
- Before Linux admission, verify the exact CI OCI digest is allowed and cached.
  Native hosts follow the [tool-supply boundary](#tool-supply).

### Credential-Bearing Paths

Observe registration/polling, clone, and `CI_JOB_TOKEN` package requests
separately. The administrator's HTTP-only GitLab is a fixed deployment boundary.
A registration tunnel protects neither clone nor package traffic; each
unencrypted path needs an authorized bounded risk decision for the isolated
network. Tags, images, YAML, or older green runs prove neither actual execution
nor registration and isolation.

## Evidence and Retirement

Before retiring completed-Change copies, resolve their unique facts, obligations,
and consumers. Bind historical links to the full ancestor commit and exact path,
and verify original bytes. Git retains source history. Deletion cannot absorb an
unresolved obligation or close a Change. Official archive creates a new commit;
prove and publish that commit separately afterward.

### Retained Downloads

Keep downloads for the latest qualified release and one qualified rollback,
plus native packages consumed by source or CI, such as the Mise bootstrap package.
Editions from 8.0.0 attach no download. Before retirement, verify exact
identities and consumers. Preserve signed tags, source, original release notes,
and historical evidence; remove withdrawn download links and add a dated notice.
Recheck retained hashes and the affected Forge's inventory. Retire downloads
only after their successor qualifies on that same Forge; an outage on the other
Forge does not block this aftercare or release its consumers. Report reclaimed
space only from provider confirmation. [Contributing](../../CONTRIBUTING.md#retire-superseded-downloads)
owns the procedure.

### Local Evidence and Workspaces

Keep evidence with its producer and claim. Local `build/`, leases, and caches do
not establish repository truth, and no root evidence folder
is required. Required failures and job results need a named consumer, exact
source binding, and release condition. Later success does not release them.

Before retiring a workspace, transfer unique evidence to its existing durable
owner and verify complete bytes. `build/` is not a permanent archive. Separate
active state, durable evidence, foreign work, and disposable residue; remove only
proved owned residue, then verify its absence and preserved content.

Claims of remote delivery, ETHOS parity, or team use need the selected revision
observed in its actual environment. Do not stage a human task or recruit a
reviewer just to certify guideline adoption.
