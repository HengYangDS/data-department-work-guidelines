# Design

## Context

This Change begins from edition 6.1.1 at
`c8599ce9c91ed5f988abd6b3f3011ac94430283d`. That source split English checks
across CSpell, textlint, write-good, and local terminology rules. Textlint also
parsed decision content and license sections, so replacing the prose command
alone could not retire it.

The original guideline blob is `ce3d090be258e65534781769e3e2fd5ab7439ef8`. Its
numbered duties, actor and authority boundaries, qualifications, and evidence
limits are the semantic baseline. The prior comparison
([GitLab][baseline-review-gitlab] · [GitHub][baseline-review-github]) is an
index to those clauses, not certification of equivalence.

The complete pre-consolidation design is preserved at
`934293b8a6ab0600af75ea86fbdbdf36c46d1bd9`, path
`openspec/changes/native-document-quality/design.md`
([GitLab][previous-design-gitlab] · [GitHub][previous-design-github]). It
retains dated diagnoses, review boundaries, and rejected approaches. Current
task actions, completion checks, and checkbox state belong only in
[the task checklist](tasks.md). Original execution results, review coverage,
and acceptance evidence stay with their producers; Git history remains
unchanged.

## Goals / Non-Goals

Deliver useful English work guidance without losing an original obligation. Give
each quality concern one native executable owner, each configuration one
semantic owner, and local/offline execution a complete source-bound supply.
Publish coherent signed source and frozen bytes independently on both Forges.
Retire replaced implementations and proved-disposable residue together with
their migrated consumers.

Do not create another lifecycle, private scope, evidence ledger, installer,
retention controller, universal meeting, mobile site, or staged adoption trial.
Credentials, selected models, active services, and foreign lanes are outside the
migration. Local checks cannot certify accepted shared-product behavior,
whole-guidance equivalence, historical execution, or actual team use.

## Decisions

### Preserve the original work contract at seven topic owners

Read the original clause and the complete revised topic before accepting a
rewrite. Compare actor, action, obligation strength, permission, condition,
authority, evidence, escalation, and revisit limit. A shorter sentence fails
review when it removes any of those meanings. Native prose quality and source
hashes do not establish semantic coverage.

Each duty belongs at its point of use. The charter owns authority and hard
boundaries; the other six topics own their task-specific judgments and actions.
The [guidance requirements](specs/guidance-discovery/spec.md) define the full
observable contract, including cadence, data responsibilities, and adverse
cases. The task map routes readers to those owners rather than restating their
rules. This keeps a correction from creating competing policies.

Independent reviews cover fixed source, not a moving summary. Review all
original numbered subsections and surrounding groups, then challenge the revised
duties with concrete adverse cases. Earlier no-finding judgments remain dated
evidence when a later counterexample corrects them. A source-based editorial
crosswalk is not an automated equivalence proof. Keep reviewer coverage and
failed routes with their producing evidence; mark only the corresponding task's
observed completion. Do not invent a committee quorum or another meaning
validator.

### Give native quality concerns one owner

The existing source verifier reports its real repository, commit and tree,
tracked-change state, native runtime, and mounted workspace capacity once. Use
Node's native filesystem and OS interfaces, exact integer byte counts, and the existing
bounded Git executor. Propagate native read errors. This is job-time observation,
not VM identity, isolation, throughput, or a capacity admission threshold; runner
qualification remains with its owner. Add no diagnostic controller or proof gate.

Git supplies tracked and non-ignored candidate source. Directory names do not
waive checks on selected source beneath normally ignored paths; ignored
untracked state remains excluded. Current prose and link selection preserve the
official archived-Change boundary. Formatting and native lint retain their
historical-format controls.

Vale owns spelling, repeated words, selected terminology, and diagnosed concise
or stock-phrase defects. Native policy and vocabulary own selection; the current
caller supplies explicit source, verified binary, and native arguments. Accept
reviewed domain terms and normal inflections narrowly. Keep misspelled
near-matches and real negative examples; no wildcard baseline or inherited
blacklist replaces judgment.

