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
`--force` or a policy override. Version matching is a prerequisite, not proof
of correct source. Install the locked dependencies with `npm ci --ignore-scripts`.
Use lychee
0.24.2 from your platform's native installation owner or install a previously
supplied, SHA-256-pinned asset with
`node tools/ci/install-lychee.mjs --asset PATH`. Then run:

```text
npm run verify
ethos plan --changed --json
```

`npm run verify` checks Markdown, code, JSON, and YAML formatting, TOML syntax,
Markdown lint, metadata, offline links and fragments, English text and spelling,
decision and navigation boundaries, the official OpenSpec workspace, the
changelog/version contract, CI declarations, and negative tests. `npm run prose`
runs the locked spelling check alone. Run `npm audit --audit-level=moderate`
separately when online before source acceptance; both hosted CI planes require
it. This audit covers the locked repository packages, not the npm executable
bundled with Node. The offline repository verifier does not contact either
Forge.

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
the existing pinned lychee asset path, and never downloads a missing tool.
Obtain the bundle from either Forge while online or transfer it separately;
acquisition and offline execution are different claims. ETHOS is a separate
installed product prerequisite for Change admission and proof. The bundle's
third-party packages retain their own license texts; the repository MIT grant
covers repository source and documentation, not those packages. Do not claim
portable offline distribution before the exact asset and full host matrix have
been observed. Git's native `.gitattributes` rule checks out tracked text with
LF even on Windows; do not replace it with a host-specific Git setting.
Keep `node_modules/` and generated output out of Git.

