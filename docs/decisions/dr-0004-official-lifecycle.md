---
subject: data-department-work-guidelines:DR-0004-official-lifecycle
role: decision
state: canonical
decision_id: DR-0004
decision_status: accepted
decision_date: 2026-09-25
relations:
  canonical_for: official repository change lifecycle boundary
---

# DR-0004：官方变更生命周期

## Context

文档检查和手工分支操作只能观察部分结果，不能将变更归属、授权、证明与发布连成可信闭环。
把方法包、日期报告或本地脚本抬成治理载体，又会形成平行权威。

## Decision

一个实质变更只由一个选定的官方 OpenSpec Change 承载意图、规格和任务进度。
ETHOS 管理 Work Lane、写入准入、证明、接受与发布边界。
仓库本地检查只补充文档和决策拓扑约束，不替代官方生命周期。
团队工作准则与仓库治理分层，不相互代管。

## Alternatives Rejected

- 只依赖文档脚本与手工分支操作，无法可靠绑定对象、变更与证明。
- 用 Superpowers 文档、日期型 DR、claim 或私有 scope 清单充当 Change，会制造第二套生命周期。
- 把远端可达性、镜像配置或本地验证当作远端交付和团队采用的证据，会混淆事实层。

## Consequences and Boundary

源码接受、GitLab 组织主发布、GitHub 独立完整镜像与 CI/CD 是不同效果，分别验收。
候选与执行工作线留在本地；远端可发布分支由当前仓库治理合同约束。
具体命令、runner 选择和 profile 字段由[当前治理合同](../governance/ethos.md)
与相关 Change 承担，不冻结在 DR 中。

## Evidence and Revisit

当前规则见[仓库治理](../governance/ethos.md)和[官方 OpenSpec](../../openspec/README.md)；
历史决定及修订留在 Git。
原始 ETHOS 接入决定留在 Git 历史；本记录的官方生命周期边界于 2026-09-25 重新确认。
它不追溯宣称原决定经过后来才建立的生命周期，也不证明当前远端或团队采用。
若官方机制不能保证实质变更归属或完成主张绑定，应在产品与 adopter 的权威边界内复审，
而非另造私有流程。
