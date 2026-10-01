# Design

## Context

The accepted source is `c8599ce9c91ed5f988abd6b3f3011ac94430283d`, edition
6.1.1. Its seven task topics already have a whole-original semantic comparison.
The current English path composes CSpell, textlint kernel, a custom write-good
source adapter, and separate terminology and stop-word rules. The textlint
Markdown processor also supplies DR parsing and the offline bundle's README
license reader. Replacing only the English checker would leave two executable
consumers; deleting packages before migrating them would break both boundaries.

Native Vale 3.23.0 rejects real spelling, repetition, term, and wordy-phrase
examples in paragraphs, emphasis, quotes, and tables. It preserves uncertainty,
inline code, fenced code, and URL destinations. The initial current-source
probe finds technical vocabulary omissions, not established writing defects.
Those terms require review before acceptance; no wildcard baseline is admitted.

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

The existing original-to-topic comparison identifies each retained duty and
deliberate removal. Before an English edit, record its actor, action, condition,
authority, evidence, and stop or revisit limit. Read the complete topic, edit it
for its reader, and compare the changed clauses with the original. Native style
results do not prove equivalence. A shorter or more polished sentence is invalid
if it drops a qualification.

### Preserve the seven-topic review boundary

The baseline comparison remains at
[the original-content review](../archive/2026-09-30-work-guidance-completeness/design.md).
The initial native-tool release rereads all seven topics and changes
presentation only. Charter
wording makes the same problem-resolution and judgment duties more direct;
the other changes remove repeated entry words or reflow clauses. The delivery
sentence still records both a material scope or risk change and its resolving
decision. Actor, obligation strength, permission, condition, evidence limit,
and escalation boundary remain unchanged. Monthly case calibration and
quarterly net-benefit review retain their minimum frequency and owners. The
edition identifier changes separately for the incompatible tool contract.

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
`deliverable`. Accept only that real term and its two normal inflections;
retain a misspelled near-match regression. Do not rewrite the obligation or
disable spelling to make the source pass.

This is a compatible correction of omitted original duties. Publish a patch
successor with its own source-bound bundle, exact-HEAD proof, and declared
platform acceptance. Preserve signed `v7.0.0`, its notes, and its asset bytes.
Update only the existing task ledger; keep shared ETHOS integration and final
archive open until their actual prerequisites are satisfied.

### Separate English and Markdown responsibilities

Vale owns spelling, repeated words, selected terminology, and diagnosed wordy
or stock phrases. Native configuration and vocabulary contain the selected
policy; the wrapper only chooses explicit current files, a verified executable,
and fixed native arguments. There is no custom NLP or source-mapping engine.

Markdown lint owns syntax and parsed comment controls. Its supported parser
identifies actual comments before checking Vale's control grammar. Literal code,
escaped examples, normal comments, and evidence links remain valid. The same
native Markdown parser must replace both the textlint DR parser and the README
license reader before their remaining packages are removed. Existing decision
and license counterexamples are retained, not weakened to fit a new parser.
The license reader admits an explicit matching License section, not incidental
prose, fenced examples, empty sections, or a mismatched declaration. It preserves
upstream notice bytes and resolves the npm parser only during bundle building;
cold installation must work before npm dependencies are installed.

### Complete the existing decision boundary

Adversarial review of source `d8b6853f069ae1a414ee32f483a1fd4785bf8e91`
found three gaps in the migrated owner. A sentence beginning with `constructor`,
`toString`, or another inherited property crashes command classification.
Separate current DRs can reuse one stable ID even when their document subjects
differ. Five empty headings also pass despite carrying no decision rationale.

Use only own command-table properties. Return the already validated stable ID
to the existing tree check, which rejects duplicates without parsing the
document again. Inspect the existing native paragraph and table-cell tokens between
each required pair of headings for readable content. Links, lists, quoted
rationale, and decision tables remain valid; whitespace, thematic breaks, and
reference definitions alone do not supply a section's content. No word count,
NLP classifier, second Markdown parser, or lifecycle gate is introduced. This structural
check cannot judge whether a nonempty argument is sound.

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
Retain execution-content counterexamples and ordinary prose positives, then
run the complete verifier. Record upcoming fixes under `Unreleased` and qualify
the final patch separately; do not move an existing release tag or replace its
bundle.

