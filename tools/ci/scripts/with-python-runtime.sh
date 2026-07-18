#!/usr/bin/env bash
# Bind documentation-validation Python to one disposable environment per checkout.
set -euo pipefail

[[ "${1:-}" != "--" ]] || shift
[[ "$#" -gt 0 ]] || {
  echo "usage: with-python-runtime.sh -- <command> [args...]" >&2
  exit 2
}

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "CI runtime binding requires a Git checkout" >&2
  exit 2
}
cd "$repo_root"

if [[ -n "${ETHOS_RUNTIME_ROOT:-}" && "$ETHOS_RUNTIME_ROOT" != "$repo_root" ]]; then
  echo "refusing a Python runtime inherited from another checkout" >&2
  exit 2
fi

semantic_venv="$repo_root/build/runtime/venv"
if [[ ! -x "$semantic_venv/bin/python3" ]]; then
  command -v python3 >/dev/null || {
    echo "missing required bootstrap command: python3" >&2
    exit 127
  }
  python3 -m venv "$semantic_venv"
fi

export ETHOS_RUNTIME_ROOT="$repo_root"
export PATH="$semantic_venv/bin:$PATH"
exec "$@"
