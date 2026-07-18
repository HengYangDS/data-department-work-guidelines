# Agent Entry Point

本文件是 Agent 进入本项目时的最小入口。

## 权威顺序

发生冲突时，依次以当前任务中的明确用户指令、
[`guidelines.md`](./guidelines.md)、[`README.md`](./README.md) 为准。
这是判定权威的顺序，不要求在最小加载前完整通读后两份文件。

## 最小加载

1. 读取当前用户指令。
2. 读取 [`guidelines.md` 的“任务内核卡”](./guidelines.md#任务内核卡)。
3. 按任务类别读取一个场景行动卡及其深度规则。
4. 修改前读取[“人智协作：边界、责任与验真”](./guidelines.md#8-人智协作边界责任与验真)与[“规则与实践的生命周期”](./guidelines.md#116-规则与实践的生命周期)。

## 任务路由

| 任务                 | 必读正文                                                                                                                                                    | 必须确认                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 启动任务             | [启动任务卡](./guidelines.md#启动任务卡)；[问题定义](./guidelines.md#31-界定先形成问题定义卡)                                                               | 权威、对象、边界、完成条件       |
| 分析/方案            | [分析与决策卡](./guidelines.md#分析与决策卡)；[第 4 章](./guidelines.md#4-分析与解决问题规范)                                                               | 事实、假设、反例、行动           |
| 数据/生产            | [数据采用与生产卡](./guidelines.md#数据采用与生产卡)；[第 5 章](./guidelines.md#5-数据部门共同质量契约)                                                     | 时点、语义、质量、回滚           |
| 沟通/写作            | [沟通与写作卡](./guidelines.md#沟通与写作卡)；[6. 口头沟通规范](./guidelines.md#6-口头沟通规范)；[7. 行文表达规范](./guidelines.md#7-行文表达规范)          | 受众、结论、依据、请求           |
| 人智协作/变更/自动化 | [人智协作卡](./guidelines.md#人智协作卡)；[第 8 章](./guidelines.md#8-人智协作边界责任与验真)                                                               | 权限、并发、停止条件、验证       |
| 复盘/演化            | [复盘与规则演化卡](./guidelines.md#复盘与规则演化卡)；[评审与校准](./guidelines.md#10-评审与校准)；[规则生命周期](./guidelines.md#116-规则与实践的生命周期) | 案例、净增益、试验范围、复审条件 |

## 修改约束

- [`guidelines.md`](./guidelines.md) 是准则正文的唯一事实源；README 与本文件只提供路由。
- 只可提出或实施获授权的修改；人负责最终判断、验收与发布。
- 修订说明应记录真实问题、依据、增加与删除、预期净增益、验证方式及复审条件。

## 仓库治理（ETHOS）

本仓库采用 [ETHOS 本地治理说明](./docs/governance/ethos.md)；
[`guidelines.md`](./guidelines.md) 仍是工作准则的唯一事实源，ETHOS 只治理变更、证据和发布边界。

所有 ETHOS 命令必须经由仓库绑定适配器 [`scripts/ethos-repo.sh`](./scripts/ethos-repo.sh)
调用；**不得直接调用裸 `ethos`**。该适配器固定传入当前仓库根，拒绝调用者覆盖
`--root`，防止 ETHOS 实现仓库被误作受治理对象。

1. 读取当前任务、`AGENTS.md` 与匹配的 `.agents/skills/` 后，先执行
   `./scripts/ethos-repo.sh orient --json`、
   `./scripts/ethos-repo.sh status --json` 与
   `./scripts/ethos-repo.sh plan --changed --json`。
2. 只在已租约的 `work/*` Work Lane 修改受跟踪文件；开始写入前，令
   `ETHOS_ACTOR` 与租约一致，再运行
   `./scripts/ethos-repo.sh lane prewrite <paths>`，并显式提供当前仓库根作为
   `--editor-root`，同时使用 `--require-editor-root --json`。
3. 不得绕过 `dev → candidate/dev → dev` 的本地闭环；完成主张必须绑定当前 HEAD，并执行：

   ```bash
   ./scripts/ethos-repo.sh prove --execute --scope docs \
     --expect-head "$(git rev-parse HEAD)" --json
   ```

4. 本地验证与安装不依赖远端；GitLab 是组织主发布源，GitHub 是独立完整仓库与 CI/CD 镜像平面。
   `work/*` 与 `candidate/dev` 永不推送，远端只接受 `dev`、`main` 与 `submit/*`。任一远端
   未配置、不可达或未取得新鲜 ref/CI 证据时，都不得声称该远端已发布或已验证。
