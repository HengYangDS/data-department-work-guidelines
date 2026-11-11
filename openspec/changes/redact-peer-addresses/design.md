## Context

See [proposal.md](proposal.md). The redaction verb works only inside the effective record roots: the
paradigm's immutable `openspec/changes/archive/` plus the profile's `record_roots`. On 12 November
2026 a keyless preview of `0624bdc9` under the 0.2.0-beta.8 candidate found five occurrences, one
peer URL on each of five lines: two inside the archive and three in `docs/decisions/`, which is
outside the roots until the profile declares it. The 0.2.0-beta.7 feed reported ten on the same
lines, because it also counted the project path inside each URL. The verb derives the
protected peer from the checkout's local Git configuration, so it runs in the lane, a worktree of
the canonical checkout; a clone without those keys sees an empty feed and a meaningless zero.

## Goals / Non-Goals

**Goals:**

- No current tracked file names the GitLab peer's host, port or project path.
- Every redacted occurrence carries a keyed marker that the owner's key verifies.

**Non-Goals:**

- Rewriting published history or any remote ref.
- Turning on `[peer_identity] mode = "required"`, which waits for ETHOS's empty-feed follow-up and
  takes its own decision.
- Changing any other content of the three files.

## Decisions

- Declare `docs/decisions/` as a record root instead of editing the records by hand, so that one
  native verb redacts all five lines and its verification covers them all.
- Read the owner's key from the login Keychain only into `--key-stdin`; it never reaches an
  argument, a log or a file.
- Verify with `--verify --key-stdin --base <base> --head <head>`, which re-derives the head and
  records the `redaction:private-peer` Attestation.

## Risks / Trade-offs

- [The verb meets an occurrence it cannot classify] → Apply refuses and changes nothing; the lane
  stops and the occurrence goes to ETHOS's owner.
- [A reader later needs the address] → Each peer's own Git configuration keeps it, and published
  history is unchanged.

## Migration Plan

Bind ETHOS 0.2.0-beta.8 first, in the same lane. Preview, declare the record root, preview again
until every occurrence is inside the roots, apply, preview for zero, verify, prove the archived
head, publish the proposal, land, publish `dev` and `main`, and retire the proposal refs and the
lane. To roll back, revert the lane's commits; the keyed markers then give way to the previous text.
