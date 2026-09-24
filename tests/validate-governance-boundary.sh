#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VALIDATOR="$ROOT/scripts/validate-governance-boundary.sh"
fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-boundary.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT

[[ -f "$VALIDATOR" ]] || {
  echo "missing governance-boundary validator" >&2
  exit 1
}
for path in docs scripts; do
  cp -R "$ROOT/$path" "$fixture/$path"
done

bash "$fixture/scripts/validate-governance-boundary.sh"

record="$fixture/docs/decisions/accepted/DR-0001-human-intelligence-collaboration.md"
source_record="$ROOT/docs/decisions/accepted/DR-0001-human-intelligence-collaboration.md"
reset_record() {
  cp "$source_record" "$record"
}

reset_record
cat >> "$record" <<'EOF'

OpenSpec 与 ETHOS 是生命周期概念；[Chronicle 证据](../../../evidence/chronicle/)与
[校验器资产](../../../scripts/validate-docs.sh)只是可阅读的证据路由，不构成命令记录。

ethos lifecycle 是治理概念；openspec lifecycle 是 Change 协议，而非本记录中的执行命令。
EOF
bash "$fixture/scripts/validate-governance-boundary.sh"

reset_record
cat >> "$record" <<'EOF'

```text
仅作证据路径展示：./scripts/validate-docs.sh
```
EOF
bash "$fixture/scripts/validate-governance-boundary.sh"

mkdir -p "$fixture/docs/superpowers"
touch "$fixture/docs/superpowers/legacy.md"
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted retired execution-method documents" >&2
  exit 1
fi
grep -Fq 'retired execution-method documents remain' "$fixture/output"
rm -rf "$fixture/docs/superpowers"

cat > "$fixture/docs/decisions/2026-07-14-legacy.md" <<'EOF'
# legacy decision
EOF
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a date-only decision" >&2
  exit 1
fi
grep -Fq 'date-only decision records remain' "$fixture/output"
rm "$fixture/docs/decisions/2026-07-14-legacy.md"

reset_record
python3 - "$record" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
path.write_text(
    path.read_text(encoding="utf-8").replace(
        "## Alternatives Rejected", "## Implementation Tasks"
    ),
    encoding="utf-8",
)
PY
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a malformed DR section set" >&2
  exit 1
fi
grep -Fq 'DR sections must be exactly' "$fixture/output"

reset_record
cat >> "$record" <<'EOF'

```bash
./scripts/validate-docs.sh
```
EOF
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a fenced shell command in a DR" >&2
  exit 1
fi
grep -Fq 'DR contains fenced execution content' "$fixture/output"

reset_record
cat >> "$record" <<'EOF'

```text
./scripts/validate-docs.sh --render-dir /tmp/rendered
```
EOF
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a parameterized command in a generic text block" >&2
  exit 1
fi
grep -Fq 'DR contains fenced execution content' "$fixture/output"

reset_record
cat >> "$record" <<'EOF'

$ ethos prove --json
EOF
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a shell prompt command in a DR" >&2
  exit 1
fi
grep -Fq 'DR contains shell prompt or command invocation' "$fixture/output"

reset_record
python3 - "$record" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
path.write_text(
    path.read_text(encoding="utf-8").replace(
        "- **依据与实现**：", "- **依据与实现**：`openspec validate --all --strict --json`；"
    ),
    encoding="utf-8",
)
PY
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted an inline command invocation in a DR" >&2
  exit 1
fi
grep -Fq 'DR contains inline command invocation' "$fixture/output"

reset_record
cat >> "$record" <<'EOF_INNER'

```text
ethos adopt --apply
```
EOF_INNER
if bash "$fixture/scripts/validate-governance-boundary.sh" >"$fixture/output" 2>&1; then
  echo "boundary validator accepted a current ETHOS invocation in a text fence" >&2
  exit 1
fi
grep -Fq 'DR contains fenced execution content' "$fixture/output"
