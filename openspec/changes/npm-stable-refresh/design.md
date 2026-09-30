# Design

## Context

The accepted baseline `ba5671ef` includes the completed v6.0.0 publication and
native npm contract. The official Registry now declares stable npm 12.2.0;
its engine range admits Node 26 and its release notes declare compatible
package-management additions.

## Goals / Non-Goals

Update the actual selected package manager, preserve native admission, and
qualify the release on every declared host. Do not add another version owner,
installation manager, scope file, compatibility waiver, or dependency override.

## Decisions

`package.json` remains the sole exact npm version owner. CI derives the requested
release from that field; native accounts update through their existing owner.
The universal offline bundle binds the complete native manifest and keeps the
unchanged dependency lock. Native installer checks reject mismatched npm before
effects. Local checks do not download tools.

This is a compatible maintenance update within the declared npm 12 toolchain,
not a new department obligation or command interface. Release v6.0.1 after
actual source, signed publication, and offline host qualification. Do not
modify the existing v6.0.0 tag, assets, or records.

## Risks / Trade-offs

An account can install the new npm without selecting it. Confirm the actual
service identity and native execution path rather than a host-wide version.
Newest upstream versions may change during validation; record observation time
and separate later releases from the immutable edition being qualified.

## Migration Plan

1. Update native version admission and its regressions, then rebuild the bundle.
2. Coordinate destination account updates through the fleet owner; verify the
   actual CLI and source under the existing local and hosted checks.
3. Commit and prove the release cut, publish exact source to both Forges, and
   require their complete source jobs before admitting the signed tag.
4. Publish one bundle, compare actual downloads, run every offline host job,
   then archive officially and retire the absorbed proposal and Work Lane.
