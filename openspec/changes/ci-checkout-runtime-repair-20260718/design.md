# Design

## Context

The shared documentation verifier starts by resolving the current Git root. The
GitHub workflow runs `actions/checkout` in `node:22-bookworm`, but that image
does not provide Git. Checkout therefore falls back to an archive in the failed
hosted run, and the verifier fails closed before testing documents. GitLab uses
the same image family and must make Git an explicit runtime prerequisite.

## Goals / Non-Goals

**Goals:**

- Guarantee that each provider calls the same repository verifier from a real
  Git checkout.
- Remove the GitHub container assumption that prevents checkout from satisfying
  that contract.
- Keep GitLab an independently runnable Docker projection with explicit system
  dependencies.
- Make the ordering and dependency contract regression-testable without
  calling either forge.

**Non-Goals:**

- Claiming a successful hosted run before each forge reports one.
- Adding a provider-owned copy of the documentation verifier.
- Making container images, caches, or runner paths into repository truth.

## Decisions

### GitHub uses a runner-native checkout

The GitHub job no longer declares a `container`. `actions/checkout@v4` runs on
the hosted runner first, then `actions/setup-node@v4` selects Node 22, and the
job installs locked Node packages before the shared verifier. This deliberately
breaks the old container topology: Git becomes a prerequisite supplied by the
checkout host, not a package installed too late inside the job image.

**Alternative rejected:** install Git in a step after checkout. That cannot
repair a checkout that already fell back to archive mode.

### GitLab keeps a Docker plane with explicit prerequisites

GitLab continues to use `node:22-bookworm`, but its `before_script` installs
`git`, `python3`, `python3-venv`, and `chromium` before `npm ci` and the shared
verifier. The GitLab projection remains independent while having an explicit
Git-capable runtime contract.

**Alternative rejected:** remove GitLab's container merely to make it resemble
GitHub. Equivalent verification does not require identical provider topology.

### The repository test owns the contract

`tests/validate-ci-runtime-binding.sh` parses both projections. It verifies the
exact shared verifier command, rejects a GitHub `container:` declaration,
requires checkout before any `run` step, requires Node 22 selection after
checkout, and requires Git in GitLab's package install. It also checks provider
workflows with `actionlint` and `yamllint` when those validators are available.

**Alternative rejected:** infer checkout correctness by invoking the verifier
locally. Local Git availability cannot prove the provider workflow ordering.

## Risks / Trade-offs

- **Hosted runner tool drift** → select Node 22 explicitly and retain the
  lockfile installation.
- **GitLab image drift** → retain all required packages in the workflow and
  test the package line.
- **Projection divergence** → make the shared verifier command a test
  invariant instead of duplicating scripts.
- **Hosted failure after local pass** → report that as a separate external
  result; do not weaken the checkout contract.

## Migration Plan

1. Add the active Change, scope companion, claim, Chronicle, and specification
   delta before altering material workflow files.
2. Replace GitHub's job container with runner-native checkout and explicit Node
   selection; add Git to GitLab prerequisites.
3. Extend the repository CI contract test and run local workflow, document,
   OpenSpec, ETHOS lifecycle, claim, and proof checks.
4. Archive only after all Change tasks are complete, then rerun proof at the
   archive result before local landing.
5. Publish only accepted `dev` and `main` to each forge and observe hosted CI
   separately before claiming provider success.
