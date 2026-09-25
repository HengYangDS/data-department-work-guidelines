# 贡献本仓库

先按读者任务找到[当前规则的唯一主人](docs/README.md)，再改文件。
受跟踪的措辞修订也需要有归属的 Work Lane；实质准则或治理变更还必须属于
[官方 OpenSpec Change](openspec/README.md)。方法包计划和决策报告不能代替它。

在已租约的 Work Lane 中，通过[仓库绑定适配器](docs/governance/ethos.md)
读取当前 `continuation`。每批受跟踪写入前，对精确路径请求 `lane prewrite`。
进度只记在 Change 的 `tasks.md`。本地检查、远端发布和团队采用分别验收。

用 `npm ci --ignore-scripts` 安装锁定的文档工具；`node_modules/` 只留在本机。
macOS 的 lychee 由 Homebrew 管理，当前质量合同要求 0.24.2。
两个 Linux CI 从固定上游发行包安装同一版本，并校验 SHA-256。验证当前源码：

```bash
bash scripts/format-markdown.sh --check
bash scripts/validate-docs.sh
bash scripts/validate-rollout-readiness.sh
bash scripts/validate-governance-boundary.sh
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh plan --changed --json
```

落地前提交精确变更，对该 HEAD 执行完整证明。
源码接受、两个 Forge 各自的引用与 CI、真实工作的采用结果，不能互相代替。
远端只发布 `dev`、`main`、`submit/*`；`candidate/dev` 与 `work/*` 留在本地。
