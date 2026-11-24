## Context

See proposal.md. The department's internal organization model already defines the six vertical and three
horizontal functions, with their standard Chinese names, and the scope of platform engineering and of
infrastructure. These guidelines are public; on 2026-11-24 the owner decided that the structure may be stated here,
while seats, capacity, accountability chains, people and headcount stay internal.

## Goals / Non-Goals

**Goals:**

- The guidelines name the same nine functions as the organization model, in the same split.
- Platform engineering and infrastructure are named apart, each with its scope.

**Non-Goals:**

- Seats, capacity, team leads, reporting lines or headcount; the guidelines keep no seat or reporting matrix.
- Any change to what the data contract requires.

## Decisions

- **Names.** The owner's names (2026-11-24): 信息采集、开发生产、分析建模、数据科学、平台工程、基础设施 and 范式研究、产品治理、
  运营交付, without a repeated "data" since the department is the context. In English: information acquisition,
  development and production, analysis and modeling, data science, platform engineering, infrastructure; paradigm
  research, product governance, operations and delivery. Development and production includes developing data for
  production, so the former separate item "software development" is part of it; product and technical management
  and governance, formerly separate, belong to product governance and paradigm research. The scenario "Work is
  performed outside data production" keeps its title, which is its identity.
- **Edition.** The contract now names paradigm research and platform engineering, which it did not name, and
  the duty is otherwise unchanged; as a compatible clarification of scope it takes a minor increment, 9.3.0.
- **Date.** 2026-11-24, the day the release is expected to be tagged; the date moves with the tag.
- **Form.** A table plus one rule, not a sentence: four vertical functions hold two roles (domain responsibility
  for a data form, and a center role for all data), which a list of names does not show. The derivation from the
  organization model's constraints (small seat count, division by failure mode, centralized processing, the data-form
  responsibility matrix) keeps the division and changes only its statement.

## Risks / Trade-offs

- A reader may take the split for departments; the page says they are areas of responsibility, not departments
  or seats.
