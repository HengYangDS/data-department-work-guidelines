## Context

See [proposal.md](proposal.md). `package.json` declares markdownlint 0.42.0 as a development
dependency and already overrides one exact pin in the tree, KaTeX 0.19.1 under
`micromark-extension-math`. markdownlint is the only package in the lock that depends on re2js. The
dependency policy accepts exactly one disposition, for braces, and refuses any other.

## Goals / Non-Goals

**Goals:**

- The lock holds no re2js version that the advisory affects, and the native dependency audit
  passes again on every platform.
- markdownlint keeps its findings on the guidelines.

**Non-Goals:**

- Upgrading markdownlint. Its latest release keeps the 2.8.6 pin.
- Accepting the finding as a disposition.
- Changing the declared ETHOS supply, which the 0.2.0-alpha.18 rebind owns.

## Decisions

- Take re2js 2.8.8, the latest 2.8 release. It fixes the advisory, upstream's open bump proposes
  it, and it stays on the line that markdownlint 0.42.0 was released with.
- Scope the override to markdownlint, as the KaTeX override is scoped to its dependent.
- Remove the override when a markdownlint release requires re2js 2.8.7 or later; the supply refresh
  that adopts that release removes it.

## Risks / Trade-offs

- [re2js 2.8.8 changes markdownlint's findings] → The repository check lints every guideline, so a
  changed finding fails the proof before landing.
- [re2js 2.8.8 requires Node 20 or later, where 2.8.6 required Node 18] → The repository locks Node
  26.12.1 locally and in hosted jobs.

## Migration Plan

Override the pin, re-resolve the lock, install it with `npm ci`, run the native audit and prove the
archived head. To roll back, restore `package.json` and `package-lock.json`; the audit then reports
the finding again.
