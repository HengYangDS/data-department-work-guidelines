# Design

## Context

See [the proposal](proposal.md). The builder already sets
`COPYFILE_DISABLE=1`, which suppresses AppleDouble sidecars but does not omit
PAX extended-attribute headers. A controlled macOS probe showed that native
`tar` preserves both provenance and a deliberately added attribute by default;
`tar --no-xattrs` preserved the file bytes and omitted every such header.
The published `v5.0.1` archive has 1,293 members, each with macOS provenance
metadata. GitLab job 44513 installed it successfully but emitted repeated GNU
tar warnings.

## Goals / Non-Goals

**Goals:** Emit one platform-neutral archive, reject warning-bearing archive
operations, and qualify the exact new release bytes on every declared host.

**Non-Goals:** Rewrite `v5.0.1`, change the normative guidelines, introduce a
second archive format or parser, or weaken digest and safe-member admission.

## Decisions

1. Keep the existing native `tar` transport and add `--no-xattrs` at archive
   creation. Retain `COPYFILE_DISABLE=1` for AppleDouble suppression. This is
   smaller than introducing a second archiver and prevents host metadata at
   its source rather than stripping it after signing.
2. Add an opt-in nonempty-stderr refusal to the existing process runner and
   apply it to bundle creation, listing, and extraction. A zero process exit
   alone does not prove a warning-free archive. Other repository commands keep
   their current stderr contract.
3. Exercise the real builder on macOS, including its staged files, and assert
   the resulting archive has no known extended-attribute PAX keys. Exercise
   the stderr refusal with a zero-exit warning command. The hosted offline
   matrix remains the cross-platform acceptance, not a local fixture alone.
4. Classify the packaging correction as a compatible patch edition. Build
   from the final declared inputs, pin the resulting digest in the signed
   source, publish those same bytes independently to both Forges, and retain
   the old release unmodified.

## Risks / Trade-offs

- **Tar option availability** → prove the option in the locked local builder
  and actual macOS, Linux, and Windows offline jobs before accepting release.
- **Previously published archive warnings** → keep `v5.0.1` immutable; the
  new verifier may refuse that archive, and the corrected bundle is a new tag.
- **Warning text may contain untrusted member names** → reject with a bounded
  generic diagnostic rather than echoing raw stderr or suppressing it.

## Migration Plan

Implement and test the archive contract in the owned Work Lane, prove the
signed candidate, then issue the patch tag and independent Forge assets. Run
the complete no-network offline installation and verifier on macOS, Linux
x86/ARM, Windows, and the declared GitLab VM. If any platform warns or differs
by digest, stop publication acceptance; never replace the old asset in place.