GitHub's published Release starts its offline host matrix. Its public bundle
download uses Node directly; it needs neither a Forge CLI nor a credential.
GitLab's Linux,
macOS, and Windows `offline:verify` jobs run in an explicitly started tag
pipeline **after** its own package and Release are available; tag-push
`docs:verify` jobs are not offline qualification. Each job obtains the same
package through the current project's CI identity, not through GitHub or an
operator's credentials. Native GitLab runners also need the manifest-pinned
lychee archive in this project's registry before their online source jobs can
run; a missing archive is not permission to add a GitHub fallback. Proposal and
merge-request jobs must use project-locked review runners, while protected
branches and release jobs use separate trusted runners and workspaces.
For credential transport admission, follow
[repository governance](docs/governance/ethos.md#quality-and-local-state),
not a Runner tag or a registration-only tunnel.

## Commit and release

New commits, including official archive commits, require a trusted SSH
signature. Configure your clone's local author, committer, public signing-key
path, and protected external trust anchor using your own identity. Do not copy
another host's path or store credentials here. Inspect the exact commit's
signature and attribution before acceptance.

Use a scoped [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)
subject such as `docs(guidance): clarify data-use boundaries`. A breaking
change still needs explicit compatibility review in the official Change. A
well-formed subject cannot prove the content is correct.

[`VERSION`](VERSION) names the next guideline release;
[`CHANGELOG.md`](CHANGELOG.md) follows Keep a Changelog and SemVer. The private
npm manifest carries no duplicate version. A changelog heading is not a release:
only an admitted, signed annotated tag and observed Forge release objects can
establish versioned publication. Previous untagged branch editions are not
retroactively presented as tagged releases.

For SemVer, the public surface includes normative duties, stable member and
Agent routes, and documented contributor commands, as defined by the
[repository-governance specification](openspec/specs/repository-governance/spec.md#requirement-version-identity-follows-semver-compatibility).
An incompatible change increments major; a compatible addition or deprecation
increments minor; a compatible fix increments patch. Judge the actual interface
change, not the commit label or the reason a new command was needed.

The changelog check accepts the official `[YANKED]` heading marker and the six
standard categories in any order, without duplicates. The oldest tagged
release may link directly to its exact tag; later releases use comparisons.
These checks establish structure and local identity, not whether the prose is
useful to readers.

Commit the exact source and run ETHOS proof against that HEAD before landing.
Only `dev`, `main`, and `proposal/*` are publishable refs. Candidate and Work
Lane branches remain local. Verify local acceptance, each Forge ref and CI run,
each Forge Release, and actual team use separately; one never proves another.

## Reproduce a release

This route is for a new edition, not for recreating an earlier tag. Replace the
uppercase placeholders below with paths, a version, and project identities from
the current checkout. They are not literal filenames or credentials. Follow
the installed ETHOS verdict at every source transition; these commands do not
grant Change authority.

1. Prepare the version under the official Change. Review the public rule and
   contributor-command diff under SemVer, then align `VERSION` and the charter.
   Record upcoming changes under `Unreleased` in `CHANGELOG.md`; do not assign
   a release date before the release cut. Run `npm ci --ignore-scripts` and
   `npm audit --audit-level=moderate` on the intended Work Lane. The full
   source check follows the new bundle record in Step 2. Do not tag a merely
   prepared edition.
2. Supply the bundle builder with the five platform archives named under
   `assets` and the two license files named under `licenses` in
   [the pinned lychee manifest](.config/tools/lychee.json). Obtain their exact
   bytes from the manifest's sources or an already qualified mirror, in two
   local directories outside Git. The builder checks every name, SHA-256, npm
   package, and license; it does not silently download missing inputs. Choose a
   fresh ignored output path whose basename is
   `data-department-work-guidelines-vX.Y.Z-offline-tools.tar.gz`, where `X.Y.Z`
   is the new `VERSION`:

   ```text
   node tools/ci/offline-bundle.mjs build --assets ASSET_DIR --licenses LICENSE_DIR --output BUNDLE_PATH
   ```

   The build prints the actual bundle record. Put that exact reviewed JSON in
   [the tracked bundle record](.config/tools/offline-bundle.json); never
   invent its digest or reuse one after its version, lockfile, lychee manifest,
   or Node major changes. Only then run the command that reads that record:

   ```text
   node tools/ci/offline-bundle.mjs inspect --bundle BUNDLE_PATH
   ```

   A second build may have a different archive SHA even with the same declared
   inputs. Freeze one inspected file and its actual digest for the signed
   commit and later publication on both Forges. Re-run `npm run verify`.

3. Run `ethos plan --changed --json` and follow its current verdict. Commit
   with the configured trusted SSH signer. From a fresh checkout of the
   committed source with no `node_modules/` or application tool cache, use
   `node tools/ci/offline-bundle.mjs install --bundle BUNDLE_PATH` and
   `npm run verify` without remote supply. The source and bundle must match.
   Take the actual OID from `git rev-parse HEAD`, and execute
   `ethos prove --execute --full --scope repository --expect-head OID --json`.
   Follow the native candidate and accepted-root results. A Change with remote
   delivery obligations stays active while those tasks are open; archive only
   after every declared obligation has evidence. Source-only Changes may
   archive earlier when their obligations are complete. Archive creates a new
   commit: inspect its attribution and signature, then prove its new OID. Do
   not raw-push around an ETHOS refusal.
4. At the release cut, move the `Unreleased` items into a dated `[X.Y.Z]`
   Changelog section using the actual date, leave `Unreleased` empty, and
   update both comparison links. Commit that exact source, repeat the required
   local checks and ETHOS proof, and follow the native acceptance continuation.
   Use `ethos publish --json` and its current continuation to publish the
   admitted `dev` and `main` source before creating a tag. Re-read both remote
   refs and require every declared source job to pass on each Forge at this
   release-cut commit; an earlier proposal or accepted SHA does not qualify it.
   If either matrix is missing or fails, stop and correct the source under the
   active Change. Only then sign an annotated `vX.Y.Z` tag on that same proved
   commit, run `git tag -v vX.Y.Z`, and publish the tag through ETHOS. Re-read
   both remote tags before creating either Release; GitLab's SSH remote
   does not identify the configured API scheme, host, or port. Set `GITLAB_HOST`
   in the caller's environment to the configured API host and port, not the SSH
   port. Check that `glab auth status` shows the administrator-supplied API
   scheme and port, then verify `glab repo view GROUP/PROJECT`. For unattended
   calls, set `GH_PROMPT_DISABLED=1` or `GLAB_NO_PROMPT=1` as applicable, close
   stdin, and enforce a caller-owned deadline; stop on authentication failure.
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
   Its
   `release-assets` generic package is what GitLab's post-publication job
   obtains. GitHub's Release starts its four-host offline workflow. After the
   GitLab package and Release exist, start a tag pipeline with
   `glab ci run --branch vX.Y.Z --repo GROUP/PROJECT` and require the
   Linux, macOS, and Windows `offline:verify` jobs, not only the tag-push
   `docs:verify` jobs. The Windows ARM64 runner may use x64 Node and lychee
   under emulation; record host and process architecture separately rather
   than calling it native x86_64 verification.

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
   qualification.

   Check each Forge's exact refs, Release object, source CI, and complete
   offline runs at the selected tag. One successful host or peer proves nothing
   about another. Retire only the landed Work Lane and disposable temporary
   refs through ETHOS; preserve immutable tags, the candidate train, foreign
   work, and historical Runner bindings still serving earlier releases.
