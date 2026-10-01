# Design

## Context

At Change opening, the accepted source was
`c8599ce9c91ed5f988abd6b3f3011ac94430283d`, edition 6.1.1. Its seven task topics
had an original-content comparison, not a certification of complete equivalence.
That source composed CSpell, textlint kernel, a custom write-good source
adapter, and separate terminology and stop-word rules. The textlint Markdown
processor also supplied DR parsing and the offline bundle's README license
reader. Replacing only the English checker would leave two executable consumers;
deleting packages before migrating them would break both boundaries.

Native Vale 3.23.0 rejects real spelling, repetition, term, and wordy-phrase
examples in paragraphs, emphasis, quotes, and tables. It preserves uncertainty,
inline code, fenced code, and URL destinations. The initial current-source probe
finds technical vocabulary omissions, not established writing defects. Those
terms require review before acceptance; no wildcard baseline is admitted.

The repository's official OpenSpec dependency is refreshed to stable 1.14.0,
released on 2026-09-30. Its stricter metadata handling and unchanged spec-driven
validation are exercised before source acceptance. The installed ETHOS runtime
still embeds its own 1.13.2 owner; this repository does not alter that immutable
runtime or claim that a local dependency update distributed it.

## Goals / Non-Goals

**Goals:** one native English owner; one native Markdown boundary owner; a
source-bound offline tool bundle; independent Forge supply; a readable English
voice with complete semantics; removal of replaced code and configuration.

**Non-goals:** another lifecycle, scope companion, tracked evidence ledger,
service, mobile site, compulsory human trial, or duplicate tool installation.
Host credentials, selected models, active services, and foreign lanes are not
migration inputs.

## Decisions

### Preserve meaning before editing voice

Use the original-to-topic comparison as an index, then read the original clauses
before accepting coverage. Before an English edit, record its actor, action,
condition, authority, evidence, and stop or revisit limit. Read the complete
topic, edit it for its reader, and compare the changed clauses with the
original. Native style results do not prove equivalence. A shorter or more
polished sentence is invalid if it drops a qualification.

### Preserve the seven-topic review boundary

The baseline comparison remains at
[the original-content review](../archive/2026-09-30-work-guidance-completeness/design.md).
The initial native-tool migration must reread all seven topics before changing
presentation. Editing the charter must preserve problem-resolution and judgment
duties. Delivery must still record a material scope or risk change and its
resolving decision. Preserve actor, obligation strength, permission, condition,
evidence limit, and escalation boundary. Monthly case calibration and quarterly
net-benefit review retain their minimum frequency and owners. Review omitted
original duties separately from presentation and the incompatible tool contract;
the baseline comparison cannot establish their completeness.

### Restore omitted obligations without recreating the monolith

A final reread of original blob `ce3d090be258e65534781769e3e2fd5ab7439ef8`,
including the opening cards and sections 0 through 13, found that the earlier
comparison was too coarse in several places. Against released source
`d5cf3fa70f63f8674df1ea0a563dc6a35fcbb82b`, the following adverse cases still
needed explicit protection. The current editorial comparison is not an
independent review or an automated proof of equivalence.

| Original duty                                                                                                  | Current owner          | Counterexample the restoration must exclude                                                                    |
| -------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Sections 3.1 and 3.2: explicit decision constraints and stable central concepts                                | Analysis model         | A model silently changes a concept, or the proposal hides cost, compliance, technical, or resource limits.     |
| Section 3.4: execution resources, costs, milestones, and checkpoints                                           | Delivery plan          | A plan names people and dependencies but hides its cost or intermediate commitments.                           |
| Section 5.5: professional judgment and durable production                                                      | Data ownership         | Deployability alone is treated as the production owner's long-term responsibility.                             |
| Section 5.5: governance review and actual process controls                                                     | Data ownership         | A written admission policy substitutes for review and working permission or veto controls.                     |
| Section 5.5: delivery priorities and open decisions without borrowed authority                                 | Data ownership         | Coordination hides unresolved choices or overrules a professional owner.                                       |
| Sections 6.1, 6.4, 6.5, and 7.1: declared purpose, meeting focus, deadline escalation, and measured expression | Communication          | An unstated request, off-topic meeting, unowned delay, or slogan replaces a bounded decision and action.       |
| Sections 11.3 and 11.7: coaching preserves member judgment and managers must not normalize individual rescue   | Evolution management   | A supervisor supplies the conclusion, or repeated personal intervention becomes the permanent operating model. |
| Section 8.4: precise Agent deliverable                                                                         | Human–AI collaboration | A delegation leaves its output format, destination, audience, or detail to guesswork.                          |

