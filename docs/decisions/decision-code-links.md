---
subject: data-department-work-guidelines:decision-implementation-links
role: reference
state: canonical
relations:
  canonical_for: decision to implementation links
---

# 决策与实现链接

> **状态 Status:** canonical（决策与可检查实现的当前映射）
>
> **目的 Purpose:** 将持久取舍连接到规则、脚本、配置、证据和验证入口。
>
> **参见 See also:** [决策索引](decision-index.md)、[ETHOS 治理](../governance/ethos.md)。

本仓库以文档、脚本与治理配置为主要实现载体；下表将持久决策连接到可检查的具体位置。

| 决策                  | 主要实现                                                                                                             | 验证入口                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| DR-0001 人智协作      | [`guidelines.md` 第 8 章](../../guidelines.md#8-人智协作边界责任与验真)                                              | `./scripts/validate-docs.sh`                                     |
| DR-0002 读者体验      | [`README.md`](../../README.md)、[`AGENTS.md`](../../AGENTS.md)、场景卡与 Mermaid 图                                  | `./scripts/validate-docs.sh`                                     |
| DR-0003 本地采用准备  | [`docs/adoption/`](../adoption/)、`scripts/validate-rollout-readiness.sh`                                            | `./scripts/validate-rollout-readiness.sh`                        |
| DR-0004 ETHOS adopter | [`.ethos/profile.toml`](../../.ethos/profile.toml)、[`.githooks/`](../../.githooks/)、[`evidence/`](../../evidence/) | `ethos prove --execute --scope docs --expect-head <HEAD> --json` |

这些链接描述仓库内的实施与验证位置；它们不构成 GitLab 远端、hosted CI 或团队采用结果的证据。
