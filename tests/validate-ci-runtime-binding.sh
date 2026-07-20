#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GITHUB_WORKFLOW="$ROOT/.github/workflows/docs-verify.yml"
GITLAB_WORKFLOW="$ROOT/.gitlab-ci.yml"
BOUND_VERIFIER="bash tools/ci/scripts/with-python-runtime.sh -- bash tools/ci/scripts/run-documentation-verification.sh"
HOSTED_RENDERER_CONFIG="tools/ci/config/mermaid-puppeteer-hosted.json"
HOSTED_RENDERER_CONFIG_PATH="$ROOT/$HOSTED_RENDERER_CONFIG"

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


line_number() {
  local pattern="$1"
  local path="$2"

  grep -n -m1 -E "$pattern" "$path" | cut -d: -f1
}


require_before() {
  local earlier="$1"
  local later="$2"
  local description="$3"

  [[ -n "$earlier" && -n "$later" && "$earlier" -lt "$later" ]] || {
    echo "$description" >&2
    exit 1
  }
}

for projection in .github/workflows/docs-verify.yml .gitlab-ci.yml; do
  provider_has_bound_verifier "$projection" || {
    echo "provider projection is missing the bound verifier: $projection" >&2
    exit 1
  }
done

if grep -Eq '^    container:' "$GITHUB_WORKFLOW"; then
  echo 'GitHub workflow must use runner-native checkout, not a job container' >&2
  exit 1
fi

github_checkout_line="$(line_number 'uses: actions/checkout@v4' "$GITHUB_WORKFLOW")"
github_runtime_line="$(line_number 'Select project-local runner runtimes' "$GITHUB_WORKFLOW")"
github_first_run_line="$(line_number '^      - name: ' "$GITHUB_WORKFLOW")"
github_install_line="$(line_number 'Install locked documentation tools' "$GITHUB_WORKFLOW")"
require_before "$github_checkout_line" "$github_first_run_line" \
  'GitHub checkout must precede every runtime command'
require_before "$github_checkout_line" "$github_runtime_line" \
  'GitHub checkout must precede project-local runtime selection'
require_before "$github_runtime_line" "$github_install_line" \
  'GitHub must select project-local runtimes before npm install'
for required_label in self-hosted macOS ARM64; do
  grep -Fq -- "- $required_label" "$GITHUB_WORKFLOW" || {
    echo "GitHub workflow must require the $required_label runner label" >&2
    exit 1
  }
done
grep -Fq '${{ vars.DDWG_GITHUB_RUNNER_LABEL }}' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must select this repository runner through its repository variable' >&2
  exit 1
}
grep -Fq "github.event_name != 'pull_request'" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must reject untrusted fork pull requests on the local runner' >&2
  exit 1
}
grep -Fq 'github.event.pull_request.head.repo.full_name == github.repository' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must permit only same-repository pull requests on the local runner' >&2
  exit 1
}
if grep -Eq 'ubuntu-latest|actions/setup-node|browser-actions/setup-chrome|apt-get|sudo ' "$GITHUB_WORKFLOW"; then
  echo 'GitHub workflow must not depend on a hosted Linux image or provision system runtimes' >&2
  exit 1
fi
grep -Fq "printf '%s\\n' '/opt/homebrew/opt/node@22/bin' >> \"\$GITHUB_PATH\"" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must expose the project-local Node 22 runtime' >&2
  exit 1
}
grep -Fq "/opt/homebrew/opt/node@22/bin/node --version | grep -Eq '^v22\\.'" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must verify the selected Node 22 runtime' >&2
  exit 1
}
grep -Fq 'PUPPETEER_EXECUTABLE_PATH: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must bind Puppeteer to the runner-local Chrome path' >&2
  exit 1
}
grep -Fq "DDWG_HOSTED_RENDERER_CONFIG: $HOSTED_RENDERER_CONFIG" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must select the canonical hosted renderer config' >&2
  exit 1
}