Restore these duties in the existing paragraphs and execution table. Retain
every surrounding permission, qualification, evidence limit, and owner. Do not
restore redundant cards, fixed forms, or a universal weekly meeting. The monthly
case review and quarterly net-benefit floor remain unchanged. Topic wording
still follows the department's task and professional context, not a tool's
preferred vocabulary.

The native dictionary initially rejected the valid plural and possessive of
`deliverable`. Accept only that real term and its two normal inflections; retain
a misspelled near-match regression. Do not rewrite the obligation or disable
spelling to make the source pass.

This is a compatible correction of omitted original duties. Publish a patch
successor with its own source-bound bundle, exact-HEAD proof, and declared
platform acceptance. Preserve signed `v7.0.0` and its original notes. Never
replace published asset bytes; any withdrawal must follow the explicit retention
boundary below. Update only the existing task ledger; keep shared ETHOS
integration and final archive open until their actual prerequisites are
satisfied.

### Separate English and Markdown responsibilities

Vale owns spelling, repeated words, selected terminology, and diagnosed wordy or
stock phrases. Native configuration and vocabulary contain the selected policy;
the wrapper only chooses explicit current files, a verified executable, and
fixed native arguments. There is no custom NLP or source-mapping engine.

Markdown lint owns syntax and parsed comment controls. Its supported parser
identifies actual comments before checking Vale's control grammar. Literal code,
escaped examples, normal comments, and evidence links remain valid. The same
native Markdown parser must replace both the textlint DR parser and the README
license reader before their remaining packages are removed. Existing decision
and license counterexamples are retained, not weakened to fit a new parser. The
license reader admits an explicit matching License section, not incidental
prose, fenced examples, empty sections, or a mismatched declaration. It
preserves upstream notice bytes and resolves the npm parser only during bundle
building; cold installation must work before npm dependencies are installed.

### Complete the existing decision boundary

Adversarial review of source `d8b6853f069ae1a414ee32f483a1fd4785bf8e91` found
three gaps in the migrated owner. A sentence beginning with `constructor`,
`toString`, or another inherited property crashes command classification.
Separate current DRs can reuse one stable ID even when their document subjects
differ. Five empty headings also pass despite carrying no decision rationale.

Use only own command-table properties. Return the already validated stable ID to
the existing tree check, which rejects duplicates without parsing the document
again. Inspect the existing native paragraph and table-cell tokens between each
required pair of headings for readable content. Links, lists, quoted rationale,
and decision tables remain valid; whitespace, thematic breaks, and reference
definitions alone do not supply a section's content. No word count, NLP
classifier, second Markdown parser, or lifecycle gate is introduced. This
structural check cannot judge whether a nonempty argument is sound.

The old shell-token regex also misses quoted executable names and compound
commands, and treats every sentence beginning with an interpreter name as an
invocation. Replace it, rather than adding another parser, with pinned
`shell-quote` 1.11.0. Its native token stream distinguishes operators, comments,
quoted words, and escapes. Repository logic recognizes executable names and
argument syntax; it does not attempt general natural-language understanding.
Preserve variables with an explicit callback instead of reading the host
environment, and never execute the inspected text. Bare paths and meaningful
interpreter prose remain valid. Unsupported command dialects still require
editorial review; portable execution of the checker is a separate property.

The native lexer represents glob arguments as objects, not operator boundaries.
Keep their patterns in the current argument group rather than discarding them.
Recognize a single literal operand, variables, and the end-of-options marker for
the selected removal and retrieval commands. These cases must fail through the
public DR boundary, including compound commands. Ordinary sentences describing
the commands remain valid; this correction does not create a general shell or
natural-language parser.

Native registry and upstream metadata establish the package identity and MIT
notice. An isolated lock-only resolution adds one package, no transitive
packages, no platform requirement, and no installation lifecycle script. The
exact-version advisory query and complete resolved audit report no findings.
Replace the old token function completely and include the new package and its
license in the next source-bound offline bundle. Do not preserve a fallback
regex or add a host shell dependency.

