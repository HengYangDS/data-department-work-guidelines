#!/usr/bin/env bash
# Run the provider-neutral documentation verification sequence inside its bound runtime.
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "documentation verification requires a Git checkout" >&2
  exit 2
}
cd "$repo_root"
export PATH="$repo_root/build/runtime/tool-cache/lychee/0.24.2:$PATH"

hosted_renderer_config="${DDWG_HOSTED_RENDERER_CONFIG:-}"
validate_docs_args=()
case "$hosted_renderer_config" in
  "")
    ;;
  tools/ci/config/mermaid-puppeteer-hosted.json)
    validate_docs_args=(--hosted-renderer-config "$hosted_renderer_config")
    ;;
  *)
    echo "unsupported DDWG_HOSTED_RENDERER_CONFIG: $hosted_renderer_config" >&2
    exit 2
    ;;
esac

node_modules/.bin/openspec validate --all --strict --json
bash scripts/format-markdown.sh --check
bash scripts/validate-docs.sh "${validate_docs_args[@]}"
bash scripts/validate-rollout-readiness.sh
bash scripts/validate-governance-boundary.sh
bash scripts/validate-text-layout.sh
bash tests/validate-docs-options.sh
bash tests/validate-links.sh
bash tests/validate-ethos-profile.sh
bash tests/validate-governance-boundary.sh
bash tests/validate-push-boundary.sh
bash tests/validate-ci-runtime-binding.sh
bash tests/validate-openspec-material-attribution.sh
bash tests/validate-text-layout.sh
