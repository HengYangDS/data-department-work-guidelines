# Contributing

This guide is for maintainers who change, check, or publish the repository.
Reading or applying the guidelines requires no software installation.

Find the rule's owner through the [task map](docs/README.md). Before editing,
read [repository governance](docs/governance/ethos.md), run the installed
`ethos status --json` in the intended Work Lane, and obtain passing
`ethos lane prewrite` admission for the exact paths. Keep progress in the selected
official Change's `tasks.md`. The installed Git-common hooks enforce commit and
push admission; a method-pack plan or decision record grants neither.

## Verify the source

Use the Node line and exact npm version declared in
[`package.json`](package.json). Prepare them through the destination's existing
installation owner; do not bypass npm admission with `--force` or an override.
Install locked dependencies with `npm ci --ignore-scripts`.

GitLab's macOS and Windows jobs use the existing Mise installation with the
[project runtime configuration](.config/supply/mise.toml) and its
[native lock](.config/supply/mise.lock). Mise installs selected versions under
its native data directory and scopes their PATH to each command. The jobs do
not modify the host's npm, Runner service, or isolation. Runtime preparation
is separate from offline verification: the offline installer never supplies
missing Node or npm.

Use the Vale, lychee, and OSV Scanner versions in the
[native supply manifest](.config/supply/native.json). Your existing installation
owner may supply them. To install already supplied assets in the repository's
managed cache, use:

```text
node tools/ci/install-native.mjs vale --asset VALE_ARCHIVE
node tools/ci/install-native.mjs lychee --asset LYCHEE_ARCHIVE
node tools/ci/install-native.mjs osv-scanner --asset OSV_BINARY
```

The verifier selects `DDWG_VALE_BIN`, `DDWG_LYCHEE_BIN`, or
`DDWG_OSV_SCANNER_BIN` first, then an existing managed-cache entry, and only
then PATH when that entry is absent. Set the relevant selector to use an
existing host installation instead of the cache. A selected invalid binary
fails; the verifier does not silently fall back. Managed binaries must match
the pinned platform bytes before startup. The host installation owner remains
responsible for external binary provenance; both routes require the declared
exact version.

Then run:

```text
npm run verify
ethos plan --changed --json
```

