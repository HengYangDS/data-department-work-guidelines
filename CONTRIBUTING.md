# Contributing

Start with the [task map](docs/README.md), then edit the single current owner of
the rule. [Repository governance](docs/governance/ethos.md) explains the Change,
Work Lane, proof, version, and publication boundaries. Even editorial tracked
edits need an owned Work Lane. A method-pack plan or decision record is not a
Change.

From the intended worktree, run `ethos status --json` and follow its current
result. Request `ethos lane prewrite` for the exact paths before writing. Keep
progress in the official Change's `tasks.md`, not in another repository ledger.
The installed Git-common ETHOS hooks enforce commit and push admission; this
repository does not maintain a competing hook implementation.

## Verify the source

Use Node 26 and the npm version declared by `devEngines.packageManager` in
[`package.json`](package.json). Install npm through the destination's existing
Node installation owner before running repository commands. npm checks its
native declaration before `install`, `ci`, and `run`; do not disable it with
`--force` or a policy override. Version matching is a prerequisite, not proof of
correct source. Install the locked dependencies with `npm ci --ignore-scripts`.
Use the Vale, lychee, and OSV Scanner versions pinned in the
[native supply manifest](.config/supply/native.json), through your platform's
existing installation owner or the repository-local installer. To install
previously supplied assets, run each tool through the same entry:

```text
node tools/ci/install-native.mjs vale --asset VALE_ARCHIVE
node tools/ci/install-native.mjs lychee --asset LYCHEE_ARCHIVE
node tools/ci/install-native.mjs osv-scanner --asset OSV_BINARY
```

Then run:

```text
npm run verify
ethos plan --changed --json
```

