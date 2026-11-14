## 1. Carriers

- [x] 1.1 Remove `.config/checks/prettier/prettier.toml` and `.config/checks/taplo/taplo.toml`; done
      when `ethos lane format --check --json` and the `config-quality` gate pass without them. The
      Prettier carrier equalled the shipped policy byte for byte (`sha256:a597b1fa…`) and the Taplo
      carrier lacked only the shipped `[schema]` table; without them the format check and the
      `config-quality` gate pass, and the projection check still reports both pipelines conforming.
- [x] 1.2 Point the Prettier and Taplo rows of `docs/governance/configuration.md` at installed ETHOS
      and record the removal in the Changelog; done when the `markdown-lint`, `prose` and
      `docs-registry` gates pass. Both rows name installed ETHOS and its shipped policy; the Removed
      section records the removal; the `markdown-lint`, `prose`, `openspec` and `docs-registry`
      gates pass.
