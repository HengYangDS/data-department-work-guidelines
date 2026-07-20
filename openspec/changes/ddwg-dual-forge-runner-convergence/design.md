# Design

## Context

This repository currently declares a GitHub-hosted Linux workflow even though
the intended default is one local GitHub runner and one local GitLab runner per
project. GitLab already has project runner 48 on macOS/ARM64, but its pipeline
does not select it and its remote policy currently permits untagged work. GitHub
has no repository runner or runner-label variable. The previous workflow also
assumed provider-supplied Node, Chrome, and Linux package installation instead
of the chosen local macOS runner boundary.

## Goals / Non-Goals

**Goals:**

- Bind GitHub documentation verification to one repository-specific macOS/ARM64
  runner label, supplied as a non-secret repository variable.
- Prevent fork-origin pull requests from executing on the privileged local
  GitHub runner.
- Bind GitLab documentation verification to one explicit project runner tag,
  then require its remote policy to be locked and to refuse untagged jobs.
- Keep the two Forge services, credentials, installation roots, work areas, and
  evidence receipts separate while retaining one repository-owned verifier.

**Non-Goals:**

- Reusing a runner across repositories or using a GitHub runner for GitLab.
- Recording registration credentials, request bodies, or private runner state
  in the repository.
- Treating local workflow lint, a LaunchAgent, or a runner API listing as a
  completed GitHub/GitLab job.

## Decisions

### GitHub uses a dedicated macOS runner selector

The GitHub job requires the default `self-hosted`, `macOS`, and `ARM64` labels
plus `${{ vars.DDWG_GITHUB_RUNNER_LABEL }}`. The variable stores the repository
specific label `ddwg-github-macos-arm64`, so the YAML remains reusable only
within this repository's own control plane. The job's condition allows pushes
and same-repository pull requests, but refuses a pull request whose head
repository differs from the base repository.

**Alternative rejected:** `ubuntu-latest` or a shared generic local label.
Hosted capacity violates the requested local default; a generic label allows a
different project to schedule work on this project's host.

### GitHub consumes pre-managed local runtimes

The runner service environment exposes Homebrew and Python. The workflow adds
the managed Node 22 prefix to `GITHUB_PATH`, verifies that version, and binds
Puppeteer to the installed Chrome application. It does not use setup actions,
apt, sudo, or browser downloading. This keeps the runner's OS surface explicit
and lets the same repository verifier create only checkout-scoped state.

**Alternative rejected:** downloading Node or Chrome per job. That would add
provider cache behavior and hidden network dependencies to an intended local
runner boundary.

### GitLab preserves its Docker plane with an explicit tag

The GitLab job remains `node:22-bookworm` so its Docker execution and
`privileged=false` isolation stay independent from the GitHub macOS job. The
job specifies `ddwg-documentation-ci`; after that tag is published on an
eligible ref, runner 48 is set to the same tag, `locked=true`, and
`run_untagged=false` through the GitLab control plane.

**Alternative rejected:** remove the Docker executor to make GitLab look like
GitHub. Equal repository verification does not require equal provider runtime
topology, and cross-Forge runner reuse is prohibited.

### Provider evidence remains non-substitutable

GitHub deployment evidence comprises repository variable/readback, runner
identity and labels, the workflow run ID, its revision, and conclusion. GitLab
deployment evidence comprises runner 48's remote readback, tag/policy, pipeline
ID, job runner, revision, and conclusion. Each is retained and evaluated only
for its own Forge.

## Risks / Trade-offs

- **GitHub runner is unavailable or mislabeled** → jobs remain queued; inspect
  the repository runner API and service rather than falling back to hosted
  capacity.
- **A fork PR reaches the workflow trigger** → the job is skipped by the
  repository-identity condition; no fork code runs on the local host.
- **GitLab runner policy is tightened before tagged YAML is published** → jobs
  could become unschedulable; publish the tagged job first, then change runner
  48 and read it back.
- **Local proof passes while a Forge fails** → report the Forge failure as a
  separate runtime fact; do not weaken the binding or conflate evidence planes.

## Migration Plan

1. Complete this Change's scope, regression test, active claim, and Chronicle.
2. Validate the workflow bindings, repository documentation, strict OpenSpec,
   claims, and HEAD-bound local proof; archive the Change and close locally.
3. Record the approved official-release fallback for Actions Runner, install it
   in the repository-specific local root, register the repository runner, set
   the repository variable, and load its dedicated LaunchAgent.
4. Publish only eligible `dev`/`main` refs, then configure and read back the
   GitLab runner tag/policy. Observe fresh GitHub and GitLab runs separately.
5. If a provider-specific check fails, disable or repair only that provider's
   runner; never redirect its workload to the other Forge or mutate history.
