# 官方 OpenSpec 工作区

实质仓库变更由 `openspec/changes/<change-id>/` 下的一个 active Change 承载。
它包含提案、设计、规格增量和 `tasks.md`；任务进度只记在该文件。
已接受要求由**官方归档**投影到 `openspec/specs/`，不能手改规范来模拟归档。

用 `npm ci --ignore-scripts` 安装锁定工具后验证：

```bash
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh status --json
bash scripts/ethos-repo.sh plan --changed --json
```

ETHOS 负责实质路径归属、写入准入、证明和收尾。
仓库本地边界脚本只检查 DR 与文档拓扑。
方法包计划、claim、日期报告或私有范围清单都不能代替 Change。
归档材料保存历史，不提供当前 HEAD 的证明，也不规定今天的执行顺序。
