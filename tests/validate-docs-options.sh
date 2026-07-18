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
