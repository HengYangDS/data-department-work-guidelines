#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WRAPPER="$ROOT/scripts/ethos-repo.sh"

[[ -x "$WRAPPER" ]] || {
  echo "missing executable repository-bound ETHOS adapter: $WRAPPER" >&2
  exit 1
}

status_json="$($WRAPPER status --json)"
python3 - "$ROOT" "$status_json" <<'PY'
import json
import sys

expected_root, raw = sys.argv[1:]
payload = json.loads(raw)
actual_root = payload.get("summary", {}).get("root")
if actual_root != expected_root:
    raise SystemExit(
        f"repository-bound ETHOS adapter audited {actual_root!r}; "
        f"expected {expected_root!r}"
    )
PY

if "$WRAPPER" status --root /tmp >/dev/null 2>&1; then
  echo "repository-bound ETHOS adapter accepted a caller-supplied --root" >&2
  exit 1
fi

echo "PASS repository-bound ETHOS adapter audits: $ROOT"
