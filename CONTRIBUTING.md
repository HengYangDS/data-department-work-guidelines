# Contributing

Find the [single current owner of the rule](docs/README.md) for the reader's
task before editing a file. Even wording changes to tracked files need an owned
Work Lane; material changes to guidance or governance also need an
[official OpenSpec Change](openspec/README.md). A method-pack plan or decision
report is not a substitute.

In a leased Work Lane, use the
[repository-bound adapter](docs/governance/ethos.md) to read the current
`continuation`. Request `lane prewrite` for the exact paths before each batch of
tracked edits. Keep progress only in the Change's `tasks.md`. Verify local
checks, remote publication, and team use separately.

Install the locked documentation tools with `npm ci --ignore-scripts`; keep
`node_modules/` local. On macOS, Homebrew owns lychee, and the current quality
contract requires version 0.24.2. Both Linux CI jobs install that version from a
pinned upstream release and verify its SHA-256. To validate the current source:

```bash
bash scripts/format-markdown.sh --check
bash scripts/validate-docs.sh
bash scripts/validate-rollout-readiness.sh
bash scripts/validate-governance-boundary.sh
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh plan --changed --json
```

Before landing, commit the exact change and run full proof against that HEAD.
Source acceptance, each Forge's exact ref and CI result, and adoption in real
work do not establish one another. Only `dev`, `main`, and `proposal/*` may be
published; `candidate/dev` and `work/*` remain local.
