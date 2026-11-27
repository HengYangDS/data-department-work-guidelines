## Why

The repository declares and runs ETHOS 0.2.0-beta.11. The owner asked that every governed repository
run the latest ETHOS release. 0.2.0-beta.12 upgrades directly from 0.2.0-beta.11 and publishes its
own Mise declaration; the lane checks each of its platform checksums against the release's
`SHA256SUMS` and the published asset digests before using it.

What 0.2.0-beta.12 changes that bears on this repository (a selection; the release's entry is the
full list):

- The commit grammar admits the type `style`: the paradigm's types become the eleven that the
  Conventional Commits 1.0.0 configuration names. The repository restates no `subject_pattern`, so
  the paradigm's grammar admits the type once the release is bound.
- A staged admission, the index-target preview of `ethos lane prewrite` and the commit, is judged
  by its staged tree; the obligation `staged-openspec-tree` enters as reporting, so a staged tree
  that does not pass is reported under `reported_gaps` and the working files decide as before.
- An executed proof with a frozen source records each gate's run under `gate-results/` in the
  Git-common store and compares it with earlier runs of the same input; no verdict, gap or
  Attestation changes.
- The shipped Vale policy, which the `prose` gate runs, ignores the front-matter field
  `workaround`; it adds no diagnostic.
- The shipped Docs Registry gains the section "Decision records", which states one form for every
  governed repository's decision records. No command, schema or check changes with it; moving this
  repository's records to that form is a Change of its own.
- ETHOS deprecates Windows. The repository already pins no Windows archive of ETHOS, so it takes
  the release's declaration without its Windows platforms, as it took 0.2.0-beta.11's.
- Before the tag, the release's candidate was proved on disposable copies of the governed trees. A
  full proof of this repository's tree of that day passed, and proof previews of its later head
  under the release added no required gap and no refusal against 0.2.0-beta.11.

## What Changes

- Replace the 0.2.0-beta.11 declaration in `.config/mise/config.toml` with the declaration published
  with 0.2.0-beta.12, keeping the `http:ethos` table form and the three platforms the repository
  pins, and lock it again with native `mise lock`; the lock stays at version 3.
- Bind the repository family to the 0.2.0-beta.12 runtime through the locked console's
  `hook install`, keeping the 0.2.0-beta.11 runtime as the rollback.
- Check both generated pipelines against the 0.2.0-beta.12 common model with
  `ethos lane project --check`, and regenerate them only if it reports drift.
- Record the move under Changed in the Changelog's Unreleased section.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The guidelines, their checks and their publication behave as before, so `.openspec.yaml` sets
`skip_specs: true`.

## Impact

`.config/mise/config.toml`, `.config/mise/mise.lock`, `CHANGELOG.md`, the generated pipelines only
if the projection check reports drift, and the repository-common runtime selection. The hosted jobs'
Mise, GitLab's Linux image and the declared peers stay as they are. `tasks.md` is the sole progress
ledger.
