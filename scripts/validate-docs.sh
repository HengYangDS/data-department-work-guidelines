#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDER_DIR=""
EXPECTED_MERMAID=5
ALLOW_INCOMPLETE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --allow-incomplete)
      EXPECTED_MERMAID=0
      ALLOW_INCOMPLETE=true
      shift
      ;;
    --render-dir)
      RENDER_DIR="${2:?--render-dir requires a directory}"
      mkdir -p "$RENDER_DIR"
      shift 2
      ;;
    *)
      echo "unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if [[ -z "$RENDER_DIR" ]]; then
  RENDER_DIR="$(mktemp -d "${TMPDIR:-/tmp}/data-guidelines-qa.XXXXXX")"
  trap 'rm -rf "$RENDER_DIR"' EXIT
fi

for command in python3 markdownlint-cli2 mmdc; do
  command -v "$command" >/dev/null || {
    echo "missing required documentation QA command: $command" >&2
    exit 127
  }
done

cd "$ROOT"
markdownlint-cli2 '**/*.md' '#.superpowers/**' '#.worktrees/**'

python3 - "$ROOT" "$RENDER_DIR" "$EXPECTED_MERMAID" "$ALLOW_INCOMPLETE" <<'PY'
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlparse

root = Path(sys.argv[1]).resolve()
render_dir = Path(sys.argv[2])
expected_mermaid = int(sys.argv[3])
allow_incomplete = sys.argv[4] == "true"
excluded_roots = {".superpowers", ".worktrees"}
markdown_files = sorted(
    path
    for path in root.rglob("*.md")
    if path.relative_to(root).parts[0] not in excluded_roots
)
local_link = re.compile(
    r"(?<!!)\[[^]]+\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)"
)
reference_link = re.compile(r"(?<!!)\[([^]\n]+)\]\[([^]\n]*)\]")
shortcut_reference = re.compile(r"(?<!!)(?<!\[)\[([^]\n]+)\](?![\[(])")
reference_definition = re.compile(
    r"^ {0,3}\[([^]\n]+)\]:[ \t]*(?:<([^>\n]+)>|(\S+))"
    r"(?:[ \t]+(?:\"[^\"]*\"|'[^']*'|\([^)]+\)))?[ \t]*$"
)
fence_start = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
atx_heading = re.compile(r"^ {0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$")
setext_heading = re.compile(r"^ {0,3}(?:=+|-+)[ \t]*$")


def fenced_blocks(path: Path):
    active_fence = None
    active_info = ""
    content = []

    for line in path.read_text(encoding="utf-8").splitlines():
        if active_fence is None:
            match = fence_start.match(line)
            if match:
                active_fence = match.group(1)
                active_info = match.group(2).strip()
                content = []
            continue

        marker = active_fence[0]
        minimum_length = len(active_fence)
        if re.match(rf"^ {{0,3}}{re.escape(marker)}{{{minimum_length},}}[ \t]*$", line):
            yield active_info, "\n".join(content)
            active_fence = None
            active_info = ""
            content = []
        else:
            content.append(line)

    if active_fence is not None:
        raise SystemExit(
            f"unbalanced fenced block: {path.relative_to(root)}"
        )


def unfenced_lines(path: Path):
    active_fence = None

    for line in path.read_text(encoding="utf-8").splitlines():
        if active_fence is None:
            match = fence_start.match(line)
            if match:
                active_fence = match.group(1)
                continue
            yield line
            continue

        marker = active_fence[0]
        minimum_length = len(active_fence)
        if re.match(rf"^ {{0,3}}{re.escape(marker)}{{{minimum_length},}}[ \t]*$", line):
            active_fence = None

    if active_fence is not None:
        raise SystemExit(
            f"unbalanced fenced block: {path.relative_to(root)}"
        )


def gitlab_anchor(heading: str) -> str:
    normalized = unquote(heading).casefold().strip()
    retained = "".join(
        character
        for character in normalized
        if character.isalnum() or character in {"_", "-", " ", "\t"}
    )
    return re.sub(r"[-\s]+", "-", retained).strip("-")


def heading_anchors(path: Path) -> set[str]:
    lines = list(unfenced_lines(path))
    anchors: set[str] = set()
    duplicates: dict[str, int] = {}

    for index, line in enumerate(lines):
        match = atx_heading.match(line)
        if match:
            heading = match.group(1)
        elif (
            line.strip()
            and index + 1 < len(lines)
            and setext_heading.match(lines[index + 1])
        ):
            heading = line.strip()
        else:
            continue

        base = gitlab_anchor(heading)
        if not base:
            continue
        duplicate = duplicates.get(base, 0)
        anchors.add(base if duplicate == 0 else f"{base}-{duplicate}")
        duplicates[base] = duplicate + 1

    return anchors


def reference_label(label: str) -> str:
    return re.sub(r"\s+", " ", label).casefold().strip()


def reference_definitions(path: Path) -> dict[str, str]:
    definitions: dict[str, str] = {}
    for line in unfenced_lines(path):
        match = reference_definition.match(line)
        if match:
            definitions.setdefault(
                reference_label(match.group(1)), match.group(2) or match.group(3)
            )
    return definitions


PENDING_TASK_3_FRAGMENTS = {
    "任务内核卡",
    "启动任务卡",
    "分析与决策卡",
    "数据采用与生产卡",
    "沟通与写作卡",
    "人智协作卡",
    "复盘与规则演化卡",
}

