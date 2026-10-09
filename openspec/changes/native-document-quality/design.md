# Design

## Context

This Change starts from edition 6.1.1,
`c8599ce9c91ed5f988abd6b3f3011ac94430283d`. That source distributed prose checks
across CSpell, textlint, write-good, and local terminology rules. Textlint also
parsed decisions and licenses, so replacing its prose command alone was
insufficient.

The retired guideline blob, `ce3d090be258e65534781769e3e2fd5ab7439ef8`, and its
[earlier clause comparison][baseline-review-gitlab]
([GitHub][baseline-review-github]) are review inputs, not current authority or
certification of equivalence. The earlier design is preserved in Git at
`934293b8a6ab0600af75ea86fbdbdf36c46d1bd9`, at this same path
([GitLab][previous-design-gitlab] · [GitHub][previous-design-github]). Original
diagnoses, failed attempts, and review limits remain with their evidence owners.

[Tasks](tasks.md) is the sole action and completion ledger. This design records
choices, boundaries, and migration order; specifications own the observable
requirements, and code owns implementation detail.

## Goals / Non-Goals

Deliver useful English guidance for members and Agents. Preserve applicable
duties and explain every changed or retired clause from current instructions,
verified facts, and department needs. Give each check, configuration, and
procedure one owner. Qualify complete local and offline tool supply, then
publish one signed source graph and frozen artifact independently on both
Forges. Retire replaced implementations with their migrated consumers.

Do not add a lifecycle, private scope, evidence ledger, installer, retention
controller, universal meeting, mobile site, or staged adoption trial.
Credentials, selected models, active services, and foreign lanes are outside
this migration. Local checks prove neither historical execution, complete
semantic equivalence, accepted shared-product behavior, nor actual team use.

## Decisions

### Review original duties at seven topic owners

Review all 62 original numbered subsections and five surrounding groups against
the complete current topics, including introductions, examples, diagrams,
templates, and final checks. Compare actor, action, obligation strength,
permission, condition, authority, evidence, escalation, and revisit limits.
Preserve applicable duties; explain replacements and removals at the existing
clause-review owner. Unexplained loss fails review. Hashes, headings, prose
scores, or shorter pages do not establish semantic coverage.

Test current duties for purpose and authority as well as correspondence. A form,
model, schedule, or writing technique is not mandatory merely because an earlier
draft used it. The charter owns authority and hard boundaries; six task topics
own their judgments and actions. The task map routes to them without repeating
policy. [Guidance requirements](specs/guidance-discovery/spec.md) own cadence,
data responsibilities, and adverse cases; [quality](specs/quality/spec.md) and
[governance](specs/repository-governance/spec.md) own their respective
requirements.

Data-quality duties span acquisition, production, analysis and modeling, data
science, platforms, infrastructure, product governance, and operational
delivery. Keep each role responsible for its work. Feedback revisits value,
meaning, and quality without granting another data use. Quantitative examples
are explicitly illustrative. Incident containment addresses invalid downstream
results, production, permissions, and compliance; management protection for
members who expose problems is a separate duty. Generic physical-safety
scenarios do not define data incident response.

State fidelity, clarity, and elegance before applying them. Fidelity preserves
intended meaning; clarity requires accurate understanding and fluent expression;
elegance includes expressive beauty, taste, and artistic and cultural refinement
suited to the subject and audience. Precision, restraint, brevity, and visual
structure are techniques, not substitute definitions. Add no unrelated
philosophical doctrine or machine claim of aesthetic quality.

Distinguish missing information from a timing condition when a decision waits;
each needs a resolution action and revisit time. Problem framing states its
comparison baseline. Agents build the smallest sufficient model before expanding
detail. Every task owes its commitment and hard boundaries; exceptional outcomes
are conditional, not a universal requirement.

Reviews bind fixed source and concrete adverse cases. Preserve earlier
judgments, dissent, corrected counterexamples, and failed routes at their
producer. An editorial crosswalk is not an automated equivalence proof,
committee quorum, or new meaning validator.

### Give native quality concerns one owner

Keep process and Git selection in the runtime, dependency audits in their audit
module, official OpenSpec reports in their native consumer, and DR validation in
the decision module. Call each owner directly; retain no compatibility exports.
The offline command selects modes without exposing a library facade; artifact
identity, npm binding, build, install, and acquisition have separate owners.
Cold commands load before dependencies; build-time license inspection alone
loads the Markdown parser.

