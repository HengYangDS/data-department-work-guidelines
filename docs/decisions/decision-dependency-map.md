---
subject: data-department-work-guidelines:decision-dependency-map
role: reference
state: canonical
relations:
  canonical_for: decision dependency map
---

# 决策依赖图

```mermaid
flowchart LR
    A["DR-0001 人智协作"] --> B["DR-0002 读者体验重构"]
    B --> C["DR-0003 本地采用准备"]
    B --> D["DR-0004 ETHOS adopter 接入"]
    C --> E["真实任务试用与规则演化"]
    D --> E
```

- **DR-0001 → DR-0002**：入口与场景卡必须保留人设定方向、验真与归责的结构。
- **DR-0002 → DR-0003**：试用准备复用入口与行动卡，不复制规范性正文。
- **DR-0002 → DR-0004**：文档质量门成为文档型 adopter 的原生证明之一。
- **DR-0003 / DR-0004 → 真实试用**：真实运行证据决定后续保留、修订或废止，不由宣传替代。