SCENE_CARD_HEADINGS = [
    "启动任务卡",
    "分析与决策卡",
    "数据采用与生产卡",
    "沟通与写作卡",
    "人智协作卡",
    "复盘与规则演化卡",
]
SCENE_CARD_FIELDS = [
    "何时使用",
    "先问什么",
    "最小输入",
    "必须产出",
    "停止/升级条件",
    "验真方式",
]


def require_within_root(path: Path, source: Path, target: str) -> None:
    try:
        path.relative_to(root)
    except ValueError:
        raise SystemExit(
            f"local link escapes repository root: {source.relative_to(root)} -> "
            f"{target}"
        )


def enforce_scene_card_contract(text: str) -> None:
    section = re.search(
        r"^## 场景行动卡[ \t]*$\n(?P<body>.*?)(?=^## |\Z)",
        text,
        flags=re.MULTILINE | re.DOTALL,
    )
    if section is None:
        raise SystemExit("missing scene action cards section")

    cards = list(
        re.finditer(
            r"^### ([^\n]+?)[ \t]*$",
            section.group("body"),
            flags=re.MULTILINE,
        )
    )
    headings = [match.group(1) for match in cards]
    if headings != SCENE_CARD_HEADINGS:
        raise SystemExit(
            "scene action cards must be exactly: "
            + ", ".join(SCENE_CARD_HEADINGS)
        )

    body = section.group("body")
    for index, card in enumerate(cards):
        card_end = cards[index + 1].start() if index + 1 < len(cards) else len(body)
        card_body = body[card.end() : card_end]
        for field in SCENE_CARD_FIELDS:
            field_pattern = re.compile(rf"\*\*{re.escape(field)}：\*\*")
            count = len(field_pattern.findall(card_body))
            if count != 1:
                raise SystemExit(
                    f"scene action card field count: {card.group(1)} / {field} = {count}; "
                    "expected 1"
                )


anchors_by_path: dict[Path, set[str]] = {}
for path in markdown_files:
    definitions = reference_definitions(path)
    for line in unfenced_lines(path):
        if reference_definition.match(line):
            continue
        targets = [match.group(1) or match.group(2) for match in local_link.finditer(line)]
        for match in reference_link.finditer(line):
            label = match.group(2) or match.group(1)
            target = definitions.get(reference_label(label))
            if target is None:
                raise SystemExit(
                    f"missing local reference definition: {path.relative_to(root)} -> "
                    f"[{label}]"
            )
            targets.append(target)

        for match in shortcut_reference.finditer(line):
            label = match.group(1)
            target = definitions.get(reference_label(label))
            if target is not None:
                targets.append(target)

        for target in targets:
            parsed_target = urlparse(target)
            if parsed_target.scheme and parsed_target.scheme != "file":
                continue
            target_path_text, separator, fragment = target.partition("#")
            if parsed_target.scheme == "file":
                file_target = urlparse(target_path_text)
                if file_target.netloc not in {"", "localhost"} or not file_target.path.startswith("/"):
                    raise SystemExit(
                        f"invalid local file URI: {path.relative_to(root)} -> {target}"
                    )
                target_path = Path(unquote(file_target.path)).resolve()
            else:
                target_path = (
                    (path.parent / target_path_text).resolve()
                    if target_path_text
                    else path.resolve()
                )
            require_within_root(target_path, path, target)
            if not target_path.exists():
                raise SystemExit(
                    f"broken local link: {path.relative_to(root)} -> "
                    f"{target_path_text}"
                )
            if separator and target_path.suffix.lower() == ".md":
                anchors = anchors_by_path.setdefault(
                    target_path, heading_anchors(target_path)
                )
                normalized_fragment = gitlab_anchor(fragment)
                # Pre-body staging defers only literal percent-decoded Task 3 headings.
                is_pending_task_3_fragment = (
                    allow_incomplete
                    and target_path == (root / "guidelines.md").resolve()
                    and unquote(fragment) in PENDING_TASK_3_FRAGMENTS
                )
                if normalized_fragment not in anchors and not is_pending_task_3_fragment:
                    raise SystemExit(
                        f"broken local fragment: {path.relative_to(root)} -> "
                        f"{target}"
                    )
    list(fenced_blocks(path))

main = root / "guidelines.md"
text = main.read_text(encoding="utf-8")
enforce_scene_card_contract(text)
required = [
    "# 数据部门工作与人智协作准则",
    "人定其向，智扩其能；协作于事，归责于人。",
    "借智成事，依实定论，归责于人。",
    "## 8. 人智协作：边界、责任与验真",
]
for phrase in required:
    if phrase not in text:
        raise SystemExit(f"missing canonical contract: {phrase}")

blocks = [
    content
    for info, content in fenced_blocks(main)
    if info.split(maxsplit=1)[:1] == ["mermaid"]
]
if len(blocks) != expected_mermaid:
    raise SystemExit(
        f"expected {expected_mermaid} Mermaid diagrams, found {len(blocks)}"
    )

for index, block in enumerate(blocks, start=1):
    (render_dir / f"guidelines-{index}.mmd").write_text(
        block + "\n", encoding="utf-8"
    )

print(
    f"validated {len(markdown_files)} Markdown files and extracted "
    f"{len(blocks)} diagrams"
)
PY

for source in "$RENDER_DIR"/*.mmd; do
  [[ -e "$source" ]] || continue
  target="${source%.mmd}.svg"
  mmdc -i "$source" -o "$target" -b white
  test -s "$target"
done

printf 'PASS documentation QA; rendered diagrams: %s\n' "$RENDER_DIR"
