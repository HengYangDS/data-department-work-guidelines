## Why

The data topic lists the work its contract covers as nine flat items: information acquisition, analysis and
modeling, data science, software development, data production, platforms and infrastructure, product and technical
management, governance, and operational delivery. The department's work is organized differently. On 2026-11-24
the owner stated the functions as six vertical and three horizontal ones, with platform engineering (the data
platform) distinct from infrastructure and data production renamed development and production, and decided that the guidelines state this structure publicly without seats, capacity,
accountability chains, people or headcount.

## What Changes

- In the data topic's ownership section, declare the nine functions in a table (English and Chinese names, vertical
  or horizontal, what each owns), as areas of responsibility rather than departments or seats, and state one rule:
  a data item's domain responsibility falls by its data form, its production responsibility to development and
  production once in production, platform responsibility to platform engineering and infrastructure, governance to
  product governance, and delivery to operations and delivery. Four vertical functions also act as centers for all
  data (production, semantics, capability, resources). The duty to apply the contract to all functions is unchanged.
- Name the same nine functions in the work-practice scenario that applies the data-quality contract beyond data
  production.
- Cut 9.3.0 in `VERSION` and the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `work-practice`: the requirement "Data roles retain operational responsibility" names the nine functions in its
  scenario "Work is performed outside data production".

## Impact

`docs/data.md`, `openspec/specs/work-practice/spec.md` (through the delta), `VERSION` and `CHANGELOG.md`. The films
that draw the functions follow the tag.
