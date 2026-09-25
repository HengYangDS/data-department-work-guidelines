---
subject: data-department-work-guidelines:DR-0002-reader-experience
role: decision
state: archived
decision_id: DR-0002
decision_status: superseded
decision_date: 2026-07-12
relations:
  superseded_by: guidance-semantic-convergence
---

# DR-0002：读者入口与单体正文

## Context

原始准则集中在根目录长文。首次读者难以迅速找到场景、边界与下一步；当时又担心多个入口会复制规则。

## Decision

当时选择成员入口、Agent 入口与根目录唯一正文的结构，用行动卡和图示降低通读成本。**本决定的单体物理方案现已被语义主题结构替代，不再约束当前文档布局。**

## Alternatives Rejected

- 要求所有读者通读全文，进入成本过高。
- 在入口文件复制完整规则，会造成规则漂移。

## Consequences and Boundary

“按读者任务进入、不要复制规范”仍是有效问题；旧方案中的根长文、固定卡片和图示数量不是持久义务。
当前入口与主题归属由[文档导航](../README.md)及官方 Change `guidance-semantic-convergence` 承担。保留本编号只为解释历史取舍，不再把旧载体伪装成当前权威。

## Evidence and Revisit

原记录与旧结构可从 Git 历史核对；替代方案由官方 Change `guidance-semantic-convergence`
记录，当前入口见[OpenSpec 工作区](../../openspec/README.md)。
在 Change 尚未完成之前，不从本记录推论新路径已被团队采用，也不追溯认证原决定经过 OpenSpec 生命周期。若真实读者仍找不到规则或入口复制了正文，应复审当前导航。
