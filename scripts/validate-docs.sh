#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDER_DIR=""
EXPECTED_MERMAID=5

while [[ $# -gt 0 ]]; do
  case "$1" in
    --allow-incomplete)
      EXPECTED_MERMAID=0
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
markdownlint-cli2 '**/*.md' '#.superpowers/sdd/**'

python3 - "$ROOT" "$RENDER_DIR" "$EXPECTED_MERMAID" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
render_dir = Path(sys.argv[2])
expected_mermaid = int(sys.argv[3])
excluded_parts = (".superpowers", "sdd")
markdown_files = sorted(
    path
    for path in root.rglob("*.md")
    if path.relative_to(root).parts[:2] != excluded_parts
)
local_link = re.compile(r"\[[^]]+\]\(([^)#]+)(?:#[^)]+)?\)")
fence_start = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")


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


for path in markdown_files:
    text = path.read_text(encoding="utf-8")
    for target in local_link.findall(text):
        if "://" in target or target.startswith("mailto:"):
            continue
        if not (path.parent / target).resolve().exists():
            raise SystemExit(
                f"broken local link: {path.relative_to(root)} -> {target}"
            )
    list(fenced_blocks(path))

main = root / "guidelines.md"
text = main.read_text(encoding="utf-8")
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
