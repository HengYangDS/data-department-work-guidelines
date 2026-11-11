## Why

The repository declares and runs ETHOS 0.2.0-beta.6. The owner asked that every governed repository
run the latest ETHOS release, and that every supply chain move to its latest stable release without
a separate confirmation. 0.2.0-beta.7 publishes its own Mise declaration, whose platform checksums
equal the release's `SHA256SUMS` and the published asset digests.

Its adopter-facing changes since 0.2.0-beta.6 are these:

- **The root commands select one declared catalog operation.** A request whose flags select no
  operation, or that sets a flag its operation does not take, exits 2 with
  `command_operation_unmatched:<command>` or `command_field_refused:<field>`; a preview refuses
  `--authorize`; negated flags such as `--no-apply` are gone; usage errors exit 2 with a
  `usage_refused` result. This repository's tracked documents name no refused form.
- `next.form` names the catalog operation, whose effects, destructiveness and authorization `next`
  carries.
- The CI model pins `jdx/mise-action` v5.2.7, so the GitHub workflow is generated again.
- `ethos lane redact private-addresses` and the profile's `record_roots` remove a protected peer's
  identity from records; the push check `[peer_identity] mode` stays `disabled` by default. Under
  `required`, push admission refuses a peer feed that the clone cannot know, and the redaction verb
  answers `unknown` without a known feed.
- `ethos hook retire-records` plans and applies store retention under the paradigm's `retention`
  floors.
- Every governed repository keeps `VERSION` and a Keep a Changelog `CHANGELOG.md`, `[release]`
  admits only `mirror`, and `rules.toml` keeps only the tables its readers consult. This repository
  already conforms: `VERSION` names 8.0.0, `[release]` holds only `mirror` and it has no
  `rules.toml`.
- `ethos --version` names the source commit again.
- `ethos lane prewrite --target index --patch <file>` checks an exact selective staging patch against
  the index instead of the working file, reusing staged admission; the worktree target stays the
  default. Nothing in this repository depends on it.
- **Breaking (exit status and publication):** a usage error exits 2 with `usage_refused`, an
  undeliverable result exits 3, `ethos publish --ref … --probe-remote` exits 1 when its verdict is
  `unknown`, and `ethos publish --apply` takes only a probe's `--receipt`. This repository's tracked
  files and CI call none of these forms, and the npm launcher that beta.7 removes was never used
  here.
- `pre-commit` refuses a staged file of a registered language above the paradigm's per-file code
  ceiling, which the proof already enforced.
- An exception from one proof gate or one of its providers now refuses only that gate, as
  `gate_runner_error:<gate>` or `gate_provider_error:<gate>:<provider>`, while every other gate
  keeps running and keeps its evidence; a timeout stays `unknown`.

## What Changes

- Replace the 0.2.0-beta.6 declaration in `.config/mise/config.toml` with the declaration published
  with 0.2.0-beta.7, unchanged, and lock it again with native `mise lock`; the lock stays at
  version 3.
- Bind the repository family to the 0.2.0-beta.7 runtime through the locked console's
  `hook install`, keeping the 0.2.0-beta.6 runtime as the rollback.
- Generate both pipelines again from the 0.2.0-beta.7 common model.
- Record the move in the Changelog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, the generated `.github/workflows/ci.yml` and
`.gitlab-ci.yml`, `CHANGELOG.md` and the repository-common runtime selection. The hosted jobs' Mise,
GitLab's Linux image and the declared peers stay as they are. `tasks.md` is the sole progress
ledger.
