## Context

See proposal.md. A trial in a scratch copy showed that `mise lock` with the narrower `lockfile_platforms` removes exactly
the two Windows tables and leaves the macOS and Linux tables unchanged.

## Goals / Non-Goals

**Goals:**

- No Windows platform in this repository's configuration, lock, CI or current specifications.

**Non-Goals:**

- Removing the Linux rows: the owner removed Windows, not Linux, and contributors may install on Linux.
- Upgrading the lock's format; the warning from Mise about format version 3 is a separate change.
- Rewriting history: archived Changes and the Changelog keep their Windows mentions.

## Decisions

- **Scenario title.** Titles are identity, so the scenario keeps its title and its text says that the repository
  declares only ARM macOS jobs, which leaves no executor to share.
- **Edition.** A compatible removal of an unused platform: a patch, 10.1.1.

## Risks / Trade-offs

- A contributor on Windows can no longer install the locked ETHOS from this repository; the owner chose this.
