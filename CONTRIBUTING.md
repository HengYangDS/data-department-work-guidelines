# Contributing

This guide is for maintainers who change, check, or publish the repository.
Reading or applying the guidelines requires no software installation.

Find the rule's owner through the [task map](docs/README.md). Before editing,
read [repository governance](docs/governance/README.md), run the installed
`ethos status --json` in the intended Work Lane, and obtain passing
`ethos lane prewrite` admission for the exact paths. Keep progress in the selected
official Change's `tasks.md`. The installed Git-common hooks enforce commit and
push admission; a method-pack plan or decision record grants neither.

| Your task                  | Read next                                                           |
| -------------------------- | ------------------------------------------------------------------- |
| Edit a documentation page  | [Document editing](#edit-a-documentation-page)                      |
| Check a working change     | [Verify the source](#verify-the-source)                             |
| Work without remote supply | [Offline maintenance toolkit](#use-the-offline-maintenance-toolkit) |
| Configure commit identity  | [Commit and release](#commit-and-release)                           |
| Cut and publish an edition | [Publish a release](#publish-a-release)                             |
| Remove replaced downloads  | [Retire superseded downloads](#retire-superseded-downloads)         |

## Edit a documentation page

For `docs/` pages, copy a current page's native YAML front matter.
Separate metadata and reader content with one blank line; use an H1 for the title.
Installed ETHOS validates metadata and document roles. Review the reading order
on the actual page. Display depends on the Markdown reader: GitHub shows this
metadata as a table above the title.
Keep `node_modules/` and generated output out of Git.

## Verify the source

The full check requires [installed ETHOS](#make-ethos-available), the declared
Node/npm, locked dependencies, and the [native check tools](#supply-native-checks).
If they are already available,
[run the source check](#run-the-full-source-check). Otherwise, prepare the
[declared runtime and dependencies](#prepare-the-runtime-and-dependencies),
then [supply any missing checks](#supply-native-checks). Use the
[offline toolkit](#use-the-offline-maintenance-toolkit) when remote supply
is unavailable.

### Run the full source check

```text
npm run verify
```

`npm run verify` invokes the installed ETHOS full host graph. ETHOS combines the
two temporary document roots with applicable shared checks. The full graph
includes official OpenSpec validation, formatting, and native code-quality obligations.
ETHOS selects tests from the committed Git source; there is no repository test
controller or bare Node discovery command. Host verification needs a coherent
committed source and does not mint repository proof or source acceptance.

For an uncommitted edit, run `mise run check`,
`ethos prove --host --execute --gate markdown-lint --json`, and
`node tools/docs/cli.mjs check`. The shared lint gate checks Git-selected working
Markdown without writing, including non-ignored candidate files. The repository
command checks English prose and terms, navigation, configuration, CI, and
SemVer/Changelog. For official OpenSpec artifacts, run
`ethos prove --host --execute --gate openspec --json`. ETHOS invokes its locked
official tool and retains the complete result; DDWG has no second report parser.
Use this scoped command while editing OpenSpec, without rerunning the full check.
These checks download nothing and do not require a frozen release bundle.
For configuration changes, run
`ethos prove --host --execute --gate config-quality --json`.
Installed ETHOS owns native syntax and formatting; the remaining repository
text check covers English and source-byte integrity, not a second layout policy.
Inspect a supplied bundle separately before installation or release. Before online publication,
also run
`node tools/docs/cli.mjs audit` and retain its complete result under the
[supply boundary](docs/governance/README.md#tool-supply-and-offline-execution).

For local links and fragments, commit the reviewed source and run
`ethos prove --host --execute --gate markdown-links --json`. The installed
provider checks the committed delivery, refusing changed bytes, missing targets,
broken headings, and paths outside delivered source. ETHOS includes this gate in
the applicable default and full graphs, without a local descriptor or duplicate
checker. Working edits and non-ignored candidate files remain available to the
formatter, lint, and repository checks; they are not committed-link acceptance.
Working and candidate links remain required by the [current source contract](openspec/specs/quality/spec.md#requirement-local-references-resolve-to-delivered-source).
The installed link interface has not yet qualified that scope. Keep this
acceptance pending; the other working-edit checks do not cover it.

For document metadata or decision-record validation, run
`ethos prove --host --execute --gate docs-registry --json`. The installed
registry owns duplicate subjects, metadata syntax, reader-facing structure, and
non-execution decision rationale. ETHOS adds its shared `docs-registry` gate to
the applicable default and full graphs, without a local descriptor or duplicate checker.
Review the actual page: registry validation does not establish reading order
or reader understanding. This host check does not establish repository proof
or source acceptance.

| When you need to                    | Command                          |
| ----------------------------------- | -------------------------------- |
| Preview selected source formatting  | `ethos lane format --json`       |
| Check formatting without writing    | `mise run check`                 |
| Apply admitted formatting           | `mise run fix --expect-head OID` |
| Check Markdown and source integrity | `node tools/docs/cli.mjs check`  |
| Check spelling, prose, and terms    | `npm run prose`                  |

`check` and `fix` invoke the installed ETHOS formatter directly. Replace `OID`
with the current `git rev-parse HEAD` result. Preview and check leave source
unchanged; fix prepares the complete patch and requires current Work Lane
admission and unchanged source bytes before writing. Pass literal source paths to
limit either task. Original Prettier and Taplo retain their native configuration
and byte ownership; locks and official OpenSpec artifacts keep separate owners.
These maintenance tasks are not repository proof. The existing proof and fixture
consumers remain until their full shared replacement qualifies; they do not
require another formatter implementation for this new entry.

The installed `markdown-lint` gate owns non-spacing checks alongside
the native formatter. ETHOS includes it in the applicable default and full graphs
and the explicit working-edit command above; DDWG has no second lint driver.

The [configuration map](docs/governance/configuration.md) locates each native input; it does not
restate common standards. Use the installed ETHOS rules and the declared native
formatters. Review meaning at the [communication](docs/communicate.md) and
relevant task owner: a passing style check cannot establish factual accuracy,
semantic fidelity, or reader understanding.

### Inspect Change readiness

For uncommitted work, inspect the changed source:

```text
ethos plan --changed --json
```

A clean checkout may return `no_changes` with no plan nodes. To inspect the
selected official Change, use its directory name:

```text
ethos plan --change CHANGE_ID --json
```

Follow the returned verdict, gaps, next action, and continuation. Neither a
plan nor host verification proves acceptance or publication. Repository proof
must bind the selected Change and exact committed source.

### Make ETHOS available

The installed `ethos` command must be available to the shell that runs npm.
Use the ETHOS product's native installation and supplied offline distribution;
the repository's hooks and Git-common runtime do not install a shell command.
Check the actual caller before running the full source check:

```text
ethos --version
ethos status --json
```

If the command is missing, setup is incomplete. Node/npm preparation and the
DDWG toolkit below cannot supply it. Do not add a repository wrapper or expose
a private runtime path to make the check appear installed. Clean CI must
prepare the same product command explicitly; an existing host installation
does not prove that route.

### Prepare the runtime and dependencies

[`package.json`](package.json) owns the Node line through `devEngines.runtime`
and the exact npm version through `devEngines.packageManager`, both with
`onFail: error`. npm rejects a mismatch before installation, `ci`, or run
effects. The package-manager version includes native SHA-512 metadata: Mise
checks it when acquiring npm; npm's own installer accepts the metadata but
does not enforce that declared checksum. Prepare tools through the destination's
existing installation owner; do not bypass admission with `--force` or an
override. Run `mise run bootstrap` to prepare the declared Node and npm, then
install locked dependencies with `npm ci --ignore-scripts`. Bootstrap uses
native Mise and the existing lock; it does not install ETHOS, project packages,
or the native check tools. Those consumers keep their separate preparation
below until the shared supply migration qualifies.

Use Mise 2026.10.14 or later, as required by the
[project configuration](.config/mise/config.toml). Earlier versions can reject
the checksum-bearing npm lock entry or warn and run an ambient npm instead.
Upgrade through the destination's existing installation owner before preparing
tools; the version floor rejects unsupported Mise before a child command runs.

GitLab's macOS and Windows jobs use the existing Mise installation with the
[project runtime configuration](.config/mise/config.toml) and its
[native lock](.config/mise/mise.lock). Mise installs selected versions under
its native data directory and scopes their PATH to each command. The jobs do
not modify the host's npm, Runner service, or isolation. Runtime preparation
is separate from offline verification: the offline installer never supplies
missing Node or npm.

Mise discovers the project configuration and adjacent lock from the repository
root. No filename selector is needed. Leave `MISE_CONFIG_FILE` and
`MISE_OVERRIDE_CONFIG_FILENAMES` unset; keep the global configuration unchanged.
Its native package parser reads both development declarations. Safe-mode
preparation must include `package.json` as well as the config and lock, and
select `node,npm` idiomatic parsing and the package manager for the npm backend
through native Mise process settings. ETHOS owns that materialization; do not
add an executable version template, a PATH template, or weaken safe mode.
For already prepared, download-free checks, set `MISE_AUTO_INSTALL=0` for the
current process. If this reviewed checkout is not yet trusted, use the native
Mise trust operation for this one configuration before inspection or execution.

```text
mise trust .config/mise/config.toml
mise config ls --json
mise exec --locked -- node --version
mise exec --locked -- npm --version
mise exec --locked -- npm run verify
```

Do not use `MISE_CONFIG_FILE` to select this project: that override makes Mise
treat the global `github.credential_command` as project-local and reject it
with a security warning. Keep the credential command with its global owner;
do not copy it into the project or suppress warnings. Preserve the separate,
job-local CI `MISE_CONFIG_DIR` isolation rather than exposing host configuration
to jobs.

### Supply native checks

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

The installed ETHOS formatter supplies Taplo itself. Keep the repository's
[TOML configuration](.config/checks/taplo/taplo.toml); no separate Taplo binary,
selector, or download is needed.

### Acquire supplied assets

Use Node's native HTTP client for unauthenticated GitHub downloads. GitLab's
project token must not follow redirects. Bound repository, tag, filename, time,
and size; stage only in owned temporary storage. Reject linked cache/download
parents before network or staging.

Publish a fully verified candidate atomically inside its cache; concurrent
callers may reuse verified bytes but never replace or remove another attempt.
Existing invalid entries remain failures.

Preserve permissions and remove only the caller's temporary stage. Preserve original
command, streams, failure, cancellation, and cleanup diagnostics; use only a
bounded opaque hash in authenticated-transport errors, never secret fragments.

Official OpenSpec child-process controls disable telemetry and update requests
for offline verification without global changes.

Archives exclude host extended attributes; inspection and extraction reject
native warnings even after exit zero. Extraction keeps the destination executor's
ownership.

## Use the offline maintenance toolkit

For checks without remote supply, transfer the matching source-bound bundle to a
fresh checkout with the declared Node, npm, and Git. The optional toolkit does
not install the guidelines or include ETHOS. Supply
[the product command separately](#make-ethos-available) before verification;
the toolkit alone cannot qualify a clean or offline environment:

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
[supply contract](docs/governance/README.md#tool-supply-and-offline-execution) for
artifact risk and full platform qualification, and
[quality and local state](docs/governance/README.md#quality-and-local-state) for
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
The [release contract](docs/governance/README.md#versioned-releases) defines SemVer,
Changelog structure, signed tags, and independent Forge acceptance.

## Publish a release

This route is for a new edition, not for recreating an earlier tag. Replace the
uppercase placeholders below with paths, a version, and project identities from
the current checkout. They are not literal filenames or credentials. Follow the
installed ETHOS verdict at every source transition; these commands do not grant
Change authority.

Select one publication peer for each operation. GitLab's organizational role
does not make its availability a prerequisite for GitHub. During a GitLab
outage, complete GitHub's own source, release, download, and platform checks;
leave only GitLab's delivery open in the existing Change. Later synchronize
the same commit graph, signed tag, notes, and asset bytes without recreating
the edition. The steps below apply to each selected peer independently.

### 1. Prepare the edition

Prepare the version under the official Change. Review the public rule and
contributor-command diff under SemVer, then align `VERSION` and the charter.
Record upcoming changes under `Unreleased` in `CHANGELOG.md`; do not assign a
release date before the release cut. Run `npm ci --ignore-scripts` and
`node tools/docs/cli.mjs audit` on the intended Work Lane. The full source
check follows the new bundle record in Step 2. Do not tag a merely prepared
edition.

### 2. Build and freeze the toolkit

Supply every platform asset and upstream license notice under `tools` in
[the native supply manifest](.config/supply/native.json). Obtain their exact
bytes from the declared sources or an already qualified mirror. Use two local
directories outside Git, with `ASSET_DIR/TOOL/` and `LICENSE_DIR/TOOL/` for
every declared tool. OSV Scanner uses its official raw binary, not a repacked
archive.

The builder checks every name, SHA-256, npm package, and license
notice. It installs locked npm packages online to prime the bundle; missing
native assets and notices are never downloaded implicitly.

For npm packages, notices may be dedicated license files or an explicit readme
License section agreeing with the package's native license declaration.
Code examples and incidental mentions do not qualify.

Choose a fresh output path under
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

### 3. Prove and accept the source

Use [Change readiness](#inspect-change-readiness) for the current source and
selected Change. Commit with
the configured trusted SSH signer. From a fresh checkout of the committed
source with no `node_modules/` or application tool cache, use
`node tools/ci/offline-bundle.mjs install --bundle BUNDLE_PATH` and
`npm run verify` without remote supply, with ETHOS separately installed from
the accepted product supply. The source and bundle must match.
Take the actual OID from `git rev-parse HEAD`, and execute
`ethos prove --execute --full --change CHANGE_ID --expect-head OID --json`.

Follow the native candidate and accepted-root results. A Change with remote
delivery obligations stays active while those tasks are open; archive only
after every declared obligation has evidence. Source-only Changes may archive
earlier when their obligations are complete. Archive creates a new commit:
inspect its attribution and signature, then prove its new OID. Do not
raw-push around an ETHOS refusal.

When GitLab is selected, first accept the source on
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

### 4. Cut and tag the release

At the release cut, move the `Unreleased` items into a dated `X.Y.Z`
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
proof from Step 3, and follow the native acceptance continuation. Run
the publication preview for the selected peer, then follow its exact
receipt continuation. For example, for GitHub:

```text
ethos publish --peer github --ref refs/heads/dev --ref refs/heads/main --probe-remote --expect-head OID --json
```

Re-read that peer's protected `dev` and `main` refs and require every declared
source job to pass at this release-cut commit. An earlier proposal or accepted
SHA does not qualify it. A missing or failed selected-peer matrix stops that
peer's release; an unavailable unselected peer does not.

Only then sign an annotated `vX.Y.Z` tag on that same proved commit,
run `git tag -v vX.Y.Z`, and preview its publication through ETHOS:

```text
ethos publish --peer github --ref refs/tags/vX.Y.Z --probe-remote --expect-head OID --json
```

Follow the current receipt continuation and re-read that peer's exact tag
object and peeled commit before creating its Release. For later GitLab
synchronization, repeat the source checks with `--peer gitlab` and publish the
existing tag only after its own source matrix passes. Never recreate the tag.

When GitLab is selected, its SSH remote does not identify the configured API
scheme, host, or port. Set `GITLAB_HOST` in the
caller's environment to the configured API host and port, not the SSH port.

Check that `glab auth status` shows the administrator-supplied API scheme and
port. Throughout these commands, `GITLAB_REPOSITORY_URL` means the full
configured repository URL, including its HTTP or HTTPS scheme and API port.
Verify `glab repo view GITLAB_REPOSITORY_URL --output json` identifies this
project's path and project ID. For unattended calls, set
`GH_PROMPT_DISABLED=1` or `GLAB_NO_PROMPT=1` as applicable, close stdin, and
enforce a caller-owned deadline; stop on authentication failure.

### 5. Publish on the selected Forge

Use the same reviewed release notes from the prepared Changelog section on
both Forges. `RELEASE_NOTES_FILE` is a temporary copy of that section, not a
new tracked history. After the selected remote tag exists at the proved commit,
run only that provider's command to create its Release and attach the same bundle bytes:

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
[Windows ARM64 supply boundary](docs/governance/README.md#tool-supply-and-offline-execution)
for architecture observations and managed-asset selection evidence. Do not
call an ARM64 host running x64 tools native x86_64 verification.

### 6. Verify independent downloads

Download the asset from the selected Release into an empty directory and
inspect it against the committed record. Run only the selected provider's
download command and the matching inspection:

```text
gh release download vX.Y.Z --repo OWNER/REPO --pattern BUNDLE_NAME --dir GITHUB_DIR
glab release download vX.Y.Z --repo GITLAB_REPOSITORY_URL --asset-name BUNDLE_NAME --dir GITLAB_DIR
node tools/ci/offline-bundle.mjs inspect --bundle GITHUB_ASSET
node tools/ci/offline-bundle.mjs inspect --bundle GITLAB_ASSET
```

From the final checkout, check all non-peer external links and the selected
peer's links with the supplied native Lychee on current Git-selected Markdown.
Resolve any unselected-peer URL filter from the declared repository identity;
record its exact scope and keep those links pending. Do not permanently exclude
GitLab, report a whole-inventory pass, or exclude a selected-peer failure.
An unavailable unselected peer does not block this release.

Use Lychee's native file-list input, not a second link controller:

```text
lychee --config .config/checks/lychee/lychee.toml --offline=false --scheme http --scheme https --cache=false --exclude UNSELECTED_PEER_URL_PATTERN --files-from MARKDOWN_FILE_LIST
```

`MARKDOWN_FILE_LIST` contains the current Git-selected Markdown paths, one per
line. `UNSELECTED_PEER_URL_PATTERN` is an anchored, escaped expression for only
the unselected repository URL from `.ethos/release.toml`; it must not match the
selected peer or unrelated links. Use the exact supplied Lychee binary and
record its source binding, arguments, raw result, and deferred URL scope. Omit
`--exclude` when all peers are in scope. This check does not grant publication
authority or certify an unselected peer.

For a whole-inventory observation after both peers' targets exist, run
`ethos prove --host --execute --gate external-links --expect-head OID --json`.
Retain its complete report even when one peer is unavailable; that result does
not invalidate independently verified delivery to the other peer. The local
DDWG link check remains offline and guards delivered-source membership and
confinement. Neither host observation issues repository proof.
A prepared Changelog's comparison links return 404 before its tag exists;
do not waive selected-peer errors or count a pre-tag check as release acceptance.
A Lychee pass does not authenticate a Forge destination. Use the selected
provider's native comparison API with the History row's base and head refs at
its declared repository. Retain the response and confirm both ref
identities; reject sign-in redirects and responses from another repository,
as [governance](docs/governance/README.md#versioned-releases) requires.

Check the selected Forge's exact refs, Release object, source CI, and complete
offline runs at the selected tag. One successful host or peer proves nothing
about another. Keep unobserved peer delivery in the existing Change until its
own checks pass. Retire only the landed Work Lane and disposable temporary refs
through ETHOS; preserve immutable tags, the candidate train, foreign work,
and historical Runner bindings still serving earlier releases.

## Retire superseded downloads

Keep attached assets for the latest edition qualified on each Forge and one
qualified rollback on that Forge. A release on GitHub does not release an
older GitLab asset's consumers. Keep native tool packages consumed by source or current
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
4. Re-read each affected inventory and retained file digests. Check the current and
   rollback download routes, confirm exact retired resources are absent, and
   preserve the before/after evidence with the producing Change. Report storage
   reduction only after the provider's statistics confirm it.

Run this aftercare when a release qualifies on the affected Forge and supersedes
its predecessor, rather than accumulating a new full bundle for every intermediate
correction. The
[governance boundary](docs/governance/README.md#evidence-and-retirement) defines
what may retire; this procedure does not grant authority over another project.
