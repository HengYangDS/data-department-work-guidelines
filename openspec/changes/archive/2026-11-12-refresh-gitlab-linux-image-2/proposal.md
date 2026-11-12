## Why

GitLab's Linux jobs run in `public.ecr.aws/docker/library/node:26-trixie`, pinned by the index
digest `438603bb…`. The tag's current multi-platform index is `e18c3ccd…`, whose images were built
on 11 November 2026 at 18:42 UTC; it moves Node 26.13.0 to 26.13.1 and refreshes the Debian base.
The owner's direction is that every supply chain moves to its latest stable release once it is at
least 24 hours old. The Linux runners admit only listed images, so the move depends on their owner
admitting `e18c3ccd…` beside `438603bb…` and loading it into both runner stores.

## What Changes

- Pin GitLab's Linux image to the current `node:26-trixie` index digest in
  `.config/ci/verification.toml` and generate both pipelines again from the common model.
- Update the Changelog bullet for the image.
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
