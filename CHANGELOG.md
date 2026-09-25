# Changelog

This log records source editions and changes in the guidelines. An entry does
not by itself prove that a particular commit was published to either Forge,
passed hosted CI, or was used by the team. Tags and Forge Releases are separate
publication objects.

## [Unreleased]

- Converge retained repository text, including the present representation of
  archived OpenSpec material, on English. Preserve original Git objects and
  historical meaning; do not retroactively certify earlier work.

## [3.0.0] — 2026-09-25

### Guidelines and Reading

- **Breaking:** Replaced the long root document with a short charter and six
  task-oriented topics. Kept necessary obligations, not old paths or fixed
  counts of cards.
- Gave members, Agents, and document navigation distinct entries; each current
  rule has one semantic owner.
- Used lowercase stable filenames for decision records. DRs retain durable
  trade-offs rather than trial status or implementation logs.

### Quality and Governance

- Covered Prettier, Markdown lint, offline lychee links and fragments, metadata,
  and every present diagram. Positive and negative tests do not confuse card or
  diagram counts with quality.
- Made one official OpenSpec Change the carrier of each material change. ETHOS
  owns path attribution, Work Lanes, proof, and acceptance; the repository
  boundary check does not duplicate the lifecycle.
- Removed the unconsumed root `evidence/` directory, old trial templates, empty
  scaffolds, and copied method packs. Historical bytes remain in Git and
  official archives; past work is not retroactively certified.
- Declared a dual-Forge topology ETHOS can recognize. GitLab uses
  `ci-linux-arm64-docker`; GitHub uses hosted Ubuntu. Both invoke the same
  verifier. Linux CI obtains lychee from a pinned release with SHA-256
  verification; local installation does not require either Forge.
- Standardized proposal branches on `proposal/*`, retiring `submit/*`. Candidate
  and work branches do not publish.

### Limits of This Entry

- This entry does not itself prove which commit was accepted locally, the exact
  SHA or CI result at either Forge, or actual team use. Check each of those at
  its own owner and time.

## [2.2.2] — 2026-07-12

### Changes in 2.2.2

- Added the repository-bound `scripts/ethos-repo.sh`, which fixes the governed
  root and rejects a caller's `--root` override so the ETHOS implementation
  repository is not mistaken for the adopter.
- Added root-binding regression tests and, at that time, an optional
  repository-native gate descriptor for explicit adapter-contract verification.
  It was not part of the documentation adopter's default proof floor. Agent
  routes, hooks, OpenSpec, evidence, and skill guidance used the adapter.
- Called repository-native proof scripts through `bash` rather than relying on
  executable bits; the default code-correctness selection still had only
  document integrity and Markdown formatting.
- Repaired skill summaries, evidence summaries, evolution proof references, and
  format and link checks to make local ETHOS evidence reviewable.
- Clarified that this adopter used an external ETHOS runner; it did not claim
  the product had completed embedded-backend migration, shadow parity, or a
  product command-manual check.

### Limits of 2.2.2

- This edition did not prove that ETHOS had fixed default root resolution or
  completed embedded-backend migration or shadow parity.
- It did not prove GitLab publication, CI execution, hosted rendering, or team
  adoption.

## [2.2.1] — 2026-07-12

### Changes in 2.2.1

- Replaced “reduce everything, then derive everything” with “keep the essential
  without losing the real; read the situation and reason from evidence.” A
  minimal kernel serves understanding rather than forcing reality into one
  model.
- Completed the public documentation, evidence, claim, and evolution skeleton of
  the ETHOS adopter so local proof faced a full semantic contract rather than
  only custom document scripts.
- Moved Prettier configuration into `package.json` and removed the root
  `.prettierrc.json`, which ETHOS could mistake for generated output.
- Moved linked worktrees outside the repository root into the adjacent
  `data-department-work-guidelines-worktrees/` directory. Added `.idea/`,
  `.serena/`, and `.DS_Store` to shared ignores.

### Limits of 2.2.1

- Local semantic governance and quality gates did not establish GitLab
  publication, CI execution, hosted rendering, or actual team use and quality
  improvement.

## [2.2.0] — 2026-07-12

### Changes in 2.2.0

- Adopted ETHOS locally with an explicit `dev → candidate/dev → Work Lane` loop,
  Agent routing, and local evidence boundaries.
- Turned the chapter labels on the root task table into links to their actual
  text and added Agent start and review routes.
- Combined Markdown formatting, lint, links and fragments, and Mermaid rendering
  into locked local quality gates.

### Limits of 2.2.0

- Local ETHOS adoption did not establish configured GitLab CI, remote
  publication, hosted rendering, or actual team use.

## [2.1.0] — 2026-07-12

### Changes in 2.1.0

- Reworked the reading entry as “three-minute orientation → scenario route →
  detailed rule.”
- Added five renderable Mermaid diagrams and six scenario action cards to the
  then-single normative text.
- Made `README.md` and `AGENTS.md` member and Agent orientation entries rather
  than copies of the rules.
- Added repeatable document quality and visual rendering checks.

### Limits of 2.1.0

- That edition showed document readability and structural quality, not improved
  team work quality; a real pilot was still needed.

## [2.0.1] — 2026-07-12

### Changes in 2.0.1

- Renamed the overall relationship from “human–Agent collaboration” to “human–AI
  collaboration.”
- Defined it as people setting direction, intelligence extending capacity,
  collaboration on the work, and accountability remaining with people.
- Kept Agent as the name of a technical entity. The broader term names the
  working relationship and order of responsibility.
- Established “use intelligence to accomplish the task, judge against reality,
  and keep accountability human” as the chapter's working principle.

## [2.0.0] — 2026-07-10

### Added

- Published a common Data Department baseline for work quality and human–AI
  collaboration as the sole source of general rules.
- Set a Way-seeking principle layer: seek truth beyond appearance, notice change
  in small signals, fit method to subject, hold essentials through complexity,
  judge proportionately, give each role its place, and let completed work
  cultivate the system.
- Defined a trusted-delivery chain: authority → subject → commitment → change →
  evidence → claim → record.
- Defined a common data-quality contract covering source, time, meaning,
  transformation, quality, and controlled use.
- Established human–AI collaboration, completion claims, review calibration,
  practical coaching, and rule retirement.

### Boundary

- The edition was a work-quality baseline, not a job description, project plan,
  performance policy, or specific technical standard.
- Department-wide quality improvement had not been shown by operating data and
  required real-work trials, periodic calibration, and review.
