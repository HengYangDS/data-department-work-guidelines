# Design

## Context

DDWG is a documentation adopter whose profile declares non-empty material paths.
ETHOS must use the official OpenSpec selection in plan, prove, and prewrite; the
Change-local `scope.toml` is ETHOS companion data and is not an official OpenSpec
schema. This lane validates that runtime contract against a real repository.

## Goals / Non-Goals

**Goals:**

- Exercise no-active and incomplete active Change failures on a material path.
- Exercise the narrow bootstrap: official untracked Change carrier, then exactly
  one untracked Change-local scope companion, then ordinary material admission.
- Bind the bounded result to a current active claim and dated Chronicle.

**Non-Goals:**

- Add DDWG-private lifecycle logic or loosen any ETHOS admission path.
- Change the normative guideline content or assert remote/hosted outcomes.

## Decisions

- Use `repository-governance` as the modified capability because the runtime
  behavior is the adopter's governed Change boundary.
- Scope only this carrier, its claim/Chronicle, and the canonical delta spec;
  unrelated material paths remain deliberately uncovered.
- Use a digest-only active claim: it records the present validation envelope but
  does not make semantic correctness or remote-delivery claims.

## Risks / Trade-offs

- A broad scope would hide unrelated work → retain exact companion patterns.
- A bootstrap exception could become a general bypass → prove only the exact
  untracked `scope.toml` path is admitted before the companion exists.
- Generated test logs are not durable evidence → promote only the claim and
  Chronicle, while keeping build outputs ignored.

## Migration Plan

1. Create the official Change without tracked mutation.
2. Admit and write its exact untracked `scope.toml` companion.
3. Use the resulting scope to write OpenSpec artifacts, claim, Chronicle, and
   canonical delta specification.
4. Execute lifecycle, official validation, local proof, archive, candidate land,
   accepted closeout, and lane retirement as separate local transitions.