Tests follow those responsibilities and share existing fixtures rather than
duplicate them. Native Git discovers every selected `tests/**/*.test.mjs`, not
fixture modules or retired monoliths. Preserve cases, declarations, diagnostics,
cleanup, two workers, and the existing outer deadline.

#### Source selection and observations

Git selects tracked and non-ignored candidate source, including force-tracked
files beneath ordinarily ignored directories. Prose and links retain the
official archived-Change boundary; format and lint retain historical controls.
Directory names do not waive checks.

The verifier reports repository, commit, tree, tracked changes, Node version,
platform, process architecture, host name, and mounted capacity once through
native Git, filesystem, and OS interfaces. Use exact integer bytes and retain
read errors. These observations establish neither VM identity, isolation,
throughput, nor a capacity threshold; the runner owner qualifies those.

#### Prose and native Markdown checks

Vale owns spelling, repetition, reviewed terminology, and diagnosed stock-phrase
and concision defects. Supply explicit source, verified binaries, native policy,
and narrow vocabulary additions. Real defects remain negative examples; no
wildcard baseline replaces judgment. Native rule coverage must fail when a
loaded rule stops detecting its defect, while command tests preserve Markdown,
configuration, warnings, and real invocation.

Reject a known prose failure before unrelated Changelog and OpenSpec work; valid
source still executes the complete graph. Markdownlint core receives the
concern-local TOML through its public API, preserving native options, comments,
filenames, locations, rule IDs, details, heading rules, and width checks.
Literal Git filenames need no CLI2 discovery layer.

One native Markdown parser supplies control comments, DR shape, and license
sections. Actual Vale suppression controls fail, including nested or wrapped
comments; explanatory prose and code remain valid. Native formatter ignores may
preserve byte-exact examples.

#### Formatting and semantic preservation

Prettier's public interfaces own supported Markdown, code, JSON, and YAML;
dprint's format-only TOML Wasm interface owns TOML. Preserve locked identities,
comments, key and array order, multiline bytes, parsed meaning, and diagnostics.
Unsupported or missing format supply fails without a raw-scan fallback. One
fresh TOML formatter serves each attempt; standalone discovery retains native
acquisition and no cross-attempt cache.

Prettier alone owns Markdown spacing: one document-block separator, tight nested
lists, meaningful loose-list and quote separators, and distinct containers.
Fences do not automatically loosen lists. Lint owns non-spacing rules without
overruling formatter-accepted structure. Public fix and check select the same
Git source; the second fix is unchanged, including nested quotes and ignored
byte-exact examples. General English and plain-text hygiene do not scan embedded
code, strings, scalars, or literals as padding.

Remove the remark bridge, unused dependencies, raw spacing checks, and formatter
comment vetoes together. Do not add the known-vulnerable Taplo binary. Preserve
the locked TOML plugin's complete original MIT grant through its native API,
without inventing a notice sidecar or claiming general safety.

### Choose the reading form by the question

#### Task routes and topic hierarchy

Group related work questions in the task map and put each destination beside the
decision it supports. Nested related reading stays distinct; urgent failures and
escalation have direct routes. Maintenance comes last. Topics open with their
use, then their stop and verification boundaries. Route admission, readiness,
completion, and decision-document order to the decisive section, not a page
title. Preserve anchors, compound conditions, and every actor's authority.

Use subheadings for long sections, lists for duties, and tables for comparisons.
Place examples beside their practice and keep required inputs conjunctive.
Separate minimum duties from conditional exceptional performance, emergency
duties from management duties, and completion from supporting evidence.
Important updates expose conclusion, basis, decision request, and next action.
Fidelity, clarity, and elegance remain separately navigable; charter stewardship
follows work rules. No reading choice adds a role, approval, or checklist
ritual.

#### Contributor and governance procedures

Contributing owns setup, native tools, source checks, and six navigable release
stages. Governance links there and owns permission and acceptance. Separate
inputs, source proof, release-cut identity, tagging, publication, and downloads
without changing dependencies. Keep document editing outside the source-check
procedure, and supply staging, cache publication, cleanup, child processes, and
extraction at their respective owners. Agent guidance separates modeling, safe
mutation, verification, interruption, and parallel work.

