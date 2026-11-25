## Context

See [proposal.md](proposal.md). `.config/ci/verification.toml` holds the hosted GitHub job's Mise
release, and ETHOS's common model generates both pipelines from it. GitLab's jobs run on the macOS
guest's runners and use the Mise that guest provides.

Mise 2026.11.12 to 2026.11.14 add opt-in features (`mise audit`, a per-tool `bump` option, daemon
options, an experimental task cache sandbox) and change no default that the hosted jobs use. Their
one breaking change concerns how one Java distribution names its hotfix versions, and this
repository installs no Java. The fixes nearest these jobs concern ceiling paths that pass through a symbolic link and a
task's locked `tools`; GitLab's ceiling path is the project directory's parent, and the jobs install
the locked tools with `mise install --locked`, so neither changes their behaviour.

## Goals / Non-Goals

**Goals:**

- Install Mise 2026.11.14 in the hosted GitHub job.

**Non-Goals:**

- Changing any gate, check, guideline or runner declaration.
- Changing the lockfile format; no step runs `mise lock --upgrade`.
- The Mise that GitLab's macOS guest provides, which the guest owns.
- Raising the Mise floor, which states the oldest Mise that reads this configuration.

## Decisions

- Take this move in a lane of its own, since none is open, so that one proof and one pair of hosted
  runs qualify it.
- Leave `jdx/mise-action` as the installed common model pins it; that pin moves with an ETHOS
  release.

## Risks / Trade-offs

- [Mise 2026.11.14 changes a hosted bootstrap] → The proposal's hosted runs on both Forges qualify
  it before landing.

## Migration Plan

Move the Mise parameter, generate both pipelines, prove the archived head and qualify it on GitHub
and on GitLab's macOS jobs. To roll back, restore the 2026.11.11 parameter.
