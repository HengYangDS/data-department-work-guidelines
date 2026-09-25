#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output="$(mktemp "${TMPDIR:-/tmp}/ddwg-validate-docs-options.XXXXXX")"
trap 'rm -f "$output"' EXIT

if "$ROOT/scripts/validate-docs.sh" --allow-incomplete >"$output" 2>&1; then
  echo "validate-docs.sh unexpectedly accepts --allow-incomplete" >&2
  exit 1
fi

grep -Fqx 'unknown argument: --allow-incomplete' "$output" || {
  cat "$output" >&2
  echo "validate-docs.sh did not reject the retired --allow-incomplete option" >&2
  exit 1
}

if "$ROOT/scripts/validate-docs.sh" \
  --hosted-renderer-config /tmp/foreign-puppeteer-config.json >"$output" 2>&1; then
  echo 'validate-docs.sh unexpectedly accepts a foreign hosted renderer config' >&2
  exit 1
fi

grep -Fqx 'unsupported hosted renderer config: /tmp/foreign-puppeteer-config.json' "$output" || {
  cat "$output" >&2
  echo 'validate-docs.sh did not reject the foreign hosted renderer config' >&2
  exit 1
}

fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-renderer-selection.XXXXXX")"
trap 'rm -f "$output"; rm -rf "$fixture"' EXIT
mkdir -p "$fixture/scripts" "$fixture/node_modules/.bin" "$fixture/tools/ci/config" "$fixture/docs"
cp "$ROOT/scripts/validate-docs.sh" "$fixture/scripts/"
cp "$ROOT/scripts/validate-links.sh" "$fixture/scripts/"
cp "$ROOT"/tools/ci/config/mermaid-puppeteer-*.json "$fixture/tools/ci/config/"
for command in prettier markdownlint-cli2; do
  printf '#!/usr/bin/env bash\nexit 0\n' > "$fixture/node_modules/.bin/$command"
  chmod +x "$fixture/node_modules/.bin/$command"
done
cat > "$fixture/node_modules/.bin/lychee" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "--version" ]]; then
  echo 'lychee 0.24.2'
  exit 0
fi
cat >/dev/null
printf 'invoked\n' > "$LYCHEE_MARKER"
SH
chmod +x "$fixture/node_modules/.bin/lychee"
printf '#!/usr/bin/env bash\nexit 0\n' > "$fixture/scripts/validate-text-layout.sh"
cat > "$fixture/node_modules/.bin/mmdc" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
target=""
config=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o) target="$2" ;;
    --puppeteerConfigFile) config="$2" ;;
  esac
  shift 2
done
python3 - "$config" "$RENDERER_MODE" <<'PY'
import json
import os
from pathlib import Path
import sys

config, mode = sys.argv[1:]
if mode == "explicit":
    assert not config, "an explicit executable must not receive a channel default"
    assert os.environ["PUPPETEER_EXECUTABLE_PATH"] == "/managed/browser"
else:
    assert config, "renderer must select an installed browser without a cache download"
    expected = {"channel": "chrome"} if mode == "system" else {"args": ["--no-sandbox"]}
    assert json.loads(Path(config).read_text()) == expected
PY
printf '<svg/>\n' > "$target"
SH
chmod +x "$fixture/node_modules/.bin/mmdc"
python3 - "$fixture/docs/topic.md" <<'PY'
from pathlib import Path
import sys

lines = [
    "---",
    "subject: fixture:topic",
    "role: policy",
    "state: canonical",
    "relations:",
    "  canonical_for: fixture route",
    "---",
    "",
    "# One topic",
    "",
    "[Self link](#one-topic)",
]
lines.extend(["", "```mermaid", "graph LR; A-->B", "```"] * 2)
Path(sys.argv[1]).write_text("\n".join(lines) + "\n", encoding="utf-8")
PY
for mode in system explicit hosted; do
  (
    unset PUPPETEER_EXECUTABLE_PATH
    export RENDERER_MODE="$mode"
    export DDWG_LYCHEE_BIN="$fixture/node_modules/.bin/lychee"
    export LYCHEE_MARKER="$fixture/render/$mode/lychee.marker"
    args=()
    if [[ "$mode" != system ]]; then
      export PUPPETEER_EXECUTABLE_PATH=/managed/browser
    fi
    if [[ "$mode" == hosted ]]; then
      args=(--hosted-renderer-config tools/ci/config/mermaid-puppeteer-hosted.json)
    fi
    bash "$fixture/scripts/validate-docs.sh" \
      --render-dir "$fixture/render/$mode" "${args[@]}"
    [[ "$(find "$fixture/render/$mode" -name '*.svg' -type f | wc -l | tr -d ' ')" == 2 ]] || {
      echo "validator did not render every present diagram in $mode mode" >&2
      exit 1
    }
    [[ -s "$LYCHEE_MARKER" ]] || {
      echo "documentation validation did not run offline lychee in $mode mode" >&2
      exit 1
    }
  )
done
cat > "$fixture/docs/duplicate.md" <<'EOF'
---
subject: fixture:topic
role: policy
state: canonical
relations:
  canonical_for: duplicate route
---

# Duplicate topic
EOF
if DDWG_LYCHEE_BIN="$fixture/node_modules/.bin/lychee" \
  bash "$fixture/scripts/validate-docs.sh" >"$fixture/output" 2>&1; then
  echo "documentation validator accepted a duplicate document subject" >&2
  exit 1
fi
grep -Fq 'duplicate document subject' "$fixture/output"

echo 'PASS renderer selection: system channel, explicit executable, and isolated hosted compatibility'
