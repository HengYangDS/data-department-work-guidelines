# Agent 入口

本仓库保存数据部门工作准则。先按任务进入[文档导航](docs/README.md)，只加载相关主题。
[准则宪章](docs/charter.md)规定目的、权威与底线。
Agent 可以在委托范围内调查、起草和执行；授权、验收与后果责任仍由人承担。

修改本仓库前，阅读[仓库治理](docs/governance/ethos.md)，运行
`bash scripts/ethos-repo.sh status --json`，遵循当前 `continuation`。
实质变更由一个选定的官方 OpenSpec Change 承载，只能在有租约的 Work Lane 中进行。
写入受跟踪路径前，对精确路径运行 `lane prewrite`，并指定
`--editor-root` 与 `--require-editor-root`。
方法包、决策记录、测试日志和历史 claim 都不授予写入权限。
完成主张必须有与实际源码和环境绑定的证据。