The complete verifier checks format, Markdown, English prose and terms, local
links and fragments, metadata, navigation, decisions, configuration, CI,
SemVer/Changelog, official OpenSpec, and the regression suite. It downloads
nothing. Before online publication, also run `node tools/docs/cli.mjs audit` and
retain its complete result under the
[supply boundary](docs/governance/ethos.md#tool-supply-and-offline-execution).

| When you need to                 | Command                        |
| -------------------------------- | ------------------------------ |
| Format the selected source       | `npm run format`               |
| Check formatting without writing | `npm run format -- --check`    |
| Check non-spacing Markdown rules | `node tools/docs/cli.mjs lint` |
| Check spelling, prose, and terms | `npm run prose`                |

Follow the [configuration map](.config/README.md) for spacing, native rules, and
byte-exact examples. Review meaning at the [communication](docs/communicate.md)
and relevant task owner: a passing style check cannot establish factual accuracy,
semantic fidelity, or reader understanding.

For `docs/` pages, copy a current page's leading ETHOS HTML metadata comment.
Leave one blank line before the H1, the first visible block. The repository
check guards reading order; ETHOS owns metadata meaning. Keep `node_modules/`
and generated output out of Git.

## Use the offline maintenance toolkit

For checks without remote supply, transfer the matching source-bound bundle to a
fresh checkout with the declared Node, npm, and Git. The optional toolkit does
not install the guidelines or include ETHOS:

```text
node tools/ci/offline-bundle.mjs inspect --bundle PATH
node tools/ci/offline-bundle.mjs install --bundle PATH
npm run verify
```

The installer checks the bundle before extraction, uses `npm ci --offline`, and
never downloads a missing tool or upgrades npm. Extraction uses the destination
executor's ownership. Third-party notices remain intact; the repository's MIT
grant does not relicense those packages.

Install ETHOS separately for Change admission and proof. Follow the
[supply contract](docs/governance/ethos.md#tool-supply-and-offline-execution) for
artifact risk and full platform qualification, and
[quality and local state](docs/governance/ethos.md#quality-and-local-state) for
source selection. Acquiring an asset online does not prove offline execution.
Git's tracked `.gitattributes` supplies LF on Windows too; do not replace it with
a host-specific setting.

## Commit and release

Configure your clone's author, committer, public SSH signing-key path, and
protected external trust anchor using your own identity. Do not copy host paths
or put credentials in source. New commits, including archive commits, require a
trusted signature; inspect attribution and signature before acceptance.

Use a scoped
[Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) subject,
for example `docs(guidance): clarify data-use boundaries`. Judge compatibility
from the actual public rule, route, or contributor-command change, not its label.
The [release contract](docs/governance/ethos.md#versioned-releases) defines SemVer,
Changelog structure, signed tags, and independent Forge acceptance.

## Publish a release

This route is for a new edition, not for recreating an earlier tag. Replace the
uppercase placeholders below with paths, a version, and project identities from
the current checkout. They are not literal filenames or credentials. Follow the
installed ETHOS verdict at every source transition; these commands do not grant
Change authority.

1. Prepare the version under the official Change. Review the public rule and
   contributor-command diff under SemVer, then align `VERSION` and the charter.
   Record upcoming changes under `Unreleased` in `CHANGELOG.md`; do not assign a
   release date before the release cut. Run `npm ci --ignore-scripts` and
   `node tools/docs/cli.mjs audit` on the intended Work Lane. The full source
   check follows the new bundle record in Step 2. Do not tag a merely prepared
   edition.

2. Supply every platform asset and upstream license notice under `tools` in
   [the native supply manifest](.config/supply/native.json). Obtain their exact
   bytes from the declared sources or an already qualified mirror. Use two local
   directories outside Git, with `ASSET_DIR/TOOL/` and `LICENSE_DIR/TOOL/` for
   every declared tool. OSV Scanner uses its official raw binary, not a repacked
   archive. The builder checks every name, SHA-256, npm package, and license
   notice. It installs locked npm packages online to prime the bundle; missing
   native assets and notices are never downloaded implicitly. npm package
   notices may be dedicated license files or an explicit readme License section
   agreeing with the package's native license declaration; code examples and
   incidental mentions do not qualify. The locked
   TOML plugin carries its complete MIT notice through its native Wasm API. The
   builder verifies that original notice and plugin identity without adding or
   rewriting package files. Choose a fresh output path under
   `build/artifacts/offline-bundle/`, with the basename
   `data-department-work-guidelines-vX.Y.Z-offline-tools.tar.gz`, where `X.Y.Z`
   is the new `VERSION`:

   ```text
   node tools/ci/offline-bundle.mjs build --assets ASSET_DIR --licenses LICENSE_DIR --output BUNDLE_PATH
   ```

   The build prints the actual bundle record. Put that exact reviewed JSON in
   [the tracked bundle record](.config/release/offline-bundle.json); never
   invent its digest or reuse one after the version, complete package manifest,
   lockfile, native supply manifest, or Node major changes. Only then run the
   command that reads that record:

   ```text
   node tools/ci/offline-bundle.mjs inspect --bundle BUNDLE_PATH
   ```

   A second build may have a different archive SHA even with the same declared
   inputs. Freeze one inspected file and its actual digest for the signed commit
   and later publication on both Forges. Re-run `npm run verify`.

3. Run `ethos plan --changed --json` and follow its current verdict. Commit with
   the configured trusted SSH signer. From a fresh checkout of the committed
   source with no `node_modules/` or application tool cache, use
   `node tools/ci/offline-bundle.mjs install --bundle BUNDLE_PATH` and
   `npm run verify` without remote supply. The source and bundle must match.
   Take the actual OID from `git rev-parse HEAD`, and execute
   `ethos prove --execute --full --scope repository --expect-head OID --json`.
   Follow the native candidate and accepted-root results. A Change with remote
   delivery obligations stays active while those tasks are open; archive only
   after every declared obligation has evidence. Source-only Changes may archive
   earlier when their obligations are complete. Archive creates a new commit:
   inspect its attribution and signature, then prove its new OID. Do not
   raw-push around an ETHOS refusal.

   For release-before-tag qualification on GitLab, first accept the source on
   protected `dev` or `main`. Upload the inspected bundle through the native
   project Package Registry API as
   `offline-qualification/sha256-DIGEST/FILE_NAME`, using the actual bundle
   digest and basename. Start one native API or web pipeline at that exact
   accepted ref with `DDWG_OFFLINE_CANDIDATE=DIGEST`. It selects only the existing
   offline platform jobs. Read back the pipeline and require its `sha` to match
   the accepted OID; a branch name alone does not bind the run.
   Preserve source OID, Runner/manager identity, raw
   results, and bundle hashes; wait for every job to become terminal before
   deleting that exact temporary package. Verify its absence. This is candidate
   qualification, not a substitute for Step 6's signed-release downloads.

4. At the release cut, move the `Unreleased` items into a dated `X.Y.Z`
   Changelog section using the actual date. Add its explicit History row and
   both definitions, comparing the previous release tag with the new tag.
   Leave `Unreleased` empty and advance both of its bases to the new tag.
   Commit that exact source. A Changelog-only cut can reuse the frozen bundle
   when all declared supply inputs remain identical; a package recipe change
   requires a new build and record. After committing, inspect `BUNDLE_PATH`
   against that checkout's record before installation. Keep that exact
   inspected file and digest for
   both uploads, not an earlier checkout's qualification alone.
   Repeat the fresh-checkout offline installation, full verification, and ETHOS
   proof from Step 3, and follow the native acceptance continuation. Use
   `ethos publish --json` and its current continuation to publish the admitted
   `dev` and `main` source before creating a tag. Re-read both remote refs and
   require every declared source job to pass on each Forge at this release-cut
   commit; an earlier proposal or accepted SHA does not qualify it. If either
   matrix is missing or fails, stop and correct the source under the active
   Change. Only then sign an annotated `vX.Y.Z` tag on that same proved commit,
   run `git tag -v vX.Y.Z`, and publish the tag through ETHOS. Re-read both
   remote tags before creating either Release; GitLab's SSH remote does not
   identify the configured API scheme, host, or port. Set `GITLAB_HOST` in the
   caller's environment to the configured API host and port, not the SSH port.
   Check that `glab auth status` shows the administrator-supplied API scheme and
   port. Throughout these commands, `GITLAB_REPOSITORY_URL` means the full
   configured repository URL, including its HTTP or HTTPS scheme and API port.
   Verify `glab repo view GITLAB_REPOSITORY_URL --output json` identifies this
   project's path and project ID. For unattended calls, set
   `GH_PROMPT_DISABLED=1` or `GLAB_NO_PROMPT=1` as applicable, close stdin, and
   enforce a caller-owned deadline; stop on authentication failure.

5. Use the same reviewed release notes from the prepared Changelog section on
   both Forges. `RELEASE_NOTES_FILE` is a temporary copy of that section, not a
   new tracked history. Only after each remote tag exists at the proved commit,
   create the Release and attach the same bundle bytes:

   ```text
   gh release create vX.Y.Z BUNDLE_PATH --verify-tag --notes-file RELEASE_NOTES_FILE --repo OWNER/REPO
   glab release create vX.Y.Z BUNDLE_PATH --use-package-registry --package-name release-assets --no-update --notes-file RELEASE_NOTES_FILE --repo GITLAB_REPOSITORY_URL
   ```

   GitLab's `release-assets` generic package is what its post-publication job
   obtains. GitHub's Release starts the
   [offline workflow](.github/workflows/offline-verify.yml) on `ubuntu-latest`,
   `ubuntu-24.04-arm`, `macos-latest`, and `windows-latest`. After the
   GitLab package and Release exist, start one native pipeline and read back
   the returned pipeline ID:

   ```text
   glab ci run --branch vX.Y.Z --repo GITLAB_REPOSITORY_URL
   glab ci get --pipeline-id PIPELINE_ID --output json --repo GITLAB_REPOSITORY_URL
   ```

   `--branch` accepts a branch or reference; its name does not prove a tag run.
   Require the returned project ID to match this repository, `tag` to be
   `true`, `ref` to be `vX.Y.Z`, `sha` to be the proved commit, and `source` to
   be `api` or `web`. A mismatch is not release qualification. Require the
   `offline:verify:linux`, `offline:verify:macos`, and `offline:verify:windows`
   jobs, not only the tag-push `docs:verify:<os>` jobs. Apply the
   [Windows ARM64 supply boundary](docs/governance/ethos.md#tool-supply-and-offline-execution)
   for architecture observations and managed-asset selection evidence. Do not
   call an ARM64 host running x64 tools native x86_64 verification.

6. Download the asset from each Release into a separate empty directory and
   inspect both files against the committed record:

   ```text
   gh release download vX.Y.Z --repo OWNER/REPO --pattern BUNDLE_NAME --dir GITHUB_DIR
   glab release download vX.Y.Z --repo GITLAB_REPOSITORY_URL --asset-name BUNDLE_NAME --dir GITLAB_DIR
   node tools/ci/offline-bundle.mjs inspect --bundle GITHUB_ASSET
   node tools/ci/offline-bundle.mjs inspect --bundle GITLAB_ASSET
   ```

   From the final checkout, run `node tools/docs/cli.mjs links --online` after
   both remote tags exist and require zero broken links. This uses the pinned
   lychee and current Markdown inventory without changing the offline source
   verifier. A prepared Changelog's comparison links return 404 before its tag
   exists; do not waive those errors or count a pre-tag live check as release
   qualification. A lychee pass does not authenticate a Forge destination. Use
   each provider's native comparison API with the History row's base and head
   refs at its declared repository. Retain the response and confirm both ref
   identities; reject sign-in redirects and responses from another repository,
   as [governance](docs/governance/ethos.md#versioned-releases) requires.

   Check each Forge's exact refs, Release object, source CI, and complete
   offline runs at the selected tag. One successful host or peer proves nothing
   about another. Retire only the landed Work Lane and disposable temporary refs
   through ETHOS; preserve immutable tags, the candidate train, foreign work,
   and historical Runner bindings still serving earlier releases.

## Retire superseded downloads

Keep attached assets for the latest qualified edition and one qualified rollback
on both Forges. Keep native tool packages consumed by their source or current
CI. Signed tags, source revisions, original release notes, and historical
verification remain available; they do not require every binary to stay online
indefinitely.

1. Inventory exact package and asset IDs, names, versions, bytes, digests,
   release links, and active jobs on each Forge. Resolve source and CI
   consumers. Preserve anything current, required for rollback, or of unknown
   ownership.
2. Freeze the deletion set and preservation set. Re-read each affected Release
   and package immediately before changing it; stop if its identity or consumer
   changed. Use the Forge's native API, with closed input, no-prompt execution,
   and an owned deadline. Do not delete a signed tag or rewrite asset bytes.
3. Remove only the selected attached downloads and obsolete package entries.
   Remove their download links and append a dated withdrawal notice to each
   affected Release, preserving the original notes. Retired editions are not
   still advertised as available offline distributions.
4. Re-read both inventories and retained file digests. Check the current and
   rollback download routes, confirm exact retired resources are absent, and
   preserve the before/after evidence with the producing Change. Report storage
   reduction only after the provider's statistics confirm it.

Run this aftercare after a qualified release supersedes its predecessor, rather
than accumulating a new full bundle for every intermediate correction. The
[governance boundary](docs/governance/ethos.md#evidence-and-retirement) defines
what may retire; this procedure does not grant authority over another project.
