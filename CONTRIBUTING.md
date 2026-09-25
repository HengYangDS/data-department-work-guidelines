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

Install the locked Node dependencies with `npm ci --ignore-scripts`. Use lychee
0.24.2 from your platform's native installation owner or install a previously
supplied, SHA-256-pinned asset with
`node tools/ci/install-lychee.mjs --asset PATH`. Supply Chrome locally, or set
`PUPPETEER_EXECUTABLE_PATH` to the installed browser. Then run:

```text
npm run verify
ethos plan --changed --json
```

`npm run verify` checks Markdown, code, JSON, and YAML formatting, TOML syntax,
Markdown lint, metadata, every present
diagram, offline links and fragments, English text and spelling, decision and
navigation boundaries, the official OpenSpec workspace, the changelog/version
contract, CI declarations, and negative tests. `npm run prose` runs the locked
spelling check alone. Run `npm audit --audit-level=moderate` separately when
online before source acceptance; both hosted CI planes require it. The offline
repository verifier does not contact either Forge. A clean offline bootstrap
requires a prefilled npm cache and the pinned lychee asset; test that path
before claiming offline distribution. Git's native `.gitattributes` rule checks
out tracked text with LF even on Windows; do not replace it with a host-specific
Git setting.
Keep `node_modules/`, browser state, and generated output out of Git.

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

Commit the exact source and run ETHOS proof against that HEAD before landing.
Only `dev`, `main`, and `proposal/*` are publishable refs. Candidate and Work
Lane branches remain local. Verify local acceptance, each Forge ref and CI run,
each Forge Release, and actual team use separately; one never proves another.
