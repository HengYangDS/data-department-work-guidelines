#!/usr/bin/env bash
# Exercise the local pre-push boundary without contacting a forge. Git passes
# local/remote ref pairs on stdin; the temporary adapter only records delegated
# destinations, so this regression cannot claim provider publication.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK="$ROOT/.githooks/pre-push"
HEAD="$(git -C "$ROOT" rev-parse HEAD)"

[[ -x "$HOOK" ]] || {
  echo "missing executable pre-push hook: $HOOK" >&2
  exit 1
}

scratch="$(mktemp -d "${TMPDIR:-/tmp}/ddwg-push-boundary.XXXXXX")"
cleanup() {
  python3 - "$scratch" <<'PY'
from pathlib import Path
import shutil
import sys
p = Path(sys.argv[1])
if p.name.startswith("ddwg-push-boundary.") and p.is_dir():
    shutil.rmtree(p)
PY
}
trap cleanup EXIT

adapter="$scratch/ethos-repo.sh"
log="$scratch/delegated-refs.log"
cat > "$adapter" <<'STUB'
#!/usr/bin/env sh
set -eu
printf '%s\n' "$3" >> "$DDWG_PUSH_BOUNDARY_LOG"
STUB
chmod +x "$adapter"

hook_root="$scratch/repository"
mkdir -p "$hook_root/.githooks" "$hook_root/scripts"
ln -s "$HOOK" "$hook_root/.githooks/pre-push"
ln -s "$adapter" "$hook_root/scripts/ethos-repo.sh"
git -C "$hook_root" init -q
git -C "$hook_root" config user.email boundary@example.invalid
git -C "$hook_root" config user.name boundary-test
git -C "$hook_root" config commit.gpgsign false
touch "$hook_root/fixture"
git -C "$hook_root" add fixture
git -C "$hook_root" commit -qm fixture


run_hook() {
  printf '%s\n' "$1" |
    (
      cd "$hook_root"
      DDWG_PUSH_BOUNDARY_LOG="$log" \
        ./.githooks/pre-push origin ignored
    )
}

candidate_destination="0000000000000000000000000000000000000000 $HEAD refs/heads/candidate/dev 0000000000000000000000000000000000000000"
candidate_source="refs/heads/candidate/dev $HEAD refs/heads/dev 0000000000000000000000000000000000000000"
for candidate in "$candidate_destination" "$candidate_source"; do
  if run_hook "$candidate"; then
    echo "candidate/dev push was admitted" >&2
    exit 1
  fi
  [[ ! -e "$log" ]] || {
    echo "candidate/dev reached ETHOS delegation" >&2
    exit 1
  }
done

eligible="0000000000000000000000000000000000000000 $HEAD refs/heads/dev 0000000000000000000000000000000000000000
0000000000000000000000000000000000000000 $HEAD refs/heads/main 0000000000000000000000000000000000000000
0000000000000000000000000000000000000000 $HEAD refs/heads/submit/review 0000000000000000000000000000000000000000"
run_hook "$eligible"
expected="$(printf '%s\n' refs/heads/dev refs/heads/main refs/heads/submit/review)"
actual="$(cat "$log")"
[[ "$actual" == "$expected" ]] || {
  printf 'unexpected delegated refs:\n%s\n' "$actual" >&2
  exit 1
}

echo "PASS push boundary: candidate/dev rejected; eligible refs delegated locally"
