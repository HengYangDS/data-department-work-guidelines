# Design

## Context

The accepted baseline is `24007dd4`, released as v5.2.4. Its documentation
package closure, offline supply, and declared platform matrices passed. Those
results establish compatibility, not that every CI executable is current.
Actual Node 26.10.0 selects bundled npm 11.19.1; stable npm 12.1.0 is compatible
with Node 26 and fixes this remaining tool-version gap.

## Goals / Non-Goals

**Goals:** one native package-manager declaration; mismatch rejection before
install, `ci`, or run effects; actual cold bootstrap and offline qualification
on the declared hosts; truthful source and release boundaries.

**Non-goals:** add Mise or Corepack, fork npm, parse a second private manifest,
automatically upgrade a developer's host, modify credentials or Runner services,
or change normative department guidance.

## Decisions

### npm owns package-manager admission

`package.json` uses `devEngines.packageManager` with `name`, exact `version`,
and `onFail: error`. Official npm evaluates this contract before `install`,
`ci`, and `run`; no repository regex or duplicate `packageManager` value is
needed. An isolated probe confirms npm 11.19.1 rejects the contract and
12.1.0 accepts it. Tests must also prove absence of install effects.

### Bootstrap belongs to the actual destination

Ephemeral GitHub jobs and Linux CI containers obtain the declared npm through
npm's native global installation before repository dependency installation.
They derive its version from the native declaration, not a copied literal.
Native macOS and Windows Runner accounts use their maintained installation
owner; source must not mutate those services or choose a private prefix.
Every claimed host must report the actual selected npm, not a name or lock
entry. A native version mismatch remains fatal after acquisition.

Node setup resolves the latest stable release in the declared major and disables
automatic package-manager caching. That action otherwise invokes bundled npm
before the explicit upgrade, causing native admission to reject the setup step.
Explicit npm caching is also rejected at that point; source and offline workflows
share this regression boundary rather than bypassing `devEngines`.

Local checks and offline installation never acquire a package manager. The
contributor route states the exact npm prerequisite and points to its existing
installation owner. The offline source image includes the same native
`package.json`, so npm enforces that prerequisite before install effects.
The bundle builder retains the complete declared native manifest in its
online and offline validation copies.

### Release compatibility follows the real public contract

Requiring npm 12.1.0 rejects a contributor environment that previously worked;
this is a SemVer major change even though the department rules are unchanged.
Use v6.0.0 only after source, release, and all hosted qualification tasks pass.
Published v5.2.4 is immutable and remains a compatible previous edition.

## Risks / Trade-offs

- A host merely has npm 12 installed but selects the bundled copy: inspect the
  selected executable and run the actual source command on that destination.
- An online bootstrap leaks into offline verification: keep acquisition before
  offline installation and prove the latter works with remote supply disabled.
- Native accounts are not yet upgraded: complete independent source work and
  keep their hosted qualification tasks open; do not lower the contract.
- A duplicated manifest field drifts: use only native `devEngines` as the exact
  npm version owner and derive provider-specific acquisition from it.

## Migration Plan

1. Admit the official Change and test native mismatch refusal for install,
   `ci`, and run before modifying the manifest.
2. Add the native declaration; update existing CI acquisition, contributor
   guidance, and offline build copies without creating another command plane.
3. Run local checks and cold offline installation, then exact-HEAD ETHOS proof;
   coordinate native account upgrades through the existing fleet owner.
4. Publish reviewed source and verify both complete source matrices. Cut and
   publish the signed major release and one source-bound offline bundle; verify
   both real asset downloads and offline host matrices.
5. Archive officially, prove and publish the archive commit, and retire every
   absorbed proposal and the owned Work Lane with exact cleanup evidence.