Reject a native prose finding before unrelated Changelog history and official
OpenSpec execution. A known refusal does not need 39 Git starts before it can
return. The successful path still runs every declared check and distinct native
ancestry operation; the existing failure-order regression guards that boundary.
This reduces demonstrated duplicate work on refusal, not the full test scope,
and does not establish the unique cause of a hosted timeout.

The two native style rules carry their own examples. Official Vale coverage must
fail when a loaded rule no longer matches its diagnosed defect. Project-level
tests retain Markdown, configuration, real invocation, and warning controls.
Rule coverage does not establish factual or semantic accuracy.

Markdownlint core reads the single concern-local TOML through its public
configuration API with the existing TOML parser. Native ordinary configuration
objects retain rule options and comment behavior. Git-selected literal filenames
need no CLI2 glob/discovery layer; preserve native filenames, line numbers, rule
IDs, details, duplicate-heading rules, and width checks.

Native Markdown tokens identify actual quality-control comments, DR structure,
and license sections. Reject real Vale and Prettier suppression controls,
including nested or wrapped comments, without rejecting code or explanatory
prose. The shared implementation has one owner; the prose caller does not copy
its parser.

Prettier's public file-information and configuration interfaces select supported
Git source regardless of usual code directories or ambient ignore files.
Unsupported source formats fail explicitly. Prettier owns supported code,
Markdown, JSON, YAML, and quote structure; dprint's format-only TOML Wasm plugin
owns TOML through its public formatter interface. Keep exact locked supply,
syntax/configuration diagnostics, comments, key/array order, and meaningful
multiline bytes. Missing supply cannot fall back to a raw scan.

Use one reader-block separator. Single-paragraph list peers stay tight even when
their text wraps; peers with internally separated paragraphs or blocks use one
consistent gap. Tight nested lists and separate-list boundaries retain their
native meaning. Prettier handles quote separators; Markdownlint and the official
`remark-lint-list-item-spacing` rule handle the remaining structure. Stock MD012
alone cannot enforce quote or list looseness.

Keep the general text owner's English and justified plain-text hygiene. Remove
duplicate raw scans of Markdown, source code, and structured data. Meaningful
blank lines inside fenced/indented examples, strings, scalars, and nested
literals remain data, not padding.

The known-vulnerable Taplo binary is not added. The format-only TOML plugin
requires no installer or host imports; its native Wasm API supplies the complete
original MIT notice. Verify that notice against the locked identity and complete
grant without fabricating a sidecar or claiming general safety.

### Keep configuration with its consumer

`.config/checks/` owns native check policy, `.config/supply/` owns the single
native-tool manifest, and `.config/release/` owns frozen artifact identity.
Executable rules stay at their existing implementation owner. The configuration
README routes readers; it is not another registry or policy.

Keep original images, diagrams, and media in `assets/` when an actual reader or
product uses them. Program-consumed non-code inputs may need `resources/`.
Native settings stay in `.config/`; reproducible renders and bounded local work
stay in ignored `build/` subdirectories. ETHOS's `system/` carries its machine
contracts; adopters do not need to copy it. Create directories for real content
and named consumers, not to complete a template.

Source ownership and package inclusion are separate. A native package may
project selected canonical files into its resource tree while preserving their
source hierarchy and loading contract. That publication closure is not another
source authority or a requirement for a root `resources/` directory. Any
executable resource remains code governed by the supply and execution boundary.
Do not keep a source copy or alias after its canonical owner moves.

ETHOS's resource and asset contract is pending integration. Qualify its accepted
source and installed consumer before moving this repository's supply or bundle
inputs. Update imports, package inclusion, tests, contributor routes, CI, and
offline loading together; verify exact bytes and retire the old paths in the
same migration. Do not copy schemas, add empty scaffolding, keep aliases, or
move obsolete records into a new directory.

