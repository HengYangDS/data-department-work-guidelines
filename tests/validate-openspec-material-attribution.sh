#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHANGE="${ETHOS_CHANGE:-proof-throughput}"
PROFILE="$ROOT/.ethos/profile.toml"
ACTIVE_CHANGE="$ROOT/openspec/changes/$CHANGE"

python3 - "$PROFILE" "$ACTIVE_CHANGE" <<'PY'
from __future__ import annotations

from pathlib import Path
import sys
import tomllib

profile_path = Path(sys.argv[1])
active_change = Path(sys.argv[2])
profile = tomllib.loads(profile_path.read_text(encoding="utf-8"))
material_paths = profile.get("openspec", {}).get("material_paths")
if not isinstance(material_paths, list) or not material_paths:
    raise SystemExit("profile must declare non-empty [openspec].material_paths")
if len(material_paths) != len(set(material_paths)):
    raise SystemExit("profile material paths must be unique")
required = {
    ".agents/**",
    ".ethos/**",
    ".github/**",
    "AGENTS.md",
    "CHANGELOG.md",
    "docs/**",
    "evidence/**",
    "guidelines.md",
    "openspec/**",
    "scripts/**",
    "tests/**",
    "tools/ci/**",
}
missing = required.difference(material_paths)
if missing:
    raise SystemExit("profile material paths missing: " + ", ".join(sorted(missing)))
if active_change.is_dir() and (active_change / "scope.toml").exists():
    raise SystemExit("active Change must not carry a private scope.toml")
print("PASS material attribution declaration: profile-owned paths, no private scope carrier")

archive_root = profile_path.parents[1] / "openspec" / "changes" / "archive"
canonical = {
    "2026-07-18-adopter-real-lifecycle-validation",
    "2026-07-18-adoption-lifecycle-repair",
    "2026-07-18-ci-checkout-runtime-repair",
    "2026-07-18-ci-mermaid-renderer-sandbox-repair",
    "2026-07-18-ci-mermaid-rollout-forwarding-repair",
    "2026-07-18-work-lane-residue-disposition",
}
missing_archives = sorted(name for name in canonical if not (archive_root / name).is_dir())
if missing_archives:
    raise SystemExit("archive identity normalization mismatch: missing=" + ",".join(missing_archives))
print("PASS archive identities: six canonical historical carriers remain intact")

PY

