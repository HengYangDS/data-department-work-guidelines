## Context

See `proposal.md`. ETHOS's documentation contract gives a directory's orientation to a necessary
README and the detailed meaning to topic pages, split at reader tasks. Its checks verify that a
README exists, has children and links to one of them, but not the README's role, so the page passed
every check while it served as both the directory's entrance and the repository's whole change,
release, check and CI policy.

## Goals / Non-Goals

**Goals:**

- The governance README is navigation only: the directory's purpose and scope, and a route for each
  reader task.
- The policy keeps every live obligation and the anchors that other files use, on two pages split by
  reader task.
- The policy states this repository's own boundaries and links to the owners of shared ETHOS
  behavior and of contributor procedure instead of restating them.

**Non-Goals:**

- Changing the meaning of any rule, or the procedures in `CONTRIBUTING.md`.
- Editing decision records or archived Changes, whose links still resolve to the index.

## Decisions

- Split by reader task. Someone who changes, publishes or retires source reads
  `change-and-release.md`, titled "Repository Change and Release", which keeps the subject
  `data-department-work-guidelines:repository-governance`. Someone who runs checks, prepares ETHOS
  or operates CI reads `checks-and-ci.md`, titled "Source Checks and CI", with the new subject
  `data-department-work-guidelines:checks-and-ci`.
- Keep each linked anchor with its section: `#versioned-releases` and `#evidence-and-retirement` on
  `change-and-release.md`, `#proof-and-configuration` and `#tool-supply` on `checks-and-ci.md`. The
  configuration map's owner relation moves to `checks-and-ci.md`, which owns the boundaries of the
  checks that it maps.
- Hand each removed passage to its existing owner:
  - installed ETHOS behavior (the execution record, the OpenSpec result, Changelog and release tag
    admission, link resolution and checkout normalization) to the installed contracts that
    `ethos status --json` names, while this repository's boundary for each stays as one sentence or
    one table row;
  - the download retirement steps to the "Retire superseded downloads" procedure in
    `CONTRIBUTING.md`;
  - the second statement that archive creates a new commit, proved and published separately, to the
    one kept under "Evidence and Retirement";
  - the closing sentence on link and registry checks to the kept statement that structural checks
    cannot establish reader understanding.
- General links ("read repository governance", "see repository governance", "the current governance
  contract") keep the index, which routes the reader. Links that name one rule go to the page that
  holds it.

## Risks / Trade-offs

- [A removed sentence held a live obligation] → Each removal has an owner above, and the review
  compares the old page with the two new pages section by section.
- [A reader follows an old anchor on the README] → Six links in current files used those anchors,
  and each moves to the page that now holds its section; the link check resolves every fragment.

## Migration Plan

Write the two policy pages and the index, move the links, run the documentation, prose and link
checks, prove the archived head, publish the proposal, land, publish `dev` and `main`, and retire
the proposal refs and the lane. To roll back, revert the lane's commits.