#### Work examples and whole-page review

Use ordered steps for the working loop and Human–Agent handoff; the data-stage
table compares use and evidence, and the role table defines retained powers.
People delegate, verify, and accept; an authorized task lead may accept.
Preserve return conditions and met/unmet branches without duplicating them in
diagrams. Coaching separates alignment, review, and improvement; handoffs
separate work, verification, and limits. Market-history examples remain
conditional and illustrative, with the next verification action and no implied
permission.

Inspect complete current-source pages and actual member and Agent routes at
desktop reading widths. Use a diagram only when relationships become clearer
than steps or a table. Keep editable source beside rules and a complete text
equivalent; use native grammar, not private CSS or positioned arrows. Derived
review renders belong in ignored `build/`. Local previews establish neither
hosted rendering, screen-reader acceptance, aesthetic consensus, nor team
benefit.

### Keep configuration with its consumer

`.config/checks/`, `.config/supply/`, and `.config/release/` own check policy,
native supply, and frozen artifact identity. Executable rules stay with code;
the configuration map routes to native settings. `.gitignore` supplies shared
editor and Finder exclusions, tested in isolated Git configuration with an empty
`info/exclude`, without hiding tracked guidance.

Create `assets/` for consumed original media and `resources/` for consumed
non-code program inputs, not empty template symmetry. Native settings stay in
`.config/`; reproducible output stays in semantic ignored `build/` directories.
ETHOS's `system/` is its product contract, not an adopter template. Package
projection may preserve canonical source hierarchy without creating another
source owner; executable resources remain governed code.

Qualify the accepted, installed ETHOS resource contract before moving supply or
bundle inputs. Migrate loading, imports, package inclusion, tests, CI, and
contributor routes together, verify complete bytes, and remove old paths and
aliases. Do not move obsolete records into new scaffolding or copy schemas.

Keep native formats: TOML for Prettier, lychee, Markdownlint, and dprint policy;
INI, YAML, and text for Vale; JSON for cold supply and release loading before
npm dependencies exist. Do not add converters, bootstrap parsers, embedded
duplicate policy, or ambient overrides. Repository topology checks do not become
a copied ETHOS schema or proof gate.

### Keep decisions durable and executable evidence at its producer

DRs use unique stable IDs, lowercase paths, matching titles, accepted metadata,
and five meaningful ordered root sections. Native tokens distinguish rationale
from task markers, execution content, and fenced or indented code under
wrappers. Breaks, whitespace, or link definitions alone do not fill a section.
Bare paths, evidence links, interpreter concepts, decision tables, and quoted
rationale stay valid.

One pinned non-evaluating shell lexer recognizes supported invocations, quoted
operands, operators, globs, variables, comments, and end-of-options. Use own
properties, retain glob operands, read no ambient values, and execute no text.
This is not a parser for every shell or full here-documents; review owns
unsupported cases.

The two records keep their actual dates, choices, alternatives, consequences,
and revisit limits. Commands, releases, readiness, and acceptance belong to
their Change or evidence producer, not new DR sections. Sequence gaps require no
new decision. Rename the descriptive DR-0001 path with its incoming index while
preserving its subject, ID, date, and reasoning; retain no alias.

### Resolve reader routes and links from their native meaning

The locked Markdown compiler and HTML parser own actual GFM links and anchors,
Unicode identity, reference precedence, and tables. Exclude comments, code,
escaped examples, unused or shadowed definitions, unresolved references, and
unlinked images from routes. Visible text or descriptive linked-image alt text
is required; whitespace, invisible characters, and optional titles do not label
a destination. Preserve emphasis, entities, escaped pipes, titles, relative
normalization, and the first visible topic cue without manual cell splitting.

Lychee owns extraction, targets, fragments, and explicit online checks. Bind
requested and resolved local targets to complete Git-selected source within the
repository: ignored aliases cannot borrow tracked targets, and tracked aliases
cannot borrow outside files or caches. Preserve valid delivered internal aliases
and directory indexes; reject escapes, cycles, dangling links, and private
state. HTML compilation is syntax evidence, not visual qualification or Forge
destination authentication.

### Preserve native execution and complete validation evidence

#### Official reports and source requirements

