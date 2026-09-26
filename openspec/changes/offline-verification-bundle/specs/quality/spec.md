# Spec Delta

## ADDED Requirements

### Requirement: Product-owned code evidence accompanies document proof

The profile SHALL retain exactly the `docs-integrity` and `markdown-format`
default gate IDs and their repository-relative Node commands. Each SHALL bind
an ETHOS-owned verification provider for its mapped behavior or static-analysis
axis. ETHOS SHALL execute native Node tests with coverage and JavaScript syntax
checks from the accepted product runtime, conjoined with the respective
document command for the same committed tree. A command exit code,
repository-authored report, or claimed provider result SHALL NOT establish
native code correctness. The repository profile check SHALL reject a missing or
misdirected provider without adding a third default gate.

#### Scenario: Document command passes but native code fails

- **WHEN** both repository document commands exit successfully but a tracked
  JavaScript test fails or production module is not exercised
- **THEN** ETHOS blocks full proof for the behavior axis
- **AND THEN** a repository-authored test report cannot turn the result green.

#### Scenario: Native code passes but a document command fails

- **WHEN** ETHOS obtains valid native code evidence but the document command
  for either mapped gate fails
- **THEN** that gate and full proof remain blocked
- **AND THEN** native evidence does not excuse a broken document check.

#### Scenario: Both sides of each gate pass

- **WHEN** both document commands and their ETHOS-owned native verifiers pass
  for the exact committed source
- **THEN** the two existing gate IDs satisfy their mapped quality obligations
- **AND THEN** no additional default gate or private lifecycle is required.

### Requirement: A supplied offline bundle can install the complete verification toolchain

On each declared platform, a release-bound bundle SHALL supply every
package needed by `npm ci --offline --ignore-scripts` and the pinned lychee
asset. Supported Node/npm and Git SHALL complete actual installation and full
verification from an empty application cache without network. Before
extraction, the installer SHALL match committed source identities and an
external or source-pinned digest. ETHOS remains separate; the bundle SHALL NOT
impersonate its authority.

#### Scenario: Cold local verification succeeds without network access

- **WHEN** a user supplies a complete bundle for the checked-out release on a
  declared host with supported Node/npm and Git
- **AND** the application has no pre-existing npm cache, `node_modules/`, or
  lychee cache
- **THEN** the actual offline install and full repository verifier pass while
  outbound network access is unavailable
- **AND THEN** a successful `npm ci --offline --dry-run` alone is not accepted
  as installation evidence.

#### Scenario: Offline supply is incomplete or altered

- **WHEN** a bundle is missing a required npm entry or lychee asset, contains an
  unsafe member, or disagrees with the checked-out lockfile, tool manifest,
  version, or trusted bundle digest
- **THEN** the installer fails before accepting the toolchain or running the
  verifier
- **AND THEN** it does not silently fetch a replacement or mark the release
  qualified.

#### Scenario: A different supported platform consumes the same release

- **WHEN** the release claims macOS, Linux, and Windows support
- **THEN** the complete offline installation and verification graph is executed
  on each declared platform using the release's bundle
- **AND THEN** one platform's successful install or a static matrix declaration
  does not qualify another platform.

#### Scenario: GitLab qualifies its native Linux release asset

- **WHEN** the same-project GitLab package and Release are available for the
  checked-out signed tag
- **THEN** a post-publication pipeline on the declared Linux ARM64 runner
  obtains the package with its project job token and rejects redirects or
  altered bytes before installation
- **AND THEN** the complete offline install and full verifier run at the tag's
  exact source SHA; a successful tag-push documentation job is not a substitute.
