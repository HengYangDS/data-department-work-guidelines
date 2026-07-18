---
subject: data-department-work-guidelines:reference
role: index
state: canonical
relations:
  canonical_for: stable terminology and boundaries
---

# 参考资料

> **状态 Status:** canonical（稳定术语与边界的当前入口）
>
> **目的 Purpose:** 说明规则、入口、治理与本地证明之间稳定且可引用的边界。
>
> **参见 See also:** [文档导航](../README.md)、[ETHOS 治理](../governance/ethos.md)、
> [`guidelines.md`](../../guidelines.md)。

本目录保存稳定的术语、边界与操作引用。运行中的事实仍以当前仓库内容、受控命令输出和
已绑定的证据为准。

## 核心边界

| 概念            | 定义                                                         | 权威入口                                                                           |
| --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 工作准则        | 团队共同工作的规范性要求                                     | [`guidelines.md`](../../guidelines.md)                                             |
| 成员入口        | 面向人的最短阅读与行动路由                                   | [`README.md`](../../README.md)                                                     |
| Agent 入口      | 面向 Agent 的最小加载和修改约束                              | [`AGENTS.md`](../../AGENTS.md)                                                     |
| 仓库治理        | 变更、证据和发布边界，不复制工作准则                         | [ETHOS 治理](../governance/ethos.md)                                               |
| 本地证明        | 对当前 HEAD 执行的质量与治理检查                             | `./scripts/ethos-repo.sh prove --execute --scope docs --expect-head <HEAD> --json` |
| OpenSpec Change | 实质变更的 proposal、design、spec、tasks 与 archive 生命周期 | [`openspec/`](../../openspec/README.md)                                            |
| DR              | 已接受的持久取舍；不承载任务或原始日志                       | [决策记录](../decisions/README.md)                                                 |
| Chronicle       | 带日期的已观察事实与边界                                     | [持久证据根](../../evidence/README.md)                                             |

本地验证与安装构成不依赖远端的第一层。GitLab 是组织主发布源；GitHub 是独立完整仓库与
CI/CD 镜像平面，GitLab 不可用时可作为更新与分发替代。`work/*` 和 `candidate/dev` 永不推送，
远端只接受 `dev`、`main` 与 `submit/*`。GitHub remote 与 CI 定义的存在不证明 GitHub 已接收
引用、CI 已运行或内容已发布；任何远端、hosted CI、编辑器状态或本机缓存都不能在缺少各自新鲜
证据时推导“已发布”或“已验证”。

OpenSpec、DR、Chronicle 与 `guidelines.md` 可以互相链接，但不得互相代管：一项事实只有一个
主要载体，避免把任务清单、执行方法或一次性日志误升格为治理事实。
