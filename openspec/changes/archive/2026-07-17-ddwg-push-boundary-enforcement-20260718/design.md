# DDWG remote candidate push boundary design

## Context

`candidate/dev` is an internal local train. The generic ETHOS pre-push command
protects proof and accepted topology, but it does not encode this adopter's
stricter remote-projection exclusion.

## Decision

The repository-owned pre-push hook rejects the configured literal
`refs/heads/candidate/dev` before calling the generic ETHOS hook adapter. The
same hook delegates all other branch pairs to the repository-bound ETHOS
adapter. A self-contained shell test supplies zeroed remote heads and uses a
temporary adapter stub so it is portable and makes no network connection.

The proof profile runs that regression as a trust-bearing repository-native
gate. The gate proves local admission behavior only; it does not establish
provider-side protection or publication.

## Risks and trade-offs

A literal branch comparison follows the tracked branch-role contract and avoids
provider-specific configuration. If the candidate branch is renamed, this hook
and its test must be updated in the same governed Change. GitLab and GitHub
remain independently verified publication planes.
