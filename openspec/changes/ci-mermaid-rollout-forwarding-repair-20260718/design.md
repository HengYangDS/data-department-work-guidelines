# Design

## Context

The shared verifier correctly reads `DDWG_HOSTED_RENDERER_CONFIG` and passes the
canonical repository-relative configuration to its first `validate-docs.sh`
call. It then calls `validate-rollout-readiness.sh` without arguments. That
wrapper calls `validate-docs.sh` a second time, causing the hosted setting to be
lost. The published GitHub run at `e753998` proves this exact nested-path
failure; it does not prove a successful hosted repair.

## Goals / Non-Goals

**Goals:**

- Preserve explicit hosted renderer selection across nested documentation
  validation.
- Keep the selection in the existing shared verifier and repository-owned
  validator path.
- Prove both forwarding and rejection of unsupported values locally.

**Non-Goals:**

- Replacing Mermaid, Puppeteer, Chrome, or provider workflows.
- Sending `--no-sandbox` directly in provider YAML or local default commands.
- Treating local validation or a configuration diff as provider success.

## Decisions

### Forward the already-validated argument

`validate-rollout-readiness.sh` already delegates all its received arguments to
`validate-docs.sh`. The shared verifier must provide its validated
`validate_docs_args` to that wrapper as well as to its first direct validator
call. No second environment parser or configuration convention is introduced.

**Alternative rejected:** teach the rollout wrapper to read
`DDWG_HOSTED_RENDERER_CONFIG`. That duplicates CI-specific environment parsing
in a local-quality wrapper and makes provider selection ownership ambiguous.

### Make the contract test exercise execution order

The regression test runs a lightweight fixture copy of the shared verifier with
stub commands. It checks that the canonical option reaches both direct and
rollout validator calls, and that an unsupported environment selection fails
before verification begins.

**Alternative rejected:** only grep for the argument in the verifier. Textual
presence cannot prove that the nested rollout invocation receives it.

## Risks / Trade-offs

- **Argument forwarding broadens a wrapper interface** → the wrapper already
  forwards arguments to the validator, and the verifier supplies only its
  existing validated array.
- **CI-only setting leaks to local use** → local callers still receive no
  option unless a hosted projection explicitly selects the canonical config.
- **Another hosted defect remains** → preserve the fresh provider result and
  open a new Change rather than broadening the exception.

## Migration Plan

1. Create the active material Change and its product-defined scope companion.
2. Add the shared-verifier forwarding change and executable regression test.
3. Run focused negative and positive tests plus full local documentation proof.
4. Archive through the official OpenSpec command, prove the archive HEAD, then
   land and publish eligible refs before inspecting each provider independently.

## Open Questions

None. The failure log identifies the missing forwarding edge directly.
