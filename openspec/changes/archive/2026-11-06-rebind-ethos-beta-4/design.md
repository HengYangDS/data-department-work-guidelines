## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-beta.2 today. The GitHub workflow and the GitLab
pipeline each run a Windows job that installs ETHOS from that declaration, so this repository can
take only a release that publishes Windows runtimes. 0.2.0-beta.3 published none, and 0.2.0-beta.4
publishes them again. The common CI model of 0.2.0-beta.4 generates the same pipelines as
0.2.0-beta.2: `ethos lane project --check` under the candidate code reported this repository
`conforming` before the release.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-beta.4, Windows included.
- Keep the 0.2.0-beta.2 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image, or the CI
  projection.
- Moving the forge identity or the Changelog's link format, which follow ETHOS's
  `peer-neutral-artifacts` in a later Change.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- Bind through the locked 0.2.0-beta.4 console, so the selected runtime is the one the lock
  declares.
- Skip 0.2.0-beta.3. Its journey qualified only Linux and macOS upgrades, and its declaration has no
  Windows platform, which this repository's Windows jobs need.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.2 fails under 0.2.0-beta.4] → The candidate code's gates
  passed on this repository before the tag, the lane runs the 0.2.0-beta.4 gates after the bind,
  and the full proof runs at the archived head before landing. A failure is repaired at its owner,
  or the family binds the retained 0.2.0-beta.2 runtime again.
- [The Windows runtimes are qualified only by their release legs] → No hosted adopter journey runs
  on Windows yet. This repository's own GitHub and GitLab Windows jobs on the proposal are its
  Windows acceptance, and the landing waits for them.
- [A commit message names a private-class address] → The admission refuses it with
  `commit_message_private_address` and names the class, never the address. This repository's
  commit messages name no such address.
- [The release ships supply with advisories that no stable upstream release fixes yet] → ETHOS
  records them: npm 12.2.2 still bundles `glob` 13.0.6 and `minimatch` 10.2.5, which no npm release
  fixes yet. This repository holds no npm of its own, so neither reaches its content.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, run the gates, prove the
archived head and qualify it on GitHub and GitLab, Windows included. To roll back, restore the
0.2.0-beta.2 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-beta.2 runtime path>`.
