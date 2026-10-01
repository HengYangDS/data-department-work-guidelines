# Changelog

All notable changes to the Data Department work guidelines are recorded here.
This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and editions follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

`VERSION` names the next edition. Keep upcoming notes under `Unreleased` until
the release is cut; only then give the edition its actual date. A changelog
heading, accepted branch, or CI result is not a signed tag or a Forge Release.
Earlier branch editions had no versioned release tags; their original records
remain in Git history rather than being relabeled as formal SemVer releases.

## [Unreleased]

## [7.0.3] - 2026-10-01

### Fixed

- Separated check policy, native tool supply, and release identity by
  responsibility. Prettier, Markdownlint, and lychee read native TOML directly;
  executable rules stay with their existing implementation.
- Removed duplicated package formatting and inline link policy, rejected
  misplaced or linked configuration, and verified native selection without
  ambient editor settings. Public commands and department duties are unchanged.

## [7.0.2] - 2026-10-01

### Fixed

- Decision validation rejects reused stable IDs and empty sections. Meaningful
  links, lists, quotes, and tables remain valid; ordinary prose beginning with
  a JavaScript property name no longer crashes command classification.
- Replaced hand-written shell token parsing with a locked, non-evaluating
  lexer. Quoted, compound, glob, and selected literal-operand commands are
  rejected while bare paths and ordinary interpreter prose remain valid.
- Native-tool installation awaits bounded asynchronous cleanup before reporting
  success; persistent errors still fail instead of leaving temporary state
  unnoticed.

## [7.0.1] - 2026-10-01

### Fixed

- Restored original duties lost during compression: explicit decision constraints
  and stable concepts; execution costs and milestones; professional data
  judgments, durable production, and working governance review and controls.
- Restored delivery priorities and unresolved decisions without borrowed
  authority, declared communication purpose, meeting focus and deadline
  escalation, measured expression, and precise Agent deliverables. Coaching
  preserves member judgment; managers must not make recurring individual rescue
  the operating model.
- Presented data ownership in a compact responsibility table without adding
  roles, forms, meetings, or a competing rule source.

## [7.0.0] - 2026-10-01

### Changed

- **Breaking:** The contributor installer now selects Vale or lychee through
  one native-tool entry. Offline supply uses a new source-bound bundle schema
  containing both tools and their upstream notices; earlier bundles do not
  qualify this edition.
- Consolidated spelling, repeated-word, concise-expression, and terminology
  checks in native Vale. Reviewed substitutions replace the broad stop-word
  blacklist without treating authority, uncertainty, or passive voice as errors.

### Fixed

- Decision records reject additional and nested sections while preserving
  technical terms and evidence links. The native Markdown parser also recognizes
  explicit package license sections without treating examples as license notices.
- Actual document control comments cannot disable prose rules, including nested
  and entity-encoded comments; literal examples remain valid.

### Removed

- The textlint, CSpell, and write-good pipelines, their packages, configuration,
  and parser adapters. No alternate or optional retired checker remains.

## [6.1.1] - 2026-10-01

### Fixed

- Decision records now reject quoted or list-nested terminal commands, task
  checkboxes, and code that imitates required section headings. The existing
  Markdown parser preserves meaningful rationale and evidence links.
- Decision records link to code and execution evidence instead of embedding
  code blocks or raw HTML that could hide task progress. Ordinary Markdown,
  inline terms and evidence links remain valid. Department duties are unchanged.

## [6.1.0] - 2026-10-01

### Added

- Native prose and terminology checks for repeated words, filler, and technical
  terms in current Markdown, including headings and quoted reader examples.
  Code, deliberate uncertainty, and department obligations keep their meaning.

### Changed

- Extended source-bound offline tools with the same locked prose rules used by
  local verification and both CI planes.

### Fixed

- Bound native temporary-stage cleanup retries after the Windows tool
  installer reported a removal failure; persistent errors still fail.

## [6.0.1] - 2026-10-01

### Changed

- Updated the native package-manager requirement to stable npm 12.2.0 and
  rebuilt source-bound offline supply. Department rules and tool dependencies
  remain unchanged.

## [6.0.0] - 2026-10-01

### Changed

- **Breaking:** Contributor and CI commands now require the exact npm version
  in the native package manifest, rather than accepting Node's bundled npm.
  Offline installation retains that prerequisite and never updates the host.
- Bound offline supply to the complete package manifest so a changed native
  tool policy cannot reuse a formerly qualified bundle.

### Fixed

- Install the declared npm before hosted runtime caching, and resolve the
  actually selected npm on Windows rather than Node's older bundled copy.

### Removed

- The implicit GitHub CLI and credential requirement for public bundle
  downloads. The existing Node runtime retrieves the exact pinned asset.

## [5.2.4] - 2026-09-30

### Changed

- Refreshed the compatible documentation-tool dependency closure and rebuilt
  its source-bound offline bundle. Direct tool versions, working rules, and
  reader routes remain unchanged.

## [5.2.3] - 2026-09-30

### Fixed

- Restored omitted qualifiers for professional judgment, recorded scope
  decisions, incomplete Agent work, and management responsibility after a
  complete comparison with the former unified guideline.
- Clarified that meeting acceptance criteria does not grant an executor
  authority to accept the work, and that a blocked dependency leaves
  independent authorized work available.

## [5.2.2] - 2026-09-30

### Changed

- Refreshed compatible transitive packages in the locked documentation
  toolchain and rebuilt its source-bound offline supply. Direct tool versions
  and the team's working rules remain unchanged.