`npm run verify` checks Markdown, code, JSON, YAML, and native TOML formatting,
Markdown lint, metadata, offline links and fragments, English text, spelling,
native prose and terminology, decision and navigation boundaries, the official
OpenSpec workspace, the changelog/version contract, CI declarations, and
negative tests. `npm run prose` runs the same locked spelling, prose, and
terminology checks without the rest of the verification graph. Run
`node tools/docs/cli.mjs audit` separately when online before source acceptance;
both hosted CI planes require it and retain its evidence even on failure.
The audit runs once with an explicit
[native policy](.config/checks/dependencies/policy.toml) that ignores no findings.
Advisories are non-blocking delivery evidence; retain them for maintenance under
the [supply contract](docs/governance/ethos.md#tool-supply-and-offline-execution).
Failed scans, malformed reports, and mismatched input remain failures, not clean
audit results. The audit covers locked repository packages, not components
bundled with Node or npm. Offline verification contacts neither Forge and has
no advisory-based expiry gate.

Vale checks spelling, repeated words, selected technical terms, and diagnosed
wordy phrases using [native configuration](.config/checks/prose/vale.ini),
[concise-expression rules](.config/checks/prose/styles/Plain/Concise.yml), and
[reviewed vocabulary](.config/checks/prose/styles/config/vocabularies/Department/accept.txt).
The selected substitutions target demonstrated needless phrases; this edition
does not inherit the old broad stop-word blacklist. In particular, authority,
feasibility, uncertainty, and meaningful passive constructions retain their
meaning. A technical vocabulary entry must name a real term, not suppress a
finding wholesale.

The two native style rules carry their own test cases. The existing test suite
runs Vale's official rule-test coverage as well as real-document checks; loading
a rule without exercising a defect is insufficient. Keep the cases beside the
rule rather than introducing another prose-test pipeline.

The [configuration map](.config/README.md) identifies the single policy owner
for each check. Prettier and lychee read native TOML directly; Markdownlint
and dprint receive parsed concern-local values through their public
configuration interfaces. Vale uses its required native INI, YAML, and
vocabulary files. Repository commands select those owners explicitly, without
ambient editor configuration, format conversion, or duplicated package policy.

Paragraphs, headings, lists, quotes, link labels, and table cells are reader
text. Code spans, fenced commands, and URL destinations retain their syntax. The
checker never rewrites a file. Repository configuration controls the rules;
actual Vale or Prettier control comments fail native Markdown lint, including
controls in nested content. Literal code, escaped examples, and ordinary
comments remain valid. A passing style check does not prove factual accuracy,
semantic fidelity, or reader understanding. Review those at the
[communication](docs/communicate.md) and task owners.

Blank lines separate meaning; they are not visual padding.

| Source structure                                                         | Spacing                                                      | Enforced by                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Headings, paragraphs, complete lists, tables, quotes, or fenced examples | One blank line between blocks; never repeated empty lines.   | Prettier and Markdownlint.                                          |
| Single-paragraph list items, including wrapped text and task checkboxes  | No blank line between peer items.                            | Official `remark-lint-list-item-spacing` with `checkBlanks = true`. |
| A list with internally separated paragraphs or blocks                    | One blank line between peer items consistently.              | The same native list rule.                                          |
| Nested lists without internal paragraph separation                       | Keep the list tight.                                         | The same native list rule.                                          |
| Quoted paragraphs                                                        | One empty `>` line; nested quotes follow the same structure. | Prettier.                                                           |
| Code and data literals                                                   | Preserve meaningful blank lines inside the literal.          | The format's native owner.                                          |

Run both `npm run format -- --check` and `node tools/docs/cli.mjs lint`, or the
full `npm run verify`. Neither check replaces the other: Prettier handles quote
structure but preserves a simple list's unnecessary gaps; the official list
rule rejects those gaps. Tests cover that distinction and literal preservation.
Source wrapping does not make a paragraph a multi-block list item.

Prettier owns supported code, JSON, and YAML; dprint owns TOML through its public
Wasm API and concern-local policy. Neither applies a raw blank-line scan to
literal strings. TOML formatting must retain parsed data, key and array order,
comments, and multiline-string bytes. Plain text without a structural owner
keeps the single-blank-line ceiling. Unsupported code formats fail explicitly.

For `docs/` pages, keep ETHOS metadata in the leading HTML comment and put the
H1 after one blank line as the first visible block. Copy a current page's
carrier rather than inventing a sidecar. The repository check guards this
reading order; the installed ETHOS registry owns metadata meaning.

For a release with the matching source-pinned bundle already on the machine,
start from a fresh checkout with Node 26, the declared npm, and Git. The offline
installer never downloads or upgrades a package manager:

```text
node tools/ci/offline-bundle.mjs inspect --bundle PATH
node tools/ci/offline-bundle.mjs install --bundle PATH
npm run verify
```

The installer verifies the bundle before extraction, uses `npm ci --offline` and
the same pinned native asset paths, and never downloads a missing tool.
Archive extraction keeps the current executor's ownership; the packaging
machine's account identity grants no permission on the destination.
Obtain the bundle from either Forge while online or transfer it separately;
acquisition and offline execution are different claims. ETHOS is a separate
installed product prerequisite for Change admission and proof. The bundle's
third-party packages retain their own license notices; the repository MIT grant
covers repository source and documentation, not those packages. Do not claim
portable offline distribution before the exact asset and full host matrix have
been observed. Advisory findings remain visible without blocking installation
or delivery. Git's native `.gitattributes` rule checks out tracked text with
LF even on Windows; do not replace it with a host-specific Git setting. Keep
`node_modules/` and generated output out of Git.

For source selection and exemptions, follow
[Quality and local state](docs/governance/ethos.md#quality-and-local-state).
For review/protected runner separation, platform admission, credential transport,
and source versus offline jobs, follow
[Runner and transport boundaries](docs/governance/ethos.md#runner-and-transport-boundaries).
The release steps below select each Forge's source and offline checks.

## Commit and release

New commits, including official archive commits, require a trusted SSH
signature. Configure your clone's local author, committer, public signing-key
path, and protected external trust anchor using your own identity. Do not copy
another host's path or store credentials here. Inspect the exact commit's
signature and attribution before acceptance.

Use a scoped
[Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) subject
such as `docs(guidance): clarify data-use boundaries`. A breaking change still
needs explicit compatibility review in the official Change. A well-formed
subject cannot prove the content is correct.

Follow the [release contract](docs/governance/ethos.md#versioned-releases) for
version identity, release states, and unchanged historical editions.

For SemVer, the public surface includes normative duties, stable member and
Agent routes, and documented contributor commands, as defined by the
[repository-governance specification](openspec/specs/repository-governance/spec.md#requirement-version-identity-follows-semver-compatibility).
An incompatible change increments major; a compatible addition or deprecation
increments minor; a compatible fix increments patch. Judge the actual interface
change, not the commit label or the reason a new command was needed.

The changelog check accepts the official `[YANKED]` heading marker and the six
standard categories in any order, without duplicates. The oldest tagged release
may link directly to its exact tag; later releases use comparisons. Keep version
headings neutral and include one `History: GitLab · GitHub` row per section,
with each platform name linked through a version-and-provider reference.
Both links must identify the same refs at the corresponding `forge_repository`
in [the official release declaration](.ethos/release.toml). Use GitLab's
`/-/compare/` or `/-/tags/` route and GitHub's `/compare/` or `/releases/tag/`
route. Do not infer a web URL from an SSH remote or rewrite the Changelog for
one Forge. These checks establish structure and local identity, not whether
the prose is useful to readers.

Commit the exact source and run ETHOS proof against that HEAD before landing.
Use only [admitted publication refs](docs/governance/ethos.md#source-two-forges-and-actual-use).
Verify local acceptance, each Forge ref and CI run, and each Forge Release
separately; one never proves another.

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
   offline platform jobs. Preserve source OID, Runner/manager identity, raw
   results, and bundle hashes; wait for every job to become terminal before
   deleting that exact temporary package. Verify its absence. This is candidate
   qualification, not a substitute for Step 6's signed-release downloads.

4. At the release cut, move the `Unreleased` items into a dated `X.Y.Z`
   Changelog section using the actual date, leave `Unreleased` empty, and update
   both comparison links. Commit that exact source, repeat the required local
   checks and ETHOS proof, and follow the native acceptance continuation. Use
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
   port, then verify `glab repo view GROUP/PROJECT`. For unattended calls, set
   `GH_PROMPT_DISABLED=1` or `GLAB_NO_PROMPT=1` as applicable, close stdin, and
   enforce a caller-owned deadline; stop on authentication failure.

5. Use the same reviewed release notes from the prepared Changelog section on
   both Forges. `RELEASE_NOTES_FILE` is a temporary copy of that section, not a
   new tracked history. Only after each remote tag exists at the proved commit,
   create the Release and attach the same bundle bytes:

   ```text
   gh release create vX.Y.Z BUNDLE_PATH --verify-tag --notes-file RELEASE_NOTES_FILE --repo OWNER/REPO
   glab release create vX.Y.Z BUNDLE_PATH --use-package-registry --package-name release-assets --no-update --notes-file RELEASE_NOTES_FILE --repo GROUP/PROJECT
   ```

   `glab` must target this project's configured API host and port; use the full
   configured repository URL when a short repository name loses that endpoint.
   Its `release-assets` generic package is what GitLab's post-publication job
   obtains. GitHub's Release starts the
   [offline workflow](.github/workflows/offline-verify.yml) on `ubuntu-latest`,
   `ubuntu-24.04-arm`, `macos-latest`, and `windows-latest`. After the
   GitLab package and Release exist, start a tag pipeline with
   `glab ci run --branch vX.Y.Z --repo GROUP/PROJECT` and require the
   `offline:verify:linux`, `offline:verify:macos`, and `offline:verify:windows`
   jobs, not only the tag-push `docs:verify:<os>` jobs. The Windows ARM64 runner
   uses x64 Node and the Windows x64 tool set under emulation; record host and
   process architecture separately rather than calling it native x86_64
   verification.

6. Download the asset from each Release into a separate empty directory and
   inspect both files against the committed record:

   ```text
   gh release download vX.Y.Z --repo OWNER/REPO --pattern BUNDLE_NAME --dir GITHUB_DIR
   glab release download vX.Y.Z --repo GROUP/PROJECT --asset-name BUNDLE_NAME --dir GITLAB_DIR
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
