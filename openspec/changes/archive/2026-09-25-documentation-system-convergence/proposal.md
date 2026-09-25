# Proposal

## Why

The guidelines now have a useful English reading route, but the repository is
not yet a dependable example of its own advice. At the start of this Change,
obsolete non-OpenSpec scope files remained in the current tree; checks were
spread across shell scripts and platform assumptions; some specifications
described ETHOS rather
than this adopter. A clean reading experience is not enough if a new maintainer
cannot reproduce its quality checks or distinguish current rules from old
implementation history.

## What Changes

- Keep official OpenSpec artifacts as the only tracked Change intent and progress.
  Remove obsolete, non-official `scope.toml` companions and other proved
  redundant files from the current tree. Git retains the original objects; the
  cleanup does not certify or rewrite past work.
- Give document verification one portable, locked entrypoint. Format, Markdown
  lint, spelling, links, repository-specific boundaries, and their negative
  tests must have clear owners and run without a POSIX shell as
  the required interface. CI may adapt to each provider's runtime but must
  invoke the same repository check and audit locked dependencies.
- Reconcile current specifications, navigation, decision records, configuration,
  and instructions with the actual repo. Keep one editable owner per rule and
  remove wrappers, metadata, or placeholders that have no current consumer.
- Compare the last unified `guidelines.md` with the seven current topics by
  obligation, not heading. Restore missing risk levels, task boundaries, work
  states, and learning triggers without restoring the monolith or a fixed
  management meeting cadence.
- **BREAKING** Replace documented shell verification commands. Define the
  guideline and contributor compatibility surface, use one version owner, and
  enforce Keep a Changelog 1.1.0 and SemVer 2.0.0 through source checks and
  release-tag admission. Do not invent tags for older branch editions.
- Require scoped Conventional Commit subjects for new work. Correct selected
  historical author identities only through ETHOS's admitted repair, with a
  verified recovery bundle and explicit remote reconciliation; do not rewrite
  messages or invent past release evidence.
- Qualify local checks and GitLab/GitHub delivery separately. Do not turn a
  configured workflow, a checked task, or passing CI into an adoption claim.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `quality`: make document verification reproducible across supported hosts,
  with one entrypoint and checks that test real properties rather than old file
  shapes.
- `guidance-discovery`: keep the original work-quality obligations findable in
  the short reader route without duplicating the rule owners.
- `repository-governance`: keep official Change attribution and native ETHOS
  hooks as the only lifecycle authority, and make both hosted verifiers consume
  the same portable repository check and versioned release boundary.

## Impact

This Change may update the current `docs/` route, `openspec/specs/quality` and
`openspec/specs/repository-governance`, `.ethos` declarations, configuration,
`package.json`, `tools/`, provider workflows, and their tests. It removes
obsolete tracked companions and shell wrappers only after their consumers are
accounted for. It does not modify ETHOS product source, credentials, or foreign
Work Lanes. A separately admitted historical identity repair may replace
selected Git objects and remote refs without changing their trees or messages.
ETHOS product-level single-peer fallback, Forge protection, and real team
adoption require their own observed acceptance, not a claim in this proposal.
