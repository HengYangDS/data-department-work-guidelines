# DDWG push-boundary proof reconciliation design

The official archive is immutable historical evidence. The fresh exact-HEAD
proof cannot be represented by the completed Change without rewriting that
archive. This focused reconciliation Change therefore rebases claim lifecycle
and carrier references: the archived claim becomes historical, and a new active
claim owns current local proof.

Its specification delta also restores the already-implemented source-or-target
boundary after the archive merger left duplicate scenarios. The claim remains
local-only and cannot prove GitLab/GitHub push, provider protection, or hosted
CI.
