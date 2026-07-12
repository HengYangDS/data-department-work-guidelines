# Contributing

Use the ETHOS command plane for local repository changes:

```bash
./scripts/ethos-repo.sh status
./scripts/ethos-repo.sh plan --changed
./scripts/ethos-repo.sh prove
./scripts/ethos-repo.sh land
./scripts/ethos-repo.sh publish
./scripts/ethos-repo.sh report
```

Mutating operations such as `./scripts/ethos-repo.sh land` and
`./scripts/ethos-repo.sh publish` require explicit authorization and expected
HEAD binding. Do not invoke bare `ethos` in this repository:
`scripts/ethos-repo.sh` owns the audit root and rejects caller overrides.
