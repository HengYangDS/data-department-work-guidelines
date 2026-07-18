#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHANGE="adoption-lifecycle-repair-20260714"
ACTIVE_SCOPE="$ROOT/openspec/changes/$CHANGE/scope.toml"
ARCHIVE_GLOB="$ROOT/openspec/changes/archive/*-$CHANGE/scope.toml"
PROFILE="$ROOT/.ethos/profile.toml"

if [[ -f "$ACTIVE_SCOPE" ]]; then
  SCOPE="$ACTIVE_SCOPE"
  CARRIER="openspec/changes/$CHANGE"
  STATE="active"
else
  shopt -s nullglob
  archive_scopes=("$ROOT"/openspec/changes/archive/*-"$CHANGE"/scope.toml)
  shopt -u nullglob
  if (( ${#archive_scopes[@]} != 1 )); then
    printf '%s\n' "expected exactly one archive scope for $CHANGE; found ${#archive_scopes[@]}" >&2
    exit 1
  fi
  SCOPE="${archive_scopes[0]}"
  CARRIER="${SCOPE#$ROOT/}"
  CARRIER="${CARRIER%/scope.toml}"
  STATE="archived"
fi

python3 - "$PROFILE" "$SCOPE" "$CHANGE" "$CARRIER" "$STATE" <<'PY'
from __future__ import annotations

from pathlib import Path
import sys
import tomllib

profile_path, scope_path = map(Path, sys.argv[1:3])
change, carrier, state = sys.argv[3:]
profile = tomllib.loads(profile_path.read_text(encoding="utf-8"))
scope = tomllib.loads(scope_path.read_text(encoding="utf-8"))
material_paths = profile.get("openspec", {}).get("material_paths")
if not isinstance(material_paths, list) or not material_paths:
    raise SystemExit("profile must declare non-empty [openspec].material_paths")
required_families = {".ethos/**", "docs/**", "evidence/**", "openspec/**", "scripts/**", "tests/**"}
missing_families = required_families.difference(material_paths)
if missing_families:
    raise SystemExit("profile material paths missing: " + ", ".join(sorted(missing_families)))
if set(scope) != {"schema_version", "paths"} or scope.get("schema_version") != 1:
    raise SystemExit("scope companion must contain only schema_version = 1 and paths")
paths = scope.get("paths")
if not isinstance(paths, list) or not paths:
    raise SystemExit("scope companion paths must be a non-empty list")
if any(not isinstance(path, str) or path.startswith("/") for path in paths):
    raise SystemExit("scope companion paths must be portable repository-relative strings")
required_paths = {
    ".ethos/profile.toml",
    "docs/decisions/**",
    "evidence/claims/adoption-lifecycle-repair-20260714.toml",
    "scripts/validate-governance-boundary.sh",
    "tests/validate-openspec-material-scope.sh",
}
if state == "active":
    required_paths.add(f"{carrier}/**")
else:
    required_paths.update(
        {
            "openspec/specs/quality/spec.md",
            "openspec/specs/repository-governance/spec.md",
        }
    )
missing_paths = required_paths.difference(paths)
if missing_paths:
    raise SystemExit("scope companion misses actual change surfaces: " + ", ".join(sorted(missing_paths)))
print(f"PASS material scope shape: one product-defined {state} Change companion")
PY

if [[ "$STATE" == "active" && -n "${ETHOS_ACTOR:-}" && "$(git -C "$ROOT" branch --show-current)" == work/* ]]; then
  positive="$(
    ETHOS_ACTOR="$ETHOS_ACTOR" bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
      docs/governance/ethos.md --editor-root "$ROOT" --require-editor-root --json
  )"
  python3 - "$positive" <<'PY'
import json
import sys

if not json.loads(sys.argv[1]).get("ok"):
    raise SystemExit("covered material path was rejected")
print("PASS material scope positive: covered docs path admitted")
PY

  mkdir -p "$ROOT/build"

  if ETHOS_ACTOR="$ETHOS_ACTOR" bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
    guidelines.md --editor-root "$ROOT" --require-editor-root --json >"$ROOT/build/material-scope-negative.json" 2>&1; then
    echo "uncovered material path was admitted" >&2
    exit 1
  fi
  grep -Fq 'openspec_material_path_uncovered:guidelines.md' "$ROOT/build/material-scope-negative.json"
  echo "PASS material scope negative: uncovered guideline path rejected"
elif [[ "$STATE" == "archived" && -n "${ETHOS_ACTOR:-}" && "$(git -C "$ROOT" branch --show-current)" == work/* ]]; then
  archive_positive="$(
    ETHOS_ACTOR="$ETHOS_ACTOR" bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
      "$CARRIER/scope.toml" \
      openspec/specs/quality/spec.md \
      openspec/specs/repository-governance/spec.md \
      evidence/claims/adoption-lifecycle-repair-20260714.toml \
      evidence/chronicle/adoption-lifecycle-repair-20260714/2026-07-18.md \
      --editor-root "$ROOT" --require-editor-root --json
  )"
  python3 - "$archive_positive" <<'PY'
import json
import sys

if not json.loads(sys.argv[1]).get("ok"):
    raise SystemExit("archive reconciliation surfaces were rejected")
print("PASS archive scope positive: archive result surfaces admitted together")
PY

  mkdir -p "$ROOT/build"

  if ETHOS_ACTOR="$ETHOS_ACTOR" bash "$ROOT/scripts/ethos-repo.sh" lane prewrite \
    "$CARRIER/scope.toml" guidelines.md --editor-root "$ROOT" --require-editor-root --json \
    >"$ROOT/build/material-scope-negative.json" 2>&1; then
    echo "unrelated material path was admitted by archive scope" >&2
    exit 1
  fi
  grep -Fq 'openspec_material_path_uncovered:guidelines.md' "$ROOT/build/material-scope-negative.json"
  echo "PASS archive scope negative: unrelated guideline path rejected"
elif [[ "$STATE" == "archived" ]]; then
  echo "PASS archive scope boundary: no unrelated material-path admission"
else
  echo "SKIP live material scope admission: no owned Work Lane actor"
fi