Each defect must fail against the previous source and pass after the repair.
Retain execution-content counterexamples and ordinary prose positives, then run
the complete verifier. Record upcoming fixes under `Unreleased` and qualify the
final patch separately; do not move an existing release tag or replace its
bundle.

The checker correction has a compatible patch boundary: department duties,
member routes, and contributor commands do not change; the dependency and
offline bundle do. The Changelog and signed tag record its release identity.
Keep subsequent fixes under `Unreleased` until their own release cut, then
qualify the exact signed source and frozen package independently.

GitLab Windows source jobs at the release-cut identity failed during native
installer cleanup, before documentation verification. The source uses one
synchronous removal with three 100-millisecond linear retries. Replace it with
one awaited native asynchronous removal in the already asynchronous installer:
ten 200-millisecond linear retries, confined to its own fresh extraction stage.
The installer cannot report success until removal finishes; a persistent error
still fails. No custom retry loop, platform shell, security override, or second
cleanup path is added. Focused tests prove awaiting and failure propagation; the
actual Windows source job must prove platform acceptance. A permission error
alone does not identify a particular lock owner or security product.

Keep identity and section completeness separate from the execution-content
requirement. Appending both responsibilities to one long requirement produced an
official INFO finding that the bound ETHOS runtime blocks before proof. Separate
the obligations and retain all scenarios; do not drop a qualification, disable
native validation, or misreport that product behavior as repaired.

The former stop-word dictionary includes ordinary domain words that already
needed exclusions. Native rule selection must preserve the promised defect
categories and real negative cases without imposing a large inherited blacklist
on department language. A policy difference belongs in this major Change, not a
silent exception or a claim that the previous rule was never used.

### Remove the replaced owner completely

Migrate all three consumers before removing the retired direct dependencies:
`@textlint/kernel`, `@textlint/textlint-plugin-markdown`,
`textlint-rule-stop-words`, `textlint-rule-terminology`,
`textlint-util-to-string`, `write-good`, and `cspell`. Use the native npm
resolver to remove their unneeded transitive packages from the lockfile and
installed graph. Remove the old rule configurations, imports, adapters,
standalone commands, test interfaces, and current contributor and governance
guidance. No alternate parser, compatibility facade, fallback, or optional
checker remains.

Final acceptance pairs native responsibility tests with a current-consumer and
dependency-graph audit. A working Vale command alone does not prove retirement.
Immutable release and official archive bytes are evidence of earlier source, not
installable dependencies, current commands, or a second implementation.

### Reuse the current supply owner

One repository-native supply manifest declares tool versions, exact platform
assets, archive SHA-256 values, version output, and license sources. It is a
repository supply contract, not an official OpenSpec schema. The existing
installer becomes one native-tool entry for lychee and Vale; no second installer
or host-global package owner is introduced.

Local checks run already installed or locally supplied verified binaries without
network access. GitLab CI obtains its tool archives from its own project package
registry; GitHub obtains pinned official archives. Credentials never cross those
routes. Offline installation consumes one frozen bundle containing the locked
npm cache, every declared native tool asset, and the corresponding notices.
Missing or changed bytes fail before extraction or execution.

The bundle binds the complete package and native-tool manifests. Accepted
governance requirements must name that single supply owner, not the retired
lychee-only manifest; reconcile them through this Change's official deltas, not
a direct edit of the accepted spec. Previous lychee-only bundles do not qualify
the changed source. The same frozen new bundle, not independent rebuilds, goes
to both Forges. Windows uses the ABI of the actual Node process; emulation
cannot be relabeled as native ABI coverage.

### Keep one current package-manager contract

The older multiple-npm qualification scenario conflicts with the later exact
native npm declaration. Retire that duplicate requirement, not the operational
checks it carried. Exact npm admission, observed version, cold execution, source
binding, and the audit boundary remain at their existing owners. Do not keep
both compatibility claims or rewrite old archives to hide their sequence.

### Organize configuration by responsibility

The `.config/tools/` directory mixes document policy, executable rule code,
binary supply, and a release record. Valid syntax does not establish correct
ownership. Follow the existing ETHOS concern boundary: `.config/checks/` owns
native check policy, `.config/supply/` owns the single native-tool manifest, and
`.config/release/` owns the source-bound offline bundle record. A small
directory README explains those owners and links to them; it is not another
policy or registry. The repository check rejects misplaced, executable,
duplicated, and local-state configuration. No additional ETHOS proof gate is
introduced.

