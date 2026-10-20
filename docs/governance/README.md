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

| Your task                       | Read next                                             |
| ------------------------------- | ----------------------------------------------------- |
| Edit or accept source           | [Change authority](#change-authority)                 |
| Publish an edition              | [Versioned releases](#versioned-releases)             |
| Investigate a failed check      | [Quality and local state](#quality-and-local-state)   |
| Prepare tools or offline checks | [Tool supply](#tool-supply-and-offline-execution)     |
| Operate CI                      | [Runner boundaries](#runner-and-transport-boundaries) |
| Retire replaced work            | [Evidence and retirement](#evidence-and-retirement)   |

[Contributing](../../CONTRIBUTING.md) owns executable procedures; this page owns
permission, acceptance, and retirement boundaries.

## Change Authority

| Owner                                                | Responsibility                                                                       | Limit                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [Official OpenSpec Change](../../openspec/README.md) | Material intent, requirements, design, and progress in `tasks.md`.                   | Does not authorize a write or publication.                 |
| Installed ETHOS                                      | Changed-path attribution, lane lease, admission, proof, acceptance, and publication. | Acts on current source and policy, not remembered results. |
| Repository checks                                    | Document quality, reader routes, decision shape, and declared configuration.         | Do not replace OpenSpec lifecycle or ETHOS admission.      |
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
the next edition during preparation; the [charter](../charter.md) displays it.
Working source may contain [Unreleased changes](../../CHANGELOG.md#unreleased).
Only the signed tag identifies exact release content. The private npm manifest
carries no second release version.

The public surface includes normative duties, stable member and Agent routes,
and documented contributor commands. Apply [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html)
to their actual meaning and migration: incompatible changes increment major;
compatible additions or deprecations, minor; compatible corrections, patch.
A parser or commit label cannot decide compatibility.

[`CHANGELOG.md`](../../CHANGELOG.md) follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
Use the six standard categories without duplicates; their order may vary and
`[YANKED]` is valid. Use bracketed headings, including `[Unreleased]`, and one History row offering
both GitLab and GitHub. The oldest tagged edition may link to its exact tag;
later editions compare adjacent tags. The [release declaration](../../.ethos/release.toml)
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
- Observe the selected Forge's tag, Release, asset, complete offline jobs, and
  independently retrieved hashes. Its live links must resolve after their
  targets exist; another peer's unavailable links remain pending, not passed.
  A heading, branch, or CI result is not a release. New commits, including
  archive commits, require a trusted SSH signature and correct attribution;
  each clone supplies its own
  identity, public signing-key path, and protected external trust anchor.

The default integrity gate and both CI planes reject malformed Changelog
structure, dates, links, version drift, and tag mismatch. Offline checks verify
identity and ancestry. Each provider's authenticated comparison response must
establish its real destination, not a login redirect or another repository's
success. The same Changelog serves both peers and local readers.

## Quality and Local State

Run the source checks in [Contributing](../../CONTRIBUTING.md#verify-the-source).
Working-edit checks and committed-source host verification are separate
observations; neither grants repository proof, source acceptance, or publication.
The [configuration map](configuration.md) locates native inputs.

### Observe the Execution Environment

The source check records path, commit, tree, tracked changes, Node version,
platform, process architecture, host name, and exact workspace-capacity bytes.
Read errors fail the check. These diagnostics do not establish VM identity,
host architecture, isolation, or throughput; the runner owner verifies guest
and host separately. A mounted workspace may differ from the guest root volume.
Host names belong in evidence, never portable configuration.

### Preserve Official OpenSpec Results

Installed ETHOS invokes its supplied official OpenSpec tool and retains the
complete native result under the product validation contract. Use the
[workspace procedure](../../openspec/README.md), not a repository report parser.
A summary or successful parse cannot replace clean validation or the lifecycle.

### Proof and Configuration

The [profile](../../.ethos/profile.toml) still declares two temporary roots:
`docs-integrity` calls the remaining repository checks after native behavior and prose checks;
`markdown-format` supplies static analysis only. Installed ETHOS owns their
applicable shared closure. `source-format` checks selected source once, without
a second formatter provider in the local root.

The remaining repository text check covers source-byte integrity. It does not
detect language, parse TOML, classify formatter ownership, or impose a raw
blank-line rule; installed `source-format` and `config-quality` own native layout
and syntax. Review new authored text for English and department terminology
without rewriting quoted originals, historical text, or meaningful literals.

| Concern                                | Current consumer                                          | Ownership boundary                                                              |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Metadata and decision structure        | Installed `docs-registry`.                                | The shared contract owns identity, structure, and non-execution inspection.     |
| Source formatting and Markdown lint    | Installed `source-format` and `markdown-lint`.            | Native formatters own layout; shared lint owns non-spacing checks.              |
| Official artifacts and configuration   | Installed OpenSpec and configuration checks.              | Use supplied validation and native inputs, without a repository parser.         |
| Retained executable source             | Native behavior and static providers.                     | Keep applicable obligations while repository code remains.                      |
| Local links and fragments              | Installed `markdown-links` in the shared floor.           | The shared provider owns committed targets, headings, aliases, and diagnostics. |
| English prose and terms                | Installed `prose`, with a temporary spelling increment.   | Shared spelling still needs corpus and vocabulary qualification.                |
| Release history                        | Repository check, alongside the applicable shared checks. | Complete replacement still needs actual-consumer qualification.                 |
| Tool supply, offline execution, and CI | Current repository supply and job consumers.              | Public product supply and CI integration remain unfinished.                     |

The selected Change owns remaining integration and its evidence. Shared rules
or source code alone do not qualify a replacement. Keep each current consumer
until the accepted installed successor covers its complete duty, then retire
the duplicate implementation, configuration, tests, and guidance in that same
migration. Unrelated product work does not hold an independently qualified
replacement.

Run the full applicable closure on the exact committed tree and keep its original
diagnostics. Document output cannot replace behavior evidence; syntax alone
cannot establish static correctness. Tests and structural checks also cannot
establish factual accuracy, semantic fidelity, reader understanding, or team use.

### Source Links and Decision Records

#### Source Link Selection

Installed `markdown-links` checks the exact committed delivery without network
access. Changed or uncommitted source is not a qualified delivery. Native Lychee
resolves link destinations and headings; ETHOS checks delivered membership, internal aliases,
source identity, warnings, and complete diagnostics. Missing headings, ignored
local state, escaping or dangling aliases, and changed bytes fail the check.
A delivered directory or internal alias is valid only when its target belongs
to that source. An ignored supplied bundle is a separate explicit verification
input. The [contributor procedure](../../CONTRIBUTING.md#run-the-full-source-check)
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

## Tool Supply and Offline Execution

Reading the guidelines requires no installation. Maintainers and CI use the
optional bundle to supply quality checks without downloads. Install ETHOS
separately for Change admission and proof; it is not included in that bundle.

[`package.json`](../../package.json) owns the Node line and exact npm version
through `devEngines`, with `onFail: error`. npm rejects a mismatch before
`install`, `ci`, and `run`; ephemeral CI acquires that npm first. Mise acquisition
enforces the declared checksum. npm accepting checksum metadata does not verify
integrity.

Shell CI selects each command's runtime through the existing Mise installation,
[project configuration](../../.config/mise/config.toml), and
[native lock](../../.config/mise/mise.lock). Keep host npm, Runner services, and
each maintained host's installation owner unchanged. Local and offline checks
never upgrade them. Do not use `--force` or an admission override. Tracked
`.gitattributes` keeps LF on every OS.

| Operation            | Supply boundary                                        |
| -------------------- | ------------------------------------------------------ |
| Local verification   | Installed, version-checked tools; no downloads.        |
| GitLab source CI     | Pinned project packages through its own job token.     |
| GitHub source CI     | Pinned official upstream assets.                       |
| Offline installation | Matching source-bound bundle; no replacement download. |

### Select and Verify Native Tools

The [supply manifest](../../.config/supply/native.json) pins platform archives,
raw binary sizes, executable digests, and upstream notices. The
[bundle record](../../.config/release/offline-bundle.json) binds the edition,
Node major, complete package manifest, lockfile, and native supply. Include the
complete npm cache, declared native assets, and notices. The bundle does not
change third-party licenses or duplicate npm policy.

Verify bytes before extraction or execution. Before checking a version, resolve
PATH names and direct selectors to a native file, respecting Windows quoting
and executable suffixes. A matching version cannot admit altered bytes.
Package-manager binaries retain their installation owner's trust boundary;
do not claim they are byte-equivalent to release assets.

### Acquire Supplied Assets

Use the [tool acquisition procedure](../../CONTRIBUTING.md#acquire-supplied-assets)
for download, cache publication, and extraction. It preserves the declared
artifact identity, credential boundary, original diagnostics, and the
destination executor's ownership; it grants no use or distribution approval.

### Qualify Each Platform

CI bootstraps Node/npm and acquires the exact asset before offline execution.
That whole job is not network-isolation proof. Qualify cold local use separately
with fresh HOME, no inherited configuration/cache, and denied remote connections.
Run the full graph on every claimed host with actual npm recorded.

Declaring a platform asset does not qualify that ABI. Verify each claimed
platform through its actual executor. On Windows ARM64, prefer native ARM64
Node. When the manifest has no ARM64 tool
asset, use its declared pinned x64 asset under Windows emulation. Tool
compatibility does not require emulating Node too. Qualify the actual
combination and record host, Node-process, and tool architectures separately.

For managed tools, invoke
`node tools/ci/install-native.mjs TOOL --print-spec` with the same Node executable
used for verification. Record its selected asset `key` and digests, not a cache
directory name.
The installation owner supplies provenance for an external executable.
Independently download and hash each Forge asset; a pin or install preview is
not platform acceptance.

### Audit Dependencies and Artifacts

Audit Node, npm, native-tool, and ETHOS artifacts separately from the project
lock. Bind each audit to its digest, platform, and component inventory from a
native extractor. Missing or empty inventories leave coverage unproved. Keep
raw findings separate from binary-symbol results; symbols do not establish
runtime reachability, and a failed scan cannot establish a clean audit.

#### Project-Lock Reports

On each hosted plane, retain one complete unfiltered OSV project scan, its exact
lock and [policy](../../.config/checks/dependencies/policy.toml), streams, and
status. Apply the accepted finding disposition without a second filtered scan.
The known braces finding does not block checks, CI, installation, distribution,
or releases. Its former expiry, a newer package version, an available fix, or a
finding's disappearance or withdrawal must not turn that acceptance into a hold.
Remove the obsolete disposition when it no longer applies as ordinary maintenance,
not as a prerequisite for delivery. Keep complete reports and remediation tracking;
an accepted finding is not a clean audit.

Unapproved findings, input drift, failed or warning-bearing execution, and
malformed or incomplete reports still fail qualification. Other artifact approvals
keep their own scope and expiry. Source checks contact no advisory service and
cannot grant or renew those approvals.

### Bound Known Findings

An authorized risk decision must identify the exact artifact and finding,
allowed use and distribution, expiry or withdrawal condition, and complete
reports. Keep that binding with the native policy or producing Change and
evidence. This page grants no approval; the
[dependency policy](../../.config/checks/dependencies/policy.toml) owns only
project-lock dispositions, not image or native-binary approvals.

The user has accepted the known braces finding as non-blocking for verification,
CI, distribution, and releases. Keep its full report and remediation tracking;
it does not accept another finding or package, or remove input-integrity checks.

A development approval for other findings cannot cover production, arbitrary untrusted input,
other findings, changed artifacts, or another repository. Verify authenticity,
complete bytes, hashes, licenses, function, and each claimed platform separately.
Source-lock advisories, including maintenance findings and aliases, cannot
establish a complete shipped-binary inventory; retain that limit and the full
reports. Replace a compatibility check only after the accepted installed
successor qualifies the same consumer, then remove the old check in that
migration. Keep no second risk policy or gate.

## Runner and Transport Boundaries

Verify GitHub's hosted platform matrix and GitLab's admitted Linux, macOS, and
Windows runners through their jobs and native runner/guest observations. GitLab
source and offline jobs use pinned project packages without public-download
fallbacks.

Bind bundle qualification to the exact source, artifact, and job results.
Temporary qualification packages do not establish signed Releases,
authenticated release downloads, or whole-job network isolation. Wait for all
jobs to become terminal, preserve their results, then retire the exact temporary
package. [Contributing](../../CONTRIBUTING.md#publish-a-release) owns the route.

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
  Native hosts follow the [tool-supply boundary](#tool-supply-and-offline-execution).
- Signed-tag offline jobs start only after package and Release exist. Source
  tag-push jobs cannot qualify an asset published afterward.

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
plus native packages consumed by source or CI. Before retirement, verify exact
identities and consumers. Preserve signed tags, source, original release notes,
and historical evidence; remove withdrawn download links and add a dated notice.
Recheck retained hashes and the affected Forge's inventory. Retire downloads
only after their successor qualifies on that same Forge; an outage on the other
Forge does not block this aftercare or release its consumers. Report reclaimed
space only from provider confirmation. [Contributing](../../CONTRIBUTING.md#retire-superseded-downloads)
owns the procedure.

### Local Evidence and Workspaces

Keep evidence with its producer and claim. Local `build/`, `node_modules/`,
leases, and caches do not establish repository truth, and no root evidence folder
is required. Required failures and job results need a named consumer, exact
source binding, and release condition. Later success does not release them.

Before retiring a workspace, transfer unique evidence to its existing durable
owner and verify complete bytes. `build/` is not a permanent archive. Separate
active state, durable evidence, foreign work, and disposable residue; remove only
proved owned residue, then verify its absence and preserved content.

Claims of remote delivery, ETHOS parity, or team use need the selected revision
observed in its actual environment. Do not stage a human task or recruit a
reviewer just to certify guideline adoption.
