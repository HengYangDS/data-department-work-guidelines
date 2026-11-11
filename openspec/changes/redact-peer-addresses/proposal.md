## Why

The owner decided on 8 November 2026 that the GitLab peer's address leaves the current tracked
files, while published history stays as it is. Three tracked files still name it: the decision
records DR-0001 and DR-0004 and the archived design of `native-document-quality`. ETHOS 0.2.0-beta.7
adds `ethos lane redact private-addresses`, which replaces each occurrence inside the effective
record roots with a keyed marker that only the owner's key can verify. 0.2.0-beta.8 reads the
host, port and namespace path of a remote's `forgeRepository`, so the verb sees each peer URL as one
occurrence.

## What Changes

- Declare `record_roots = ["docs/decisions/"]` in `.ethos/profile.toml`, so that the decision
  records join the archived Changes as record roots.
- Redact the five occurrences, one peer URL on each of five lines, with the owner's key, and verify
  the redaction.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.ethos/profile.toml`, `docs/decisions/dr-0001-human-ai-collaboration.md`,
`docs/decisions/dr-0004-official-lifecycle.md` and
`openspec/changes/archive/2026-10-24-native-document-quality/design.md`. No commit is rewritten, and
the remotes keep their history. `tasks.md` is the sole progress ledger.
