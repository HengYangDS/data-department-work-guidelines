## Why

GitLab's Linux jobs run in `public.ecr.aws/docker/library/node:26-trixie`, pinned by the index
digest `6d2c7d5d…`. The tag's current multi-platform index is `438603bb…`, pushed on 6 November
2026. Both carry Node 26.13.0, so the move refreshes the Debian base. The owner's direction is that
every supply chain moves to its latest stable release. The Linux runners admit only listed images,
so the move depends on their admitting `438603bb…` beside `6d2c7d5d…`, which the owner approved
on 8 November 2026.

## What Changes

- Pin GitLab's Linux image to the current `node:26-trixie` index digest in
  `.config/ci/verification.toml` and generate both pipelines again from the common model.
- Record the move in the Changelog.
- Qualify the archived head on GitHub and on GitLab's review jobs, including the protected Linux
  job on the landed head.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml` and `CHANGELOG.md`. Only GitLab's
Linux jobs change their image. `tasks.md` is the sole progress ledger.
