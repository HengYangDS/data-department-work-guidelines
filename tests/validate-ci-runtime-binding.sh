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

  grep -n -m1 -E "$pattern" "$path" | cut -d: -f1 || true
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

grep -Fq 'runs-on: ubuntu-latest' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must use a GitHub-hosted Ubuntu runner' >&2
  exit 1
}
grep -Fqx "      - 'proposal/**'" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must verify proposal/* branches' >&2
  exit 1
}
if grep -Fq "'submit/**'" "$GITHUB_WORKFLOW"; then
  echo 'GitHub workflow must not retain the retired submit/* trigger' >&2
  exit 1
fi
for forbidden in self-hosted macOS ARM64 DDWG_GITHUB_RUNNER_LABEL /opt/homebrew '/Applications/Google Chrome' 'github.event.pull_request.head.repo.full_name'; do
  if grep -Fq "$forbidden" "$GITHUB_WORKFLOW"; then
    echo "GitHub workflow retains local-runner residue: $forbidden" >&2
    exit 1
  fi
done

github_checkout_line="$(line_number 'uses: actions/checkout@[0-9a-f]{40}([[:space:]]|$)' "$GITHUB_WORKFLOW")"
github_node_line="$(line_number 'uses: actions/setup-node@[0-9a-f]{40}([[:space:]]|$)' "$GITHUB_WORKFLOW")"
github_chrome_line="$(line_number 'uses: browser-actions/setup-chrome@[0-9a-f]{40}([[:space:]]|$)' "$GITHUB_WORKFLOW")"
github_install_line="$(line_number 'Install locked documentation tools' "$GITHUB_WORKFLOW")"
github_lychee_line="$(line_number 'Install pinned lychee' "$GITHUB_WORKFLOW")"
github_verify_line="$(line_number 'Verify documentation and governance boundaries' "$GITHUB_WORKFLOW")"
require_before "$github_checkout_line" "$github_node_line" \
  'GitHub checkout must precede Node setup'
require_before "$github_node_line" "$github_chrome_line" \
  'GitHub Node setup must precede Chrome setup'
require_before "$github_chrome_line" "$github_install_line" \
  'GitHub Chrome setup must precede npm install'
require_before "$github_install_line" "$github_verify_line" \
  'GitHub npm install must precede verification'
require_before "$github_lychee_line" "$github_verify_line" \
  'GitHub pinned lychee setup must precede verification'
grep -Fq 'run: bash tools/ci/scripts/install-lychee.sh' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must use the shared pinned lychee bootstrap' >&2
  exit 1
}
grep -Eq '^          node-version: 22$' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must explicitly select Node 22' >&2
  exit 1
}
grep -Eq '^        id: chrome$' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must expose the managed Chrome output' >&2
  exit 1
}
grep -Fq 'PUPPETEER_EXECUTABLE_PATH: ${{ steps.chrome.outputs.chrome-path }}' "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must bind Puppeteer to the Chrome Action output' >&2
  exit 1
}
grep -Fq "DDWG_HOSTED_RENDERER_CONFIG: $HOSTED_RENDERER_CONFIG" "$GITHUB_WORKFLOW" || {
  echo 'GitHub workflow must select the canonical hosted renderer config' >&2
  exit 1
}

gitlab_install_line="$(line_number 'apt-get install' "$GITLAB_WORKFLOW")"
gitlab_lychee_line="$(line_number 'bash tools/ci/scripts/install-lychee\.sh' "$GITLAB_WORKFLOW")"
gitlab_verifier_line="$(line_number 'bash tools/ci/scripts/with-python-runtime\.sh' "$GITLAB_WORKFLOW")"
require_before "$gitlab_install_line" "$gitlab_verifier_line" \
  'GitLab must install runtime prerequisites before the bound verifier'
require_before "$gitlab_install_line" "$gitlab_lychee_line" \
  'GitLab must install download prerequisites before pinned lychee'
require_before "$gitlab_lychee_line" "$gitlab_verifier_line" \
  'GitLab pinned lychee setup must precede verification'
grep -Eq '^  tags:$' "$GITLAB_WORKFLOW" || {
  echo 'GitLab workflow must explicitly select its dedicated runner tag' >&2
  exit 1
}
grep -Eq '^    - ci-linux-arm64-docker$' "$GITLAB_WORKFLOW" || {
  echo 'GitLab workflow must select the ci-linux-arm64-docker runner tag' >&2
  exit 1
}
if grep -Fq 'ddwg-documentation-ci' "$GITLAB_WORKFLOW"; then
  echo 'GitLab workflow retains the obsolete runner tag' >&2
  exit 1
fi
for package in git python3 python3-venv chromium curl ca-certificates; do
  grep -Eq "apt-get install .*\\b$package\\b" "$GITLAB_WORKFLOW" || {
    echo "GitLab runtime prerequisites must install $package" >&2
    exit 1
  }
done

bootstrap="$ROOT/tools/ci/scripts/install-lychee.sh"
[[ -f "$bootstrap" ]] || {
  echo 'missing pinned lychee bootstrap' >&2
  exit 1
}
[[ "$(bash "$bootstrap" --print-spec x86_64)" == *'1f4e0ef7f6554a6ed33dd7ac144fb2e1bbed98598e7af973042fc5cd43951c9a'* ]] || {
  echo 'x86_64 lychee release checksum is not pinned' >&2
  exit 1
}
[[ "$(bash "$bootstrap" --print-spec aarch64)" == *'91a7bd65685da41b90ccb9bc867a3d649a7818042dae04ff405e55a25bddee4c'* ]] || {
  echo 'aarch64 lychee release checksum is not pinned' >&2
  exit 1
}
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
[[ "$verifier" == *'bash scripts/validate-rollout-readiness.sh'* ]] || {
  echo 'shared verifier does not run the independent navigation check' >&2
  exit 1
}
[[ "$verifier" == *'bash tests/validate-rollout-readiness.sh'* ]] || {
  echo 'shared verifier does not test the navigation boundary' >&2
  exit 1
}

fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-ci-runtime-binding.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT
mkdir -p "$fixture/tools/ci/scripts" "$fixture/node_modules/.bin" "$fixture/scripts"
git init --quiet "$fixture"
cp "$ROOT/tools/ci/scripts/run-documentation-verification.sh" \
  "$fixture/tools/ci/scripts/run-documentation-verification.sh"
chmod +x "$fixture/tools/ci/scripts/run-documentation-verification.sh"
for script in format-markdown.sh validate-docs.sh validate-rollout-readiness.sh \
  validate-governance-boundary.sh validate-text-layout.sh; do
  cat > "$fixture/scripts/$script" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s:%s\n' "$(basename "$0")" "$*" >> "$DDWG_VERIFIER_CALLS"
EOF
  chmod +x "$fixture/scripts/$script"
done
for script in validate-docs-options.sh validate-links.sh validate-ethos-profile.sh validate-governance-boundary.sh \
  validate-rollout-readiness.sh \
  validate-push-boundary.sh validate-ci-runtime-binding.sh \
  validate-openspec-material-attribution.sh validate-text-layout.sh; do
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
chmod +x "$fixture/node_modules/.bin/openspec"
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
grep -Fqx 'validate-rollout-readiness.sh:' "$calls" || {
  cat "$calls" >&2
  echo 'shared verifier unnecessarily rendered documentation during navigation validation' >&2
  exit 1
}
[[ "$(grep -Fxc 'validate-rollout-readiness.sh:' "$calls")" -eq 2 ]] || {
  cat "$calls" >&2
  echo 'shared verifier did not run both navigation validation and its regression' >&2
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

echo 'PASS CI runtime binding: GitHub hosted and GitLab tagged projections share one verifier'
