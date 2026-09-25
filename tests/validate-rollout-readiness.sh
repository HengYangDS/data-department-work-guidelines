#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sandbox="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-rollout-routes.XXXXXX")"
trap 'rm -rf "$sandbox"' EXIT
fixture="$sandbox/repo"
mkdir -p "$fixture/.ethos" "$fixture/scripts"
cp "$ROOT/.ethos/profile.toml" "$fixture/.ethos/profile.toml"
cp "$ROOT/AGENTS.md" "$fixture/AGENTS.md"
cp -R "$ROOT/docs" "$fixture/docs"
cp "$ROOT/scripts/validate-rollout-readiness.sh" "$fixture/scripts/"

cat > "$fixture/README.md" <<'EOF'
# Entry

[Documentation map](docs/README.md)
EOF
bash "$fixture/scripts/validate-rollout-readiness.sh" > "$sandbox/output"

cat > "$fixture/README.md" <<'EOF'
# Entry

[Direct topic](docs/decide.md)
EOF
if bash "$fixture/scripts/validate-rollout-readiness.sh" > "$sandbox/output" 2>&1; then
  echo 'rollout validator accepted a missing documentation-map handoff' >&2
  exit 1
fi
grep -Fq 'missing task routes in README.md: docs/README.md' "$sandbox/output"

cat > "$fixture/README.md" <<'EOF'
# Entry

[Documentation map](docs/README.md)
[Duplicate direct topic](docs/decide.md)
EOF
if bash "$fixture/scripts/validate-rollout-readiness.sh" > "$sandbox/output" 2>&1; then
  echo 'rollout validator accepted a duplicate root topic route' >&2
  exit 1
fi
grep -Fq 'root entry repeats topic routes' "$sandbox/output"

echo 'PASS navigation topology: one root handoff, one topic map'
