# Design

## Decision

Use a bounded new official Change in the existing owned Work Lane. The previous
Change has already been archived; its admission cannot authorize fresh writes.

The original Claim is a dated bootstrap and handoff-intent record, not a new
assertion of current conformance. Correct its reference and mark this specific
record historical. Preserve its original Change ID, dated body, and digest.
Do not rewrite the archived Change or infer the state of other Claims.

The material-attribution test continues to verify profile declarations and native
prewrite, plan, and proof behavior. Remove its unrelated Claim-state inference;
do not replace it with a repository-local Claim parser or lifecycle engine.

## Verification

Replay a valid active-Claim/archive-reference fixture against the old and repaired
test. Verify the corrected path exists and the original evidence digest still
matches. Run the shared verifier and exact-HEAD full repository proof.

## Delivery

Archive through ETHOS, follow its post-archive proof action, then land, close out,
publish eligible refs, and observe both Forges. These effects are not premature
implementation checkboxes. No remote success is claimed by local proof.
