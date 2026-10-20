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

The selected OpenSpec Change owns intent, requirements, design, and progress.
ETHOS compiles its acceptance conditions into a temporary Commitment for
admission and proof. A private scope companion, tracked claim ledger,
method-pack plan, or local script cannot supply another lifecycle.

Follow the [official artifact rules](../../openspec/config.yaml). Specifications
own observable requirements; design owns choices and migration order; tasks
own actions, completion checks, and checkbox state. Keep execution results with
their producer. An artifact may parse correctly and still violate those
boundaries.

1. Before a tracked write, run installed ETHOS status in the intended worktree.
   Follow its verdict, gaps, next action, and continuation; obtain passing
   prewrite admission for the exact paths and current state.
2. Before acceptance, run repository checks and the changed-source plan. Commit
   with the trusted signer and execute full proof against that commit's OID.
   Installed Git-common hooks enforce commit and push admission. Apply the
   [supply boundary](#tool-supply-and-offline-execution) before online publication.
3. Before closure, complete every declared obligation and observe each required
   delivery. A Change may reach `dev` while delivery remains outstanding; do not
   archive that unfinished work.
4. After official archive, inspect the new commit's attribution and signature,
   prove its OID, and verify publication and CI. Only then retire the absorbed
   lane through ETHOS. Earlier-HEAD evidence does not prove this new commit.

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
The installed full host graph owns native test execution and source-quality
observations. Repository checks supply the current document, configuration,
prose, link, and official OpenSpec inputs. Working-edit checks and committed-source
host verification are separate observations; neither grants repository proof,
source acceptance, or publication. The [configuration map](configuration.md) locates current native
inputs without restating common rules.

### Observe the Execution Environment

The source check records path, commit, tree, tracked changes, Node version and
platform, process architecture, `hostname`, and exact workspace-capacity bytes.
Keep native read errors as failures. These observations do not establish VM
identity, host architecture, isolation, or throughput: the runner owner must
verify guest and host separately. A mounted workspace may differ from the guest
root volume.

Host names belong in diagnostic evidence, never portable target configuration.
The [tool-supply boundary](#tool-supply-and-offline-execution) owns tool-selection
evidence.

### Preserve Official OpenSpec Results

Official OpenSpec reports must identify this repository, unique typed items,
complete diagnostics, and consistent native counts for both `--all` categories,
including empty ones. INFO, WARNING, ERROR, or process standard error fails the
strict check without discarding the report. Totals alone do not prove clean
validation; OpenSpec still owns validation and lifecycle.

### Proof and Configuration

The [profile](../../.ethos/profile.toml) declares `docs-integrity` and
`markdown-format` as its two default roots, with their native prerequisites
in the same file. Installed ETHOS compiles their full dependency closure and
owns the schema, execution, resource reservations, and evidence. The integrity
root requires native document-registry, Markdown lint, and behavior prerequisites.
The format root uses the installed native source-format provider and static semantics, not
a repository formatter. The registry
checks document metadata and decision records; the behavior provider requires
one complete native Node test attempt under the declared worker limit and
deadline. Require the full prerequisite closure and document
commands to pass for the exact committed tree; document output or a
repository-authored report cannot substitute for that behavior attempt.

Require applicable static semantics and complete diagnostics from the same
attempt. Syntax may pass despite a reachable undefined identifier, and a Node
report may omit runtime warnings. Accepted native providers may jointly cover a
property; each need not cover every language. A shared-quality claim requires
the accepted installed product and its actual adopter qualification.

Repository checks guard this repository's placement and selection; they do not
copy ETHOS schemas or establish universal enforcement. Test totals, format, and
prose checks do not prove factual accuracy, semantic fidelity, or understanding.

### Source Links and Decision Records

#### Source Link Selection

Git selects tracked and non-ignored candidate source. Resolve every local link
and image under the repository root, rejecting ignored build/cache/history,
private paths, control files, tracked-link escapes, and symlinked directory
routes. Explicit fragments match actual headings. A directory may route to its
native `index.md` or `README.md`; a delivered internal file alias is valid only
when its complete target is selected source. Missing targets and cyclic,
escaping, ignored, or dangling aliases fail; links never adopt untracked private
files. An ignored supplied bundle is a separate explicit verification input.
Use pinned lychee for offline checks and its explicit online operation for
external qualification. Gate failure remains failure regardless of local files.

#### Decision Record Form

Follow the [decision register's form](../decisions/README.md#add-only-a-decision-worth-keeping):
stable IDs, lowercase filenames, matching titles, accepted metadata, and its five
root sections with readable rationale. Keep tasks, code blocks, execution and
acceptance narratives, and release operations with their Change or producing
record. Extra headings, mismatched identities, and HTML in the record body are
invalid.

The `document-registry` prerequisite binds installed ETHOS's registry provider
for structural validation and command inspection. Ordinary rationale, tables,
inline terms, bare paths, and evidence links remain valid; inspection never
executes the input. DDWG has no
second decision parser. Reviewers assess the lasting choice and move execution
and acceptance narratives to their producing record; a structural pass alone
does not establish a sound decision.

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
