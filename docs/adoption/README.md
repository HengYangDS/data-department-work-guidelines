---
subject: data-department-work-guidelines:adoption-guide
role: how-to
state: active
relations:
  routes: bounded real-work trials
---

# 本地采用准备包

> **状态 Status:** active（准备真实试用；真实试用与远端发布均未在本文件中宣称完成）
>
> **目的 Purpose:** 让负责人在不新增平行流程、不复制准则的前提下启动并记录真实试用。
>
> **参见 See also:** [`guidelines.md`](../../guidelines.md)、
> [本地采用决策](../decisions/accepted/DR-0003-local-rollout-readiness.md)。

## 使用边界

- 本目录不是规则事实源；任何通用要求均以 `guidelines.md` 为准。
- 试用应嵌入正在发生的 L1/L2 工作，不另立“推广项目”或全员填表。
- 记录只服务于事实、复盘与规则演化；不得用于脱离案例的个人排名。
- 未有真实任务、证据和有权者验收前，不得将“准备完成”表述为团队已采用或质量已提高。

## 现在可做的三件事

1. 由有权负责人选择一个真实场景：分析与决策、数据采用与生产，或人智协作。
2. 从 [试用记录模板](./trial-log.template.md) 建立一份工作记录，并按场景卡进入正文。
3. 结束时只记录实际发生的阻力、证据、结果与候选改进；按净增益决定保留、修正或拒绝。

## 文件职责

| 文件                                                                           | 服务的问题                                           | 不服务的问题                 |
| ------------------------------------------------------------------------------ | ---------------------------------------------------- | ---------------------------- |
| [试用记录模板](./trial-log.template.md)                                        | 一项真实工作如何留下可复查的采用证据？               | 替代项目工单、验收或决策记录 |
| [项目接入模板](./project-adapter.template.md)                                  | 项目怎样声明本地事实、权限与验收，而不复制通用准则？ | 重新编写一套团队规则         |
| [`validate-rollout-readiness.sh`](../../scripts/validate-rollout-readiness.sh) | 阅读路径、模板边界与文档结构是否仍然可用？           | 证明真实试用已经成功         |
| [本地采用决策](../decisions/accepted/DR-0003-local-rollout-readiness.md)       | 为什么只准备器具，而不宣称已采用？                   | 代替真实试用与复审           |

## 进入与复审

- 人类入口：[三分钟定向](../../README.md#三分钟定向) → [场景导航](../../README.md#我现在要做什么)。
- Agent 入口：[最小加载](../../AGENTS.md#最小加载) → [任务路由](../../AGENTS.md#任务路由)。
- 规则演化：[复盘与规则演化卡](../../guidelines.md#复盘与规则演化卡) → [规则生命周期](../../guidelines.md#116-规则与实践的生命周期)。

当试用暴露入口失效、规则重复、Agent 越界、证据不足或维护成本超过净增益时，
按 [DR-0002 的复审触发](../decisions/accepted/
DR-0002-reader-experience.md#evidence-and-revisit) 处理。