The compatible checker correction is prepared as v7.0.2. Department duties,
member routes, and contributor commands do not change; the dependency and
offline bundle do. Keep its notes under `Unreleased` until the release cut,
then qualify its exact signed source and immutable package independently.

GitLab Windows source jobs at the release-cut identity failed during native
installer cleanup, before documentation verification. The source uses one
synchronous removal with three 100-millisecond linear retries. Replace it with
one awaited native asynchronous removal in the already asynchronous installer:
ten 200-millisecond linear retries, confined to its own fresh extraction stage.
The installer cannot report success until removal finishes; a persistent error
still fails. No custom retry loop, platform shell, security override, or second
cleanup path is added. Focused tests prove awaiting and failure propagation;
the actual Windows source job must prove platform acceptance. A permission
error alone does not identify a particular lock owner or security product.

Keep identity and section completeness separate from the execution-content
requirement. Appending both responsibilities to one long requirement produced
an official INFO finding that the current ETHOS runtime blocks before proof.
Separate the obligations and retain all scenarios; do not drop a qualification,
disable native validation, or misreport that product behavior as repaired.

The former stop-word dictionary includes ordinary domain words that already
needed exclusions. Native rule selection must preserve the promised defect
categories and real negative cases without imposing a large inherited blacklist
on department language. A policy difference belongs in this major Change, not a
silent exception or a claim that the previous rule was never used.

### Remove the replaced owner completely

Migrate all three consumers before removing the retired direct dependencies:
`@textlint/kernel`, `@textlint/textlint-plugin-markdown`,
`textlint-rule-stop-words`, `textlint-rule-terminology`,
`textlint-util-to-string`, `write-good`, and `cspell`. Use the native npm resolver
to remove their unneeded transitive packages from the lockfile and installed
graph. Remove the old rule configurations, imports, adapters, standalone
commands, test interfaces, and current contributor and governance guidance.
No alternate parser, compatibility facade, fallback, or optional checker remains.

Final acceptance pairs native responsibility tests with a current-consumer and
dependency-graph audit. A working Vale command alone does not prove retirement.
Immutable release and official archive bytes are evidence of earlier source,
not installable dependencies, current commands, or a second implementation.

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

The bundle binds the complete package and native-tool manifests. Previous
lychee-only bundles do not qualify the changed source. The same frozen new
bundle, not independent rebuilds, goes to both Forges. Windows uses the ABI of
the actual Node process; emulation cannot be relabeled as native ABI coverage.

### Keep one current package-manager contract

The older multiple-npm qualification scenario conflicts with the later exact
native npm declaration. Retire that duplicate requirement, not the operational
checks it carried. Exact npm admission, observed version, cold execution, source
binding, and the audit boundary remain at their existing owners. Do not keep
both compatibility claims or rewrite old archives to hide their sequence.

### Deliver the complete transition

Contributor commands and the offline bundle contract change incompatibly, so
the next edition is major under SemVer. Complete the implementation and local
negative tests, freeze source and bundle, qualify clean offline execution, obtain
exact-HEAD installed proof, and publish through each Forge independently.
Observe source and offline jobs on every declared platform. Archive and retire
the lane only after its own required work is complete.

Shared ETHOS fixes are accepted only through their actual formal product
contract. Repository-native tests cannot certify that product. If that dependency
is unavailable, complete independent local work and leave dependent tasks open;
never mark this Change complete or archive to obtain a green lifecycle.

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
6. Archive officially, prove the archive commit, and retire exact disposable
   state while preserving required evidence.

## Open Questions

None require user input. The accepted shared ETHOS native evidence contract is
an integration dependency whose actual schema must be consumed when available.