Prettier and lychee read native TOML; Markdownlint and dprint receive parsed
values through each tool's public configuration interface. Vale requires INI,
YAML styles, and plain-text
vocabulary. The cold installer reads supply and release
JSON before npm dependencies exist. Keep those native formats rather than
introduce TOML converters, bootstrap parsers, package-embedded policy, ambient
overrides, or parallel records.

Migrate source, tests, commands, contributor guidance, and Change references in
one batch before removing the mixed old directory. Repository placement checks
guard this repository's topology; they do not copy the ETHOS product schema or
add a proof gate.

### Keep decisions durable and executable evidence at its producer

DRs retain stable unique IDs, lowercase filenames, matching titles, accepted
metadata, and exactly five ordered root sections with readable content. Native
tokens reject added/nested headings, code blocks, task markers, and execution
content under any wrapper. Whitespace, thematic breaks, and reference
definitions do not make an empty section meaningful.

Use own properties for command classification so ordinary rationale beginning
with an inherited JavaScript property cannot crash. One pinned non-evaluating
shell lexer supplies quoted words, operators, globs, variables, and comments.
Preserve glob objects as operands and recognize supported literal, variable, and
end-of-options invocation forms. Read no ambient variables and execute no
inspected text.

Bare evidence paths, meaningful links, ordinary interpreter prose, decision
lists/tables, and quoted rationale remain valid. Recognizing supported native
operators does not parse every shell dialect or a complete here-document.
Editorial review still owns durable reasoning and unsupported language cases.

A missing DR sequence number, command change, release, or implementation result
does not require a new decision. The two current records retain their accepted
choices, actual dates, consequences, serious alternatives, and revisit limits.
Move transient readiness and acceptance narration to its Change or producer; do
not soften the decision or add task-report sections.

Current filenames and relation descriptions use the accepted topic name. Moving
DR-0001 to `dr-0001-human-ai-collaboration.md` preserves its stable subject,
numbered identity, decision date, and reasoning; update the current incoming
index link without an old-path alias. A descriptive path is not a second
decision identity.

### Resolve reader routes and links from their native meaning

Use the locked native Markdown compiler and existing HTML parser to inspect
actual GFM anchors. The engine owns reference-definition precedence and Unicode
identity. Code, comments, escaped examples, unused/shadowed definitions,
unlinked images, and unresolved references cannot supply a reader route.

An anchor needs readable text or descriptive linked-image alt text. Whitespace,
invisible format characters, and optional titles alone do not label a route.
Preserve emphasis, legitimate titles, references, character decoding, relative
normalization, and first-definition semantics. Read the first visible topic
paragraph for its cue; preserve one task map and reject repeated actual routes.

Use the official GFM table syntax and HTML extension shared by the native
consumers. CommonMark-only compilation can count links that the Forge table
renderer discards. Preserve escaped pipes and reference links without local cell
splitting. One direct locked engine version and native npm overrides bind
consumers; no second parser or renderer is introduced.

Lychee still owns extraction, existence, fragments, and explicit online checks.
The existing link owner also binds each local target to Git-selected source
within the repository. Check requested and resolved identities so ignored
aliases cannot borrow a tracked target, and tracked aliases cannot borrow
outside files or caches. Preserve source directories, encoded paths, and
delivered internal aliases.

Converted HTML is syntax evidence, not whole-document visual qualification.
Inspect actual task tables and reading routes when their presentation changes;
record the exact surface without claiming universal reader understanding.

### Preserve native execution and complete validation evidence

The official OpenSpec command owns validation and lifecycle. Its consumer checks
the complete native report: actual resolved root, report version, unique typed
item identities, issue arrays, and counts for both categories selected by
`--all`, including empty categories. INFO, WARNING, ERROR, incomplete reports,
totals-only results, standard error, and wrong roots fail while their original
diagnostics remain visible.

Captured Vale reports and lychee extraction select the existing strict
standard-error behavior. Preserve the native result before refusal and stop
dependent link checks; an otherwise valid report cannot hide an unapproved
process warning. Do not change native report formats or rerun tools for cleaner
output.