gitlab_install_line="$(line_number 'apt-get install' "$GITLAB_WORKFLOW")"
gitlab_verifier_line="$(line_number 'bash tools/ci/scripts/with-python-runtime\.sh' "$GITLAB_WORKFLOW")"
require_before "$gitlab_install_line" "$gitlab_verifier_line" \
  'GitLab must install runtime prerequisites before the bound verifier'
grep -Eq '^  tags:$' "$GITLAB_WORKFLOW" || {
  echo 'GitLab workflow must explicitly select its dedicated runner tag' >&2
  exit 1
}
grep -Eq '^    - ddwg-documentation-ci$' "$GITLAB_WORKFLOW" || {
  echo 'GitLab workflow must select the ddwg-documentation-ci runner tag' >&2
  exit 1
}
grep -Eq 'apt-get install .*\bgit\b' "$GITLAB_WORKFLOW" || {
  echo 'GitLab runtime prerequisites must install git' >&2
  exit 1
}
for package in python3 python3-venv chromium; do
  grep -Eq "apt-get install .*\\b$package\\b" "$GITLAB_WORKFLOW" || {
    echo "GitLab runtime prerequisites must install $package" >&2
    exit 1
  }
done
grep -Fq "DDWG_HOSTED_RENDERER_CONFIG: \"$HOSTED_RENDERER_CONFIG\"" "$GITLAB_WORKFLOW" || {
  echo 'GitLab workflow must select the canonical hosted renderer config' >&2
  exit 1
}

if grep -Fq -- '--no-sandbox' "$GITHUB_WORKFLOW" "$GITLAB_WORKFLOW"; then
  echo 'provider workflows must not inline the hosted Chrome compatibility argument' >&2
  exit 1
fi

python3 - "$HOSTED_RENDERER_CONFIG_PATH" <<'PY'
from pathlib import Path
import json
import sys

path = Path(sys.argv[1])
if not path.is_file():
    raise SystemExit("missing canonical hosted renderer config")
if json.loads(path.read_text(encoding="utf-8")) != {"args": ["--no-sandbox"]}:
    raise SystemExit("hosted renderer config is not the narrow expected payload")
PY

wrapper="$(cat "$ROOT/tools/ci/scripts/with-python-runtime.sh")"
[[ "$wrapper" == *'build/runtime/venv'* ]] || {
  echo 'runtime wrapper does not use checkout-scoped state' >&2
  exit 1
}
[[ "$wrapper" == *'python3 -m venv'* ]] || {
  echo 'runtime wrapper cannot bootstrap its checked-out interpreter' >&2
  exit 1
}
[[ "$wrapper" == *'ETHOS_RUNTIME_ROOT="$repo_root"'* ]] || {
  echo 'runtime wrapper does not bind the current Git root' >&2
  exit 1
}

runtime_root="$(bash "$ROOT/tools/ci/scripts/with-python-runtime.sh" -- python3 - <<'PY'
import os
print(os.environ["ETHOS_RUNTIME_ROOT"])
PY
)"
[[ "$runtime_root" == "$ROOT" ]] || {
  echo 'runtime wrapper did not bind the current repository root' >&2
  exit 1
}

if ETHOS_RUNTIME_ROOT="/tmp/another-checkout" \
  bash "$ROOT/tools/ci/scripts/with-python-runtime.sh" -- python3 -c 'pass' >/dev/null 2>&1; then
  echo 'runtime wrapper accepted an inherited foreign checkout' >&2
  exit 1
fi

verifier="$(cat "$ROOT/tools/ci/scripts/run-documentation-verification.sh")"
[[ "$verifier" == *'DDWG_HOSTED_RENDERER_CONFIG'* ]] || {
  echo 'shared verifier does not own the hosted renderer config boundary' >&2
  exit 1
}
[[ "$verifier" == *'--hosted-renderer-config'* ]] || {
  echo 'shared verifier does not pass the hosted renderer selection to the validator' >&2
  exit 1
}
[[ "$verifier" == *'validate-rollout-readiness.sh "${validate_docs_args[@]}"'* ]] || {
  echo 'shared verifier does not preserve the hosted renderer selection for rollout validation' >&2
  exit 1
}

fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-ci-runtime-binding.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT
mkdir -p "$fixture/tools/ci/scripts" "$fixture/node_modules/.bin" "$fixture/scripts"
git init --quiet "$fixture"
cp "$ROOT/tools/ci/scripts/run-documentation-verification.sh" \
  "$fixture/tools/ci/scripts/run-documentation-verification.sh"
chmod +x "$fixture/tools/ci/scripts/run-documentation-verification.sh"
touch "$fixture/node_modules/.bin/openspec"
chmod +x "$fixture/node_modules/.bin/openspec"
for script in format-markdown.sh validate-docs.sh validate-rollout-readiness.sh \
  validate-governance-boundary.sh validate-text-layout.sh; do
  cat > "$fixture/scripts/$script" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s:%s\n' "$(basename "$0")" "$*" >> "$DDWG_VERIFIER_CALLS"
EOF
  chmod +x "$fixture/scripts/$script"
done
for script in validate-docs-options.sh validate-governance-boundary.sh \
  validate-push-boundary.sh validate-ci-runtime-binding.sh \
  validate-openspec-material-scope.sh validate-text-layout.sh; do
  cat > "$fixture/tests-$script" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s:%s\n' "$(basename "$0")" "$*" >> "$DDWG_VERIFIER_CALLS"
EOF
  mkdir -p "$fixture/tests"
  mv "$fixture/tests-$script" "$fixture/tests/$script"
  chmod +x "$fixture/tests/$script"
done
cat > "$fixture/node_modules/.bin/openspec" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf 'openspec:%s\n' "$*" >> "$DDWG_VERIFIER_CALLS"
EOF
calls="$fixture/calls"
(
  cd "$fixture"
  DDWG_HOSTED_RENDERER_CONFIG="$HOSTED_RENDERER_CONFIG" \
    DDWG_VERIFIER_CALLS="$calls" \
    bash tools/ci/scripts/run-documentation-verification.sh
)
expected_option="--hosted-renderer-config $HOSTED_RENDERER_CONFIG"
grep -Fqx "validate-docs.sh:$expected_option" "$calls" || {
  cat "$calls" >&2
  echo 'shared verifier did not send the hosted renderer selection to direct validation' >&2
  exit 1
}
grep -Fqx "validate-rollout-readiness.sh:$expected_option" "$calls" || {
  cat "$calls" >&2
  echo 'shared verifier did not send the hosted renderer selection to rollout validation' >&2
  exit 1
}
if (
  cd "$fixture"
  DDWG_HOSTED_RENDERER_CONFIG='tools/ci/config/foreign.json' \
    DDWG_VERIFIER_CALLS="$fixture/rejected-calls" \
    bash tools/ci/scripts/run-documentation-verification.sh
) >"$fixture/rejected-output" 2>&1; then
  echo 'shared verifier unexpectedly accepted an unsupported hosted renderer selection' >&2
  exit 1
fi
grep -Fqx 'unsupported DDWG_HOSTED_RENDERER_CONFIG: tools/ci/config/foreign.json' \
  "$fixture/rejected-output" || {
  cat "$fixture/rejected-output" >&2
  echo 'shared verifier did not reject unsupported hosted renderer selection' >&2
  exit 1
}
[[ ! -e "$fixture/rejected-calls" ]] || {
  cat "$fixture/rejected-calls" >&2
  echo 'shared verifier invoked validation after unsupported renderer selection' >&2
  exit 1
}

if command -v actionlint >/dev/null; then
  actionlint "$GITHUB_WORKFLOW"
fi
if command -v yamllint >/dev/null; then
  yamllint -d '{extends: default, rules: {document-start: disable, line-length: disable, truthy: disable}}' \
    "$GITHUB_WORKFLOW" "$GITLAB_WORKFLOW"
fi

echo 'PASS CI runtime binding: both providers use one verifier and one narrow hosted renderer config'
