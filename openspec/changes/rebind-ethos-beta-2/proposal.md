## Why

The repository declares and runs ETHOS 0.2.0-alpha.30. The owner asked that every governed
repository run the latest ETHOS release, which is now 0.2.0-beta.2, and that every supply chain move
to its latest stable release without a separate confirmation. 0.2.0-beta.2 is published with its own
Mise declaration, whose platform checksums equal the release's `SHA256SUMS` and the published asset
digests. Its adopter-facing changes are these. It is the first published beta and upgrades directly
from 0.2.0-alpha.30, because 0.2.0-beta.1 was tagged but never published. A full proof takes the
host-wide slot after its repository's slot and admits on two consecutive 1-minute load samples. The
generated Windows verification jobs retry their source checkout up to three times, so this
repository's GitLab projection gains `GET_SOURCES_ATTEMPTS: "3"` on its two Windows jobs. The
runtime's locked npm moves to 12.2.2, which removes six bundled advisories. This repository declares
no Mise tool besides ETHOS.

## What Changes

- Replace the 0.2.0-alpha.30 declaration in `.config/mise/config.toml` with the declaration
  published with 0.2.0-beta.2, unchanged, and lock it again with native `mise lock` for the five
  declared platforms.
- Bind the repository family to the 0.2.0-beta.2 runtime through the locked console's
  `hook install`, keeping the 0.2.0-alpha.30 runtime as the rollback.
- Regenerate the CI projection from the common model with `ethos lane project`. The two Windows
  jobs of `.gitlab-ci.yml` gain `GET_SOURCES_ATTEMPTS: "3"`, and nothing else changes.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml`
sets `skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `.gitlab-ci.yml`, `CHANGELOG.md` and the
repository-common runtime selection. Hosted jobs keep Mise 2026.10.25, the
Mise floor and GitLab's Linux image. `tasks.md` is the sole progress ledger.
