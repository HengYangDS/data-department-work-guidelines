## Why

Every GitLab guest job downloads the locked ETHOS release again: the Mise data and cache directories
sit under the job's own `build/` directory, which does not survive the job. In the 9.0.0 release's
three pipelines the download took 7,023 of the 7,317 seconds that the guest jobs ran (96 %); the
checks took 15 to 60 seconds per job. When the guests' download rate drops below about 305 kB/s,
the Linux job cannot finish its 362 MB download inside the 20-minute job timeout, which is what
failed the v9.0.0 tag pipeline. The owner's target for a commit's guest pipeline is 15 minutes.

## What Changes

- Keep the Mise download cache (`MISE_CACHE_DIR`) in a directory that each runner keeps between its
  jobs: the Linux runners' own `/cache` volume, and the builds directory of the macOS and Windows
  runners. `mise install --locked` reuses a stored download only after checking it against the
  lockfile's checksum.
- Keep installs job-local (`MISE_DATA_DIR` under the job's `build/`), so every job still unpacks
  the locked release itself; a restored install would not be checked against the lock.
- Say so in the contributor guide, and record the change in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. CI parameters only; the change uses the official no-spec marker.

## Impact

`.config/ci/verification.toml`, the generated `.gitlab-ci.yml`, `CONTRIBUTING.md`, and the
Changelog. No guideline page changes, so no release is cut for it.