Use `.config/checks/markdown/markdownlint-cli2.toml`, which the pinned native
CLI supports through `--config`. The existing Markdown module owns the parsed
Vale-comment rule and exposes it to the native rule loader. Configuration
selects that implementation; it does not contain executable code. The prose
checker uses the same rule, not a copied parser or alternate configuration.

Prettier reads `.config/checks/format/prettier.toml` through its native
`--config` option. Remove the policy from `package.json`; do not leave discovery
or editor overrides to select another owner. Lychee reads
`.config/checks/links/lychee.toml` for the same offline, fragment, progress, and
retry behavior previously supplied inline. Only the explicit online operation
overrides offline mode; file selection remains an execution input. Both paths
use native consumers without a parser facade or additional dependency.

Vale's main configuration remains INI at `.config/checks/prose/vale.ini`; its
native styles remain YAML and its vocabulary plain text. The official consumer
requires those formats. A TOML-to-INI converter would create a second owner, so
it is rejected. The native supply manifest and release record remain JSON: the
cold installer must validate them before npm dependencies exist, and Node does
not supply a TOML parser. Their machine-readable identity is not another
hand-authored policy. Do not introduce a bootstrap dependency or retain JSON and
TOML copies merely to make every suffix look alike.

Move existing manifest and native-rule bytes, update every source, test,
contributor, and active-Change reference, then remove `.config/tools/` entirely.
The public commands and normative duties do not change, so this correction is a
compatible patch edition. Freeze a new source-bound bundle and qualify its cold
install, installed proof, and both Forge matrices. Earlier signed tags and
official archives remain immutable. Published asset bytes cannot be replaced;
download retirement follows the explicit retention boundary below.

### Bind local links to source

The native link tool checks whether a target exists and whether its fragment
resolves. The repository boundary also confines file links to the root, but
neither check establishes that a local target will exist in a clean checkout. An
ignored cache file can therefore make an otherwise undeliverable link pass.

Use the existing Git inventory once for the link check: tracked files and
non-ignored candidates define source ownership. A local target must stay inside
the repository and belong to that inventory; a directory route must contain
source. Check both the requested path and its native resolved path so an ignored
alias cannot borrow the identity of a source file, and a delivered alias cannot
borrow a local cache or outside file. Native lychee still owns extraction,
existence, fragment, and online checks. Do not add a second Markdown link
parser, path allowlist, configuration, or link checker.

Exercise the public command against a clean local clone. Ordinary tracked
references and non-ignored candidate source must pass; existing cache files and
Git metadata must fail. Preserve encoded filenames, source directory routes, and
delivered aliases with source targets. The correction changes validation, not
the work guidelines or public commands. Qualify a compatible patch after the
remaining source audit. Preserve earlier signed tags and source identity; never
replace published asset bytes or bypass the download-retention boundary.

### Name actual CI jobs by purpose and platform

The source before this correction gave macOS and Windows explicit platform names
but used platform-less names for protected Linux and offline verification. The job
names should identify the same dimensions on every host: purpose, action,
platform, and an optional source-review qualifier.

Runnable jobs use `docs:verify:<os>` or `offline:verify:<os>`, where `<os>` is
`linux`, `macos`, or `windows`; source review appends `:review`. Move the
current shared source and offline steps to hidden `.docs:verify` and
`.offline:verify` templates. Every runnable job inherits its phase owner
directly. Linux does not become a shared parent merely because it uses the
default container. Native hosts retain their existing default-image exclusion
and tool-supply overrides.

This is a naming and ownership correction, not a runner or execution migration.
Keep the same capabilities, image digest, permissions, rules, timeouts, and
commands. Update the existing CI validator, negative tests, and contributor
instructions together; reject platform-less aliases and broken inheritance.
Validate the resolved native GitLab configuration before publishing, then
observe the new names on the next exact-source hosted jobs. Earlier pipelines,
tags, and release assets keep their original identity.

The configuration audit found that GitLab admitted every nonempty tag while
GitHub and native release policy declared `v*`. Restrict GitLab workflow,
protected-source, and offline rules to the same tag family before tool supply.
Exclude slash-containing tags because GitHub's `*` does not match `/`. Keep
native SemVer, signature, and protected-runner checks; a matching tag is
not a valid release identity. The existing CI contract and negative tests reject
broader rules. This correction does not change branch routes, tools, or Runner
ownership. Qualify the final untagged patch source again rather than adding an
intermediate release.

