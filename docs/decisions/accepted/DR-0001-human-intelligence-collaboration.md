---
subject: data-department-work-guidelines:DR-0001-human-intelligence-collaboration
role: decision
state: canonical
decision_id: DR-0001
decision_status: accepted
decision_date: 2026-07-12
relations:
  canonical_for: human-intelligence collaboration terminology
  normalized_by: adoption-lifecycle-repair-20260714
---

# DR-0001：人智协作

> **状态 Status:** canonical
>
> **目的 Purpose:** 人智协作的术语、责任边界与验真关系。
>
> **决策状态 Decision status:** accepted
>
> **原决策日期 Decision date:** 2026-07-12
>
> **记录规范化 Normalized:** 2026-07-17；本次只校正记录与治理结构，**不追溯宣称原决定已走 OpenSpec lifecycle**。
>
> **参见 See also:** [`guidelines.md` 第 8 章](../../../guidelines.md#8-人智协作边界责任与验真)、[决策索引](../decision-index.md)。

## Context

“人—Agent 协作”中英混杂，容易把具体技术实体误作总体关系；“人机协作”又容易把可调用的智能能力缩减为机械对象。两者都不足以清楚区分：人持有意向、判断、授权与后果；Agent、模型、工具与自动化承载的是可调用但受限的智能能力。

## Decision

总体关系名称采用 **人智协作**，章节名采用“人智协作：边界、责任与验真”。

定义为：**人定其向，智扩其能；协作于事，归责于人。**

- 人是承担意向、判断、授权与后果的责任主体；
- 智是由 Agent、模型、工具和自动化承载的可调用智能能力；
- 技术语境仍使用 Agent（智能体）指具体实体；
- 工作法为：**借智成事，依实定论，归责于人。**

## Alternatives Rejected

- **人—Agent 协作**：保留中英混杂，并把一个技术实体抬升为总体关系名称；
- **人机协作**：把“智”误收缩为机械对象，难以表达责任与能力的边界；
- **以新流程解决命名问题**：名称澄清不需要另造平行事实源或管理程序。

## Consequences and Boundary

| 维度   | 后果                                             |
| ------ | ------------------------------------------------ |
| 增加   | 人与智能能力的责任边界、术语一致性和验真语境。   |
| 删除   | 以“人—Agent 协作”或“人—Agent 治理”作为总体名称。 |
| 保留   | Agent 的技术名称、权限限制、验证与人工验收要求。 |
| 不推论 | 名称本身不证明成员已经正确委托、验收或承担结果。 |

本记录不改写 `guidelines.md` 的规范性正文；该正文仍是唯一工作规则事实源。

## Evidence and Revisit

- **依据与实现**：`guidelines.md` 第 8 章及仓库术语一致性检查；
- **不作的主张**：不以命名替代真实试用、责任承担或质量提升证据；
- **复审触发**：若“人智”被误解为人类智能、被用于稀释责任，或无法被项目局部规则准确引用，则重新评估名称与定义。
