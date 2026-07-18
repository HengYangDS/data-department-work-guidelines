# Design

## Context

On July 18, 2026, GitHub Actions runs for commit `c99383b` reached the shared
repository verifier and failed at Mermaid rendering. The provisioned Chrome
reported that no usable sandbox was available. The failure occurs after checkout
and does not justify weakening local rendering or duplicating provider scripts.

## Goals / Non-Goals

**Goals:**

- Make hosted rendering use a single checked-in, provider-neutral Puppeteer
  launch configuration.
- Keep local `scripts/validate-docs.sh` sandboxed unless CI explicitly opts in.
- Make both hosted projections select the same configuration before the shared
  verifier starts.
- Detect missing, inline, or divergent CI overrides locally.

**Non-Goals:**

- Claiming that either hosted CI plane passes before it reports a fresh run.
- Introducing a host path, cache path, executable-bit dependency, or external
  download as repository truth.
- Changing any guideline, DR, or adoption-lifecycle boundary.

## Decisions

### CI selects a checked-in Puppeteer config

Add `tools/ci/config/mermaid-puppeteer-hosted.json` with only the Chrome launch
argument required by the constrained hosted environment. `validate-docs.sh`
accepts an explicit `--hosted-renderer-config <repository-relative path>` and
passes it to Mermaid CLI's `--puppeteerConfigFile` option.

**Alternative rejected:** set a global environment variable or shell alias.
Those are invisible to the repository contract and can accidentally affect local
runs.

### Local validation retains default sandbox behavior

Without the explicit option, `validate-docs.sh` invokes Mermaid CLI exactly as
before and supplies no Puppeteer configuration. The hosted option is rejected
unless it resolves inside the repository and is the canonical JSON file.

**Alternative rejected:** unconditionally add `--no-sandbox`. That turns a
CI-specific compatibility exception into a local security regression.

### Both providers call one verifier with the same selection

GitHub and GitLab set one environment variable naming the repository-relative
configuration. The unchanged bound verifier forwards that value to the
repository validator. The CI contract test requires both projections to use the
same variable and rejects direct `--no-sandbox` strings in workflow YAML.

**Alternative rejected:** place bespoke render commands in each workflow.
That would split proof behavior by provider and hide configuration drift.

## Risks / Trade-offs

- **CI configuration leaks into local use** → the validator has an opt-in
  argument, validates the path, and defaults to no config.
- **Provider drift** → the provider contract test checks exact shared selection
  and absence of inline override text.
- **A new Chrome failure appears** → preserve raw provider logs as external
  evidence and open another Change rather than broadening the exception.

## Migration Plan

1. Create the active Change, scope companion, claim, and Chronicle.
2. Add the CI-only JSON config and explicit validator option.
3. Route both workflows through the existing verifier with the same selection.
4. Run local positive and negative contract tests, then the complete local proof.
5. Archive only after all tasks complete; publish eligible refs and observe each
   provider independently afterward.

## Open Questions

None. The host failure provides a specific Chrome error and Mermaid CLI exposes
a checked-in Puppeteer config interface.
