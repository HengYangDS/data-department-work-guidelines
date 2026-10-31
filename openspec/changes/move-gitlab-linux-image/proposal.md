## Why

GitLab's Linux jobs run in `public.ecr.aws/docker/library/node:26-trixie`, pinned by the digest
of its reviewed multi-platform index, `1b84b89a…`. The current index of that tag is `6d2c7d5d…`,
and the owner's direction is that every supply chain moves to its latest stable release.
`rebind-ethos-alpha-22` kept the reviewed digest because the Linux runners admit only listed images;
their owner has since admitted the current digest beside the reviewed one.

## What Changes

- Pin GitLab's Linux image to the current `node:26-trixie` index digest in
  `.config/ci/verification.toml` and generate both pipelines again from the common model.
- Record the move in the Changelog.
- Qualify the archived head on GitHub and on GitLab's Linux and macOS jobs, including the
  protected Linux job on the landed head. GitLab's Windows ARM64 jobs stay outside the acceptance,
  as `rebind-ethos-alpha-21` withdrew them under DR-0005.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml` and `CHANGELOG.md`. Only GitLab's
Linux jobs change their image. `tasks.md` is the sole progress ledger.
