---
subject: data-department-work-guidelines:ethos-adoption
role: decision
state: canonical
relations:
  canonical_for: repository governance adoption
---

# 决策：将准则仓库接入 ETHOS adopter

> **状态 Status:** canonical（仓库治理的现行决策；本地接入完成，远端发布与 hosted 验证待执行）
>
> **日期 Date:** 2026-07-12
>
> **目的 Purpose:** 将本地变更、证据、完成主张与发布边界纳入同一受控闭环。
>
> **参见 See also:** [ETHOS 治理](../governance/ethos.md)、[决策索引](decision-index.md)、
> [持久证据说明](../evidence/README.md)。

## 问题

本仓库此前只有文档质量脚本与手工分支操作：变更可被修改，却缺少 Work Lane 的归属、
候选列车、本地证明和完成主张之间的机械约束。已有旧工作树也显示出这一缺口：改动虽可
保全，却没有租约或受控落地路径。

## 决定

以文档型 `generic` ETHOS adopter 接入本仓库：

- 保持 `guidelines.md` 为唯一规则事实源，不把 ETHOS 文档变成第二套团队准则；
- 显式采用 `dev → candidate/dev → work/*` 的本地闭环；
- 以仓库锁定的 Markdown 格式、lint、链接/锚点和 Mermaid 渲染作为原生证明；
- 使用只调用 `ethos` 公共命令的可移植 hooks，而不把 ETHOS 产品仓库的内部路径复制进来；
- 将 GitLab remote 保持为未验证的发布投影，待连接恢复后另行验证。

## 初始接入例外

接入前不存在可用的 candidate、Work Lane 租约或 hooks，因而首次创建 `dev`、ETHOS
绑定与 `candidate/dev` 是一次有明确 HEAD 的初始化操作。旧的未治理改动已先存入命名
stash，再由 ETHOS 退役其无绑定分支；后续受跟踪修改必须走 Work Lane 与证明链路。

## 验收与边界

本地验收至少包括：`ethos status`、`ethos audit`、当前 HEAD 的 `ethos prove --execute`
以及文档质量脚本。它们证明的是本地仓库状态，不证明远端已发布、GitLab CI 已运行、
GitLab 的锚点算法已实际渲染，或团队运行质量已经提高。
