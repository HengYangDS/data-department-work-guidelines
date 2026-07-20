# Spec

## ADDED Requirements

### Requirement: Post-archive proof repair preserves archive history

When an official OpenSpec archive changes a repository tree and its resulting
HEAD fails an existing local proof, the documentation adopter SHALL correct the
new proof target through a separate active Change. That repair SHALL preserve
the archived carrier and its historical digest, and its fresh proof SHALL be
bound to the repaired exact HEAD before candidate landing or accepted closeout.
Local proof SHALL NOT imply runner registration, publication, or hosted
execution.

#### Scenario: Archive-result proof is repaired without rewriting history

- **WHEN** an archive-result HEAD fails an existing repository proof
- **THEN** a separate active Change scopes the correction
- **AND THEN** the archived carrier remains unchanged
- **AND THEN** only a fresh exact-HEAD proof may support a later local landing.
