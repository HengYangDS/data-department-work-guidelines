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
execution and acceptance belong only in [the task ledger](tasks.md); original
Git and producer evidence remain unchanged.

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

The seven topics retain these responsibilities:

| Owner                  | Duties that must remain explicit                                                                                                                                                             | Failure the wording must exclude                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Charter                | Original authority order; lawful and contractual limits; hard risks including unverified citations; correction of an actual breach; risk-scaled acceptance.                                  | Fluent work, reversible overwrite, or effort is treated as permission or proof.                                                  |
| Analysis               | Stable concepts and decision constraints; evidence confidence and limits; next verification; comparable options; decision owner, actual date, and basis.                                     | A deadline replaces a decision date, a concept changes silently, or a first implementation action substitutes for verification.  |
| Delivery               | Owner, resources, costs, dependencies, milestones, and checkpoints; material scope/risk changes and their resolution; current claim-matched results; capture before completion.              | A local metric, partial excerpt, or planned check is reported as accepted delivery.                                              |
| Data                   | Sample-selection bias; historical availability; missingness, delay, conflict, and anomaly impact; professional ownership; working governance controls; actual acceptance.                    | Deployability or written criteria replace accountable production, review, or acceptance.                                         |
| Communication          | Declared purpose and audience; focused meetings; decision and action owners, deadlines, and completion conditions; escalation; objective expression; title status.                           | A slogan, transcript, maturity-free title, or unowned delay replaces a bounded decision.                                         |
| Human–AI collaboration | Precise delegated output, destination, audience, and detail; reasonable assumptions when context is not blocking; complete current result inspection; explicit stops; risk-based acceptance. | Standing authorization establishes an unknown responsible person, or known-owner unfinished work is edited without coordination. |
| Evolution              | Joint task-start coaching; member judgment; immediate correction; reusable prevention; shared evidence calibration; capability and conjunctive net-benefit review.                           | Repeated individual rescue, personal ranking, or a local score replaces improvement of the working mechanism.                    |

Preserve every surrounding original duty, not only the examples in this table.
The task lead retains goal, boundary, risk, final judgment, and result when
another person holds decision authority. Project-rule conflicts require
resolution; the actor cannot dismiss them as immaterial. An Agent may implement
and verify within delegated scope but cannot grant high-risk approval.

Keep all member result checks, action-authority order, score-label limits,
honest-problem disclosure protection, data/derivation provenance, and the
charter-table prohibition. Work of unknown ownership, another person's
unrecognized or unfinished work, unknown task responsibility, unknown fact
sources, authority gaps, and material irreversible risks remain distinct stops.
Nonessential presentation preferences do not suspend otherwise authorized work.

Management cadence retains its purpose without a universal weekly meeting: joint
task-start calibration, immediate signal-based correction, monthly manager
review with shared evidence calibration, and quarterly net-benefit and
capability review. The monthly loop does not rank individuals; a single metric
does not measure overall personal worth, work, or system value. Excellence still
requires transferable method, lower complexity, and stronger capability in
others together.

Reusable prevention is required when an issue recurs, affects different people
or projects, spans work cycles, depends on tacit knowledge, creates material
forgetting risk, or invites repeated Agent execution. These are independent
triggers. Coaching must preserve the member's judgment; management must not
normalize recurring personal rescue. Correct a disproved position immediately,
including an already-published claim.

A work record is the existing ticket, review, discussion, or project document
that holds the decision and evidence. It does not require a new form or file.
Publication means delivery to the agreed destination. Keep product-specific
governance terms out of member task guidance where ordinary work language
expresses the same boundary.

Independent reviews cover fixed source, not a moving summary. Review all
original numbered subsections, then challenge the revised duties with concrete
adverse cases. Earlier no-finding judgments remain dated evidence when a later
counterexample corrects them. A source-based editorial crosswalk is not an
automated equivalence proof. Record actual reviewer coverage and failed routes
in tasks, without inventing a committee quorum or another meaning validator.

