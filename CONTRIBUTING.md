# Contributing

This guide is for maintainers who change, check, or publish the repository.
Reading or applying the guidelines requires no software installation.

Find the rule's owner through the [task map](docs/README.md). Before editing,
read [repository governance](docs/governance/README.md), run the installed
`ethos status --json` in the intended Work Lane, and obtain passing
`ethos lane prewrite` admission for the exact paths. Keep progress in the selected
official Change's `tasks.md`. The installed Git-common hooks enforce commit and
push admission; a method-pack plan or decision record grants neither.

| Your task                  | Read next                                                   |
| -------------------------- | ----------------------------------------------------------- |
| Edit a documentation page  | [Document editing](#edit-a-documentation-page)              |
| Check a working change     | [Verify the source](#verify-the-source)                     |
| Prepare the checks         | [Make ETHOS available](#make-ethos-available)               |
| Configure commit identity  | [Commit and release](#commit-and-release)                   |
| Cut and publish an edition | [Publish a release](#publish-a-release)                     |
| Remove replaced downloads  | [Retire superseded downloads](#retire-superseded-downloads) |

## Edit a documentation page

For `docs/` pages, copy a current page's native YAML front matter.
Separate metadata and reader content with one blank line; use an H1 for the title.
Installed ETHOS validates metadata and document roles. Review the reading order
on the actual page. Display depends on the Markdown reader: GitHub shows this
metadata as a table above the title. Keep generated output out of Git.

Write new guidance, comments, and operational text in English with the
department's terminology. Preserve quoted originals, captured historical text,
and meaningful code or data literals. Review authored prose in context; a
character blacklist cannot establish language or translation quality.

## Verify the source

The checks need only [installed ETHOS](#make-ethos-available). The repository
has no package, test, or check command of its own.

### Run the full source check

```text
ethos prove --host --execute --full --json
```

The command executes the installed ETHOS full host graph. ETHOS selects the
shared checks that apply to the authored Markdown, configuration, and OpenSpec
artifacts, including official OpenSpec validation, formatting, Markdown lint,
prose, local links, and the document registry. The profile declares no gate of
its own. Host verification needs a coherent committed source and does not mint
repository proof or source acceptance.

`ethos status --json` reports the repository paradigm, including Changelog
structure: `Unreleased` first, standard categories, strict SemVer headings, real
dates, and newest-first versions. History links are reader navigation; no check
verifies their targets.

For an uncommitted edit, run `mise run check`,
`ethos prove --host --execute --gate markdown-lint --json`, and
`ethos prove --host --execute --gate prose --json`. The shared lint gate checks
Git-selected working Markdown without writing, including non-ignored candidate
files. `mise run check` also refuses drift between the generated CI files and
their installed model. Installed ETHOS checks authored-source bytes, the
repository license grant, and effective Git text and line-ending attributes
through its repository paradigm; DDWG keeps no second implementation.

The installed prose gate runs the shared provider: Codespell, shipped
Vale rules, and a temporary repository spelling increment. The increment
remains until shared spelling qualifies the same corpus and vocabulary. Native
Vale severity controls blocking; advisory findings remain in the report without
becoming errors. Prose tools support the English editorial review; they do not
replace it.

For official OpenSpec artifacts, run
`ethos prove --host --execute --gate openspec --json`. ETHOS invokes its locked
official tool and retains the complete result; DDWG has no second report parser.
Use this scoped command while editing OpenSpec, without rerunning the full check.
These checks download nothing.

For configuration changes, run
`ethos prove --host --execute --gate config-quality --json`.
Installed ETHOS owns native syntax, formatting, and authored-source byte
integrity. These checks do not establish language or translation quality.

For local links and fragments, commit the reviewed source and run
`ethos prove --host --execute --gate markdown-links --json`. The installed
provider checks the committed delivery, refusing changed bytes, missing targets,
broken headings, and paths outside delivered source. ETHOS includes this gate in
the applicable default and full graphs, without a local descriptor or duplicate
checker. Working edits and non-ignored candidate files remain available to the
formatter and lint checks; they are not committed-link acceptance.
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

| When you need to                                  | Command                                            |
| ------------------------------------------------- | -------------------------------------------------- |
| Preview selected source formatting                | `ethos lane format --json`                         |
| Check formatting and generated CI without writing | `mise run check`                                   |
| Apply admitted formatting                         | `mise run fix --expect-head OID`                   |
| Check Changelog and repository structure          | `ethos status --json`                              |
| Check spelling, prose, and terms                  | `ethos prove --host --execute --gate prose --json` |

`check` and `fix` invoke the installed ETHOS formatter directly. Replace `OID`
with the current `git rev-parse HEAD` result. Preview and check leave source
unchanged; fix prepares the complete patch and requires current Work Lane
admission and unchanged source bytes before writing. Pass literal source paths to
limit either task. Original Prettier and Taplo retain their native configuration
and byte ownership; locks and official OpenSpec artifacts keep separate owners.
These maintenance tasks are not repository proof.

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

Install ETHOS through Mise from the repository's locked declaration, then check
the actual caller. The `bootstrap` task runs `mise install --locked`:

```text
mise run bootstrap
mise exec --locked -- ethos --version
mise exec --locked -- ethos status --json
```

The [project configuration](.config/mise/config.toml) carries the ETHOS
release's own Mise declaration, and its [lock](.config/mise/mise.lock) pins each
platform's archive. ETHOS is the only declared tool; it supplies its own Node,
formatters, and prose and link tools. Run this guide's commands through
`mise exec --locked --` or with Mise activated in your shell. The repository's
hooks and Git-common runtime do not install a shell command, and an existing host
installation does not prove the clean route that CI uses.

Use Mise 2026.10.14 or later, as the project configuration requires. Upgrade
through the destination's existing installation owner; the version floor rejects
unsupported Mise before a child command runs. Mise discovers the project
configuration and adjacent lock from the repository root. Leave
`MISE_CONFIG_FILE` and `MISE_OVERRIDE_CONFIG_FILENAMES` unset and keep the global
configuration unchanged: that override makes Mise treat the global
`github.credential_command` as project-local and reject it with a security
warning. If this reviewed checkout is not yet trusted, use the native Mise trust
operation for this one configuration:

```text
mise trust .config/mise/config.toml
```

Clones made before 8.0.0 may hold an untracked `node_modules/` directory from
the retired maintenance toolkit. Delete it; nothing reads it.

GitLab's Linux jobs obtain Mise from the project's package registry; its macOS
and Windows jobs use the runner's existing Mise installation. Every hosted job
then installs the same locked ETHOS release and keeps a job-local
`MISE_CONFIG_DIR`, without changing the host's global configuration. GitLab
jobs also keep `MISE_DATA_DIR` and `MISE_CACHE_DIR` under the job's
`build/runtime/tool-cache/mise`, and write Windows shims as files
(`MISE_WINDOWS_SHIM_MODE=file`).

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
uppercase placeholders below with versions and project identities from the
current checkout. They are not literal filenames or credentials. Follow the
installed ETHOS verdict at every source transition; these commands do not grant
Change authority.

Select one publication peer for each operation. GitLab's organizational role
does not make its availability a prerequisite for GitHub. During a GitLab
outage, complete GitHub's own source and release checks; leave only GitLab's
delivery open in the existing Change. Later synchronize the same commit graph,
signed tag, and notes without recreating the edition. The steps below apply to
each selected peer independently.

### 1. Prepare the edition

Prepare the version under the official Change. Review the public rule and
contributor-command diff under SemVer, then update the single value in `VERSION`.
Record upcoming changes under `Unreleased` in `CHANGELOG.md`; do not assign a
release date before the release cut. Do not tag a merely prepared edition.

### 2. Prove and accept the source

Use [Change readiness](#inspect-change-readiness) for the current source and
selected Change. Commit with the configured trusted SSH signer. Take the actual
OID from `git rev-parse HEAD`, and execute
`ethos prove --execute --full --change CHANGE_ID --expect-head OID --json`.

Follow the native candidate and accepted-root results. A Change with remote
delivery obligations stays active while those tasks are open; archive only
after every declared obligation has evidence. Source-only Changes may archive
earlier when their obligations are complete. Archive creates a new commit:
inspect its attribution and signature, then prove its new OID. Do not
raw-push around an ETHOS refusal.

### 3. Cut and tag the release

At the release cut, move the `Unreleased` items into a dated `X.Y.Z`
Changelog section using the actual date. Add its History row and both
definitions, comparing the previous release tag with the new tag. Leave
`Unreleased` empty and advance both of its bases to the new tag. Commit that
exact source, repeat the proof from Step 2, and follow the native acceptance
continuation. Run the publication preview for the selected peer, then follow its
exact receipt continuation. For example, for GitHub:

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

Installed ETHOS admits the tag only when its name matches committed `VERSION`
and the Changelog has that version's entry. Follow the current receipt
continuation and re-read that peer's exact tag object and peeled commit before
creating its Release. For later GitLab synchronization, repeat the source checks
with `--peer gitlab` and publish the existing tag only after its own source
matrix passes. Never recreate the tag.

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

### 4. Publish on the selected Forge

Use the same reviewed release notes from the prepared Changelog section on
both Forges. `RELEASE_NOTES_FILE` is a temporary copy of that section, not a
new tracked history. After the selected remote tag exists at the proved commit,
run only that provider's command to create its Release:

```text
gh release create vX.Y.Z --verify-tag --notes-file RELEASE_NOTES_FILE --repo OWNER/REPO
glab release create vX.Y.Z --no-update --notes-file RELEASE_NOTES_FILE --repo GITLAB_REPOSITORY_URL
```

From 8.0.0 an edition attaches no download: the signed tag and its source are
the edition.

### 5. Verify the published edition

From the final checkout, check all non-peer external links and the selected
peer's links with the native Lychee that installed ETHOS supplies, on current
Git-selected Markdown. Resolve any unselected-peer URL filter from the declared
repository identity; record its exact scope and keep those links pending. Do not
permanently exclude GitLab, report a whole-inventory pass, or exclude a
selected-peer failure. An unavailable unselected peer does not block this
release.

Run the shipped Lychee policy and repository increment separately on the same
native file-list input. Both results are required; merging the policies or
running only one changes the checks. Resolve `LYCHEE_BINARY` and
`SHIPPED_LYCHEE_POLICY` from the qualified ETHOS installation, not an ambient
tool or a copied host path:

```text
LYCHEE_BINARY --config SHIPPED_LYCHEE_POLICY --offline=false --scheme http --scheme https --cache=false --no-progress --no-ignore --hidden --exclude UNSELECTED_PEER_URL_PATTERN --files-from MARKDOWN_FILE_LIST
LYCHEE_BINARY --config .config/checks/lychee/lychee.toml --offline=false --scheme http --scheme https --cache=false --no-progress --no-ignore --hidden --exclude UNSELECTED_PEER_URL_PATTERN --files-from MARKDOWN_FILE_LIST
```

`MARKDOWN_FILE_LIST` contains the current Git-selected Markdown paths, one per
line. `UNSELECTED_PEER_URL_PATTERN` is an anchored, escaped expression for only
the unselected repository URL from `.ethos/release.toml`; it must not match the
selected peer or unrelated links. Use the same supplied binary, input list, and
URL scope for both policies. Retain each policy's identity, arguments, raw result,
and deferred URLs. Omit `--exclude` from both commands when all peers are in
scope. These checks do not grant publication authority or certify an unselected
peer.

For a whole-inventory observation after both peers' targets exist, run
`ethos prove --host --execute --gate external-links --expect-head OID --json`.
Retain its complete report even when one peer is unavailable; that result does
not invalidate independently verified delivery to the other peer. The local
installed `markdown-links` gate remains offline and guards committed
source membership and confinement; direct Lychee commands do not supply those
checks. Neither host observation issues repository proof.
A prepared Changelog's comparison links return 404 before its tag exists;
do not waive selected-peer errors or count a pre-tag check as release acceptance.

Check the selected Forge's exact refs, Release object, and source CI at the
selected tag. One successful host or peer proves nothing about another. Keep
unobserved peer delivery in the existing Change until its own checks pass.
Retire only the landed Work Lane and disposable temporary refs through ETHOS;
preserve immutable tags, the candidate train, foreign work, and historical
Runner bindings still serving earlier releases.

## Retire superseded downloads

Editions up to 7.0.12 attached an offline maintenance bundle, and GitLab's
package registry holds tool packages of the retired toolkit. Keep attached assets
for the latest edition qualified on each Forge and one qualified rollback on that
Forge. A release on GitHub does not release an older GitLab asset's consumers.
Keep native tool packages consumed by retained source or current CI, including
the Mise bootstrap package. Signed tags, source revisions, original release
notes, and historical verification remain available; they do not require every
binary to stay online indefinitely.

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
its predecessor, rather than letting superseded downloads accumulate. The
[governance boundary](docs/governance/README.md#evidence-and-retirement) defines
what may retire; this procedure does not grant authority over another project.