if [[ -d "$ACTIVE_CHANGE" && -n "${ETHOS_ACTOR:-}" && "$(git -C "$ROOT" branch --show-current)" == work/* ]]; then
  positive="$({
    ETHOS_CHANGE="$CHANGE" ETHOS_ACTOR="$ETHOS_ACTOR" \
      bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
      docs/governance/ethos.md \
      --editor-root "$ROOT" \
      --require-editor-root \
      --json
  })"
  python3 - "$positive" "$CHANGE" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
change = sys.argv[2]
scope = payload.get("data", {}).get("material_scope", {})
owners = [item.get("name") for item in scope.get("changes", [])]
covered = {
    item.get("path"): item.get("changes") for item in scope.get("covered_paths", [])
}
if payload.get("verdict") != "pass" or scope.get("state") != "attributed":
    raise SystemExit("material path was not attributed by prewrite")
if owners != [change] or covered.get("docs/governance/ethos.md") != [change]:
    raise SystemExit("prewrite attributed the material path to the wrong Change")
print("PASS material attribution admission: selected active Change owns the path")
PY

  negative_change="missing-material-owner"
  negative_output="$(mktemp "${TMPDIR:-/tmp}/ddwg-material-attribution.XXXXXX")"
  trap 'rm -f "$negative_output"' EXIT
  if ETHOS_CHANGE="$negative_change" ETHOS_ACTOR="$ETHOS_ACTOR" \
    bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
      docs/governance/ethos.md \
      --editor-root "$ROOT" \
      --require-editor-root \
      --json >"$negative_output" 2>&1; then
    echo "prewrite accepted an explicitly missing Change" >&2
    exit 1
  fi
  python3 - "$negative_output" "$negative_change" <<'PY'
from pathlib import Path
import json
import sys

payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
expected = f"openspec_requested_change_missing:{sys.argv[2]}"
if expected not in payload.get("required_gaps", []):
    raise SystemExit("prewrite did not preserve the missing-Change diagnostic")
print("PASS material attribution negative: missing Change fails closed")
PY

  plan="$({
    ETHOS_CHANGE="$CHANGE" ETHOS_ACTOR="$ETHOS_ACTOR" \
      bash "$ROOT/scripts/ethos-repo.sh" plan --changed --json
  })"
  if [[ "$(python3 -c 'import json, sys; print(json.loads(sys.argv[1])["state"])' "$plan")" == "no_changes" ]]; then
    python3 - "$plan" <<'PY'
import json
import sys

result = json.loads(sys.argv[1])
if result.get("verdict") != "pass" or result.get("summary", {}).get("changed") is not False:
    raise SystemExit("clean planning did not report an honest no-changes result")
if result.get("data", {}).get("path_attributions"):
    raise SystemExit("clean planning invented material-path attribution")
print("PASS clean planning: no changed paths; changed-path cases are not asserted")
PY
  else
    python3 - "$plan" "$CHANGE" <<'PY'
from pathlib import Path
import json
import sys

result = json.loads(sys.argv[1])
change = sys.argv[2]
if result.get("verdict") != "pass":
    raise SystemExit("changed planning rejected the selected active Change")
data = result.get("data", {})
if artifact := data.get("artifact_reference"):
    data = json.loads(Path(artifact["path"]).read_text(encoding="utf-8")).get("data", {})
attributions = data.get("path_attributions", [])
if not attributions or any(item.get("change_id") != change for item in attributions):
    raise SystemExit("changed planning did not attribute every path to the selected Change")
print("PASS material attribution plan: all changed paths share one active Change")
PY

    ETHOS_CHANGE="$negative_change" ETHOS_ACTOR="$ETHOS_ACTOR" \
      bash "$ROOT/scripts/ethos-repo.sh" plan --changed --json \
        >"$negative_output" 2>&1 || true
    python3 - "$negative_output" "$negative_change" <<'PY'
from pathlib import Path
import json
import sys

payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
expected = f"openspec_requested_change_missing:{sys.argv[2]}"
if payload.get("verdict") != "block" or expected not in payload.get("required_gaps", []):
    raise SystemExit("changed planning did not preserve the missing-Change diagnostic")
print("PASS material attribution plan negative: missing Change fails closed")
PY
  fi

  proof="$(bash "$ROOT/scripts/ethos-repo.sh" prove --scope docs --change "$CHANGE" --json)"
  python3 - "$proof" "$CHANGE" <<'PY'
import json
import sys

payload = json.loads(sys.argv[1])
data = payload.get("data", {})
if payload.get("verdict") != "pass" or data.get("executed"):
    raise SystemExit("proof readiness must accept the selected Change without executing gates")
if data.get("openspec_lifecycle", {}).get("change") != sys.argv[2]:
    raise SystemExit("proof readiness selected a different Change")
print("PASS proof readiness: selected active Change is preserved")
PY
  if bash "$ROOT/scripts/ethos-repo.sh" prove --scope docs \
    --change "$negative_change" --json >"$negative_output" 2>&1; then
    echo "proof readiness accepted an explicitly missing Change" >&2
    exit 1
  fi
  python3 - "$negative_output" "$negative_change" <<'PY'
import json
from pathlib import Path
import sys

payload = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
expected = f"openspec_requested_change_missing:{sys.argv[2]}"
if payload.get("verdict") != "block" or expected not in payload.get("required_gaps", []):
    raise SystemExit("proof readiness did not preserve the missing-Change diagnostic")
print("PASS proof readiness negative: missing Change fails closed")
PY
else
  echo "SKIP live material attribution: no owned active Change lane"
fi
