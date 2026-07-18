#!/usr/bin/env bash
# Run the provider-neutral documentation verification sequence inside its bound runtime.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "documentation verification requires a Git checkout" >&2
  exit 2
}
cd "$repo_root"

node_modules/.bin/openspec validate --all --strict --json
bash scripts/format-markdown.sh --check
bash scripts/validate-docs.sh
bash scripts/validate-rollout-readiness.sh
bash scripts/validate-governance-boundary.sh
bash scripts/validate-text-layout.sh
bash tests/validate-docs-options.sh
bash tests/validate-governance-boundary.sh
bash tests/validate-push-boundary.sh
bash tests/validate-ci-runtime-binding.sh
bash tests/validate-openspec-material-scope.sh
bash tests/validate-text-layout.sh
