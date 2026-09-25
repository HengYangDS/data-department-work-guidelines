---
subject: data-department-work-guidelines:decisions
role: index
state: canonical
relations:
  canonical_for: durable decision register
---

# 决策记录

DR 只留下后人仍须理解的取舍和复审条件；当前规则在[准则](../README.md)，
变更过程在[官方 Change](../../openspec/README.md)。任务状态、命令结果和验收记录不写进 DR。
编号稳定、不复用；文件名用小写 `dr-NNNN-meaning.md`。

| 编号                                                   | 状态   | 持久取舍或历史定位                                    |
| ------------------------------------------------------ | ------ | ----------------------------------------------------- |
| [DR-0001](dr-0001-human-intelligence-collaboration.md) | 已接受 | “人智协作”及人的最终责任。                            |
| [DR-0002](dr-0002-reader-experience.md)                | 已替代 | 曾选择根单体正文；本次语义分层替代其物理方案。        |
| DR-0003                                                | 已退役 | 本地试用准备状态，不是持久决策；旧记录留在 Git 历史。 |
| [DR-0004](dr-0004-official-lifecycle.md)               | 已接受 | 实质仓库变更由官方 OpenSpec 与 ETHOS 管理。           |

每份 DR 正文**只**使用
`Context`、`Decision`、`Alternatives Rejected`、
`Consequences and Boundary`、`Evidence and Revisit`
五节；状态和编号在元数据中。证据节指向可复查的依据或结果，并说清何时重新审视，不贴命令日志，也不把历史决定追溯认证为当年走过后来的生命周期。
