#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$ROOT/scripts/validate-docs.sh" "$@"

python3 - "$ROOT" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
required_files = {
    "docs/adoption/README.md",
    "docs/adoption/trial-log.template.md",
    "docs/adoption/project-adapter.template.md",
}
for relative_path in required_files:
    if not (root / relative_path).is_file():
        raise SystemExit(f"missing rollout artifact: {relative_path}")

required_fragments = {
    "README.md": [
        "## 三分钟定向",
        "## 我现在要做什么？",
        "./guidelines.md#启动任务卡",
        "./guidelines.md#复盘与规则演化卡",
        "./docs/adoption/",
    ],
    "AGENTS.md": [
        "## 最小加载",
        "## 任务路由",
        "./guidelines.md#任务内核卡",
        "./guidelines.md#人智协作卡",
    ],
    "docs/adoption/README.md": [
        "本目录不是规则事实源",
        "真实试用与远端发布均未在本文件中宣称完成",
        "validate-rollout-readiness.sh",
    ],
    "docs/adoption/trial-log.template.md": [
        "非规范性工作记录",
        "不作的主张",
        "实际净增益",
    ],
    "docs/adoption/project-adapter.template.md": [
        "不复制或重述",
        "项目不得复制四条底线、场景卡或 Agent 协议",
        "接入完成只表示接入信息可用",
    ],
}

for relative_path, fragments in required_fragments.items():
    text = (root / relative_path).read_text(encoding="utf-8")
    for fragment in fragments:
        if fragment not in text:
            raise SystemExit(
                f"missing rollout readiness contract: {relative_path}: {fragment}"
            )

print("PASS rollout readiness: routes, local adapters, and trial boundaries")
PY
