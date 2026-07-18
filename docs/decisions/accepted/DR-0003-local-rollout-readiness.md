---
subject: data-department-work-guidelines:DR-0003-local-rollout-readiness
role: decision
state: canonical
decision_id: DR-0003
decision_status: accepted
decision_date: 2026-07-12
relations:
  canonical_for: local rollout readiness
  normalized_by: adoption-lifecycle-repair-20260714
---

# DR-0003：本地采用准备

> **状态 Status:** canonical
>
> **目的 Purpose:** 真实试用前的本地准备边界，不将准备写成采用结果。
>
> **决策状态 Decision status:** accepted
>
> **原决策日期 Decision date:** 2026-07-12
>
> **记录规范化 Normalized:** 2026-07-17；本次只校正记录与治理结构，**不追溯宣称原决定已走 OpenSpec lifecycle**。
>
> **参见 See also:** [本地采用准备包](../../adoption/README.md)、[DR-0002](DR-0002-reader-experience.md)。

## Context

入口、锚点、图示与模板可以准备真实试用，但它们不是采用结果。若直接要求成员“按准则执行”，容易把准则再次变成抽象口号；若另造推广表单或复制规则，又会增加平行流程与事实源。

## Decision

增加一个非规范性的本地采用准备包：

- 试用记录模板收集一项真实工作的事实、阻力、证据、限制与候选改进；
- 项目接入模板声明项目本地的事实源、权限、验收与恢复入口；
- 就绪校验脚本检查入口、模板边界与文档结构；
- 通用规则仍只由 `guidelines.md` 规定。

本地已就绪；真实试用与远端发布待执行。

## Alternatives Rejected

- **口头宣导后直接宣称采用**：没有任务、证据与责任人，不能构成采用结论；
- **另设推广项目或独立评分表**：增加仪式与重复记录，未必产生净增益；
- **在项目内复制准则**：局部事实会与通用规则一起漂移。

## Consequences and Boundary

| 维度   | 后果                                                          |
| ------ | ------------------------------------------------------------- |
| 增加   | 可复查的试用记录、项目接入信息与就绪检查。                    |
| 删除   | 用口头宣导、无证据反馈或规则副本推进试用的做法。              |
| 保留   | 真实任务、责任人、局部权限与人工验收仍不可省略。              |
| 不推论 | 准备就绪不等于团队已采用、成员能力已提高或 Agent 已合规运行。 |

## Evidence and Revisit

- **依据与实现**：本地采用准备包、就绪校验与真实任务试用记录；
- **不作的主张**：不以本地准备替代远端发布、团队采用或质量改善的证据；
- **复审触发**：至少完成分析与决策、数据采用与生产、人智协作三类真实样本之一后，复核路径、模板、局部接入与实际净增益。
