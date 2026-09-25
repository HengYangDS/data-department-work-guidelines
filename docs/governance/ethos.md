---
subject: data-department-work-guidelines:repository-governance
role: policy
state: canonical
relations:
  canonical_for: repository change and delivery boundaries
---

# 仓库变更与发布

本页只约束**这个仓库的变更**。数据部门的工作准则从[文档导航](../README.md)进入；
[决策记录](../decisions/README.md)只保留持久取舍。方法包和历史报告都不授予修改权限。

## 一个变更，一个权威载体

实质变更由一个选定的官方 OpenSpec Change 承载意图、设计、规格增量和 `tasks.md`。
ETHOS 将实质路径归属于该 active Change，并管理 Work Lane、写入准入、证明与接受。
DR 解释跨变更仍有效的取舍；五节格式不是另一份 Change 或进度账。

所有 ETHOS 调用经过仓库绑定适配器，不在不明目录裸调用：

```bash
bash scripts/ethos-repo.sh status --json
bash scripts/ethos-repo.sh lane prewrite --paths docs/decide.md \
  --editor-root "$PWD" --require-editor-root --json
bash scripts/ethos-repo.sh plan --changed --json
./node_modules/.bin/openspec validate --all --strict --json
bash scripts/ethos-repo.sh prove --execute --full --scope repository \
  --expect-head "$(git rev-parse HEAD)" --json
```

`lane prewrite` 是对当前状态和精确路径的一次性判断，不是可复用许可。
只有租约持有人能修改其 `work/*` 工作线。
[仓库边界检查](../../scripts/validate-governance-boundary.sh)拒绝错误 DR、日期型决策文件和
重新出现的 `docs/superpowers/`；它不实现官方生命周期、范围准入或归档。
默认文档证明门只有 `docs-integrity` 和 `markdown-format`；根绑定由适配器和 hooks 保证。

## 源码、发布、使用分开验收

| 层面     | 对应证据最多能证明                                 | 不能单独证明             |
| -------- | -------------------------------------------------- | ------------------------ |
| 本地源码 | Change 归属、测试、HEAD 绑定证明、候选落地与接受。 | 任一远端已接收源码。     |
| GitLab   | 组织仓库精确 OID 的引用和自身 CI 结果。            | GitHub 或团队使用。      |
| GitHub   | 独立完整仓库精确 OID 的引用和自身托管 CI 结果。    | GitLab 或团队使用。      |
| 团队实践 | 真实任务中的使用及其效果。                         | 源码和 CI 因而追溯正确。 |

本地验证和安装不依赖远端。只有 `dev`、`main`、`proposal/*` 可发布；
`candidate/dev` 与 `work/*` 不发布。
GitLab 是组织主发布源；GitHub 是独立完整仓库与 CI/CD 平面，
GitLab 不可用时可承担更新与分发。配置了 remote、本地证明通过或旧 SHA 的 CI 成功，
都不能证明新 SHA 已交付。
正式发布还须由 ETHOS 用操作者本机的可信公钥清单核验源提交签名；私钥、该清单及
本机路径都不进入仓库。原生发布拒绝时，不能用手工推送把该拒绝伪装成通过。
GitLab 文档作业选择 `ci-linux-arm64-docker`；只有匹配 runner 在该 SHA 上实际跑通，
才能声称这个托管作业通过。[发布声明](../../.ethos/release.toml)分别列出两个远端。

一个 Change 可以先随源码进入 `dev`，同时保留未完成的远端任务。
观察两个远端后完成任务，再由官方工具归档。归档会改变 HEAD；
应重新证明适用的源码事实、核对最终远端引用，不复用归档前的结果。
不要设置“任务完成必须等待其归档提交未来 CI”的循环前置；最终远端观察应单独报告。

## 本地质量与状态边界

- [ETHOS profile](../../.ethos/profile.toml)声明实质路径和两个默认文档门，
  不另造 Change scope schema。
- [仓库绑定适配器](../../scripts/ethos-repo.sh)固定审计根；Git hooks 使用同一入口。
  `bash scripts/test-ethos-repo.sh` 显式核验根绑定。
- [文档验证](../../scripts/validate-docs.sh)包含 Prettier、Markdown lint、
  lychee 离线链接、元数据、当前锚点和每一张现存 Mermaid 图。
  托管浏览器例外只由 CI verifier 选择，本地默认不继承。
- `build/`、`node_modules/`、租约和缓存不是仓库事实。
  证据跟随生产者及具体主张，不必设根目录。
- Markdown 与配置块之间一个空行；Python 顶层定义之间两个空行、方法之间一个空行。
  [空行检查](../../scripts/validate-text-layout.sh)只守机械边界，不等于语义验收。

本页不宣称当前远端状态、团队采用或 ETHOS 产品自身的 parity。
报告这些效果前，应读取当前命令和目标环境在精确版本上的新鲜观察。
