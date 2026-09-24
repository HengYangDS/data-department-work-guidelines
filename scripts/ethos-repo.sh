#!/usr/bin/env bash
set -euo pipefail

# Bind the installed ETHOS command to this checkout; executable location must
# never select the repository being audited or governed.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

[[ -f "$ROOT/.ethos/profile.toml" ]] || {
  echo "not an ETHOS-adopted repository: $ROOT" >&2
  exit 66
}

command -v ethos >/dev/null || {
  echo "missing required ETHOS command" >&2
  exit 127
}

for argument in "$@"; do
  if [[ "$argument" == "--root" || "$argument" == --root=* ]]; then
    echo "scripts/ethos-repo.sh owns --root; do not supply one" >&2
    exit 2
  fi
done

exec ethos "$@" --root "$ROOT"
