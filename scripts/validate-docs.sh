#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDER_DIR=""
HOSTED_RENDERER_CONFIG=""
CANONICAL_HOSTED_RENDERER_CONFIG="tools/ci/config/mermaid-puppeteer-hosted.json"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --render-dir)
      RENDER_DIR="${2:?--render-dir requires a directory}"
      mkdir -p "$RENDER_DIR"
      shift 2
      ;;
    --hosted-renderer-config)
      HOSTED_RENDERER_CONFIG="${2:?--hosted-renderer-config requires a path}"
      shift 2
      ;;
    *)
      echo "unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if [[ -n "$HOSTED_RENDERER_CONFIG" && "$HOSTED_RENDERER_CONFIG" != "$CANONICAL_HOSTED_RENDERER_CONFIG" ]]; then
  echo "unsupported hosted renderer config: $HOSTED_RENDERER_CONFIG" >&2
  exit 2
fi

if [[ -z "$RENDER_DIR" ]]; then
  RENDER_DIR="$(mktemp -d "${TMPDIR:-/tmp}/data-guidelines-qa.XXXXXX")"
  trap 'rm -rf "$RENDER_DIR"' EXIT
fi

command -v python3 >/dev/null || {
  echo "missing required documentation QA command: python3" >&2
  exit 127
}

PRETTIER="$ROOT/node_modules/.bin/prettier"
MARKDOWNLINT="$ROOT/node_modules/.bin/markdownlint-cli2"
MMDC="$ROOT/node_modules/.bin/mmdc"
for command in "$PRETTIER" "$MARKDOWNLINT" "$MMDC"; do
  [[ -x "$command" ]] || {
    echo "missing required repository documentation tool: $command" >&2
    echo "run: (cd \"$ROOT\" && npm ci --ignore-scripts)" >&2
    exit 127
  }
done

HOSTED_RENDERER_CONFIG_PATH=""
if [[ -n "$HOSTED_RENDERER_CONFIG" ]]; then
  HOSTED_RENDERER_CONFIG_PATH="$ROOT/$HOSTED_RENDERER_CONFIG"
  [[ -f "$HOSTED_RENDERER_CONFIG_PATH" ]] || {
    echo "missing hosted renderer config: $HOSTED_RENDERER_CONFIG" >&2
    exit 2
  }

  python3 - "$HOSTED_RENDERER_CONFIG_PATH" <<'PY'
from pathlib import Path
import json
import sys

path = Path(sys.argv[1])
payload = json.loads(path.read_text(encoding="utf-8"))
if payload != {"args": ["--no-sandbox"]}:
    raise SystemExit("hosted renderer config must contain only the CI compatibility argument")
PY
fi

PUPPETEER_CONFIG_PATH="$HOSTED_RENDERER_CONFIG_PATH"
if [[ -z "$PUPPETEER_CONFIG_PATH" && -z "${PUPPETEER_EXECUTABLE_PATH:-}" ]]; then
  PUPPETEER_CONFIG_PATH="$ROOT/tools/ci/config/mermaid-puppeteer-system.json"
fi

cd "$ROOT"
"$MARKDOWNLINT" '**/*.md' '#.superpowers/**' '#.worktrees/**' '#build/**' '#node_modules/**'
"$PRETTIER" --check '**/*.md'

python3 - "$ROOT" "$RENDER_DIR" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1]).resolve()
render_dir = Path(sys.argv[2])
excluded = {".git", ".superpowers", ".worktrees", "build", "node_modules"}
markdown_files = sorted(
    path
    for path in root.rglob("*.md")
    if path.relative_to(root).parts[0] not in excluded
    and path.relative_to(root).parts[:3] != ("openspec", "changes", "archive")
)

if (root / "guidelines.md").exists():
    raise SystemExit("retired root guidelines.md remains in current topology")

subjects = {}
diagram_count = 0
fence_open = re.compile(r"^ {0,3}(?P<fence>`{3,}|~{3,})(?P<info>.*)$")
for path in markdown_files:
    relative = path.relative_to(root)
    source = path.read_text(encoding="utf-8")
    if relative.parts[0] == "docs":
        match = re.match(r"\A---\n(?P<meta>.*?)\n---\n", source, re.DOTALL)
        if match is None:
            raise SystemExit(f"missing document metadata: {relative}")
        metadata = match.group("meta")
        for key in ("subject", "role", "state", "relations"):
            if not re.search(rf"^{key}:", metadata, re.MULTILINE):
                raise SystemExit(f"missing {key} metadata: {relative}")
        subject = re.search(r"^subject:\s*(\S+)", metadata, re.MULTILINE).group(1)
        if subject in subjects:
            raise SystemExit(
                f"duplicate document subject {subject}: {subjects[subject]} and {relative}"
            )
        subjects[subject] = relative

    active = None
    body = []
    for line in source.splitlines():
        if active is None:
            match = fence_open.match(line)
            if match:
                active = (match.group("fence"), match.group("info").strip())
                body = []
            continue
        fence, info = active
        if re.match(rf"^ {{0,3}}{re.escape(fence[0])}{{{len(fence)},}}\s*$", line):
            if info.split(maxsplit=1)[:1] == ["mermaid"]:
                diagram_count += 1
                name = relative.with_suffix("").as_posix().replace("/", "--")
                (render_dir / f"{name}-{diagram_count}.mmd").write_text(
                    "\n".join(body) + "\n", encoding="utf-8"
                )
            active = None
            body = []
        else:
            body.append(line)
    if active is not None:
        raise SystemExit(f"unbalanced fenced block: {relative}")

print(f"validated {len(markdown_files)} Markdown files and extracted {diagram_count} diagrams")
PY

for source in "$RENDER_DIR"/*.mmd; do
  [[ -e "$source" ]] || continue
  target="${source%.mmd}.svg"
  mmdc_args=(-i "$source" -o "$target" -b white)
  if [[ -n "$PUPPETEER_CONFIG_PATH" ]]; then
    mmdc_args+=(--puppeteerConfigFile "$PUPPETEER_CONFIG_PATH")
  fi
  "$MMDC" "${mmdc_args[@]}"
  test -s "$target"
done

bash "$ROOT/scripts/validate-links.sh"
bash "$ROOT/scripts/validate-text-layout.sh"

printf 'PASS documentation QA; rendered diagrams: %s\n' "$RENDER_DIR"
