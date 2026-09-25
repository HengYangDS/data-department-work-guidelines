#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VALIDATOR="$ROOT/scripts/validate-text-layout.sh"
fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-text-layout.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT

mkdir -p "$fixture/scripts" "$fixture/tests"
cp "$VALIDATOR" "$fixture/scripts/validate-text-layout.sh"

cat > "$fixture/README.md" <<'EOF_MARKDOWN'
# Fixture

One semantic block.
EOF_MARKDOWN

cat > "$fixture/config.toml" <<'EOF_TOML'
[section]
key = "value"
EOF_TOML

cat > "$fixture/scripts/good.sh" <<'EOF_SHELL'
#!/usr/bin/env bash
set -euo pipefail

first() {
  :
}


second() {
  :
}
EOF_SHELL

cat > "$fixture/tests/good.py" <<'EOF_PYTHON'
def first() -> None:
    pass


class Second:
    pass
EOF_PYTHON

bash "$fixture/scripts/validate-text-layout.sh"

printf '\n\n' >> "$fixture/README.md"
if bash "$fixture/scripts/validate-text-layout.sh" >"$fixture/output" 2>&1; then
  echo 'text-layout validator accepted consecutive Markdown blank lines' >&2
  exit 1
fi
grep -Fq 'consecutive blank lines are not allowed' "$fixture/output"

python3 - "$fixture/README.md" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
path.write_text("# Fixture\n\nOne semantic block.\n", encoding="utf-8")
PY
cat > "$fixture/tests/good.py" <<'EOF_PYTHON'
def first() -> None:
    pass

class Second:
    pass
EOF_PYTHON
if bash "$fixture/scripts/validate-text-layout.sh" >"$fixture/output" 2>&1; then
  echo 'text-layout validator accepted one blank line between Python top-level definitions' >&2
  exit 1
fi
grep -Fq 'top-level Python definitions require two blank lines' "$fixture/output"

cat > "$fixture/tests/good.py" <<'EOF_PYTHON'
def first() -> None:
    pass


class Second:
    pass
EOF_PYTHON

expect_language_rejection() {
  local relative_path="$1"
  local text="$2"
  mkdir -p "$(dirname "$fixture/$relative_path")"
  printf '%s\n' "$text" > "$fixture/$relative_path"
  if bash "$fixture/scripts/validate-text-layout.sh" >"$fixture/output" 2>&1; then
    echo "text-layout validator accepted non-English text in $relative_path" >&2
    exit 1
  fi
  grep -Fq "$relative_path:1: CJK text is not allowed" "$fixture/output"
  rm "$fixture/$relative_path"
}

expect_language_rejection 'docs/language.md' "A Chinese term: $(python3 -c 'print(chr(0x4e8b) + chr(0x5b9e))')"
expect_language_rejection 'openspec/changes/archive/history.md' "A Japanese term: $(python3 -c 'print(chr(0x3042) + chr(0x3044))')"
expect_language_rejection '.ethos/language.toml' "# A Korean term: $(python3 -c 'print(chr(0xd55c) + chr(0xae00))')"
expect_language_rejection 'docs/punctuation.md' "A fullwidth mark$(python3 -c 'print(chr(0xff1a))')here"

echo 'PASS text layout and repository language positive and negative cases'
