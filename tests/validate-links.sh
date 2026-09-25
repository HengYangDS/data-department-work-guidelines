#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sandbox="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-links.XXXXXX")"
fixture="$sandbox/repo"
trap 'rm -rf "$sandbox"' EXIT

mkdir -p "$fixture/scripts" "$fixture/docs" "$fixture/openspec/changes/archive/old"
cp "$ROOT/scripts/validate-links.sh" "$fixture/scripts/"
cat > "$fixture/docs/topic.md" <<'EOF'
# Present
EOF
cat > "$fixture/README.md" <<'EOF'
# Route

[Working topic](docs/topic.md#present)
EOF
cat > "$fixture/openspec/changes/archive/old/spec.md" <<'EOF'
# Historical record

[Former route](../../../../missing.md)
EOF

DDWG_LYCHEE_BIN="$(command -v lychee)" bash "$fixture/scripts/validate-links.sh"

printf '\n[Broken topic](docs/missing.md)\n' >> "$fixture/README.md"
if DDWG_LYCHEE_BIN="$(command -v lychee)" \
  bash "$fixture/scripts/validate-links.sh" >"$fixture/output" 2>&1; then
  echo "link validator accepted a broken current local link" >&2
  exit 1
fi
grep -Fq 'docs/missing.md' "$fixture/output"

cat > "$fixture/README.md" <<'EOF'
# Route

[Bad fragment](docs/topic.md#absent)
EOF
if DDWG_LYCHEE_BIN="$(command -v lychee)" \
  bash "$fixture/scripts/validate-links.sh" >"$fixture/output" 2>&1; then
  echo "link validator accepted a broken current fragment" >&2
  exit 1
fi
grep -Fq 'Cannot find fragment' "$fixture/output"

printf '# Outside\n' > "$sandbox/outside.md"
cat > "$fixture/README.md" <<'EOF'
# Route

[Escaped root](../outside.md)
EOF
if DDWG_LYCHEE_BIN="$(command -v lychee)" \
  bash "$fixture/scripts/validate-links.sh" >"$fixture/output" 2>&1; then
  echo "link validator accepted a local link outside the repository" >&2
  exit 1
fi
grep -Fq 'local link escapes repository root' "$fixture/output"

echo 'PASS offline links: local paths, fragments, root confinement, and archive exclusion'
