# Design

## Context

See [proposal.md](proposal.md) for the motivation. The toolkit is one dependency chain with a
single root. `tools/docs/cli.mjs` checks the Changelog and the npm dependency policy of the
toolkit itself.
Its four npm dependencies need a lock and an audit; the audit needs OSV Scanner; OSV Scanner needs
a native supply manifest, an installer and GitLab packages; offline use of all of them needs a
bundle with its builder, acquisition and workflows; and the code needs tests, coverage and static
analysis because it is code. Installed ETHOS already owns the root duty: its repository paradigm
validates the Changelog grammar for every repository, and its release preparation requires the
`VERSION` entry.

## Goals / Non-Goals

**Goals:**

- Leave no authored code, package, native-tool supply or offline distribution in the repository.
- Keep every remaining duty with one owner: installed ETHOS for shared checks, DDWG for its
  content, parameters and release editorial.
- Keep hosted verification, branch protection and the release route working on both Forges.

**Non-Goals:**

- Withdrawing earlier editions' attached downloads or packages. The unchanged retention
  requirement governs that aftercare.
- Adding a shared ETHOS check for comparison links or duplicate owners.

## Decisions

### Retire the whole chain in one Change

Every part of the toolkit either performs the Changelog check or supports another part. Removing
only the check would leave the dependencies, their audit and supply, the bundle and the tests
justifying each other. Alternative considered: keep the dependency audit as a supply-security
check. Rejected because, without the package, there is nothing to audit; ETHOS audits its own
release supply.

### Installed ETHOS owns Changelog structure; comparison links are navigation

The paradigm check covers `Unreleased` placement, categories, headings, dates, version order and
duplicates; release preparation requires the `VERSION` entry. The extra rules of the toolkit
verified
that History links resolve to adjacent tags with correct ancestry and that both Forges are
offered. ETHOS deliberately treats such links as navigation, not verified facts, and the
maintainer decided on 2026-10-29 to drop the verification. Alternative considered: ask ETHOS for a
shared link check. Not needed now; it can return as a shared duty if wanted.

### The profile declares no gates

With no code, the behavior and static-analysis axes have no subject, and the document gate has no
remaining duty. Installed ETHOS selects the applicable shared checks from the authored carriers.

### Retire `tool-supply` instead of keeping a misnamed capability

Three of its requirements still hold duties: reading without installation, tag routes and command
currency. They move to the capabilities whose readers need them, and `retire_capabilities: true`
lets official OpenSpec delete the empty spec at archive. Alternative considered: keep
`tool-supply` with three requirements. Rejected because its name and purpose would describe a
supply the repository no longer has.

### Keep the generated CI model and the Mise bootstrap

The common CUE model and its parameters stay; the repository source keeps only its package
clause, because the offline jobs were its only content. GitLab's Linux jobs still bootstrap Mise
from the project's package registry, so `.config/mise/install.sha256` and the runner declarations
stay. Hosted jobs keep their names, so branch protection's required checks are unchanged.

### State `Unreleased` as the net change

Unreleased notes describe the next edition against 7.0.12. Entries that announced toolkit parts
later removed, or retained toolkit duties, are replaced by one removal entry, so the 8.0.0 notes
describe what readers and contributors actually receive.

## Risks / Trade-offs

- [Existing clones keep an ignored `node_modules/`] → Once `.gitignore` no longer names it, the
  directory shows as untracked; Contributing tells maintainers to delete it.
- [GitLab's Windows ARM64 jobs] → They still lack ETHOS supply; this Change does not alter that
  boundary.
- [Earlier editions' bundles lose their CI qualification route] → Their signed tags keep their own
  source and workflows; retiring the downloads stays a separate maintainer decision.
- [Hosted acceptance] → GitHub runs on the proposal ref before landing. Reading GitLab pipeline
  results needs a working API credential; without it, GitLab acceptance stays pending.
