---
subject: data-department-work-guidelines:DR-0002-reader-experience
role: decision
state: canonical
decision_id: DR-0002
decision_status: accepted
decision_date: 2026-07-12
relations:
  canonical_for: reader experience design
  normalized_by: adoption-lifecycle-repair-20260714
---

# DR-0002：读者体验

> **状态 Status:** canonical
>
> **目的 Purpose:** 成员与 Agent 进入唯一规则正文的最短正确路径。
>
> **决策状态 Decision status:** accepted
>
> **原决策日期 Decision date:** 2026-07-12
>
> **记录规范化 Normalized:** 2026-07-17；本次只校正记录与治理结构，**不追溯宣称原决定已走 OpenSpec lifecycle**。
>
> **参见 See also:** [`README.md`](../../../README.md)、[`AGENTS.md`](../../../AGENTS.md)、[DR-0003](DR-0003-local-rollout-readiness.md)。

## Context

`guidelines.md` 是唯一规则事实源，但不应要求首次读者从长正文自行辨认场景、底线与下一步。成员需要最短正确路径，Agent 也需要最小加载与任务路由；两者都必须回到同一规范性正文，而不是形成入口副本。

## Decision

采用“三分钟定向—场景路由—深度规则”的阅读结构：

- `README.md` 面向成员，提供四条底线和场景入口；
- `AGENTS.md` 面向 Agent，提供最小加载、任务路由与修改约束；
- `guidelines.md` 保有任务内核卡、场景行动卡、图示、深度规则、模板与验真；
- 文档质量门验证 Markdown、链接、锚点、唯一规则事实源及 Mermaid 渲染。

## Alternatives Rejected

- **要求所有读者先完整通读正文**：提高首次进入门槛，也容易漏读关键边界；
- **将规则复制进 README 或 AGENTS**：会制造多个规则版本和漂移风险；
- **只做视觉美化**：不能替代可定位的入口、行动与验真。

## Consequences and Boundary

| 维度   | 后果                                                                 |
| ------ | -------------------------------------------------------------------- |
| 增加   | 明确入口、场景行动卡、图示和可重复的文档质量检查。                   |
| 删除   | 以自行通读长正文作为首次阅读的隐含前提。                             |
| 保留   | `guidelines.md` 的权威顺序、底线、责任边界、停止条件和规则生命周期。 |
| 不推论 | 文档可读性不等于成员行为、协作质量或团队质量已经提高。               |

## Evidence and Revisit

- **依据与实现**：入口文件、场景卡、Mermaid 图及文档质量门；详细当时的执行过程保留在 Git 历史，而不作为当前决策载体；
- **不作的主张**：不以渲染、链接或结构检查替代真实任务试用；
- **复审触发**：首次路径仍找不到下一步、入口开始复制规则、图示失真或维护成本超过可观察净增益时，重新评估。
