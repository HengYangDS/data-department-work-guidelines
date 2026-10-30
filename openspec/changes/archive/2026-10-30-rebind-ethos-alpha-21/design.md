## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.20 today. The GitLab jobs on the Windows ARM64
runners fail at ETHOS supply, because no earlier release declared that platform.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-alpha.21. The GitLab Windows ARM64 jobs install it, but their launcher still exits before
  ETHOS runs, so their acceptance is withdrawn under DR-0005 (task 2.2).
- Keep the 0.2.0-alpha.20 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration. The generated pipelines change only
  by the job-local Mise variables.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- The Windows ARM64 archive carries the x64 runtime that the release qualified on a Windows ARM64
  host, which runs it through emulation. The release declares that archive for the platform, so the
  GitLab runner gets it through the same lock as every other platform.
- Declare the five lock platforms in `lockfile_platforms`. The default set of native `mise lock`
  omits Windows ARM64, so without the setting a later lock would drop that platform again.
- Keep `MISE_DATA_DIR` and `MISE_CACHE_DIR` under each GitLab job's
  `build/runtime/tool-cache/mise`, with the values `architecture-publisher` uses. Job-local state
  stops sharing Mise data across jobs and projects. Each job then downloads ETHOS once, about two
  minutes on the Windows runner.
- Set `MISE_WINDOWS_SHIM_MODE` to `file`. On the Windows ARM64 review runner, Mise installed the
  archive and then could not copy `mise-shim.exe` as a tool shim (`os error 5`), in the runner
  account's profile and in the job's own directory alike. The `file` mode writes batch and script
  shims instead. The jobs run ETHOS through `mise exec`, so no job needs an executable shim, and
  other systems ignore the setting.
- 0.2.0-alpha.21 changes no contract this repository relies on. Its other notes widen which
  references prewrite treats as owned, report the semantic reference closure beside a proof's audit
  without changing its verdict, and let a first release be cut from a newly formed repository.
- Bind through the locked 0.2.0-alpha.21 console, so the selected runtime is the one the lock
  declares.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.20 fails under 0.2.0-alpha.21] → The full proof runs at the
  archived head before landing; a failure is repaired at its owner, or the rebind rolls back.
- [The Windows ARM64 runner installs the archive, but the launcher exits 6 at process start] →
  Three probes narrowed it to the launcher start under the runner's service account: `prove`, then
  `ethos --version` without a redirect, then the same with GitLab Runner's PowerShell stdin flag.
  The job-local Mise state and file shims stay, because they removed the earlier shim refusal.
  ETHOS owns the follow-up, and the observation returns through a new Change.
- [The release ships `uv` 0.13.5, whose embedded `rustls` 0.23.45 carries four advisories, and npm
  12.2.1, whose bundled packages carry six, none with an upstream fix yet] → The release notes
  record them, as they did for 0.2.0-alpha.20.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, qualify the head on
GitHub and GitLab's Linux and macOS jobs, and prove the archived head. To roll back, restore the
0.2.0-alpha.20 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.20 runtime path>`.
