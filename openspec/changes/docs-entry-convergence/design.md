# Design

## Context

`README.md` and `docs/README.md` each list the same seven normative topics.
`AGENTS.md` already sends an Agent to the documentation map. The separate
`docs/history/README.md` contains only a brief non-normative boundary; the only
current link to it is in the map. Archived Changes may mention that path as a
historical fact, but they are excluded from current-link validation and are not
current navigation.

## Goals and Non-Goals

- Give a member one immediate next click from the repository home page and one
  task-oriented topic choice at the documentation map.
- Remove a page that owns no current rule while retaining the true history
  boundary where the reader encounters it.
- Keep the existing navigation check aligned with that ownership.
- Do not change topic obligations, rewrite Git history or archived Changes,
  assert adoption, or introduce a generated navigation layer.

## Decisions

### Keep the map as the sole topic inventory

The root page states the product's purpose and links to `docs/README.md` as
the single reader handoff. The map retains the seven work questions, their
current topics, and what the reader should learn. This preserves the Agent
entry and avoids making a Git repository landing page a second editable map.
Replacing the map with the root table would make the existing `docs/` entry
and Agent route indirect; keeping both tables would retain the synchronization
cost.

### Inline the historical boundary

The map says briefly that past commits and archived Changes are context, not
current authority or retrospective certification. The separate history page
is deleted. No archived source object is edited merely to erase a historical
path reference.

### Validate the semantic handoff

The existing rollout check requires a root-to-map route and map-to-topic
routes, not direct root-to-topic routes. A negative fixture removes the map
link; another reintroduces a root topic inventory. Both must fail. The check
guards navigation topology, not human adoption or visual quality.

## Risks and Trade-offs

One extra click separates the root page from an individual topic, but the
first click removes a duplicate seven-choice menu and leaves the current task
map as the sole owner. Link and rollout checks catch a broken handoff; they do
not prove readers find the wording useful. That requires a real task
observation with a named reviewer.