Before official synchronization, rebuild every changed capability through the
official merge and validator. Resolve all diagnostics, including long
requirement statements, without waivers. Keep concise obligations with their
existing scenarios; do not drop an actor, permission, or counterexample to
meet a size check. An already-removed requirement is not a pending deletion:
retain its original Git evidence and remove the redundant current delta.

The existing process owner retains command identity, native cause, exit status,
signal, standard output, and standard error on creation failure, timeout, or
nonzero exit. Replay piped diagnostics once across capture and strict modes.
Attach a cause only when a native error exists; exit-only refusals keep their
shape. Preserve missing-command/timeout code and path.

Timeout evidence must match the original attempt, including termination before
output. A one-second fixture deadline cannot require fixed progress text that
the child never emitted. Non-timeout cases keep exact expected text; capture
modes, diagnostic counts, deadlines, and single execution remain unchanged.

Native npm admission fixtures resolve the selected CLI once, reuse the existing
isolated npm environment, and retain every child status, signal, native error,
and partial stream before asserting rejection or success. A missing status is
not a native refusal. Keep install, `ci`, run, allowed effects, and their original
deadlines; qualify the hosted Windows journey rather than infer its failure's
cause from an assertion that lost the process result.

Each test establishes its own filesystem prerequisites. Source-link fixtures
create their ignored parent; concurrent-install fixtures model the regular
exclusive-copy target; format/lint fixtures carry the source Git ignore policy.
Native filesystem resolution compares Windows short aliases without waiving
wrong-root rejection or registering dependency junctions as source.

The complete discovered standalone test inventory uses two workers and the
existing outer deadline. Batch only independent native inputs; reject known
source defects before unrelated prerequisites, while valid source still runs the
full graph. Narrow telemetry tests call the real invocation owner rather than
repeat unrelated repository setup. No case or assertion is dropped.

The public prose/integrity regression uses a compact native Git repository,
the actual executable and policy bytes, and positive source with complete local
links. It exercises both commands, ignored and force-tracked source, every
missing anchor, repair, and cleanup without cloning unrelated history or
rechecking the whole document corpus. The full repository verifier separately
checks all actual source. A smaller fixture must not narrow that selection or
replace native Vale, lychee, or Git with a fabricated report.

Native format and lint fixtures likewise keep executable, policy, and dependency
carriers present but outside their temporary Git source inventory. Every explicit
sample, ambient-ignore counterexample, literal, archive input, and force-tracked
source remains selected. Force-track the formatting fixture's observed Markdown
TOML policy so its unchanged-byte assertion still exercises a selected source.
Native Git inventory assertions bind each fixture to its declared inputs.

Each formatting attempt creates one fresh native TOML formatter for file matching
and output. Standalone target discovery retains its native default acquisition;
there is no cross-attempt cache. Native diagnostics, preservation policy, parsed
data comparison, source selection, and process deadlines remain unchanged.

Resolve the complete Changelog reference selection in one native Git
`cat-file --batch-check` call with native line-delimited input and output. The
existing reference grammar excludes control characters, so the default batch
protocol needs no newer Git option or raised runtime minimum. Require one
valid commit observation per selected reference, then keep native
`merge-base --is-ancestor` for every distinct resolved pair and exact tag/HEAD
identity. Missing objects, incomplete output, non-commit types, and native
diagnostics fail. The existing process owner supplies stdin without a shell;
there is no custom ancestry graph, history cache, or relaxed deadline.

### Supply exact tools without a second installation plane

The existing native manifest owns versions, host/ABI assets, sizes, digests,
version output, and original notices for Vale, lychee, and OSV Scanner. Native
raw binaries and archives use that same supply owner. The bundle carries the
complete npm cache, every declared native asset, and upstream notices, bound to
edition, Node major, full package manifest, lock, and native supply.

