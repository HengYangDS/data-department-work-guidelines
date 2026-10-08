# Changelog

All notable changes to the Data Department work guidelines are recorded here.
This file follows
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and editions
follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

For release states and publication rules, see the
[release contract](docs/governance/ethos.md#versioned-releases).
Earlier branch editions had no versioned release tags; their original records
remain in Git history rather than being relabeled as formal SemVer releases.

## Unreleased

History: [GitLab][Unreleased-gitlab] · [GitHub][Unreleased-github]

### Added

- Share native Git exclusions for editor state and Finder metadata across
  contributor clones, without hiding guideline source.
- Make human–Agent delegation and acceptance visible in one native sequence
  diagram, with the complete text equivalent beside its rule owner. A diagram
  does not grant authority or establish acceptance.
- An explicit protected-source GitLab route for qualifying a frozen offline
  bundle before release. It reuses offline jobs without replaying source checks
  or treating the temporary qualification package as a signed Release.
- Report the verification source, native runtime, and mounted workspace capacity
  in existing source-check output. Preserve exact byte counts and read errors;
  this does not qualify VM identity, isolation, or throughput.
- A lightweight weekly sample-calibration default, with explained departures and
  a revisit time. Monthly mechanism review and quarterly net-benefit review
  remain separate; no new all-member meeting or report is required.

### Changed

- Replace duplicated working-loop and data-use diagrams with an ordered list
  and the existing decision table. Preserve every stage and return condition;
  remove custom diagram CSS and disconnected block layouts.
- Refresh the source and offline Node setup action to 7.1.0. Both workflows
  use one explicit Node version input without automatic package-manager caching.
- Preserve timing-based decision deferral and make clear that routine tasks need
  their agreed outcome, not an exceptional result every time.
- Make the comparison baseline explicit when framing a problem and require
  Agents to build the smallest sufficient model before expanding detail.
- Let native Windows ARM64 Node select the existing pinned compatible x64 tools
  through one installer, cache, and offline-bundle boundary. The asset selection
  does not by itself establish platform execution or timeout recovery.
- Preserve one complete native dependency scan and evaluate only the exact,
  expiring development approval. Keep project dependencies, the approved CI
  image, the pinned native-tool group, and the separately approved Lychee assets
  under their exact scopes.
- Update the native TOML formatter to 0.9.0 and compatible npm dependencies,
  with explicit pins for the audited Markdown parser and terminal-width fixes.
- Refresh the digest-pinned official Node 26 CI image on its supported Debian
  base.
- Shorten active OpenSpec Change documents and simplify governance navigation.
  Change tasks remain bounded implementation checklists; decision records hold
  durable rationale. Separate contributor procedures, governance boundaries,
  and native configuration guidance without repeating their policy or changing
  release order.
- Reduce repeated native-tool and Git observations and keep test fixtures focused
  on their declared inputs. Retain complete source validation, every distinct
  ancestry check, source-selection controls, policy, deadlines, and diagnostics.
- Load quality modules only for the selected contributor command. Standalone
  tests avoid unrelated check startup while retaining the full discovered suite,
  two workers, and the existing deadline.

### Fixed

- Restore the shared data-quality remit across acquisition, production, analysis,
  data science, platform, infrastructure, governance, and delivery. Feedback
  revisits value, meaning, and quality without granting a new use.
- Supply Git isolation with an owned empty configuration file rather than
  Node's null-device path, which Windows Git cannot read as configuration.
- Verify failed Git selection against the same native attempt's status and
  complete diagnostic, without assuming an English locale or replaying Git.
- Isolate managed-cache rejection fixtures from explicit host tool selectors.
  The contribution checks now exercise the intended cache boundary without
  changing the contributor's selected tools.
- Complete the structured context once in both `check` and `verify`, including
  the observed host name, before validation or formatter children write output.
  Keep standard output and error separate; failed writes stop both commands
  before validation or formatting.
- Use the configured full GitLab repository URL in release commands and read
  back the exact pipeline's project, tag, commit, and source. Clarify frozen
  bundle reuse at a Changelog-only cut and rebuilding after package changes.
- Restore fidelity, clarity, and elegance as writing aims: faithful meaning,
  accurate understanding conveyed fluently, and expressive beauty with aesthetic
  judgment and artistic and cultural refinement.
  Keep editorial techniques as applications rather than definitions.
- Ground emergency guidance in affected data, production, downstream use,
  permissions, and compliance. Name discoverer containment, responsible-person
  follow-through, escalation, and correction checks. Preserve the separate
  management duty to support members who honestly expose problems.
- Give Markdown spacing one owner: native formatting, with byte-exact examples
  preserved and independent non-spacing checks retained. Remove the competing
  list-spacing rule and unused dependencies.
- Accept tight-list fences at the native format fixed point without adding
  padding; retain separation around top-level fences and within loose lists.
- Correct an unreleased policy that treated every supply-chain advisory as
  approved. Reject unrelated or incomplete findings, changed artifacts, expired
  approvals, and stale dispositions; retain the original scan and failure output.
- Preserve the original cause when native installation, bundle construction,
  or cleanup fails. Keep authenticated transport diagnostics safe and refuse
  concurrent installation before it can remove another attempt's output.
- Bind release comparisons to adjacent tags and verify selected release metadata
  against the tagged commit. Prevent CI filters, checkout overrides, or job
  permissions from silently weakening the declared verification.
- Check actual source encoding, native Git text attributes, formatter controls,
  and literal filenames without skipping legitimate code or data examples.
  Preserve each default proof gate's declared evidence and network boundary.
- Require Linux ARM64 in GitHub source verification alongside Linux x64, macOS,
  and Windows. Source and offline checks share one declared platform contract;
  each hosted result still requires actual execution.
- Validate the requested offline-release tag even when GitHub dispatch starts
  from a branch. Use an explicit tag reference, not a same-name branch.
  Conflicting tags, invalid inputs, and tags that do not identify the verified
  source fail the existing release checks.
- Upgrade the native math renderer so inherited options cannot grant trusted
  rendering. Preserve Markdownlint tokens, ordinary math, and explicit trust
  through the existing consumer without waiving the dependency finding.
- Require a resolving action and revisit time for deferred decisions in Agent
  handoffs; a trigger alone cannot leave work waiting indefinitely.
- Restore the one-third editing exercise without a deletion quota or loss of
  facts, reasoning, limits, or responsibilities.
- Restore the ban on vague assurances across answers and meeting records, not
  only updates and escalations. Keep the rule in the communication topic.
- Require both Forges' declared verification deadlines, select worktree
  deletions consistently, preserve Git and public download failures, and keep
  unrelated prose fixtures independent of advisory review dates.
- Keep deleted-repository test fixtures from discovering an enclosing worktree,
  including during cold offline checks with source-local temporary storage.
- Restore data-entry stop and verification cues, accountable method selection,
  explicit data-change acceptance, and maintainer duties. Keep precautionary
  prevention separate from admission of department practice.
- Restore delivery's professional-decision boundary and the requirement for
  local rules to reference shared guidance. Clarify updates, continuation state,
  option evaluation, and human/Agent responsibilities.
- Report the actual npm version after offline installation, retain public
  download failure causes, and use portable native-tool selector names.
- Distinguish process from host architecture; retain actual offline input and
  runtime evidence without an advisory-expiry gate.
- Publish verified native tools atomically instead of exposing partial cache
  entries. Keep dependency fixtures independent of advisory review dates.
- Preserve package-manager output and native error causes, and test the actual
  release-download size limit. Distinguish supplied ABIs and hosted offline
  steps from host qualification and network isolation.
- Keep the prepared minor edition, complete local publication check, supported
  tool platforms, and Change authority descriptions consistent with their
  existing contracts.
- Make emergency containment reachable from the charter and delivery pages.
  Restore managers' timely resolution of cross-domain conflicts and
  long-standing open decisions, with concrete examples of judgment and
  communication. Require blocked reports to state impact, and keep old tools,
  identities, and sunk costs subordinate to verified facts. Route review,
  coaching, and cadence questions to their existing topic.
- Restore the justified single-lead default without weakening accountability,
  with explicit interface needs and delivery evidence. Keep L1 and L2 record
  duties at the charter's complete risk boundary.
- Require every completion condition and current passed verification matching
  the claim before declaring work complete. Bind Agent reports to the actual
  delivery state and execution to the delegated goal and scope, with explicit
  stop conditions.
- Preserve data availability, professional use cases, and permission as distinct
  judgments; keep each data owner's authority intact. Unmet completion
  conditions leave the work unfinished.
- Keep model simplification bounded by reality and restore effective recurrence
  prevention. Require prevention before the first failure when its triggers
  apply, including critical judgments that rely on a few people's tacit
  knowledge. Return downstream feedback to its responsible owner.
- Keep practice admission at one task-topic owner, and evidence calibration and
  audit acceptance at their responsible owners.
- Align dr-0001's filename with human–AI collaboration without changing its
  stable subject or accepted decision.
- Clarify working source versus signed-release content and publishable branches
  versus release tags. Distinguish live link checks from authenticated Forge
  history evidence, and GitHub outage updates from dual-Forge release
  qualification.
- Keep original errors, warnings, partial output, and cleanup causes visible in
  verification, installation, and downloads. Native prose and link-extraction
  warnings fail verification even when a tool exits successfully. Close rejected
  download responses before failure, without retries or unverified output.
- Prevent this project's GitLab Windows review, protected-branch, and offline
  jobs from competing for its reserved capacity. Keep trust boundaries and
  verification coverage unchanged.

## 7.0.12 - 2026-10-04

History: [GitLab][7.0.12-gitlab] · [GitHub][7.0.12-github]

### Fixed

- Keep online registry caches in a short, isolated temporary directory and
  remove them after success or failure. Preserve audit reports and diagnostics
  without leaving caches to break the next Windows checkout.
- Use native filesystem identity for OpenSpec report roots on Windows, including
  short-path aliases. Keep temporary format and lint checks bound to Git source,
  so installed dependencies and caches cannot masquerade as source files.
- Use native OSV dependency auditing with complete raw findings, bounded
  execution, and always-retained CI evidence. Limit the human-approved exception
  to its exact development input and expiry; unrelated findings still block.
- Supply official raw native binaries through the existing installer and
  offline bundle, checking exact sizes and digests without repackaging.
- Extract verified data and native-tool archives under the current executor's
  ownership, without requiring container permission to adopt a packaging
  machine's user identity. Preserve native failure and timeout diagnostics.
- Restore overwrite risk, mechanism analysis for delays and recurring disputes,
  immediate correction of disproved judgments, and meeting-decision ownership,
  deadlines, and completion criteria.
- Restore unverified citations as hard risks and the limits on using one
  metric to judge a person's overall worth or monthly review to rank people.
- Require correction after a boundary breach and visible document status in
  analysis, proposal, and decision titles.
- Preserve conflict resolution, the task lead's final judgment, necessary
  improvement before completion, and the limits of local metrics. Keep shared
  evidence calibration within the approved task and periodic review cadence.
- Restore the prohibition on uncoordinated shared edits and closing work of
  unknown ownership; make the charter table prohibit crossing limits.
- Clarify human result inspection, action-authority order, high-risk
  acceptance, actual data-change acceptance, provenance, and Agent execution.
  Restore honest-disclosure, score, capability-review, and emergency-accountability
  limits at their owners.
- Require Agents to read complete, current, claim-matched verification results
  before summarizing; selected success excerpts cannot replace that inspection.
- Require analytical conclusions to name their next verification action
  alongside confidence, limits, and the observation that would change the
  judgment.
- Preserve official OpenSpec findings instead of accepting successful summary
  totals alone. Reject warning output and incomplete, wrong-root, duplicate,
  or inconsistent reports at the existing verifier.
- Restore the Agent's stop conditions for an unidentified task owner, another
  person's uncommitted work, and work of unknown ownership. Name the task owner
  and supervisor in task-start calibration without adding a meeting or approval
  step.
- Check every Git-selected Markdown file with the native core and one TOML
  policy; ambient configuration can no longer hide source defects.
- Remove the redundant Markdown lint wrapper and its unused dependencies while
  retaining native rule diagnostics, literal filenames, and comment controls.
- Preserve meaningful blank lines in fenced and indented code through native
  Markdown rules while still rejecting padding between reader blocks.
- Resolve navigation through native GFM table cells; links truncated by a cell
  separator or outside the visible columns cannot satisfy a reader route.
- Keep single-paragraph list items together even when their text wraps; check
  genuinely multi-block lists for consistent separation with the native rule.
  Separate general rule-change, review, and management duties from neighboring
  paragraphs without changing their scope.
- Preserve meaningful blank lines in code and data strings; native TOML
  formatting checks syntax and layout without changing values or comments.

### Removed

- Retire completed Change copies from the current tree after obligation and
  consumer review. Historical references retain exact Git provenance on both
  Forges; original source, tags, and verification evidence remain unchanged.

## 7.0.11 - 2026-10-03

History: [GitLab][7.0.11-gitlab] · [GitHub][7.0.11-github]

### Fixed

- Update the decision check's native shell lexer to the stable release,
  preserving compound-command boundaries, quoted text, and ordinary rationale
  without executing inspected input.

## 7.0.10 - 2026-10-03

History: [GitLab][7.0.10-gitlab] · [GitHub][7.0.10-github]

### Fixed

- Resolve reader navigation from actual Markdown links and visible opening
  cues; hidden examples no longer satisfy routes, and legitimate titles and
  references remain usable.
- Make source-link and concurrent-install tests independent of earlier runs and
  native-tool caches. Source confinement, exclusive installation, and retained
  cache permissions remain required.

## 7.0.9 - 2026-10-02

History: [GitLab][7.0.9-gitlab] · [GitHub][7.0.9-github]

### Fixed

- Reject prose defects before unrelated native source prerequisites, and
  inspect release-tag types in one native Git observation. All checks and
  deadlines remain required.
- Balance native prose tests across the bounded workers and batch independent
  samples without losing inputs, findings, or source-preservation checks.

## 7.0.8 - 2026-10-02

History: [GitLab][7.0.8-gitlab] · [GitHub][7.0.8-github]

### Fixed

- Run the complete documentation test inventory with at most two concurrent
  test files, avoiding CPU-dependent oversubscription on shared runners.
  Existing deadlines and every quality boundary remain unchanged.
- Test OpenSpec's offline environment at its actual invocation owner without
  repeating unrelated repository prerequisites. Full source verification still
  executes the real pinned tool.

## 7.0.7 - 2026-10-02

History: [GitLab][7.0.7-gitlab] · [GitHub][7.0.7-github]

### Fixed

- Decision guidance again requires the actual decision, decision owner, date,
  and basis in the existing work record. A deadline does not establish when
  approval occurred.
- Task guidance uses plain language for existing work records and actual
  publication. Responsibilities and acceptance requirements are unchanged.
- Evolution guidance again requires reusable prevention when a problem spans
  work cycles, even without recurrence or impact across people or projects.
- Offline bundle acquisition preserves completed downloads when another
  concurrent call fails.
- Managed binary caches and bundle-download paths reject linked parents
  without changing existing binary permissions or external files. Offline
  source checks suppress OpenSpec's outbound requests for
  that invocation without changing the user's global settings.

## 7.0.6 - 2026-10-02

History: [GitLab][7.0.6-gitlab] · [GitHub][7.0.6-github]

### Fixed

- Changelog versions no longer send readers implicitly to one Forge. Every
  section offers clearly labeled GitLab and GitHub history with matching refs
  at the declared repositories. Version headings remain local; one unchanged
  source serves both platforms and offline readers.

## 7.0.5 - 2026-10-02

History: [GitLab][7.0.5-gitlab] · [GitHub][7.0.5-github]

### Changed

- Updated pinned native Vale to stable 3.24.0 and refreshed source-bound offline
  supply. The two existing prose rules carry native test cases; official rule
  coverage rejects a rule that loads but matches none of its examples. Real
  document and configuration tests remain in the same verification graph.

### Fixed

- Formatting checks every Git-selected format supported by native Prettier,
  including code outside the usual directories and tracked files under normally
  ignored paths. Ambient ignore files no longer exempt source; ignored
  untracked files remain untouched.
- Prose and link checks no longer silently omit tracked current Markdown under
  normally ignored directory names. Native Git selection still excludes ignored
  untracked state; official archives retain their historical boundary.
- Governance and profile descriptions distinguish JavaScript syntax checking
  from semantic correctness and identify native test reports that omit runtime
  warnings. Passing those reports does not establish the shared semantic,
  diagnostic, or subject-applicability contract. This documentation correction
  does not claim an ETHOS product repair or cross-adopter acceptance.

## 7.0.4 - 2026-10-01

History: [GitLab][7.0.4-gitlab] · [GitHub][7.0.4-github]

### Fixed

- Historical analysis explicitly checks sample-selection bias and explains how
  missingness, delay, conflict, and anomalies affect conclusions. Agents should
  continue with stated assumptions when missing context is not blocking;
  uncertain facts or authority still stop the affected action.
- Local links cannot rely on an ignored cache file, Git metadata, or an
  undelivered alias that happens to exist on the validating host. Valid source
  files, directory routes, and internal aliases remain available; native lychee
  still checks target existence and fragments.
- GitLab source and offline verification jobs name their platform consistently.
  Shared steps use hidden native templates. Both source-event routes admit only
  `v*` tags without `/`; GitLab offline rules use the same family. GitHub offline
  acquisition retains its source and version checks. Runner capabilities and
  full verification remain unchanged.
- Governance routes contributors to the boundary they need, with separate
  authority, quality, supply, and runner sections. Existing decision records
  give clearer alternatives and evidence; their accepted choices are unchanged.
  OpenSpec supply requirements name the single Vale and lychee manifest.
- The OpenSpec entry runs the local official Node CLI directly rather than
  claiming npm execution cannot use a cached package. Its capability guide
  distinguishes new and modified paths, and its lifecycle guidance permits
  official Change-bound sync as well as archive. GitLab source prerequisites
  name both required native tools. Main specs are synchronized with the reviewed
  Change deltas without closing outstanding delivery obligations.
- Remote download retention keeps the latest qualified edition, one rollback,
  and required tool packages. Superseded attachments retire with an explicit
  notice while signed tags, original notes, and source history remain.

## 7.0.3 - 2026-10-01

History: [GitLab][7.0.3-gitlab] · [GitHub][7.0.3-github]

### Fixed

- Separated check policy, native tool supply, and release identity by
  responsibility. Prettier, Markdownlint, and lychee read native TOML directly;
  executable rules stay with their existing implementation.
- Removed duplicated package formatting and inline link policy, rejected
  misplaced or linked configuration, and verified native selection without
  ambient editor settings. Public commands and department duties are unchanged.

## 7.0.2 - 2026-10-01

History: [GitLab][7.0.2-gitlab] · [GitHub][7.0.2-github]

### Fixed

- Decision validation rejects reused stable IDs and empty sections. Meaningful
  links, lists, quotes, and tables remain valid; ordinary prose beginning with a
  JavaScript property name no longer crashes command classification.
- Replaced hand-written shell token parsing with a locked, non-evaluating lexer.
  Quoted, compound, glob, and selected literal-operand commands are rejected
  while bare paths and ordinary interpreter prose remain valid.
- Native-tool installation awaits bounded asynchronous cleanup before reporting
  success; persistent errors still fail instead of leaving temporary state
  unnoticed.

## 7.0.1 - 2026-10-01

History: [GitLab][7.0.1-gitlab] · [GitHub][7.0.1-github]

### Fixed

- Restored original duties lost during compression: explicit decision
  constraints and stable concepts; execution costs and milestones; professional
  data judgments, durable production, and working governance review and
  controls.
- Restored delivery priorities and unresolved decisions without borrowed
  authority, declared communication purpose, meeting focus and deadline
  escalation, measured expression, and precise Agent deliverables. Coaching
  preserves member judgment; managers must not make recurring individual rescue
  the operating model.
- Presented data ownership in a compact responsibility table without adding
  roles, forms, meetings, or a competing rule source.

## 7.0.0 - 2026-10-01

History: [GitLab][7.0.0-gitlab] · [GitHub][7.0.0-github]

### Changed

- **Breaking:** The contributor installer now selects Vale or lychee through one
  native-tool entry. Offline supply uses a new source-bound bundle schema
  containing both tools and their upstream notices; earlier bundles do not
  qualify this edition.
- Consolidated spelling, repeated-word, concise-expression, and terminology
  checks in native Vale. Reviewed substitutions replace the broad stop-word
  blacklist without treating authority, uncertainty, or passive voice as errors.

### Fixed

- Decision records reject additional and nested sections while preserving
  technical terms and evidence links. The native Markdown parser also recognizes
  explicit package license sections without treating examples as license
  notices.
- Actual document control comments cannot disable prose rules, including nested
  and entity-encoded comments; literal examples remain valid.

### Removed

- The textlint, CSpell, and write-good pipelines, their packages, configuration,
  and parser adapters. No alternate or optional retired checker remains.

## 6.1.1 - 2026-10-01

History: [GitLab][6.1.1-gitlab] · [GitHub][6.1.1-github]

### Fixed

- Decision records now reject quoted or list-nested terminal commands, task
  checkboxes, and code that imitates required section headings. The existing
  Markdown parser preserves meaningful rationale and evidence links.
- Decision records link to code and execution evidence instead of embedding code
  blocks or raw HTML that could hide task progress. Ordinary Markdown, inline
  terms and evidence links remain valid. Department duties are unchanged.

## 6.1.0 - 2026-10-01

History: [GitLab][6.1.0-gitlab] · [GitHub][6.1.0-github]

### Added

- Native prose and terminology checks for repeated words, filler, and technical
  terms in current Markdown, including headings and quoted reader examples.
  Code, deliberate uncertainty, and department obligations keep their meaning.

### Changed

- Extended source-bound offline tools with the same locked prose rules used by
  local verification and both CI planes.

### Fixed

- Bound native temporary-stage cleanup retries after the Windows tool installer
  reported a removal failure; persistent errors still fail.

## 6.0.1 - 2026-10-01

History: [GitLab][6.0.1-gitlab] · [GitHub][6.0.1-github]

### Changed

- Updated the native package-manager requirement to stable npm 12.2.0 and
  rebuilt source-bound offline supply. Department rules and tool dependencies
  remain unchanged.

## 6.0.0 - 2026-10-01

History: [GitLab][6.0.0-gitlab] · [GitHub][6.0.0-github]

### Changed

- **Breaking:** Contributor and CI commands now require the exact npm version in
  the native package manifest, rather than accepting Node's bundled npm. Offline
  installation retains that prerequisite and never updates the host.
- Bound offline supply to the complete package manifest so a changed native tool
  policy cannot reuse a formerly qualified bundle.

### Fixed

- Install the declared npm before hosted runtime caching, and resolve the
  actually selected npm on Windows rather than Node's older bundled copy.

### Removed

- The implicit GitHub CLI and credential requirement for public bundle
  downloads. The existing Node runtime retrieves the exact pinned asset.

## 5.2.4 - 2026-09-30

History: [GitLab][5.2.4-gitlab] · [GitHub][5.2.4-github]

### Changed

- Refreshed the compatible documentation-tool dependency closure and rebuilt its
  source-bound offline bundle. Direct tool versions, working rules, and reader
  routes remain unchanged.

## 5.2.3 - 2026-09-30

History: [GitLab][5.2.3-gitlab] · [GitHub][5.2.3-github]

### Fixed

- Restored omitted qualifiers for professional judgment, recorded scope
  decisions, incomplete Agent work, and management responsibility after a
  complete comparison with the former unified guideline.
- Clarified that meeting acceptance criteria does not grant an executor
  authority to accept the work, and that a blocked dependency leaves independent
  authorized work available.

## 5.2.2 - 2026-09-30

History: [GitLab][5.2.2-gitlab] · [GitHub][5.2.2-github]

### Changed

- Refreshed compatible transitive packages in the locked documentation toolchain
  and rebuilt its source-bound offline supply. Direct tool versions and the
  team's working rules remain unchanged.

## 5.2.1 - 2026-09-30

History: [GitLab][5.2.1-gitlab] · [GitHub][5.2.1-github]

### Fixed

- Split GitLab Linux review from protected source and offline jobs, with
  separate Runner capabilities and regression checks for cross-boundary routes.

## 5.2.0 - 2026-09-30

History: [GitLab][5.2.0-gitlab] · [GitHub][5.2.0-github]

### Added

- Declared GitLab macOS and Windows source and offline-release jobs alongside
  Linux, with separate native review and protected runner routes.

### Changed

- Refreshed the locked CSpell release to 10.3.6 for the next offline bundle.

### Fixed

- Rejected GitHub source workflows that omit an accepted or proposal trigger
  while retaining an otherwise valid three-system job.
- Rejected hidden job and step skips, tolerated failures, and matrix exclusions
  in hosted checks, plus hidden GitLab global setup or includes.
- Isolated the empty-cache offline test from inherited Windows npm configuration
  so a warm CI cache cannot mask a missing offline package.

## 5.1.0 - 2026-09-29

History: [GitLab][5.1.0-gitlab] · [GitHub][5.1.0-github]

### Added

- Added explicit post-tag live link qualification with pinned lychee while
  keeping source verification offline and broken comparison links fatal.

### Changed

- Removed the redundant npm-major pin from the Node toolchain and offline
  bundle. Release qualification now exercises the available npm against the
  locked package cache rather than treating a version number as portability.

### Fixed

- Documented the source-bound offline bundle build, signed dual-Forge release
  order, and separate retrieved-asset and host checks. The same frozen bundle
  bytes go to both Forges; independent rebuilds are not claimed byte-identical.
- Restored the follow-up rule: keep the subject, definitions, and evaluation
  criteria stable, or disclose and justify a changed frame.
- Kept registry metadata available to ETHOS while making the title the first
  visible content on GitLab and GitHub guidance pages.

## 5.0.6 - 2026-09-29

History: [GitLab][5.0.6-gitlab] · [GitHub][5.0.6-github]

### Fixed

- Bound the direct OpenSpec command to the installed locked package instead of a
  POSIX-only shim path or a global executable.
- Switched new GitLab jobs to the canonical Linux ARM64 container capability;
  immutable historical tags retain their original Runner selector.
- Removed the second Node test run from ETHOS's document gate while keeping the
  standalone verifier's full test coverage.

## 5.0.5 - 2026-09-29

History: [GitLab][5.0.5-gitlab] · [GitHub][5.0.5-github]

### Fixed

- Applied the existing format and lint checks to retained OpenSpec Markdown, and
  the one-blank-line rule to every repository text candidate, including archives
  and files without filename extensions.

## 5.0.4 - 2026-09-28

History: [GitLab][5.0.4-gitlab] · [GitHub][5.0.4-github]

### Fixed

- Kept explicitly selected files in the spelling check even when a CSpell ignore
  rule matches them; refreshed the locked CSpell tool and offline supply.

## 5.0.3 - 2026-09-28

History: [GitLab][5.0.3-gitlab] · [GitHub][5.0.3-github]

### Added

- Gave members and Agents one illustrative market-history decision path from
  point-in-time research through production and permitted use, with a concise
  communication and delegation example.

### Fixed

- Clarified task lead, decision owner, reviewer, and acceptor roles without
  imposing a form on light work; separated data admission from observed adoption
  and exposed fact-versus-action authority conflicts.
- Restored distinct data projections and production permission checks, Agent
  delegation constraints and verification time, correction signals, actionable
  status updates, and the boundary for making Agent output a durable fact.

## 5.0.2 - 2026-09-27

History: [GitLab][5.0.2-gitlab] · [GitHub][5.0.2-github]

### Fixed

- Removed host-specific extended attributes from the offline bundle and made
  archive warnings fail verification instead of silently passing on Linux.

## 5.0.1 - 2026-09-27

History: [GitLab][5.0.1-gitlab] · [GitHub][5.0.1-github]

### Fixed

- Aligned the changelog gate with Keep a Changelog's valid `[YANKED]` marker,
  category ordering, and first-release tag link while retaining release identity
  and comparison-ancestry checks.

## 5.0.0 - 2026-09-27

History: [GitLab][5.0.0-gitlab] · [GitHub][5.0.0-github]

### Changed

- **Breaking:** Documentation verification and its offline bundle now require
  Node 26 and npm 11 instead of Node 22 and npm 10. Updated the locked OpenSpec
  and Prettier tools to their current stable releases.

### Fixed

- Restored the three outcomes of a task; clarified who may decide versus what
  counts as evidence, how to divide a problem completely, and when exploratory
  data or code is ready for shared use.
- Reinstated monthly review of real work and weak signals and quarterly review
  of whether rules and tools earn their cost, without a mandatory weekly meeting
  or a new reporting form.
- Pinned GitLab CI to a digest-addressed Node 26 image admitted by the Linux
  ARM64 Runner's local-only image policy, removing a floating-tag pull from its
  declared job path.
- Reorganized canonical OpenSpec requirement prose to satisfy native strict
  validation without changing department work obligations.

## 4.2.1 - 2026-09-26

History: [GitLab][4.2.1-gitlab] · [GitHub][4.2.1-github]

### Fixed

- Closed a release-validation gap with a post-publication GitLab job that
  obtains the source-pinned bundle from the same project's package registry. It
  refuses redirects, altered bytes, and mismatched tags before installation;
  hosted success remains a separate release acceptance requirement.

## 4.2.0 - 2026-09-26

History: [GitLab][4.2.0-gitlab] · [GitHub][4.2.0-github]

### Added

- Added a source-pinned offline verification bundle and a local installer that
  uses a complete locked npm cache and pinned lychee assets without contacting
  either Forge during installation. Bundled third-party tools retain their own
  licenses; the repository's MIT grant remains for its source and documentation.

## 4.1.1 - 2026-09-26

History: [GitLab][4.1.1-gitlab] · [GitHub][4.1.1-github]

### Fixed

- Made GitLab CI obtain its SHA-256-pinned lychee archive from the same
  project's package registry instead of depending on GitHub Releases.

## 4.1.0 - 2026-09-26

History: [GitLab][4.1.0-gitlab] · [GitHub][4.1.0-github]

### Added

- Adopted the MIT license for repository source and associated documentation.

### Fixed

- Restored explicit evidence contrasts, diagnostic and solution criteria, Agent
  stop and scope checks, and accountable management boundaries in the existing
  English topic pages. The rejected fixed meeting cadence remains out.

## 4.0.1 - 2026-09-26

History: [GitLab][4.0.1-gitlab] · [GitHub][4.0.1-github]

### Fixed

- Reject history comparisons outside a release's ancestry and repair the
  `v4.0.0` comparison after the signed history rewrite.

## 4.0.0 - 2026-09-26

History: [GitLab][4.0.0-gitlab] · [GitHub][4.0.0-github]

### Added

- A task-oriented reading map with a short human entry and a bounded Agent
  entry.
- An independent GitHub repository and CI/CD plane alongside the organization’s
  GitLab publication plane.
- Locked spelling and dependency-audit checks in the shared documentation
  quality path.

### Changed

- **Breaking:** Replaced the former root monolith with a charter and semantic
  topic pages; current tracked guidance and OpenSpec text use English.
- Material repository changes use one official OpenSpec Change, while ETHOS owns
  Work Lanes, admission, proof, acceptance, and governed publication.
- Restored risk-scaled work obligations and review meanings in the short reader
  route without restoring the old fixed management cadence.
- New commits require scoped Conventional Commit subjects; historical identity
  correction is admitted only through ETHOS rather than a `.mailmap`.

### Removed

- Retired copied method packs, the unconsumed root evidence directory, fixed
  diagram/card quotas, and obsolete current-document scaffolds.
- Removed non-official `scope.toml` companions, redundant placeholders, and a
  superseded decision record from the present tree. Git retains their original
  objects without retroactive lifecycle certification.
- Removed browser-backed rendering and its CI supply chain after the sole
  diagram proved redundant with the surrounding guidance.

### Fixed

- Bound both hosted documentation checks to real Git checkouts and a common
  verification sequence while keeping local, GitLab, and GitHub results
  separate.
- Normalized tracked text checkout to LF across supported hosts.

[Unreleased-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.12...main
[Unreleased-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.12...main
[7.0.12-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.11...v7.0.12
[7.0.12-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.11...v7.0.12
[7.0.11-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.10...v7.0.11
[7.0.11-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.10...v7.0.11
[7.0.10-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.9...v7.0.10
[7.0.10-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.9...v7.0.10
[7.0.9-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.8...v7.0.9
[7.0.9-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.8...v7.0.9
[7.0.8-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.7...v7.0.8
[7.0.8-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.7...v7.0.8
[7.0.7-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.6...v7.0.7
[7.0.7-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.6...v7.0.7
[7.0.6-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.5...v7.0.6
[7.0.6-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.5...v7.0.6
[7.0.5-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.4...v7.0.5
[7.0.5-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.4...v7.0.5
[7.0.4-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.3...v7.0.4
[7.0.4-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.3...v7.0.4
[7.0.3-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.2...v7.0.3
[7.0.3-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.2...v7.0.3
[7.0.2-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.1...v7.0.2
[7.0.2-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.1...v7.0.2
[7.0.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v7.0.0...v7.0.1
[7.0.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.0...v7.0.1
[7.0.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v6.1.1...v7.0.0
[7.0.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.1.1...v7.0.0
[6.1.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v6.1.0...v6.1.1
[6.1.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.1.0...v6.1.1
[6.1.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v6.0.1...v6.1.0
[6.1.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.0.1...v6.1.0
[6.0.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v6.0.0...v6.0.1
[6.0.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.0.0...v6.0.1
[6.0.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.2.4...v6.0.0
[6.0.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.4...v6.0.0
[5.2.4-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.2.3...v5.2.4
[5.2.4-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.3...v5.2.4
[5.2.3-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.2.2...v5.2.3
[5.2.3-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.2...v5.2.3
[5.2.2-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.2.1...v5.2.2
[5.2.2-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.1...v5.2.2
[5.2.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.2.0...v5.2.1
[5.2.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.0...v5.2.1
[5.2.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.1.0...v5.2.0
[5.2.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.1.0...v5.2.0
[5.1.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.6...v5.1.0
[5.1.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.6...v5.1.0
[5.0.6-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.5...v5.0.6
[5.0.6-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.5...v5.0.6
[5.0.5-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.4...v5.0.5
[5.0.5-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.4...v5.0.5
[5.0.4-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.3...v5.0.4
[5.0.4-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.3...v5.0.4
[5.0.3-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.2...v5.0.3
[5.0.3-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.2...v5.0.3
[5.0.2-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.1...v5.0.2
[5.0.2-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.1...v5.0.2
[5.0.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v5.0.0...v5.0.1
[5.0.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.0...v5.0.1
[5.0.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.2.1...v5.0.0
[5.0.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.2.1...v5.0.0
[4.2.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.2.0...v4.2.1
[4.2.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.2.0...v4.2.1
[4.2.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.1.1...v4.2.0
[4.2.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.1...v4.2.0
[4.1.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.1.0...v4.1.1
[4.1.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.0...v4.1.1
[4.1.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.0.1...v4.1.0
[4.1.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.1...v4.1.0
[4.0.1-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/v4.0.0...v4.0.1
[4.0.1-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.0...v4.0.1
[4.0.0-gitlab]: http://192.168.64.101:18086/dig/misc/guidelines/data-department-work-guidelines/-/compare/b72b5e813ead5f5d5203ac7672eb72c8f32ecd1e...v4.0.0
[4.0.0-github]: https://github.com/HengYangDS/data-department-work-guidelines/compare/b72b5e813ead5f5d5203ac7672eb72c8f32ecd1e...v4.0.0
