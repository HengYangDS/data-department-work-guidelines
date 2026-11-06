## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-beta.4 today. The GitHub workflow and the GitLab
pipeline each run a Windows job that installs ETHOS from that declaration, so this repository takes
a release only when it publishes Windows runtimes.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-beta.5, Windows included.
- Keep the 0.2.0-beta.4 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image, or the CI
  projection.
- Removing the local command fields from `.ethos/release.toml` or redacting the five links in
  immutable records, which follow ETHOS's later `peer-resolution` and `peer-identity-records`.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- Bind through the locked 0.2.0-beta.5 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-beta.4 fails under 0.2.0-beta.5] → The release candidate passed
  the full host gates of two other governed repositories before the tag. This lane runs the
  0.2.0-beta.5 gates after the bind, and the full proof runs at the archived head before landing. A
  failure is repaired at its owner, or the family binds the retained 0.2.0-beta.4 runtime again.
- [The Windows runtimes are qualified only by their release legs] → This repository's own GitHub
  and GitLab Windows jobs on the proposal are its Windows acceptance, and the landing waits for
  them.

- [The release ships supply with advisories that no stable upstream release fixes yet] → ETHOS
  records them: npm 12.2.2 still bundles `glob` 13.0.6 and `minimatch` 10.2.5, which no npm release
  fixes yet. This repository holds no npm of its own, so neither reaches its content.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, run the gates, prove the
archived head and qualify it on GitHub and GitLab, Windows included. To roll back, restore the
0.2.0-beta.4 declaration and lock in a new Change and bind the retained runtime with the current
console's `hook install --runtime <0.2.0-beta.4 runtime path>`.
