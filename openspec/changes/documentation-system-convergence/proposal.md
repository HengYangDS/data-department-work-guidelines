# Proposal

## Why

The guidelines now have a useful English reading route, but the repository is
not yet a dependable example of its own advice. Obsolete non-OpenSpec scope
files remain in the current tree; checks are spread across shell scripts and
platform assumptions; some current specifications still describe ETHOS rather
than this adopter. A clean reading experience is not enough if a new maintainer
cannot reproduce its quality checks or distinguish current rules from old
implementation history.

## What Changes

- Keep official OpenSpec artifacts as the only tracked Change intent and progress.
  Remove obsolete, non-official `scope.toml` companions and other proved
  redundant files from the current tree. Git retains the original objects; the
  cleanup does not certify or rewrite past work.
- Give document verification one portable, locked entrypoint. Format, lint,
  links, diagram rendering, repository-specific boundaries, and their negative
  tests must have clear owners and run without a POSIX shell as the required
  interface. CI may adapt to each provider's runtime but must invoke the same
  repository check.
- Reconcile current specifications, navigation, decision records, configuration,
  and instructions with the actual repo. Keep one editable owner per rule and
  remove wrappers, metadata, or placeholders that have no current consumer.
- Qualify local checks and GitLab/GitHub delivery separately. Do not turn a
  configured workflow, a checked task, or passing CI into an adoption claim.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: make document verification reproducible across supported hosts,
  with one entrypoint and checks that test real properties rather than old file
  shapes.
- `repository-governance`: keep official Change attribution and native ETHOS
  hooks as the only lifecycle authority, and make both hosted verifiers consume
  the same portable repository check.

## Impact

This Change may update the current `docs/` route, `openspec/specs/quality` and
`openspec/specs/repository-governance`, `.ethos` declarations, configuration,
`package.json`, `tools/`, provider workflows, and their tests. It removes
obsolete tracked companions and shell wrappers only after their consumers are
accounted for. It does not modify ETHOS product source, credentials, foreign
Work Lanes, or the historical Git objects. ETHOS product-level single-peer
fallback, Forge protection, and real team adoption require their own observed
acceptance, not a claim in this proposal.