Supply and host qualification are distinct. The manifest carries macOS x64
assets, but the declared CI matrices do not execute that ABI. Windows ARM64
runner acceptance records the x64 Node process and complete x64 tool graph.

Local installed or locally supplied verification needs no remote service. GitLab
uses its own project registry and CI identity; GitHub uses its independent
declared acquisition route. Refuse missing input or wrong bytes before
extraction/execution rather than fetch a substitute. Do not forward credentials
across redirects or providers.

Each acquisition verifies an exclusively owned temporary output before native
exclusive publication. A concurrent call may reuse a verified target but cannot
overwrite or remove it. Reject linked managed parents, binaries, or archives
before remote access or staging. Respect repository confinement and native
Windows casing; preserve an existing binary's permissions. These checks do not
claim protection against hostile same-user replacement after inspection.

An exclusively published candidate has already passed its pinned supply and native
version checks. Link that complete candidate atomically within its destination
directory; do not expose a partially copied final entry. Preserve its
pre-execution bytes and verify complete equality and the owned POSIX mode after
publication, rather than restart the same binary to
obtain the same version. Independently verify a pre-existing or concurrently
installed target without changing its mode. The actual audit, prose, and link
consumers still execute the installed tool. This reduces redundant startup; it
does not prove historical host-pressure causality or admit skipped checks.

Await native asynchronous cleanup of the installer's own extraction stage,
including bounded native removal retries. Failure still propagates and success
cannot precede cleanup. Cancel an unread rejected response body before HTTP
failure, awaiting native cancellation and retaining a failed cancellation as its
cause. CLI error rendering retains native causes without repeating streams.
Public GitHub download errors retain their native cause. GitLab download errors
intentionally omit credential-bearing transport details.
Keep status, success limits, digests, and concurrent output unchanged;
add no network retry, endpoint fallback, or download abstraction.

Archive extraction retains the executor's ownership through the native
no-same-owner option. Preserve hashes, confinement, notices, permissions, and
strict diagnostics instead of granting a rootless container extra capability.
Exclude/reject host archive attributes. Listing success does not prove
extraction under the actual capability limit.

Only the OpenSpec child's official telemetry option suppresses offline
telemetry/update requests. Remove inherited case variants before setting that
value; preserve parent environment and global settings. Exercise both actual
child selection and the pinned request behavior of the CLI.

Keep one exact native package-manager contract. A historical multi-npm
compatibility scenario cannot compete with current exact admission. Preserve
actual npm observation, install effects, cold execution, and audit boundaries. A
fresh HOME, separate empty user/global npm configuration files, and a clean
environment establish cold execution. Deny remote connections; permit only local
connections required by the real HTTP regression.

This is a qualification environment, not an effect of npm configuration alone.
Hosted jobs install Node/npm and acquire their exact asset before offline
installation; they do not prove network isolation. The builder deliberately
installs locked npm packages online to prime its cache, but never acquires
missing native assets or notices implicitly. Its bounded npm execution uses the
existing native executor so errors, warnings, and partial output remain visible.

### Keep native dependency findings and their disposition distinct

OSV Scanner owns raw findings and native disposition. Preserve an undisposed
scan separately because ignored IDs and aliases disappear from disposition
output, even with `--all-vulns`. Both Forges retain original lock, policy
snapshots, reports, standard streams, and exit statuses on success or failure. A
later clean scan cannot clear an unapproved raw finding.

The sole expressly approved exception is development npm `braces` 3.0.3 in
reviewed checks, expiring on 18 October 2026. It is not a fix, a production
waiver, or authorization for arbitrary inputs. Use only native `IgnoredVulns`
fields. The existing input boundary checks every matching lock path, raw package
identity, and development group; all other findings remain blocking.

Offline scanner fixtures use an undisposed policy and fixed databases. Fixed
admission fixtures select their review time explicitly; they must not expire
with the real policy. Live offline source validation and online audit admission
use the current clock and reject an expired disposition, including revalidation
of released source that retains it. Withdrawal keeps the required native policy
file with `IgnoredVulns = []`; an empty policy grants no ignore. Before expiry,
the repository maintainer qualifies fixed supply or obtains a new explicit
decision through accepted ETHOS risk admission. Do not backdate the real scanner
or silently extend its native expiry.