Official OpenSpec owns validation, sync, and archive. Its consumer requires the
actual resolved root, native version, unique typed items, complete issues, and
consistent counts for both `--all` categories, including empty ones. INFO,
WARNING, ERROR, standard error, incomplete or totals-only reports, and wrong
roots fail with their original diagnostics. Vale capture and lychee extraction
retain strict standard-error handling; do not rerun for cleaner output.

Only the OpenSpec child's official telemetry option suppresses offline telemetry
and updates. Remove inherited case variants in that child without changing its
parent or global settings; exercise actual native request behavior. Before sync,
merge and strictly validate each changed capability officially. Keep every
actor, permission, and scenario when shortening requirements. Remove a redundant
delta for an already-removed requirement, preserving its Git evidence.

#### Same-attempt diagnostics

The existing executor retains command identity, native cause, status, signal,
standard output, and standard error on creation failure, nonzero exit, or
timeout. Replay captured diagnostics once. Attach only real causes; keep
exit-only errors distinct. Timeout assertions accept termination before progress
without fabricating text; other cases retain exact diagnostics. Preserve primary
and cleanup errors, and never infer a hosted cause from a fixture that lost its
result.

#### Isolated tests and command startup

Fixtures own their prerequisites, Git boundary, regular empty configuration
files, and cleanup. Resolve Windows aliases natively without accepting wrong
roots or dependency junctions. Keep localization and the same child's diagnostic
instead of forcing language or rerunning Git. Npm fixtures retain actual status,
signal, native errors, partial streams, effects, and deadlines; absent status is
not a refusal.

Load quality modules only for the selected command. Test discovery needs Git,
not unrelated format, CI, or bundle startup. Compact public-command fixtures
retain real executables, policy, dependency carriers, local links, ignored and
force-tracked samples, literals, archives, native errors, and complete selected
inputs. They do not replace full-source verification or native tools with mocks.
Preserve two workers, the outer deadline, and every test; qualify hosted timing
separately.

#### Native history resolution

Resolve all selected Changelog refs in one native `cat-file --batch-check` call,
using the existing control-free reference grammar and stdin protocol. Require
one commit result per ref, then native ancestry for each distinct pair and exact
tag/HEAD identity. Missing objects, wrong types, incomplete output, and native
diagnostics fail. Add no shell, history cache, ancestry graph, or Git minimum.

### Supply exact tools without a second installation plane

Guidelines are directly readable. The optional offline bundle supplies
maintenance checks; it is not an installable guideline product. ETHOS remains
its own installed governance dependency.

#### Runtime and compatible assets

Use one Node compatibility declaration and native exact npm declaration. Source
jobs select latest stable Node within that major through locked original tools,
immutable action commits, and disabled automatic package-manager caching. Reject
competing version inputs or undeclared setup options. An action's runtime is not
the project runtime, and an updated action is not a clean audit.

Select native assets independently of Node architecture. Prefer the declared
exact platform; Windows ARM64 may use its pinned x64 tool where no ARM64 asset
exists. One selector serves installer, cache, and bundle. Record host, process,
and asset architecture separately; macOS x64 supply alone is not current matrix
qualification. Actual Windows source/offline jobs qualify emulation and timing.

GitLab shell jobs use original Mise, `.config/supply/`, its six-platform lock,
native package-derived inputs, and `mise exec --locked`. The npm backend checks
archive SHA-512; late path evaluation places selected npm first, including the
Windows prefix. Select the project filename, not global overrides. Windows adds
the OS machine Path after inherited entries before resolving existing Mise,
without encoded install paths, registry writes, service changes, or another
installer. Record application and execution identity; hosted jobs qualify the
environment hypothesis. Cold checks acquire neither Mise nor missing runtime.

#### Bound inputs and atomic installation

One manifest pins native versions, platforms, sizes, hashes, output, and
notices. The bundle includes the complete npm cache, every native asset, and
original notices, bound to edition, Node major, full package manifest, lock, and
supply. Local supplied checks need no remote; each Forge uses its own declared
route and identity. Wrong or missing input fails before extraction or execution,
without substitute downloads, redirects carrying credentials, or provider
fallback.