### Make governance and decisions usable by their readers

Before this correction, governance combined authority, contributor commands,
proof providers, offline packaging, and runner risk in a few long sections. Readers
cannot locate their next action without reading unrelated implementation detail.
Keep the existing file and metadata; begin with a small task route, then
separate change authority, publication, versioning, quality, tool supply, and
runner boundaries. Use tables where the reader must compare owners or acceptance
conditions. Keep executable setup and release commands at the existing
contributor owner instead of copying another procedure.

Preserve every actor, obligation, permission, qualification, and evidence limit.
Source acceptance, hosted results, installed product behavior, and ordinary use
remain separate. A structural or style pass cannot certify semantic preservation
or reader understanding; compare the full source and revised clauses editorially
and check the actual rendered reading path.

The two current DRs retain accepted identities, dates, five sections, and
choices. Clarify their problem, serious alternatives, consequences, and
reviewable basis; remove rhetorical claims and duplicate working rules. Make the
decision register explain when a new record is worth keeping. Missing sequence
numbers, command changes, releases, and implementation results do not justify
new decisions. No new DR is required by this review: the existing choices and
official Changes already own the relevant rationale. Signed source, original
release notes, and archive bytes remain unchanged; attachment withdrawal is
separately governed.

### Retain useful distributions without unbounded storage

The remote inventory contains no duplicate package files. Full offline bundles
for every intermediate edition dominate storage. Git source, signed tags, and
immutable proof retain the identity of that work; indefinite binary distribution
is a separate commitment.

Keep the latest qualified release and one preceding qualified rollback on each
Forge, plus native tool packages required by retained source and current CI.
Before retirement, inventory exact package and file IDs, names, bytes, digests,
release links, active jobs, and source consumers. Freeze deletion and
preservation sets. Unknown or still-consumed assets cannot enter the deletion
set.

Use native Forge endpoints to retire the selected attached downloads and GitLab
package entries. Preserve signed tags, source revisions, original release notes,
and historical acceptance evidence. Add a dated withdrawal notice to affected
Releases and remove obsolete download links. Never rewrite old bytes or
advertise a retired edition as available offline. Verify retained identities and
digests, exact deletion, and each final inventory. API acceptance does not prove
physical storage reclamation; check the provider's statistics separately.

The existing contributor route owns this aftercare. No cleanup daemon, private
retention registry, or second release controller is added. This explicit
boundary supersedes indefinite attachment retention; historical publication
remains true without implying that every binary is served forever.

### Review the complete documentation and configuration boundary

Independent experts review one immutable snapshot, not moving working files or
only the changed paragraphs. Cover original-duty preservation, department use,
authority and decisions, English prose, reader navigation, native configuration,
and historical OpenSpec truth. The inventory includes root entries, all current
topics, decisions, governance, current and archived OpenSpec artifacts, quality
policy, supply and release records, ETHOS bindings, and both CI declarations.

Experts return bounded read-only findings with source locations, consequences,
and specific repairs. The primary owner integrates them without adding a second
rule source or rewriting history. Review every finding against current facts and
retain dissent or unproved limits; a majority vote or clean static check does
not establish semantic correctness. Recheck changed owners and the actual
rendered reading path after repair. Progress remains only in `tasks.md`.

The full configuration review removes an obsolete proposal rule demanding
routing metadata: affected capabilities and repository-relative boundaries
belong to official artifact fields, not a private carrier. Retire the unused
root documentation-audit ignore path; generated review artifacts already have
one owner under `build/`. Native YAML aliases select one hidden source-supply
list for all source jobs, with GitLab's supported nested script arrays for the
Linux bootstrap. Only the Linux image bootstraps npm; maintained native hosts
keep their existing installation owner. Resolve the actual GitLab configuration
before accepting its equivalent execution.

The independent semantic review of the fixed snapshot found two omissions in the
earlier 84-row comparison. Historical analysis must explicitly examine
sample-selection bias and explain how missingness, delay, conflict, and
anomalies affect its conclusion. A time-valid sample selected only for complete
coverage does not satisfy that duty. At the Agent delegation owner, missing
context that is not blocking calls for continuing with reasonable stated
assumptions by default, not merely permission to continue. An unspecified
presentation preference is not a reason to suspend authorized analysis; an
unknown fact source or authority still stops the affected action. Restore both
duties in their existing topics and recheck these adverse cases without using
string tests as proof of meaning.