Changed stable supply, a fix, withdrawn/missing finding, or expiry requires
retirement and qualification. Observe the public registry with separate native
configuration, explicit freshness, and an owned short OS temporary cache. Remove
that cache after the attempt, including failure; preserve reports and
configuration, not package-cache residue. Windows checkouts cannot inherit it.

Replace the temporary repository input guard with the accepted ETHOS risk owner
in the same integration. Do not keep a private schema, duplicate controller,
filtered npm report, or whole-package exemption. This repository's dependency
audit does not qualify the npm executable bundled with Node, shared ETHOS, or
its formal release.

### Keep both publication peers complete and coherent

Local verification/install are independent of either remote. GitLab is the
organization publication plane; GitHub is an independent complete repository and
CI/CD plane. Each must qualify its own source, Release object, downloaded bytes,
and declared offline hosts. One plane's success supplies no result to the other.

GitHub source updates may proceed through native admission and that peer's
actual checks while GitLab is unavailable; qualified releases remain
distributable there. A new edition still requires both release-cut matrices.
Preserve this distinction without narrowing GitHub to a snapshot or inventing
evidence for the unavailable peer.

Keep one Changelog with neutral local version headings and clearly labeled
GitLab/GitHub history links. Native `publication.peers[].forge_repository` owns
web coordinates; do not infer ports from Git transport. Each native route
identifies the same comparison refs or oldest tag. Preserve original notes,
SemVer, dates, annotations, prepared-release, and ancestry checks.

The existing Changelog owner rejects missing, duplicate, unused, mislabeled,
credential-bearing, cross-peer, wrong-repository, and divergent-ref links.
An online link pass does not authenticate a Forge destination. The contributor
route requires each provider's native comparison response at the declared
repository, with the History row's actual base and head identities. It links
the existing four-host GitHub offline workflow rather than copying its matrix
into a new release field. Preserve the intentional HTTP deployment and keep
source bytes identical rather than add host detection, redirects, or
Forge-specific rewrites.

Reusable peer-navigation and repaired-history admission belong in ETHOS. Consume
applicable declared peers and native reference semantics, including shadowed
definitions. Distinguish a missing link from a wrong target and an owner
notification from a correction. A repaired Forge-event baseline needs accepted
native history/publication relations; no hard-coded SHA, HEAD substitution,
private provider, or ancestry waiver supplies acceptance.

### Schedule platform capacity without changing trust

Runnable jobs use symmetric purpose/platform names, with a review qualifier;
hidden native templates own shared source and offline steps. Keep actual runner
capabilities, exact image/native assets, timeouts, source selection, and
commands. Minimal wiring to a declared native command is not a business,
acceptance, installation, or rollback controller.

Restrict GitLab workflow, source, and offline tag routes to the shared release
`v*` tag family, excluding slash-containing tags, before tool supply. A matching
prefix still needs native signed SemVer admission. Keep project locking, tagged-only
scheduling, protected dev/main/tags, and separate review/protected identities,
accounts, workspaces, caches, and credential reachability.

Use one project-scoped GitLab resource group for Windows review,
protected-source, and offline jobs. Its identity cannot vary with ref or event.
It reserves capacity without granting trust or cross-project isolation. Preserve
full discovery, two workers, and existing deadlines. Original overlap and
saturation evidence remain valid limits when later isolated attempts pass.

Registration, polling, clone, and package traffic are separate authentication
and transport boundaries. HTTP-only GitLab's bounded risk decision does not make
a registration tunnel protect every other path. Infrastructure owners keep
runner/service changes and their failed cutovers/rollback evidence.

### Retire replaced source and downloads only after absorption

