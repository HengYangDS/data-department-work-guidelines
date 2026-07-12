# Task 2 Report — Reader and Agent Entry Routes

## Problem

The previous README presented a repository inventory instead of a short route from a reader's immediate situation to the governing text. AGENTS.md required broad chapter loading without a task-class router, making Agent context loading less selective than the canonical collaboration protocol requires.

## Evidence

- The prior README had only “权威入口” and “使用方式”; it had no three-minute orientation or scene navigation.
- The prior AGENTS.md had a fixed pre-edit reading list but no “最小加载” or “任务路由” section.
- `guidelines.md` chapter 2 establishes the four bottom lines and authority order; chapter 8 requires direct, risk-proportionate loading; section 11.6 requires additions to have an observed failure mode, evidence, validation, and review condition.
- Task 3 reserves the six final scene-card anchors named in the task brief. This task links to those exact targets without adding competing rule text.

## Additions

- README now provides the requested “三分钟定向” table, six-scene navigation table, and authority/evolution pointers.
- AGENTS.md preserves the user-instruction → guidelines → README authority order, adds minimum loading, and maps four task types to scene cards and current deep-rule headings.
- Both routes link to `guidelines.md`; they do not copy the detailed policy.

## Removals

- Removed the README's repository-inventory-first entry and generic usage instructions.
- Replaced AGENTS.md's broad, prose-only work constraints with a task-selective router; retained only repository-level modification and reporting constraints.

## Expected Net Gain

A human can select an initial card within three minutes, while an Agent can load only the task kernel, one relevant scene card, and necessary deep rules. Canonical authority remains in `guidelines.md`, reducing duplicated policy and drift risk.

## Validation

- Ran `./scripts/validate-docs.sh --allow-incomplete --render-dir /tmp/data-guidelines-qa` after the final README lint fix: exit 0; markdownlint reported 0 errors; 8 Markdown files validated; 0 pre-body Mermaid diagrams extracted.
- Ran the requested heading search: each of `三分钟定向`, `我现在要做什么`, `最小加载`, and `任务路由` appeared exactly once.
- Ran a direct route-target reference check: all six specified Task 3 card fragments and all selected current deep-rule fragments are present in the two route files.
- Ran `git diff --check`: exit 0.

## Review Condition

After Task 3 adds the reserved card headings to `guidelines.md`, run the documentation gate again and verify fragment resolution against the rendered final headings. Review the routes if a card title or canonical anchor changes, if readers still enter the wrong scene, or if a route begins to restate policy rather than point to it.

## Test Results

```text
PASS documentation QA; rendered diagrams: /tmp/data-guidelines-qa
README.md:5:## 三分钟定向
README.md:14:## 我现在要做什么？
AGENTS.md:11:## 最小加载
AGENTS.md:18:## 任务路由
PASS route anchors reference all specified final and deep-rule targets
PASS git diff --check
```

## Review Fix — 2026-07-12

### Findings and Resolution

- Recast AGENTS.md's user-instruction → guidelines → README sequence as an
  authority-resolution order. It no longer requires complete canonical and
  README reads before the task-selective minimum route.
- Kept the exact Task 3-owned `任务内核卡` target as the first canonical load in
  the minimum route; it remains a route, not a seventh scene card.
- Split the communication/writing deep reads into separately labelled links to
  `6. 口头沟通规范` and `7. 行文表达规范`.
- Extended the strict documentation gate to derive GitLab-style anchors from
  unfenced Markdown headings and reject unresolved local Markdown fragments.
  The derivation supports the existing numeric/Chinese anchors
  `#23-四条不可突破的底线`、`#8-人智协作边界责任与验真` and
  `#116-规则与实践的生命周期`. In `--allow-incomplete` mode the gate still
  validates local file paths while intentionally deferring fragments that Task
  3 has not yet created.

### Tests

- `markdownlint-cli2 AGENTS.md` exits 0.
- `bash -n scripts/validate-docs.sh` exits 0.
- Fresh `./scripts/validate-docs.sh --allow-incomplete --render-dir
  /tmp/data-guidelines-qa` exits 0.
- Default `./scripts/validate-docs.sh --render-dir /tmp/data-guidelines-qa`
  rejects the missing `guidelines.md#任务内核卡` fragment before checking the
  Mermaid count.
- A strict temporary fixture with five renderable diagrams resolves all three
  representative existing anchors named above, then renders all five diagrams.

### Post-Task-3 Review Condition

After Task 3 adds `任务内核卡` and the six scene-card headings, rerun the
default gate. It must resolve every local fragment and then enforce exactly
five Mermaid diagrams before this route can be accepted as final.

## Final Gate Fix Evidence — 2026-07-12

- `scripts/validate-docs.sh` now validates every local Markdown fragment in both
  modes. `--allow-incomplete` defers only the seven exact Task 3-owned headings:
  `任务内核卡`、`启动任务卡`、`分析与决策卡`、`数据采用与生产卡`、
  `沟通与写作卡`、`人智协作卡`、`复盘与规则演化卡`, and only when the target
  is `guidelines.md`. The named set and code comment document this staging
  exception.
- Fresh incomplete QA: `./scripts/validate-docs.sh --allow-incomplete
  --render-dir /tmp/data-guidelines-qa-task2-final` exited 0; markdownlint
  reported 0 errors; 8 Markdown files validated; 0 Mermaid diagrams extracted.
  This covers allowance of the pending Task 3 route fragments.
- Non-pending incomplete fixture: a temporary Markdown file linking to
  `README.md#no-such-existing-heading` was rejected with exit 1 and
  `broken local fragment`; the fixture was removed afterward.
- Strict final behavior: `./scripts/validate-docs.sh --render-dir
  /tmp/data-guidelines-qa-task2-strict` rejected the still-missing
  `guidelines.md#任务内核卡` fragment with exit 1 before Mermaid-count checking.
- `bash -n scripts/validate-docs.sh` and `git diff --check` exited 0. All
  temporary fixtures and captured test output were removed; only the scoped
  script change and this report append remain.

## P1 Completion — 2026-07-12

- Pre-body deferral now compares `unquote(fragment)` directly against the
  seven Task 3 headings; GitLab-anchor normalization remains only for resolving
  real headings. A temporary `%E4%BB%BB%E5%8A%A1%E5%86%85%E6%A0%B8%E5%8D%A1%21`
  fixture was rejected in `--allow-incomplete` mode.
- The validator now resolves full and collapsed non-image reference links from
  same-document definitions before applying the existing local path/fragment
  checks. Temporary full-reference bad-fragment and collapsed-reference
  bad-file fixtures both rejected in `--allow-incomplete`; a missing-definition
  fixture also rejected.
- Fresh gates: `bash -n scripts/validate-docs.sh` and
  `./scripts/validate-docs.sh --allow-incomplete --render-dir
  /tmp/data-guidelines-qa-task2-final` passed (8 Markdown files, 0 Mermaid
  diagrams). All temporary fixtures were removed.
