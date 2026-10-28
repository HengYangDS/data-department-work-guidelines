## Why

GHSA-gg6h-894w-4m9c (CVE-2026-116795, high), published on 2026-10-28, reports that re2js from
2.2.0 and before 2.8.7 matches lookbehind assertions in quadratic time. markdownlint 0.42.0, the
locked Markdown linter and its latest release, pins re2js 2.8.6 exactly. The native dependency
audit (`node tools/docs/cli.mjs audit`) reports it as an unapproved finding, so every hosted
verification now stops at that step; the 0.2.0-alpha.18 rebind's proposal run failed there on all
four platforms. Upstream's bump of the pin to 2.8.8 is an open pull request
([DavidAnson/markdownlint#2338](https://github.com/DavidAnson/markdownlint/pull/2338)).

## What Changes

- Override markdownlint's re2js with 2.8.8 in `package.json`, beside the existing KaTeX override,
  and re-resolve `package-lock.json` with the locked npm.
- Record the override under Security in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`package.json`, `package-lock.json` and `CHANGELOG.md`. The dependency policy keeps its single
approved disposition. `tasks.md` is the sole progress ledger.