Migrate prose, decision, and license consumers before removing textlint, CSpell,
write-good, their unused graph, old policy, imports, adapters, commands, and
test interfaces. Remove CLI2 after its core consumers migrate. No optional
retired checker, compatibility parser, alternate selector, or second installer
remains. Verify the resolved graph as well as current source references.

Completed-Change copies may leave the current tree after unique-fact,
obligation, and incoming-consumer review. Preserve original Git objects, signed
tags, release notes, proof, and recovery. The reviewed ancestor archive tree
`cda4b105165ab3a788848f74a58004cbc863edd2` stays at
`c8599ce9c91ed5f988abd6b3f3011ac94430283d`; cited designs use full commit/path
links on both Forges. Returned bytes must match the original objects.

Historical records can describe differing wrapper/lifecycle ordering,
digest-edited representations, or package-manager choices. They do not establish
current rules, corruption, or independently verified historical execution.
Preserve their original bytes and identify any separately edited representation
at its producer. Do not restore retired scope, browser, shell, or
package-manager policy from them.

Tests create their own official archive fixture rather than borrow a completed
real Change. Keep future archive-path format/spacing/lint controls. Review,
recovery, and consumer migration precede deletion; no compatibility route,
history catalog, or second evidence store is needed.

Retain the latest qualified downloadable edition, one qualified rollback, and
tool packages still consumed by retained source or CI. Inventory exact native
IDs, names, bytes, digests, links, active jobs, and consumers before choosing
deletion/preservation sets. Unknown or still-used assets remain.

Retire exact assets/packages through their native Forge owner. Preserve signed
source, original note prefixes, and historical acceptance; append a dated
withdrawal and remove obsolete download links. Verify exact absence, retained
hashes, and both provider inventories. Report reclaimed remote storage only when
provider statistics confirm it. Clean owned scratch in each completed batch;
failed evidence and rollback are not disposable residue.

### Integrate accepted shared ownership without weakening the floor

Keep `docs-integrity` and `markdown-format` as the only default gates and profile
descriptors. The
accepted product graph must connect document checks to the actual native
behavior prerequisite and map static/behavior axes to their real owners.
Product-native prerequisites belong to ETHOS's own dependency closure, not
additional profile descriptors or evidence forwarded through a document command.

Consume the formally accepted schema, not prototype fields or a source-only
probe. Migrate profile, repository validator, tests, and guidance together.
Remove superseded stream-report assumptions, local format
glue, risk guards, and history identity implementations only after their
consumers use the accepted product owner.

Required native semantics, same-attempt diagnostics, complete test selection,
single execution, and subject applicability must be exercised. Syntax success
does not establish JavaScript semantics; selected Node reports can omit
unapproved runtime warnings. Product-defined scopes may jointly cover a
property, so every provider need not cover every language.

Missing/disconnected prerequisites, authored evidence, repeated execution,
unapproved warnings, report overrides, equivalent warning suppression, and
unexercised required subjects must block accepted proof. The product owns graph
validation and diagnostic interpretation; the adopter adds no copied linter,
provider, graph, or lifecycle.

Shared task-authoring diagnostics use the selected official OpenSpec template
and native Markdown structure. The official parser owns task selection and
completion; ETHOS checks the active artifact's conformance through its existing
document-quality and command plane. A successfully parsed checklist must not hide
untracked progress prose or copied results, whether outside a task or indented
beneath it. Verification commands, meaningful links, and wrapped action text
must remain valid. Keep original results at their producer and do not add
a private task schema, local duplicate validator, or default proof gate.
Qualify this shared contract in the same accepted integration before treating
guidance or an official parse as enforced admission.

The affected adopters are this repository (DDWG), AIGW CLI (AI client account
and route management), and Codex Responses Proxy (the local Responses
compatibility data plane). Qualify them against the same accepted product
source and wheel, with each actual installed binding, owned source, exact-HEAD
plan/proof, and acceptance. Version text, another repository's mixed-language
success, or a different source-admission selector cannot substitute. Keep
useful independent work moving while those integration obligations remain open.

