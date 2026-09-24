# 变更记录

本文件记录已进入团队基线的实质变更；工作草稿、会话摘要和未验证设想不在此登记。

## [Unreleased]

### 纠偏

- 将 material governance change 的唯一变更载体收敛为 OpenSpec lifecycle，并新增生命周期与
  决策边界检查。
- 将四项已接受取舍重建为稳定编号的 DR，分离文档状态、决策状态、实施任务与验证记录。
- 移除特定执行方法的文档根；历史仍由 Git 保留，不再作为规范、决策或 proof 载体。
- 以可复现的 Node、Python 与 Chromium 环境新增 GitLab 主发布与 GitHub 镜像平面的
  同等文档 CI 定义；remote 配置不构成 GitHub ref、CI 或发布的证据。
- **BREAKING** 移除 GitHub 文档 job 的最小 Node container；checkout 改在 hosted runner 上
  完成，再显式选择 Node 22 与 Chrome，避免缺 Git 时 archive fallback 破坏仓库验证边界。GitLab
  Docker projection 同时将 Git 列为明确运行时前置；两边仍只调用同一仓库 verifier。
- 将 hosted Chrome 的 sandbox 兼容例外收敛为一份受跟踪的 Puppeteer 配置；GitLab 与 GitHub
  只经同一 verifier 显式选择它，本地 Mermaid 渲染仍保留默认 sandbox 行为。
- 修复 shared verifier 在 rollout-readiness 的二次文档校验中遗漏 hosted renderer 选择的问题；
  兼容参数仍只由受控 CI 显式传入，不改变本地默认 sandbox 行为。
- GitHub documentation CI now uses a GitHub-hosted Ubuntu runner with explicit
  Node 22 and managed stable Chrome; it no longer selects a DDWG self-hosted
  runner, repository variable, Homebrew runtime, host Chrome path, or local-host
  pull-request guard. GitLab remains independently tagged and operated.
- GitLab 文档 CI 显式选择 `ddwg-documentation-ci` 项目 runner tag；runner 的远端 locked、
  no-untagged-job 收紧与 GitHub runner 的注册/运行证据仍由各 Forge 单独验收。
- 远端推送只允许 `dev`、`main` 与 `submit/*`；`work/*` 和 `candidate/dev` 永不推送。

### 未作的主张

- 本项纠偏不追溯宣称 2026-07-12 的原始变更已经过 OpenSpec lifecycle；也不证明
  GitHub/GitLab runner 已执行新 job、任一 Forge 已完成 Markdown 渲染，或真实团队采用已经发生。

## [2.2.2] — 2026-07-12

### 调整（2.2.2）

- 新增仓库绑定的 `scripts/ethos-repo.sh`：固定治理对象为当前仓库根，拒绝调用方覆写
  `--root`，避免 ETHOS 实现仓库被误作 adopter。
- 新增根绑定回归测试与可选 repository-native gate descriptor；其显式验证适配器 contract，
  但不进入文档型 adopter 的默认 proof floor。Agent 路由、hooks、OpenSpec、证据与技能说明
  均改由该适配器执行。
- repository-native proof descriptor 一律通过 `bash` 调用脚本，不以 Git 文件执行位作为
  跨平台前提；默认 code-correctness 选择仍只有文档完整性与 Markdown 格式两项。
- 修复技能包摘要、证据摘要、演化 proof 引用与格式化/链接校验，使 ETHOS 本地证据可复查。
- 明确本仓库采用外部 ETHOS runner：不把产品嵌入式后端迁移、shadow parity 或产品命令手册
  检查伪装为本仓库已经完成的能力。

### 未作的主张（2.2.2）

- 本版本不证明 ETHOS 产品已修复默认根解析，也不证明产品已完成嵌入式后端迁移或 shadow parity。
- 本版本不证明远端 GitLab 已发布、CI 已运行、GitLab 已完成渲染验证，或团队已完成真实采用。

## [2.2.1] — 2026-07-12

### 调整（2.2.1）

- 将“约化一切，然后推演一切”收敛为“约其要而不失其真，辨其势而循证推演”：最小内核服务于认识，不得将现实强压为单一模型。
- 补足 ETHOS adopter 的公共文档、证据、主张与演化骨架，使本地证明面对的是完整的语义契约，而非仅运行自定义文档脚本。
- 将 Prettier 配置并入 `package.json`；根目录不再保留会被 ETHOS 误判为生成物的 `.prettierrc.json`。
- 将链接工作树移出仓库根，统一放入相邻的
  `data-department-work-guidelines-worktrees/`；并将 `.idea/`、`.serena/`、`.DS_Store`
  纳入共享忽略规则。

### 未作的主张（2.2.1）

- 本地语义治理与质量门不等同于远端 GitLab 已发布、GitLab CI 已运行、GitLab 已实际渲染，或团队已在真实工作中采用并提升质量。

## [2.2.0] — 2026-07-12

### 调整（2.2.0）

- 将仓库接入 ETHOS adopter：显式建立本地 `dev → candidate/dev → Work Lane` 闭环、Agent 路由与本地证据边界。
- 将准则首屏任务表中的章节文字全部改为可点击的正文链接，并补齐 Agent 的启动与复盘路由。
- 将 Markdown 格式、lint、链接/锚点、Mermaid 渲染统一为仓库锁定的本地质量门。

### 未作的主张（2.2.0）

- 本地 ETHOS 接入不等同于 GitLab CI 已配置、远端已发布、GitLab 已完成渲染验证，或团队已实际采用。

## [2.1.0] — 2026-07-12

### 调整（2.1.0）

- 重构阅读入口为“三分钟定向—场景路由—深度规则”。
- 在唯一规则正文中加入五张可渲染 Mermaid 与六张场景行动卡。
- 将 `README.md` 与 `AGENTS.md` 改为人类和 Agent 的定向入口，不复制规则。
- 新增可重复执行的文档质量门与视觉渲染检查。

### 未作的主张（2.1.0）

- 本版本证明文档可读性与结构质量，不证明团队质量已经提高；
  仍需通过真实试点验证。

## [2.0.1] — 2026-07-12

### 调整（2.0.1）

- 将总体关系名称由“人—Agent 协作”调整为“人智协作”。
- 明确其定义：人定其向，智扩其能；协作于事，归责于人。
- 保留 Agent（智能体）作为技术实体名称；“人智协作”仅指总体工作关系与责任秩序。
- 将“借智成事，依实定论，归责于人”确立为本章工作法。

## [2.0.0] — 2026-07-10

### 新增

- 发布数据部门通用工作质量与人智协作准则作为唯一事实源。
- 建立以《问道》为根的原则层：求真去蔽、见微知变、因物顺势、抱一御繁、分判有度、各正其位、功成化育。
- 建立可信交付内核：权威 → 对象 → 承诺 → 变更 → 证据 → 主张 → 记录。
- 建立数据部门共同质量契约，覆盖来源、时点、语义、变化、质量和受控使用。
- 建立人智协作、完成声明、评审校准、运行培养和规则废止机制。

### 边界

- 本版本是工作质量基线，不是部门岗位说明、项目计划、绩效制度或具体技术标准。
- 部门整体质量改善尚未由运行数据证明；需通过真实工作试点、周度校准和季度复审验证。