## [5.2.1] - 2026-09-30

### Fixed

- Split GitLab Linux review from protected source and offline jobs, with
  separate Runner capabilities and regression checks for cross-boundary routes.

## [5.2.0] - 2026-09-30

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

## [5.1.0] - 2026-09-29

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

## [5.0.6] - 2026-09-29

### Fixed

- Bound the direct OpenSpec command to the installed locked package instead of
  a POSIX-only shim path or a global executable.
- Switched new GitLab jobs to the canonical Linux ARM64 container capability;
  immutable historical tags retain their original Runner selector.
- Removed the second Node test run from ETHOS's document gate while keeping the
  standalone verifier's full test coverage.

## [5.0.5] - 2026-09-29

### Fixed

- Applied the existing format and lint checks to retained OpenSpec Markdown,
  and the one-blank-line rule to every repository text candidate, including
  archives and files without filename extensions.

## [5.0.4] - 2026-09-28

### Fixed

- Kept explicitly selected files in the spelling check even when a CSpell
  ignore rule matches them; refreshed the locked CSpell tool and offline supply.

## [5.0.3] - 2026-09-28

### Added

- Gave members and Agents one illustrative market-history decision path from
  point-in-time research through production and permitted use, with a concise
  communication and delegation example.

### Fixed

- Clarified task lead, decision owner, reviewer, and acceptor roles without
  imposing a form on light work; separated data admission from observed
  adoption and exposed fact-versus-action authority conflicts.
- Restored distinct data projections and production permission checks, Agent
  delegation constraints and verification time, correction signals, actionable
  status updates, and the boundary for making Agent output a durable fact.

## [5.0.2] - 2026-09-27

### Fixed

- Removed host-specific extended attributes from the offline bundle and made
  archive warnings fail verification instead of silently passing on Linux.

## [5.0.1] - 2026-09-27

### Fixed

- Aligned the changelog gate with Keep a Changelog's valid `[YANKED]` marker,
  category ordering, and first-release tag link while retaining release
  identity and comparison-ancestry checks.

## [5.0.0] - 2026-09-27

### Changed

- **Breaking:** Documentation verification and its offline bundle now require
  Node 26 and npm 11 instead of Node 22 and npm 10. Updated the locked OpenSpec
  and Prettier tools to their current stable releases.

### Fixed

- Restored the three outcomes of a task; clarified who may decide versus
  what counts as evidence, how to divide a problem completely, and when
  exploratory data or code is ready for shared use.
- Reinstated monthly review of real work and weak signals and quarterly
  review of whether rules and tools earn their cost, without a mandatory
  weekly meeting or a new reporting form.
- Pinned GitLab CI to a digest-addressed Node 26 image admitted by the Linux
  ARM64 Runner's local-only image policy, removing a floating-tag pull from its
  declared job path.
- Reorganized canonical OpenSpec requirement prose to satisfy native strict
  validation without changing department work obligations.

## [4.2.1] - 2026-09-26

### Fixed

- Closed a release-validation gap with a post-publication GitLab job that
  obtains the source-pinned bundle from the same project's package registry.
  It refuses redirects, altered bytes, and mismatched tags before installation;
  hosted success remains a separate release acceptance requirement.

## [4.2.0] - 2026-09-26

### Added

- Added a source-pinned offline verification bundle and a local installer that
  uses a complete locked npm cache and pinned lychee assets without contacting
  either Forge during installation. Bundled third-party tools retain their own
  licenses; the repository's MIT grant remains for its source and documentation.

## [4.1.1] - 2026-09-26

### Fixed

- Made GitLab CI obtain its SHA-256-pinned lychee archive from the same
  project's package registry instead of depending on GitHub Releases.

## [4.1.0] - 2026-09-26

### Added

- Adopted the MIT license for repository source and associated documentation.

### Fixed

- Restored explicit evidence contrasts, diagnostic and solution criteria,
  Agent stop and scope checks, and accountable management boundaries in the
  existing English topic pages. The rejected fixed meeting cadence remains out.

## [4.0.1] - 2026-09-26

### Fixed

- Reject history comparisons outside a release's ancestry and repair the
  `v4.0.0` comparison after the signed history rewrite.

## [4.0.0] - 2026-09-26

### Added

- A task-oriented reading map with a short human entry and a bounded Agent entry.
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
  verification sequence while keeping local, GitLab, and GitHub results separate.
- Normalized tracked text checkout to LF across supported hosts.

[Unreleased]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.3...main
[7.0.3]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.2...v7.0.3
[7.0.2]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.1...v7.0.2
[7.0.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v7.0.0...v7.0.1
[7.0.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.1.1...v7.0.0
[6.1.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.1.0...v6.1.1
[6.1.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.0.1...v6.1.0
[6.0.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.4...v6.0.0
[5.2.4]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.3...v5.2.4
[5.2.3]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.2...v5.2.3
[5.2.2]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.1...v5.2.2
[5.2.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.2.0...v5.2.1
[5.2.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.6...v5.1.0
[5.0.6]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.5...v5.0.6
[5.0.5]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.4...v5.0.5
[5.0.4]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.3...v5.0.4
[5.0.3]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.2...v5.0.3
[5.0.2]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.1...v5.0.2
[5.0.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.2.1...v5.0.0
[4.2.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.1...v4.1.0
[4.0.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/b72b5e813ead5f5d5203ac7672eb72c8f32ecd1e...v4.0.0
