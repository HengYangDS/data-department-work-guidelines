# Proposal

## Why

The repository home page and the documentation map repeat the same seven topic
routes. A reader must scan two similar menus, and a maintainer must keep both in
sync. A separate historical-context page adds another stop without owning a
current rule or a decision. The current content is sound, but the entry path is
less direct than it needs to be.

## What Changes

- Make the repository home page a short orientation with one handoff to the
  documentation map. Keep the seven task routes in the map alone.
- Retain the necessary historical boundary in the map and remove the redundant
  historical-context page. Git history and the official OpenSpec archive remain
  available; neither becomes present-day authority or proof.
- Adjust the existing navigation check to test this two-level route without
  imposing a fixed visual layout or a new navigation framework.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `guidance-discovery`: the human entry hands off once to the task map, which
  owns topic routes and separates current rules from historical context.

Routing: `capability=guidance-discovery`,
`subject=data-department-work-guidelines:documentation`, `reuse=extend`,
`change=modify`, `facet:lifecycle=validation`, `facet:surface=docs`,
`facet:authority=docs`.

## Impact

This Change affects `README.md`, `docs/README.md`, the retired
`docs/history/README.md`, `scripts/validate-rollout-readiness.sh`, and the
`guidance-discovery` specification. The navigation regression runs through
`tests/validate-rollout-readiness.sh`, the shared CI verifier, and its binding
test. It does not change the topic rules, rewrite history, certify earlier
work, assert team adoption, or alter ETHOS and Forge publication behavior.
