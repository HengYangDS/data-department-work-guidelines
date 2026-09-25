#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CACHED_LYCHEE="$ROOT/build/runtime/tool-cache/lychee/0.24.2/lychee"
LYCHEE="${DDWG_LYCHEE_BIN:-}"

[[ $# -eq 0 ]] || {
  echo "unknown argument: $1" >&2
  exit 2
}

if [[ -z "$LYCHEE" && -x "$CACHED_LYCHEE" ]]; then
  LYCHEE="$CACHED_LYCHEE"
fi
if [[ -z "$LYCHEE" ]]; then
  LYCHEE="$(command -v lychee || true)"
fi
[[ -n "$LYCHEE" && -x "$LYCHEE" ]] || {
  echo "missing lychee 0.24.2; install with Homebrew locally or use the pinned CI bootstrap" >&2
  exit 127
}
[[ "$("$LYCHEE" --version)" == "lychee 0.24.2" ]] || {
  echo "lychee version mismatch; expected 0.24.2" >&2
  exit 2
}

file_list="$(mktemp "${TMPDIR:-/tmp}/ddwg-links-files.XXXXXX")"
trap 'rm -f "$file_list"' EXIT
python3 - "$ROOT" > "$file_list" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
excluded = {".git", ".superpowers", ".worktrees", "build", "node_modules"}
for path in sorted(root.rglob("*.md")):
    relative = path.relative_to(root)
    if relative.parts[0] in excluded:
        continue
    if relative.parts[:3] == ("openspec", "changes", "archive"):
        continue
    print(path)
PY

"$LYCHEE" --dump --files-from "$file_list" |
  python3 -c '
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit

root = Path(sys.argv[1]).resolve()
for raw in sys.stdin:
    uri = urlsplit(raw.strip())
    if uri.scheme != "file":
        continue
    if uri.netloc not in {"", "localhost"}:
        raise SystemExit(f"nonlocal file link is not portable: {raw.strip()}")
    target = Path(unquote(uri.path)).resolve()
    if not target.is_relative_to(root):
        raise SystemExit(f"local link escapes repository root: {target}")
' "$ROOT"

"$LYCHEE" --offline --include-fragments=anchor-only --no-progress \
  --max-retries 0 --files-from "$file_list"
