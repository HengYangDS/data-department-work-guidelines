## Context

See [proposal.md](proposal.md). The History rows were added on 2026-10-02 so that a reader could
compare editions on either Forge. Since 2026-11-05 the owner treats every peer coordinate in shared
content as a defect, because each peer receives the same files. The installed ETHOS 0.2.0-beta.4
checks the Changelog's structure, dates and order, and its release tag admission needs only the
released version's entry. It reads `forge_repository` when present and otherwise resolves the web
repository from the clone's Git configuration.

## Goals / Non-Goals

**Goals:**

- No tracked file outside the immutable records names a peer.
- Publication, review observation and release keep working on both peers.

**Non-Goals:**

- Redacting the five links in immutable records, which waits for ETHOS's redaction verb.
- Removing the local command fields, which ETHOS 0.2.0-beta.4 still requires.
- Rewriting Git history.

## Decisions

- Remove the History rows instead of pointing them at one peer. A row that names one peer still
  discloses it to the other, and the end state renders comparison links at release time.
- Keep the bracketed headings. ETHOS's heading rule and the Keep a Changelog form both use them,
  and an unresolved bracket is plain text, so no link is left behind.
- Drop `forge_repository` now, because every clone that publishes this repository already holds
  `remote.<name>.forgeRepository` with the same value, and a remote with a web URL needs nothing.

## Risks / Trade-offs

- [A clone without the local key and with a non-web remote cannot observe proposal reviews] →
  ETHOS reports that review state as unknown and names the native `git config` follow-up. The
  repository's own clones hold the key.
- [Readers lose the in-file comparison links] → Each Forge's own tag and compare views serve
  navigation, and ETHOS's planned release rendering restores links per peer.

## Migration Plan

Edit the four files, prove the archived head, and qualify the proposal on GitHub and GitLab. Then
land, publish `dev` and `main` to both peers, and check both peers' review observation once from the
local keys. To roll back, revert the commits through a new Change.