### Give native quality concerns one owner

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
CommonMark list-spacing rule handle the remaining structure. Stock MD012 alone
cannot enforce quote or list looseness.

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

Prettier, Markdownlint, and lychee consume native TOML. Vale requires INI, YAML
styles, and plain-text vocabulary. The cold installer reads supply and release
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

The existing process owner retains command identity, native cause, exit status,
signal, standard output, and standard error on creation failure, timeout, or
nonzero exit. Replay piped diagnostics once across capture and strict modes.
Attach a cause only when a native error exists; exit-only refusals keep their
shape. Preserve missing-command/timeout code and path.

Timeout evidence must match the original attempt, including termination before
output. A one-second fixture deadline cannot require fixed progress text that
the child never emitted. Non-timeout cases keep exact expected text; capture
modes, diagnostic counts, deadlines, and single execution remain unchanged.

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

### Supply exact tools without a second installation plane

The existing native manifest owns versions, host/ABI assets, sizes, digests,
version output, and original notices for Vale, lychee, and OSV Scanner. Native
raw binaries and archives use that same supply owner. The bundle carries the
complete npm cache, every declared native asset, and upstream notices, bound to
edition, Node major, full package manifest, lock, and native supply.

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

Await native asynchronous cleanup of the installer's own extraction stage,
including bounded native removal retries. Failure still propagates and success
cannot precede cleanup. Cancel an unread rejected response body before HTTP
failure, awaiting native cancellation and retaining a failed cancellation as its
cause. Keep status, success limits, digests, and concurrent output unchanged;
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

Keep one Changelog with neutral local version headings and clearly labeled
GitLab/GitHub history links. Native `publication.peers[].forge_repository` owns
web coordinates; do not infer ports from Git transport. Each native route
identifies the same comparison refs or oldest tag. Preserve original notes,
SemVer, dates, annotations, prepared-release, and ancestry checks.

The existing Changelog owner rejects missing, duplicate, unused, mislabeled,
credential-bearing, cross-peer, wrong-repository, and divergent-ref links.
Private GitLab qualification needs its authenticated native destination, not a
login redirect. Preserve the intentional HTTP deployment and keep source bytes
identical rather than add host detection, redirects, or Forge-specific rewrites.

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

Restrict GitLab workflow, source, and offline tag routes to the GitHub `v*`
family, excluding slash-containing tags, before tool supply. A matching prefix
still needs native signed SemVer admission. Keep project locking, tagged-only
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

Keep `docs-integrity` and `markdown-format` as the only default gates. The
accepted product graph must connect document checks to the actual native
behavior prerequisite and map static/behavior axes to their real owners.
Supporting descriptors belong to that dependency closure; they are not extra
default gates or evidence forwarded through a document command.

Consume the formally accepted schema, not prototype fields or a source-only
probe. Migrate profile, repository validator, tests, and guidance together.
Remove superseded descriptor counts, stream-report assumptions, local format
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

Qualify DDWG, AIGW, and Proxy against the same accepted product source and
wheel, with each actual installed binding, owned source, exact-HEAD plan/proof,
and acceptance. Version text, another repository's mixed-language success, or a
different source-admission selector cannot substitute. Keep useful independent
work moving while those integration obligations remain open.

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
   verification, trusted signature, exact-HEAD proof, both source/offline matrices,
   independent Releases/download hashes, and every declared offline host.
6. Complete the final requirement/evidence audit and official spec sync. Retire
   earlier absorbed resources and exact disposable duplicates after their
   consumer/hash/native-inventory checks. Confirm archive prerequisites without
   checking off its future Git effects.
7. Archive through the official owner, inspect/sign/prove/publish the new OID,
   observe both source matrices, and natively retire this Change's own
   lane/proposal and exact disposable residue created by those operations.

The official archive requires completed prerequisite tasks; evidence of its own
future commit cannot be an earlier checkbox. Those subsequent effects remain
Goal acceptance and must be observed through their native owners. Do not add a
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
