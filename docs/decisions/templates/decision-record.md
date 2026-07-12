---
subject: data-department-work-guidelines:decision-record-template
role: template
state: canonical
relations:
  canonical_for: decision record template
---

# DR-XXXX：标题

> **状态 Status:** canonical（可复用的决策记录模板）
>
> **目的 Purpose:** 使一项持久判断同时保留范围、依据、后果、验证和复审条件。
>
> **参见 See also:** [决策记录](../README.md)、[决策索引](../decision-index.md)。
>
> **记录字段 Record fields:** 状态 `proposed` / `accepted` / `superseded`；日期 `YYYY-MM-DD`；
> 范围 `对象、边界与不适用范围`；权威正文或事实源 `链接`。

## 问题与依据

说明要解决的真实问题、已知事实、关键假设与可比较选项；未知之处保持未知。

## 决定

说明选择了什么、没有选择什么，以及该决定约束的范围。

## 后果与边界

| 维度 | 内容                           |
| ---- | ------------------------------ |
| 增加 | `新增的能力、约束或证据`       |
| 删除 | `停止的做法、重复物或错误假设` |
| 保留 | `不得被本决定改写的权威或边界` |
| 风险 | `仍然存在的风险与责任人`       |

## 验证与复审

- **验证方式**：`命令、样本或人工验收`。
- **不作的主张**：`本决定不能证明的结果`。
- **复审触发**：`何种新证据、失效或边界变化会重新打开本决定`。