Verify exclusively owned temporary bytes and publish atomically inside the
destination. Retain verified concurrent targets and existing modes; reject
linked managed parents, files, and archives before effects. Managed selection
hashes bytes before version execution. Preserve complete final equality and
owned POSIX mode without rerunning the same accepted binary; actual consumers
still execute it. Independent host tools retain their own trust boundary. These
checks do not prevent hostile same-user replacement after inspection.

Accept the declared positive bounded stream size and refuse one extra byte.
Await owned-stage cleanup with bounded native retries; retain failures. Cancel
rejected response bodies and retain cancellation causes. Public errors keep
native causes; authenticated errors omit credential-bearing detail. Add no retry
controller or transport abstraction. Extraction retains executor ownership
through native no-same-owner behavior and rejects host metadata, traversal,
links, and incomplete listings; actual extraction, not listing alone, qualifies
the container capability boundary.

#### Cold execution and hosted qualification

Cold qualification uses the exact npm contract, fresh HOME, distinct empty
user/global configuration, clean environment, denied remote connections, and
only local connections required by real HTTP tests. Hosted bootstrap and
acquisition do not establish whole-job network isolation. The builder primes
locked npm cache online through the existing executor but never fetches missing
native assets or notices implicitly.

Resolve fixed-source findings at their original owners and preserve
dispositions, runtime observations, and failures. Qualify full source, cold
install, exact-HEAD proof, both Forge source/offline matrices, and actual runner
combinations. Keep temporary qualification packages until jobs terminate and
evidence is preserved, then retire them. Neither a local pass nor a
qualification package is a signed Release; diagnostic probes add no permanent
controller or relaxed deadline.

### Bind risk approval to the actual subject

OSV owns one complete raw scan with empty scanner disposition. Retain lock,
native policy, original findings, streams, and status; the existing input owner
checks the exact approved finding. Invalid, expired, unapproved,
warning-bearing, or changed-input reports fail. No filtered second scan or
blanket waiver exists. Observe npm's public stable release through isolated
native configuration, fresh cache, and explicit online freshness; retain that
result with the scan.

