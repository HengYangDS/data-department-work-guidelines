# Spec

## ADDED Requirements

### Requirement: Hosted Mermaid rendering uses an explicit CI-only launch configuration

The documentation adopter SHALL retain sandboxed Mermaid rendering by default.
When the shared hosted documentation verifier runs under a provider projection,
it SHALL select the same repository-owned Puppeteer launch configuration through
a repository-relative input. That configuration SHALL be checked in, portable,
and limited to the hosted Chrome compatibility argument. Provider workflow YAML
SHALL NOT contain an inline no-sandbox command. Local workflow validation or
rendering SHALL NOT be reported as hosted-CI success.

#### Scenario: Local documentation validation has no hosted override

- **WHEN** `scripts/validate-docs.sh` runs without its hosted-renderer option
- **THEN** Mermaid CLI receives no Puppeteer configuration file
- **AND THEN** local Chrome sandbox behavior remains unchanged.

#### Scenario: Hosted provider invokes the common verifier

- **WHEN** GitHub or GitLab documentation verification runs
- **THEN** the projection exports the same repository-relative hosted renderer
  configuration before the shared bound verifier starts
- **AND THEN** the verifier selects that configuration through the repository
  validator rather than a provider-local render command.

#### Scenario: CI override is malformed or inlined

- **WHEN** a projection omits the canonical config, names a different config, or
  includes an inline no-sandbox string
- **THEN** the repository CI contract test rejects the projection
- **AND THEN** no hosted success is inferred from that rejection.
