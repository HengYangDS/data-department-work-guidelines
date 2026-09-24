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
mkdir -p "$fixture/scripts" "$fixture/node_modules/.bin" "$fixture/tools/ci/config"
cp "$ROOT/scripts/validate-docs.sh" "$fixture/scripts/"
cp "$ROOT"/tools/ci/config/mermaid-puppeteer-*.json "$fixture/tools/ci/config/"
for command in prettier markdownlint-cli2; do
  printf '#!/usr/bin/env bash\nexit 0\n' > "$fixture/node_modules/.bin/$command"
  chmod +x "$fixture/node_modules/.bin/$command"
done
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
python3 - "$fixture/guidelines.md" <<'PY'
from pathlib import Path
import sys

lines = [
    "# 数据部门工作与人智协作准则",
    "人定其向，智扩其能；协作于事，归责于人。",
    "借智成事，依实定论，归责于人。",
    "## 场景行动卡",
]
for heading in ("启动任务卡", "分析与决策卡", "数据采用与生产卡", "沟通与写作卡", "人智协作卡", "复盘与规则演化卡"):
    lines.append(f"### {heading}")
    lines.extend(f"**{field}：** Fixture." for field in ("何时使用", "先问什么", "最小输入", "必须产出", "停止/升级条件", "验真方式"))
lines.append("## 8. 人智协作：边界、责任与验真")
lines.extend(["```mermaid", "graph LR; A-->B", "```"] * 5)
Path(sys.argv[1]).write_text("\n".join(lines) + "\n", encoding="utf-8")
PY
for mode in system explicit hosted; do
  (
    unset PUPPETEER_EXECUTABLE_PATH
    export RENDERER_MODE="$mode"
    args=()
    if [[ "$mode" != system ]]; then
      export PUPPETEER_EXECUTABLE_PATH=/managed/browser
    fi
    if [[ "$mode" == hosted ]]; then
      args=(--hosted-renderer-config tools/ci/config/mermaid-puppeteer-hosted.json)
    fi
    bash "$fixture/scripts/validate-docs.sh" "${args[@]}"
  )
done
echo 'PASS renderer selection: system channel, explicit executable, and isolated hosted compatibility'
