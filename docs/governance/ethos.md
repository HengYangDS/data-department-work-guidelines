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

Use one official OpenSpec Change and an owned ETHOS Work Lane to change this
repository. Verify the committed source, then verify each publication
separately. For department work, start at the [task map](../README.md).

| Your task                                  | Read next                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| Edit or accept a change                    | [Change authority](#change-authority)                                   |
| Publish an edition                         | [Versioned releases](#versioned-releases)                               |
| Check source or investigate a failed check | [Quality and local state](#quality-and-local-state)                     |
| Install tools without remote supply        | [Tool supply and offline execution](#tool-supply-and-offline-execution) |
| Admit or operate a CI runner               | [Runner and transport boundaries](#runner-and-transport-boundaries)     |

The [contributor route](../../CONTRIBUTING.md) owns executable setup and release
procedures. This page defines their authority and acceptance boundaries.

## Change Authority

| Owner                    | Responsibility                                                                                  | Limit                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Official OpenSpec Change | Material intent, specifications, design, and progress in `tasks.md`.                            | Does not grant write or publication permission.                         |
| Installed ETHOS          | Changed-path attribution, Work Lane lease, write admission, proof, acceptance, and publication. | Acts on current source, ownership, and policy, not a remembered result. |
| Repository checks        | Document quality, decision shape, reader routes, and declared configuration.                    | Cannot replace OpenSpec lifecycle or ETHOS admission.                   |
| Decision record          | Durable rationale and rejected alternatives.                                                    | Cannot hold task progress, command output, or acceptance logs.          |

The compiled Commitment is transient. No private `scope.toml`, tracked claim
ledger, method-pack plan, or local script supplies a second lifecycle.

1. **Before writing:** Run the installed ETHOS status command in the intended
   worktree. Follow its verdict, gaps, next action, and continuation. Obtain
   passing prewrite admission for the exact paths and current state.
2. **Before acceptance:** Run the repository checks and changed-source plan.
   Commit with the trusted signer, then execute full proof against that exact
   commit's OID. Installed Git-common hooks enforce commit and push admission;
   tracked copies or raw Git operations cannot substitute for them.
3. **Before closure:** Complete every declared task and observe each required
   delivery. A Change may reach `dev` with delivery still outstanding. Archive
   officially only when its obligations are met.
4. **After archive:** Inspect the new commit's attribution and signature,
   refresh proof, and verify its publication and CI. Earlier-HEAD evidence does
   not prove the archive commit. Retire the owned lane through ETHOS after its
   work is absorbed.

## Source, Two Forges, and Actual Use

| Plane         | Required observation                                          | It does not establish alone          |
| ------------- | ------------------------------------------------------------- | ------------------------------------ |
| Local source  | Change attribution, checks, exact-HEAD proof, and acceptance. | Delivery to either Forge.            |
| GitLab        | Its exact ref, hosted jobs, Release, and asset.               | GitHub delivery or team use.         |
| GitHub        | Its independent ref, hosted jobs, Release, and asset.         | GitLab delivery or team use.         |
| Ordinary work | Observed use with subject, source, time, and limits.          | Repository or publication integrity. |

Local verification contacts neither Forge. GitLab is the organization's primary
publication plane; GitHub is a complete independent repository and CI/CD plane,
including alternative distribution when GitLab is unavailable. To claim that
fallback, observe ETHOS publishing the selected object to GitHub during the
unavailability and verify the exact remote ref. Configuration or an older green
run does not establish it. Do not raw-push around a native refusal.

Only `dev`, `main`, and `proposal/*` may publish. `candidate/dev` and `work/*`
remain local. The [workspace policy](../../.ethos/workspace.toml) and
[release declaration](../../.ethos/release.toml) define branch and tag admission
without embedding a host path or operator key.

## Versioned Releases

[`VERSION`](../../VERSION) owns the intended edition; the
[charter](../charter.md) displays it. The private npm manifest carries no second
release version. Compatibility covers normative duties, stable member and Agent
routes, and documented contributor commands.

| Change to that public surface      | SemVer increment |
| ---------------------------------- | ---------------- |
| Incompatible behavior or route     | Major            |
| Compatible addition or deprecation | Minor            |
| Compatible correction              | Patch            |

Apply [SemVer 2.0.0](https://semver.org/spec/v2.0.0.html) to meaning and
migration in the official Change. A parser or commit label cannot decide
compatibility. [`CHANGELOG.md`](../../CHANGELOG.md) follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).

- Keep upcoming notes under `Unreleased`; assign their actual date at the
  release cut. One untagged dated heading is allowed only while that release-cut
  source is committed and proved before its tag exists. Older untagged editions
  remain in Git history, not a fabricated release sequence.
- Require both Forges' declared source jobs to pass at the exact release-cut
  commit before signing its tag. An earlier proposal or a later Changelog edit
  has a different identity and needs its own checks.
- ETHOS admits a signed annotated `vX.Y.Z` tag matching committed `VERSION`.
  Observe the tag, Release, and asset on each Forge. A heading, branch, or CI
  result alone is not a versioned release.
- New commits, including archive commits, require trusted SSH signatures. Each
  clone supplies its own author, committer, public signing-key path, and
  protected external trust anchor. Inspect attribution and signature before
  acceptance; keep these host-specific values outside source.

The default integrity gate and both CI planes reject malformed changelog
headings, categories, dates, links, version drift, and tag mismatch.
One unchanged Changelog serves both Forges and local readers. Version headings
stay in the document; each section explicitly offers GitLab and GitHub history.
Both links must identify the same refs at their declared repository identities.
The release declaration owns those web coordinates independently of Git
transport. Offline validation checks identity and ancestry; each provider's
authenticated comparison response establishes its actual private destination,
not a login redirect or another Forge's success.

## Quality and Local State

`npm run verify` uses one [portable source entry](../../tools/docs/cli.mjs).

| Concern               | Check                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Format and layout     | Prettier for Markdown, code, JSON, and YAML; TOML syntax; English text and one blank line between blocks. |
| Reader text           | Markdown lint and native Vale spelling, prose, and terminology.                                           |
| References            | Version-checked offline lychee links and fragments, plus source ownership and confinement.                |
| Repository boundaries | Metadata, decision shape, navigation, configuration, version identity, and CI topology.                   |
| Change artifacts      | Strict official OpenSpec validation.                                                                      |
| Failure behavior      | Negative tests, run once by the standalone verifier.                                                      |

The official OpenSpec result must name this repository, include unique typed
items and complete diagnostics, and report consistent native counts for both
categories selected by `--all`, including empty categories. INFO, WARNING, and
ERROR findings remain visible and fail the strict source check; process standard
error also fails without discarding the accompanying report. Successful totals
alone do not establish clean validation. OpenSpec still owns validation and
lifecycle.

### Proof and Configuration

The profile has exactly two default gates: `docs-integrity` and
`markdown-format`. Their repository-relative commands retain separate behavior
and formatting responsibilities. ETHOS independently obtains native Node test
evidence through its behavior provider. The currently installed static provider
checks JavaScript syntax; it can miss a reachable undefined identifier whose
syntax is valid. A passing syntax check therefore does not establish semantic
correctness. Native Node tests can also emit an unapproved warning that is absent
from the selected test and coverage reports, allowing the installed provider to
pass without settling it. These are limits of the current proof mechanism, not
permission to ignore semantic defects or warnings.

Each of the two gates requires both its document command and product-owned
verifier to pass for the committed tree. That result alone does not complete the
shared quality obligation: the accepted installed ETHOS contract must establish
static semantics, unapproved-warning handling, and each code subject's applicable
obligations. Different native scopes may jointly cover a property when that
contract permits it; not every provider must cover every language.
Repository-authored reports or command output cannot supply the missing native
evidence. Proof does not create a second lifecycle.

Native Markdown rules own reader spacing and preserve meaningful blank lines
inside fenced and indented code, including nested examples. The general text
consumer retains English checks and non-Markdown spacing; it does not scan
Markdown a second time for raw blank lines. Literal code cannot hide padding
outside its own block.

The existing test suite runs Vale's official coverage for cases embedded in the
two native style rules. A rule that loads but no longer matches its diagnosed
defect fails; real-document tests still check configuration, reader syntax, and
the public commands. This does not establish factual or semantic accuracy.

The [configuration map](../../.config/README.md) separates check policy, native
supply, and artifact identity. Consumers read their native formats; the
repository check enforces only this repository's placement and selection. It
does not copy ETHOS product configuration or prove universal enforcement. A
shared-quality claim requires the formally accepted installed product and actual
adopter verification.

### Source Links and Decision Records

Local links must name tracked or non-ignored candidate source. Directory routes
must contain source; delivered aliases must also resolve to source inside the
repository. Ignored caches, Git metadata, and undelivered aliases cannot satisfy
the boundary. Native lychee still checks target existence and fragments.

Navigation follows actual Markdown links and the first reference definition.
Code examples, comments, unlinked images, and anchors with no readable label
do not supply a task route. Whitespace and invisible formatting characters
alone are not labels. Formatted link text and descriptive linked-image alt
text remain valid, as do titles, references, and normalized local paths. A
topic's use cue appears in its visible opening, not merely in a hidden example.

Git source selection precedes current Markdown checks. A normally ignored
directory cannot exempt an already tracked file from prose or links. Ignored
untracked state stays excluded; official archived Changes retain their
historical scope.

Formatting uses the same Git inventory and native Prettier parser detection,
without narrowing code by directory or extension. Ambient ignore files cannot
exempt selected source; unsupported native formats retain their own checks.

The [decision register](../decisions/README.md) owns the record format. The
locked Markdown parser checks actual headings, unique stable IDs, and readable
sections, including quote and list nesting. Code blocks, task markers, extra
headings, mismatched titles, and raw HTML beyond the leading registry comment
fail. Empty headings, thematic breaks, and reference definitions alone do not
constitute a section. A non-evaluating shell lexer checks quoted and compound
invocations without reading ambient variables. Ordinary rationale, tables,
inline terms, bare paths, and evidence links remain valid.

This syntax check cannot recognize every command dialect or judge whether prose
is durable. Reviewers move task and acceptance narratives to their producing
Change or native record; executable examples are linked there, not embedded in a
DR.

Completed Changes remain recoverable in Git rather than forming a permanent
current-tree history library. Before retiring a copy, review its unique facts,
obligations and consumers, migrate references to the full ancestor commit and
exact historical path, and verify the original bytes. Do not retire an
unresolved obligation as absorbed. This new deletion commit leaves historical
Git objects and proof unchanged; it neither closes the active Change nor
replaces official archival and its subsequent proof and publication.

## Tool Supply and Offline Execution

[`package.json`](../../package.json) declares the Node line and the sole exact
npm version through native `devEngines.packageManager`. npm rejects a mismatch
before installation and repository scripts. Ephemeral CI acquires that declared
npm first; maintained host accounts use their existing installation owner. Local
and offline checks never update it. `--force` and admission overrides are
unsupported. Git's native `.gitattributes` keeps tracked text at LF on every OS.

| Operation            | Supply boundary                                                  |
| -------------------- | ---------------------------------------------------------------- |
| Local verification   | Uses version-checked installed tools; downloads nothing.         |
| GitLab source CI     | Uses this project's pinned package assets and its own job token. |
| GitHub source CI     | Uses pinned official upstream assets.                            |
| Offline installation | Uses the source-bound bundle and no replacement download.        |

The [supply manifest](../../.config/supply/native.json) pins Vale and lychee
archives by platform and SHA-256. Explicit CI download and a supplied `--asset`
archive are different operations. Verify digests before extraction.

The [bundle record](../../.config/release/offline-bundle.json) binds edition,
Node major, complete package manifest, lockfile, and native supply. The bundle
contains the complete npm cache, every declared native archive, and upstream
notices. It does not duplicate npm's version policy or impersonate ETHOS.

For offline qualification, install and run the full graph without remote supply
on every claimed host; exercise and record its actual npm version. Download each
Forge's asset independently and compare its SHA-256. A bundle on disk, an
install dry-run, or another platform's success is insufficient.

GitHub release acquisition uses Node's native HTTP client at the exact
repository, tag, and filename, without `gh` or a token. GitLab uses its
project-scoped CI identity and refuses redirects before forwarding it. Both
paths bound time and size and check the source-pinned digest before extraction.
Each download is verified in its own temporary directory before exclusive
publication. A concurrent call can reuse a verified target but cannot overwrite
or remove it. Cleanup touches only the calling operation's temporary stage.
Managed binary caches, bundle downloads, and their repository-local parents
must be regular files and directories, with no symbolic links. Reject linked
download parents before contacting either Forge or staging bytes outside the
repository. Reusing an installed binary does not
change its permissions. The verifier disables OpenSpec telemetry and update
requests through the official environment option for that child process; the
user's global settings remain unchanged.
Archives exclude host extended attributes; inspection and extraction reject
warning output even on a zero exit status.

Bundled packages, Vale, and lychee keep their upstream notices; this
repository's MIT license does not relicense them. Both hosted planes audit
locked repository dependencies for moderate-or-higher advisories during online
supply. That audit does not qualify the npm executable bundled with Node. Local
source verification remains independent of the network.

## Runner and Transport Boundaries

GitHub declares Linux, macOS, and Windows hosted execution. GitLab declares
project-locked Linux ARM64 container, macOS ARM64 shell, and Windows ARM64 shell
capabilities for source and post-publication offline verification. Every
runnable job names its phase and platform; review adds `:review`. Common steps
stay in hidden native templates. Both source-event routes accept only `v*`
release tags. GitLab applies that boundary to workflow, source, and offline
rules before tool supply; native release checks still require a valid signed
SemVer identity.

### Review and Protected Execution

- Proposal and merge-request jobs use review runners. Protected `dev`, `main`,
  and release jobs use separate trusted runners. Identities, accounts,
  workspaces, caches, and credential reachability must not cross that boundary.
  A container or a different tag on the same runner does not provide separation.
- Require project locking and tagged-only scheduling on every GitLab runner;
  trusted runners also require native `ref_protected` access. Keep `dev`,
  `main`, and `v*` protected. A proposal can request any YAML tag, so native ref
  restrictions must refuse its access to trusted runners.
- Once a proposal has an open merge request, use the merge-request pipeline
  instead of a duplicate branch-push pipeline.
- Before Linux runner admission, verify the exact OCI digest declared by CI is
  allowed and cached. Native hosts require the declared Node line and exact
  macOS or Windows tool archives in this project's registry; no GitHub fallback
  is admitted. On Windows ARM64, x64 emulation is functional evidence, not proof
  of a native x86_64 host.
- Offline jobs begin at the exact signed tag only after the package and Release
  exist. Tag-push source checks cannot qualify an asset published afterward.

### Credential-Bearing Paths

Observe registration and polling, repository clone, and `CI_JOB_TOKEN` package
requests separately. On HTTP-only GitLab, a registration tunnel does not protect
clone or package traffic. Each unencrypted path needs an authorized, bounded
risk decision for the isolated network. A YAML tag does not prove registration
or isolation; an image tag, workflow declaration, or older green run does not
prove current hosted execution.

## Evidence and Retirement

Keep remote distribution assets for the latest qualified release and one
qualified rollback, plus tool packages still required by their source or CI.
Retire superseded downloads only after checking exact identities and consumers.
Preserve signed tags, source, original release notes, and historical evidence;
remove withdrawn download links and add a dated notice. Recheck retained hashes
and each Forge's inventory. Report reclaimed space only after the provider
confirms it. The [contributor route](../../CONTRIBUTING.md) owns this aftercare.

`build/`, `node_modules/`, leases, and caches are local state, not repository
truth. Evidence stays with its producer and claim; no root evidence folder is
required. Classify active state, durable evidence, foreign work, and disposable
residue before cleanup. Remove only proved-disposable owned resources, then
verify their absence and the preservation of what must remain.

Observe each selected revision in its actual environment before reporting remote
delivery, ETHOS parity, or team use. Do not stage a team task or recruit a
reviewer merely to certify guideline adoption.
