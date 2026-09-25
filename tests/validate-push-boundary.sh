#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK="$ROOT/.githooks/pre-push"
fixture="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-pre-push.XXXXXX")"
trap 'rm -rf "$fixture"' EXIT

git init -q "$fixture/repo"
git -C "$fixture/repo" config user.email 'validation@example.invalid'
git -C "$fixture/repo" config user.name 'DDWG validation'
git -C "$fixture/repo" config commit.gpgsign false
printf 'fixture\n' > "$fixture/repo/README.md"
git -C "$fixture/repo" add README.md
git -C "$fixture/repo" commit -qm 'fixture'
head="$(git -C "$fixture/repo" rev-parse HEAD)"

mkdir -p "$fixture/bin" "$fixture/repo/scripts"
cat > "$fixture/bin/ethos" <<'EOF'
#!/usr/bin/env sh
exit 0
EOF
chmod +x "$fixture/bin/ethos"

cat > "$fixture/repo/scripts/ethos-repo.sh" <<'EOF'
#!/usr/bin/env sh
set -eu
printf '%s\n' "$3" >> "$DDWG_DELEGATED_REFS"
EOF
chmod 644 "$fixture/repo/scripts/ethos-repo.sh"

run_hook() {
  ref="$1"
  (
    cd "$fixture/repo"
    printf 'refs/heads/local %s %s %040d\n' "$head" "$ref" 0 |
      DDWG_DELEGATED_REFS="$fixture/delegated" PATH="$fixture/bin:$PATH" "$HOOK"
  )
}

for ref in refs/heads/dev refs/heads/main refs/heads/proposal/review; do
  run_hook "$ref"
done

for ref in refs/heads/work/forbidden refs/heads/feature/forbidden refs/heads/submit/old-name; do
  if run_hook "$ref" >"$fixture/output" 2>&1; then
    echo "pre-push accepted forbidden ref: $ref" >&2
    exit 1
  fi
  grep -Fq "remote publication rejects $ref" "$fixture/output"
done

if run_hook refs/heads/candidate/dev >"$fixture/output" 2>&1; then
  echo 'pre-push accepted candidate/dev as a remote target' >&2
  exit 1
fi
grep -Fq 'candidate/dev is local-only and must not be pushed' "$fixture/output"

(
  cd "$fixture/repo"
  if printf 'refs/heads/candidate/dev %s refs/heads/dev %040d\n' "$head" 0 |
    DDWG_DELEGATED_REFS="$fixture/delegated" PATH="$fixture/bin:$PATH" "$HOOK" >"$fixture/output" 2>&1; then
    echo 'pre-push accepted candidate/dev as a local source' >&2
    exit 1
  fi
)
grep -Fq 'candidate/dev is local-only and must not be pushed' "$fixture/output"

expected="$(printf '%s\n' refs/heads/dev refs/heads/main refs/heads/proposal/review)"
actual="$(cat "$fixture/delegated")"
[[ "$actual" == "$expected" ]] || {
  printf 'unexpected ETHOS delegation:\n%s\n' "$actual" >&2
  exit 1
}

python3 - "$ROOT/.ethos/workspace.toml" <<'PY'
from pathlib import Path
import sys
import tomllib

policy = tomllib.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["branch_roles"]
if policy["proposal_branch_prefix"] != "proposal/":
    raise SystemExit("proposal branch policy must use proposal/*")
PY

echo 'PASS pre-push boundary: candidate/dev and submit/* rejected; dev, main, proposal/* only'