This joint qualification is an explicit delivery requirement, not a transfer of
repository ownership. It verifies one shared successor instead of accepting
three divergent implementations. Each adopter's own Change, Work Lane, task
ledger, installer, and acceptance evidence retain authority. This Change records
DDWG integration and consumes the shared product's actual AIGW and Proxy
qualification evidence; it does not track their broader product work or
authorize writes in foreign lanes.

## Risks / Trade-offs

Native delegation reduces duplicate code but does not prove that a consumer
selects the right inputs, preserves diagnostics, or retires its predecessor.
Keep representative journeys through the actual public owner and focused
regressions for diagnosed gaps. Avoid accumulating prohibitions or fixtures that
merely restate native schemas.

Offline and cross-platform acceptance cost more than local syntax checks. Freeze
source and one bundle before the full matrix; compare actual build inputs when a
progress-only commit changes HEAD. Refresh exact-HEAD governance separately
without changing a published tag or replacing its bytes.

Editorial review protects meaning but cannot mechanically certify the complete
work contract or observed adoption. Preserve dissent, failed routes, and the
limits of each supplied snapshot. Tool coverage, a majority, a polished table,
or a shorter document does not resolve those limits.

Existing finite product gaps remain dependencies, not permission to weaken
admission or stop independent work. An authorized emergency exception is bounded
to its authorized effect with preserved cause and immediate
restoration/acceptance; it cannot patch immutable runtime bytes or manufacture a
clean proof.

The weekly sample-calibration default is a compatible addition to the published
monthly mechanism review, not literal equivalence with the original schedule.
It requires a minor release. Restoring original duties and clarifying their
wording remain fixes; existing accepted releases are not rewritten.

## Migration Plan

1. Reproduce the diagnosed gap at its existing owner, preserve native failure,
   and establish a distinguishing regression.
2. Repair owner, tests, guidance, and current references together; migrate
   consumers before retiring duplicate implementation or configuration.
3. Review the full original-duty and reading boundary; preserve every task ID
   and commitment while consolidating existing artifacts.
4. Integrate formally accepted shared quality, formatting, risk, and history
   contracts. Qualify DDWG, AIGW, and Proxy at their actual installed bindings.
5. Freeze one compatible final source and bundle. Run local checks, cold
   verification, trusted signature, exact-HEAD proof, both source/offline
   matrices, independent Releases/download hashes, and every declared offline
   host.
6. Complete the final requirement/evidence audit and official spec sync. Retire
   earlier absorbed resources and exact disposable duplicates after their
   consumer/hash/native-inventory checks. Confirm archive prerequisites without
   checking off its future Git effects.
7. Archive through the official owner, inspect/sign/prove/publish the new OID,
   observe both source matrices, and natively retire this Change's Work Lane,
   any remaining proposal ref, and exact disposable residue from those
   operations.

Proposal refs are disposable publication projections. Once source is accepted on
both peers and its declared jobs pass, retire the absorbed ref through native
CAS; later work may recreate it. The active Work Lane and Change remain until
their obligations close. Ref retirement neither archives a Change nor proves
shared-product acceptance.

The official archive requires completed prerequisite tasks; evidence of its own
future commit cannot be an earlier checkbox. Those subsequent effects remain
post-archive acceptance observed through their native owners. Do not add a
second ledger, reuse old-HEAD proof, falsely close tasks, or declare the Goal
complete before publication and retirement are verified.

## Open Questions

No unresolved choice requires user input. Accepted shared-product distribution
and its authoritative adopter schema remain integration prerequisites, not
assumed implementations or reasons to archive incomplete work.

[baseline-review-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-30-work-guidance-completeness/design.md
[baseline-review-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-30-work-guidance-completeness/design.md
[previous-design-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/934293b8a6ab0600af75ea86fbdbdf36c46d1bd9/openspec/changes/native-document-quality/design.md
[previous-design-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/934293b8a6ab0600af75ea86fbdbdf36c46d1bd9/openspec/changes/native-document-quality/design.md
