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

python3 - "$ROOT" "$WRAPPER" <<'PY'
import hashlib
from pathlib import Path
import subprocess
import sys
import tomllib

root = Path(sys.argv[1])
wrapper = sys.argv[2]
commands = set()
for path in (root / ".agents/skills").glob("*/package.toml"):
    manifest = tomllib.loads(path.read_text(encoding="utf-8"))
    digest = hashlib.sha256()
    for relative in sorted(manifest["include"]):
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update((path.parent / relative).read_bytes())
        digest.update(b"\0")
    if manifest["expected_digest"] != f"sha256:{digest.hexdigest()}":
        raise SystemExit(f"skill package digest mismatch: {path.parent.name}")
    for capability in manifest.get("capability", []):
        command = capability["command"]
        if command[0] != "ethos":
            raise SystemExit(f"skill capability does not select ETHOS: {capability['id']}")
        commands.add(tuple(command[1:]))

for command in sorted(commands):
    result = subprocess.run(
        ["bash", wrapper, *command, "--help"],
        cwd=root,
        stdin=subprocess.DEVNULL,
        capture_output=True,
        text=True,
        timeout=15,
        check=False,
    )
    if result.returncode:
        raise SystemExit(f"skill capability is not a current command: {' '.join(command)}\n{result.stderr}")
print("PASS skill package bindings: matching digests and current native commands")
PY

echo "PASS repository-bound ETHOS adapter audits: $ROOT"
