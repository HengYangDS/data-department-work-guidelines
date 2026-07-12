---
subject: data-department-work-guidelines:reference
role: index
state: canonical
relations:
  canonical_for: stable terminology and boundaries
---

# 参考资料

本目录保存稳定的术语、边界与操作引用。运行中的事实仍以当前仓库内容、受控命令输出和
已绑定的证据为准。

## 核心边界

| 概念       | 定义                                 | 权威入口                                                         |
| ---------- | ------------------------------------ | ---------------------------------------------------------------- |
| 工作准则   | 团队共同工作的规范性要求             | [`guidelines.md`](../../guidelines.md)                           |
| 成员入口   | 面向人的最短阅读与行动路由           | [`README.md`](../../README.md)                                   |
| Agent 入口 | 面向 Agent 的最小加载和修改约束      | [`AGENTS.md`](../../AGENTS.md)                                   |
| 仓库治理   | 变更、证据和发布边界，不复制工作准则 | [ETHOS 治理](../governance/ethos.md)                             |
| 本地证明   | 对当前 HEAD 执行的质量与治理检查     | `ethos prove --execute --scope docs --expect-head <HEAD> --json` |

远端 GitLab、hosted CI、编辑器状态和本机缓存均属于投影或环境状态；没有相应的新鲜证据时，
不得以它们推导“已发布”或“已验证”的结论。
