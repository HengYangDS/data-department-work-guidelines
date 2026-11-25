---
subject: data-department-work-guidelines:checks-and-ci
role: policy
state: canonical
relations:
  canonical_for: source check, tool supply, and CI boundaries
---

# Source Checks and CI

Installed ETHOS runs the source checks, supplies its own tools, and generates the CI jobs. This page
owns this repository's boundaries for them. [Contributing](../../CONTRIBUTING.md) owns the commands,
the [configuration map](configuration.md) locates native inputs, and
[repository change and release](change-and-release.md) owns change authority and publication.

## Quality and Local State

Run the source checks in [Contributing](../../CONTRIBUTING.md#verify-the-source). Working-edit
checks and committed-source host verification are separate observations; neither grants repository
proof, source acceptance, or publication.

Installed ETHOS binds execution to the selected source and records the command, result, and complete
diagnostics. It also invokes its supplied official OpenSpec tool and retains the complete native
result; use the [workspace procedure](../../openspec/README.md), because a summary or successful
parse cannot replace clean validation or the lifecycle. DDWG keeps no separate environment reporter
or OpenSpec report parser. The runner owner verifies guest identity, host architecture, resources,
isolation, and throughput where claimed. A mounted workspace may differ from the guest root volume;
host-local observations belong in evidence, never portable configuration.

### Proof and Configuration

The [profile](../../.ethos/profile.toml) declares no gates. Installed ETHOS selects the applicable
shared checks from the authored Markdown, configuration, and OpenSpec artifacts; `source-format`
checks selected source once, for byte integrity before native layout, and `config-quality` owns
configuration syntax. These checks do not establish English prose quality or impose a second raw
blank-line rule. Review new authored text for English and department terminology without rewriting
quoted originals, historical text, or meaningful literals.

| Concern                              | Current consumer                                                    | Ownership boundary                                                              |
| ------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Metadata and decision structure      | Installed `docs-registry`.                                          | The shared contract owns identity, structure, and non-execution inspection.     |
| Source formatting and Markdown lint  | Installed `source-format` and `markdown-lint`.                      | Native formatters own layout; shared lint owns non-spacing checks.              |
| Checkout normalization               | Installed ETHOS, from each tracked file's effective Git attributes. | Text uses LF and `-text` preserves exact bytes; DDWG keeps no checker.          |
| Official artifacts and configuration | Installed OpenSpec and `config-quality`.                            | Use supplied validation and native inputs, without a repository parser.         |
| Local links and fragments            | Installed `markdown-links` in the shared floor.                     | The shared provider owns committed targets, headings, aliases, and diagnostics. |
| English prose and terms              | Installed `prose`, with a temporary spelling increment.             | Shared spelling still needs corpus and vocabulary qualification.                |
| Release history                      | Installed repository paradigm and release tag admission.            | The Changelog names no peer.                                                    |
| ETHOS supply and CI                  | Mise installs the locked release; generated jobs run its graph.     | Each declared runner qualifies by running the full graph.                       |

A repository adds code, a package, or a proof gate only for a duty that no installed check owns; the
selected Change names that duty. Shared rules or source code alone do not qualify a replacement.
Keep each current consumer until the accepted installed successor covers its complete duty, then
retire the duplicate implementation, configuration, tests, and guidance in that same migration.
Unrelated product work does not hold an independently qualified replacement.

Run the full applicable closure on the exact committed tree and keep its original diagnostics.
Structural checks, including link and registry checks, cannot establish factual accuracy, semantic
fidelity, reader understanding, or team use. The task map and topic owners retain reader navigation.
Review actual member and Agent journeys for scope, authority, next action, and stop conditions; do
not use a private route table, fixed opening phrase, or paragraph position as acceptance.

### Source Links and Decision Records

Installed `markdown-links` checks the exact committed delivery without network access; changed or
uncommitted source is not a qualified delivery. The
[contributor procedure](../../CONTRIBUTING.md#run-the-full-source-check) owns the command, and DDWG
keeps no duplicate link implementation.

Formatting and lint can examine working edits and non-ignored candidate files. That selection does
not establish committed-link acceptance. The
[existing quality requirement](../../openspec/specs/quality/spec.md#requirement-local-references-resolve-to-delivered-source)
also covers tracked working edits and non-ignored candidate links. Shared qualification of those
inputs remains pending; do not infer it from committed checks or remove the requirement. External
reachability uses the installed `external-links` gate and the selected peer's actual endpoints. A
successful local check cannot establish remote availability or publication.

The [decision register](../decisions/README.md#add-only-a-decision-worth-keeping) helps reviewers
decide whether a lasting choice needs a record. Installed `docs-registry` owns its identity,
metadata, section structure, and command inspection, without executing the input or requiring a
second DDWG parser. Reviewers assess the rationale and trade-offs; a structural pass cannot
establish a sound decision or current delivery.

## Tool Supply

Reading the guidelines requires no installation. Maintainers and CI need only installed ETHOS: Mise
installs the locked release from the [project configuration](../../.config/mise/config.toml) and its
[lock](../../.config/mise/mise.lock). ETHOS supplies its own Node, formatters, and prose and link
tools; the repository ships no package, maintenance toolkit, native binary, or offline bundle.
[Contributing](../../CONTRIBUTING.md#make-ethos-available) owns the commands. Those procedures
preserve the destination's installation owner and global configuration; local checks do not upgrade
host tools or Runner services.

| Operation          | Supply boundary                                                                |
| ------------------ | ------------------------------------------------------------------------------ |
| Local verification | Mise installs the locked ETHOS release; the repository downloads nothing else. |
| GitHub source CI   | Mise from its pinned action, then the locked ETHOS release.                    |
| GitLab source CI   | Mise on the ARM macOS guest, then the locked ETHOS release.                    |

### Qualify the Platform

CI claims one platform, ARM macOS, on both Forges, as the owner decided on 2026-11-25. Run the
complete declared graph there and observe host and tool architectures separately: a label or an
asset name does not qualify an ABI, so read the architecture that each job's log reports, such as
GitHub's runner-image name or `arch=arm64 os=darwin`.

### Audit Artifacts

ETHOS audits its own release supply and publishes its known findings with each release. The supply
approvals of Mise stay with its own owner. An authorized risk decision must identify the exact
artifact and finding, allowed use and distribution, and expiry or withdrawal condition, with
complete reports; keep it with the producing Change and evidence. This page grants no approval, and
an approval for one artifact cannot cover another.

## Runner and Transport Boundaries

The [runner declarations](../../.config/ci/runners.toml) identify permitted command prerequisites by
Forge. They do not establish executable availability, runner identity, isolation, capacity, or
successful job execution.

Verify GitHub's hosted `macos-latest` runner and GitLab's admitted ARM macOS guest runners through
their jobs and native runner/guest observations. Both Forges select the runner by the label
`macos-latest`; GitLab adds `review` or `protected`. The guest supplies Mise, which installs the
locked ETHOS release. Every GitLab job keeps the Mise configuration and data under its own execution
root, so no job writes the runner account's profile or shares installed tools with another job. Each
runner keeps the Mise download cache between its jobs, one store per concurrent slot and separate
for review and protected runners: Mise hashes a stored download against the lockfile before reusing
it and fetches again on a mismatch, so the cache can save a download but cannot change what is
installed. Installing Mise or ETHOS does not establish hosted acceptance.

### Review and Protected Execution

- Proposal and merge-request jobs use review runners. Protected `dev`, `main`, and release jobs use
  separate trusted runners. Accounts, identities, workspaces, caches, and credential reachability do
  not cross that boundary; another tag on the same runner does not provide separation.
- Require project locking and tagged-only scheduling on every GitLab runner; trusted runners also
  require native `ref_protected` access. Keep `dev`, `main`, and `v*` protected so proposal YAML
  cannot select a trusted runner.
- Once a proposal has an open MR, use its MR pipeline instead of a duplicate branch-push pipeline.
- The macOS guest follows the [tool-supply boundary](#tool-supply).

### Credential-Bearing Paths

Observe registration/polling and clone separately. The
administrator's HTTP-only GitLab is a fixed deployment boundary. A registration tunnel does not
protect clone traffic; each unencrypted path needs an authorized bounded risk decision
for the isolated network. Tags, YAML, or older green runs prove neither actual execution nor
registration and isolation.
