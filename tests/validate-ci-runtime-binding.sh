#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BOUND_VERIFIER="bash tools/ci/scripts/with-python-runtime.sh -- bash tools/ci/scripts/run-documentation-verification.sh"

provider_has_bound_verifier() {
  local projection="$1"
  local line
  local normalized

  while IFS= read -r line; do
    normalized="${line#"${line%%[![:space:]]*}"}"
    normalized="${normalized#run: }"
    normalized="${normalized#- }"
    [[ "$normalized" == "$BOUND_VERIFIER" ]] && return 0
  done < "$ROOT/$projection"
  return 1
}

for projection in .github/workflows/docs-verify.yml .gitlab-ci.yml; do
  provider_has_bound_verifier "$projection" || {
    echo "provider projection is missing the bound verifier: $projection" >&2
    exit 1
  }
done

wrapper="$(cat "$ROOT/tools/ci/scripts/with-python-runtime.sh")"
[[ "$wrapper" == *'build/runtime/venv'* ]] || {
  echo "runtime wrapper does not use checkout-scoped state" >&2
  exit 1
}
[[ "$wrapper" == *'python3 -m venv'* ]] || {
  echo "runtime wrapper cannot bootstrap its checked-out interpreter" >&2
  exit 1
}
[[ "$wrapper" == *'ETHOS_RUNTIME_ROOT="$repo_root"'* ]] || {
  echo "runtime wrapper does not bind the current Git root" >&2
  exit 1
}

runtime_root="$(bash "$ROOT/tools/ci/scripts/with-python-runtime.sh" -- python3 - <<'PY'
import os
print(os.environ["ETHOS_RUNTIME_ROOT"])
PY
)"
[[ "$runtime_root" == "$ROOT" ]] || {
  echo "runtime wrapper did not bind the current repository root" >&2
  exit 1
}

if ETHOS_RUNTIME_ROOT="/tmp/another-checkout" \
  bash "$ROOT/tools/ci/scripts/with-python-runtime.sh" -- python3 -c 'pass' >/dev/null 2>&1; then
  echo "runtime wrapper accepted an inherited foreign checkout" >&2
  exit 1
fi

echo "PASS CI runtime binding: GitHub and GitLab use one checkout-scoped verifier"
