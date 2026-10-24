## Context

See [proposal.md](proposal.md). The generated GitHub workflow already acquires locked product
supply with `mise install --locked`, then runs the installed console through
`mise exec --locked -- ethos`. ETHOS's release assets include `ethos-<version>.mise.toml`, a
declaration of `http:ethos` whose platform entries name each release archive, its SHA-256
checksum and the archive's console directory. ETHOS 0.2.0 declares macOS ARM64, Linux x64 and
ARM64, and Windows x64; it publishes no Windows ARM64 archive.

## Goals / Non-Goals

**Goals:**

- A clean GitHub runner installs the exact ETHOS release from the committed lock and runs the
  full repository verifier with it on all four hosted platforms.

**Non-Goals:**

- GitLab's jobs, including the Windows ARM64 runner, and the offline bundle.
- Changing the generated pipelines or the repository's own ETHOS runtime selection.

## Decisions

- Copy the release's own declaration unchanged, so its URLs, checksums and `bin_path` stay
  those that ETHOS published, and lock it with native `mise lock`. A hand-written declaration
  could drift from the published bytes.
- Declare the latest published release. Qualify the hosted jobs with 0.2.0-alpha.12 first,
  because it is published, then move to 0.2.0-alpha.13 when ETHOS publishes it, since that
  release keeps the state of mise disposable and lets admitted commands run their own mise tasks.
- Qualify the exact head that lands. Branch protection checks the commit itself, so the
  archived head is published as a proposal and lands only after its four `verify` jobs pass.

## Risks / Trade-offs

- [A hosted platform fails with the installed release] → The failure stays on the proposal,
  `dev` and `main` keep their current heads, and an ETHOS defect returns to ETHOS for its next
  release.
- [A runner whose platform has no archive, such as GitLab's Windows ARM64] → It cannot install
  from the lock and stays out of scope until ETHOS publishes that platform.
