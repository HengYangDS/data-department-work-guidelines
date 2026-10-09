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

Change this repository through one official OpenSpec Change and an owned ETHOS
Work Lane. Verify the exact committed source and each publication separately.
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

| Owner                    | Responsibility                                                                       | Limit                                                      |
| ------------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Official OpenSpec Change | Material intent, requirements, design, and progress in `tasks.md`.                   | Does not authorize a write or publication.                 |
| Installed ETHOS          | Changed-path attribution, lane lease, admission, proof, acceptance, and publication. | Acts on current source and policy, not remembered results. |
| Repository checks        | Document quality, reader routes, decision shape, and declared configuration.         | Do not replace OpenSpec lifecycle or ETHOS admission.      |
| Decision record          | Durable rationale and rejected alternatives.                                         | Does not hold tasks, command output, or acceptance logs.   |

The compiled Commitment is transient. A private scope companion, tracked claim
ledger, method-pack plan, or local script supplies no second lifecycle.
Follow the [official artifact rules](../../openspec/config.yaml): specifications
own observable requirements, design owns choices and migration order, and tasks
own actions, completion checks, and checkbox state. Keep results with their
producer; successful parsing alone does not prove artifact conformance.

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
publication plane. GitHub is a complete independent repository, CI/CD, update,
and distribution plane, including when GitLab is unavailable. An outage update
still needs native ETHOS admission, actual GitHub publication, reading back the
ref, and source jobs; configuration or an earlier run proves none of those effects.
GitHub cannot supply a missing GitLab result. Qualified releases remain
available, while every new edition requires [both release-cut checks](#versioned-releases).
Do not raw-push around a native refusal.

Publish only `dev`, `main`, `proposal/*`, and ETHOS-admitted signed release tags.
`candidate/dev` and `work/*` stay local. The
[workspace policy](../../.ethos/workspace.toml) and
[release declaration](../../.ethos/release.toml) own admission without operator
keys or host paths.

Both Forges retain the same signed commit graph, including governed merge
commits. Fast-forward acceptance advances a ref to a descendant; it does not
require a single-parent history. Do not squash or rewrite accepted history to
satisfy one peer's configuration. Keep `dev` and `main` protected, require the
declared source checks and trusted signatures, and forbid force pushes and
deletions. Remote history rules must admit the repository's governed graph;
GitHub's linear-history requirement is incompatible with this contract.

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
`[YANKED]` is valid. Keep neutral version headings and one History row offering
both GitLab and GitHub. The oldest tagged edition may link to its exact tag;
later editions compare adjacent tags. The [release declaration](../../.ethos/release.toml)
owns each Forge's web identity independently of Git transport. Use GitLab
`/-/compare/` or `/-/tags/` and GitHub `/compare/` or `/releases/tag/`, with the
same refs on both peers.

- Keep upcoming notes under `Unreleased` and assign the actual date at release
  cut. One untagged dated heading is allowed only while that exact release-cut
  source is committed and proved before tagging. Do not fabricate a sequence
  from older untagged editions; they remain in Git history.
- Require both Forges' declared source jobs at the exact release-cut commit
  before signing its annotated `vX.Y.Z` tag, which must match committed `VERSION`.
  An earlier proposal or later Changelog edit has a different identity.
- Observe the tag, Release, and asset on each Forge. A heading, branch, or CI
  result is not a release. New commits, including archive commits, require a
  trusted SSH signature and correct attribution; each clone supplies its own
  identity, public signing-key path, and protected external trust anchor.

The default integrity gate and both CI planes reject malformed Changelog
structure, dates, links, version drift, and tag mismatch. Offline checks verify
identity and ancestry. Each provider's authenticated comparison response must
establish its real destination, not a login redirect or another repository's
success. The same Changelog serves both peers and local readers.

## Quality and Local State

`npm run verify` uses one [portable entry](../../tools/docs/cli.mjs): native
formatting, Markdown and Vale, offline lychee, repository boundaries, strict
official OpenSpec, and the standalone regression suite. The
[configuration map](../../.config/README.md) identifies the native owners of
rule selection and spacing;
[Contributing](../../CONTRIBUTING.md#verify-the-source) owns the commands.

### Observe the Execution Environment

The source check reports path, commit, tree, tracked changes, Node version and
platform, process architecture, `hostname`, and exact workspace-capacity
bytes. These are observations, not portable target configuration. A mounted
container workspace is not necessarily the guest root volume; this does not
prove VM identity, host architecture, isolation, or throughput. Native read
errors remain failures. The runner owner verifies the guest and host
separately. The [tool-supply boundary](#tool-supply-and-offline-execution)
owns tool-selection evidence. Retained local diagnostics may contain the
observed host name; it is evidence metadata, never a required target value.

### Preserve Official OpenSpec Results

Official OpenSpec reports must identify this repository, unique typed items,
complete diagnostics, and consistent native counts for both `--all` categories,
including empty ones. INFO, WARNING, ERROR, or process standard error fails the
strict check without discarding the report. Totals alone do not prove clean
validation; OpenSpec still owns validation and lifecycle.

### Proof and Configuration

Only `docs-integrity` and `markdown-format` are default gates and descriptors.
Their document commands and product-owned verifiers must both pass for the
committed tree. ETHOS independently obtains native Node behavior evidence;
repository-authored reports or forwarded command output cannot substitute.

Syntax can pass with a reachable undefined identifier. Node reports can omit
unapproved runtime warnings. Neither permits semantic defects or warnings to be
ignored. Until the formally accepted ETHOS quality integration is installed and
qualified, static semantics, same-attempt warning handling, and every code
subject's applicable obligations remain open. Accepted native scopes may
jointly cover a property; each provider need not cover every language.

Repository checks enforce this repository's placement and selection, not a
copied ETHOS schema or universal enforcement. A shared-quality claim needs the
accepted installed product and actual adopter qualification. Passing format or
prose does not prove factual accuracy, semantic fidelity, or understanding.

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

Decision records keep stable IDs, lowercase filenames, matching titles,
accepted metadata, and exactly five root sections: Context, Decision,
Alternatives Rejected, Consequences and Boundary, Evidence and Revisit.
Readable sections cannot consist only of empty headings, separators, or link
definitions. Native Markdown tokens check nesting and reject code blocks, tasks,
extra headings, mismatched identities, and HTML beyond the leading registry
comment. A non-evaluating shell lexer recognizes supported quoted and compound
invocations without ambient variables. Ordinary rationale, tables, inline terms,
bare paths, and evidence links remain valid. Syntax cannot judge all command
dialects or durable reasoning; reviewers move execution and acceptance narratives
to their Change or producing record.

Retire completed-Change copies only after resolving unique facts, obligations,
and consumers. Bind historical links to the full ancestor commit and exact path,
and verify original bytes. Git retains the history; deletion neither absorbs an
unresolved obligation nor closes this active Change. Official archive and its
new commit's proof and publication remain separate.

## Tool Supply and Offline Execution

Tools serve maintainers and CI; reading the guidelines requires no installation.
The optional bundle supplies quality checks without remote supply, not the
guidelines or ETHOS. ETHOS is a separate installed prerequisite.

`package.json` owns the Node line and exact npm version through native
`devEngines.packageManager`. npm rejects mismatch before `install`, `ci`, and
`run`. Ephemeral CI acquires that npm first. Shell CI uses the existing Mise
owner with the [project configuration](../../.config/supply/mise.toml) and
[native lock](../../.config/supply/mise.lock); every native job command runs
with the selected runtime, without changing host npm or Runner services.
Maintained hosts keep their existing installation owner. Local and offline
checks never upgrade it. Do not use
`--force` or an admission override. Tracked `.gitattributes` keeps LF on every OS.

| Operation            | Supply boundary                                        |
| -------------------- | ------------------------------------------------------ |
| Local verification   | Installed, version-checked tools; no downloads.        |
| GitLab source CI     | Pinned project packages through its own job token.     |
| GitHub source CI     | Pinned official upstream assets.                       |
| Offline installation | Matching source-bound bundle; no replacement download. |

### Select and Verify Native Tools

The [supply manifest](../../.config/supply/native.json) pins archives, raw binary
sizes, extracted executable digests, and upstream notices per platform. The
[bundle record](../../.config/release/offline-bundle.json) binds edition, Node
major, complete package manifest, lockfile, and native supply. The bundle holds
the complete npm cache, declared native assets, and notices; it does not duplicate
npm policy or relicense third-party packages.

Acquisition and installation must verify bytes before extraction or execution.
Resolve PATH names and direct selectors to an actual native file, including
Windows quoting and executable suffixes, before its version command. A matching
version does not admit altered bytes. Package-manager binaries retain their
installation owner's trust boundary; they are not declared byte-equivalent to
release assets.

### Acquire Supplied Assets

Use the [tool acquisition procedure](../../CONTRIBUTING.md#acquire-supplied-assets)
for download, cache publication, and extraction. It preserves the declared
artifact identity, credential boundary, original diagnostics, and the
destination executor's ownership; it grants no use or distribution approval.

### Qualify Each Platform

CI bootstraps Node/npm and acquires the exact asset before offline execution.
That whole job is not network-isolation proof. Qualify cold local use separately
with fresh HOME, no inherited configuration/cache, and denied remote connections.
Run the full graph on every claimed host with actual npm recorded. The manifest
supplies macOS x64, but current CI does not qualify that ABI. On Windows ARM64,
prefer native ARM64 Node. When the manifest has no ARM64 tool asset, use its
declared pinned x64 asset under Windows emulation. Tool compatibility does not
require emulating Node too. Qualify the actual combination and record host,
Node-process, and tool architectures separately. For managed tools, invoke
`node tools/ci/install-native.mjs TOOL --print-spec` with the same Node executable
used for verification. Record its selected asset `key` and digests, not a cache
directory name.
The installation owner supplies provenance for an external executable.
Independently download and hash each Forge asset; a pin or install preview is
not platform acceptance.

### Audit Dependencies and Artifacts

Project-lock scans do not cover bundled Node, npm, native-tool, or ETHOS
components. Audit actual artifact digests, platforms, and component inventories
through native extractors; absent or empty inventories leave coverage unproved.
Keep raw findings and binary-symbol results separately; symbols do not prove
runtime reachability. Failed scanning is not a clean audit.

#### Project-Lock Reports

Both hosted planes retain one complete unfiltered OSV project scan, exact lock
and [native policy](../../.config/checks/dependencies/policy.toml), streams, and
status. The input owner applies the exact approved development finding without
a filtered second scan. Unapproved findings, expiry, changed input, failed or
warning-bearing execution, and malformed/incomplete reports fail qualification.
An approved report still contains a known finding; do not call it clean.
When a finding disappears, is withdrawn, gets an official fix, or its stable
release changes, retire the disposition and qualify the changed inputs again.
Observe public npm stable
through isolated native configuration, fresh cache, and explicit online freshness;
keep its original result with the scan. Source checks contact no advisory
service and cannot renew artifact-use or distribution approval.

### Bound Known Findings

The human approvals have distinct subjects:

| Subject                                                                      | Approved development use                                                  | End of approval                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Locked `braces` 3.0.3, `GHSA-vfj7-8cjw-p6xm`                                 | Trusted repository checks and tool distribution.                          | 2026-10-18 00:00 UTC                                       |
| Exact pinned Node 26 Trixie image                                            | Controlled CI.                                                            | This artifact and use; changes need renewed qualification. |
| Exact Vale 3.24.0, OSV Scanner 2.6.0, npm 12.2.0 group and hash-bound bundle | Trusted local checks, controlled CI, and that bundle's distribution.      | 2026-10-18 00:00 UTC                                       |
| Five pinned Lychee 0.24.2 assets                                             | Trusted local checks, controlled CI, and identical assets in the toolkit. | 2026-10-18 00:00 UTC                                       |

The approved image index is
`sha256:39cff0f037088f0d8faf3e5a3ca055d653a15b66faaba8af3daf72f0102f375f`.
These are not production, arbitrary-untrusted-input, other-finding, or
cross-repository approvals. Each artifact still needs authenticity, complete
bytes, hashes, licenses, actual function, and platform acceptance. Lychee's
source-lock advisories, including maintenance findings and aliases, are not a
complete shipped-binary inventory; retain that limitation and full reports.
Qualify an accepted installed ETHOS subject contract, then retire the existing
compatibility check in the same migration, without a second risk policy or gate.

## Runner and Transport Boundaries

GitHub uses its own hosted platform matrix. GitLab source and offline jobs use
this project's admitted Linux, macOS, and Windows runners and pinned packages,
not a public-download fallback. Qualify each through actual jobs and native
runner/guest observations.

For a frozen pre-release bundle, protected accepted-source qualification selects
the existing offline jobs with a digest-bound temporary package. It is not a
signed Release, authenticated release download, or whole-job network-isolation
proof. Wait for terminal jobs, preserve all results, then retire the exact
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

### Retained Downloads

Keep downloads for the latest qualified release and one qualified rollback,
plus native packages consumed by source or CI. Before retirement, verify exact
identities and consumers. Preserve signed tags, source, original release notes,
and historical evidence; remove withdrawn download links and add a dated notice.
Recheck retained hashes and both Forge inventories. Report reclaimed space only
from provider confirmation. [Contributing](../../CONTRIBUTING.md#retire-superseded-downloads)
owns the procedure.

### Local Evidence and Workspaces

Local `build/`, `node_modules/`, leases, and caches are not repository truth.
Evidence stays with its producer and claim; no root evidence folder is required.
Required failures and job results need a named consumer, exact source binding,
and release condition. Later success does not make them disposable. Transfer
unique evidence to its existing durable owner and verify complete bytes before
retiring its workspace; `build/` is not a permanent archive. Classify active
state, durable evidence, foreign work, and disposable residue, remove only proved
owned residue, then verify exact absence and preserved content.

Observe each selected revision in its actual environment before claiming remote
delivery, ETHOS parity, or team use. Do not stage a human task or recruit a
reviewer just to certify guideline adoption.
