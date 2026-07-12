#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRETTIER="$ROOT/node_modules/.bin/prettier"

[[ -x "$PRETTIER" ]] || {
  echo "missing Prettier; run: (cd \"$ROOT\" && npm ci --ignore-scripts)" >&2
  exit 127
}

cd "$ROOT"
"$PRETTIER" "$@" '**/*.md'
