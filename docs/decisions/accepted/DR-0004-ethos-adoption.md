---
subject: data-department-work-guidelines:DR-0004-ethos-adoption
role: decision
state: canonical
decision_id: DR-0004
decision_status: accepted
decision_date: 2026-07-12
relations:
  canonical_for: repository governance adoption
  normalized_by: adoption-lifecycle-repair-20260714
---

# DR-0004：ETHOS adopter 接入

> **状态 Status:** canonical
>
> **目的 Purpose:** 仓库变更、证据与发布边界的本地 ETHOS 接入。
>
> **决策状态 Decision status:** accepted
>
> **原决策日期 Decision date:** 2026-07-12
>
> **记录规范化 Normalized:** 2026-07-17；本次只校正记录与治理结构，**不追溯宣称原决定已走 OpenSpec lifecycle**。
>
> **参见 See also:** [ETHOS 治理](../../governance/ethos.md)、[持久证据说明](../../evidence/README.md)。

## Context

文档质量脚本与手工分支操作不足以把变更归属、候选列车、证明、完成主张和发布边界连接为可检查闭环。仓库需要治理其自身的变更与证据，但不能让治理文档变成第二套团队准则，也不能把远端可达性误当成本地完成。

## Decision

以文档型 ETHOS adopter 接入本仓库：

- 保持 `guidelines.md` 为唯一规则事实源；
- 采用 `dev → candidate/dev → work/*` 的本地闭环；
- 以 Markdown 格式、lint、链接/锚点与 Mermaid 渲染作为文档型原生证明；
- 使用仓库绑定适配器和可移植 hooks，防止 ETHOS 实现仓库被误作治理对象；
- 采用本地验证与安装、GitLab 组织主发布、GitHub 独立完整镜像/CI-CD 的三层发布模型；
  remote 配置不替代 GitHub ref、CI 或发布的独立证据。

后续实质治理、规范、proof、决策拓扑与 authority 变更必须经由官方 OpenSpec lifecycle；本次
2026-07-17 创建的纠偏 Change 是该约束的首次可验证载体。ETHOS-owned material-path companion
将范围绑定接入 `lane prewrite`、`plan --changed` 与 `prove`；仓库的附加边界检查不替代
ETHOS 的 lifecycle、admission 或 archive 机制。

## Alternatives Rejected

- **只保留文档质量脚本与手工分支操作**：无法机械约束归属、证据与完成主张；
- **要求所有人裸调用 ETHOS 产品命令**：会把运行位置与审计对象混淆，也损害可移植性；
- **把远端或 hosted 状态纳入本地完成定义**：网络与托管投影不应阻断或伪造本地事实。

## Consequences and Boundary

| 维度   | 后果                                                                           |
| ------ | ------------------------------------------------------------------------------ |
| 增加   | Work Lane、候选列车、HEAD 绑定证明、OpenSpec lifecycle、范围绑定与仓库根绑定。 |
| 删除   | 无归属的受跟踪修改、以工具运行位置替代治理对象的隐式假设。                     |
| 保留   | 本地 closeout 与双远端发布的分离；团队规则仍由 `guidelines.md` 承载。          |
| 不推论 | 本地 adopter 接入不证明任一远端已发布、CI 已运行、已渲染或团队已采用。         |

## Evidence and Revisit

- **依据与实现**：仓库治理 profile、可移植 hooks、仓库绑定适配器、持久证据与
  HEAD 绑定本地证明；
- **不作的主张**：不把 ETHOS 产品内部迁移、shadow parity 或远端发布归入本仓库的本地完成结论；
- **复审触发**：仓库根绑定失效、Work Lane 不能保护写入、proof 不能绑定当前 HEAD，或
  material governance change 绕过 ETHOS 的 OpenSpec lifecycle 仍可提交时，
  重新评估接入设计。
