## Context

See [proposal.md](proposal.md). `.config/mise/config.toml` declares the ETHOS release that the
hosted jobs install, and the repository-common Git directory selects the runtime that every
worktree of the family runs. Both name 0.2.0-alpha.30 today. The common CI model of
0.2.0-beta.2 adds `GET_SOURCES_ATTEMPTS: "3"` to the generated Windows verification jobs, so the
GitLab pipeline's two Windows jobs gain it; the generated GitHub workflow stays as it is.

## Goals / Non-Goals

**Goals:**

- Run every gate and lifecycle command of the family, locally and in hosted jobs, on
  0.2.0-beta.2.
- Keep the 0.2.0-alpha.30 runtime available as the rollback until the landing is accepted.

**Non-Goals:**

- Changing any gate, check, guideline, runner declaration, Mise release or image, or the CI
  projection beyond what the common model generates.

## Decisions

- Copy the release's own declaration unchanged and lock it with native `mise lock`, as the earlier
  moves did. Each platform checksum is checked against the release's `SHA256SUMS` and the published
  asset digests first, so the URLs and checksums keep one published source.
- Bind through the locked 0.2.0-beta.2 console, so the selected runtime is the one the lock
  declares.
- Regenerate the pipelines with `ethos lane project` instead of editing them by hand, so the Windows
  source-checkout retry comes from the common model.

## Risks / Trade-offs

- [A gate that passed under 0.2.0-alpha.30 fails under 0.2.0-beta.2] → The lane runs the
  0.2.0-beta.2 gates after the bind, and the full proof runs at the archived head before landing;
  a failure is repaired at its owner, or the family binds the retained 0.2.0-alpha.30 runtime again.
- [The release ships supply with advisories that no stable upstream release fixes yet] → ETHOS
  records them: its Security notes name the two advisories that npm 12.2.2 still bundles (`glob`
  13.0.6 and `minimatch` 10.2.5), which no npm release fixes yet, and its residual supply audit
  lists the Go standard library and module advisories in the bundled CUE, Vale and `shfmt`, which
  ETHOS runs offline on repository files. This repository holds no Go and no npm of its own, so none
  of them reaches its content.

## Migration Plan

Copy the declaration, lock it, install the locked supply, bind the runtime, regenerate the
pipelines, run the gates, prove the archived head and qualify it on GitHub and GitLab. To roll back,
restore the 0.2.0-alpha.30 declaration and lock and bind the retained runtime with its own console's
`hook install --runtime <0.2.0-alpha.30 runtime path>`.