Record actual expert coverage and any failed review in the existing task ledger.
The primary owner's audit cannot stand in for an independent lens, and a failed
provider call supplies no review evidence. The prior comparison remains dated
evidence, not a certification of equivalence.

The current-entry audit found three OpenSpec descriptions that contradicted the
installed contract. npm execution can reuse its execution cache even with
`--offline --no`; call the local package's JavaScript entry with Node instead.
The official proposal template permits new capabilities and requires exact live
paths only for modified capabilities. The official sync workflow can apply
Change deltas without archiving; both sync and archive still require ETHOS
admission. Correct these descriptions without adding a wrapper, private
capability restriction, or archive-only lifecycle. GitLab source prerequisites
must name both native tool archives, as the existing manifest and CI already do.

The archive review compares historical commitments, not their claimed
execution. Several records require a bounded disposition when cited: the
rollout-forwarding repair describes wrapper changes in its proposal and a
shared-verifier forwarding edge in its design; lifecycle records disagree about
archive and land order; identity normalization promises preserved evidence
digests while
its design refreshes digests for path-edited Chronicle representations; and
older Node/npm notes do not consistently distinguish upstream bundled npm from
the destination-selected executable. None establishes current delivery,
corruption, or a past lifecycle violation. Preserve the original records and
digests; if a claim depends on an edited representation, identify its separate
bytes and producer evidence. Do not infer historical execution or restore
retired scope, browser, shell, or package-manager policy from these records.

### Deliver the complete transition

The initial contributor-command and offline-bundle transition is incompatible
and requires a major SemVer edition. Later corrections use their actual
compatibility boundary rather than repeating that major increment. Complete
local checks, freeze source and bundle, qualify clean offline execution, obtain
exact-HEAD installed proof, and publish through each Forge independently.
Observe source and offline jobs on every declared platform. Archive and retire
the lane only after its own required work is complete.

Shared ETHOS fixes are accepted only through their actual formal product
contract. Repository-native tests cannot certify that product. If that
dependency is unavailable, complete independent local work and leave dependent
tasks open; never mark this Change complete or archive to obtain a green
lifecycle.

Qualify that shared contract on DDWG, AIGW, and Proxy with the same formally
accepted installed runtime. A declaration, a product-source test, or one
adopter's local report does not establish this cross-adopter result. Each
repository retains its own source, lease, exact-HEAD proof, and acceptance.

The final task audits the evidence and disposition prerequisites before
archival. The installed official archive transition requires all Change tasks to
be complete; it cannot require evidence of its own future Git object as an
earlier checkbox. The Goal still requires all resulting outcomes: official
archive, trusted signature and proof for its new HEAD, publication and source CI
on both Forges, and retirement of the owned lane and proved-disposable residue.
Observe those effects through the existing product commands and their native
records. Do not tick future effects, reuse earlier-HEAD proof, add a second
progress ledger, or mark the Goal complete before those outcomes are verified.

## Risks / Trade-offs

- A parser migration can lose nested decision constraints. Keep every existing
  positive and negative case and add the new comment-control cases.
- A tool transition can pass locally but fail offline or on a different ABI.
  Qualify the actual frozen archives on each declared platform.
- A style rule can damage domain meaning. Keep uncertainty and authority terms,
  review vocabulary narrowly, and compare semantic changes explicitly.
- A generic installer can become a framework. Extend only the two present tool
  consumers and remove the old path instead of preserving a compatibility layer.

## Migration Plan

1. Add distinguishing native rule, supply, and source-conservation tests.
2. Replace implementations at their existing owners; remove superseded files.
3. Review topic prose and reconcile all current documentation and CI consumers.
4. Freeze source and one source-bound offline bundle and complete local checks.
5. Qualify installed proof, independent hosted matrices, and publication.
6. Retire superseded downloads under the exact retention boundary.
7. Archive officially, prove the archive commit, and retire exact disposable
   state while preserving required evidence.

## Open Questions

None require user input. The accepted shared ETHOS native evidence contract is
an integration dependency whose actual schema must be consumed when available.
