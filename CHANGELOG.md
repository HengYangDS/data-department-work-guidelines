# Changelog

All notable changes to the Data Department work guidelines are recorded here.
This file follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and editions follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

`VERSION` names the next edition. A changelog heading, accepted branch, or CI
result is not a signed tag or a Forge Release. Earlier branch editions had no
versioned release tags; their original records remain in Git history rather than
being relabeled as formal SemVer releases.

## [Unreleased]

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

[Unreleased]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.2.0...main
[4.2.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.1...v4.1.0
[4.0.1]: https://github.com/HengYangDS/data-department-work-guidelines/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/HengYangDS/data-department-work-guidelines/compare/b72b5e813ead5f5d5203ac7672eb72c8f32ecd1e...v4.0.0