The four approvals are separate: locked braces 3.0.3 checks/distribution, the
digest-bound Node Trixie CI image, the pinned Vale/OSV/npm group and bundle, and
the five pinned Lychee 0.24.2 assets. The braces and tool approvals end at
2026-10-18 00:00 UTC. Exact subjects and allowed development use remain at the
[risk boundary](../../../docs/governance/ethos.md#bound-known-findings), not a
production, untrusted-input, cross-repository, or other-finding waiver. Changed
artifacts require renewed qualification.

Until an accepted installed ETHOS subject contract covers the actual consumer,
keep bounded compatibility at its existing owner. Bind braces version and
integrity, native finding, permitted paths, and expiry. Retire the disposition
when fixed, withdrawn, absent, or changed stable supply requires new
qualification; a clean report without disposition remains valid after an old
expiry. Migrate the consumer and remove compatibility together, without private
risk schema, extra gates, or renewed authority from source checks.

Project-lock scans do not qualify components inside Node, npm, native binaries,
or ETHOS. Audit exact artifacts and component inventories separately; retain
full raw and binary-symbol evidence and name missing coverage. Lychee
source-lock advisories and aliases are not its complete shipped-binary
inventory. Authenticity, bytes, licenses, function, and each platform still
require acceptance.

Keep KaTeX's patched native renderer through the exact npm override and test
actual inline/display math, explicit trust, and inherited-option refusal. Use
the full stable `node:<major>-trixie` image pinned by index digest: checks need
Git, absent from slim. A new base or bundled npm does not qualify component
safety or the later npm upgrade. Check upstream bounds, behavior, licenses,
effects, and raw advisory deltas before rebuilding supply.

### Keep both publication peers complete and coherent

Define common graph, platform intent, admission, quality, and release actions
once in CUE. Peer adapters own events, permissions, runners, credentials, and
transport; equivalent action lists copied into two branches are still duplicate
policy. Use accepted ETHOS public generation and non-writing drift checks with
original stable CUE. Refuse edited projections before effects on either peer.
Until the installed public route is qualified, preserve working pipelines and
failures rather than copy the compiler or add a reader dependency.

Shared size admission measures code ELOC and Markdown non-blank physical lines,
with 512 accepted and 513 refused unchanged. Partition code, tests, design, and
capabilities by responsibility, preserving discovery, requirements, scenarios,
and versioned release notes. No minification, hidden input, catch-all history,
private checker, or exemption closes this obligation; qualify the actual shared
gate and full source journey.

Local verification and supplied installation need neither Forge. GitLab is the
organizational publication plane; GitHub is an independent complete repository,
CI/CD, and distribution plane. Each qualifies its own exact source, Release,
downloads, and host jobs. GitHub may accept source and distribute qualified
releases while GitLab is unavailable; a new release cut still needs both
matrices. One peer cannot supply evidence for the other.

GitHub source/offline jobs select the same declared Linux x64, Linux ARM64,
macOS, and Windows hosts. Branch dispatch selects a signed SemVer tag matching
native tags, event, and source before acquisition. Matrix membership is not
execution. Changelog keeps neutral version headings and labeled native links
from declared `publication.peers[].forge_repository`, not guessed Git ports.
Preserve notes, dates, SemVer, annotations, prepared-release state, and
ancestry. Reject missing, duplicate, unused, mislabeled, credential-bearing,
divergent, cross-peer, or wrong-repository links; authenticate each actual
comparison base and head at its provider. Keep identical source without
redirects or rewrites.

Preserve one signed graph with merge provenance; native `accepted_ff` advances
refs to an admitted descendant, not necessarily linear history. Remove GitHub's
conflicting single-parent property through native protection while retaining
checks, signatures, administrator enforcement, and no force pushes/deletions.
Qualify actual protected refs and CI, not a bypass or rewritten accepted graph.
Consume accepted native history repair at each affected adopter; preserve
conservation, accepted Python evidence, repaired-baseline admission, and
original plan recovery. Retire replaced identity code after protected
acceptance.

### Schedule platform capacity without changing trust

Use symmetric purpose/platform job names and native shared source/offline
templates. Preserve capabilities, exact pins, source selection, commands,
deadlines, and review/protected identities. Only native executor wiring belongs
in shell; do not add an installation, acceptance, or rollback controller.

Protected `dev`/`main` may select the tracked offline digest through
`DDWG_OFFLINE_CANDIDATE`. Existing jobs fetch their own digest-bound temporary
qualification package, verify and install it, and exclude redundant source jobs.
Preserve terminal results and retire the exact package; tag, Release,
independent download, and isolation qualification remain separate.

Restrict routes to the slash-free `v*` release family before supply; native
signed SemVer admission still applies. Preserve project locking, tagged-only
runners, protected refs, and separate review/trusted accounts, workspaces,
caches, and credentials. One project-scoped Windows resource group spans refs
and events; it reserves capacity without granting trust or cross-project
isolation. Registration, polling, clone, and package transport have separate
boundaries. The fixed HTTP deployment and any registration tunnel do not approve
or protect other credential-bearing routes; infrastructure owners preserve
failed transitions and rollback.

### Retire replaced source and downloads only after absorption

Migrate all consumers before removing textlint, CSpell, write-good, CLI2, their
unused dependencies, policies, imports, commands, and test interfaces. Remove
optional retired checkers, aliases, alternate selectors, and second installers
in the same batch; verify source and the resolved dependency graph.

Completed Change copies leave current source only after unique-fact, obligation,
and incoming-consumer review. Original archive tree
`cda4b105165ab3a788848f74a58004cbc863edd2` remains in the baseline Git commit;
full commit/path links on both Forges must return original bytes. Differing
historical wrapper order, digest representations, or tool choices do not prove
current authority, corruption, or historical execution. Keep any separately
edited representation identified at its producer, without restoring retired
policy. Tests use their own official archive fixtures and retain historical
format controls.

Keep the latest qualified download, one qualified rollback, and packages with
current source/CI consumers. Inventory exact native identities, bytes, digests,
links, jobs, and consumers before deleting; unknown or active resources remain.
Native retirement preserves signed source, original note prefixes, and evidence,
adds dated withdrawal, and removes obsolete download links. Verify absence,
retained hashes, and both inventories; report reclaimed space only from provider
statistics. Clean owned scratch in each batch. Preserve uniquely consumed failed
evidence and recovery until their exact consumer releases them.

### Integrate accepted shared ownership without weakening the floor

Keep only `docs-integrity` and `markdown-format` as default gates and profile
descriptors. ETHOS owns native behavior/static prerequisites and their
dependency closure, not extra profile descriptors or forwarded authored reports.
Consume accepted installed schemas, not prototype fields. Migrate profile,
checks, tests, and guidance together; retire replaced format, stream-report,
risk, and history glue only after consumer acceptance.

Exercise semantics, same-attempt diagnostics, complete selection, single
execution, and subject applicability. Syntax is not semantics; a Node report may
omit runtime warnings. Product scopes may jointly cover a property without every
provider covering each language. Missing prerequisites, authored evidence,
repeated execution, unapproved or equivalently suppressed warnings, report
overrides, and unexercised subjects must block proof at the product owner.

Official OpenSpec owns task parsing; ETHOS's native document/command plane
checks authoring against that template and Markdown structure. A parse cannot
hide copied results or progress prose outside or within a task. Commands, links,
and wrapped actions remain valid. Qualify actual enforcement without a private
task schema, duplicate validator, or extra default gate.

Qualify DDWG, AIGW CLI, and Codex Responses Proxy against the same accepted
product source and wheel, at each installed binding, exact source plan/proof,
and acceptance. Version labels or another language's success do not substitute.
Each adopter retains its own Change, lane, ledger, installer, and evidence; DDWG
consumes joint qualification, not their broader product work or permission to
edit foreign lanes. Pending dependencies do not stop independent work.

## Risks / Trade-offs

Native delegation removes duplicate policy, but consumer selection, diagnostics,
and retirement still need representative public journeys and focused
regressions. Editorial judgment preserves meaning without mechanically proving
complete equivalence or adoption. Preserve dissent and evidence limits rather
than infer quality from tests, a majority, or a polished layout.

Freeze source and bundle before expensive platform qualification. Compare actual
build inputs after progress-only commits; refresh exact-HEAD proof separately
without replacing published tags or bytes. Assess compatibility against the
effective contract: corrected omissions may be fixes, changed duties need their
own assessment. Preserve accepted releases.

Product gaps do not waive admission. An authorized emergency exception covers
only its exact effect with preserved cause and immediate restoration and
acceptance; it cannot patch immutable runtime or manufacture proof.

## Migration Plan

1. Reproduce the gap at its owner and retain the native failure and distinguishing
   regression.
2. Repair implementation, tests, guidance, and references together; migrate
   consumers and retire replaced code or configuration in the same batch.
3. Review all current topics and original clauses. Resolve omissions and obsolete
   rules with justified dispositions, preserving task identities and duties.
4. Qualify accepted shared quality, formatting, risk, history, CUE, and size
   contracts at DDWG and the required actual AIGW/Proxy bindings.
5. Freeze compatible final source and bundle. Qualify local and cold checks,
   trusted signature, exact-HEAD proof, both source/offline matrices, Releases,
   independent download hashes, and every claimed host.
6. Audit requirements and evidence, sync officially, and retire absorbed resources
   after consumer, hash, permission, and native-inventory checks. Complete archive
   prerequisites without claiming its future Git effects.
7. Archive officially, inspect/sign/prove/publish its new OID, observe both source
   matrices, and natively retire the owned lane, proposal ref, and exact residue.

Proposal refs are disposable projections: retire them through native CAS after
both peers accept the source and declared jobs pass. Later work may recreate
them; the active lane and Change remain until their obligations close. Archive
requires completed prerequisites, not evidence of its own future commit. Observe
post-archive effects through native owners without a second ledger, old-HEAD
proof, false checkboxes, or premature Goal completion.

## Open Questions

No unresolved choice requires user input. Accepted shared-product distribution
and actual adopter schemas remain integration prerequisites, not assumed
implementations or grounds to archive unfinished work.

[baseline-review-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-30-work-guidance-completeness/design.md
[baseline-review-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/c8599ce9c91ed5f988abd6b3f3011ac94430283d/openspec/changes/archive/2026-09-30-work-guidance-completeness/design.md
[previous-design-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/blob/934293b8a6ab0600af75ea86fbdbdf36c46d1bd9/openspec/changes/native-document-quality/design.md
[previous-design-github]: https://github.com/HengYangDS/data-department-work-guidelines/blob/934293b8a6ab0600af75ea86fbdbdf36c46d1bd9/openspec/changes/native-document-quality/design.md
