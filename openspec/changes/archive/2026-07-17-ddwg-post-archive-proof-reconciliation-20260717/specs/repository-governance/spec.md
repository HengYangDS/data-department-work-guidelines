# Post-archive documentation-proof reconciliation delta

## ADDED Requirements

### Requirement: Archived documentation closeout requires a distinct current proof carrier

After official OpenSpec archive moves a documentation-adopter closeout, the
repository SHALL preserve the dated archive unchanged and SHALL use a distinct
active Change and claim to bind the resulting tree to local proof. The proof
SHALL be executed at the resulting exact HEAD before candidate land. It SHALL
NOT imply remote publication, hosted rendering, or organizational adoption.

#### Scenario: Archive is followed by local proof reconciliation

- **WHEN** an official archive has changed the documentation-adopter tree
- **THEN** a distinct active reconciliation carrier SHALL reference that archive
- **AND** only its current HEAD-bound proof may support local candidate land.
