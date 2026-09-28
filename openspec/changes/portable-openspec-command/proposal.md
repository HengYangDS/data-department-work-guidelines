# Proposal: Portable OpenSpec Command

## Why

The current OpenSpec entry tells contributors to execute a POSIX-style
`node_modules/.bin/openspec` path. That path is not a reliable command on
Windows, even though this repository claims Windows as a supported verification
host. A bare `npm exec` can silently use a global or cached executable instead
of the locked dependency, so a portable spelling alone is not enough.

## What Changes

- Replace the platform-specific example with an npm invocation that requires
  the locally installed official package and forbids package acquisition.
- Keep official OpenSpec validation and ETHOS lifecycle authority unchanged.
- Record the contributor-command correction under Unreleased.

## Capabilities

No new or modified capability. The existing `quality` requirement already
requires portable public checks and review of current command examples. This
documentation correction changes no requirement; `skip_specs: true` is
intentional.

## Impact

Only the OpenSpec contributor entry and Changelog change. No package, runtime,
CI, release tag, or historical archive changes.
